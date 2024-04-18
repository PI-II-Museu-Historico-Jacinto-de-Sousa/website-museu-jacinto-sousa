import { Theme } from "@mui/material"
import GoogleLoginButton from "../GoogleLoginButton"

const buttonLoginGoogle = {
    loginGoogle: async () => {
        
    }
}

describe("Testando o componente GoogleLoginButton", () => {
    it("renderiza corretamente", () => {
        cy.mount(<GoogleLoginButton data-class-ref='button' />)
        cy.get('button').should('exist')
    })

    it("executa a função ao ser clicado", () => {
        cy.mount(<GoogleLoginButton data-class-ref='button' />)
        cy.spy(buttonLoginGoogle, 'loginGoogle')

        cy.get('button').click().then(() => {
            expect(buttonLoginGoogle.loginGoogle).to.be.called
        })
    })
})
