import { Stack, styled, Theme } from "@mui/material";
import EmailLoginForm from "../components/EmailLoginForm/EmailLoginForm";

const Login = () => {
  return (
    <Content>
      <LoginOptions>
        <EmailLoginForm />
      </LoginOptions>
    </Content>
  );
}


const Content = styled(Stack)(({ theme }: { theme: Theme }) => ({
  padding: `${theme.spacing(6)} ${theme.spacing(3)}`,
  width: '100%',
  alignSelf: 'stretch',
  alignItems: 'center',
})
)

const LoginOptions = styled(Stack)(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  gap: `${theme.spacing(2)}`,
  alignItems: 'center',
  backgroundColor: theme.palette.surfaceContainerLow.main,
}));

export default Login;
