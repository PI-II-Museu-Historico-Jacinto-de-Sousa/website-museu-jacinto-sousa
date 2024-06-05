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
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { StorageReference, deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { FirebaseError } from "firebase/app";
import { Unsubscribe } from "firebase/auth";

type Status = "loading" | "success" | "error.permission-denied" | "error.not-found";

function subscribeItemAcervo(
  id: string,
  currentInfo: ItemAcervo | null,
  callback: React.Dispatch<React.SetStateAction<ItemAcervo | null>>,
  statusUpdate: React.Dispatch<React.SetStateAction<Status>>
): Unsubscribe {
  try {
    const docRef = doc(db, "acervo", id);
    const unsubscribe = onSnapshot(
      docRef,
      async (snapshot) => {
        const itemAcervo = snapshot.data();
        if (!itemAcervo) {
          statusUpdate("error.not-found");
          return;
        } else {
          //atualizar imagem somente se houver mudança
          if (itemAcervo?.imagens != currentInfo?.imagens) {
            const imagensPaths = itemAcervo.imagens;
            const imagensPromises = imagensPaths.map((path: string) =>
              getImagemItemAcervo(ref(storage, path))
            );
            try {
              itemAcervo.imagens = await Promise.all(imagensPromises);
            } catch (error) {
              throw new Error("Erro ao buscar imagens",);
            }
          }
          callback(itemAcervo as ItemAcervo);
          statusUpdate((previousState) =>
            previousState === "error.not-found" ? "error.not-found" : "success"
          );
        }
      },
      (error) => {
        if(error.code === "permission-denied") {
          statusUpdate("error.permission-denied");
        } else {
          statusUpdate("error.not-found");
        }
        throw new Error(`${(error as Error).message}`);
      }
    );
    return unsubscribe;
  } catch (error) {
    statusUpdate("error.permission-denied");
    throw new Error(`${(error as Error).message}`);
  }
}

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

const getItemAcervo = async (id: string) => {
  try {
    const docRef = doc(db, "acervo", id);
    const docSnap = await getDoc(docRef).catch(() => {
      throw new FirebaseError("Erro ao buscar documento", "not-found");
    });
    if (!docSnap.exists()) {
      throw new FirebaseError("Documento não encontrado", "not-found");
    } else {
      const dataMuseu = docSnap.data();
      return dataMuseu as ItemAcervo;
    }
  } catch (error) {
    throw new FirebaseError("Permissão negada", "permission-denied");
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

const updateItemAcervo = async (formData: ItemAcervo, id: string) => {
  try {
    if (id && typeof id === 'string') {
      const docRef = doc(db, "acervo", id);
      const file = {
        nome: formData.nome,
        descricao: formData.descricao,
        curiosidades: formData.curiosidades,
        privado: Boolean(formData.privado) ,
        colecao: formData.colecao,
        dataDoacao: formData?.dataDoacao ? Timestamp.fromDate(formData.dataDoacao.toDate()) : null,
      };
      await updateDoc(docRef, file).catch(() => {
        throw new FirebaseError("Erro ao atualizar documento", "not-found");
      });
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

const deleteItemAcervo = async (id: string) => {
  try {
    const docRef = doc(db, "acervo", id);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Deleta as imagens associadas ao documento
      const data = docSnap.data();
      if (data && Array.isArray(data.imagens)) {
          const imagensRefPromises = data.imagens.map(async (imagem) => {
              const imagemRef = ref(storage, imagem);
              try {
                  await getMetadata(imagemRef);
                  return imagemRef;
              } catch (error) {
                  return null;
              }
          });
          const imagensRefs = await Promise.all(imagensRefPromises);
          for (const imagemRef of imagensRefs) {
              if (imagemRef) {
                  try {
                      await deleteObject(imagemRef);
                  } catch (error) {
                      throw new FirebaseError("Erro ao deletar imagem", "not-found");
                  }
              }
          }
      }
      // Deletar o documento
      await deleteDoc(docRef);
  } else {
      throw new FirebaseError("No such document!", "not-found");
  }

  } catch (error) {
    throw new FirebaseError("Erro ao deletar documento", "not-found");
  }
}

const methodsItemAcervo = {
  adicionarItemAcervo,
  deleteItemAcervo,
  removerImagens,
  getItemAcervo,
  adicionarImagens,
  updateItemAcervo,
  subscribeItemAcervo,
  getImagemItemAcervo,
};

export { methodsItemAcervo, adicionarImagens, removerImagens, deleteItemAcervo, getItemAcervo, updateItemAcervo, subscribeItemAcervo, getImagemItemAcervo };
