import { getItensAcervo } from '../../src/Utils/itemAcervoFirebase';
import { auth } from '../../firebase/firebase';

const mockItems = [
  { id: '1', nome: 'Item A', colecao: 'Coleção 1', privado: false, dataDoacao: new Date('2023-01-01') },
  { id: '2', nome: 'Item B', colecao: 'Coleção 1', privado: false, dataDoacao: new Date('2023-01-02') },
  { id: '3', nome: 'Item C', colecao: 'Coleção 2', privado: true, dataDoacao: new Date('2023-01-03') },
  { id: '4', nome: 'Item D', colecao: 'Coleção 2', privado: false, dataDoacao: new Date('2023-01-04') },
  { id: '5', nome: 'Item E', colecao: 'Coleção 3', privado: false, dataDoacao: new Date('2023-01-05') },
  { id: '6', nome: 'Item F', colecao: 'Coleção 3', privado: false, dataDoacao: new Date('2023-01-06') },
  { id: '7', nome: 'Item G', colecao: 'Coleção 4', privado: false, dataDoacao: new Date('2023-01-07') },
];

describe('Página Acervo', () => {
  beforeEach(() => {
    cy.stub(getItensAcervo).resolves(mockItems);
    cy.visit('/acervo');
  });

  it('Deve mostrar loading e depois renderizar os itens', () => {
    cy.get('[data-cy="loading"]').should('be.visible');
    cy.get('[data-cy="loading"]').should('not.exist');
    cy.get('[data-cy="item-card"]').should('have.length', 6);
  });
  
  it('Deve mostrar os últimos 6 itens em ordem alfabética por padrão', () => {
    cy.get('[data-cy="item-card"]').first().should('contain', 'Item B');
    cy.get('[data-cy="item-card"]').last().should('contain', 'Item G');
  });
  
  it('Não deve mostrar itens privados quando o usuário não está logado', () => {
    cy.stub(auth, 'currentUser').value(null);
    cy.get('[data-cy="item-card"]').should('have.length', 6);
    cy.get('[data-cy="item-card"]').should('not.contain', 'Item C');
  });
  
  it('Deve mostrar itens privados quando o usuário está logado', () => {
    cy.stub(auth, 'currentUser').value({ uid: 'testuser' });
    cy.get('[data-cy="item-card"]').should('have.length', 6);
    cy.get('[data-cy="item-card"]').should('contain', 'Item C');
  });
  
  it('Não deve mostrar itens duplicados', () => {
    const itemNames = [];
    cy.get('[data-cy="item-card"]').each(($el) => {
      const itemName = $el.text();
      expect(itemNames).not.to.include(itemName);
      itemNames.push(itemName);
    });
  });
  
  it('Deve filtrar itens por nome', () => {
    cy.get('[data-cy="nome-filter"]').type('Item A');
    cy.get('[data-cy="item-card"]').should('have.length', 1);
    cy.get('[data-cy="item-card"]').should('contain', 'Item A');
  });
  
  it('Deve filtrar itens por coleção', () => {
    cy.get('[data-cy="colecao-filter"]').type('Coleção 1');
    cy.get('[data-cy="item-card"]').should('have.length', 2);
    cy.get('[data-cy="item-card"]').should('contain', 'Item A');
    cy.get('[data-cy="item-card"]').should('contain', 'Item B');
  });
  
  it('Deve ordenar itens alfabeticamente', () => {
    cy.get('[data-cy="alfabetic-order"]').click();
    cy.get('[data-cy="item-card"]').first().should('contain', 'Item G');
    cy.get('[data-cy="item-card"]').last().should('contain', 'Item B');
  });
  
  it('Deve ordenar itens por data', () => {
    cy.get('[data-cy="date-order"]').click();
    cy.get('[data-cy="item-card"]').first().should('contain', 'Item G');
    cy.get('[data-cy="item-card"]').last().should('contain', 'Item B');
  });
  
  it('Deve limpar filtros', () => {
    cy.get('[data-cy="nome-filter"]').type('Item A');
    cy.get('[data-cy="clear-filters"]').click();
    cy.get('[data-cy="item-card"]').should('have.length', 6);
  });
  
  it('Deve navegar entre páginas', () => {
    cy.get('[data-cy="pagination"]').contains('2').click();
    cy.get('[data-cy="item-card"]').should('have.length', 1);
    cy.get('[data-cy="item-card"]').should('contain', 'Item G');
  });
});