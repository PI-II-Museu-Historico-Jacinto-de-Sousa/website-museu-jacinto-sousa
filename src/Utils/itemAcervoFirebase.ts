/* utilitário contendo todos os métodos utilizados em itens do acervo gerenciados com firebase */

import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { FirebaseError } from "firebase/app";
import { Colecao } from "../interfaces/Colecao";

async function getImagemItemAcervo(
  storageRef: StorageReference
): Promise<Imagem> {
  const url = await getDownloadURL(storageRef).catch(() => {
    throw new FirebaseError("not-found", "Imagem não encontrada");
  });
  const metadata = await getMetadata(storageRef).catch(() => {
    throw new FirebaseError("not-found", "Metadados não encontrados");
  });
  const imagem = {
    src: url,
    title: metadata?.name,
    alt:
      metadata?.customMetadata?.alt === undefined
        ? ""
        : metadata.customMetadata.alt,
  };
  return imagem;
}

const getItemAcervo = async (fullPath: string) => {
  try {
    const docRef: DocumentReference = doc(db, fullPath);
    const docSnap = await getDoc(docRef).catch(() => {
      throw new FirebaseError("not-found", "Erro ao buscar documento");
    });
    if (!docSnap.exists()) {
      throw new FirebaseError("not-found", "Documento não encontrado");
    } else {
      const dataMuseu = docSnap.data();
      dataMuseu.id = docRef.path;
      const imagesRef = dataMuseu.imagens as string[];
      for (let i = 0; i < imagesRef.length; i++) {
        const storageRef = ref(storage, imagesRef[i]);
        dataMuseu.imagens[i] = await getImagemItemAcervo(storageRef).catch(
          () => {
            throw new FirebaseError("not-found", "Erro ao buscar imagem");
          }
        );
      }
      return dataMuseu as ItemAcervo;
    }
  } catch (error) {
    console.log(error)
    throw new FirebaseError("permission-denied", "Acesso negado");
  }
};

/** Método para adicionar um item à coleção acervo no firestore, as imagens de um item são as referências para o arquivo no storage */
export const adicionarItemAcervo = async (
  itemAcervo: ItemAcervo,
  colecao: Colecao
): Promise<boolean> => {
  //subcoleção do acervo onde o item será incluido
  if (colecao.privado && !itemAcervo.privado) {
    throw new Error(
      "Não é possível adicionar um item público a uma coleção privada"
    );
  }
  if (colecao.id === undefined) {
    throw new Error("Coleção inválida");
  }
  const itemPrivacidade = itemAcervo.privado ? "privado" : "publico";
  const path =
    colecao.id + (colecao.privado ? "/itens/" : "/" + itemPrivacidade);

  try {
    let imagesRef: string[] = [];
    if (itemAcervo.imagens && itemAcervo.imagens.length > 0) {
      imagesRef = await adicionarImagens(itemAcervo.imagens).catch((error) => {
        throw new Error(error);
      });
    }
    //item enviado utiliza referências das imagens no storage
    const sendingItemAcervo = { ...itemAcervo, imagens: imagesRef };
    const documentReference = await addDoc(
      collection(db, path),
      sendingItemAcervo
    ).catch((error) => {
      throw new Error(error);
    });
    return documentReference.id !== undefined;
  } catch (error) {
    const errorMessage = [
      "Erro ao adicionar item ao acervo",
      (error as Error).message,
    ].join("\n");
    throw new Error(errorMessage);
  }
};

const adicionarImagens = async (imagens: Imagem[]) => {
  try {
    const resultRefs = Promise.all(
      imagens.map(async (imagem) => {
        if (typeof imagem.src === "string") {
          throw new Error("Imagem adicionada deve ser um arquivo");
        }
        let storageRef;

        if (!imagem.title.includes("images/")) {
          storageRef = ref(storage, "images/" + imagem.title);
        } else {
          storageRef = ref(storage, imagem.title);
        }
        const metadata = {
          customMetadata: {
            alt: imagem.alt,
          },
        };

        const uploadResult = await uploadBytes(
          storageRef,
          imagem.src as unknown as File,
          metadata
        ).catch(() => {
          throw new Error(`Imagem ${imagem.title} não pôde ser adicionada`);
        });
        return uploadResult.ref.fullPath;
      })
    );
    return resultRefs;
  } catch (error) {
    throw new Error("Erro ao adicionar imagens");
  }
};

const moveItemToCollection = async (
  itemData: Omit<ItemAcervo, "imagens"> & { imagens: string[] },
  oldPath: string,
  newPath: string
) => {
  try {
    const oldDocRef = doc(db, oldPath);
    const newDocRef = doc(db, newPath + "/" + oldDocRef.id);

    // Add the item to the new collection
    await setDoc(newDocRef, itemData).catch(() => {
      throw new FirebaseError("not-found", "Erro ao mover documento");
    });

    // Remove the item from the old collection
    await deleteDoc(oldDocRef).catch(() => {
      throw new FirebaseError("not-found", "Erro ao mover documento");
    });
    return newDocRef.path;
  } catch (error) {
    throw new Error("Erro ao mover documento");
  }
};

const updateItemAcervo = async (itemAcervo: ItemAcervo, colecao: Colecao) => {
  try {
    if (itemAcervo.id === undefined) {
      throw new Error("ID nulo");
    }
    const docRef = doc(db, itemAcervo.id);
    const itemSelecionado = (await getDoc(docRef)).data();
    if (itemSelecionado === undefined) {
      throw new FirebaseError("not-found", "Documento não encontrado");
    }
    // Imagens novas sao imagens com src do tipo File que nao tem a referencia (title)
    // salva no item selecionado
    const imagensNovas: Imagem[] = [];
    for (const imagem of itemAcervo.imagens) {
      if (imagem.src instanceof File) {
        if (
          itemSelecionado?.imagens.some(
            (imgName: string) => imgName === "images/" + imagem.title
          )
        ) {
          throw new Error("Imagem já adicionada ao item");
        }

        imagensNovas.push(imagem);
      }
    }

    // Imagens removidas sao imagens que contem a referencia no item selecionado
    // e nao estao no formData
    const imagensRemovidas: string[] = [];

    // vetor com o caminho das imagens adicionadas e mantidas em formato de string
    // imagens mantidas são imagens que ja estavam no item selecionado e continuam
    // no formData
    const imagesPath: string[] = [];

    for (const pathImagem of itemSelecionado.imagens) {
      // imagem permanece no item atualizado e no firestore atual
      if (itemAcervo.imagens.some((img) => img.title === pathImagem)) {
        imagesPath.push(pathImagem);
      }
      // imagem foi removida do item atualizado
      else {
        imagensRemovidas.push(pathImagem);
      }
    }

    const itemPrivacidade = itemAcervo.privado ? "privado" : "publico";
    const newPath =
      colecao.id + (colecao.privado ? "/itens" : "/" + itemPrivacidade);

    //Adicionar as imagens novas ao storage e guardar a referencia em forma de string no vetor imagesPath
    const newRefs = await adicionarImagens(imagensNovas).catch((error) => {
      throw new Error(error);
    });
    imagesPath.push(...newRefs);

    //Remover as imagens que nao estao no documento novo do storage
    await removerImagens(imagensRemovidas).catch((error) => {
      throw new Error(error);
    });

    const uploadDoc = { ...itemAcervo, imagens: imagesPath };
    delete uploadDoc.id;
    if (
      itemSelecionado?.privado != itemAcervo.privado ||
      colecao.nome != itemAcervo.colecao
    ) {
      itemAcervo.id = await moveItemToCollection(
        uploadDoc,
        itemAcervo.id,
        newPath
      );
    } else {
      //Mesmo apontando erro no vsCode o método updateDoc funciona, por algum motivo o vsCode não reconhece
      await updateDoc(docRef, uploadDoc).catch(() => {
        throw new FirebaseError("not-found", "Erro ao atualizar documento");
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar documento");
  }
};

const removerImagens = async (imagens: string[]) => {
  imagens.forEach(async (imagem) => {
    const storageRef = ref(storage, imagem);
    await deleteObject(storageRef).catch(() => {
      throw new FirebaseError("not-found", "Erro ao deletar imagem");
    });
  });
};

const deleteItemAcervo = async (fullPath: string) => {
  try {
    const docRef = doc(db, fullPath);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Deleta as imagens associadas ao documento
      const data = docSnap.data();
      if (data && Array.isArray(data.imagens)) {
        removerImagens(data.imagens);
      }
      // Deletar o documento
      await deleteDoc(docRef);
    } else {
      throw new FirebaseError("not-found", "Documento não encontrado");
    }
  } catch (error) {
    throw new FirebaseError("not-found", "Erro ao deletar documento");
  }
};

const methodsItemAcervo = {
  adicionarItemAcervo,
  deleteItemAcervo,
  removerImagens,
  getItemAcervo,
  adicionarImagens,
  updateItemAcervo,
  getImagemItemAcervo,
  moveItemToCollection,
};

export {
  methodsItemAcervo,
  deleteItemAcervo,
  getItemAcervo,
  updateItemAcervo,
  getImagemItemAcervo,
};
