describe('Acervo', () => {
  beforeEach(() => {
    cy.visit("/acervo-mock");
  });

  it('deve renderizar o loading e os itens em caso de sucesso', () => {
    cy.get("[data-cy='loading']").should("exist");
    cy.get("[data-cy='loading']").should("not.exist");
    cy.get("[data-cy='card-item-container']").should("have.length", 6);
  });

  it('deve carregar os últimos 6 itens em ordem decrescente', function() {
    cy.get("[data-cy='card-item-container']").then(($items) => {
      const ids = $items.map((_, el) => Number(el.getAttribute("data-id"))).get();
      const idsOrdenados = [...ids].sort((a, b) => b - a);
      expect(ids).to.deep.equal(idsOrdenados);
    });
  });

  it('deve mostrar apenas itens públicos quando não logado', () => {
    cy.logout();
    cy.get("[data-cy='item-publico']").should('be.visible');
    cy.get("[data-cy='item-privado']").should('not.exist');
  });

  it('deve mostrar itens privados quando logado', () => {
    cy.login();
    cy.visit("/acervo-mock");
    cy.get("[data-cy='card-item-container']").find("[data-cy='item-privado']").should("exist");
  });

  it('não deve repetir itens na mesma página', () => {
    cy.get("[data-cy='card-item-container']").then(($items) => {
      const ids = $items.map((index, el) => el.getAttribute("data-id")).get();
      const idsUnicos = new Set(ids);
      expect(ids.length).to.equal(idsUnicos.size);
    });
  });
});