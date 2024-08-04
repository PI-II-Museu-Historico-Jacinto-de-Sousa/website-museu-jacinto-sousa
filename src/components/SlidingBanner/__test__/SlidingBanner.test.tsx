import SlidingBanner from "../SlidingBanner";
import getDesignTokens from "../../../theme/theme"
import { ThemeProvider } from "@emotion/react"
import { auth } from "../../../../firebase/firebase";

const theme = getDesignTokens('light')


interface SlidingBannerProps {
  images: Imagem[];
  addImage: () => void;
  editAlt: (key: number) => void;
  removeImage: (key: number) => void;
}

const images: Imagem[] = [
  {
    src: 'https://via.placeholder.com/662x456?text=Imagem+1',
    title: 'Imagem 1',
    alt: 'Imagem 1',
  },
  {
    src: 'https://via.placeholder.com/662x456?text=Imagem+2',
    title: 'Imagem 2',
    alt: 'Imagem 2',
  },
  {
    src: 'https://via.placeholder.com/662x456?text=Imagem+3',
    title: 'Imagem 3',
    alt: 'Imagem 3',
  },
];

const bannerProps: SlidingBannerProps = {
  images: images,
  addImage: () => {},
  editAlt: (key: number) => {
    console.log(key)
  },
  removeImage: (key: number) => {
    console.log(key)
  },
};

describe(" Menu no topo renderiza apenas quando estiver logado",() => {

  it("Deve renderizar o menu de edição apenas quando estiver logado", () => {
    cy.loginComponent(auth, 'test@mail', 'testpassword')
    cy.mount(<ThemeProvider theme={theme}><SlidingBanner {...bannerProps} /></ThemeProvider>)
    cy.get("[data-cy='menu-editar-sliding-banner']").should('exist')
  });

  it("Deve renderizar o menu de edição apenas quando estiver logado", () => {
    cy.mount(<ThemeProvider theme={theme}><SlidingBanner {...bannerProps} /></ThemeProvider>)
    cy.get("[data-cy='menu-editar-sliding-banner']").should('not.exist')
  });
});

describe('Teste de visiblidade do botão de adicionar imagem', () => {
  it('Deve renderizar o botão de adicionar imagem apenas quando estiver logado', () => {
    cy.loginComponent(auth, 'test@mail', 'testpassword')
    cy.mount(<ThemeProvider theme={theme}><SlidingBanner {...bannerProps} /></ThemeProvider>)
    cy.get("[data-cy='botao-adicionar-imagem']").should('exist')
  });

  it('Deve renderizar o botão de adicionar imagem apenas quando estiver logado', () => {
    cy.mount(<ThemeProvider theme={theme}><SlidingBanner {...bannerProps} /></ThemeProvider>)
    cy.get("[data-cy='botao-adicionar-imagem']").should('not.exist')
  });
})

describe('Teste de visibilidade da imagem', () => {
  it('Ao renderizar, a primeira imagem é visível', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <SlidingBanner {...bannerProps} />
      </ThemeProvider>
    );

    // Verifica se a primeira imagem está visível
    cy.get('img').first().should('be.visible').and('have.attr', 'src', images[0].src);
  });
});

describe('Teste de execução de funções', () => {
  let addImageSpy, editAltSpy, removeImageSpy;

  beforeEach(() => {
    addImageSpy = cy.spy().as('addImageSpy');
    editAltSpy = cy.spy().as('editAltSpy');
    removeImageSpy = cy.spy().as('removeImageSpy');

    const bannerProps: SlidingBannerProps = {
      images: images,
      addImage: addImageSpy,
      editAlt: editAltSpy,
      removeImage: removeImageSpy,
    };

    cy.mount(
      <ThemeProvider theme={theme}>
        <SlidingBanner {...bannerProps} />
      </ThemeProvider>
    );
  });

  it('Deve executar adicionar imagem', () => {
    // Ensure user is logged in to see the edit options
    cy.loginComponent(auth, 'test@mail', 'testpassword');
    cy.get("[data-cy='menu-editar-sliding-banner']").should('exist');

    cy.contains('Adicionar imagem').click();
    cy.get('@addImageSpy').should('have.been.calledOnce');
  });

  it('Deve executar a função editAlt', () => {
    // Ensure user is logged in to see the edit options
    cy.loginComponent(auth, 'test@mail', 'testpassword');
    cy.get("[data-cy='menu-editar-sliding-banner']").should('exist');

    // Start editing
    cy.get("[data-cy='botaoEditar']").click();
    cy.get("[data-cy='botaoSalvar']").click();
    cy.get('@editAltSpy').should('have.been.calledOnce');
  });

  it('Deve executar remover imagem', () => {
    // Ensure user is logged in to see the edit options
    cy.loginComponent(auth, 'test@mail', 'testpassword');
    cy.get("[data-cy='menu-editar-sliding-banner']").should('exist');

    cy.get("[data-cy='botaoEditar']").click();
    cy.contains('Deletar imagem').click();
    cy.get('@removeImageSpy').should('have.been.calledOnce');
  });
});

describe('Teste de execução das funções de next e previous', () => {
  let bannerProps;

  beforeEach(() => {
    bannerProps = {
      images: images,
      addImage: cy.spy().as('addImageSpy'),
      editAlt: cy.spy().as('editAltSpy'),
      removeImage: cy.spy().as('removeImageSpy'),
    };

    cy.mount(
      <ThemeProvider theme={theme}>
        <SlidingBanner {...bannerProps} />
      </ThemeProvider>
    );
  });

  it('Deve navegar para a última imagem quando o botão anterior for clicado e o slide for 0', () => {
    // Verifique se a primeira imagem está visível inicialmente
    cy.get('img').first().should('be.visible').and('have.attr', 'src', images[0].src);

    // Clique no botão "anterior"
    cy.get("[data-cy='botaoAnterior']").click();

    // Verifique se a última imagem está visível
    cy.contains('Imagem 3').should('be.visible');
  });

  it('Deve navegar para a primeira imagem quando o botão próximo for clicado e o slide for o último', () => {
    // Verifique se a primeira imagem está visível inicialmente
    cy.get('img').first().should('be.visible').and('have.attr', 'src', images[0].src);

    // Avança para a última imagem manualmente
    for (let i = 1; i < images.length; i++) {
      cy.get("[data-cy='botaoProximo']").click()
    }

    cy.get('img').first().should('be.visible').and('have.attr', 'src', images[0].src);
  });
});