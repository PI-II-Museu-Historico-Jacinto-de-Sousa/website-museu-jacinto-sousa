import { ItemAcervo } from '../../src/interfaces/ItemAcervo';
import * as itemAcervoFirebase from '../../src/Utils/itemAcervoFirebase';
import { auth } from '../../firebase/firebase';

const mockItems: ItemAcervo[] = [
  { id: '1', nome: 'Item A', colecao: 'Coleção 1', privado: false, dataDoacao: new Date('2023-01-01'), descricao: 'Descrição do Item A', curiosidades: 'Curiosidades sobre o Item A', doacao: true, doacaoAnonima: false, imagens: [], nomeDoador: 'Doador A', telefoneDoador: '123456789' },
  { id: '2', nome: 'Item B', colecao: 'Coleção 2', privado: false, dataDoacao: new Date('2023-02-01'), descricao: 'Descrição do Item B', curiosidades: 'Curiosidades sobre o Item B', doacao: true, doacaoAnonima: true, imagens: [], nomeDoador: '', telefoneDoador: '' },
  { id: '3', nome: 'Item C', colecao: 'Coleção 1', privado: true, dataDoacao: new Date('2023-03-01'), descricao: 'Descrição do Item C', curiosidades: 'Curiosidades sobre o Item C', doacao: false, doacaoAnonima: false, imagens: [], nomeDoador: 'Doador C', telefoneDoador: '987654321' },
  { id: '4', nome: 'Item D', colecao: 'Coleção 3', privado: false, dataDoacao: new Date('2023-04-01'), descricao: 'Descrição do Item D', curiosidades: 'Curiosidades sobre o Item D', doacao: true, doacaoAnonima: false, imagens: [], nomeDoador: 'Doador D', telefoneDoador: '456789123' },
  { id: '5', nome: 'Item E', colecao: 'Coleção 2', privado: false, dataDoacao: new Date('2023-05-01'), descricao: 'Descrição do Item E', curiosidades: 'Curiosidades sobre o Item E', doacao: true, doacaoAnonima: true, imagens: [], nomeDoador: '', telefoneDoador: '' },
  { id: '6', nome: 'Item F', colecao: 'Coleção 3', privado: true, dataDoacao: new Date('2023-06-01'), descricao: 'Descrição do Item F', curiosidades: 'Curiosidades sobre o Item F', doacao: false, doacaoAnonima: false, imagens: [], nomeDoador: 'Doador F', telefoneDoador: '321654987' },
  { id: '7', nome: 'Item G', colecao: 'Coleção 1', privado: false, dataDoacao: new Date('2023-07-01'), descricao: 'Descrição do Item G', curiosidades: 'Curiosidades sobre o Item G', doacao: true, doacaoAnonima: false, imagens: [], nomeDoador: 'Doador G', telefoneDoador: '789456123' },
];

describe('Página Acervo', () => {
  beforeEach(() => {
    cy.stub(itemAcervoFirebase, 'getItensAcervo').resolves(mockItems);
    cy.visit('/acervo');
  });

  it('deve renderizar o loading e os itens em caso de sucesso', () => {
    cy.get('[data-cy="loading"]').should('be.visible');
    cy.get('[data-cy="item-card-container"]').should('have.length', 6);
  });

  it('deve carregar inicialmente os últimos 6 itens cadastrados em ordem alfabética', () => {
    cy.get('[data-cy="item-card-container"]').should('have.length', 6);
    cy.get('[data-cy="item-card-container"]').first().should('contain', 'Item G');
    cy.get('[data-cy="item-card-container"]').last().should('contain', 'Item B');
  });

  it('deve adicionar itens privados quando o usuário está logado', () => {
    cy.stub(auth, 'currentUser').value({ uid: 'mockUserId' });
    cy.reload();
    cy.get('[data-cy="item-card-container"]').should('have.length', 7);
    cy.get('[data-cy="item-card-container"]').should('contain', 'Item C');
    cy.get('[data-cy="item-card-container"]').should('contain', 'Item F');
  });

  it('não deve mostrar o mesmo item duas vezes em nenhuma página', () => {
    cy.get('[data-cy="item-card-container"]').then($cards => {
      const itemNames = $cards.map((_, el) => Cypress.$(el).text()).get();
      const uniqueItemNames = new Set(itemNames);
      expect(itemNames.length).to.equal(uniqueItemNames.size);
    });
  });

  it('deve filtrar itens por nome', () => {
    cy.get('[data-cy="nome-filter"]').type('Item A');
    cy.get('[data-cy="item-card-container"]').should('have.length', 1);
    cy.get('[data-cy="item-card-container"]').should('contain', 'Item A');
  });

  it('deve filtrar itens por coleção', () => {
    cy.get('[data-cy="colecao-filter"]').click();
    cy.contains('Coleção 1').click();
    cy.get('[data-cy="item-card-container"]').should('have.length', 2);
    cy.get('[data-cy="item-card-container"]').should('contain', 'Item A');
    cy.get('[data-cy="item-card-container"]').should('contain', 'Item G');
  });

  it('deve ordenar itens alfabeticamente', () => {
    cy.get('[data-cy="alfabetic-order"]').click();
    cy.get('[data-cy="item-card-container"]').first().should('contain', 'Item A');
    cy.get('[data-cy="alfabetic-order"]').click();
    cy.get('[data-cy="item-card-container"]').first().should('contain', 'Item G');
  });

  it('deve ordenar itens por data', () => {
    cy.get('[data-cy="date-order"]').click();
    cy.get('[data-cy="item-card-container"]').first().should('contain', 'Item A');
    cy.get('[data-cy="date-order"]').click();
    cy.get('[data-cy="item-card-container"]').first().should('contain', 'Item G');
  });

  it('deve limpar os filtros ao clicar no botão de limpar', () => {
    cy.get('[data-cy="nome-filter"]').type('Item A');
    cy.get('[data-cy="clear-filters"]').click();
    cy.get('[data-cy="nome-filter"]').should('have.value', '');
    cy.get('[data-cy="item-card-container"]').should('have.length', 6);
  });

  it('deve paginar corretamente os resultados', () => {
    cy.get('[data-cy="pagination"]').contains('2').click();
    cy.get('[data-cy="item-card-container"]').should('have.length', 1);
    cy.get('[data-cy="item-card-container"]').should('contain', 'Item A');
  });
});