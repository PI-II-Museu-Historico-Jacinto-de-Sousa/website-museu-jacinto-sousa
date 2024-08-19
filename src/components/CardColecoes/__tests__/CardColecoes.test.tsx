import { ThemeProvider } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";
import CardColecoes from "../CardColecoes";
import getDesignTokens from "../../../theme/theme";
import { Colecao } from "../../../interfaces/Colecao";
import * as ReactRouterDom from 'react-router-dom';

const theme = getDesignTokens('light');

const colecao = {
  nome: "Fotografia",
  descricao: "Descrição da coleção",
  id: "colecoes/publico/lista/8y2HLsykqKVtq7V61ort",
  privado: false,
} as Colecao

describe("Teste de renderização do nome", () => {

  it("Botão de entrar desabilitado", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CardColecoes colecao={colecao} />
        </MemoryRouter>
      </ThemeProvider>
    );
    cy.get('[data-cy=nome]').should('be.visible').and('have.text', colecao.nome);
  });
});

describe("Teste de renderização da descrição", () => {
  it("Botão de entrar habilitado", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CardColecoes colecao={colecao} />
        </MemoryRouter>
      </ThemeProvider>
    )
    cy.get('[data-cy=descricao]').should('be.visible').and('have.text', colecao.descricao);
  });
});

describe("Teste de renderização do botão", () => {
  it("Botão de entrar habilitado", () => {
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
