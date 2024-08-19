import { ThemeProvider } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";
import CardColecoes from "../CardColecoes";
import getDesignTokens from "../../../theme/theme";
import { Colecao } from "../../../interfaces/Colecao";

const theme = getDesignTokens('light');

const colecao = {
  nome: "Fotografia",
  descricao: "Descrição da coleção",
  id: "colecoes/publico/lista/8y2HLsykqKVtq7V61ort",
  privado: false,
} as Colecao

describe("Testes de renderização dos aributos e elementos do CardColecoes", () => {

  it("Renderização do nome dentro do card", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CardColecoes colecao={colecao} />
        </MemoryRouter>
      </ThemeProvider>
    );
    cy.get('[data-cy=nome]').should('be.visible').and('have.text', colecao.nome);
  });

  it("Renderização do atributo descrição dentro do card", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CardColecoes colecao={colecao} />
        </MemoryRouter>
      </ThemeProvider>
    )
    cy.get('[data-cy=descricao]').should('be.visible').and('have.text', colecao.descricao);
  });

  it("Renderização do botão de detalhes dentro do card", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CardColecoes colecao={colecao} />
        </MemoryRouter>
      </ThemeProvider>
    )
    cy.get('[data-cy=botao-detalhes]').should('be.visible');
  });
});
