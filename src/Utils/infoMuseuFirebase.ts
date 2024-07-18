import { FirebaseError } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  updateMetadata,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../firebase/firebase";
import { InfoMuseu } from "../interfaces/InfoMuseu";

const COLLECTION_REF = "informacoes-museu/home/itens";
const HOME_REF = "informacoes-museu";

async function getInfoMuseu(id: string): Promise<InfoMuseu> {
  try {
    const docRef = doc(db, COLLECTION_REF, id);
    const docSnap = await getDoc(docRef).catch(() => {
      throw new FirebaseError("Erro ao buscar documento", "not-found");
    });

    if (!docSnap.exists()) {
      throw new Error("Documento nao existe!");
    }
    const dataMuseu = docSnap.data();

    if (dataMuseu.imagem) {
      const storageRef = ref(storage, `images/${dataMuseu.imagem}`);
      dataMuseu.imagem = await getImagemInfoMuseu(storageRef).catch((error) => {
        throw new FirebaseError(error.code, "Erro ao buscar imagem");
      });
    } else {
      //nao retornar imagem se nao existir ou for vazia
      delete dataMuseu.imagem;
    }
    return { ...dataMuseu } as InfoMuseu;
  } catch (error) {
    // Relançar o erro para ser tratado externamente
    throw new FirebaseError("Documento não encontrado", "not-found");
  }
}

async function getImagemInfoMuseu(
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

async function atualizarInfoMuseu(id: string, info: InfoMuseu) {
  try {
    const docRef = doc(db, COLLECTION_REF, id);
    const docSnap = await getDoc(docRef).catch(() => {
      throw new FirebaseError("firestore-error", "Erro ao buscar informação");
    });
    if (!docSnap.exists()) {
      throw Error("Informação não encontrada");
    }
    let updatedDoc = {
      nome: info.nome,
      texto: info.texto,
    };
    const data = docSnap.data();

    const imagemRef = data.imagem
      ? ref(storage, `images/${data.imagem}`)
      : null;
    const updatedRef = await atualizarImagemInfoMuseu(imagemRef, info.imagem);
    //documento armazenado possui apenas a referencia em forma de string para a imagem
    if (updatedRef) {
      updatedDoc = {
        ...updatedDoc,
        imagem: updatedRef,
      } as typeof updatedDoc & { imagem: string };
    }
    await setDoc(docRef, updatedDoc).catch(() => {
      throw new FirebaseError("storage-error", "Erro ao salvar atualização");
    });
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
}

/**
 * Atualiza a imagem vinculada a uma informacao, caso a imagem tenha o mesmo nome e conteudo,
 * apenas os metadados sao atualizados. Se não, a imagem antiga é removida e a nova imagem referenciada
 * no objeto do firestore
 * @param imagemAntigaRef
 * @param novaImagem
 * @returns nova referencia da imagem
 */
async function atualizarImagemInfoMuseu(
  imagemAntigaRef: StorageReference | null,
  novaImagem: Imagem | undefined
): Promise<string | undefined> {
  if (novaImagem === undefined && imagemAntigaRef === null) {
    return undefined;
  }
  if (novaImagem === undefined && imagemAntigaRef) {
    // remover a imagem antiga apenas se não estiver sendo utilizada por outro documento
    if ((await getInfoUsingImageCount(imagemAntigaRef.name)) == 1) {
      deleteObject(imagemAntigaRef)
        .then(() => {})
        .catch(() => {
          throw new FirebaseError(
            "storage-error",
            "Erro deletando imagem antiga"
          );
        });
    }
    return undefined;
  }
  // se a imagem não for do tipo file, então apenas os metadados foram modificados
  if (!(novaImagem?.src instanceof File)) {
    if (novaImagem?.title) {
      const imagemRef = ref(storage, `images/${novaImagem.title}`);
      await updateMetadata(imagemRef, {
        customMetadata: { alt: novaImagem.alt },
      }).catch(() => {
        throw new FirebaseError(
          "storage-error",
          "Erro adicionando informações do arquivo"
        );
      });
      return imagemRef.name;
    } else {
      throw new Error("Nova imagem deve ser um arquivo");
    }
  } else {
    const novaImagemRef = ref(storage, `images/${novaImagem.src.name}`);
    try {
      const metadata = { customMetadata: { alt: novaImagem.alt } };
      //sobrescrever a imagem antiga
      if (novaImagemRef == imagemAntigaRef || imagemAntigaRef == null) {
        await uploadBytes(novaImagemRef, novaImagem.src, metadata).catch(() => {
          throw new FirebaseError("storage-error", "Erro salvando nova imagem");
        });
      } else {
        // remover a imagem antiga apenas se não estiver sendo utilizada por outro documento
        if ((await getInfoUsingImageCount(imagemAntigaRef.name)) == 1) {
          await deleteObject(imagemAntigaRef).catch(() => {
            throw new FirebaseError(
              "storage-error",
              "Erro deletando imagem antiga"
            );
          });
        }
        await uploadBytes(novaImagemRef, novaImagem.src, metadata).catch(() => {
          throw new FirebaseError("storage-error", "Erro salvando nova imagem");
        });
      }
      return novaImagemRef.name;
    } catch (error) {
      if ((error as FirebaseError).code == "storage/object-not-found") {
        (error as Error).message = "Nenhuma imagem encontrada";
      } else if ((error as FirebaseError).code == "storage/unauthenticated") {
        (error as Error).message =
          "Você não tem permissão para alterar imagens";
      }

      throw new Error(`${(error as Error).message}`);
    }
  }
}

/**
 *
 * @param info
 * @returns o id do documento adicionado
 */
async function adicionarInfoMuseu(info: InfoMuseu): Promise<string> {
  try {
    const collectionRef = collection(db, COLLECTION_REF);
    let newDoc: InfoMuseu = {
      nome: info.nome,
      texto: info.texto,
    };
    if (info?.imagem) {
      const imagemPath = await adicionarImagemInfoMuseu(info.imagem).catch(
        (error) => {
          throw new FirebaseError(
            "storage-error",
            "Erro ao adicionar imagem:" + error.message
          );
        }
      );
      newDoc = { ...newDoc, imagem: imagemPath } as typeof newDoc & {
        imagem: string;
      };
    }
    const docReference = await addDoc(collectionRef, newDoc).catch((error) => {
      throw new FirebaseError(
        "firestore-error",
        "Erro ao adicionar documento:" + error.message
      );
    });
    return docReference.id;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
}

async function adicionarImagemInfoMuseu(imagem: Imagem): Promise<string> {
  try {
    if (imagem.src instanceof File) {
      const storageRef = ref(storage, `images/${imagem.src.name}`);
      await uploadBytesResumable(storageRef, imagem.src).catch(() => {
        throw new FirebaseError("storage-error", "Erro salvando conteúdo");
      });
      const metadata = { customMetadata: { alt: imagem.alt } };
      updateMetadata(storageRef, metadata).catch(() => {
        throw new FirebaseError(
          "storage-error",
          "Erro ao adicionar informações do arquivo"
        );
      });
      return storageRef.name;
    } else {
      throw new FirebaseError("storage-error", "Imagem deve ser um arquivo");
    }
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
}

async function deletarInfoMuseu(id: string) {
  try {
    const docRef = doc(db, COLLECTION_REF, id);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.imagem) {
        //remover a imagem apenas se não estiver sendo utilizada por outro documento
        if ((await getInfoUsingImageCount(data.imagem)) == 1) {
          const imagemRef = ref(storage, `images/${data.imagem}`);
          await deleteObject(imagemRef).catch((error) => {
            throw new FirebaseError(error.code, "Erro ao deletar imagem");
          });
        }
      }
      // Deletar o documento
      await deleteDoc(docRef).catch((error) => {
        throw new FirebaseError(error.code, "Erro ao deletar informação");
      });
    } else {
      throw new FirebaseError("not-found", "Informação não encontrada");
    }
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message =
        "Você não tem permissão para deletar informações";
    }
    throw new Error(`${(error as Error).message}`);
  }
}

// retorna o numero de documentos na coleção que estão utilizando uma mesma imagem
const getInfoUsingImageCount = async (nomeImagem: string): Promise<number> => {
  const collectionRef = collection(db, COLLECTION_REF);

  const queryForImage = query(collectionRef, where("imagem", "==", nomeImagem));
  const querySnapshot = await getDocs(queryForImage);
  return querySnapshot.docs.length;
};

/**
 * Adiciona uma nova imagem para a lista da home page
 * @param imagem
 */
const adicionarImagemHome = async (imagem: Imagem): Promise<void> => {
  try {
    if (!(imagem.src instanceof File)) {
      throw Error("Conteúdo da imagem deve ser um arquivo");
    }
    const homeDoc = doc(db, HOME_REF, "home");
    const novaImagemRef = ref(storage, `images/${imagem.src.name}`);
    await uploadBytes(novaImagemRef, imagem.src).catch(() => {
      throw new FirebaseError("storage-error", "Erro salvando nova imagem");
    });
    // caminho da nova imagem é adicionado ao array imagens
    await updateDoc(homeDoc, { imagens: arrayUnion(novaImagemRef.name) });
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message =
        "Você não tem permissão para adicionar imagens";
    }
    throw new Error(`${(error as Error).message}`);
  }
};

/**
 * Remove uma imagem da lista da home page
 */
const removerImagemHome = async (nome_imagem: string): Promise<void> => {
  try {
    const homeDoc = doc(db, HOME_REF, "home");
    const imagemRef = ref(storage, `images/${nome_imagem}`);
    await deleteObject(imagemRef).catch(() => {
      throw new FirebaseError(
        "storage-error",
        `Erro removendo imagem ${nome_imagem}`
      );
    });
    await updateDoc(homeDoc, { imagens: arrayRemove(nome_imagem) });
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message =
        "Você não tem permissão para deletar informações";
    }
    throw new Error(`${(error as Error).message}`);
  }
};

export {
  adicionarInfoMuseu,
  atualizarInfoMuseu,
  deletarInfoMuseu,
  getInfoMuseu,
  adicionarImagemHome,
  removerImagemHome,
};
