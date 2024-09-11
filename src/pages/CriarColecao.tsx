import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Stack, TextField, Theme, Typography, styled, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import { ClientColecoesFirebase } from "../Utils/colecaoFirebase"
import { ColecaoCreate } from "../interfaces/Colecao"
import { Controller, useForm } from "react-hook-form"

interface FormValues{
  nome: string,
  descricao: string,
  curiosidades: string,
  privado: boolean
}

const CriarColecao = () =>{
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const clientColection = new ClientColecoesFirebase()

  const { register, handleSubmit, reset, control, formState: { isSubmitting }} = useForm<FormValues>({
    defaultValues: {
      nome: '',
      descricao: '',
      curiosidades: '',
      privado: false
    }
  })

  const [alert, setAlert] = useState<boolean>(false)

  const [invalidName, setInvalidName] = useState<boolean>(false)

  const onSubmit = async (data: FormValues) => {
    if(data.nome === ''){
      setAlert(false)
      setInvalidName(true)
    }
    else{
      setInvalidName(false)
      
      const newColection = {
        nome: data.nome,
        descricao: data.descricao,
        privado: data.privado,
      }
      
      try{
        await clientColection.adicionarColecao(newColection)
        
        setAlert(true)
        reset({
          nome: '',
          descricao: '',
          curiosidades: '',
          privado: false
        })
      }
      catch(error){
        console.log(error)
      }
    }
  }
  console.log(register)


  return(
    <Content
      data-cy="page-content"
    >
      <Heading>
        <Typography
          variant="displayLarge"
          color={theme.palette.onPrimaryContainer.main}
        >
          Criar Coleção
        </Typography>
        <Typography
          variant="headlineSmall"
          color={theme.palette.onPrimaryContainer.main}
        >
          Adicione uma nova coleção para o acervo, após criada, novos itens do acervo podem ser criados para essa coleção
        </Typography>
      </Heading>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormFields>
          <NameField
            label="Nome"
            variant="filled"
            placeholder="Nome da Coleção"
            inputProps={{ 'data-cy': 'collection-name' }}
            maxRows={1}
            helperText={invalidName ? "Obrigatório" : ""}
            sx={{
              "& .MuiInputBase-root": {
                width: isMobile ? '100%' : '200px'
              }
            }}
            {...register("nome", { required: true })}
          />
          <DescriptionField
            label="Descrição"
            variant="filled"
            placeholder="Descrição da Coleção"
            data-cy="collection-description"
            multiline
            maxRows={6}
            sx={{
              color: `${theme.palette.primary.main}`,
              "& .MuiInputBase-root": {
                width: isMobile ? '100%' : '720px'
              }
            }}
            {...register("descricao")}
          />
          <CuriosityField
            label="Curiosidades"
            variant="filled"
            placeholder="Curiosidades da Coleção"
            data-cy="collection-curiosity"
            multiline
            maxRows={6}
            sx={{
              color: `${theme.palette.primary.main}`,
              "& .MuiInputBase-root": {
                width: isMobile ? '100%' : '720px'
              }
            }}
            {...register("curiosidades")}
          />
          <Horizontal />
        </FormFields>
      </Form>
      <SubimtField>
        <CheckField>
          <Typography
            variant="bodyLarge"
            color={theme.palette.onPrimaryContainer.main}
          >
            Coleção Privada
          </Typography>
          <FormControlLabel
            label=""
            control={
              <Controller
                name="privado"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    data-cy="collection-private"
                    checked={Boolean(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
          />
        </CheckField>
        <ButonField>
          <ButtonSubmit
            data-cy="submit-button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            Salvar
          </ButtonSubmit>
        </ButonField>
          <Dialog
            open={alert}
            onClose={() => setAlert(false)}
            data-cy="dialog"
          >
            <DialogTitle>
              Aviso
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Coleção criada com sucesso
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                data-cy="dialog-button"
                onClick={() => setAlert(false)}
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
      </SubimtField>
    </Content>
  )
}

const Content = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(4)} ${theme.spacing(2)}`,
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.spacing(5)}`,
  alignSelf: 'stretch',
}))

const Heading = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: `${theme.spacing(2)}`,
  alignSelf: 'stretch',
}))

const Form = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: `${theme.spacing(2)}`,
  alignSelf: 'stretch',
  background: `${theme.palette.surfaceContainer.main}`,
}))

const FormFields = styled(Stack)(() => ({
  display: 'flex',
  padding: '10px 20px',
  flexDirection: 'column',
  gap: `36px`,
  alignSelf: 'stretch',
}))

const NameField = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  alignSelf: 'stretch',
  borderRadius: '4px 4px 0px 0px',
  color: `${theme.palette.primary.main}`,
  '& .MuiInputBase-root': {
    height: '56px',
  }
}))

const DescriptionField = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '200px',
  maxWidth: '720px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  borderRadius: '4px 4px 0px 0px',
  color: `${theme.palette.primary.main}`,
  '& .MuiInputBase-root': {
    height: '200px',
  }
}))

const CuriosityField = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  height: '200px',
  maxWidth: '720px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  borderRadius: '4px 4px 0px 0px',
  color: `${theme.palette.primary.main}`,
  '& .MuiInputBase-root': {
    height: '200px',
  }
}))

const Horizontal = styled(Divider)(({ theme }: { theme: Theme }) => ({
  height: '5px',
  width: '100%',
  backgroundColor: `${theme.palette.outlineVariant.main}`,
}))

const SubimtField = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: `${theme.spacing(2)}`,
  alignSelf: 'stretch',
  background: `${theme.palette.surfaceContainer.main}`,
}))

const CheckField = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
  alignSelf: 'stretch',
  background: `${theme.palette.surfaceContainerLow.main}`,
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}))

const ButonField = styled(Stack)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  alignSelf: 'stretch',
}))

const ButtonSubmit = styled(Button)(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  display: 'flex',
  height: '40px',
  width: '120px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: `${theme.spacing(1)}`,
  backgroundColor: `${theme.palette.primary.main}`,
  borderRadius: '100px',
  color: `${theme.palette.onPrimary.main}`,
}))

export default CriarColecao

