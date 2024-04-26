import { getAuth } from "firebase/auth"
import Footer from "../Footer"
import { ThemeProvider } from "@emotion/react"

const theme = {
    palette:{
        outline:{
            main: "#85736C",
        },
        onSurface:{
            main: "#221A16"
        }
    }
}

const auth = getAuth()

describe("Testando componente Footer", () =>{
    it("renderiza corretamente", () =>{
        cy.mount(
            <ThemeProvider theme={theme}>
                <Footer></Footer>
            </ThemeProvider>
        )

        if(auth.currentUser){
            cy.get('button').should('exist')
        }
    })
})