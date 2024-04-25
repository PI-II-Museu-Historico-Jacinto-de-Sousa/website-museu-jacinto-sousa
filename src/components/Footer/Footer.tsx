import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import PlaceIcon from '@mui/icons-material/Place'
import { Theme, styled } from '@mui/material'
import { getAuth } from 'firebase/auth'
import { app } from '../../../firebase/firebase'
import { useEffect, useState } from 'react'
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'

interface IFooterData{
    telephone: string,
    whatsapp: string,
    email: string,
    address: string
}

const Footer = () => {

    //states of component

    const [edit, setEdit] = useState(false)

    const [logged, setLogged] = useState(false)
    
    const [footerData, setFooterData] = useState<IFooterData>({
        telephone: '',
        whatsapp: '',
        email: '',
        address: ''
    })

    const [newTelephone, setNewTelephone] = useState("")
    const [newWhatsapp, setNewWhatsapp] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newAddress, setNewAddress] = useState("")

    const startEdit = () =>{
        setEdit(true)
    }
    
    const cancelEdit = () =>{
        setEdit(false)
    }

    const applyEdit = async () =>{
        setFooterData({
            telephone: newTelephone,
            whatsapp: newWhatsapp,
            email: newEmail,
            address: newAddress
        })

        submitToFirestore()

        setEdit(false)
    }

    //comunicate with firestore
    
    const getCollection = async () =>{
        try {
            const db = getFirestore()
            const queryFooter = collection(db, "informações-museu")
            const collections = await getDocs(queryFooter)
            const data = collections.docs.map(doc => doc.data())[0]
            setFooterData(data as IFooterData)
        } 
        catch(error){
            console.log(error)
        }
    }
    
    const submitToFirestore = async () =>{
        console.log(footerData)
        try{
            const db = getFirestore()
            await setDoc(doc(db, "informações-museu", "footer"), footerData)
        }
        catch(error){
            console.log(error)
        }
    }
    
    //render time
    
    useEffect(() => {
        const auth = getAuth(app)
    
        auth.onAuthStateChanged((user) => {
            setLogged(user ? true : false)
        })

        getCollection()
    }, [])
    
    return (
        <FooterContainer>
            { edit ?
            
            // component apply to edition

            <>
                <FooterContent>
                    <FooterItem>
                        <PhoneIcon sx={{fontSize: '3vh', marginRight: '1vw'}}/>
                        <TextField type='text' value={newTelephone} onChange={(e) => setNewTelephone(e.target.value)}/>
                    </FooterItem>

                    <FooterItem>
                        <WhatsAppIcon sx={{fontSize: '3vh', marginRight: '1vw'}}/>
                        <TextField type='text' value={newWhatsapp} onChange={(e) => setNewWhatsapp(e.target.value)}/>
                    </FooterItem>

                    <FooterItem>
                        <EmailIcon sx={{fontSize: '3vh', marginRight: '1vw'}}/>
                        <TextField type='text' value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                    </FooterItem>

                    <FooterItem>
                        <PlaceIcon sx={{fontSize: '3vh', marginRight: '1vw'}}/>
                        <TextField type='text' value={newAddress} onChange={(e) => setNewAddress(e.target.value)}/>
                    </FooterItem>
                </FooterContent>

                <FooterEditable>
                    <EditableButton onClick={() => applyEdit()}><strong>(Salvar)</strong></EditableButton>

                    <EditableButton onClick={() => cancelEdit()}><strong>(Cancelar)</strong></EditableButton>
                </FooterEditable>
            </>

            :

            // component out of edition
            
            <>
                <FooterContent>
                    <FooterItem>
                        <PhoneIcon sx={{fontSize: '3vh', marginRight: '1vw'}}/>
                        {footerData.telephone}
                    </FooterItem>

                    <FooterItem>
                        <WhatsAppIcon sx={{fontSize: '3vh', marginRight: '1vw'}} />
                        {footerData.whatsapp}
                    </FooterItem>

                    <FooterItem>
                        <EmailIcon sx={{fontSize: '3vh', marginRight: '1vw'}} />
                        {footerData.email}
                    </FooterItem>

                    <FooterItem>
                        <PlaceIcon sx={{fontSize: '3vh', marginRight: '1vw'}} />
                        {footerData.address}
                    </FooterItem>
                </FooterContent>

                {
                    logged ?

                    <FooterEditable>
                        <EditableButton onClick={() => startEdit()}><strong>(Editar)</strong></EditableButton>
                    </FooterEditable>
                    :
                    ''
                }

            </>
            }
        </ FooterContainer>
    )
}

const FooterContainer = styled('footer')(({theme}: {theme:Theme}) =>({
    position: 'absolute',
    height: 'fit-content',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    transform: 'translateX(-50%)',
    left: '50%',
    bottom: '0',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.outline.main
}))

const FooterContent = styled('div')(() =>({
    position: 'relative',
    top: '0',
    display: 'flex',
    width: '100%',
    height: '9%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexShrink: '0',

    '@media screen and (max-width: 600px)':{
        flexDirection: 'column',
        height: 'auto'
    }
}))

const FooterItem = styled('li')(({theme}: {theme:Theme}) =>({
    listStyleType: 'none',
    fontSize: '2.5vh',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    padding: '1.5vh',
    color: theme.palette.onSurface.main
}))

const FooterEditable = styled('div')(({theme}: {theme:Theme}) =>({
    position: 'relative',
    width: '100%',
    height: '10%',
    bottom: '0',
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex',
    color: theme.palette.onSurface.main
}))

const EditableButton = styled('button')(({theme}: {theme:Theme}) =>({
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '2.5vh',
    color: theme.palette.onSurface.main
}))

const TextField = styled('input')(() => ({
    backgroundColor: 'white',
    color: 'black',
    borderStyle: 'hidden',
    outline: 'none',
    padding: '1vh',
    fontSize: '2vh',
    
    '@media screen and (min-width: 600px)':{
        width: '15vw'
    },

    '@media screen and (max-width: 600px)':{
        with: '50vw',
        height: 'auto'
    }
}))

export default Footer