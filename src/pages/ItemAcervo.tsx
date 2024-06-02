import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextField  from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { SubmitHandler, Controller } from "react-hook-form"
import EditIcon from '@mui/icons-material/Edit';
import { auth } from "../../firebase/firebase";
import dayjs from "dayjs";
import  { deleteItemAcervo }  from "../Utils/itemAcervoFirebase";
import useItemAcervo from "../hooks/useItemAcervo";
import { updateItemAcervo } from "../Utils/itemAcervoFirebase";
import useFormItemAcervo from "../hooks/useItemAcervoForm";
import { useNavigate } from "react-router-dom";
import { getNomesColecoes } from "../Utils/colecaoFirebase";
import ErrorPage from "./Erro";

const ItemAcervoComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [logged, setLogged] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpenDialog] = useState(false)
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const [documentoExiste, setDocumentoExiste] = useState(false);
  const ItemAcervo = useItemAcervo(id ?? '');
  const { register, control, handleSubmit, formState, setValue, watch, reset } = useFormItemAcervo(ItemAcervo.itemAcervo===null?undefined:ItemAcervo.itemAcervo)

  const itemAcervoNome = ItemAcervo.itemAcervo?.nome===undefined?'':ItemAcervo.itemAcervo?.nome;

  const itemAcervoDescricao = ItemAcervo.itemAcervo?.descricao===undefined?'':ItemAcervo.itemAcervo?.descricao;

  const itemAcervoCuriosidades = ItemAcervo.itemAcervo?.curiosidades===undefined?'':ItemAcervo.itemAcervo?.curiosidades;

  const itemAcervoColecao = ItemAcervo.itemAcervo?.colecao===undefined?'':ItemAcervo.itemAcervo?.colecao;

  const itemAcervoDataDoacao = dayjs(ItemAcervo.itemAcervo?.dataDoacao?.toDate());

  const itemAcervoPrivado = ItemAcervo.itemAcervo?.privado===undefined?false:ItemAcervo.itemAcervo?.privado;

  const itemAcervoStatus = ItemAcervo.status;

  const watchName = watch('nome');
  const watchPrivado = watch('privado');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLogged(true);
      }
    });

    // Retorne uma função de limpeza para cancelar a inscrição do listener
    return () => unsubscribe();
  }, [logged]); // Dependência vazia para garantir que o efeito seja executado apenas uma vez

  useEffect(() => {
    if (!dataFetched && ItemAcervo.status === 'success' && ItemAcervo.itemAcervo) {
      setValue('privado', ItemAcervo.itemAcervo.privado ?? false);
      setValue('colecao', ItemAcervo.itemAcervo.colecao ?? '');
      setValue('descricao', ItemAcervo.itemAcervo.descricao ?? '');
      setValue('curiosidades', ItemAcervo.itemAcervo.curiosidades ?? '');
      setValue('nome', ItemAcervo.itemAcervo.nome ?? '');
      const dataAquisicao = ItemAcervo.itemAcervo.dataDoacao ? dayjs(ItemAcervo.itemAcervo.dataDoacao.toDate()) : null;
      setValue('dataDoacao', dataAquisicao ?? dayjs(''));

      setDataFetched(true);
      setDocumentoExiste(true);
    } else if (ItemAcervo.status === 'error.permission-denied') {
      setDocumentoExiste(true);
    } else if (ItemAcervo.status === 'error.not-found') {
      setDocumentoExiste(false);
    }
  }, [ItemAcervo, dataFetched, setValue, editing]);

  //valor desses campos é observado para alterar a renderização da página
  const { errors } = formState

  //função que é chamada ao submeter o formulário
  const onSubmit: SubmitHandler<ItemAcervo> = async (formData: ItemAcervo) => {
    updateItemAcervo(formData, id ?? '')
  }

  //query que verifica se a resolução for menor que 600px
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  //Funções relativas ao select de coleções
   //funções relativas ao select

   const [collectionList, setCollectionList] = useState<string[]>([]);

  useEffect(() => {
    getNomesColecoes().then((collections) => {
      setCollectionList(collections)
    })
  }, []);

  const fechaDialog = () => {
    setOpenDialogSave(false);
    setEditing(false);
  }

  const redirecionarExclusao = () => {
    deleteItemAcervo(id ?? '')
    navigate('/')
  }

  const cancelarEdicao = () => {
    setEditing(false);
    if (ItemAcervo.itemAcervo) {
      reset({
        nome: ItemAcervo.itemAcervo.nome ?? '',
        descricao: ItemAcervo.itemAcervo.descricao ?? '',
        curiosidades: ItemAcervo.itemAcervo.curiosidades ?? '',
        colecao: ItemAcervo.itemAcervo.colecao ?? '',
        dataDoacao: ItemAcervo.itemAcervo.dataDoacao ? dayjs(ItemAcervo.itemAcervo.dataDoacao.toDate()) : dayjs(''),
        privado: ItemAcervo.itemAcervo.privado ?? false,
      });
    }
  };
  const renderFields = () => {
    //se o documento não existir, renderiza uma mensagem de erro
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
      //se o usuário estiver logado, renderiza a página de acordo com o estado de edição
      } else {
        if (logged) {
          //se não estiver editando, renderiza a página normalmente
          if(!editing) {
              return (
                <>
                  <Content>
                    <Title
                      data-cy="title-item-acervo"
                    >
                      <BotaoAlterarDados
                          onClick={() => setEditing(true)}
                          data-cy="edit-button"
                        >Editar
                      </BotaoAlterarDados>
                        <TextoTitulo>
                          {
                            itemAcervoNome
                          }
                        </TextoTitulo>
                        {
                          itemAcervoPrivado? <EstadoItem>Item Privado</EstadoItem> : <div></div>
                        }
                    </Title>
                    <Imagens>
                      <Alt>
                        <IconButton>
                          <EditIcon/>
                        </IconButton>
                      </Alt>
                    </Imagens>
                    <Info>
                      <TextoInfo>
                        Adicionado ao acervo em :
                      </TextoInfo>
                      <DateView>
                        <Date>
                          {
                            itemAcervoDataDoacao.format('DD/MM/YYYY')
                          }
                        </Date>
                      </DateView>
                    </Info>
                    <Description>
                      <List>
                        <ListItem>
                          <TitleSections>
                            <Typography
                              variant="displayLarge"
                              color={theme.palette.tertiary.main}
                            >
                              Descrição
                            </Typography>
                          </TitleSections>
                        </ListItem>
                        <Divider/>
                        <ListItem>
                          <TextBody>
                              {
                                itemAcervoDescricao
                              }
                        </TextBody>
                        </ListItem>
                      </List>
                    </Description>
                    <Curiosities>
                      <List>
                        <ListItem>
                          <TitleSections>
                            <Typography
                              variant="displayLarge"
                              color={theme.palette.tertiary.main}
                            >
                              Curiosidades
                            </Typography>
                          </TitleSections>
                        </ListItem>
                        <Divider/>
                        <ListItem>
                          <TextBody>
                            {
                              itemAcervoCuriosidades
                            }
                          </TextBody>
                        </ListItem>
                      </List>
                    </Curiosities>
                    <Collection>
                      <TextoColecao>
                        Coleção
                      </TextoColecao>
                      <LabelColecao>
                        <Chip label={itemAcervoColecao} style={{backgroundColor: theme.palette.tertiaryContainer.main}} />
                      </LabelColecao>
                    </Collection>
                    <Options>
                      <BotaoExcluir
                        onClick={() => setOpenDialog(true)}
                        data-cy="delete-button"
                      >
                        Excluir item
                      </BotaoExcluir>
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
          } else {
            //se estiver editando, renderiza o formulário de edição
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
                              onClick={() => setOpenDialogSave(watchName !=='')}
                            >
                              Salvar
                            </BotaoAlterarDados>
                            <BotaoCancelar
                                onClick={() => cancelarEdicao() }
                                data-cy="cancel-button"
                              >Cancelar
                            </BotaoCancelar>
                          </SessaoBotoes>
                          <Controller
                            name="nome"
                            control={control}
                            render={({ field }) => (
                              <TextFieldTitulo
                                {...field}
                                value={field.value}
                                {...register('nome', {
                                  required: "Nome do item é obrigatório"
                                })}
                                error={errors.nome?.message !== undefined}
                                helperText={errors.nome?.message}
                                label="Nome"
                                variant="filled"
                                id="Textfield-nome"
                                data-cy="Textfield-nome"
                                onChange={(event) => field.onChange(event.target.value)}
                              >
                              </TextFieldTitulo>
                            )}
                            data-cy="controller-textfield-nome"
                          />
                          <CheckPrivacidade>
                            {watchPrivado? <EstadoItem>Item Privado</EstadoItem> : <div></div>}
                            <Controller
                              name="privado"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  {...field}
                                  {...register('privado')}
                                  checked={Boolean(field.value)}
                                  onChange={(event) => field.onChange(event.target.checked)}
                                  data-cy="checkbox-privado"
                                  style={{color: '#6750A4'}}
                                />
                              )}
                              data-cy="controller-checkbox-privado"
                            />
                          </CheckPrivacidade>
                        </Title>
                        <Imagens>
                          <BotaoAlterarDados>
                            Adicionar imagem
                          </BotaoAlterarDados>
                        </Imagens>
                        <Info>
                          <TextoInfo>
                            Adicionado ao acervo em :
                          </TextoInfo>
                          <DateView>
                            {
                              mobile ?
                              <Controller
                                name="dataDoacao"
                                control={control}
                                defaultValue={itemAcervoDataDoacao}
                                render={({ field }) => (
                                  <DatePickerMobileDataAquisicao
                                    defaultValue={itemAcervoDataDoacao}
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
                                defaultValue={itemAcervoDataDoacao}
                                render={({ field }) => (
                                  <DatePickerDataAquisicao
                                    defaultValue={itemAcervoDataDoacao}
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
                        <Description>
                        <TitleSections>
                          <Typography
                            variant="displayLarge"
                            color={theme.palette.tertiary.main}
                          >
                            Descrição
                          </Typography>
                        </TitleSections>
                          <LineHorizontal></LineHorizontal>
                          <Controller
                            name="descricao"
                            control={control}
                            render={({ field }) => (
                              <TextFieldDescricao
                                {...field}
                                value={field.value}
                                error={errors.descricao?.message !== undefined}
                                helperText={errors.descricao?.message}
                                label="Descrição"
                                variant="filled"
                                data-cy="Textfield-descricao"
                              >
                              </TextFieldDescricao>
                            )}
                            data-cy="controller-textfield-descricao"
                          />
                        </Description>
                        <Curiosities>
                        <TitleSections>
                          <Typography
                            variant="displayLarge"
                            color={theme.palette.tertiary.main}
                          >
                            Curiosidades
                          </Typography>
                        </TitleSections>
                          <LineHorizontal></LineHorizontal>
                          <Controller
                            name="curiosidades"
                            control={control}
                            render={({ field }) => (
                              <TextFieldCuriosidades
                                {...field}
                                value={field.value}
                                {...register('curiosidades')}
                                error={errors.curiosidades?.message !== undefined}
                                helperText={errors.curiosidades?.message}
                                label="Curiosidades"
                                variant="filled"
                                data-cy="Textfield-curiosidades"
                              >
                              </TextFieldCuriosidades>
                            )}
                            data-cy="controller-textfield-curiosidades"
                          />
                        </Curiosities>
                        <Collection>
                          <TextoColecao>
                            Coleção
                          </TextoColecao>
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
                                        collectionList.map((collection) => (
                                          <MenuItem
                                            key={collection}
                                            value={collection}
                                            data-cy="select-collection-item"
                                          >
                                            {collection}
                                          </MenuItem>
                                        ))
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
                      open={openDialogSave}
                      onClose={() => setOpenDialogSave(false)}
                      data-cy="dialog-confirm-save"
                    >
                      <CustomDialogContent>
                        Alterações salvas com sucesso!
                      </CustomDialogContent>
                      <CustomDialogContent>
                        <BotaoOk
                          onClick={() => fechaDialog()}
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
          }
        } else {
          //se o usuário não estiver logado e o item for privado, renderiza uma mensagem de erro
            if(itemAcervoStatus === 'error.permission-denied') {
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
            } else {
              //se o usuário não estiver logado e o item for público, renderiza a página normalmente mas sem a opção de edição
              return (
                <>
                    <Content>
                      <Title
                        data-cy="title-item-acervo"
                      >
                          <TextoTitulo>
                            {
                              itemAcervoNome
                            }
                          </TextoTitulo>
                      </Title>
                      <Imagens>
                      </Imagens>
                      <Info>
                        <TextoInfo>
                          Adicionado ao acervo em :
                        </TextoInfo>
                        <DateView>
                          <Date>
                            {
                              itemAcervoDataDoacao.format('DD/MM/YYYY')
                            }
                          </Date>
                        </DateView>
                      </Info>
                      <Description>
                          <TitleSections>
                            <Typography
                              variant="displayLarge"
                              color={theme.palette.tertiary.main}
                            >
                              Descrição
                            </Typography>
                          </TitleSections>
                        <LineHorizontal></LineHorizontal>
                        <TextBody>
                              {
                                itemAcervoDescricao
                              }
                        </TextBody>
                      </Description>
                      <Curiosities>
                          <TitleSections>
                            <Typography
                              variant="displayLarge"
                              color={theme.palette.tertiary.main}
                            >
                              Curiosidades
                            </Typography>
                          </TitleSections>
                        <LineHorizontal></LineHorizontal>
                        <TextBody>
                          {
                            itemAcervoCuriosidades
                          }
                        </TextBody>
                      </Curiosities>
                      <Collection>
                        <TextoColecao>
                          Coleção
                        </TextoColecao>
                        <LabelColecao>
                          <Chip label={itemAcervoColecao} style={{backgroundColor: theme.palette.tertiaryContainer.main}} />
                        </LabelColecao>
                      </Collection>
                      <Options>
                      </Options>
                    </Content>
                </>
              )
            }
      }
    }
  };

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

const TextoTitulo = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.tertiary.main,
  // material-theme/display/large
  fontFamily: theme.typography.displayLarge.fontFamily,
  fontSize: '48px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '56px', //116.667%
}))

const TitleSections = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
}))

const EstadoItem = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.onBackground.main, //var(--Schemes-On-Background, #221A16);
  //material-theme/display/small
  fontFamily: theme.typography.displaySmall.fontFamily,
  fontSize: '36px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '44px', //122.222%
}))

const TextBody = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.onPrimaryContainer.main, //var(--Schemes-On-Primary-Container, #351000);
  //material-theme/body/large
  fontFamily: theme.typography.bodyLarge.fontFamily,
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '24px', //150%
  letterSpacing: '0.5px',
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

const TextoInfo = styled(Typography)(({ theme }: { theme: Theme }) => ({
  //material-theme/body/large
  fontFamily: theme.typography.bodyLarge.fontFamily,
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '24px', /* 150% */
  letterSpacing: '0.5px',
  color: theme.palette.onSurface.main, //var(--Schemes-On-Surface, #221A16);
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

const Alt = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1.25), //var(--space-1.25, 10px);
}))


//Será usado quando tiver o slide banner
/*const AltText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.outline.main, //var(--Schemes-Outline, #85736C);
  //material-theme/label/large
  fontFamily: theme.typography.labelMedium.fontFamily,
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '20px', //142.857%
  letterSpacing: '0.1px',
}))*/

const Description = styled('section')(({ theme }: { theme: Theme }) => ({
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

const Curiosities = styled('section')(({ theme }: { theme: Theme }) => ({
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

const LineHorizontal = styled(Divider)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.outlineVariant.main,
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
}))

const LabelColecao = styled('label')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`, //var(--space-2, 16px) var(--space-3, 24px);
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.25), //var(--space-1.25, 10px);
  borderRadius: '20px', //2px solid var(--Schemes-Outline, #85736C),
  borderColor: theme.palette.outline.main,
  borderStyle: 'solid',
  backgroundColor: theme.palette.tertiaryContainer.main  //var(--Schemes-Tertiary-Container, #EDE4A9);
}))

const TextoColecao = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.tertiary.main,
  //material-theme/headline/medium
  fontFamily: theme.typography.headlineMedium.fontFamily,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '36px', //128.571%
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
}))

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.secondaryContainer.main,
  color: theme.palette.primary.main,
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
