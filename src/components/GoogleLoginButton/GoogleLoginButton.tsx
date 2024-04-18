import GoogleIcon from "../../assets/GoogleIcon.png";
import { Button, Theme, Typography} from "@mui/material";
import { app } from "../../../firebase/firebase";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { styled } from '@mui/system';

const loginGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).then((result) => {
        // Redirect to Google sign-in page
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        // IdP data available using getAdditionalUserInfo(result)
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}

const MyThemeComponent = styled(Button)(({theme}: {theme: Theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    borderRadius: '100px',
    cursor: 'pointer',
    backgroundColor: theme.palette.surface.main,
    borderColor: theme.palette.outlineVariant.main,
}));
  

const GoogleLoginButton = ({theme}: {theme: Theme}) => {
    return (
        <MyThemeComponent theme={theme}  onClick={loginGoogle}>
                <img src={GoogleIcon} alt="Google Icon" width='20px' height='20px' />
                <Typography variant="bodyMedium" sx={{color: 'onSurface.main' }} >Login with Google</Typography>
        </MyThemeComponent>
    );
}

export default GoogleLoginButton;