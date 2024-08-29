import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { ErrorResponse, Link, isRouteErrorResponse, useLocation, useRouteError } from "react-router-dom";
import NotFoundIcon from "../assets/not-found.svg";
import ErrorIcon from '@mui/icons-material/Error';
import BlockIcon from '@mui/icons-material/Block';
import { Theme } from "@mui/material/styles/createTheme";
import useTheme from "@mui/material/styles/useTheme";

type ErrorPageProps = {
  status: number,
  statusText: string,
  data: {
    message: string
  }
}

const UsedErrorIcon = ({ errorCode }: { errorCode: number }) => {
  if (errorCode === 404) {
    return <img src={NotFoundIcon} width={35} height={35} aria-label="Ícone página não encontrada" />
  } else if (errorCode === 403) {
    return <BlockIcon fontSize="large" />
  }
  else {
    return <ErrorIcon fontSize="large" />
  }
}

const ErrorPage = ({ error }: { error?: ErrorPageProps }) => {
  const theme = useTheme()
  const routeError = useRouteError()
  const usedError = error ?? routeError
  const location = useLocation()
  let message = "Um error inesperado ocorreu."

  if (isRouteErrorResponse(usedError)) {
    if (usedError.status === 403) {
      usedError.statusText = "Acesso negado"
      message = `Você não tem permissão para acessar a página \n"${location.pathname}"`
    }
    if (usedError.status === 404) {
      usedError.statusText = "Página não encontrada"
      message = `Não foi possível encontrar a página \n"${location.pathname}"`
    }

    return (
      <Content>
        <ErrorContainer>
          <ErrorIconContainer>
            <UsedErrorIcon errorCode={usedError.status} />
            <Typography>{"Erro " + usedError.status}</Typography>
          </ErrorIconContainer>
          <ErrorDescription>
            <Typography variant="displayLarge" sx={{ color: theme.palette.onSurfaceVariant.main }}>
              {usedError.statusText}
            </Typography>
            <Typography variant="displaySmall" sx={{ whiteSpace: "preserve-breaks" }}>{message}</Typography>
          </ErrorDescription>
          <ErrorRedirect>
            <Link to='home'>Voltar para a página principal</Link>
          </ErrorRedirect>
        </ErrorContainer>
      </Content>);
  }
  else {
    let serverError: ErrorResponse = usedError as ErrorResponse;
    serverError = {
      status: serverError.status ?? 500,
      statusText: serverError.statusText ?? "Erro interno do servidor",
      data: {
      }
    }
    if (serverError.status === 403) {
      message = `Não foi possível encontrar a página \n"${location.pathname}"`
    }
    else {
      message = "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
    }
    return (
      <Content>
        <ErrorContainer>
          <ErrorIconContainer>
            <UsedErrorIcon errorCode={serverError.status} />
            <Typography>{"Erro " + serverError.status}</Typography>
          </ErrorIconContainer>
          <ErrorDescription>
            <Typography variant="displayLarge" >{serverError.statusText}</Typography>
            <Typography variant="displaySmall">{message}</Typography>
          </ErrorDescription>
          <ErrorRedirect>
            <Link to='home'>Voltar para a página principal</Link>
          </ErrorRedirect>
        </ErrorContainer>
      </Content>);
  }
}

const Content = styled('div')(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
  gap: `${theme.spacing(5)}`,
  justifyContent: 'center',
  alignItems: 'center',
}))

const ErrorContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.surface.main,
  color: theme.palette.onSurface.main,
  flexDirection: 'column',
  textAlign: 'center',
  padding: `${theme.spacing(10)} ${theme.spacing(10)}`,
  gap: theme.spacing(4),
}))

const ErrorIconContainer = styled('div')(() => ({
}))

const ErrorDescription = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  wordWrap: 'break-word',
}))

const ErrorRedirect = styled('div')(({ theme }: { theme: Theme }) => ({
  a: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.onSecondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 2
  }
}))
export default ErrorPage;
