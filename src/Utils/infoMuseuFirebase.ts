import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { InfoMuseu } from "../interfaces/InfoMuseu";
import { collection, doc, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { FirebaseError } from "firebase/app";
import { db, storage } from '../../firebase/firebase'

async function getInfoMuseu(id: string): Promise<InfoMuseu> {
  try {
    const docRef = doc(db, "informações-museu", id);
    const docSnap = await getDoc(docRef).catch(() => {
      throw new FirebaseError("Erro ao buscar documento", "not-found");
    });

    if (!docSnap.exists()) {
      throw new FirebaseError("Documento nao existe!", "not-found");
    }
    const dataMuseu = docSnap.data();
    const url = await getDownloadURL(ref(storage, dataMuseu.imagem)).catch(() => {
      throw new FirebaseError("Imagem não encontrada", "not-found");
    });
    const metadata = await getMetadata(ref(storage, dataMuseu.imagem)).catch(() => {
      throw new FirebaseError("Metadados não encontrados", "not-found");
    });
    const imagem = {src: url, title: metadata?.name , alt: metadata?.customMetadata?.alt===undefined ? "" : metadata.customMetadata.alt};
    dataMuseu.imagem = imagem;
    console.log(dataMuseu);

    return {...dataMuseu} as InfoMuseu;
  }
  catch (error) {
    // Relançar o erro para ser tratado externamente
    console.error(error);
    throw new FirebaseError("Documneto não encontrado", "not-found");
  }
}


async function atualizarInfoMuseu(info: InfoMuseu) {
    try {
      if(info.imagem.src instanceof File) {
        const imagemRef = ref(storage, `images/${info.imagem.title}`);
        const metadata = {customMetadata: {alt: info.imagem.alt}}
        const uploadResult = await uploadBytes(imagemRef, info.imagem.src, metadata).catch((error) => {
          console.error(error);
          throw new FirebaseError("Erro ao atualizar imagem", "not-found");
        });
        const updateInfo = {nome: info.nome, texto: info.texto, imagem : uploadResult.metadata.fullPath};
        const collectionRef = collection(db, "informações-museu");
        const docRef = doc(collectionRef, info.id)
        const updateDocument = await updateDoc( docRef, {updateInfo}).catch((error) => {
          console.error(error);
          throw new FirebaseError("Erro ao atualizar documento", "not-found");
        });
        return updateDocument;
      } else {
        throw new Error("Imagem deve ser um arquivo");
      }

    } catch (error) {
      console.error(error);
      throw new FirebaseError("Erro ao atualizar documento", "not-found");
    }
  }

async function adicionarInfoMuseu(info: InfoMuseu) {
  try {
    if (info.imagem.src instanceof File) {
      const collectionRef = collection(db, "informações-museu")

      const file = {nome: info.nome, texto: info.texto, imagem: info.imagem.src.name};

      await addDoc(collectionRef, file).catch(() => {
        throw new FirebaseError("Erro ao adicionar documento", "not-found");
      })

      const storageRef = ref(storage, `images/${info.imagem.title}`);

      // 'file' comes from the Blob or File API
      uploadBytesResumable(storageRef, info.imagem.src).catch(() => {
        throw new FirebaseError("Erro ao adicionar imagem", "not-found3");
      });
    } else {
      throw new FirebaseError("Sem imagem para adicionar", "no-image");
    }
  } catch (error) {
    console.error(error);
    throw new FirebaseError("Erro ao adicionar documento", "not-found2");
  }
}

async function deletarInfoMuseu(id: string) {
  try {
    const docRef = doc(db, "informações-museu", id);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Deletar a imagem associada
      const data = docSnap.data();
      if (data) {
        const imagemRef = ref(storage, `images/${data.imagem}`);
        await deleteObject(imagemRef);
      } else {
        throw new Error("Erro ao deletar imagem");
      }
      // Deletar o documento
      await deleteDoc(docRef);

      // Se o documento existia, também delete a imagem associada
    } else {
      throw new FirebaseError("No such document!", "not-found");
    }
  } catch (error) {
    throw new FirebaseError("Erro ao deletar documento", "not-found");
  }
}

const infoMuseuMethods = {
  getInfoMuseu,
  atualizarInfoMuseu,
  adicionarInfoMuseu,
  deletarInfoMuseu
};

export {infoMuseuMethods, getInfoMuseu, atualizarInfoMuseu, adicionarInfoMuseu, deletarInfoMuseu}
