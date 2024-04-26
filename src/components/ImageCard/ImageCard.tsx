import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase"

interface ImageCardProps {
  onClose?: () => void;
  image: Imagem;
}



/**
 * Componente Wrapper para imagens que permite editar o texto alternativo
 * e remover a imagem da lista onde ela é renderizada de acordo com um método onClose.
 * Em vez de passar a url da imagem é preciso passá-la como elemento html para alterar o atributo alt
 */
const ImageCard = ({ image, onClose }: ImageCardProps) => {
  //função padrão que apenas remove o card da tela
  const defaultOnClose = () => {
    document.getElementById(['image-card', image.title].join('-'))?.remove()
  }

  onClose = onClose !== undefined ? onClose : defaultOnClose

  const theme = useTheme()

  const [editable, setEditable] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [alt, setAlt] = useState<string>(image.alt)
  const [sourceError, setSourceError] = useState<boolean>(false)
  const src = image.src

  const toggleEditing = () => {
    setEditing(!editing)
    image.alt = alt ? alt : ""
  }
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setEditable(true)
      }
    })
  })

  return (
    <Card
      id={['image-card', image.title].join('-')}
      sx={{
        maxWidth: 200,
        maxHeight: 350,
        backgroundColor: theme.palette.surface.main,
        padding: `${theme.spacing(0)} ${theme.spacing(0.5)}`,
        spacing: theme.spacing(0),
      }} >
      {!sourceError ?
        <>
          <CardHeader
            disableTypography //necessário para adicionar uma tipografia própria ao título
            title={<Typography variant="labelLarge">{image.title}</Typography>}
            data-cy='image-card-header'
            sx={{ padding: `${theme.spacing(0)} ${theme.spacing(0.5)}`, wordBreak: 'break-word' }} //altura máxima igual a altura da linha em labelLarge
          />
          <CardMedia image={typeof src === 'string' ? src : URL.createObjectURL(src)}
            component="img"
            alt={alt}
            height={150}
            onError={(e) => {
              console.error(e.nativeEvent.type)
              setSourceError(true)
            }}
          />
        </>
        :
        <CardHeader title={"Falha ao carregar imagem"} data-cy='image-card-header' />
      }
      <CardContent
        sx={{
          width: '200px',
          maxHeight: '70px',
          padding: `${theme.spacing(1)} ${theme.spacing(0)}`,
          display: 'inline-block',
          overflow: 'hidden',
        }}>
        {
          editing ?
            <TextField label="Texto alternativo da imagem" variant="outlined"
              sx={{ width: '190px' }}
              multiline
              maxRows={2}
              value={alt}
              onChange={(e) => {
                setAlt(e.target.value);
              }}
              data-cy="image-card-edit-textfield" />
            :
            <Typography
              width={'200px'}
              variant="bodyMedium"
              noWrap
              color={theme.palette.onSurface.main}
              data-cy="image-card-text"
            >
              {image.alt ?
                image.alt :
                "Nenhuma descrição adicionada"}
            </Typography>
        }
      </CardContent>
      {editable ?
        <CardActions
          sx={{
            justifyContent: 'space-between',
            height: '50px',
            padding: `${theme.spacing(0)} ${theme.spacing(0)}`,
          }}
        >
          <Button
            style={{ color: theme.palette.primary.main, textTransform: 'initial' }}
            onClick={toggleEditing}
            data-cy="image-card-edit-button">
            {editing ?
              'Confirmar' :
              'Editar descrição da imagem'
            }
          </Button>
          <Button
            style={{ color: theme.palette.secondary.main, textTransform: 'initial' }}
            onClick={onClose}
            data-cy="image-card-remove-button">
            Remover
          </Button>
        </CardActions>
        : ""
      }
    </Card >
  );
}

export default ImageCard;
