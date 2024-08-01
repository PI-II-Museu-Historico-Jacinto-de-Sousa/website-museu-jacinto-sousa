import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import PlaceIcon from '@mui/icons-material/Place'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram';
import { TextField, Theme, Typography, styled} from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { app } from '../../../firebase/firebase'
import useFooter from '../../hooks/useFooter'
import { Link } from 'react-router-dom';

const Footer = () => {
  //states of component

  const [edit, setEdit] = useState(false)

  const [logged, setLogged] = useState(false)

  const theme = useTheme()

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const footerElements = useFooter()

  const [newInstagram, setNewInstagram] = useState(footerElements.footerDatas.instagram)
  const [newTelephone, setNewTelephone] = useState(footerElements.footerDatas.telephone)
  const [newWhatsapp, setNewWhatsapp] = useState(footerElements.footerDatas.whatsapp)
  const [newEmail, setNewEmail] = useState(footerElements.footerDatas.email)
  const [newAddress, setNewAddress] = useState(footerElements.footerDatas.address)

  const startEdit = () => {
    setNewInstagram(footerElements.footerDatas.instagram)
    setNewTelephone(footerElements.footerDatas.telephone)
    setNewWhatsapp(footerElements.footerDatas.whatsapp)
    setNewEmail(footerElements.footerDatas.email)
    setNewAddress(footerElements.footerDatas.address)

    setEdit(true)
  }

  const cancelEdit = () => {
    setEdit(false)
  }

  const applyEdit = async () => {
    const newFooterData = {
      address: newAddress,
      email: newEmail,
      instagram: newInstagram,
      telephone: newTelephone,
      whatsapp: newWhatsapp
    }
    footerElements.submitFooterData(newFooterData)
    cancelEdit()
  }

  //render time

  useEffect(() => {
    const auth = getAuth(app)

    auth.onAuthStateChanged((user) =>{
      setLogged(user ? true : false)
      console.log(user)
    })

    footerElements.getFooterData()
  }, [])

  if (footerElements.dataLess === true) {
    return (
      <FooterContainer data-cy='footer-container' sx={{ height: '6vh' }}>
        <Typography sx={{ fontSize: '3vh' }}>
          Erro ao carregar informações do rodapé
        </Typography>
      </FooterContainer>
    )
  }
  else {
    return (
      <FooterContainer data-cy='footer-container'>
        {edit ?

          // component apply to edition

          <>
          <FooterContent style={{flexDirection: mobile ? "column" : "row"}}>
              <SocialContent>
                <Typography style={{fontSize: '2.3vh', textAlign: "center"}} color={theme.palette.onPrimary.main}><strong>Museu Histórico Jacinto de Sousa</strong></Typography>
                <FooterItem>
                  <InputFiled data-cy='footer-text-field' label='Link' id='outlined-size-small' multiline maxRows={2} size='small' value={newInstagram} onChange={(e) => setNewInstagram(e.target.value)}/>
                </FooterItem>
              </SocialContent>

              <ContactContent>
                <Typography style={{fontSize: '2.3vh'}} color={theme.palette.onPrimary.main}><strong>Fale conosco</strong></Typography>
                <FooterItem>
                  <InputFiled data-cy='footer-text-field' label='Telefone' id='outlined-size-small' multiline maxRows={1} size='small' value={newTelephone} onChange={(e) => setNewTelephone(e.target.value)}/>
                </FooterItem>

                <FooterItem>
                  <InputFiled data-cy='footer-text-field' label='Whatsapp' id='outlined-size-small' multiline maxRows={1} size='small' value={newWhatsapp} onChange={(e) => setNewWhatsapp(e.target.value)}/>
                </FooterItem>

                <FooterItem>
                  <InputFiled data-cy='footer-text-field' label='Email' id='outlined-size-small' multiline maxRows={1} size='small' value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                </FooterItem>
              </ContactContent>

              {/* //Need to define routes */}
              <AboutContent style={{marginTop: mobile ? "15vh" : ""}}>
                <Typography style={{fontSize: '2.3vh'}} color={theme.palette.onPrimary.main}><strong>Conheça o museu</strong></Typography>
                {
                  mobile ?
                  ""
                  :
                  <>
                    <Link to='/' style={{textDecoration: 'none', color: `${theme.palette.onPrimary.main}`, marginTop: '1vh'}}>
                      <Typography style={{fontSize: '1.5vh', textDecoration: 'underline'}}>Últimas exposições</Typography>
                    </Link>
                    <Link to='/' style={{textDecoration: 'none', color: `${theme.palette.onPrimary.main}`, marginTop: '1vh'}}>
                      <Typography style={{fontSize: '1.5vh', textDecoration: 'underline'}}>Acervo</Typography>
                    </Link>
                    <Link to='/' style={{textDecoration: 'none', color: `${theme.palette.onPrimary.main}`, marginTop: '1vh'}}>
                      <Typography style={{fontSize: '1.5vh', textDecoration: 'underline'}}>Editais e normas</Typography>
                    </Link>
                  </>
                }
                <FooterItem>
                  <InputFiled data-cy='footer-text-field' label='Endereço' id='outlined-size-small' multiline maxRows={2} size='small' value={newAddress} onChange={(e) => setNewAddress(e.target.value)}/>
                </FooterItem>
              </AboutContent>
            </FooterContent>

            <FooterEditable>
              <EditableButton onClick={() => applyEdit()}>
                <Typography>Editar</Typography>
              </EditableButton>

              <EditableButton onClick={() => cancelEdit()}>
                <Typography>Cancelar</Typography>
              </EditableButton>
            </FooterEditable>
          </>

          :

          // component out of edition

          <>
            <FooterContent style={{flexDirection: mobile ? "column" : "row"}}>
              <SocialContent>
                <Typography style={{fontSize: '2.3vh', textAlign: "center"}} color={theme.palette.onPrimary.main}><strong>Museu Histórico Jacinto de Sousa</strong></Typography>
                <FooterItem>
                  <AddressLink href={newInstagram} target='blank' style={{marginTop: mobile ? "3.5vh" : ""}}>
                    <InstagramIcon sx={{position: 'relative', fontSize: '2.5vh', color: `${theme.palette.onPrimary.main}`}}/>
                  </AddressLink>
                </FooterItem>
              </SocialContent>

              <ContactContent>
                <Typography style={{fontSize: '2.3vh'}} color={theme.palette.onPrimary.main}><strong>Fale conosco</strong></Typography>
                <FooterItem sx={{marginTop: "3vh"}}>
                  <PhoneIcon sx={{fontSize: '2.5vh', marginRight: '0.5vw' }} />
                  <Typography style={{fontSize: '1.5vh'}}>{footerElements.footerDatas.telephone}</Typography>
                </FooterItem>

                <FooterItem sx={{marginTop: "3vh"}}>
                  <WhatsAppIcon sx={{ fontSize: '2.5vh', marginRight: '0.5vw' }} />
                  <Typography style={{fontSize: '1.5vh'}}>{footerElements.footerDatas.whatsapp}</Typography>
                </FooterItem>

                <FooterItem sx={{marginTop: "3vh"}}>
                  <EmailIcon sx={{ fontSize: '2.5vh', marginRight: '0.5vw' }} />
                  <Typography style={{fontSize: '1.5vh'}}>{footerElements.footerDatas.email}</Typography>
                </FooterItem>
              </ContactContent>

              {/* //Need to define routes */}
              <AboutContent>
                <Typography style={{fontSize: '2.3vh'}} color={theme.palette.onPrimary.main}><strong>Conheça o museu</strong></Typography>
                <Link to='/' style={{textDecoration: 'none', color: `${theme.palette.onPrimary.main}`, marginTop: '2vh'}}>
                  <Typography style={{fontSize: '1.5vh', textDecoration: 'underline'}}>Últimas exposições</Typography>
                </Link>
                <Link to='/' style={{textDecoration: 'none', color: `${theme.palette.onPrimary.main}`, marginTop: '2vh'}}>
                  <Typography style={{fontSize: '1.5vh', textDecoration: 'underline'}}>Acervo</Typography>
                </Link>
                <Link to='/' style={{textDecoration: 'none', color: `${theme.palette.onPrimary.main}`, marginTop: '2vh'}}>
                  <Typography style={{fontSize: '1.5vh', textDecoration: 'underline'}}>Editais e normas</Typography>
                </Link>
                <FooterItem>
                  <PlaceIcon sx={{ fontSize: '2.5vh', marginRight: '0.5vw' }} />
                  <Typography style={{fontSize: '1.5vh'}}>{footerElements.footerDatas.address}</Typography>
                </FooterItem>
              </AboutContent>
            </FooterContent>
            {
              logged ?

                <FooterEditable>
                  <EditableButton onClick={() => startEdit()} data-cy='footer-edit-button'>
                    <Typography>Editar informações</Typography>
                  </EditableButton>
                </FooterEditable>
                :
                ''
            }
          </>
        }
        <hr style={{position: 'relative', width: '100%', margin: 'auto', color: `${theme.palette.onPrimary.main}`}}/>
        <CopyRightSection>
          <Typography style={{position: 'relative', color: theme.palette.onPrimary.main}}>Copyright © 2024</Typography>
        </CopyRightSection>
      </ FooterContainer>
    )
  }
}

const FooterContainer = styled('footer')(({ theme }: { theme: Theme }) => ({
  bottom: '0',
  height: 'fit-content',
  width: '100%',
  flexDirection: 'column',
  flexWrap: 'wrap',
  
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',

  background: theme.palette.primary.main,
  padding: `${theme.spacing(2)}`,
}))

const FooterContent = styled('address')(() => ({
  position: 'relative',
  top: '0',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: '0',
}))


const AddressLink = styled('a')(({theme} : {theme:Theme}) =>({
  position: 'relative',
  border: `1px solid ${theme.palette.onPrimary.main}`,
  borderRadius: '50%',
  height: 'fit-content',
  aspectRatio: '1/1',
  textDecoration: 'none',
  color: 'inherit',

  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',

  padding: `${theme.spacing(1)}`,
}))

const SocialContent = styled('section')(() =>({
  position: 'relative',
  height: '25vh',
  width: '30vw',

  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
}))


const ContactContent = styled('address')(() =>({
  position: 'relative',
  height: '25vh',
  width: '30vw',

  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
}))

const AboutContent = styled('section')(() =>({
  position: 'relative',
  height: '25vh',
  width: '30vw',

  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
}))


const FooterItem = styled('li')(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  listStyleType: 'none',
  height: 'fit-content',
  
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',

  color: theme.palette.onPrimary.main,

  marginTop: '1.5vh'
}))

const FooterEditable = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  width: '100%',
  height: '10%',
  bottom: '0',
  justifyContent: 'center',
  alignContent: 'center',
  display: 'flex',
  color: theme.palette.onSurface.main
}))

const EditableButton = styled('button')(({ theme }: { theme: Theme }) => ({
  cursor: 'pointer',
  fontSize: '2.5vh',
  
  border: 'none',
  borderRadius: '40px',

  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  margin: '1.5vh',
  
  background: 'none',
  backgroundColor: theme.palette.tertiary.main,
  color: theme.palette.onPrimary.main,
}))

const InputFiled = styled(TextField)(({theme}: {theme: Theme}) =>({
  '& label.Mui-focused':{
    color: theme.palette.onPrimary.main
  },
  '& label':{
    color: theme.palette.onPrimary.main,
  },
  '& .MuiInputBase-input':{
    color: theme.palette.onPrimary.main,
    fontSize: '2vh'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.onPrimary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.onPrimary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.onPrimary.main,
    },
  },
}))

const CopyRightSection = styled('section')(({theme}: {theme: Theme}) =>({
  height: "fit-content",
  width: "100%",

  justifyContent: "center",
  alignItems: "center",
  display: "flex",

  padding: `${theme.spacing(1)}`,
}))

export default Footer