import 'dayjs/locale/pt-br';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
/*import { auth } from '../firebase/firebase.ts'
import { signInWithEmailAndPassword } from 'firebase/auth'

signInWithEmailAndPassword(auth, 'test@mail', 'testpassword')
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user
    console.log(user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code
    const errorMessage = error.message
    console.log(errorCode, errorMessage)
  })*/

function App() {
  return (
    <RouterProvider router={router} />
  );

}


export default App
