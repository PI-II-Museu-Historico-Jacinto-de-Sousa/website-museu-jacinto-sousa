import { FirebaseError } from "firebase/app";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  SnapshotOptions,
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
import { Colecao, ColecaoCreate } from "../interfaces/Colecao";
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { deleteItemAcervo, getImagemItemAcervo } from "./itemAcervoFirebase";
import { BaseConverter } from "./converter";

class ConverterColecoesFirebase extends BaseConverter {
  constructor() {
    super();
  }
  toFirestore(colecao: Omit<Colecao, "itens">): DocumentData {
    return this.pick(colecao, "nome", "descricao", "privado");
  }
  fromFirestore(
    snapShotColecao: DocumentSnapshot,
    options: SnapshotOptions
  ): Omit<Colecao, "itens"> {
    const data = snapShotColecao.data(options);
    return {
      id: snapShotColecao.ref.path,
      ...(data as Omit<Colecao, "itens">),
    };
  }
}
export class ClientColecoesFirebase {
  #converter: ConverterColecoesFirebase;
  #basePath: string;
  constructor(
    converter?: ConverterColecoesFirebase,
    basePath: string = "colecoes"
  ) {
    this.#converter = converter ?? new ConverterColecoesFirebase();
    this.#basePath = basePath;
  }

  getColecoes = async (): Promise<Omit<Colecao, "itens">[]> => {
    const privateCollectionsRef = collection(
      db,
      this.#basePath,
      "privado",
      "lista"
    ).withConverter(this.#converter);
    const publicCollectionsRef = collection(
      db,
      this.#basePath,
      "publico",
      "lista"
    ).withConverter(this.#converter);
    try {
      let privateCollections:
        | QuerySnapshot<Colecao | ColecaoCreate, DocumentData>
        | undefined = undefined;
      if (auth.currentUser !== null) {
        privateCollections = await getDocs(privateCollectionsRef);
      }
      const publicCollections = await getDocs(publicCollectionsRef);

      const collections = privateCollections
        ? publicCollections.docs.concat(privateCollections.docs)
        : publicCollections.docs;

      return collections.map((doc) => doc.data());
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao buscar as coleções de itens");
    }
  };

  /**
   * Busca por uma colecao com id passado
   * @param fullpath
   * @returns Colecao com o id informado e seus itens, incluindo imagens
   */
  getColecao = async (fullpath: string): Promise<Colecao> => {
    const docRef = doc(db, fullpath).withConverter(this.#converter);

    try {
      const colecaoDoc = await getDoc(docRef).catch((error) => {
        throw new FirebaseError(error.code, "Erro ao buscar a coleção");
      });
      if (!colecaoDoc.exists()) {
        throw new Error("Coleção não encontrada");
      }
      const resultado = colecaoDoc.data();
      // Depois busca os itens do acervo listados com a coleção
      const itens = await this.getItensColecao(colecaoDoc.data());
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

  getItensColecao = async (
    colecao: Omit<Colecao, "itens">,
    comImagens: boolean = true
  ): Promise<ItemAcervo[]> => {
    const itens = [];
    if (auth.currentUser !== null) {
      if (colecao.privado) {
        const privateDocs = await getDocs(
          collection(db, colecao.id + "/itens")
        ).catch((error) => {
          throw new FirebaseError(
            error.code,
            "Erro ao buscar itens da coleção"
          );
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
    itens.push(
      ...publicDocs.docs.map((doc) => {
        const asItemAcervo = doc.data();
        asItemAcervo.id = doc.ref.path;
        return asItemAcervo;
      })
    );

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
   * @returns caminho completo da coleção adicionada
   */
  adicionarColecao = async (colecao: ColecaoCreate): Promise<string> => {
    try {
      const sendingDoc = this.#converter.pick(
        colecao,
        "nome",
        "descricao",
        "privado"
      );
      const subcollectionRef = colecao.privado ? "privado" : "publico";
      const colecaoRef = collection(
        db,
        this.#basePath,
        subcollectionRef,
        "lista"
      );
      const colecaoDoc = await addDoc(colecaoRef, sendingDoc).catch((error) => {
        throw new FirebaseError(error.code, "Falha ao salvar a coleção");
      });
      return colecaoDoc.path;
    } catch (error) {
      if ((error as FirebaseError).code == "permission-denied") {
        (error as Error).message = "Você não tem permissão para criar coleções";
      }
      throw new Error(`${(error as Error).message}`);
    }
  };

  /**
   * atualiza uma coleção com os dados passados, caso a privacidade seja alterada
   * a coleção é movida para o novo caminho em uma transacao e os itens são movidos
   * para o novo caminho em uma outra transacao
   * @param colecao
   */
  atualizarColecao = async (colecao: Omit<Colecao, "itens">): Promise<void> => {
    if (!colecao.id) {
      throw new Error("Id da coleção não informado");
    }

    const currentRef = doc(db, colecao.id).withConverter(this.#converter);

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
        const newRef = doc(db, newPath).withConverter(this.#converter);
        //primeira transacao move a colecao para o novo caminho
        await runTransaction(db, async (transaction) => {
          await this.#moveCollectionWithUpdate(colecao, newPath, transaction);
        });
        // segunda transacao remove cada item do caminho antigo e adiciona no novo
        // essa transacao ocorre somente apos a primeira para evitar leitura de dados antigos da colecao alvo
        await runTransaction(db, async (transaction) => {
          await this.#moveCollectionItems(
            colecaoData.privado,
            currentRef,
            newRef,
            transaction
          );
        });
      } else {
        const sendingData = this.#converter.pick(
          colecao,
          "nome",
          "descricao",
          "privado"
        );
        updateDoc(currentRef, sendingData).catch((error) => {
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
   * remove uma coleção e, opcionalmente, todos os itens associados a ela,
   * caso deleteitems seja false uma nova colecao deve ser informada para mover os itens.
   * @param path da coleção a ser deletada
   * @param deleteitems para remover todos os itens da coleção antes de deletá-la
   * @param targetCollectionPath caminho da nova coleção para mover os itens
   */
  deletarColecao = async (
    fullpath: string,
    deleteItems: boolean = false,
    targetCollectionPath?: string
  ): Promise<void> => {
    try {
      const colecaoRef = doc(db, fullpath).withConverter(this.#converter);
      const colecaoDoc = await getDoc(colecaoRef).catch((error) => {
        throw new FirebaseError(error.code, "Erro ao buscar a coleção");
      });
      if (!deleteItems) {
        if (!targetCollectionPath) {
          throw new Error("Nova coleção de destino não informada");
        }
        await runTransaction(db, async (transaction) => {
          await this.#moveCollectionItems(
            colecaoDoc.data()?.privado as boolean,
            colecaoRef,
            doc(db, targetCollectionPath).withConverter(this.#converter),
            transaction
          );
        });
      } else {
        for (const item of await this.getItensColecao(
          colecaoDoc.data() as Colecao,
          false
        )) {
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
      console.error(error);
      if ((error as FirebaseError).code == "permission-denied") {
        (error as Error).message =
          "você não tem permissão para deletar coleções";
      }
      throw new Error(`${(error as Error).message}`);
    }
  };

  /**
   * Realiza uma transacao para adicionar os itens de uma colecao antiga em uma nova colecao
   * @param oldCollectionPrivacidade utilizada para determinar se a coleção antiga é privada ou nao, necessaria
   * para operacao de update que remove a colecao antiga antes de adicionar os novos itens
   * @param oldCollectionRef utilizada para buscar os itens da coleção antiga que serão movidos
   * @param newCollectionRef utilizada para determinar o novo caminho dos itens
   * @returns caminho para salvar um item que foi movido de uma coleção para outra
   */

  #moveCollectionItems = async (
    oldCollectionPrivacidade: boolean,
    oldCollectionRef: DocumentReference,
    newCollectionRef: DocumentReference,
    transaction: Transaction
  ) => {
    if (!oldCollectionRef.id) {
      throw new Error("Id da coleção não informado");
    }
    const oldDoc = await getDoc(oldCollectionRef); //mapeamento dos itens da coleção com seus novos caminhos
    const newDoc = await getDoc(newCollectionRef);
    const itens: Map<string, ItemAcervo> = new Map();
    console.log(oldDoc.data());
    // se o caminho antigo for privado busca itens publicos e privados na colecao antiga
    if (!oldCollectionPrivacidade) {
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
        item.privado = oldCollectionPrivacidade;
        item.id = doc.ref.path;

        itens.set(
          this.#getPathForMovedItem(newDoc.data() as Colecao, doc.ref.id),
          item
        );
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
        item.privado = oldCollectionPrivacidade;
        item.id = doc.ref.path;

        itens.set(
          this.#getPathForMovedItem(newDoc.data() as Colecao, doc.ref.id),
          item
        );
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
   * Determina o caminho para salvar um item em uma outra colecao
   * de acordo com a privacidade e o id (ultimo segmento do caminho) do item
   * @param novaColecao
   * @param itemId
   * @returns
   */
  #getPathForMovedItem = (
    novaColecao: Pick<Colecao, "id" | "privado">,
    itemId: string
  ) => {
    if (novaColecao.privado) {
      return novaColecao.id + "/itens/" + itemId;
    } else {
      return novaColecao.id + "/publico/" + itemId;
    }
  };
  #moveCollectionWithUpdate = async (
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

    const sendingData = this.#converter.pick(
      data,
      "nome",
      "descricao",
      "privado"
    );
    transaction.set(newDocRef, sendingData);

    return newDocRef;
  };
}
