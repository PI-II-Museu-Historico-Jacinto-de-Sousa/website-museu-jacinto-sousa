import { ButtonBaseProps } from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import CheckBox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import { Theme, styled, useTheme, } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker, DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { useLoaderData } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import Exposicao from "../../interfaces/Exposicao";
import { ClientExposicaoFirebase } from "../../Utils/exposicaoFirebase";

interface ExposicaoEditingProps {
  exposicao: Exposicao,
  setEditing: (value: boolean) => void
}

interface ExposicaoViewProps {
  exposicao: Exposicao,
  editable: boolean
}
const PageExposicao = () => {
  const exposicao = useLoaderData() as Exposicao;
  const [editable, setEditable] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setEditable(false);
      }
      else {
        setEditable(true);
      }
    })
  }, [])


  return (
    <Content
    >
      {(!editing && editable) && (
        <div style={{ justifyContent: 'center', width: '100%', display: 'flex' }}>
          <Button onClick={() => setEditing(true)}
            variant='contained'
            sx={{ maxWidth: 'fit-content' }}
            data-cy='button-editar-exposicao'
          >
            Editar
          </Button>
        </div>)

      }
      {
        editing && editable ? (
          <ExposicaoEditing exposicao={exposicao} setEditing={setEditing} />
        ) : (
          <ExposicaoView exposicao={exposicao} editable={editable} />
        )
      }
    </Content >
  );
}

const ExposicaoEditing = ({ exposicao, setEditing }: ExposicaoEditingProps) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>("");

  const client = new ClientExposicaoFirebase()
  const [newUrl, setNewUrl] = useState<string>(exposicao.id!)

  const { handleSubmit, register, watch, reset, control, setValue, formState: { errors } } = useForm<Exposicao>({ defaultValues: exposicao })

  const permanent = watch("permanente")
  const image = watch("imagem")
  const minDate = watch("dataInicio")
  const maxDate = watch("dataFim")


  const validSubmitHandler = async (data: Exposicao) => {
    try {
      await client.atualizarExposicao(data)
      setNewUrl(data.id!)
      setShowSuccessDialog(true)
    }
    catch (e) {
      setShowErrorDialog(true)
      setUpdateErrorMessage((e as Error).message)
      console.error(e)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(validSubmitHandler)}>
        <FormItems>
          <Stack direction='row' spacing={2} width={'100%'} justifyContent={'center'}>
            <Button variant='contained' type="submit">Salvar</Button>
            <Button variant='contained' onClick={() => { reset(exposicao); setEditing(false) }} data-cy='button-cancelar-edicao'
            >Cancelar</Button>
          </Stack>
          <input
            accept="image/*"
            id="button-file"
            hidden
            type="file"
            onChange={(e) => {
              const file = e?.target?.files?.[0];
              if (file) {
                setValue("imagem.src", file);
                setValue("imagem.title", file.name);
                setValue("imagem.alt", "")
              }
            }}
          />
          <ImageContainer >
            <label htmlFor="button-file">
              <Button variant="contained" component="span"
                style={{
                  background: theme.palette.tertiary.main,
                  color: theme.palette.onTertiary.main,
                }}
              >
                {image ? "Alterar Imagem" : "Adicionar Imagem"}
              </Button>
            </label>
            {image &&
              <>
                <img
                  src={typeof image.src === 'string' ? image.src : URL.createObjectURL(image.src)}
                  alt={watch("imagem.alt")}
                  width={mobile ? '100%' : '50%'}
                  height={'auto'}
                  data-cy='image-exposicao'
                >
                </img>
                <ContainedButton
                  component='span' onClick={() => { setValue("imagem", undefined) }}
                  sx={{ background: theme.palette.error.main, color: theme.palette.onError.main }}
                  data-cy='button-remover-imagem'
                >
                  Remover imagem
                </ContainedButton>

                <TextField {...register("imagem.alt")} label="Texto alternativo da Imagem" variant="filled" />
              </>
            }
          </ImageContainer>
          <Typography component='h2' variant='displaySmall' >
            Informações da Exposição
          </Typography>
          <TextField variant='filled'
            {...register("nome", { required: "Nome da exposição é obrigatório" })}
            error={errors.nome?.message !== undefined} helperText={errors.nome?.message}
            sx={{ maxWidth: '400px' }}
          />
          <TextField
            {...register("descricao",)}
            variant='filled'
            multiline
            rows={6}
            sx={{ maxWidth: '600px' }}
          />

          <FormControlLabel
            control={
              <CheckBox
                {...register("privado")}
                defaultChecked={exposicao.privado} />}
            label='Exposição Privada' />

          <FormControlLabel
            control={
              <CheckBox {...register("permanente")}
                defaultChecked={exposicao.permanente} />}
            label='Exposição Permanente' />
          {!permanent &&
            <>
              < Controller
                {...register("dataInicio", { required: 'Obrigatória para exposições temporárias' })}
                control={control}
                render={({ field, fieldState }) => (
                  mobile ?
                    <MobileDatePicker
                      sx={{ maxWidth: '200px' }}
                      label='Data de início'
                      value={dayjs(field.value)}
                      maxDate={dayjs(maxDate)}
                      onChange={(date) => {
                        field.onChange(date);
                      }}

                    /> : <DesktopDatePicker
                      sx={{ maxWidth: '200px' }}
                      label='Data de início'
                      value={dayjs(field.value)}
                      maxDate={dayjs(maxDate)}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                      slotProps={{
                        textField: {
                          helperText: fieldState.error?.message,
                          error: !!fieldState.error
                        },
                      }}
                    />
                )
                }
              />
              <Controller
                {...register("dataFim", { required: 'Obrigatória para exposições temporárias' })}
                control={control}
                render={({ field, fieldState }) => (
                  mobile ?
                    <MobileDatePicker
                      label='Data de término'
                      sx={{ maxWidth: '200px' }}
                      value={dayjs(field.value)}
                      minDate={dayjs(minDate)}
                      onChange={(date) => {
                        field.onChange(date);
                      }}

                    /> : <DesktopDatePicker
                      sx={{ maxWidth: '200px' }}
                      label='Data de término'
                      value={dayjs(field.value)}
                      minDate={dayjs(minDate)}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                      slotProps={{
                        textField: {
                          helperText: fieldState.error?.message,
                          error: !!fieldState.error
                        },
                      }}
                    />
                )
                }
              />

            </>
          }
          <ItensSection>
            <Typography variant='displaySmall' component='h2'>Itens da Exposição</Typography>
            <ItensList>
              <Button variant='contained' onClick={() => { console.log("Adicionar item") }} sx={{ maxWidth: '200px', maxHeight: '40px' }} data-cy='button-adicionar-item'>Adicionar Item</Button>
            </ItensList>
          </ItensSection>
        </FormItems>
      </form>
      {/* Dialogs*/}

      < Dialog
        open={showSuccessDialog}
        onClose={() => { setShowSuccessDialog(false); window.location.replace("/" + newUrl) }}
        data-cy='dialog-sucesso-atualizar'>

        <DialogTitle>
          Exposição atualizada com sucesso
        </DialogTitle>
        <Button
          onClick={() => { setShowSuccessDialog(false); window.location.replace("/" + newUrl) }}
          autoFocus
          data-cy='button-dialog-sucesso-atualizar'
        >
          Ok
        </Button>
      </Dialog >
      <Dialog
        open={showErrorDialog}
        onClose={() => { setShowErrorDialog(false) }}
        data-cy='dialog-erro-atualizar'>
        <DialogTitle>
          Erro ao atualizar exposição
        </DialogTitle>
        <DialogContentText>
          {updateErrorMessage}
        </DialogContentText>
        <Button onClick={() => { setShowErrorDialog(false) }} autoFocus>Ok</Button>
      </Dialog>
    </>
  )
}

const ExposicaoView = ({ exposicao, editable }: ExposicaoViewProps) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [showCopyLinkDialog, setShowCopyLinkDialog] = useState<boolean>(false);
  const [showCopiedLinkSnackbar, setShowCopiedLinkSnackbar] = useState<boolean>(false);
  const qrCodeRef = useRef(null)
  const [downloadQRCodeHref, setDownloadQRCodeHref] = useState<string | undefined>(undefined)

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>("");

  const client = new ClientExposicaoFirebase()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowCopiedLinkSnackbar(true)
  }

  //definindo a url de download do QRCode em um useEffect
  //com delay, para garantir que o svg seja renderizado
  useEffect(() => {
    if (showCopyLinkDialog) {
      setTimeout(() => {
        getQRCodeDownloadHref();
      }, 2000);
    }
  }, [showCopyLinkDialog])

  const getQRCodeDownloadHref = () => {
    const svgElement = (qrCodeRef.current as SVGSVGElement | null);
    if (!svgElement) {
      console.error('SVG não encontrado');
      return;
    }
    const svgToXML = (new XMLSerializer).serializeToString(svgElement)

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const image = new window.Image()
    canvas.width = svgElement.width.baseVal.value;
    canvas.height = svgElement.height.baseVal.value;
    image.onload = () => {
      console.log(context)
      context?.drawImage(image, 0, 0)
      setDownloadQRCodeHref(canvas.toDataURL('image/png'))
    }

    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgToXML);
  }

  return (
    <>
      <ContainerView divider={<Divider orientation="horizontal" flexItem />}>
        {exposicao.imagem &&
          <ImageContainer>
            <figure style={{ display: 'flex', flexDirection: "column", alignItems: 'center', }}>
              <img
                src={typeof exposicao.imagem.src === 'string' ? exposicao.imagem.src : URL.createObjectURL(exposicao.imagem.src)}
                alt={exposicao.imagem.alt}
                width={mobile ? '100%' : '50%'}
                height={'auto'}
                data-cy='image-exposicao'
              />
              <figcaption style={{ textAlign: 'center' }} data-cy='image-exposicao-alt'>{exposicao.imagem.alt}</figcaption>
            </figure>
          </ImageContainer>
        }
        <Description>
          <Typography variant="displayLarge" component='h1' data-cy='titulo-exposicao'>{exposicao.nome}</Typography>
          <Typography variant="bodyLarge" data-cy='descricao-exposicao'>{exposicao.descricao || "Nenhuma Descrição informada"}</Typography>
          {exposicao.privado && <Typography variant="bodyLarge" data-cy='texto-privacidade-exposicao'>Exposição Privada</Typography>}
          <DatePicker
            value={dayjs(exposicao.dataInicio)}
            readOnly
            label="Data de Início"
            sx={{ maxWidth: '200px' }}
            name='dataInicio' // data-cy não propagava para o input
          />
          <DatePicker
            value={dayjs(exposicao.dataFim)}
            readOnly
            label="Data de término"
            name='dataFim'
            sx={{ maxWidth: '200px' }} />
          {editable && <Button
            variant='contained'
            sx={{ maxWidth: '200px', background: theme.palette.tertiary.main }}
            onClick={() => {
              setShowCopyLinkDialog(true)
            }}
            data-cy='button-compartilhar-exposicao'
          >
            Compartilhar
          </Button>}
        </Description>
        <ItensSection>
          <Typography component='h2' variant='displaySmall' >
            Itens da Exposição
          </Typography>
          <ItensList>
            {/* TODO */}
          </ItensList>
        </ItensSection>
        <Stack alignItems={'center'} width={'100%'}>
          <Button
            variant='contained'
            onClick={() => { setShowDeleteConfirmation(true) }}
            sx={{ maxWidth: '200px', background: theme.palette.error.main }}
            data-cy='button-excluir-exposicao'
          >
            Excluir
          </Button>
        </Stack>
      </ContainerView>

      <Snackbar
        open={showCopiedLinkSnackbar}
        onClose={() => { setShowCopiedLinkSnackbar(false) }}
        message={"Link copiado para a área de transferência"}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={1500}
        data-cy='snackbar-copied-link'
      />

      <Dialog open={showDeleteConfirmation} onClose={() => { setShowDeleteConfirmation(false) }}>
        <DialogTitle variant="headlineSmall">
          Tem certeza que deseja excluir esta exposição?
        </DialogTitle>
        <DialogContent sx={{ maxWidth: '400px' }}>
          <DialogActions>
            <ContainedButton
              sx={{ background: theme.palette.inverseSurface.main }}
              onClick={() => {
                setShowDeleteConfirmation(false);

              }}>
              Cancelar
            </ContainedButton>
            <Button variant='contained' type='submit'
              onClick={async () => {
                try {
                  await client.deletarExposicao(exposicao.id!);
                  setShowDeleteConfirmation(false);
                  window.alert("Item deletado com sucesso");
                  if (history.length) {
                    history.back();
                  } else {
                    window.location.href = '/';
                  }
                } catch (e) {
                  setDeleteErrorMessage((e as Error).message);
                }
              }}
              data-cy='button-confirmar-exclusao'
            >
              Confirmar
            </Button>

          </DialogActions>
          <DialogContentText sx={{ textAlign: 'center', color: theme.palette.error.main }}>
            {deleteErrorMessage && "Erro: " + deleteErrorMessage}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={showCopyLinkDialog} onClose={() => { setShowCopyLinkDialog(false) }}>
        <DialogTitle>
          Compartilhar Exposição
        </DialogTitle>
        <DialogContent sx={{ maxWidth: '800px', padding: `${theme.spacing(3)} ${theme.spacing(3)}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
          <div className="QRCodeFrame">
            <QRCode value={window.location.href} ref={qrCodeRef} />
          </div>
          <a
            id='downloadQRCodeLink'
            href={downloadQRCodeHref}
            download={exposicao.nome + "-QR.png"}
            style={{ display: 'none' }}
          >Baixar</a>
          <Button variant='contained'
            onClick={() => {
              const link = document.getElementById('downloadQRCodeLink'); link?.click()
            }
            }
            disabled={!downloadQRCodeHref}
            data-cy='button-baixar-qrcode'
          >
            Baixar QR Code
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => { setShowCopyLinkDialog(false) }} sx={{ background: theme.palette.inverseSurface.main }}>Fechar</Button>
          <Button variant='contained' onClick={copyToClipboard}
            data-cy='button-copiar-link'
          >Copiar Link</Button>
        </DialogActions>
      </Dialog >

    </>
  )
}


const Content = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(5)} ${theme.spacing(2)}`,
  gap: `${theme.spacing(5)}`,
  alignSelf: 'stretch',
  '& button,span': {
    textTransform: 'initial',
  },
  '& button': {
    variant: 'contained',
  }
}))

const FormItems = styled(Stack)((({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.spacing(2)}`,
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  alignSelf: 'stretch',
})
))

const ContainerView = styled(Stack)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.surfaceContainerLow.main,
  color: theme.palette.onSurface.main,
  borderRadius: `${theme.spacing(0.5)}`,
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  gap: `${theme.spacing(2)}`,
})
)

const Description = styled(Stack)(({ theme }: { theme: Theme }) => ({
  gap: `${theme.spacing(2)}`,
})
)

const ImageContainer = styled(Stack)(({ theme }: { theme: Theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  gap: `${theme.spacing(1)}`,
})
)

const ItensSection = styled(Stack)(({ theme }: { theme: Theme }) => ({
  gap: `${theme.spacing(3)}`,
})
)
const ItensList = styled(Stack)(({ theme }: { theme: Theme }) => ({
  gap: `${theme.spacing(1)}`,
  flexDirection: 'row',
  minHeight: '200px',
  flexWrap: 'wrap',
})
)

const ContainedButton = styled(Button)<ButtonBaseProps>(() => ({
  textTransform: 'initial',
  variant: 'contained',
})
)
export default PageExposicao;
