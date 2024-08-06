import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../firebase/firebase";
import Stack from "@mui/material/Stack";
import { Theme, styled } from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";
import { Button, Divider, Typography } from "@mui/material";
import SlidingBanner from "../components/SlidingBanner/SlidingBanner";
import SnippetMaps from "../components/SnippetMaps/SnippetMaps";
import InfoSection from "../components/InfoSection/InfoSection";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { adicionarImagemHome, atualizarAltImagemHome, getImagensHome, removerImagemHome } from "../Utils/infoMuseuFirebase";

const Home = () => {
  const theme = useTheme()

  const [logged, setLogged] = useState<boolean>(false)
  
  const [editing, setEditing] = useState<boolean>(false)

  const [imagensSlidingBanner, setImagensSlidingBanner] = useState<Imagem[]>([])

  const [infoIds, setInfoIds] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)


  // Functions for images in Sliding Banner

  const addImage = () =>{
    if(inputRef.current){
      inputRef.current.click()
    }
  }

  const ediAlt = (key: number, altTex: string) =>{
    const updateImages = [...imagensSlidingBanner]
    const newImage = [...imagensSlidingBanner].at(key)

    if(newImage){
      newImage.alt = altTex
      updateImages[key] = newImage
      setImagensSlidingBanner(updateImages)
      atualizarAltImagemHome(newImage)
    }
  }

  const removeImage = (key: number) =>{
    const updateImages = [...imagensSlidingBanner]
    const remove = [...imagensSlidingBanner].at(key)

    if(remove){
      updateImages.splice(key, 1)
      setImagensSlidingBanner(updateImages)
      removerImagemHome(remove.title)
    }
  }

  // Function for OnChange in Input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const file = e.target.files?.[0]

    if(file){
      const newImage: Imagem = {
        src: file,
        title: file.name,
        alt: ""
      }

      setImagensSlidingBanner([...imagensSlidingBanner, newImage])
      adicionarImagemHome(newImage)
    }
  }
  
  // Logic for components in editing mode
  const editSwitchComponents = () =>{
    if(logged){
      if(editing){
        return(
          <>
            <EditInfoButton onClick={() => setEditing(false)}>
              <Typography variant="labelLarge" color={theme.palette.onPrimary.main}>Encerrar edição</Typography>
            </EditInfoButton>
            <InfoSection id={null}/>
          </>
        )
      }
      return(
        <EditInfoButton onClick={() => setEditing(true)}>
          <Typography variant="labelLarge" color={theme.palette.onPrimary.main}>Adicionar campo informativo</Typography>
        </EditInfoButton>
      )
    }
  }
  
  // get ids of InfoSections from firebase
  const getInfoSectionsIds = async () =>{
    try {
      const db = getFirestore()
      const itemRef = collection(db, "informacoes-museu/home", "itens")

      await getDocs(itemRef)
      .then((itemSnapshot) => {
        const itemIds = itemSnapshot.docs.map( doc => doc.id)
        setInfoIds(itemIds)
      })
      .catch(error =>
        console.log(error)
      )

    } catch (error) {
      console.log(error)
    }
  }
  
  // Get infoSections ids, images in home and set logged satate in the first render
  useEffect(() =>{
    auth.onAuthStateChanged((user) =>{
      setLogged(user ? true : false)
    })

    getInfoSectionsIds()
    
    getImagensHome()
    .then((images) =>{
      setImagensSlidingBanner(images)
    })
    .catch(error => console.log(error))
  },[])

  return (
    <Content>
      <Heading>
        <Typography 
          variant="displayLarge" 
          color={theme.palette.onPrimaryContainer.main} 
          alignSelf={'center'}
          sx={{textAlign: 'center'}}
        >
          Museu Histórico Jacinto de Souza
        </Typography>
        <SlidingBanner
          images={imagensSlidingBanner}
          addImage={addImage}
          editAlt={ediAlt}
          removeImage={removeImage}
        />
        <input
          type="file"
          ref={inputRef}
          accept="images/*"
          onChange={handleChange}
          hidden
        />
      </Heading>

      <Info direction={'row'}>
        <SnippetMaps URL=""/>
      </Info>

      <Description 
        direction={'column'} 
        divider={<Divider variant="middle" sx={{width: '288px', background: `${theme.palette.outlineVariant.main}`, alignSelf: 'center'}}/>} 
        spacing={theme.spacing(2)}
      >
        {
          editSwitchComponents()
        }
        {
          infoIds.map(id =>{
            return(
              <InfoSection id={id}/>
            )
          })
        }
      </Description>
    </Content>
  )
};

const Content = styled(Stack)(({ theme }: { theme: Theme}) =>({
  padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
  gap: `${theme.spacing(5)}`,
  alignSelf: 'stretch',
}))

const Heading = styled(Stack)(({ theme }: { theme: Theme }) =>({
  padding: `${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(3)}`,
  gap: `${theme.spacing(3)}`,
  justifyContent: 'center',
  alignItems: 'flex-start',
  alignSelf: 'stretch'
}))

const Info = styled(Stack)(({ theme }: { theme: Theme }) =>({
  padding: `${theme.spacing(2)} ${theme.spacing(5)}`,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
}))

const Description = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  background: `${theme.palette.surfaceContainer.main}`
}))

const EditInfoButton = styled(Button)(({ theme }: { theme: Theme}) =>({  
  height: '40px',
  width: '230px',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  alignSelf: 'center',

  borderRadius: '100px',
  padding: `${theme.spacing(1.2)} ${theme.spacing(3)}`,
  background: `${theme.palette.primary.main}`
}))

export default Home;
