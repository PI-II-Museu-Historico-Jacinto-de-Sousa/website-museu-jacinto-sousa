import ScrollToTop from "../ScrollToTop";
import getDesignTokens from "../../../theme/theme";
import { scrollMethods } from "../../../Utils/scrollToTop";
import { ThemeProvider } from "@emotion/react";

const theme = getDesignTokens('light');

describe("Testando o componente ScrollToTop", () => {
  it("Componente renderiza normalmente quando houver scroll na tela", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <div style={{ height: 2000 }}></div>
        <ScrollToTop data-class-ref='button' />
      </ThemeProvider>
    ).then(() => {
      cy.wait(1000); // Espera 1 segundo para o componente renderizar completamente
      cy.scrollTo(0, 1000).then(() => {
        cy.get("[data-cy='scrollToTop']").should('be.visible');
      });
    })
  });

  it("Função scrollToTop é chamada ao clicar no componente", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <div style={{ height: 2000 }}></div>
        <ScrollToTop data-class-ref='button' />
      </ThemeProvider>
    ).then(() => {
      cy.scrollTo(0, 1000); // Rola a página até a metade (1000px)
      cy.spy(scrollMethods, 'scrollToTop');
      cy.get("[data-cy='scrollToTop']").should('exist').click().then(() => {
        expect(scrollMethods.scrollToTop).to.be.called;
      });
    })
  });
});
