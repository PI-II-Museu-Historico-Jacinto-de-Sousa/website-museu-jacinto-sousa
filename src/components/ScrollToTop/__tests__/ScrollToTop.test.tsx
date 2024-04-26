import ScrollToTop from "../ScrollToTop";
import getDesignTokens from "../../../theme/theme";
import { scrollMethods } from "../../../Utils/scrollToTop";
import { ThemeProvider } from "@emotion/react";

const theme = getDesignTokens('light');

describe("Testando o componente ScrollToTop", () => {
    it("Componente renderiza normalmente quando houver scroll na tela", () => {
        cy.document().then((doc) => {
            const tallContent = doc.createElement('div');
            tallContent.style.height = '2000px'; // Defina a altura conforme necessário
            doc.body.appendChild(tallContent);
        });
        cy.mount(
            <ThemeProvider theme={theme}>
                <ScrollToTop data-class-ref='button'/>
            </ThemeProvider>
        );
        cy.scrollTo(0, 0).then(() => {
            setTimeout(() => {
                cy.get("[data-cy='scrollToTop']").should('be.visible');
            }, 4000);
        });
    });

    it("Função scrollToTop é chamada ao clicar no componente", () => {
        cy.document().then((doc) => {
            const tallContent = doc.createElement('div');
            tallContent.style.height = '2000px'; // Defina a altura conforme necessário
            doc.body.appendChild(tallContent);
        });
        cy.mount(
            <ThemeProvider theme={theme}>
                <ScrollToTop data-class-ref='button'/>
            </ThemeProvider>
        );
        cy.scrollTo(0, 1000); // Rola a página até a metade (1000px)
        cy.spy(scrollMethods, 'scrollToTop');
        cy.get("[data-cy='scrollToTop']").invoke('show').click().then(() => {
            expect(scrollMethods.scrollToTop).to.be.called;
        });        
    });
});
