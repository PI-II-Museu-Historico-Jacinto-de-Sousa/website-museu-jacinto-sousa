import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Skeleton from "@mui/material/Skeleton";
import { Theme } from "@mui/material/styles/createTheme";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { auth } from "../../../firebase/firebase";
import useInfoMuseuForm from "../../hooks/useInfoMuseuForm";
import { InfoMuseu } from "../../interfaces/InfoMuseu";
import useInfoMuseu from './useInfoMuseu';
interface InfoSectionProps {
  id: string | null
  removeCallback: (id?: string) => Promise<void> | void
}

/**
 * Componente para uma secao de informacao do museu,
 * caso o id seja fornecido, o componente ira corresponder a uma secao existente,
 * caso contrario o componente sera usado como formulario para adicionar uma nova secao
 * @param id
 */
const InfoSection = ({ id, removeCallback }: InfoSectionProps) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [infoId, setInfoId] = useState<string | null>(id)
  const [editable, setEditable] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)

  const { status, infoMuseu, atualizarInfoMuseu } = useInfoMuseu(infoId)

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [dialogMessage, setDialogMessage] = useState<string>('')

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setEditable(true)
      }
    })
  }, [])

  const { handleSubmit, register, formState, watch, setValue } = useInfoMuseuForm(infoMuseu ? infoMuseu : { nome: '', texto: '' }, status)
  const { isSubmitting } = formState
  const currentImage = watch('imagem')

  const loadSrc = (src: File | string | undefined): string => {
    if (typeof (src) == 'string') {
      return src
    }
    else if (src instanceof File) {
      return URL.createObjectURL(src)
    }
    else {
      return ''
    }
  }

  const submitForm: SubmitHandler<InfoMuseu> = async (data: InfoMuseu) => {
    if (data?.imagem?.src === undefined) {
      // atualiza apenas o texto e o nome se nenhuma imagem for selecionada
      delete data.imagem
    }
    await atualizarInfoMuseu(data).then((returnValue) => {
      if (typeof returnValue === 'string') {
        setInfoId(returnValue)
      }
      setDialogMessage('Informação atualizada com sucesso')
      setEditing(false)
    }).catch((error) => {
      setDialogMessage(`Erro ao atualizar informação \n ${error.message}`)
    }).finally(() => {
      setShowDialog(true)
    }
    )
  }

  if (status === 'error') {
    return <InfoSectionContainer style={{
      height: 200,
      alignItems: 'center',
      background: theme.palette.grey[200]
    }}>
      <Typography variant='headlineSmall' data-cy='info-error-title'>
        Erro ao carregar informação
      </Typography>
    </InfoSectionContainer>
  }

  if (status === 'loading') {
    return <InfoSectionContainer style={{
      height: 200,
      alignItems: 'center',
      background: theme.palette.grey[200]
    }}>
      <InfoSectionText>
        <InfoSectionHeader>
          <Skeleton variant='text' sx={{
            width: '50%',
            height: 50
          }}
          />
        </InfoSectionHeader>
        <Skeleton variant='text' sx={{
          width: '100%',
          height: 100
        }} />
      </InfoSectionText>
      <InfoImageContainer>
        <Skeleton variant='rectangular' sx={{
          width: 150,
          height: 150
        }} />
      </InfoImageContainer>
    </InfoSectionContainer>
  }

  return (
    <>
      <InfoSectionContainer>
        {!editing ?
          <>
            <InfoSectionText>
              <InfoSectionHeader>
                <Typography variant='displayMedium' data-cy='info-title'>{infoMuseu?.nome || "Nova informação do Museu"}</Typography>
                {editable && <InfoSectionEditButton
                  component='label'
                  variant='contained'
                  onClick={() => { setEditing(true); }}
                  data-cy='info-edit-button'>
                  <EditIcon />
                </InfoSectionEditButton>}
              </InfoSectionHeader>
              <Typography variant='bodyLarge' data-cy='info-text'>{infoMuseu?.texto || "Adicione uma descrição"}</Typography>
              {editable &&
                <Button variant='contained' sx={{
                  maxWidth: 100,
                  textTransform: 'initial',
                  background: theme.palette.error.main,
                  color: theme.palette.onError.main
                }}
                  onClick={async () => {
                    removeCallback && await removeCallback(infoId || undefined)
                  }
                  }
                  data-cy='info-remove-button'
                >
                  Remover
                </Button>
              }
            </InfoSectionText>
            {currentImage && <InfoImageContainer>
              <figure>
                <img
                  src={loadSrc(infoMuseu?.imagem?.src)}
                  alt={infoMuseu?.imagem?.alt}
                  data-cy='info-image' />
                <figcaption style={{ textAlign: 'center' }} data-cy='info-alt-text'>{infoMuseu?.imagem?.alt}</figcaption>
              </figure>
            </InfoImageContainer>
            }
          </>
          :
          // estado de edicao do componente
          <form onSubmit={handleSubmit(submitForm)} style={{
            width: '100%',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: mobile ? 'column-reverse' : 'row',
            gap: theme.spacing(2),
          }}>
            <InfoSectionText>
              <InfoSectionHeader>
                <TextField
                  sx={{
                    maxWidth: 260
                  }}

                  {...register('nome', { required: "Título da seção é obrigatório" })}
                  label='Título da seção'
                  error={formState.errors.nome ? true : false}
                  helperText={formState.errors.nome ? formState.errors.nome.message : ''}
                  variant='filled'
                  data-cy='info-edit-title-field'
                />
              </InfoSectionHeader>
              <TextField
                sx={{
                  maxWidth: 650
                }}
                {...register('texto', { required: "Texto não pode ser vazio" })}
                label='Descrição'
                multiline
                error={formState.errors.texto ? true : false}
                helperText={formState.errors.texto ? formState.errors.texto.message : ''}
                variant='filled'
                data-cy='info-edit-text-field'
              />
              <InfoEditOptions>
                <Button sx={{
                  textTransform: 'initial',
                  background: theme.palette.primary.main,
                  color: theme.palette.onPrimary.main
                }}
                  type='submit'
                  variant='contained'
                  disabled={isSubmitting}
                  data-cy='info-submit-button'>
                  {
                    isSubmitting ? 'Salvando' : 'Salvar'
                  }
                </Button>
                <Button sx={{
                  textTransform: 'initial',
                  background: theme.palette.secondary.main,
                  color: theme.palette.onSecondary.main
                }}
                  type='reset'
                  variant='contained'
                  onClick={() => { setEditing(false); }}
                  data-cy='info-cancel-button'>
                  Cancelar
                </Button>

              </InfoEditOptions>
            </InfoSectionText>
            <InfoImageContainer>
              {currentImage &&
                <>
                  <figure style={{ margin: 'auto', position: 'relative' }}>

                    <InfoImageRemoveButton
                      component='span'
                      onClick={() => {
                        setValue('imagem', undefined)
                      }}
                      data-cy='info-image-remove-button'
                    >
                      <CloseIcon />
                    </InfoImageRemoveButton>
                    <img
                      style={{ position: 'relative' }}
                      // imagem renderizada durante a edicao é a imagem atual do conteúdo
                      // ou a imagem selecionada no input
                      src={loadSrc(currentImage.src)}
                      alt={currentImage.alt}
                      data-cy='info-image' />
                    <figcaption style={{ textAlign: 'center' }} data-cy='info-image-alt-text'>{currentImage.alt}</figcaption>
                  </figure>
                  <TextField
                    {...register('imagem.alt')}
                    label='Texto alternativo da imagem'
                    variant='filled'
                    data-cy='info-image-alt-field'
                  />
                </>
              }
              <Button
                component='label'
                id='image-upload-button'
                variant='contained'
                sx={{
                  textTransform: 'initial',
                  background: theme.palette.tertiary.main,
                  color: theme.palette.onTertiary.main
                }}
                data-cy='info-image-button'
              >
                {currentImage ? "Alterar imagem" : "Adicionar imagem"}
                <input
                  type='file'
                  aria-labelledby='image-upload-button'
                  accept="image/*"
                  onChange={(e) => { if (e.target.files) setValue('imagem.src', e.target.files?.[0]) }}
                  id="image-upload-input"
                  hidden />
              </Button>
            </InfoImageContainer>
          </form>
        }
      </InfoSectionContainer >

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        data-cy-info-update-dialog>
        <DialogContent>
          <DialogContentText style={{ whiteSpace: 'pre-line' }} data-cy-info-update-dialog-text>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} data-cy="edit-close-button">Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const InfoSectionContainer = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignSelf: 'stretch',
  alignContent: 'center',
  justifyContent: 'center',
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
  gap: theme.spacing(2),
  button: {
    borderRadius: '1rem',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  },
  img: {
    maxWidth: 350,
    maxHeight: 350,
  },
  '@media screen and (max-width: 600px)': {
    flexDirection: 'column-reverse',
    img: {
      maxWidth: 250,
      maxHeight: 250,
    }
  },
}))

const InfoSectionHeader = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignSelf: 'stretch',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: theme.palette.onSurfaceVariant.main,
}))

const InfoSectionEditButton = styled(Button)<ButtonBaseProps>(({ theme }: { theme: Theme }) => ({
  maxHeight: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.onPrimary.main,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  borderRadius: '1rem',
  minWidth: 32,
}))

const InfoSectionText = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  color: theme.palette.onSurface.main,
  gap: theme.spacing(2),
}))

const InfoEditOptions = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
}))

const InfoImageContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

const InfoImageRemoveButton = styled(Button)<ButtonBaseProps>(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.onError.main,
  borderRadius: '20%',
  minWidth: 24,
  maxWidth: 24,
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing(0),
  right: 0,
  padding: 0
}))
export default InfoSection;
