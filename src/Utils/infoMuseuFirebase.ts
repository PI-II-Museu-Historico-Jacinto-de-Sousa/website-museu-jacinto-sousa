import { deleteObject, getDownloadURL, getMetadata, ref, updateMetadata, uploadBytesResumable } from "firebase/storage";
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
      throw new Error("Documento nao existe!");
    }
    const dataMuseu = docSnap.data();
    const url = await getDownloadURL(ref(storage, `images/${dataMuseu.imagem}`)).catch(() => {
      throw new FirebaseError("Imagem não encontrada", "not-found");
    });
    const imagemRef = ref(storage, `images/${dataMuseu.imagem}`);
    const metadata = await getMetadata(imagemRef).catch(() => {
      throw new FirebaseError("Metadados não encontrados", "not-found");
    });
    const imagem = {src: url, title: metadata?.name , alt: metadata?.customMetadata?.alt===undefined ? "" : metadata.customMetadata.alt};
    dataMuseu.imagem = imagem;

    return {...dataMuseu} as InfoMuseu;
  }
  catch (error) {
    // Relançar o erro para ser tratado externamente
    throw new FirebaseError("Documento não encontrado", "not-found");
  }
}


async function atualizarInfoMuseu(id:string, info: InfoMuseu) {
    try {
      const docRef = doc(db, "informações-museu", id);
      const docSnap = await getDoc(docRef).catch(() => {
        throw new FirebaseError("Erro ao buscar documento", "not-found");
      });
      if(!docSnap.exists()) {
        return Error("Documento não encontrado");
      } else {
        if(info.imagem.src instanceof File) {
          const data = docSnap.data();
          if (data) {
            const imagemRef = ref(storage, `images/${data.imagem}`);
            await deleteObject(imagemRef);
          }
          const storageRef = ref(storage, `images/${info.imagem.src.name}`);
          await uploadBytesResumable(storageRef, info.imagem.src).catch(() => {
            throw new FirebaseError("Erro ao adicionar imagem", "not-found");
          });
          const metadata = {customMetadata: {alt: info.imagem.alt}}
          updateMetadata (storageRef, metadata).catch(() => {
            throw new FirebaseError("Erro ao adicionar metadados", "not-found");
          });
          const file = {nome: info.nome, texto: info.texto, imagem: info.imagem.src.name};
          await updateDoc(docRef, file).catch(() => {
            throw new FirebaseError("Erro ao atualizar documento", "not-found");
          })
        } else {
          throw new FirebaseError("Sem imagem para adicionar", "no-image");
        }
      }
    } catch (error) {
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

      const storageRef = ref(storage, `images/${info.imagem.src.name}`);

      // 'file' comes from the Blob or File API
      await uploadBytesResumable(storageRef, info.imagem.src).catch(() => {
        throw new FirebaseError("Erro ao adicionar imagem", "not-found");
      });
      const metadata = {customMetadata: {alt: info.imagem.alt}}
      updateMetadata (storageRef, metadata).catch(() => {
        throw new FirebaseError("Erro ao adicionar metadados", "not-found");
      });
    } else {
      throw new FirebaseError("Sem imagem para adicionar", "no-image");
    }
  } catch (error) {
    throw new FirebaseError("Erro ao adicionar documento", "not-found");
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
