import React from 'react';
import CardItemAcervo from '../CardItemAcervo';
import { ItemAcervo } from '../../../interfaces/ItemAcervo';
import { ThemeProvider } from '@mui/material/styles';
import getDesignTokens from "../../../theme/theme";

const theme = getDesignTokens('light');

const item: ItemAcervo = {
  id: '1',
  nome: 'Item de Teste',
  descricao: '',
  curiosidades: 'Curiosidade do item',
  dataDoacao: new Date(),
  colecao: 'Coleção de Teste',
  doacao: true,
  doacaoAnonima: true,
  nomeDoador: 'Nome do Doador',
  telefoneDoador: 'Telefone do Doador',
  privado: false,
  imagens: [],
};

const imagem = {
  src: '../assets/not-found.png',
  title: 'Imagem 1',
  alt: 'Imagem 1',
};

describe('CardItemAcervo Component', () => {
  beforeEach(() => {
    item.imagens = [imagem];
  });

  it('Deve exibir imagem padrão quando não há imagens', () => {
    const itemSemImagem = { ...item, imagens: [] };
    cy.mount(
      <ThemeProvider theme={theme}>
        <CardItemAcervo item={itemSemImagem} />
      </ThemeProvider>
    );
    cy.get('[data-cy="card-item-image"]').should('have.attr', 'src').and('include', 'not-found');
  });

  it('Imagem do item redimensiona corretamente preenchendo o campo de imagem do card', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CardItemAcervo item={item} />
      </ThemeProvider>
    );
    cy.get('[data-cy="card-item-image"]').should('have.attr', 'alt', imagem.alt);
    cy.get('[data-cy="card-item-image"]').should('have.css', 'object-fit', 'contain');
  });

  it('Deve ajustar o tamanho do card para tela mobile', () => {
    cy.viewport('iphone-6');
    cy.mount(
      <ThemeProvider theme={theme}>
        <CardItemAcervo item={item} />
      </ThemeProvider>
    );
    cy.get('[data-cy="card-item-container"]').should(($el) => {
      const width = $el.width();
      expect(width).to.be.lessThan(400);
    });
  });

  it('Deve mostrar uma mensagem pré-definida quando a descrição estiver vazia', () => {
    item.descricao = '';
    cy.mount(
      <ThemeProvider theme={theme}>
        <CardItemAcervo item={item} />
      </ThemeProvider>
    );
    cy.get('[data-cy="card-item-description"]').should('contain.text', 'Descrição do item');
  });
});