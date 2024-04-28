import { getAuth } from "firebase/auth"
import Footer from "../Footer"
import { ThemeProvider } from "@emotion/react"

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

const auth = getAuth()

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
    if (auth.currentUser) {
      cy.get('button').should('exist')
    }
  })
})
