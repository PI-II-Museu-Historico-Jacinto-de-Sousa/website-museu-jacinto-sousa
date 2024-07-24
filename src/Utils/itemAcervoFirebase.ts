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
import { StorageReference, deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
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
      return dataMuseu as ItemAcervo;
    }
  } catch (error) {
    throw new FirebaseError("permission-denied", "Acesso negado");
  }
}

/** Método para adicionar um item à coleção acervo no firestore, as imagens de um item são as referências para o arquivo no storage */
export const adicionarItemAcervo = async (
  itemAcervo: ItemAcervo,
  colecao: Colecao
): Promise<boolean> => {
  //subcoleção do acervo onde o item será incluido
  if(colecao.privado && !itemAcervo.privado) {
    throw new Error("Não é possível adicionar um item público a uma coleção privada");
  }
  if(colecao.id === undefined) {
    throw new Error("Coleção inválida");
  }
  const itemPrivacidade = itemAcervo.privado ? "privado" : "publico";
  const relativePath = colecao.privado ? "/itens" :  "/" + itemPrivacidade;
  const path = colecao.id + relativePath;

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
        if (imagem.src) {
          throw new Error("Imagem adicionada deve ser um arquivo");
        }
        const storageRef = ref(storage, "images/" + imagem.title);
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

const moveItemToCollection = async (formData: ItemAcervo, oldPath: string, newPath: string) => {
  try {
    // Ensure oldPath and newPath are strings
    if (oldPath && newPath) {
      const oldDocRef = doc(db, oldPath);
      const newDocRef = doc(db, newPath);

      // Add the item to the new collection
      await setDoc(newDocRef, formData).catch(() => {
        throw new FirebaseError("not-found", "Erro ao mover documento");
      });

      // Remove the item from the old collection
      await deleteDoc(oldDocRef).catch(() => {
        throw new FirebaseError("not-found", "Erro ao mover documento");
      });
    }
  } catch (error) {
    throw new Error("Erro ao mover documento");
  }
}

const updateItemAcervo = async (formData: ItemAcervo, fullPath: string, colecao: Colecao) => {
  try {
    const docRef = doc(db, fullPath);
    const itemSelecionado = (await getDoc(docRef)).data() as ItemAcervo;

    if(colecao.privado && !formData.privado) {
      throw new Error("Não é possível adicionar um item público a uma coleção privada");
    }

    // Verificar as imagens novas que não estão presentes no itemSelecionado
    const imagensNovas = formData.imagens.filter((novaImagem) => !itemSelecionado.imagens.includes(novaImagem));

    const itemPrivacidade = formData.privado ? "privado" : "publico";
    const relativePath = colecao.privado ? "/itens" :  "/" + itemPrivacidade;
    const newPath = colecao.id + relativePath + "/" + docRef.id;

    //Mesmo apontando erro no vsCode o método updateDoc funciona, por algum motivo o vsCode não reconhece
    await updateDoc(docRef, formData).catch(() => {
      throw new FirebaseError("not-found", "Erro ao atualizar documento");
    });

   if(imagensNovas.length > 0) {
      //Adicionar as imagens novas ao storage
      adicionarImagens(imagensNovas).catch((error) => {
        throw new Error(error);
      });
    }

    if(itemSelecionado.privado != formData.privado || colecao.nome != formData.colecao) {
      moveItemToCollection(formData, fullPath, newPath);
    }

  } catch (error) {
    throw new Error("Erro ao atualizar documento");
  }
}

const removerImagens = async (imagens: string[]) => {
  imagens.forEach(async (imagem) => {
    const storageRef = ref(storage, imagem);
    await deleteObject(storageRef).catch(() => {
      throw new FirebaseError("not-found", "Erro ao deletar imagem");
    })
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
}

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

export { methodsItemAcervo, adicionarImagens, removerImagens, moveItemToCollection ,deleteItemAcervo, getItemAcervo, updateItemAcervo, getImagemItemAcervo };
