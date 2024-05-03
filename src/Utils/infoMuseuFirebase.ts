import { getDownloadURL } from "firebase/storage";
import { InfoMuseu } from "../interfaces/InfoMuseu";;
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'

async function getInfoMuseu(id:string) {
  try {
    const db = getFirestore()
    const query = collection(db, "informações-museu")
    const collections = await getDocs(query)
    const data = collections.docs.map(doc => doc.data())[0]

    return data
  }
  catch (error) {
    console.log(error)
  }
}

async function atualizarInfoMuseu(id: string) {

}

function adicionarInfoMuseu(info: InfoMuseu) {

}

function deletarInfoMuseu(id:string) {

}

const wrapper = {
  getInfoMuseu,
  atualizarInfoMuseu,
  adicionarInfoMuseu,
  deletarInfoMuseu
};

export default wrapper;
