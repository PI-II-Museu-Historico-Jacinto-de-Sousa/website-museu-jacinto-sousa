import { CssBaseline, PaletteMode, ThemeProvider, createTheme } from "@mui/material"
import { useMemo, useState } from "react";
import NavBar from "../NavBar";
import getDesignTokens from "../../../theme/theme";
import { BrowserRouter } from "react-router-dom";
import { getAuth } from 'firebase/auth'
import { app } from '../../../../firebase/firebase.ts'
import { loginMethods } from "../../../Utils/loginGoogle.ts";

const auth = getAuth(app)

const theme = createTheme(getDesignTokens('light'))

const NavBarTest = () => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <NavBar colorMode={colorMode} mode={mode} />
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe("Testando componente NavBar", () => {
  before(() => {
    cy.stub(loginMethods, 'logout')
  })
  context("Versão Desktop", () => {
    beforeEach(() => {
      cy.viewport(1366, 768)
    })

    it("renderiza corretamente o componente", () => {
      cy.mount(<NavBarTest />)

      cy.get("[data-cy='NavContainer']").should('exist')

      cy.loginComponent(auth, 'test@mail', 'testpassword')
    })

    it("seleciona todas as opções", () => {
      cy.mount(<NavBarTest />)

      cy.get("[data-cy='NavContainer']").should('exist')

      cy.get("[data-cy='HomeOption']").should('exist')

      cy.get("[data-cy='ExposiçõesOption']").should('exist')
      cy.get("[data-cy='searchExposiçõesOption']").should('exist')

      cy.get("[data-cy='AcervoOption']").should('exist')
      cy.get("[data-cy='searchAcervoOption']").should('exist')

      cy.get("[data-cy='Editais e normasOption']").should('exist')
      cy.get("[data-cy='searchEditais e normasOption']").should('exist')

      cy.get("[data-cy='VisitOption']").should('exist')
    })

    it("realiza o logOut corretamente", () => {
      cy.mount(<NavBarTest />)
      cy.stub(loginMethods, 'logout')
      cy.get("[data-cy='User']").click()
      cy.get("[data-cy='LogOutOption']").click().then(() => {
        expect(loginMethods.logout).to.be.called
      })
    })
  })

  context("Versão Mobile", () => {
    beforeEach(() => {
      cy.viewport("samsung-s10")
    })

    it("renderiza corretamente o componente", () => {
      cy.mount(<NavBarTest />)

      cy.get(".MuiToolbar-root").should('exist')

      cy.loginComponent(auth, 'test@mail', 'testpassword')
    })

    it("seleciona todas as opções do menu", () => {
      cy.mount(<NavBarTest />)

      cy.get("[data-cy='Menu']").should('exist')
      cy.get("[data-cy='HomeOption']").should('exist')

      cy.get("[data-cy='Menu']").should('exist')
      cy.get("[data-cy='ExposiçõesOption']").should('exist')
      cy.get("[data-cy='searchExposiçõesOption']").should('exist')

      cy.get("[data-cy='AcervoOption']").should('exist')
      cy.get("[data-cy='searchAcervoOption']").should('exist')

      cy.get("[data-cy='Editais e normasOption']").should('exist')
      cy.get("[data-cy='searchEditais e normasOption']").should('exist')

      cy.get("[data-cy='VisitOption']").should('exist')
    })

    it("realiza o logOut corretamente", () => {
      cy.mount(<NavBarTest />)
      cy.stub(loginMethods, 'logout')
      cy.get("[data-cy='User']").click()
      cy.get("[data-cy='LogOutOption']").click().then(() => {
        expect(loginMethods.logout).to.be.called
      })
    })
  })
  after(() => {
    cy.logoutComponent(auth)
  })
})
