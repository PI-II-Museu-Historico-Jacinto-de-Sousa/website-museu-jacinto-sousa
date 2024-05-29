import { mount } from "cypress/react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      loginComponent: typeof signInWithEmailAndPassword;
      logoutComponent: typeof signOut;
    }
  }
}
