import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import { FirebaseError } from "firebase/app"

const useInfoSection = () =>{

    async function getInfoMuseuIds(){
        try {
            const itemRef = collection(db, "informacoes-museu/home", "itens")
            const docSnap = await getDocs(itemRef)
            .catch(() =>{
            throw new FirebaseError("Erro ao buscar documentos", "not-found")
        })

        if(docSnap.docs.length === 0){
            throw new Error("Documentos não encontrados")
        }

        const idsMuseu = docSnap.docs.map(doc => doc.id)

        return idsMuseu

        } catch (error) {
            throw new FirebaseError("Documentos não encontrados", "not-found")
        }
    }
    
    return{
        getInfoMuseuIds
    }
}

export default useInfoSection