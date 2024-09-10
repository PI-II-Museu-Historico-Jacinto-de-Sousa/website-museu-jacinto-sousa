import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../firebase/firebase";
import Stack from "@mui/material/Stack";
import { Theme, styled } from "@mui/material/styles";
import useTheme from "@mui/material/styles/useTheme";
import { Button, Divider, Typography } from "@mui/material";
import SlidingBanner from "../components/SlidingBanner/SlidingBanner";
import SnippetMaps from "../components/SnippetMaps/SnippetMaps";
import InfoSection from "../components/InfoSection/InfoSection";
import { adicionarImagemHome, atualizarAltImagemHome, deletarInfoMuseu, getImagensHome, removerImagemHome } from "../Utils/infoMuseuFirebase";
import useInfoSection from "../hooks/useInfoSection";
import Imagem from "../interfaces/Imagem";

const Home = () => {
const theme = useTheme()

const [logged, setLogged] = useState<boolean>(false)

const [imagensSlidingBanner, setImagensSlidingBanner] = useState<Imagem[]>([])

const [infoIds, setInfoIds] = useState<string[]>([])

const [createInfoSectionsCount, setCreateInfoSectionsCount] = useState<number>(0)

const inputRef = useRef<HTMLInputElement>(null)

const ids = useInfoSection()


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

const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) =>{
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

const propsBanner = {
  images: imagensSlidingBanner,
  addImage: addImage,
  editAlt: ediAlt,
  removeImage: removeImage
}

// Get infoSections ids, images in home and set logged satate in the first render
useEffect(() =>{
  auth.onAuthStateChanged((user) =>{
    setLogged(user ? true : false)
  })

  if(infoIds.length === 0){
    ids.getInfoMuseuIds()
    .then( 
      ids => setInfoIds(ids)
    )
    .catch(
      error => console.log(error)
    )
  }
  
  if(imagensSlidingBanner.length === 0){
    getImagensHome()
    .then((images) =>{
      setImagensSlidingBanner(images)
    })
    .catch(
      error => console.log(error)
    )
  }

},[])

return (
  <Content data-cy="page-content">
    <Heading sx={{display: 'flex', alignItems: 'center'}}>
      <Typography 
        variant="displayLarge" 
        color={theme.palette.onPrimaryContainer.main} 
        alignSelf={'center'}
        sx={{textAlign: 'center'}}
      >
        Museu Histórico Jacinto de Sousa
      </Typography>
      <SlidingBanner {...propsBanner} />
      <input
        id="input-file"
        type="file"
        ref={inputRef}
        accept="images/*"
        onChange={handleChangeImage}
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
      {logged &&
        <Button
          variant="contained"
          sx={{ 
            maxWidth: '200px', 
            borderRadius: '50px',
            alignSelf: 'center'
          }}
          color="primary"
          onClick={() => setCreateInfoSectionsCount((previous) => previous + 1)}
          data-cy="add-info-section"
        >
          Adicionar Informação
        </Button>
      }
      {
        [...Array(createInfoSectionsCount)].map((_, index) =>{
          return(
            <InfoSection key={`InfoSection${index}`} id={null} removeCallback={(id) =>{
              if(id) deletarInfoMuseu(id as string)
              setCreateInfoSectionsCount((previus) => previus - 1)
            }}/>
          )
        })
      }
      {
        infoIds.map(id =>{
          return(
            <InfoSection key={id} id={id} removeCallback={(id) =>{
              if(id) deletarInfoMuseu(id as string)
              setCreateInfoSectionsCount((previus) => previus - 1)
            }}/>
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
