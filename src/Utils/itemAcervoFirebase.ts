/* utilitário contendo todos os métodos utilizados em itens do acervo gerenciados com firebase */

import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { ItemAcervo } from "../interfaces/ItemAcervo";

/** Método para adicionar um item à coleção acervo no firestore, as imagens de um item são as referências para o arquivo no storage */
export const adicionarItemAcervo = async (
  itemAcervo: ItemAcervo
): Promise<boolean> => {
  const collectionRef = collection(db, "acervo");

  try {
    const imagesRef = await adicionarImagens(itemAcervo.imagens).catch(
      (error) => {
        throw new Error(error);
      }
    );
    //item enviado utiliza referências das imagens no storage
    const sendingItemAcervo = { ...itemAcervo, imagens: imagesRef };
    const documentReference = await addDoc(
      collectionRef,
      sendingItemAcervo
    ).catch((error) => {
      throw new Error(error);
    });
    return documentReference.id !== undefined;
  } catch (error) {
    console.error(error);
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
        if (typeof imagem.src === "string") {
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
          imagem.src as File,
          metadata
        ).catch((error) => {
          console.error(error);
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

const removerImagens = async (imagens: Imagem[], idItemAcervo: string) => {
  imagens.forEach(async (imagem) => {
    const storageRef = ref(storage, "images/" + imagem.title);
    await deleteObject(storageRef);

    const itemRef: DocumentReference<DocumentData> = doc(
      collection(db, "acervo"),
      idItemAcervo
    );
    updateDoc(itemRef, { itemImages: [] }).catch((error) => {
      console.error(error);
      throw new Error("Erro ao remover imagens de item inválido");
    });
  });
};

const methodsItemAcervo = {
  adicionarItemAcervo,
};

export default methodsItemAcervo;
