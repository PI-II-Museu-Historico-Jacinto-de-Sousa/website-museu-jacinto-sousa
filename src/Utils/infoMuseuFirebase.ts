import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytesResumable } from "firebase/storage";
import { InfoMuseu } from "../interfaces/InfoMuseu";;
import { collection, doc, setDoc, getDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { FirebaseError } from "firebase/app";
import { db, storage } from '../../firebase/firebase'

async function getInfoMuseu(id: string) {
  try {
    const docRef = doc(db, "informações-museu", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      getDownloadURL(ref(storage, id)).then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        return {data, url}

      }).catch((error) => {
        throw error;
      })
      return docSnap
    } else {
      // Se o documento não existir, lançar um erro
      throw new FirebaseError("No such document!", "not-found");
    }
  } catch (error) {
    // Relançar o erro para ser tratado externamente
    throw error;
  }
}


async function atualizarInfoMuseu(info: InfoMuseu) {
    try {
      if(info.imagem.src instanceof File) {
        const imagemRef = ref(storage, `imagens/${info.imagem.title}`);
        const uploadTask = uploadBytesResumable(imagemRef, new File([info.imagem.src], info.imagem.title, { type: 'image/png' }));
      } else {
        return new FirebaseError("No image to update", "no-image");
      }

    } catch (error) {
      throw error;
    }
  }

async function adicionarInfoMuseu(info: InfoMuseu) {
  try {
    if(info.imagem.src instanceof File) {
      const imagemRef = ref(storage, `imagens/${info.imagem.title}`);
      const uploadTask = uploadBytesResumable(imagemRef, new File([info.imagem.src], info.imagem.title, { type: 'image/png' }));
      const snapshot = await uploadTask;

      const downloadURL = await getDownloadURL(snapshot.ref);
      const metadata = await getMetadata(snapshot.ref);

      const docRef = await addDoc(collection(db, "informações-museu"), {
        nome: info.nome,
        texto: info.texto,
        itemImagens: downloadURL
      });

      return docRef;
    } else {
      return new FirebaseError("No image to add", "no-image");
    }
  } catch (error) {
    throw error;
  }
}

async function deletarInfoMuseu(id: string) {
  try {
    const docRef = doc(db, "informações-museu", id);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Deletar o documento
      await deleteDoc(docRef);

      // Se o documento existia, também delete a imagem associada
      const data = docSnap.data();
      if (data && data.itemImagens) {
        const imagemRef = ref(storage, data.itemImagens);
        await deleteObject(imagemRef);
      }
    } else {
      return new FirebaseError("No such document!", "not-found");
    }
  } catch (error) {
    throw error;
  }
}

const infoMuseuMethods = {
  getInfoMuseu,
  atualizarInfoMuseu,
  adicionarInfoMuseu,
  deletarInfoMuseu
};

export {infoMuseuMethods, getInfoMuseu, atualizarInfoMuseu, adicionarInfoMuseu, deletarInfoMuseu}
