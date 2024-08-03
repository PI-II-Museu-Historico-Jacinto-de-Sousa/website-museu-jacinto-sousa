import { FirebaseError } from "firebase/app";
import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Transaction,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { ref } from "firebase/storage";
import { auth, db, storage } from "../../firebase/firebase";
import { Colecao } from "../interfaces/Colecao";
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { deleteItemAcervo, getImagemItemAcervo } from "./itemAcervoFirebase";

const COLLECTION_BASE_PATH = "colecoes";

/**
 * Por padrão não utiliza paginação
 * @returns array de strings com os nomes de todas coleções
 */

export const getColecoes = async (): Promise<Colecao[]> => {
  const privateCollectionsRef = collection(
    db,
    COLLECTION_BASE_PATH,
    "privado/lista"
  );
  const publicCollectionsRef = collection(
    db,
    COLLECTION_BASE_PATH,
    "publico/lista"
  );
  try {
    let privateCollections:
      | QuerySnapshot<DocumentData, DocumentData>
      | undefined = undefined;
    if (auth.currentUser !== null) {
      privateCollections = await getDocs(privateCollectionsRef);
    }
    const publicCollections = await getDocs(publicCollectionsRef);

    const collections = privateCollections
      ? publicCollections.docs.concat(privateCollections.docs)
      : publicCollections.docs;

    return collections.map((doc) => {
      return { id: doc.ref.path, ...doc.data() } as Colecao;
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar as coleções de itens");
  }
};

/**
 * Busca por uma colecao com id passado, primeiro na subcoleção de itens privados
 * e depois na de itens públicos
 * @param fullpath
 * @returns Colecao com o id informado
 */
export const getColecao = async (fullpath: string): Promise<Colecao> => {
  const docRef = doc(db, fullpath);

  try {
    const colecaoDoc = await getDoc(docRef).catch((error) => {
      throw new FirebaseError(error.code, "Erro ao buscar a coleção");
    });
    // Depois busca os itens do acervo listados com a coleção
    const resultado = {
      id: fullpath,
      ...colecaoDoc.data(),
    } as Omit<Colecao, "itens">;
    const itens = await getItensColecao(resultado);
    // Retorna a coleção com os itens completos em vez de ids
    return { ...resultado, itens: itens } as Colecao;
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message =
        "Você não tem permissão para acessar essa coleção";
    }
    throw new Error(`${(error as Error).message}`);
  }
};

/**
 * Retorna os itens de uma coleção com suas imagens
 * @param id da coleção
 * @returns array de itens da coleção
 */
export const getItensColecao = async (
  colecao: Omit<Colecao, "itens">,
  comImagens: boolean = true
): Promise<ItemAcervo[]> => {
  const itens = [];
  if (auth.currentUser !== null) {
    if (colecao.privado) {
      const privateDocs = await getDocs(
        collection(db, colecao.id + "/itens")
      ).catch((error) => {
        throw new FirebaseError(error.code, "Erro ao buscar itens da coleção");
      });
      itens.push(...privateDocs.docs.map((doc) => doc.data()));
    } else {
      // buscando itens privados em uma coleção publica
      const privateDocs = await getDocs(
        collection(db, colecao.id + "/privado")
      );
      itens.push(
        ...privateDocs.docs.map((doc) => {
          const asItemAcervo = doc.data();
          asItemAcervo.id = doc.ref.path;
          return asItemAcervo;
        })
      );
    }
  }
  const publicDocs = await getDocs(collection(db, colecao.id + "/publico"));
  itens.push(...publicDocs.docs.map((doc) => doc.data()));

  if (!comImagens) return itens as ItemAcervo[];

  await Promise.all(
    itens.map(async (item) => {
      item.imagens = await Promise.all(
        item.imagens.map(async (image: string) => {
          const storageRef = ref(storage, image);
          return await getImagemItemAcervo(storageRef).catch(() => {
            throw new FirebaseError("not-found", "Erro ao buscar imagem");
          });
        })
      );
    })
  );

  return itens as ItemAcervo[];
};

/**
 * Adiciona uma nova coleção no caminho definido na constante FIRESTORE_COLLECTION
 * Os ids dos itens são adicionados ao documento em um array de strings
 * @param colecao
 * @returns id da coleção adicionada
 */
export const adicionarColecao = async (
  colecao: Omit<Colecao, "itens">
): Promise<string> => {
  try {
    const subcollectionRef = colecao.privado ? "privado" : "publico";
    const colecaoRef = collection(
      db,
      COLLECTION_BASE_PATH + "/" + subcollectionRef + "/" + "lista"
    );
    const colecaoDoc = await addDoc(colecaoRef, colecao).catch((error) => {
      throw new FirebaseError(error.code, "Falha ao salvar a coleção");
    });
    return colecaoDoc.id;
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message = "Você não tem permissão para criar coleções";
    }
    throw new Error(`${(error as Error).message}`);
  }
};

/**
 * Atualiza uma coleção com o id incluso no objeto colecao,
 * Essa operação não adiciona nem remove itens do acervo, apenas atualiza os dados da coleção.
 *
 * Quando o caminho da coleção é alterado, os itens são movidos para a subcoleção respectiva no novo caminho.
 * @throws Error se o id da coleção não for informado ou houver erro do firestore ao atualizar o documento
 * @param colecao
 */
export const atualizarColecao = async (
  colecao: Omit<Colecao, "itens">
): Promise<void> => {
  if (!colecao.id) {
    throw new Error("Id da coleção não informado");
  }

  const currentRef = doc(db, colecao.id);

  try {
    const document = await getDoc(currentRef).catch((error) => {
      throw new FirebaseError(error.code, "Erro ao buscar a coleção");
    });
    if (!document.exists()) {
      throw new Error("Coleção não encontrada");
    }
    const colecaoData = document.data();
    if (colecao.privado !== colecaoData.privado) {
      const replaceableSubPath = colecao.id.includes("publico")
        ? "publico"
        : "privado";
      const newSubPath = colecao.privado ? "privado" : "publico";
      const newPath = colecao.id.replace(replaceableSubPath, newSubPath);
      const newRef = doc(db, newPath);
      // primeira transacao remove a colecao do caminho antigo e adiciona no novo
      await runTransaction(db, async (transaction) => {
        await moveCollectionWithUpdate(colecao, newPath, transaction);
      });
      // segunda transacao remove cada item do caminho antigo e adiciona no novo
      // essa transacao somente apos a primeira para evitar leitura de dados antigos da colecao alvo
      await runTransaction(db, async (transaction) => {
        await moveCollectionItems(currentRef, newRef, transaction);
      });
    } else {
      const sendingDoc = { ...colecao };
      delete sendingDoc.id;
      updateDoc(currentRef, sendingDoc).catch((error) => {
        throw new FirebaseError(error.code, "Erro ao atualizar a coleção");
      });
    }
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message =
        "Você não tem permissão para atualizar coleções";
    }
    throw new Error(`${(error as Error).message}`);
  }
};

/**
 * Move o documento de uma coleção de um caminho para outro
 * @param data
 * @param newPath
 * @returns DocumentReference do novo caminho da coleção
 */
const moveCollectionWithUpdate = async (
  data: Omit<Colecao, "itens">,
  newPath: string,
  transaction: Transaction
) => {
  if (!data.id) {
    throw new Error("Id da coleção não informado");
  }
  const oldDocRef = doc(db, data.id);
  const newDocRef = doc(db, newPath);
  transaction.delete(oldDocRef);

  const sendingData = { ...data };
  delete sendingData.id;
  transaction.set(newDocRef, sendingData);

  return newDocRef;
};
/**
 * Deleta os itens de uma coleção e move para outra coleção, apenas os documentos no firestore são alterados
 * nenhuma operação no storage é realizada.
 *
 * Caso privado seja verdadeiro então todos os itens serão convertidos para privados, caso contrário serão públicos.
 * @param oldPath
 * @param newCollectionRef caminho para a coleção de destino
 * @param privado privacidade no novo caminho
 */
const moveCollectionItems = async (
  oldCollectionRef: DocumentReference,
  newCollectionRef: DocumentReference,
  transaction: Transaction
) => {
  if (!oldCollectionRef.id) {
    throw new Error("Id da coleção não informado");
  }
  const newDoc = await getDoc(newCollectionRef).catch((error) => {
    throw new FirebaseError(error.code, "Erro ao buscar a coleção de destino");
  });
  //mapeamento dos itens da coleção com seus novos caminhos
  const itens: Map<string, ItemAcervo> = new Map();
  const privado = newDoc.data()?.privado;
  // se o novo caminho for privado busca itens publicos e privados na colecao antiga
  if (privado) {
    const docsItensPrivados = await getDocs(
      collection(db, oldCollectionRef.path, "privado")
    ).catch((error) => {
      throw new FirebaseError(
        error.code,
        "Erro ao buscar itens privados da coleção publica"
      );
    });

    const docsItensPublicos = await getDocs(
      collection(db, oldCollectionRef.path, "publico")
    ).catch((error) => {
      throw new FirebaseError(
        error.code,
        "Erro ao buscar itens publicos da coleção publica"
      );
    });

    // junta os itens publicos e privados em um novo array e para cada item no array
    // adiciona uma entrada no mapa com o novo caminho e o item
    docsItensPrivados.docs.concat(docsItensPublicos.docs).map((doc) => {
      const item = doc.data() as ItemAcervo;
      item.privado = privado;
      item.id = doc.ref.path;

      itens.set(newCollectionRef.path + "/itens/" + doc.ref.id, item);
    });
  }
  // se nao busca apenas itens privados na colecao antiga
  else {
    const itensPrivados = await getDocs(
      collection(db, oldCollectionRef.path, "itens")
    ).catch((error) => {
      throw new FirebaseError(
        error.code,
        "Erro ao buscar itens da coleção privada"
      );
    });
    itensPrivados.docs.map((doc) => {
      const item = doc.data() as ItemAcervo;
      item.privado = privado;
      item.id = doc.ref.path;

      itens.set(newCollectionRef.path + "/publico/" + doc.ref.id, item);
    });
  }
  // como operações de escrita e delete não podem ser realizadas em uma única requisição
  // cada item é adicionado no novo caminho e deletado do antigo, e se houver erro em alguma
  // operação o resto das operações são canceladas
  for (const [path, item] of itens) {
    if (!item.id) {
      throw new Error("Id do item não encontrado");
    }
    const newRef = doc(db, path);
    const oldRef = doc(db, item.id);
    // id é utilizado para identificar o caminho do item, mas não é armazenado
    delete item.id;
    transaction.set(newRef, item);
    transaction.delete(oldRef);
  }
};

/**
 * remove uma coleção e, opcionalmente, todos os itens associados a ela,
 * caso deleteitems seja false uma nova colecao deve ser informada para mover os itens.
 * @param path da coleção a ser deletada
 * @param deleteitems para remover todos os itens da coleção antes de deletá-la
 */
export const deletarColecao = async (
  fullpath: string,
  deleteItems: boolean = false,
  targetCollectionPath?: string
): Promise<void> => {
  try {
    const colecaoRef = doc(db, fullpath);
    const colecaoDoc = await getDoc(colecaoRef).catch((error) => {
      throw new FirebaseError(error.code, "Erro ao buscar a coleção");
    });
    if (!deleteItems) {
      if (!targetCollectionPath) {
        throw new Error("Nova coleção de destino não informada");
      }
      await runTransaction(db, async (transaction) => {
        await moveCollectionItems(
          colecaoRef,
          doc(db, targetCollectionPath),
          transaction
        );
      });
    } else {
      for (const item of await getItensColecao(colecaoDoc.data() as Colecao)) {
        if (!item.id) {
          throw new Error("Id do item não encontrado");
        }
        await deleteItemAcervo(item.id);
      }
    }
    await deleteDoc(colecaoRef).catch((error) => {
      throw new FirebaseError(error.code, "Erro ao deletar a coleção");
    });
  } catch (error) {
    if ((error as FirebaseError).code == "permission-denied") {
      (error as Error).message = "Você não tem permissão para deletar coleções";
    }
    throw new Error(`${(error as Error).message}`);
  }
};
