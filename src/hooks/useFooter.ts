import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { footerData } from "../interfaces/footerData"
import { useState } from "react"

const COLLECTION_REF = 'informacoes-museu'

const useFooter = () => {
  
  const [dataLess, setDataLess] = useState(false)
  
  const [footerDatas, setFooterData] = useState<footerData>({
    address: '',
    email: '',
    instagram: '',
    telephone: '',
    whatsapp: ''
  })
  
  const getFooterData = async () => {
    try {
      const db = getFirestore()
      const footerRef = doc(db, COLLECTION_REF, "footer")

      await getDoc(footerRef).then((footerDoc) => {
        if (!footerDoc.exists()) {
          setDataLess(true)
          return
        }
        const data = footerDoc.data()
        setFooterData(data as footerData)
      })
      .catch(() => {
        setDataLess(true)
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const submitFooterData = async (newFooterData: footerData) => {
    try {
      const db = getFirestore()
      await setDoc  (doc(db, COLLECTION_REF, "footer"), newFooterData)
      setFooterData(newFooterData)
    }
    catch (error) {
      console.log(error)
    }
  }

  return{ 
    footerDatas,
    setFooterData,
    dataLess,
    setDataLess,
    getFooterData,
    submitFooterData 
  }
}

export default useFooter