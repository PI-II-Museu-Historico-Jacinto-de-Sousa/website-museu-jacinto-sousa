import GoogleLoginButton from "../GoogleLoginButton"
import getDesignTokens from "../../../theme/theme"
import { ThemeProvider } from "@emotion/react"
import { loginMethods } from "../../../Utils/loginGoogle"

const theme = getDesignTokens('light')

describe("Testando o componente GoogleLoginButton", () => {
  it("renderiza corretamente", () => {
    cy.mount(<ThemeProvider theme={theme}><GoogleLoginButton data-class-ref='button' /></ThemeProvider>)
    cy.get("[data-cy='botaoLoginGoogle']").should('exist')
  })

  it("Checa se a função é chamada", () => {
    cy.mount(<ThemeProvider theme={theme}><GoogleLoginButton data-class-ref='button' /></ThemeProvider>)
    cy.stub(loginMethods, 'loginGoogle')
    cy.get("[data-cy='botaoLoginGoogle']").click().then(() => {
      expect(loginMethods.loginGoogle).to.be.called
    })
  })
})
