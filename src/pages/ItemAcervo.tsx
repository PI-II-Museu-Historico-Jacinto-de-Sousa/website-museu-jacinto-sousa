import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextField  from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Item from "@mui/material/ListItem";
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from "@mui/material/Chip";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { SubmitHandler, Controller } from "react-hook-form"
import { auth } from "../../firebase/firebase";
import dayjs from "dayjs";
import SlidingBanner from "../components/SlidingBanner/SlidingBanner";
import  { deleteItemAcervo }  from "../Utils/itemAcervoFirebase";
import useItemAcervo from "../hooks/useItemAcervo";
import { updateItemAcervo } from "../Utils/itemAcervoFirebase";
import useFormItemAcervo from "../hooks/useItemAcervoForm";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./Erro";
import useColecoes from "../hooks/useColecoes";
import { Colecao } from "../interfaces/Colecao";
import Imagem from "../interfaces/Imagem";
import { Timestamp } from "firebase/firestore";

interface SlidingBannerProps {
  images: Imagem[];
  addImage: () => void;
  editAlt: (key: number) => void;
  removeImage: (key: number) => void;
}

const ItemAcervoComponent = () => {
  const { id } = useParams<{ id: string }>();
  const url = window.location.pathname; // Obtém a URL atual
  const parts = url.split('/'); // Divide a URL em partes

  // Encontra o índice de "colecoes"
  const index = parts.findIndex(part => part === "colecoes");

  // Pega tudo após "colecoes", excluindo o próprio "colecoes"
  const pathAfterColecoes = index !== -1 ? parts.slice(index + 1).join('/') : '';

  const [logged, setLogged] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpenDialog] = useState(false)
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const [documentoExiste, setDocumentoExiste] = useState(false);
  const [ imagens, setImagens ] = useState<Imagem[]>([]);
  const ItemAcervo = useItemAcervo(pathAfterColecoes ?? '');
  const { register, control, handleSubmit, formState, setValue, watch, reset } = useFormItemAcervo(ItemAcervo.itemAcervo===null?undefined:ItemAcervo.itemAcervo)
  const [ imagensDuplicadas, setImagemDuplicada ] = useState(false);

  const watchName = watch('nome');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    });

    // Retorne uma função de limpeza para cancelar a inscrição do listener
    return () => unsubscribe();
  }, [logged]); // Dependência vazia para garantir que o efeito seja executado apenas uma vez

  useEffect(() => {
    if (!dataFetched && ItemAcervo.status === 'success' && ItemAcervo.itemAcervo) {
      setDataFetched(true);
      setDocumentoExiste(true);
      reset({
        nome: ItemAcervo.itemAcervo.nome ?? '',
        descricao: ItemAcervo.itemAcervo.descricao ?? '',
        curiosidades: ItemAcervo.itemAcervo.curiosidades ?? '',
        colecao: ItemAcervo.itemAcervo.colecao ?? '',
        imagens: ItemAcervo.itemAcervo.imagens,
        dataDoacao: ItemAcervo.itemAcervo.dataDoacao ? dayjs(ItemAcervo.itemAcervo.dataDoacao.toDate()) : null,
        privado: ItemAcervo.itemAcervo.privado ?? false,
      });
      const listaImagens = ItemAcervo.itemAcervo.imagens
        .filter((imagem) => imagem !== null && imagem !== undefined) // Filtra imagens nulas ou indefinidas
        .map((imagem) => ({
          title: imagem.title,
          alt: imagem.alt,
          src: imagem.src,
      }));
      setImagens(listaImagens); // Atualizando o estado
    } else if (ItemAcervo.status === 'error.permission-denied' || ItemAcervo.itemAcervo !== null) {
      setDocumentoExiste(true);
    } else if (ItemAcervo.status === 'error.not-found') {
      setDocumentoExiste(false);
    } else if (ItemAcervo.itemAcervo === null) {
      setDocumentoExiste(false);
    }
  }, [ItemAcervo, dataFetched, setValue, reset, editing]);

  //valor desses campos é observado para alterar a renderização da página
  const { errors } = formState

  //função que é chamada ao submeter o formulário
  const onSubmit: SubmitHandler<ItemAcervo> = async (formData: ItemAcervo) => {
    formData.id = ItemAcervo.itemAcervo?.id;
    formData.imagens = [...imagens];
    formData.dataDoacao = formData.dataDoacao ? Timestamp.fromDate(formData.dataDoacao.toDate()) : null;
    formData.privado = Boolean(formData.privado);
    const novaColecao = collectionList.filter(collection => collection.nome === formData.colecao)[0]
    updateItemAcervo(formData,  novaColecao).then(() => {
      setOpenDialogSave(watchName !=='');
    }).catch(() => {
      setOpenDialogSave(false);
    });
  }

  //query que verifica se a resolução for menor que 600px
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  //Funções relativas ao select de coleções
   //funções relativas ao select

  const collectionList: Colecao[] = useColecoes()

  const redirecionarExclusao = () => {
    deleteItemAcervo(ItemAcervo.itemAcervo?.id || "" );
    navigate('/home');
  }

  const cancelarEdicao = () => {
    setEditing(false);
    if (ItemAcervo.itemAcervo) {
      reset({
        nome: ItemAcervo.itemAcervo.nome ?? '',
        descricao: ItemAcervo.itemAcervo.descricao ?? '',
        curiosidades: ItemAcervo.itemAcervo.curiosidades ?? '',
        colecao: ItemAcervo.itemAcervo.colecao ?? '',
        imagens: ItemAcervo.itemAcervo.imagens || [],
        dataDoacao: ItemAcervo.itemAcervo.dataDoacao ? dayjs(ItemAcervo.itemAcervo.dataDoacao.toDate()) : dayjs(''),
        privado: ItemAcervo.itemAcervo.privado ?? false,
      });
    }
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const isDuplicate = imagens.some((imagem) => imagem.title === file.name);

        if (!isDuplicate) {
          const fileUrl = file as File;

          setImagens((prevImagens) => [
            ...prevImagens,
            { title: file.name, alt: '', src: fileUrl },
          ]);

          slidingBannerProps.images.push({ title: file.name, alt: '', src: fileUrl });
        } else {
          setImagemDuplicada(true);  // Atualiza o estado para true aqui
        }
      }
    };
    input.click();
  };

  const redionarSalvamento = () => {
    setOpenDialogSave(false);
    window.location.reload();
  }


  const handleEditAltText = (key: number) => {
    imagens.map((imagem, index) => {
      imagem.alt = (document.getElementById(`alt-${index}`) as HTMLInputElement).value
    })
  }

  const slidingBannerProps: SlidingBannerProps = {
    images: imagens,
    addImage: () => handleAddImage(),
    editAlt: (key: number) => handleEditAltText(key),
    removeImage: (key) => {
      setImagens((prevImagens) => prevImagens.filter((_, index) => index !== key));
    },
  } as SlidingBannerProps;

  const renderFields = () => {
    if(!documentoExiste) {
      const error = {
        status: 404,
        statusText: "Item não encontrado",
        data: {
          message: `Não foi possível encontrar o item \n"${id}"`
        }
      }
      return (
        <ErrorPage error={error}/>
      )
    } else {
      if(ItemAcervo.status === 'success') {
        if(editing) {
          return (
            <>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  data-cy="form-item-acervo"
                >
                    <Content>
                      <Title
                        data-cy="title-item-acervo"
                      >
                        <SessaoBotoes>
                          <BotaoAlterarDados
                            type="submit"
                            data-cy="save-button"
                          >
                            Salvar
                          </BotaoAlterarDados>
                          <BotaoCancelar
                              onClick={() => cancelarEdicao() }
                              data-cy="cancel-button"
                            >Cancelar
                          </BotaoCancelar>
                        </SessaoBotoes>
                        <TextFieldTitulo
                          value={watchName}
                          {...register('nome', {
                            required: "Nome do item é obrigatório"
                          })}
                          error={errors.nome?.message !== undefined}
                          helperText={errors.nome?.message}
                          label="Nome"
                          multiline
                          variant="filled"
                          id="Textfield-nome"
                          data-cy="Textfield-nome"
                        >
                        </TextFieldTitulo>
                        <CheckPrivacidade>
                          <FormControlLabel
                            control={<Controller
                              name="privado"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  {...field}
                                  {...register('privado')}
                                  checked={Boolean(field.value)}
                                  onChange={(event) => field.onChange(event.target.checked)}
                                  data-cy="checkbox-privado" />
                              )}
                              data-cy="controller-checkbox-privado" />} label="Privado"
                            />
                        </CheckPrivacidade>
                      </Title>
                      <Imagens>
                        <SlidingBanner {...slidingBannerProps} />
                      </Imagens>
                      <Info>
                        <Typography variant="bodyLarge" color={theme.palette.onSurface.main}>
                          Adicionado ao acervo em :
                        </Typography>
                        <DateView>
                          {
                            mobile ?
                            <Controller
                              name="dataDoacao"
                              control={control}
                              defaultValue={dayjs(ItemAcervo.itemAcervo?.dataDoacao?.toDate())}
                              render={({ field }) => (
                                <DatePickerMobileDataAquisicao
                                  defaultValue={dayjs(ItemAcervo.itemAcervo?.dataDoacao?.toDate())}
                                  label="Data da doação"
                                  {...register('dataDoacao')}
                                  onChange={(value) => field.onChange(value)}
                                  data-cy="datepicker-mobile"
                                />
                              )}
                              data-cy="controller-datepicker-mobile"
                            />
                            :
                            <Controller
                              name="dataDoacao"
                              control={control}
                              defaultValue={dayjs(ItemAcervo.itemAcervo?.dataDoacao?.toDate())}
                              render={({ field }) => (
                                <DatePickerDataAquisicao
                                  defaultValue={dayjs(ItemAcervo.itemAcervo?.dataDoacao?.toDate())}
                                  {...register('dataDoacao')}
                                  onChange={(value) => field.onChange(value)}
                                  data-cy="datepicker-desktop"
                                />
                              )}
                              data-cy="controller-datepicker-desktop"
                            />
                          }
                        </DateView>
                      </Info>
                      <Description
                        divider={<Divider orientation="horizontal" flexItem />}
                      >
                        <Item>
                          <TitleSections>
                            <Typography
                              variant="displayMedium"
                              color={theme.palette.tertiary.main}
                            >
                              Descrição
                            </Typography>
                          </TitleSections>
                        </Item>
                        <Item>
                        <TextFieldDescricao
                          value={watch('descricao')}
                          {...register('descricao')}
                          error={errors.descricao?.message !== undefined}
                          helperText={errors.descricao?.message}
                          label="Descrição"
                          variant="filled"
                          data-cy="Textfield-descricao"
                          multiline
                        >
                        </TextFieldDescricao>
                        </Item>
                      </Description>
                      <Curiosities
                        divider={<Divider orientation="horizontal" flexItem />}
                      >
                      <Item>
                        <TitleSections>
                          <Typography
                            variant="displayMedium"
                            color={theme.palette.tertiary.main}
                          >
                            Curiosidades
                          </Typography>
                        </TitleSections>
                      </Item>
                        <Item>
                        <TextFieldCuriosidades
                          {...register('curiosidades')}
                          value={watch('curiosidades')}
                          error={errors.curiosidades?.message !== undefined}
                          helperText={errors.curiosidades?.message}
                          label="Curiosidades"
                          variant="filled"
                          data-cy="Textfield-curiosidades"
                          multiline
                        >
                        </TextFieldCuriosidades>
                        </Item>
                      </Curiosities>
                      <Collection>
                        <Typography style={{color: theme.palette.tertiary.main}} variant="headlineMedium" >
                          Coleção
                        </Typography>
                        <MenuColecao>
                          <BuildingBlocks>
                            <StateLayer>
                              <Controller
                                name="colecao"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    value={field.value}
                                    {...register('colecao')}
                                    label="Seleção de Coleção"
                                    variant="filled"
                                    data-cy="select-collection"
                                  >
                                    {
                                      collectionList.length !== 0 ?
                                      collectionList.map((collection, idx) => (
                                        <MenuItem value={collection.nome} key={idx} data-cy='select-collection-item'>{collection.nome}</MenuItem>))
                                      : <MenuItem value="" disabled data-cy='select-collection-item-fail'>Falha ao carregar as coleções</MenuItem>
                                    }
                                  </Select>
                                )}
                                data-cy="controller-select-collection"
                              />
                            </StateLayer>
                          </BuildingBlocks>
                        </MenuColecao>
                      </Collection>
                      <Options>
                        <BotaoExcluir
                          onClick={() => setOpenDialog(true)}
                          data-cy="delete-button"
                        >
                          Excluir item
                        </BotaoExcluir>
                      </Options>
                  </Content>
                  <Dialog
                    open={imagensDuplicadas}
                  >
                    <CustomDialogContent>
                      Imagem já adicionada!
                    </CustomDialogContent>
                    <CustomDialogContent>
                      <BotaoOk
                        onClick={() => setImagemDuplicada(false)}
                        data-cy="button-ok-dialog-save"
                      >Ok</BotaoOk>
                    </CustomDialogContent>
                  </Dialog>
                  <Dialog
                    open={openDialogSave}
                    onClose={() => setOpenDialogSave(false)}
                    data-cy="dialog-confirm-save"
                  >
                    <CustomDialogContent>
                      Alterações salvas com sucesso!
                    </CustomDialogContent>
                    <CustomDialogContent>
                      <BotaoOk
                        onClick={() => redionarSalvamento()}
                        data-cy="button-ok-dialog-save"
                      >Ok</BotaoOk>
                    </CustomDialogContent>
                  </Dialog>
                  <Dialog
                    open={open}
                    onClose={() => setOpenDialog(false)}
                    data-cy="dialog-excluir"
                  >
                    <CustomDialogTitle>
                        Deseja mesmo excluir esse item?
                      </CustomDialogTitle>
                      <CustomDialogContent>
                        <BotaoCancelar
                          onClick={() => setOpenDialog(false)}
                          data-cy="cancel-button-dialog-excluir"
                        >Cancelar</BotaoCancelar>
                        <BotaoExcluir
                          onClick={() => redirecionarExclusao()}
                          data-cy="confirm-button-dialog-excluir"
                        >Excluir</BotaoExcluir>
                      </CustomDialogContent>
                  </Dialog>
                </form>
            </>
          )
        } else {
          return (
            <>
                <Content>
                  <Title
                    data-cy="title-item-acervo"
                  >
                      {
                        logged && (
                          <BotaoAlterarDados
                                onClick={() => setEditing(true)}
                                data-cy="edit-button"
                              >Editar
                          </BotaoAlterarDados>
                        )
                      }
                      <Typography variant="displayMedium" color={theme.palette.tertiary.main}>
                        {
                          ItemAcervo.itemAcervo?.nome
                        }
                      </Typography>
                      {
                        watch('privado') && (
                          <Typography variant="displaySmall" color={theme.palette.onBackground.main}>
                            Item Privado
                          </Typography>
                        )
                      }
                  </Title>
                  <Imagens>
                    <SlidingBanner {...slidingBannerProps} />
                  </Imagens>
                  <Info>
                    <Typography variant="bodyLarge" color={theme.palette.onPrimaryContainer.main}>
                      Adicionado ao acervo em :
                    </Typography>
                    <DateView>
                      <Date>
                        {
                          dayjs(ItemAcervo.itemAcervo?.dataDoacao?.toDate()).format('DD/MM/YYYY')
                        }
                      </Date>
                    </DateView>
                  </Info>
                  <Description
                    divider={<Divider orientation="horizontal" flexItem />}
                  >
                      <Item>
                        <TitleSections>
                          <Typography
                            variant="displayMedium"
                            color={theme.palette.tertiary.main}
                          >
                            Descrição
                          </Typography>
                        </TitleSections>
                      </Item>
                      <Item>
                        <Typography variant="bodyLarge" color={theme.palette.onPrimaryContainer.main}>
                          {
                            ItemAcervo.itemAcervo?.descricao
                          }
                        </Typography>
                      </Item>
                  </Description>
                  <Curiosities
                     divider={<Divider orientation="horizontal" flexItem />}
                  >
                      <Item>
                        <TitleSections>
                          <Typography
                            variant="displayMedium"
                            color={theme.palette.tertiary.main}
                          >
                            Curiosidades
                          </Typography>
                        </TitleSections>
                      </Item>
                    <Item>
                      <Typography variant="bodyLarge" color={theme.palette.onPrimaryContainer.main}>
                        {
                          ItemAcervo.itemAcervo?.curiosidades
                        }
                      </Typography>
                    </Item>
                  </Curiosities>
                  <Collection>
                    <Typography style={{color: theme.palette.tertiary.main}} variant="headlineMedium" >
                      Coleção
                    </Typography>
                    <SecaoColecao>
                      <Chip label={ItemAcervo.itemAcervo?.colecao} style={{backgroundColor: theme.palette.tertiaryContainer.main}}
                        sx={{fontFamily: theme.typography.labelMedium.fontFamily, }}
                      />
                    </SecaoColecao>
                  </Collection>
                  <Options>
                    {
                      logged && (
                        <BotaoExcluir
                          onClick={() => setOpenDialog(true)}
                          data-cy="delete-button"
                        >
                          Excluir item
                        </BotaoExcluir>
                      )
                    }
                  </Options>
                  <Dialog
                      open={open}
                      onClose={() => setOpenDialog(false)}
                      data-cy="dialog-excluir"
                    >
                      <CustomDialogTitle>
                          Deseja mesmo excluir esse item?
                        </CustomDialogTitle>
                        <CustomDialogContent>
                          <BotaoCancelar
                            onClick={() => setOpenDialog(false)}
                            data-cy="cancel-button-dialog-excluir"
                          >Cancelar</BotaoCancelar>
                          <BotaoExcluir
                            onClick={() => redirecionarExclusao()}
                            data-cy="confirm-button-dialog-excluir"
                          >Excluir</BotaoExcluir>
                        </CustomDialogContent>
                    </Dialog>

                </Content>
            </>
          )
        }
      } else {
        if(ItemAcervo.status === 'loading') {
          return (
            <Content>
              <Typography variant="displayMedium" color={theme.palette.tertiary.main}>
                Carregando...
              </Typography>
            </Content>
          )
        } else {
          const error = {
            status: 403,
            statusText: "Acesso negado",
            data: {
              message: "Você precisa estar logado para acessar essa página"
            }
          }
          return (
            <>
              <ErrorPage error={error}/>
            </>
          )
        }
      }
    }
  }

  return (
    <>
        {
          renderFields()
        }
    </>
  );
};

//Estilização da página

const Content = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(3)} ${theme.spacing(4)}`, //var(--Content-vpad, 24px) var(--Content-hpad, 32px);
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(5),
  backgroundColor: theme.palette.Background.main,
}));

const Title = styled('section')(({ theme }: { theme: Theme }) => ({
  margin: `${theme.spacing(2)} 0`, //var(--space-2, 16px) 0;
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  alignSelf: 'stretch',
}))

const TitleSections = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
}))

const Imagens = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.25),
}))

const Info = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`, //var(--space-2, 16px) var(--space-3, 24px);
  alignItems: 'center',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
  borderType: 'solid',
  borderColor: theme.palette.onSurface.main,
  borderRadius: '1px',
  backgroundColor: theme.palette.surfaceContainerLowest.main,
}))

const DateView = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`, //var(--space-2, 16px) var(--space, 8px);
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1), //var(--space, 8px);
}))

const Date = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(1)} ${theme.spacing(0.5)}`, //var(--space, 8px) var(--space-05, 4px);
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  borderRadius: theme.spacing(1), //var(--space, 8px);
  backgroundColor: theme.palette.secondaryContainer.main, //var(--Schemes-Secondary-Container, #FFDBCC);
}))

const Description = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(0)} ${theme.spacing(1)}`, //var(--space-0, 0px) var(--space, 8px);
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
  borderRadius: '2px',
  borderStyle: 'solid',
  borderColor: theme.palette.outline.main,
  backgroundColor: theme.palette.surfaceContainerLow.main,
}))

const Curiosities = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(0)} ${theme.spacing(1)}`, //var(--space-0, 0px) var(--space, 8px);
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2), //var(--space-2, 16px);
  alignSelf: 'stretch',
  //border: 2px solid var(--Schemes-Outline, #85736C);
  //background: var(--Schemes-Surface-Container-Low, #FFF1EB);
  borderRadius: '2px',
  borderStyle: 'solid',
  borderColor: theme.palette.outline.main,
  backgroundColor: theme.palette.surfaceContainerLow.main,
}))

const Collection = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(8)} ${theme.spacing(1)}`, //31px var(--space, 8px);
  alignItems: 'center',
  gap: theme.spacing(1.25), //var(--space-1.25, 10px);
  alignSelf: 'stretch',
  //border: var(--space-0, 1px) solid var(--Schemes-On-Surface, #221A16);
  //background: var(--Schemes-Surface-Container, #FCEAE3);
  borderRadius: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.outline.main,
  backgroundColor: theme.palette.surfaceContainer.main,
}))

const Options = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  alignSelf: 'stretch',
}))

const SessaoBotoes = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(5),
}))

const CheckPrivacidade = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap:  theme.spacing(1.25),
}))

const DatePickerDataAquisicao = styled(DatePicker)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '4px 4px 0px 0px',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
}))

const DatePickerMobileDataAquisicao = styled(MobileDatePicker)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '4px 4px 0px 0px',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
}))

const TextFieldTitulo = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
}))

const TextFieldDescricao = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  width: '50%',
  height: '100%',
  flexDirection: 'column',
  borderRadius: '4px 4px 0px 0px',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
}))

const TextFieldCuriosidades = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  width: '50%',
  height: '100%',
  flexDirection: 'column',
  borderRadius: '4px 4px 0px 0px',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
}))

const BotaoAlterarDados = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: '100px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.onPrimary.main,
  textTransform: 'initial'
}))

const BotaoCancelar = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderRadius: '100px',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.onSecondary.main,
  textTransform: 'initial'
}))

const SecaoColecao = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`, //var(--space-2, 16px) var(--space-3, 24px);
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.25), //var(--space-1.25, 10px);
  borderRadius: '20px', //2px solid var(--Schemes-Outline, #85736C),
  borderColor: theme.palette.outline.main,
  borderStyle: 'solid',
  backgroundColor: theme.palette.tertiaryContainer.main  //var(--Schemes-Tertiary-Container, #EDE4A9);
}))

const MenuColecao = styled('section')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}))

const BuildingBlocks = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
}))

const StateLayer = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(0.5)} ${theme.spacing(0.5)}`, //10px var(--space-05, 4px) 10px var(--space, 8px);
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1), //var(--space, 8px);
}))

const BotaoExcluir = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '40px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: '100px',
  backgroundColor: theme.palette.error.main,
  color: theme.palette.onPrimary.main,
  textTransform: 'initial'
}))

const BotaoOk = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '40px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: '100px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.onPrimary.main,
  textTransform: 'initial'
}))

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.secondaryContainer.main,
  color: theme.palette.onBackground.main,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.secondaryContainer.main,
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export default ItemAcervoComponent;
