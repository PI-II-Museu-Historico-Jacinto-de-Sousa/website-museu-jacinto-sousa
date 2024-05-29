import Footer from "../Footer"
import { ThemeProvider } from "@emotion/react"
import { auth } from "../../../../firebase/firebase"

const theme = {
  palette: {
    outline: {
      main: "#85736C",
    },
    onSurface: {
      main: "#221A16"
    }
  }
}



describe("Testando componente Footer", () => {
  it("renderiza corretamente", () => {
    cy.mount(
      //repetindo a estrutura principal da página
      <ThemeProvider theme={theme}>
        <div
          id="root"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '100vw',
            minHeight: '100vh'
          }
          }>
          <main style={{ flexGrow: 1 }}>

          </main>
          <Footer />
        </div>
      </ThemeProvider>
    )
    cy.get("[data-cy='footer-container']").should("exist")
    //verifica se o footer renderiza abaixo dos elementos anteriores
    cy.get('main').then((main) => main.position().top).then(mainTop => {
      cy.get("[data-cy='footer-container']").then((footer) => {
        expect(footer.position().top).to.be.greaterThan(mainTop)
      })
    })
  })
})

describe("Testando interações do Footer logado", () => {
  before(() => {
    cy.loginComponent(auth, "test@mail", "testpassword")
  })
  it("Usuário logado deve exibir botão de edição", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    )
    cy.get("[data-cy='footer-edit-button']").should("exist")
  })
  it("Clicar no botão de edição deve abrir textfields", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    )
    cy.get("[data-cy='footer-edit-button']").click()
    cy.get("[data-cy='footer-text-field']").should("exist")
  })
  after(() => {
    cy.logoutComponent(auth)
  })
})

