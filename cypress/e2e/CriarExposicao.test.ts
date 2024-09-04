describe('Criar Exposição', () => {
  beforeEach(() => {
    cy.login();
    // Mount the component with necessary context providers
    cy.visit("http://localhost:5173/exposicoes/criar-exposicao");
  });

  it('Adicionar um item confirmando o diálogo com a lista e depois abrir o diálogo de novo deve mostrar os itens adicionados como já selecionados.', () => {
    cy.get('[data-cy="botaoSubmit"]').click();
    cy.get('[data-cy="nomeExposicao-helper-text"]').should('have.text', 'Nome da Exposição é obrigatório');
  });

  it('Os campos de data devem ser obrigatórios quando a exposição for temporária, testando da início', () => {
    cy.get('[data-cy="botaoSubmit"]').click();
    cy.get('#dataInicio-helper-text').should("have.text", "Data de início é obrigatória")
  });

  it('Os campos de data devem ser obrigatórios quando a exposição for temporária, testando da fim', () => {
    cy.get('[data-cy="botaoSubmit"]').click();
    cy.get('#dataFim-helper-text').should("have.text", 'Data de fim é obrigatória')
  });

  it('Criar uma exposição sem itens sem data deve ser bem-sucedido.', () => {
    cy.get('[data-cy="nome"]').type('Exposição Teste');
    cy.get('[data-cy="descricao"]').type('Descrição Teste');
    cy.get('[data-cy="permanente"]').click();
    cy.get('[data-cy="botaoSubmit"]').click();
    cy.get('[data-cy="button-ok-dialog-save"]').should('exist');
  });

  it('Criar uma exposição sem itens e permanente deve ser bem-sucedido.', () => {
    cy.get('[data-cy="nome"]').type('Exposição Teste');
    cy.get('[data-cy="descricao"]').type('Descrição Teste');
    //selecionando data
    cy.contains("label", "Data de início").next().as("dataInicio");
    cy.contains("label", "Data de fim").next().as("dataFim");
    cy.get('@dataInicio').find("button[aria-label='Choose date']")
    .click()
    .then(() => {
      cy.get("button[aria-current='date']").click();
    });
    cy.get('@dataFim').find("button[aria-label='Choose date']")
    .click()
    .then(() => {
      cy.get("button[aria-current='date']").click();
    });
    cy.get('[data-cy="botaoSubmit"]').click();
    cy.get('[data-cy="button-ok-dialog-save"]').should('exist');
  });

  /*it('Criar uma exposição com itens deve ser bem-sucedido.', () => {
    cy.get('[data-cy="botaoAdicionarItem"]').click();
    cy.get('[data-cy="item1"]').click(); // Assume que "item1" é um item da lista
    cy.get('[data-cy="botaoFecharDialog"]').click();

    // Reabrir o diálogo e verificar se o item está selecionado
    cy.get('[data-cy="botaoAdicionarItem"]').click();
    cy.get('[data-cy="item1"]').should('be.checked');

    // Desmarcar o item e fechar
    cy.get('[data-cy="item1"]').uncheck();
    cy.get('[data-cy="botaoFecharDialog"]').click();

    // Verificar se o item foi removido
    cy.get('[data-cy="botaoAdicionarItem"]').click();
    cy.get('[data-cy="item1"]').should('not.be.checked');
  });

  it('Selecionar o subheader deve selecionar todos os itens aninhados de uma coleção.', () => {
    cy.get('[data-cy="subheader1"]').click(); // Assume que "subheader1" é o subheader
    cy.get('[data-cy="itemNested"]').should('be.checked'); // Assume que "itemNested" são os itens aninhados
  });*/
});
