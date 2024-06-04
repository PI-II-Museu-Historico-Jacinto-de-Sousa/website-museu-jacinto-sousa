import { Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Select, Snackbar, SnackbarProps, Stack, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled, useTheme, } from "@mui/material/styles";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { Dayjs, isDayjs } from "dayjs";
import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler } from "react-hook-form";
import { auth } from "../../firebase/firebase";
import { adicionarItemAcervo } from "../Utils/itemAcervoFirebase";
import useFormItemAcervo from "../hooks/useItemAcervoForm";
import useNomeColecoes from "../hooks/useNomeColecoes";
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { useNavigate } from "react-router-dom";

const ImageCard = React.lazy(() => import("../components/ImageCard/ImageCard"));

//altura de cada item no select
const SELECT_MENU_ITEM_HEIGHT = 48;

const CriarItemAcervo = () => {
  const navigate = useNavigate()
  //ao realizar logout enquanto na página de criação de item, redirecionar para a página de login
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login')
      }
    })
  }, [])

  const theme = useTheme()
  const palette = theme.palette

  //query que verifica se a resolução for menor que 600px
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { register, setError, watch, control, handleSubmit, formState, reset } = useFormItemAcervo()

  const { errors, isSubmitting, isSubmitSuccessful } = formState
  //valor desses campos é observado para alterar a renderização da página
  const watchDonation = watch('doacao')
  const watchAnonymousDonation = watch('doacaoAnonima')

  const [open, setOpenDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")

  //efeito para limpar o formulário após inserir um item com sucesso
  useEffect(() => {
    if (errors?.root?.type !== 'submitFailure' && isSubmitSuccessful) {
      reset()
      //limpa os arquivos selecionados para uma nova adição
      setImages([])
      setCurrentFiles([])
    }
  }, [isSubmitSuccessful, errors?.root?.type, reset])

  const submitForm: SubmitHandler<ItemAcervo> = async (data: ItemAcervo) => {
    const dataDoacao = data.dataDoacao
    if (!dataDoacao) { //converter de undefined para null
      data.dataDoacao = null
    }
    try {
      data.dataDoacao = isDayjs(data.dataDoacao) ? data.dataDoacao.toDate() : data.dataDoacao
      data.imagens = images
      await adicionarItemAcervo(data)
      setDialogMessage("Item criado com sucesso")
    } catch (error) {
      setError('root', {
        type: 'submitFailure',
        message: (error as Error).message
      })
      console.log((error as Error).message)
      setDialogMessage((error as Error).message)
    } finally {
      setOpenDialog(true)
    }
  }

  //estado para armazenar os arquivos adicionados ate o momento
  const [images, setImages] = useState<Imagem[]>([]);
  //estado com os arquivos selecionados da ultima interacao com o input
  const [currentFiles, setCurrentFiles] = useState<File[]>([])
  //estado com as configuracoes para o snackbar mostrado ao inserir um arquivo ja existente
  const [SnackbarDuplicateFileProps, setOpenDuplicateFileWarning] = useState<SnackbarProps>({
    open: false,
    message: ""
  })
  //função para deletar um arquivo do estado
  const deleteImage = (image: Imagem) => {
    setImages(images.filter(f => f !== image))
  }

  useEffect(() => {
    for (const currentFile of currentFiles) {
      const newImage = {
        src: currentFile,
        title: currentFile.name,
        alt: ""
      }
      //se já houver uma imagem para o mesmo arquivo
      if (!images.some(f => f.title === newImage.title)) {
        setImages((previousFiles) => [...previousFiles, newImage])
      }
      else {
        setOpenDuplicateFileWarning({ ...SnackbarDuplicateFileProps, open: true, message: `${currentFile.name} já foi adicionado` })
      }
    }
  }, [currentFiles])

  const collectionList = useNomeColecoes()


  return (
    <Content>
      <Heading id="Heading">
        <Typography variant="displayLarge" color={palette.onSurface.main} alignSelf={'stretch'} data-cy='page-title'>
          Adicionar item ao acervo
        </Typography>
        <Typography variant="headlineSmall" color={palette.onSurface.main} alignSelf={'stretch'}>
          Inclua as informações de um novo item para o acervo
        </Typography>
      </Heading>
      {/* Todos os campos para cadastrar um novo item ficam na sessao Form,
            com campos de texto em Fields e imagens em Images */}
      <form onSubmit={handleSubmit(submitForm)}>
        <FormContent id="Form" divider={<Divider variant="fullWidth" orientation="horizontal" style={{ alignSelf: 'stretch' }} />}>
          <Fields>
            <Typography variant="headlineMedium" color={palette.onSurface.main}>
              Informações do item
            </Typography>
            <TextField
              id='item-name'
              label='Nome do item'
              {...register('nome', {
                required: "Nome do item é obrigatório"
              })}
              error={errors.nome?.message !== undefined}
              helperText={errors.nome?.message}
              variant="filled"
            />

            <TextField
              id='item-description'
              label='Descrição do item'
              {...register('descricao')}
              error={errors.descricao?.message !== undefined}
              helperText={errors.descricao?.message}
              multiline rows={6}
              fullWidth
              style={{
                maxWidth: 600
              }}
              variant="filled" />

            <TextField
              id='item-curiosities'
              label='Curiosidades do item'
              {...register('curiosidades')}
              error={errors.curiosidades?.message !== undefined}
              helperText={errors.curiosidades?.message}
              multiline rows={6}
              fullWidth
              style={{
                maxWidth: 600
              }}
              variant="filled" />

            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              {/*Input label conflita com o select nativo
                            por que a primeira opção é sempre renderizada, e acaba sobrepondo o texto,
                            por isso utilizar FormLabel na visualização em dispositivos móveis*/}
              {mobile ?
                (<FormLabel id="collection-select-label">Coleção</FormLabel>)
                : (<InputLabel id="collection-select-label">Coleção</InputLabel>)
              }
              <Controller
                control={control}
                {...register('colecao', {
                  required: "Coleção é obrigatória"
                })
                }
                render={({ field }) => (
                  <Select
                    id='collection-select'
                    label='Seleção de coleção'
                    labelId="collection-select-label"
                    native={mobile}
                    {...field}
                    error={errors.colecao?.message !== undefined}
                    style={{
                      height: SELECT_MENU_ITEM_HEIGHT,
                      width: 200
                    }}
                  >
                    { /* MenuItem não é compatível com dispositivos móveis, por isso option é usado*/
                      mobile ?
                        collectionList.length !== 0 ?
                          collectionList.map((collection, idx) => (
                            <option value={collection} key={idx} data-cy='select-collection-item'>{collection}</option>))
                          : <option value="" disabled data-cy='select-collection-item-fail'>Falha ao carregar as coleções</option>
                        :
                        collectionList.length !== 0 ?
                          collectionList.map((collection, idx) => (
                            <MenuItem value={collection} key={idx} data-cy='select-collection-item'>{collection}</MenuItem>))
                          : <MenuItem value="" disabled data-cy='select-collection-item-fail'>Falha ao carregar as coleções</MenuItem>
                    }
                  </Select>

                )} />
              <FormHelperText>{errors.colecao?.message}</FormHelperText>
            </FormControl>

            <Donation>
              <FormControlLabel id='checkbox-donation'
                control={
                  <Controller
                    {...register('doacao')}
                    control={control}
                    defaultValue={true}
                    render={({ field: props }) => (
                      <Checkbox
                        {...props}
                        checked={props.value}
                        onChange={(e) => props.onChange(e.target.checked)}
                      />)}
                  />
                }
                label="Doação" labelPlacement='start' />

              {watchDonation ?
                <>
                  <FormControlLabel
                    control={
                      <Controller
                        {...register('doacaoAnonima')
                        }
                        control={control}
                        render={({ field: props }) => (
                          <Checkbox
                            {...props}
                            checked={props.value}
                            onChange={(e) => props.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label={'Doação Anônima'} labelPlacement="start"
                  />
                  {!watchAnonymousDonation ?
                    <>
                      <TextField id='item-donor'
                        {...register('nomeDoador', {
                          required: "Nome do doador é obrigatório para doações não-anônimas"
                        })}
                        error={errors.nomeDoador?.message !== undefined}
                        helperText={errors.nomeDoador?.message}
                        label='Nome do doador'
                        variant="filled" />
                      <Controller
                        {...register('telefoneDoador', {
                          maxLength: 18, //incluindo espaços em branco e códigos de país com 3 dígitos
                        })}
                        control={control}
                        render={({ field, fieldState }) => (
                          <MuiTelInput
                            {...field}
                            value={field.value ?? ''}
                            inputRef={field.ref}
                            defaultCountry="BR"
                            error={fieldState.invalid}
                            helperText={fieldState.invalid ? "Telefone inválido" : ""}
                            label='Telefone'
                            variant="filled" />)} />
                    </>
                    :
                    ""
                  }

                  { //renderizar o DatePicker adequado para o dispositivo
                    mobile ?
                      <Controller
                        {...register('dataDoacao', {
                          required: "Data da doação é obrigatória"
                        })
                        }
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <MobileDatePicker
                            {...field}
                            label='Data da doação'
                            value={field.value as Dayjs}
                            inputRef={field.ref}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            slotProps={{
                              textField: {
                                helperText: 'Obrigatório',
                                error: !!error
                              },
                            }}
                          />
                        )}
                      />
                      :
                      <Controller
                        {...register('dataDoacao', {
                          required: "Data da doação é obrigatória"
                        })
                        }
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DesktopDatePicker
                            {...field}
                            label='Data da doação'
                            value={field.value as Dayjs}
                            inputRef={field.ref}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            slotProps={{
                              textField: {
                                helperText: 'Obrigatório',
                                error: !!error
                              },
                            }}
                          />
                        )}

                      />
                  }
                </>
                : ""
              }
            </Donation>
            <Tooltip title='Itens privados não são mostrados aos visitantes do site'>
              <FormControlLabel id='checkbox-privacy'
                control={
                  <Controller
                    name="privado"
                    control={control}
                    render={({ field: props }) => (
                      <Checkbox
                        {...props}
                        checked={props.value}
                        onChange={(e) => props.onChange(e.target.checked)}
                      />
                    )}
                  />}

                label="Item Privado" labelPlacement='start' />
            </Tooltip>
          </Fields>
          <Images>
            <Stack id='section-title' style={{ alignSelf: "stretch", alignItems: "flex-start" }}>
              <Typography variant="headlineMedium" color={palette.onSurface.main} alignSelf={'stretch'}>
                Imagens
              </Typography>
            </Stack>
            <input
              accept="image/*"
              id="button-file"
              hidden
              multiple
              type="file"
              onChange={(e) => { setCurrentFiles(Array.from(e.target.files ?? [])) }}
            />
            <label htmlFor="button-file">
              <Button variant="contained" component="span"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('button-file')?.click()
                  }
                }}
                style={{
                  background: palette.tertiary.main,
                  color: palette.onTertiary.main,
                  textTransform: 'initial' //capitalizar apenas a primeira letra
                }}
                data-cy='input-file'
              >
                Adicionar Imagem
              </Button>
            </label>
            {/*Snackbar que aparece ao inserir um arquivo que já está no estado files*/}
            <Snackbar
              open={SnackbarDuplicateFileProps.open}
              onClose={() => setOpenDuplicateFileWarning({ ...SnackbarDuplicateFileProps, open: false })}
              message={SnackbarDuplicateFileProps.message}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={3000}
              data-cy='snackbar-duplicate-file'
            />
            <ImagesList data-cy='images-section'>
              { //renderiza um card com a opção de remover e
                //adicionar e alterar texto alternativo para cada imagem
                Array.from(images ?? []).map((imagem: Imagem, idx: number) => {
                  return <ImageCard image={imagem} key={idx} onClose={() => deleteImage(imagem)} />
                })
              }
            </ImagesList>
          </Images>
        </FormContent>

        <Submit>
          <Button type="submit"
            variant="contained"
            disabled={isSubmitting}
            style={{ textTransform: 'initial' }}
          >
            {
              isSubmitting ? "Enviando..." : "Adicionar item"
            }
          </Button>
        </Submit>
      </form>
      {/*dialog que aparece ao enviar o formulário, com a mensagem de sucesso ou erro*/}
      <Dialog
        open={open}
        onClose={() => setOpenDialog(false)}
        data-cy='dialog'>
        <DialogContent>
          <DialogContentText style={{ whiteSpace: 'pre-line' }} data-cy='dialog-text'>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Content >


  );
}

const Content = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
  gap: `${theme.spacing(5)}`,
  alignSelf: 'stretch',
})
)

const Heading = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  gap: `${theme.spacing(2)}`,
  justifyContent: "center",
  alignItems: 'flex-start',
  alignSelf: 'stretch',
})
)

const FormContent = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  gap: `${theme.spacing(2)}`,
  borderRadius: `${theme.spacing(0.5)}`,
  boxShadow: `0px 0px 4px 0px ${theme.palette.shadow.main}`,
  justifyContent: "center",
  alignItems: 'center',
  alignSelf: 'stretch',
  backgroundColor: theme.palette.surfaceContainerLow.main,
})
)

const Fields = styled(Stack)(({ theme }: { theme: Theme }) => ({
  gap: `${theme.spacing(4)}`,
  alignItems: 'flex-start',
  alignSelf: 'stretch',
})
)

const Donation = styled(Stack)(({ theme }: { theme: Theme }) => ({
  gap: `${theme.spacing(4)}`,
  alignItems: 'flex-start',
  alignSelf: 'stretch',
})
)

const Images = styled(Stack)(({ theme }: { theme: Theme }) => ({
  gap: `${theme.spacing(4)}`,
  alignItems: 'center',
  alignSelf: 'stretch',
})
)

const ImagesList = styled(Container)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  gap: `${theme.spacing(2)}`,
  alignSelf: 'stretch',
  flexWrap: 'wrap',
  img: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'cover'
  }
})
)
const Submit = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  gap: `${theme.spacing(2)}`,
  justifyContent: "center",
  alignItems: 'flex-end',
  alignSelf: 'stretch',
})
)

export default CriarItemAcervo;
