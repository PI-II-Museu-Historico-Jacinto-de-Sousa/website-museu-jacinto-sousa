import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Theme, styled, useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { DatePicker } from "@mui/x-date-pickers";
import Checkbox from "@mui/material/Checkbox";
import Imagem from "../interfaces/Imagem";
import { useForm } from "react-hook-form";
import { Controller, SubmitHandler } from "react-hook-form";
import Exposicao from "../interfaces/Exposicao";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { ClientExposicaoFirebase } from "../Utils/exposicaoFirebase";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Dialog, DialogContent, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";

const CriarExposicao = () => {

  const [logged, setLogged] = useState(false);
  const [imagem, setImagem] = useState<Imagem>();
  const {
    register,
    watch,
    setError,
    control,
    handleSubmit,
    formState,
    reset,
    resetField
  } = useForm<Exposicao>({
      defaultValues: {
        nome: "",
        descricao: "",
        privado: false,
        permanente: false,
        dataInicio: undefined,
        dataFim: undefined,
        imagem: { src: "", title: "", alt: "" },
        itensPorColecao: new Map<string, Array<[string, Exposicao]>>(),
        dataCriacao: new Date()
      }
  });
  const { errors, isSubmitSuccessful, isSubmitting } = formState
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const dataInicio = dayjs(watch('dataInicio')); // Watch the start date
  const dataFim = dayjs( watch('dataFim')); // Watch the end date
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

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

  //efeito para limpar o formulário após inserir um item com sucesso
  useEffect(() => {
    if (errors?.root?.type !== 'submitFailure' && isSubmitSuccessful) {
      reset()
      //limpa os arquivos selecionados para uma nova adição
    }
  }, [isSubmitSuccessful, errors?.root?.type, reset])

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {

        const imagemForm = {
          alt: '',
          src: file,
          title: file.name,
        } as Imagem
        setImagem(imagemForm);
      }
    };
    input.click();
  };

  const submitForm: SubmitHandler<Exposicao> = async (data: Exposicao) => {
    const permanente = data.permanente
    try {
        if(permanente) {
            const exposicao = {
              nome: data.nome || '',
              descricao: data.descricao || '', // Provide a default value for descricao
              privado: data.privado,
              permanente: permanente,
              itensPorColecao: data.itensPorColecao,
              dataCriacao: data.dataCriacao
            }
            // Adiciona as imagens caso exista
            if (imagem) {
              exposicao.imagem = imagem;
              exposicao.imagem.alt = data.imagem.alt;
            }
            const client = new ClientExposicaoFirebase()
            client.adicionarExposicao(exposicao).then(() => {
              setOpenDialogSave(true)
              setImagem(undefined)
            })
        } else {
            const exposicao = {
              nome: data.nome || '',
              descricao: data.descricao || '', // Provide a default value for descricao
              privado: data.privado,
              permanente: permanente,
              dataInicio: data.dataInicio?.toDate(),
              dataFim: data.dataFim?.toDate(),
              itensPorColecao: data.itensPorColecao,
              dataCriacao: data.dataCriacao
            }
            // Adiciona as imagens caso exista
            if (imagem) {
              exposicao.imagem = imagem;
              exposicao.imagem.alt = data.imagem.alt;
            }
            const client = new ClientExposicaoFirebase()
            client.adicionarExposicao(exposicao).then(() => {
              setOpenDialogSave(true)
            })
        }
      } catch (error) {
        setError('root', {
          type: 'submitFailure',
          message: (error as Error).message
        })
      }
    }


    // Reseta os campos de data
    useEffect(() => {
      if (isSubmitSuccessful) {
        reset();
        resetField('dataInicio');
        resetField('dataFim');
      }
    }, [isSubmitSuccessful, reset, resetField]);


    const concluiSalvamento = () => {
      setOpenDialogSave(false)
      reset()
    }

  return (
    <Content>
      <Heading>
        <Typography variant="displayLarge">Criar Exposição</Typography>
        <Typography variant="headlineSmall">Cadastre uma nova exposição permanente ou temporária e adicione os itens que serão expostos</Typography>
      </Heading>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Fields>
          <SectionFields>
            <ImageUpload>
              {
                imagem && (
                  <>
                    <img
                      alt={imagem?.alt}
                      data-cy="imagemCapa"
                      style={{ width: '240px', height: '240px' }}
                      src={imagem?.src instanceof File ? URL.createObjectURL(imagem?.src) : imagem?.src}
                    />
                  </>
                )
              }
              <SessaoBotoes>
                <BotaoPrimario
                  data-cy="botaoAdicionarImagem"
                  onClick={handleAddImage}
                >Adicionar capa</BotaoPrimario>
                {
                  imagem && (
                    <BotaoRemoverImagem
                      data-cy="botaoRemoverImagem"
                      onClick={() => setImagem(undefined)}
                    >Remover capa</BotaoRemoverImagem>
                  )
                }
              </SessaoBotoes>
              {
                imagem && (
                  <TextFieldDados
                    id="nomeImagem"
                    variant="filled"
                    label="Texto alternativo da imagem"
                    {...register('imagem.alt')}
                    error={errors.imagem?.alt !== undefined}
                  />
                )
              }
            </ImageUpload>
            <TextFieldDados
              id="nomeExposicao"
              data-cy="nome"
              {...register('nome', {
                required: "Nome da Exposição é obrigatório"
              })}
              style={
                {
                  maxHeight: mobile ? '300px' : '600px'
                }
              }
              error={errors.nome?.message !== undefined}
              helperText={<span data-cy="nomeExposicao-helper-text">{errors.nome?.message}</span>}
              variant="filled"
              label="Nome da Exposição"
            />
            <TextFieldDados
              {...register('descricao')}
              data-cy="descricao"
              variant="filled"
              style={
                {
                  maxHeight: mobile ? '300px' : '600px'
                }
              }
              label="Descrição da Exposição"
              multiline
            />
            <Verification>
            <FormControlLabel id='checkbox-privacy'
            control={
              <Controller
                {...register('permanente')}
                name="permanente"
                control={control}
                render={({ field: props }) => (
                  <Checkbox
                    data-cy="permanente"
                    {...props}
                    checked={props.value}
                    onChange={(e) => props.onChange(e.target.checked)}
                  />
                )}
              />}
            label="Exposição Permanente" labelPlacement='start' />
          </Verification>
            {
              !watch('permanente') && (
                <FieldExposicaoTemporaria
                  data-cy="campos-datas"
                >
                  {
                    mobile ? (
                      <>
                        <Controller
                          name="dataInicio"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <MobileDatePickerInicioFim
                              {...field}
                              {...register('dataInicio', {
                                required: "Data de início é obrigatória"
                              })}
                              maxDate={dataFim}
                              data-cy="dataInicio"
                              label='Data de início'
                              inputRef={field.ref}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              value={field.value ? dayjs(field.value) : null} // Use o valor do campo
                              slotProps={{
                                textField: {
                                  id: 'dataInicio',
                                  error: !!error,
                                  helperText: error ? error.message : null,
                                },
                              }}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="dataFim"
                          render={({ field, fieldState: { error } }) => (
                            <MobileDatePickerInicioFim
                              {...field}
                              {...register('dataFim', {
                                required: "Data de fim é obrigatória"
                              })}
                              label='Data de fim'
                              data-cy="dataFim"
                              inputRef={field.ref}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              minDate={dataInicio || dayjs()}
                              value={field.value ? dayjs(field.value) : null} // Use o valor do campo
                              slotProps={{
                                textField: {
                                  id: 'dataFim',
                                  error: !!error,
                                  helperText: error ? error.message : null,
                                },
                              }}
                            />
                          )}
                        />
                      </>
                    ) : (
                        <>
                          <Controller
                            name="dataInicio"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <DatePickerInicioFim
                                {...field}
                                {...register('dataInicio', {
                                  required: "Data de início é obrigatória"
                                })}
                                maxDate={dataFim}
                                data-cy="dataInicio"
                                label='Data de início'
                                inputRef={field.ref}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                value={field.value ? dayjs(field.value) : null} // Use o valor do campo
                                slotProps={{
                                  textField: {
                                    id: 'dataInicio',
                                    error: !!error,
                                    helperText: error ? error.message : null,
                                  },
                                }}
                              />
                            )}
                          />
                        <Controller
                            control={control}
                            name="dataFim"
                            render={({ field, fieldState: { error } }) => (
                              <DatePickerInicioFim
                                {...field}
                                {...register('dataFim', {
                                  required: "Data de fim é obrigatória"
                                })}
                                label='Data de fim'
                                data-cy="dataFim"
                                inputRef={field.ref}
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                minDate={dataInicio || dayjs()}
                                value={field.value ? dayjs(field.value) : null} // Use o valor do campo
                                slotProps={{
                                  textField: {
                                    id: 'dataFim',
                                    error: !!error,
                                    helperText: error ? error.message : null,
                                  },
                                }}
                              />
                            )}
                          />
                        </>
                    )
                  }
                </FieldExposicaoTemporaria>
              )
            }
          </SectionFields>
        </Fields>
      <ContainerBotaoPrimario>
        <BotaoAdicionarItem>
          Adicionar item
        </BotaoAdicionarItem>
      </ContainerBotaoPrimario>
      <Itens>
        <ItensContent>

        </ItensContent>
      </Itens>
      <Submit>
        <Verification>
          <FormControlLabel id='checkbox-privacy'
          control={
            <Controller
              {...register('privado')}
              name="privado"
              control={control}
              render={({ field: props }) => (
                <Checkbox
                  data-cy="privado"
                  {...props}
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                />
              )}
            />}
          label="Exposição Privada" labelPlacement='start' />
        </Verification>
        <Options>
          <Option>

          </Option>
          <BotaoPrimario
            data-cy="botaoSubmit"
            disabled={isSubmitting}
            type="submit"
          >Salvar</BotaoPrimario>
        </Options>
      </Submit>
      <Dialog
        open={openDialogSave}
      >
        <CustomDialogContent>
          Imagem já adicionada!
        </CustomDialogContent>
        <CustomDialogContent>
          <BotaoOk
            onClick={() => setOpenDialogSave(false)}
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
          Item criado com sucesso
        </CustomDialogContent>
        <CustomDialogContent>
          <BotaoOk
            onClick={() => concluiSalvamento()}
            data-cy="button-ok-dialog-save"
          >Ok</BotaoOk>
        </CustomDialogContent>
      </Dialog>
    </Form>
    </Content>
  )
}

const Content = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
}))

const Heading = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
  backgroundColor: theme.palette.surfaceContainerLow.main,
}))

const Form = styled('form')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
  backgroundColor: theme.palette.surfaceContainerLow.main,
}))

const Fields = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignSelf: 'stretch',
  backgroundColor: theme.palette.surfaceContainerLow.main,
}))

const SectionFields = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(4),
  flex: '1 0 0',
}))

const ImageUpload = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Centraliza o conteúdo verticalmente
  alignItems: 'center',      // Centraliza o conteúdo horizontalmente
  gap: theme.spacing(1.25),
  width: '100%', // Adiciona a largura para o contêiner se necessário
  backgroundColor: theme.palette.surfaceContainerLow.main,
}));

const TextFieldDados = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  width: '100%', // Adapta para centralizar dentro do contêiner pai
  maxWidth: '560px',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
  borderRadius: '4px',
}));

const FieldExposicaoTemporaria = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.25),
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(4),
}))

const SessaoBotoes = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(5),
}))

const Submit = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  alignSelf: 'stretch',
  backgroundColor: theme.palette.surfaceContainerLow.main,
}))

const Verification = styled('section')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
}))

const Options = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: theme.spacing(1),
  alignSelf: 'stretch',
}))

const Option = styled('section')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

const Itens = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(1.25)} ${theme.spacing(0)}`,
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
}))

const ItensContent = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(0)} ${theme.spacing(8)}`,
  alignItems: 'flex-start',
  alignContent: 'flex-start',
  gap: theme.spacing(7.5),
  flex: '1 0 0',
}))

const DatePickerInicioFim = styled(DatePicker)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
  borderRadius: '4px 4px 0px 0px',
}))

const MobileDatePickerInicioFim = styled(MobileDatePicker)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
  borderRadius: '4px 4px 0px 0px',
}))

const ContainerBotaoPrimario = styled(Content)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.surfaceContainerLow.main,
  flexDirection: 'column',
  justifContent: 'center',
  alignItems: 'center',
}))

const BotaoPrimario = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '40px',
  flexDirection: 'column',
  justifContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '100px',
  textTransform: 'initial'
}))

const BotaoAdicionarItem = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '40px',
  flexDirection: 'column',
  justifContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.tertiary.main,
  color: theme.palette.primary.contrastText,
  textTransform: 'initial',
  borderRadius: '100px',
  margin: '20px'
}))

const BotaoRemoverImagem = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '40px',
  flexDirection: 'column',
  justifContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.primary.contrastText,
  textTransform: 'initial',
  borderRadius: '100px',
}))

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.secondaryContainer.main,
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

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

export default CriarExposicao;
