/* utilitário contendo todos os métodos utilizados em itens do acervo gerenciados com firebase */

import {
  DocumentData,
  DocumentReference,
  Timestamp,
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
    const docRef: DocumentReference = doc(db, COLLECTION_REF, fullPath);
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

const COLLECTION_REF = "acervo";

/** Método para adicionar um item à coleção acervo no firestore, as imagens de um item são as referências para o arquivo no storage */
export const adicionarItemAcervo = async (
  itemAcervo: ItemAcervo
): Promise<boolean> => {
  //subcoleção do acervo onde o item será incluido
  const itemCollectionRef = doc(
    db,
    COLLECTION_REF,
    itemAcervo.privado ? "privado" : "publico"
  );

  try {
    const imagesRef = await adicionarImagens(itemAcervo.imagens).catch(
      (error) => {
        throw new Error(error);
      }
    );
    //item enviado utiliza referências das imagens no storage
    const sendingItemAcervo = { ...itemAcervo, imagens: imagesRef };
    const documentReference = await addDoc(
      collection(itemCollectionRef, "itens"),
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
    removerImagens(itemAcervo.imagens, itemAcervo.id as string);
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
      const oldDocRef = doc(db, COLLECTION_REF, oldPath);

      const newDocRef = doc(db, COLLECTION_REF, newPath);

      //Cópia para evitar salvar o atributo coleção que vem do formulário
      const file = {
        nome: formData.nome,
        descricao: formData.descricao,
        curiosidades: formData.curiosidades,
        privado: Boolean(formData.privado),
        dataDoacao: formData?.dataDoacao ? Timestamp.fromDate(formData.dataDoacao.toDate()) : null,
      };

      // Add the item to the new collection
      await setDoc(newDocRef, file);

      // Remove the item from the old collection
      await deleteDoc(oldDocRef);
    }
  } catch (error) {
    throw new Error("Erro ao mover documento");
  }
}

function getStringBetweenFirstAndSecondSlash(path: string) {
  const parts = path.split('/');
  if (parts.length >= 3) {
    return parts[1];
  } else {
    return null;
  }
}


const updateItemAcervo = async (formData: ItemAcervo, fullPath: string) => {
  try {
    const itemSelecionado = await getItemAcervo(fullPath);
    const docRef = doc(db, COLLECTION_REF, fullPath);
    const id = docRef.id;
    if (fullPath) {
      const docRef = doc(db, COLLECTION_REF, fullPath);
      //Cópia para evitar salvar o atributo coleção que vem do formulário
      const file = {
        nome: formData.nome,
        descricao: formData.descricao,
        curiosidades: formData.curiosidades,
        privado: Boolean(formData.privado),
        dataDoacao: formData?.dataDoacao ? Timestamp.fromDate(formData.dataDoacao.toDate()) : null,
      };
      await updateDoc(docRef, file).catch(() => {
        throw new FirebaseError("not-found", "Erro ao atualizar documento");
      });
      if(itemSelecionado.privado != formData.privado || getStringBetweenFirstAndSecondSlash(fullPath) != formData.colecao) {
        moveItemToCollection(formData, fullPath, formData.privado ? `privado/${formData.colecao}/${id}`: `publico/${formData.colecao}/${id}`);
      }
    }
  } catch (error) {
    throw new Error("Erro ao atualizar documento");
  }
}

const removerImagens = async (imagens: Imagem[], idItemAcervo: string) => {
  imagens.forEach(async (imagem) => {
    const storageRef = ref(storage, "images/" + imagem.title);
    await deleteObject(storageRef);

    const itemRef: DocumentReference<DocumentData> = doc(
      collection(db, COLLECTION_REF),
      idItemAcervo
    );
    updateDoc(itemRef, { itemImages: [] }).catch(() => {
      throw new Error("Erro ao remover imagens de item inválido");
    });
  });
};

const deleteItemAcervo = async (fullPath: string) => {
  try {
    const docRef = doc(db, COLLECTION_REF, fullPath);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Deleta as imagens associadas ao documento
      const data = docSnap.data();
      if (data && Array.isArray(data.imagens)) {
        removerImagens(data.imagens, docSnap.id);
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
