import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  runTransaction,
  SnapshotOptions,
  updateDoc,
} from "firebase/firestore";
import { BaseConverter } from "./converter";
import Exposicao from "../interfaces/Exposicao";
import { db, storage } from "../../firebase/firebase";
import { FirebaseError } from "firebase/app";
import { ClientColecoesFirebase } from "./colecaoFirebase";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import Imagem from "../interfaces/Imagem";

class ConverterExposicoesFirebase extends BaseConverter {
  toFirestore(exposicao: Exposicao): DocumentData {
    // convertendo itens do tipo ItemAcervo[] para string[]
    const itensPorColecao: { [key: string]: string[] } = {};
    for (const [key, value] of exposicao.itensPorColecao.entries()) {
      if (value instanceof Array) {
        itensPorColecao[key] = value.map((item) => {
          if (typeof item === "string") return item;
          else {
            return item.id?.split("/").pop() || "";
          }
        });
      } else {
        itensPorColecao[key] = value;
      }
    }
    const excludedKeys = new Set(["id"]);

    const sendingDoc = this.omitSet(exposicao, excludedKeys);
    if (sendingDoc.permanente) {
      excludedKeys.add("dataInicio");
      excludedKeys.add("dataFim");
    } else {
      if (!sendingDoc.dataInicio || !sendingDoc.dataFim) {
        throw new Error(
          "Data de início e fim são obrigatórias para exposições temporárias"
        );
      }
    }
    const imagem = exposicao.imagem?.title.startsWith("images/")
      ? exposicao.imagem?.title
      : "images/" + exposicao.imagem?.title;
    if (exposicao.imagem) {
      sendingDoc.imagem = imagem;
    }
    return {
      ...sendingDoc,
      itensPorColecao,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Exposicao | undefined {
    const data = snapshot.data(options);
    data.dataCriacao = data.dataCriacao.toDate();
    data.dataFim = data.dataFim.toDate();
    data.dataInicio = data.dataInicio.toDate();
    data.itensPorColecao = new Map(Object.entries(data.itensPorColecao));
    if (snapshot.exists()) {
      return { id: snapshot.ref.path, ...data } as Exposicao;
    }
  }
}

export class ClientExposicaoFirebase {
  #converter: ConverterExposicoesFirebase;
  #basePath: string;

  constructor(
    converter?: ConverterExposicoesFirebase,
    basePath: string = "exposicoes"
  ) {
    this.#converter = converter ?? new ConverterExposicoesFirebase();
    this.#basePath = basePath;
  }

  async listarExposicoes(): Promise<Exposicao[]> {
    try {
      const publicCollectionRef = collection(
        db,
        this.#basePath,
        "publico",
        "lista"
      ).withConverter(this.#converter);
      const privateCollectionRef = collection(
        db,
        this.#basePath,
        "privado",
        "lista"
      ).withConverter(this.#converter);
      const dataExposicoesPublicas = await getDocs(publicCollectionRef);
      const dataExposicoesPrivadas = await getDocs(privateCollectionRef);
      const exposicoes: Exposicao[] = [];
      dataExposicoesPublicas.forEach((doc) => {
        if (doc.exists()) {
          exposicoes.push(doc.data()!);
        }
      });
      dataExposicoesPrivadas.forEach((doc) => {
        if (doc.exists()) {
          exposicoes.push(doc.data()!);
        }
      });
      const exposicoesComImagens = await Promise.all(
        exposicoes.map(async (exposicao) => {
          if (exposicao.imagem && typeof exposicao.imagem === "string")
            return {
              ...exposicao,
              imagem: await this.#getImagem(exposicao.imagem),
            };
          else {
            return exposicao;
          }
        })
      );
      return exposicoesComImagens as Exposicao[];
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao listar exposições");
    }
  }

  async getExposicao(
    id: string,
    withItems: boolean = true
  ): Promise<Exposicao> {
    try {
      const docRef = doc(db, id).withConverter(this.#converter);
      const dataExposicao = await getDoc(docRef);
      if (!dataExposicao.exists()) {
        throw new FirebaseError("not-found", "Exposição não encontrada");
      }
      const exposicao = dataExposicao.data() as Exposicao;
      if (exposicao.imagem && typeof exposicao.imagem === "string") {
        const fullImage = await this.#getImagem(exposicao.imagem as string);
        exposicao.imagem = fullImage;
      }
      /**
       * Modifica a lista com ids em cada entrada no mapa para uma lista de itens
       */
      if (withItems) {
        const clientColecoes = new ClientColecoesFirebase();
        const fetchedCollections = Array.from(exposicao.itensPorColecao.keys());
        const colecoes = await clientColecoes.getColecoes(fetchedCollections);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, idsItens] of exposicao.itensPorColecao) {
          if (idsItens instanceof Array) {
            for (const colecao of colecoes) {
              exposicao.itensPorColecao.set(
                colecao.id!,
                await clientColecoes.getItensColecao(
                  colecao,
                  idsItens as string[]
                )
              );
            }
          }
        }
      }
      return exposicao;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao buscar exposição");
    }
  }

  async adicionarExposicao(exposicao: Exposicao): Promise<boolean> {
    try {
      const privacyPath = exposicao.privado ? "privado" : "publico";
      const collectionRef = collection(
        db,
        this.#basePath,
        privacyPath,
        "lista"
      ).withConverter(this.#converter);
      if (!exposicao.dataCriacao) {
        exposicao = { ...exposicao, dataCriacao: new Date() };
      }

      const imagem = exposicao.imagem;
      if (imagem) {
        if (
          !(imagem.src instanceof File && imagem.src.type.includes("image"))
        ) {
          throw Error("Conteúdo da imagem deve ser um arquivo válido");
        }
        const imageRef = ref(storage, "images/" + imagem.title);
        await uploadBytes(imageRef, imagem.src, {
          customMetadata: {
            alt: imagem.alt,
          },
        });
      }
      await addDoc(collectionRef, exposicao);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao adicionar exposição");
    }
  }

  /**
   * Atualiza uma exposição, modifica o id do parâmetro caso a exposição tenha sido movida.
   * Caso uma nova imagem seja passada, a anterior é removida, se não apenas os metadados
   * são atualizados
   * @param exposicao
   */
  async atualizarExposicao(exposicao: Exposicao): Promise<void> {
    if (exposicao.id === undefined) {
      throw new Error("Exposição sem id");
    }
    try {
      const docRef = doc(db, exposicao.id);
      const unmodifiableFields = new Set(["dataCriacao"]);
      const filteredFieldsDoc = this.#converter.omitSet(
        exposicao,
        unmodifiableFields
      ) as Exposicao;
      // converter nao executou diretamente para o metodo de update
      const sendingDoc = this.#converter.toFirestore(filteredFieldsDoc);
      if (sendingDoc.permanente) {
        sendingDoc.dataInicio = deleteField();
        sendingDoc.dataFim = deleteField();
      }

      const oldData = (await getDoc(docRef)).data();
      if (!oldData) {
        throw new FirebaseError("not-found", "Exposição não encontrada");
      }
      if (exposicao.imagem) {
        sendingDoc.imagem = await this.#updateImagem(
          oldData?.imagem,
          exposicao.imagem
        );
      }
      // imagem foi removida
      if (oldData.imagem && !exposicao.imagem) {
        await deleteObject(ref(storage, oldData.imagem));
        sendingDoc.imagem = deleteField();
      }

      if (oldData.privado !== exposicao.privado) {
        const newPrivacyPath = exposicao.privado ? "privado" : "publico";
        const newPath = exposicao.id.replace(
          /(publico|privado)/,
          newPrivacyPath
        );
        await this.#moveExposicao(sendingDoc as Exposicao, newPath);
      } else {
        await updateDoc(docRef, { ...sendingDoc });
      }
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao atualizar exposição");
    }
  }

  async #moveExposicao(
    exposicao: Exposicao,
    newFullPath: string
  ): Promise<void> {
    try {
      const oldRef = doc(db, exposicao.id!).withConverter(this.#converter);
      const newRef = doc(db, newFullPath, exposicao.id!).withConverter(
        this.#converter
      );
      await runTransaction(db, async (transaction) => {
        transaction.delete(oldRef);
        transaction.set(newRef, exposicao);
      });
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao mover exposição");
    }
  }

  async #getImagem(pathImagem: string): Promise<Imagem> {
    const imageRef = ref(storage, pathImagem);
    const url = await getDownloadURL(imageRef);
    const metadata = await getMetadata(imageRef);
    return {
      src: url,
      title: metadata.name,
      alt: metadata?.customMetadata?.alt || "",
    };
  }
  async #addImagem(newImage: Imagem): Promise<string> {
    if (
      !(newImage.src instanceof File && newImage.src.type.includes("image"))
    ) {
      throw Error("Conteúdo da imagem deve ser um arquivo válido");
    }
    const newPath = newImage.title.startsWith("images/")
      ? newImage.title
      : "images/" + newImage.title;
    await uploadBytes(ref(storage, newPath), newImage.src, {
      customMetadata: {
        alt: newImage.alt,
      },
    });
    return newPath;
  }
  /**
   * atualiza uma imagem no firestore, caso nao exista uma imagem  caso o conteudo seja diferente remove a imagem
   * antiga e adiciona a nova
   * @param oldPath caminho da imagem antiga
   * @param newImage conteudo da nova imagem
   *
   * @returns caminho da imagem modificada/adicionada
   */
  async #updateImagem(
    oldPath: string | undefined,
    newImage: Imagem
  ): Promise<string> {
    const oldRef = oldPath ? ref(storage, oldPath) : undefined;
    try {
      // se nao existir imagem antiga, adiciona a nova
      if (oldRef === undefined) {
        return await this.#addImagem(newImage);
      } else {
        const newImagePath = newImage.title.startsWith("images/")
          ? newImage.title
          : "images/" + newImage.title;
        // se a imagem antiga for a mesma que a nova, atualiza somente os metadados
        if (oldPath === newImagePath) {
          const metadata = await getMetadata(oldRef);
          if (metadata.customMetadata?.alt !== newImage.alt) {
            await updateMetadata(oldRef, {
              customMetadata: { alt: newImage.alt },
            });
          }
          return newImagePath;
        }
        // removendo imagem antiga e adicionando uma nova
        else {
          await deleteObject(oldRef);
          return await this.#addImagem(newImage);
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao atualizar imagem");
    }
  }

  async deletarExposicao(id: string): Promise<void> {
    try {
      const docRef = doc(db, id).withConverter(this.#converter);
      const oldDoc = await getDoc(docRef);
      if (!oldDoc.exists()) {
        throw new FirebaseError("not-found", "Exposição não encontrada");
      }

      const oldData = oldDoc.data();
      if (oldData?.imagem && typeof oldData.imagem === "string") {
        await deleteObject(ref(storage, oldData.imagem));
      }
      await deleteDoc(docRef);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao deletar exposição");
    }
  }
}
