import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { app } from "../../firebase/firebase";

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

const loginMethods = {loginGoogle};

export {loginMethods};