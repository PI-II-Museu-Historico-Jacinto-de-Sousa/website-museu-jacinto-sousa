import { ThemeProvider } from "@emotion/react"
import EmailLoginForm from "../EmailLoginForm";
import getDesignTokens from "../../../theme/theme"

const theme = getDesignTokens('light')

describe("Botão desabilitado enquanto email ou senha não são inseridos", () => {
  it("Botão de entrar desabilitado", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <EmailLoginForm />
      </ThemeProvider>
    )
    cy.get("[data-cy='botaoEntrar']").should("be.disabled")
  });
});

describe("Botão habilitado após inserir email e senha", () => {
  it("Botão de entrar habilitado", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <EmailLoginForm />
      </ThemeProvider>
    )
    cy.get("[data-cy='email']").type("test@mail")
    cy.get("[data-cy='password']").type("testpassword")
    cy.get("[data-cy='botaoEntrar']").should("not.be.disabled")
  });
})

describe("Passar o mouse no botão desabilitado mostra um tooltip", () => {

  it("Mostrar a mensagem 'Preencha ambos os campos'", () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <EmailLoginForm />
      </ThemeProvider>
    );
    // Verifique se o botão está desabilitado
    cy.get("[data-cy='botaoEntrar']").should("be.disabled");

    // Passe o mouse sobre o botão desabilitado
    cy.get("[data-cy='botaoEntrar']").trigger("mouseover", {force: true});

     // Verifique se a tooltip com a mensagem "Preencha ambos os campos" é exibida
     cy.contains("Preencha ambos os campos").should("be.visible");
  });
});