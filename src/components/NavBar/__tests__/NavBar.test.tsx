import { CssBaseline, PaletteMode, ThemeProvider, createTheme } from "@mui/material"
import { useMemo, useState } from "react";
import NavBar from "../NavBar";
import getDesignTokens from "../../../theme/theme";
import { BrowserRouter } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../../../firebase/firebase.ts'

const auth = getAuth(app)

function LogInTest(){
  signInWithEmailAndPassword(auth, "erickgabrielferreira@alu.ufc.br", "erick12345@")
  .then((userCredential) =>{
    const user = userCredential.user
    console.log(user)
  }).
  catch(error =>{
    console.log(error)
  })
}

const theme = createTheme(getDesignTokens('light'))

const NavBarTest = () =>{
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

  return(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <NavBar colorMode={colorMode} mode={mode}/>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe("Testando componente NavBar", () =>{
  context("Versão Desktop", () =>{
    beforeEach(() =>{
      cy.viewport(1366, 768)
    })

    it("renderiza corretamente o componente", () =>{
      cy.mount(<NavBarTest/>)

      cy.get("[data-cy='NavContainer']").should('exist')

      LogInTest()
    })

    it("seleciona todas as opções", () =>{
      cy.mount(<NavBarTest/>)

      cy.get("[data-cy='NavContainer']").should('exist')

      cy.get("[data-cy='HomeOption']").click()

      cy.get("[data-cy='ExposiçõesOption']").click()
      cy.get("[data-cy='searchExposiçõesOption']").click()

      cy.get("[data-cy='AcervoOption']").click()
      cy.get("[data-cy='searchAcervoOption']").click()

      cy.get("[data-cy='Editais e normasOption']").click()
      cy.get("[data-cy='searchEditais e normasOption']").click()

      cy.get("[data-cy='VisitOption']").click()
    })

    it("realiza o logOut corretamente", () =>{
      cy.mount(<NavBarTest/>)

      cy.get("[data-cy='User']").click()
      cy.get("[data-cy='LogOutOption']").click()
      cy.get('.MuiSnackbar-root > .MuiPaper-root').should('exist')
    })
  })

  context("Versão Desktop", () =>{
    beforeEach(() =>{
      cy.viewport("samsung-s10")
    })
    
    it("renderiza corretamente o componente", () =>{
      cy.mount(<NavBarTest/>)
      
      cy.get(".MuiToolbar-root").should('exist')

      LogInTest()
    })

    it("seleciona todas as opções do menu", () =>{
      cy.mount(<NavBarTest/>)

      cy.get("[data-cy='Menu']").click()
      cy.get("[data-cy='HomeOption']").click()

      cy.get("[data-cy='Menu']").click()
      cy.get("[data-cy='ExposiçõesOption']").click()
      cy.get("[data-cy='searchExposiçõesOption']").click()

      cy.get("[data-cy='AcervoOption']").click()
      cy.get("[data-cy='searchAcervoOption']").click()

      cy.get("[data-cy='Editais e normasOption']").click()
      cy.get("[data-cy='searchEditais e normasOption']").click()

      cy.get("[data-cy='VisitOption']").click()
    })
    
    it("realiza o logOut corretamente", () =>{
      cy.mount(<NavBarTest/>)
      
      cy.get("[data-cy='User']").click()
      cy.get("[data-cy='LogOutOption']").click()
      cy.get('.MuiSnackbar-root > .MuiPaper-root').should('exist')
    })
  })
})