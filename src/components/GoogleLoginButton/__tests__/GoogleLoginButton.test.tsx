import GoogleLoginButton from "../GoogleLoginButton"

const loginGoogle = {
    loginGoogle: async () => {
    }
}

describe("Testando componente ToggleLightMode", () => {
    it("renderiza corretamente", () => {
        cy.mount(<GoogleLoginButton data-class-ref='button' />)
        cy.get('button').should('exist')
    })
    it("executa a função ao ser clicado", () => {
        cy.mount(<GoogleLoginButton  data-class-ref='button' />)
        cy.spy(loginGoogle, 'loginGoogle') // Fix: Changed 'GoogleLoginButton' to 'loginGoogle'

        cy.get('button').click().then(() => {
            expect(loginGoogle).to.be.called
        })
    })
}
)