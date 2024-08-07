import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { auth } from '../firebase/firebase.ts'
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
  })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
