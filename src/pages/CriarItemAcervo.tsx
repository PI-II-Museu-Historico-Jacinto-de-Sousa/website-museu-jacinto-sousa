import { Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, Select, Snackbar, SnackbarProps, Stack, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Theme, styled, useTheme, } from "@mui/material/styles";
import { DesktopDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { Dayjs, isDayjs } from "dayjs";
import { CollectionReference, DocumentData, DocumentReference, addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { StorageReference, deleteObject, ref, uploadBytesResumable } from "firebase/storage";
import { MuiTelInput } from "mui-tel-input";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler } from "react-hook-form";
import { auth, db, storage } from "../../firebase/firebase";
import ImageCard from "../components/ImageCard/ImageCard";
import useFormItemAcervo from "../hooks/useItemAcervoForm";
import { ItemAcervo } from "../interfaces/ItemAcervo";

//altura de cada item no select
const SELECT_MENU_ITEM_HEIGHT = 48;

const CriarItemAcervo = () => {

  //adicionando estado para verificar se o usuário está logado
  const [logged, setLogged] = useState<boolean>(false)
  //alterando o estado de logged ao verificar se o usuário está logado
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLogged(true)
      }
    })
  })

  const theme = useTheme()
  const palette = theme.palette

  //query que verifica se a resolução for menor que 600px
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { register, watch, control, handleSubmit, formState, reset } = useFormItemAcervo()

  const { errors, isSubmitting, isSubmitSuccessful } = formState
  //valor desses campos é observado para alterar a renderização da página
  const watchDonation = watch('doacao')
  const watchAnonymousDonation = watch('doacaoAnonima')

  const [open, setOpenDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")

  //efeito para limpar o formulário após inserir um item com sucesso
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful])

  const submitForm: SubmitHandler<ItemAcervo> = async (data: ItemAcervo) => {
    const itemsRef: CollectionReference = collection(db, 'acervo')
    //id usado para rollback em caso de erro
    let createdId: string = ''
    const dataDoacao = data.dataDoacao
    if (!dataDoacao) { //converter de undefined para null
      data.dataDoacao = null
    }
    //referencias dos arquivos no storage
    const fileReferences: string[] = images.map((image) => 'images/' + image.title)
    try {
      const item = {
        //objeto data corresponde aos campos do formulário
        itemName: data.nome,
        itemDescription: data.descricao,
        itemCuriosities: data.curiosidades,
        itemCollection: data.colecao,
        itemDonation: data.doacao,
        itemAnonymousDonation: data.doacaoAnonima,
        itemDonorName: data.nomeDoador,
        itemDonorPhone: data.telefoneDoador,
        itemDonationDate: isDayjs(data.dataDoacao) ? data.dataDoacao.toDate() : data.dataDoacao,
        itemPrivate: data.privado,
        itemImages: fileReferences // passar um vetor vazio diretamente faz com que o tipo converta para never[]
      }
      await submitToStorage(images).then(
        (urls: string[]) => {
          console.info(urls)
          return addDoc(itemsRef, item)
        }
      ).then((document: DocumentReference) => {
        createdId = document.id
        //limpa os arquivos selecionados para uma nova adição
        setImages([])
        setCurrentFiles([])
      })
      setOpenDialog(true)
      setDialogMessage("Item criado com sucesso")
    } catch (error) {
      console.error(error)
      setOpenDialog(true)
      setDialogMessage("Erro ao criar item")
      //firebase nao possui metodo rollback, entao se o item nao for criado, mas as imagens sim, é preciso deletá-las
      removeFromStorage(images, createdId)
    }
  }
  /*
  envia todas as imagens passadas para o storage, retorna a lista com o path de cada imagem
  */
  const submitToStorage = async (images: Imagem[]) => {
    try {
      const urls: string[] = []
      images.forEach((image) => {
        const fileRef: StorageReference = ref(storage, 'images/' + image.title)
        const metadata = {
          customMetadata: {
            'alt': image.alt
          }
        }
        uploadBytesResumable(fileRef, image.src as File, metadata).then((snapshot) => {
          urls.push(snapshot.ref.fullPath)
        })
      });
      return urls
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  //função para reverter as adições de arquivo caso a adição ao firestore falhe
  const removeFromStorage = (images: Imagem[], id: string) => {
    try {
      images.forEach((image) => {
        const path = 'images/' + image.title
        const fileRef: StorageReference = ref(storage, path);
        deleteObject(fileRef).catch((error) => {
          console.error(error);
        });
      });
      //transforma as imagens anteriores em um vetor vazio
      const itemRef: DocumentReference<DocumentData> = doc(collection(db, 'acervo'), id);
      updateDoc(itemRef, { itemImages: [] }).catch((error) => {
        console.error(error)
      })
    } catch (error) {
      console.error(error);
    }
  };

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

  //funções relativas ao select
  const [collectionList, setCollectionList] = useState<string[]>([]);

  //carrega todas as coleções do firestore
  const getCollections = async () => {
    const collectionsRef = collection(db, 'coleções')
    try {
      const collections = await getDocs(collectionsRef)
      return collections.docs.map(doc => doc.data().nome)
    }
    catch {
      return []
    }
  }
  useEffect(() => {
    getCollections().then((collections) => {
      return setCollectionList(collections || []);
    });
  }, []);

  if (!logged) {
    return (
      <Content>
        <Heading>
          <Typography variant="displayLarge" color={palette.onSurface.main} alignSelf={'stretch'}>
            Acesso negado
          </Typography>
          <Typography variant="headlineSmall" color={palette.onSurface.main} alignSelf={'stretch'}>
            Você precisa estar logado para acessar essa página
          </Typography>
        </Heading>
      </Content>
    )
  }

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
                          : <option value="" disabled data-cy='select-collection-item'>Falha ao carregar as coleções</option>
                        :
                        collectionList.length !== 0 ?
                          collectionList.map((collection, idx) => (
                            <MenuItem value={collection} key={idx} data-cy='select-collection-item'>{collection}</MenuItem>))
                          : <MenuItem value="" disabled data-cy='select-collection-item'>Falha ao carregar as coleções</MenuItem>
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
          <DialogContentText data-cy='dialog-text'>
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
