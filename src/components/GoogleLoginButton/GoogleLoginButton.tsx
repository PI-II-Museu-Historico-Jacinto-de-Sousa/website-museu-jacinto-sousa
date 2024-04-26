import { Button } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import GoogleIcon from "../../assets/GoogleIcon.png";
import { loginMethods } from "../../Utils/loginGoogle";
  
const BotaoComIcone = styled(Button)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    borderRadius: '100px',
    cursor: 'pointer',
    backgroundColor: theme.palette.surface.main,
    borderColor: theme.palette.outlineVariant.main,
    textTransform: 'initial',
}))


const GoogleLoginButton = () => {
    return (
        <BotaoComIcone onClick={loginMethods.loginGoogle} data-cy="botaoLoginGoogle">
            <img src={GoogleIcon} alt="Google Icon" width="20px"/>
            Login com google
        </BotaoComIcone>
    );
}

export default GoogleLoginButton;