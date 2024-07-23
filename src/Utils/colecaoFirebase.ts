import {
  DocumentData,
  QuerySnapshot,
  collection,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { Colecao } from "../interfaces/Colecao";

const COLLECTION_REF = "colecoes";

export const getColecoes = async (): Promise<Colecao[]> => {
  const privateCollectionsRef = collection(db, COLLECTION_REF, "privado/lista");
  const publicCollectionsRef = collection(db, COLLECTION_REF, "publico/lista");
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

    return collections.map((doc) => doc.data() as Colecao);
  } catch (error) {
    throw new Error("Erro ao buscar as coleções de itens");
  }
};
