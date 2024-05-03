import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { InfoMuseu } from "../interfaces/InfoMuseu";;
import { collection, doc, getFirestore, setDoc, getDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { FirebaseError } from "firebase/app";


async function getInfoMuseu(id: string) {
  try {
    const db = getFirestore()
    const docRef = doc(db, "acervo", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {

      const data =  docSnap.data()
      const storage = getStorage();

      getDownloadURL(ref(storage, data.itemImagens)).then((url) => {
        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        return data
      })
      .catch((error) => {
        console.log(error)
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  catch (error) {
    console.log(error)
  }
}

async function atualizarInfoMuseu(id: string, info: InfoMuseu, novaImagem?: File) {
  try {
    const db = getFirestore();
    const docRef = doc(db, "acervo", id);

    // Verificar se o documento já existe
    const docSnap = await getDoc(docRef);
    const imagemURLAntiga = docSnap.exists() ? docSnap.data().imagemURL : null;

    // Se a nova imagem foi fornecida
    if (novaImagem) {
      // Se existir uma imagem antiga, remova-a
      if (imagemURLAntiga) {
        const storage = getStorage();
        const antigaImagemRef = ref(storage, `imagens/${novaImagem.name}`);
        await deleteObject(antigaImagemRef);
      }

      // Adicionar a nova imagem
      const storage = getStorage();
      const novaImagemRef = ref(storage, `imagens/${novaImagem.name}`);
      await uploadBytesResumable(novaImagemRef, novaImagem);
      info.imagem.src = await getDownloadURL(novaImagemRef);
    } else {
      // Se não houver uma nova imagem, mas existe uma imagem antiga, mantenha-a
      if (imagemURLAntiga) {
        info.imagem.src = imagemURLAntiga;
      }
    }

    // Atualizar o documento no Firestore
    await setDoc(docRef, info, { merge: true });

    console.log("Informações do museu atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar informações do museu:", error);
  }
}

async function adicionarInfoMuseu(info: InfoMuseu) {
  try {
    const db = getFirestore();

    // Adicionar os dados do museu ao Firestore
    const docRef = await addDoc(collection(db, "acervo"), info);

    // Adicionar a imagem ao Storage
    const storage = getStorage();
    const imagemRef = ref(storage, `imagens/${info.imagem}`);
    const uploadTask = uploadBytesResumable(imagemRef, new File([info.imagem.src], info.imagem.title, { type: 'image/png' }));
  } catch (error) {
    console.log(error)
  }
}

async function deletarInfoMuseu(id: string) {
  try {
    const db = getFirestore();
    const docRef = doc(db, "acervo", id);

    // Verificar se o documento existe
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Deletar o documento
      await deleteDoc(docRef);
      console.log("Documento deletado com sucesso!");

      // Se o documento existia, também delete a imagem associada
      const data = docSnap.data();
      if (data && data.itemImagens) {
        const storage = getStorage();
        const imagemRef = ref(storage, data.itemImagens);
        await deleteObject(imagemRef);
        console.log("Imagem deletada com sucesso!");
      }
    } else {
      console.log("O documento não existe.");
    }
  } catch (error) {
    console.error("Erro ao deletar informações do museu:", error);
  }
}

const wrapper = {
  getInfoMuseu,
  atualizarInfoMuseu,
  adicionarInfoMuseu,
  deletarInfoMuseu
};

export {wrapper, getInfoMuseu, atualizarInfoMuseu, adicionarInfoMuseu, deletarInfoMuseu}
