describe("Renderizar página de criar item do acervo não logado", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/acervo/criar-item");
  });
  it("Deve mostrar mensagem de acesso não autorizado", () => {
    cy.get("[data-cy='page-title']").should("not.exist");
  });
});

describe("Renderizar página de criar item do acervo logado", () => {
  before(() => {
    cy.login(); //login persiste nas próximas seções
    cy.callFirestore("add", "coleções", { nome: "Coleção de teste" });
  });
  beforeEach(() => {
    cy.visit("http://localhost:5173/acervo/criar-item");
  });
  context("visualização desktop", () => {
    beforeEach(() => {
      cy.viewport(1366, 768);
    });

    it("Deve renderizar a página normalmente", () => {
      cy.get("[data-cy='page-title']").should("exist");
    });
    it("Deve exibir o DatePicker de Desktop", () => {
      //buscando datepicker a partir do label e adicionando um alias
      cy.contains("label", "Data da doação").next().as("datePicker");
      cy.get("@datePicker")
        .find("button[aria-label='Choose date']")
        .should("exist");
    });
  });
  context("visualização mobile", () => {
    beforeEach(() => {
      cy.viewport("samsung-s10");
    });
    it("Deve renderizar a página normalmente", () => {
      cy.get("[data-cy='page-title']").should("exist");
    });
    it("Deve exibir o DatePicker Mobile", () => {
      cy.visit("http://localhost:5173/acervo/criar-item");
      //buscando datepicker a partir do label e adicionando um alias
      cy.contains("label", "Data da doação").next().as("datePicker");
      cy.get("@datePicker").find("input[name='dataDoacao']").should("exist");
    });
  });
});

describe("Adicionar e remover imagens do item do acervo", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/acervo/criar-item");
  });
  it("Deve adicionar todas as imagens ao clicar em um input várias vezes", () => {
    cy.fixture("images/default_image.png").as("defaultImage");
    cy.fixture("images/default_image_copy.png").as("defaultImageCopy");
    cy.get("label[for='button-file']").selectFile("@defaultImage");
    cy.get("label[for='button-file']").selectFile("@defaultImageCopy");

    cy.get("[data-cy='images-section']").children().should("have.length", 2);
  });
  it("Deve adicionar todas as imagens ao adicionar múltiplas imagens de uma vez", () => {
    cy.fixture("images/default_image.png").as("defaultImage");
    cy.fixture("images/default_image_copy.png").as("defaultImageCopy");
    cy.get("label[for='button-file']").selectFile([
      "@defaultImage",
      "@defaultImageCopy",
    ]);

    cy.get("[data-cy='images-section']").children().should("have.length", 2);
  });
  it("Deve exibir uma mensagem de erro ao inserir um arquivo duplicado", () => {
    cy.fixture("images/default_image.png").as("defaultImage");
    cy.get("label[for='button-file']").selectFile("@defaultImage");
    cy.get("label[for='button-file']")
      .selectFile("@defaultImage")
      .then(() => {
        cy.get("[data-cy='snackbar-duplicate-file']").should("exist");
      });
  });
  it("Deve remover um arquivo ao clicar no botão de remover", () => {
    cy.fixture("images/default_image.png").as("defaultImage");
    cy.get("label[for='button-file']").selectFile("@defaultImage");

    cy.get("[data-cy='images-section']").children().should("have.length", 1);

    cy.get("[data-cy='image-card-remove-button']")
      .click()
      .then(() => {
        cy.get("[data-cy='images-section']")
          .children()
          .should("have.length", 0);
      });
  });
});

describe("Criar Item do Acervo doado não anonimamente", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/acervo/criar-item");
  });
  it("Deve criar um item de acervo", () => {
    //preenchendo nome do item e do doador
    cy.get('input[name="nome"]').type("nome");
    cy.get('input[name="nomeDoador"').type("nome doador");
    //selecionando coleção
    cy.get("#collection-select")
      .click()
      .then(() => {
        cy.get("[data-cy='select-collection-item']").first().click();
      });
    //selecionando data
    cy.contains("label", "Data da doação").next().as("datePicker");
    cy.get("@datePicker")
      .find("button[aria-label='Choose date']")
      .click()
      .then(() => {
        cy.get("button[aria-current='date']").click();
      });
    //checando dialog de sucesso
    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        cy.get("[data-cy='dialog'").should("exist");
        cy.get("[data-cy='dialog-text']").should(
          "have.text",
          "Item criado com sucesso"
        );
      });
  });
  it("Deve exibir mensagem de erro ao tentar criar um item de acervo sem preencher o nome do doador", () => {
    //preenchendo nome somente o nome do item
    cy.get('input[name="nome"]').type("nome");
    //selecionando coleção
    cy.get("#collection-select")
      .click()
      .then(() => {
        cy.get("[data-cy='select-collection-item']").first().click();
      });
    //selecionando data
    cy.contains("label", "Data da doação").next().as("datePicker");
    cy.get("@datePicker")
      .find("button[aria-label='Choose date']")
      .click()
      .then(() => {
        cy.get("button[aria-current='date']").click();
      });
    //checando dialog de sucesso
    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        cy.get("#item-donor-helper-text").should(
          "have.text",
          "Nome do doador é obrigatório para doações não-anônimas"
        );
      });
  });
});

describe("Criar Item do Acervo doado anonimamente", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/acervo/criar-item");
  });
  it("Deve criar um item de acervo", () => {
    cy.get('input[name="nome"]').type("Item de acervo teste");
    cy.get("#collection-select")
      .click()
      .then(() => {
        cy.get("[data-cy='select-collection-item']").first().click();
      });
    //selecionando data
    cy.contains("label", "Data da doação").next().as("datePicker");
    cy.get("@datePicker")
      .find("button[aria-label='Choose date']")
      .click()
      .then(() => {
        cy.get("button[aria-current='date']").click();
      });
    //habilitando doacao anonima
    cy.get("input[name='doacaoAnonima'").check();
    //checando dialog de sucesso
    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        cy.get("[data-cy='dialog'").should("exist");
        cy.get("[data-cy='dialog-text']").should(
          "have.text",
          "Item criado com sucesso"
        );
      });
  });

  it("Deve exibir mensagem de erro ao tentar criar um item de acervo sem preencher a data", () => {
    cy.get('input[name="nome"]').type("Item de acervo teste");
    cy.get("#collection-select")
      .click()
      .then(() => {
        cy.get("[data-cy='select-collection-item']").first().click();
      });

    //habilitando doacao anonima
    cy.get("input[name='doacaoAnonima'").check();
    cy.get('button[type="submit"]').click();

    cy.contains("label", "Data da doação").next().as("datePicker");
    cy.get("@datePicker")
      .find("input")
      .should("have.attr", "aria-invalid", "true");
  });
});

describe("Criar Item do Acervo não doado", () => {
  after(() => {
    cy.logout(); //logout após a ultima seção
  });
  beforeEach(() => {
    cy.visit("http://localhost:5173/acervo/criar-item");
  });
  it("Deve criar um item de acervo", () => {
    cy.get('input[name="nome"]').type("Item de acervo teste");
    cy.get("#collection-select")
      .click()
      .then(() => {
        cy.get("[data-cy='select-collection-item']").first().click();
      });
    //desabilitando opção de doação
    cy.get("input[name='doacao'").uncheck();

    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        cy.get("[data-cy='dialog'").should("exist");
        cy.get("[data-cy='dialog-text']").should(
          "have.text",
          "Item criado com sucesso"
        );
      });
  });

  it("Deve exibir mensagem de erro ao tentar criar um item de acervo sem preencher a coleção", () => {
    cy.get('input[name="nome"]').type("Item de acervo teste");
    cy.get("input[name='doacao'").click();

    cy.get('button[type="submit"]').click();
    cy.get("#collection-select-label").next().next().as("collectionHelperText");
    cy.get("@collectionHelperText").should(
      "have.text",
      "Coleção é obrigatória"
    );
  });
});
