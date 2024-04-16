import styled from "styled-components";
import GoogleIcon from "../img/GoogleIcon.png";
import { Typography} from "@mui/material";
import { app } from "../../../firebase/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const loginGoogle = async () => {

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
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

const GoogleLoginButton = () => {
    return (
        /*<>
            <IconButton onClick={loginGoogle} >
                <GoogleIcon />
                <Typography sx={{color: 'onSurface.main'}} variant="labelMedium" >Login com Google</Typography>
            </IconButton>
        </>*/
        <Button onClick={loginGoogle}>
            <img src={GoogleIcon} alt="Google Icon" width="20px" height="20px" />
            <Typography sx={{color: 'onTertiaryFixed.main'}} variant="labelMedium" >Login com Google</Typography>
        </Button>
    );
}

const Button = styled.button`
    display: flex;
    padding: 10px 24px 10px 16px;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 20px;
    background-color: #fff;
`;

export default GoogleLoginButton;