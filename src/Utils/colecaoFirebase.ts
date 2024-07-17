import {
  DocumentData,
  QuerySnapshot,
  collection,
  doc,
  getDocs,
} from "firebase/firestore/lite";
import { auth, db } from "../../firebase/firebase";

const COLLECTION_REF = "colecoes";

export const getNomesColecoes = async (): Promise<string[]> => {
  const privateDocRef = doc(db, COLLECTION_REF, "privado");
  const publicDocRef = doc(db, COLLECTION_REF, "publico");
  try {
    let privateCollections:
      | QuerySnapshot<DocumentData, DocumentData>
      | undefined = undefined;
    if (auth.currentUser !== null) {
      privateCollections = await getDocs(collection(privateDocRef, "itens"));
    }
    const publicCollections = await getDocs(collection(publicDocRef, "itens"));

    const collections = privateCollections
      ? publicCollections.docs.concat(privateCollections.docs)
      : publicCollections.docs;

    return collections.map((doc) => doc.data().nome);
  } catch (error) {
    throw new Error("Erro ao buscar as coleções de itens");
  }
};
