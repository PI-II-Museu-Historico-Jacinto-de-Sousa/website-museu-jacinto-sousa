import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const getNomesColecoes = async (): Promise<string[]> => {
  const collectionsRef = collection(db, "coleções");
  try {
    const collections = await getDocs(collectionsRef);
    return collections.docs.map((doc) => doc.data().nome);
  } catch (error) {
    throw new Error("Erro ao buscar as coleções de itens");
  }
};
