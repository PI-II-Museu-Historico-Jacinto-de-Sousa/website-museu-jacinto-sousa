import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";


interface ImageCardProps {
  onClose: () => void;
  image: HTMLImageElement;
}


/**
 * Componente Wrapper para imagens que permite editar o texto alternativo
 * e remover a imagem da lista onde ela é renderizada de acordo com um método onClose.
 * Em vez de passar a url da imagem é preciso passá-la como elemento html para alterar o atributo alt
 */
const ImageCard = ({ image: HTMLImage, onClose }: ImageCardProps) => {

  const theme = useTheme()

  const [editing, setEditing] = useState<boolean>(false)
  const [alt, setAlt] = useState<string>(HTMLImage.alt)

  const src = HTMLImage.src
  const toggleEditing = () => {
    setEditing(!editing)
  }

  return (
    <Card sx={{
      maxWidth: 200,
      maxHeight: 350,
      backgroundColor: theme.palette.surface.main,
      padding: `${theme.spacing(0)} ${theme.spacing(0.5)}`,
      spacing: theme.spacing(0),
    }} >
      {src ?
        <>
          <CardHeader
            disableTypography //necessário para adicionar uma tipografia própria ao título
            title={<Typography variant="labelLarge">{HTMLImage.title}</Typography>}
            data-cy='image-card-header'
            sx={{ padding: `${theme.spacing(0)} ${theme.spacing(0.5)}`, wordBreak: 'break-word' }} //altura máxima igual a altura da linha em labelLarge
          />
          <CardMedia image={src}
            component="img"
            alt={alt}
            height={150}
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
          // whiteSpace: 'nowrap',
          // textOverflow: 'clip ellipsis',
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
                HTMLImage.setAttribute('alt', e.target.value);
                setAlt(HTMLImage.alt);
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
              {HTMLImage.alt ?
                HTMLImage.alt :
                "Nenhuma descrição adicionada"}
            </Typography>
        }
      </CardContent>
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
    </Card >
  );
}

export default ImageCard;
