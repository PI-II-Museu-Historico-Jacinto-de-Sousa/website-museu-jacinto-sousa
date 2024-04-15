import styled from "styled-components";
import GoogleIcon from '@mui/icons-material/Google';
import { IconButton, Typography} from "@mui/material";
import { app } from '../../firebase/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAdditionalUserInfo } from "firebase/auth/web-extension";

const Button = styled.button`
    display: flex;
    padding: 10px 24px 10px 16px;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
`;

const loginGoogle = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            getAdditionalUserInfo(result);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
}

const GoogleLoginButton = () => {
    return (
        <Button>
            <IconButton onClick={loginGoogle}>
                <GoogleIcon/>
            </IconButton>
            <Typography sx={{color: 'error.main' }}>Login com Google</Typography>
        </Button>
    );
}

export default GoogleLoginButton;