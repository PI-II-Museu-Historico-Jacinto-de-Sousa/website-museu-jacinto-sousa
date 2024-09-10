import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, TextField, Theme, Typography, styled, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import { ClientColecoesFirebase } from "../Utils/colecaoFirebase"
import { ColecaoCreate } from "../interfaces/Colecao"

const CriarColecao = () =>{
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const clientColection = new ClientColecoesFirebase()

  const [name, setName] = useState<string>('')

  const [description, setDescription] = useState<string>('')

  const [curiosity, setCuriosity] = useState<string>('')

  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const [alert, setAlert] = useState<boolean>(false)

  const [isSucess, setIsSucess] = useState<boolean>(false)

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleCuriosityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCuriosity(event.target.value)
  }

  const handleSubmit = async () => {
    setAlert(true)

    if(name === ''){
      setIsSucess(false)
    }
    else{
      const newColection: ColecaoCreate = {
        nome: name,
        descricao: description,
        privado: isPrivate
      }

      try{
        await clientColection.adicionarColecao(newColection)

        setName('')
        setDescription('')
        setCuriosity('')
        setIsPrivate(false)
  
        setIsSucess(true)
      }
      catch(error){
        console.log(error)
        setIsSucess(false)
      }
    }
  }

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
      <Form>
        <Typography
          variant="bodySmall"
          color={theme.palette.onSurface.main}
          sx={{alignSelf: 'flex-start'}}
        >
          Obrigatório
        </Typography>
        <FormFields>
          <NameField
            label="Nome"
            variant="filled"
            placeholder="Nome da Coleção"
            inputProps={{ 'data-cy': 'collection-name' }}
            maxRows={1}
            value={name}
            onChange={handleNameChange}
            sx={{
              "& .MuiInputBase-root": {
                width: isMobile ? '100%' : '200px'
              }
            }}
          />
          <DescriptionField
            label="Descrição"
            variant="filled"
            placeholder="Descrição da Coleção"
            data-cy="collection-description"
            multiline
            maxRows={6}
            value={description}
            onChange={handleDescriptionChange}
            sx={{
              color: `${theme.palette.primary.main}`,
              "& .MuiInputBase-root": {
                width: isMobile ? '100%' : '720px'
              }
            }}
          />
          <CuriosityField
            label="Curiosidades"
            variant="filled"
            placeholder="Curiosidades da Coleção"
            data-cy="collection-curiosity"
            multiline
            maxRows={6}
            value={curiosity}
            onChange={handleCuriosityChange}
            sx={{
              color: `${theme.palette.primary.main}`,
              "& .MuiInputBase-root": {
                width: isMobile ? '100%' : '720px'
              }
            }}
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
          <Checkbox
            data-cy="collection-private"
          />
        </CheckField>
        <ButonField>
          <ButtonSubmit
            data-cy="submit-button"
            onClick={() => handleSubmit()}
          >
            Salvar
          </ButtonSubmit>
        </ButonField>
        {
          alert ?
            <Dialog
              open={true}
              onClose={() => setAlert(false)}
              data-cy="dialog"
            >
              <DialogTitle>
                Aviso
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {isSucess ? 'Coleção criada com sucesso' : 'Nome da coleção é obrigatório'}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button 
                  data-cy="dialog-button"
                  onClick={() => { setAlert(false); setIsSucess(false) }}
                >
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          :
          <></>
        }
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

