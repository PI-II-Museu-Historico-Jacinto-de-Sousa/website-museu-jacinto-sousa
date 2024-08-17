import CardItemAcervo from '../CardItemAcervo';
import { ItemAcervo } from '../../../interfaces/ItemAcervo';

describe('CardItemAcervo Component', () => {
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
    src: 'imagens/img1.jpg',
    title: 'Imagem 1',
    alt: 'Imagem 1',
  };

  beforeEach(() => {
    item.imagens.push(imagem);
  });

  it('Deve mostrar uma mensagem pré-definida quando a descrição estiver vazia', () => {
    item.descricao = '';
    cy.mount(<CardItemAcervo item={item} />);
    cy.get('[data-cy="card-item-description"]').should('contain.text', 'Descrição do item');
  });

  it('Imagem do item redimensiona corretamente preenchendo o campo de imagem do card', () => {
    cy.mount(<CardItemAcervo item={item} />);
    cy.get('[data-cy="card-item-image"]').should('have.attr', 'alt', imagem.alt);
  });
});
