import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import PlaceIcon from '@mui/icons-material/Place'
import { Theme, styled, useMediaQuery} from '@mui/material'
import { getAuth } from 'firebase/auth'
import { app } from '../../../firebase/firebase'
import { useEffect, useState } from 'react'
import { ThemeContext, useTheme } from '@emotion/react'

const Footer = ({ telephone, whatsapp, email, address }: { telephone: string, whatsapp: string, email: string, address: string }) => {
    const [applyEdit, setApplyEdit] = useState(false)
    
    const [telephoneEditable, setTelephoneEditable] = useState("")
    const [whatsappEditable, setWhatsappEditable] = useState("")
    const [emailEditable, setEmailEditable] = useState("")
    const [addressEditable, setAddressEditable] = useState("")

    const [newTelephone, setNewTelephone] = useState("")
    const [newWhatsapp, setNewWhatsapp] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newAddress, setNewAddress] = useState("")

    useEffect(() =>{
        setTelephoneEditable(telephone)
        setWhatsappEditable(whatsapp)
        setEmailEditable(email)
        setAddressEditable(address)
    }, [])

    const startEdition = () =>{
        setNewTelephone(telephoneEditable)
        setNewWhatsapp(whatsappEditable)
        setNewEmail(emailEditable)
        setNewAddress(addressEditable)

        setApplyEdit(true)
    }
    
    const endEdition = () =>{
        setTelephoneEditable(newTelephone)
        setWhatsappEditable(newWhatsapp)
        setEmailEditable(newEmail)
        setAddressEditable(newAddress)

        setApplyEdit(false)
    }

    const auth = getAuth(app)
    
    return (
        <>
            { applyEdit ?
            
            // component apply to edition

            <FooterContainer>
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
                    <EditableButton onClick={() => endEdition()}><strong>(Salvar)</strong></EditableButton>

                    <EditableButton onClick={() => setApplyEdit(false)}><strong>(Cancelar)</strong></EditableButton>
                </FooterEditable>
            </FooterContainer>

            :

            // component out of edition
            
            <FooterContainer>
                <FooterContent>
                    <FooterItem>
                        <PhoneIcon sx={{fontSize: '3vh', marginRight: '1vw'}}/>
                        {telephoneEditable}
                    </FooterItem>

                    <FooterItem>
                        <WhatsAppIcon sx={{fontSize: '3vh', marginRight: '1vw'}} />
                        {whatsappEditable}
                    </FooterItem>

                    <FooterItem>
                        <EmailIcon sx={{fontSize: '3vh', marginRight: '1vw'}} />
                        {emailEditable}
                    </FooterItem>

                    <FooterItem>
                        <PlaceIcon sx={{fontSize: '3vh', marginRight: '1vw'}} />
                        {addressEditable}
                    </FooterItem>
                </FooterContent>

                {
                    auth.currentUser ?

                    <FooterEditable>
                        <EditableButton onClick={() => startEdition()}><strong>(Editar)</strong></EditableButton>
                    </FooterEditable>
                    :
                    ''
                }

            </FooterContainer>
            }
        </>
    )
}

const FooterContainer = styled('div')(({theme}: {theme:Theme}) =>({
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