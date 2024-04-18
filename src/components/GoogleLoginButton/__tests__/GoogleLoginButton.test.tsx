import { Theme } from "@mui/material"
import GoogleLoginButton from "../GoogleLoginButton"

const buttonLoginGoogle = {
    loginGoogle: () => {
        console.log('loginGoogle')
    }
}

const theme = {
    spacing: (value: number) => value,
    palette: {
        surface: {
            main: '#FFF8F6'
        },
        outlineVariant: {
            main: '#D7C2B9'
        },
    }
} as unknown as Theme

describe("Testando o componente GoogleLoginButton", () => {
    it("renderiza corretamente", () => {
        cy.mount(<GoogleLoginButton theme={theme} data-class-ref='button' />)
        cy.get('button').should('exist')
    })

    it("executa a função ao ser clicado", () => {
        cy.mount(<GoogleLoginButton theme={theme} data-class-ref='button' />)
        cy.spy(buttonLoginGoogle, 'loginGoogle')

        cy.get('button').click().then(() => {
            expect(buttonLoginGoogle.loginGoogle).to.be.called
        })
    })
})
