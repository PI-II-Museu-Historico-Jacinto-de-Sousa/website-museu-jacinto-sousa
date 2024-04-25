import ScrollToTop from "../ScrollToTop";
import getDesignTokens from "../../../theme/theme";
import scroolToTop from "../../../Utils/scroolToTop";
import { ThemeProvider } from "@emotion/react"

const theme = getDesignTokens('light')

describe("Testando o componente ScrollToTop", () => {
    it("Componente renderiza normalmente quando houver scroll na tela (chamar a função cy.mount com algum outro conteúdo com altura para que haja espaço para scroll", () => {
        cy.window().then((win) => {
            win.document.documentElement.scrollTop = 1000
            win.document.body.scrollTop = 1000
        })
        cy.mount(<ThemeProvider theme={theme}>
            <ScrollToTop data-class-ref='button'/>
        </ThemeProvider>)
        cy.get("[data-cy='scrollToTop']").should('exist')
    })

    it("função scrollToTop é chamada ao clicar no componente, esperado que após isso o scrollTop dos elementos usados em checkScroll seja 0", () => {
        cy.window().then((win) => {
            win.document.documentElement.scrollTop = 1000
            win.document.body.scrollTop = 1000
        })
        cy.mount(<ThemeProvider theme={theme}><ScrollToTop data-class-ref='button'/></ThemeProvider>)
        cy.spy(scroolToTop)
        cy.get("[data-cy='scrollToTop']").click().then(() => {
            expect(scroolToTop).to.be.called  
        })
    })
})
