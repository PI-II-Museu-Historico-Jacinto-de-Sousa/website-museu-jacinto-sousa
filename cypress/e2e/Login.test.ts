describe("Usuário não logado", () => {
  before(() => {
    cy.logout();
  });
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
  });
  afterEach(() => {
    cy.logout();
  });
  context("Visualização desktop", () => {
    it("Deve renderizar corretamente", () => {
      cy.get("[data-cy=email]").should("be.visible");
      cy.get("[data-cy=password]").should("be.visible");
    });
  });
  context("Visualização mobile", () => {
    beforeEach(() => {
      cy.viewport("samsung-s10");
    });
    it("Deve renderizar corretamente", () => {
      cy.get("[data-cy=email]").should("be.visible");
      cy.get("[data-cy=password]").should("be.visible");
    });
    it("Não deve possuir overflow horizontal", () => {
      cy.get("[data-cy=email]")
        .should("be.visible")
        .then(() => {
          cy.scrollTo("topRight");
          cy.window().its("scrollX").should("equal", 0);
        });
    });
  });
  it("Deve realizar login com email e senha", () => {
    cy.get("[data-cy=email]").type("test@mail");
    cy.get("[data-cy=password]").type("testpassword");
    cy.get("[data-cy=botaoEntrar]")
      .click()
      .then(() => {
        cy.url().should("eq", "http://localhost:5173/home");
      });
  });
});
describe("Usuário logado", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("http://localhost:5173/login");
  });
  it("Deve redirecionar para a home", () => {
    cy.visit("/login").then(() => {
      cy.url().should("eq", "http://localhost:5173/home");
    });
  });
  after(() => {
    cy.logout();
  });
});
