import dayjs = require("dayjs");
import { Timestamp } from "firebase/firestore";

describe("Remover um item e tentar acessar a mesma página de novo deve resultar em erro (404)", () => {
  let itemId;

  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it("Deve exibir a página de erro 404 quando não está editando", () => {
    let itemDomesticoID;
    let fotografiaID;

    // Adiciona a primeira coleção e obtém o ID
    cy.callFirestore("add", "colecoes/publico/lista/", {
      nome: "Item doméstico",
    }).then((docRef) => {
      itemDomesticoID = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a primeira operação termina, adiciona a segunda coleção
      return cy.callFirestore("add", "colecoes/publico/lista/", {
        nome: "Fotografia"
      });
    }).then((docRef) => {
      fotografiaID = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a segunda operação termina, adiciona o item na primeira coleção
      return cy.callFirestore("add", `colecoes/publico/lista/${itemDomesticoID}/publico`, {
        nome: "Item de teste 1",
        privado: false,
        imagens: [],
        colecao: "Item doméstico"
      });
    }).then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado

      // Depois que o item é criado, visita a página correspondente
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${itemDomesticoID}/publico/${itemId}`);
    });

    // Continua com o restante do teste
    cy.get('[data-cy="delete-button"]').should("exist");
    cy.get('[data-cy="delete-button"]').click();
    cy.get('[data-cy="dialog-excluir"]').should("exist");
    cy.wait(1000);
    cy.get('[data-cy="confirm-button-dialog-excluir"]').should("exist").click()
    cy.wait(1000);
    cy.visit(`http://localhost:5173/colecoes/publico/lista/${itemDomesticoID}/publico/${itemId}`);
    cy.contains("Item não encontrado").should("exist").then(() => {
      cy.callFirestore("delete", "colecoes");
    });
  });

  it("Deve exibir a página de erro 404 quando está editando", () => {

    let itemDomesticoID;
    let fotografiaID;

    // Adiciona a primeira coleção e obtém o ID
    cy.callFirestore("add", "colecoes/publico/lista/", {
      nome: "Item doméstico",
    }).then((docRef) => {
      itemDomesticoID = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a primeira operação termina, adiciona a segunda coleção
      return cy.callFirestore("add", "colecoes/publico/lista/", {
        nome: "Fotografia"
      });
    }).then((docRef) => {
      fotografiaID = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a segunda operação termina, adiciona o item na primeira coleção
      return cy.callFirestore("add", `colecoes/publico/lista/${itemDomesticoID}/publico`, {
        nome: "Item de teste 1",
        privado: false,
        imagens: [],
        colecao: "Item doméstico"
      });
    }).then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado

      // Depois que o item é criado, visita a página correspondente
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${itemDomesticoID}/publico/${itemId}`);
    });

    // Continua com o restante do teste
    cy.get('[data-cy="edit-button"]').should("exist");
    cy.get('[data-cy="delete-button"]').should("exist");
    cy.get('[data-cy="delete-button"]').click();
    cy.get('[data-cy="dialog-excluir"]').should("exist");
    cy.wait(1000);
    cy.get('[data-cy="confirm-button-dialog-excluir"]').should("exist").click()
    cy.wait(1000);
    cy.visit(`http://localhost:5173/colecoes/publico/lista/${itemDomesticoID}/publico/${itemId}`);
    cy.contains("Item não encontrado").should("exist").then(() => {
      cy.callFirestore("delete", "colecoes");
    });

  });

});

describe("Alterar a privacidade de um item para público e acessar deslogado deve ser sucedido", () => {
  let itemId: string;
  const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
  let quadroId;

  before(() => {
    cy.login();
    // Adiciona a primeira coleção e obtém o ID
    cy.callFirestore("add", "colecoes/publico/lista/", {
      nome: "Quadro",
    }).then((docRef) => {
      quadroId = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a primeira operação termina, adiciona a segunda coleção
      return cy.callFirestore("add", `colecoes/publico/lista/${quadroId}/privado`, {
        nome: "Item de teste 3",
        privado: true,
        imagens: [],
        colecao: "Quadro",
        dataDoacao: itemDonationDate
      });
    }).then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado

      // Depois que o item é criado, visita a página correspondente
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${quadroId}/privado/${itemId}`);
    });
  });

  after(() => {
    cy.logout();
    cy.callFirestore("delete", "colecoes");
  });

  it("Deve alterar a privacidade de um item para público e acessar deslogado deve ser sucedido", () => {

    // Continua com o restante do teste
    cy.get('[data-cy="edit-button"]').should("exist");
    cy.get('[data-cy="edit-button"]').click();
    cy.get('[data-cy="checkbox-privado"]').should("exist");
    cy.get('[data-cy="checkbox-privado"]').click();
    cy.get('[data-cy="save-button"]').should("exist");
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="dialog-confirm-save"]').should("exist").then(() => {
      cy.get('[data-cy="button-ok-dialog-save"]').should("exist");
      cy.get('[data-cy="button-ok-dialog-save"]').click();
      cy.logout();
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${quadroId}/publico/${itemId}`);
      cy.get('[data-cy="title-item-acervo"]').should("exist");
      cy.contains("Item de teste 3").should("exist");
    });
  });
});
describe("Alterar a privacidade de um item para privado e acessar deslogado deve falhar (403)", () => {
  let itemId: string;
  const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
  let quadroId;

  before(() => {
    cy.login();
    // Adiciona a primeira coleção e obtém o ID
    cy.callFirestore("add", "colecoes/publico/lista/", {
      nome: "Quadro",
    }).then((docRef) => {
      quadroId = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a primeira operação termina, adiciona o item na coleção
      return cy.callFirestore("add", `colecoes/publico/lista/${quadroId}/publico`, {
        nome: "Item de teste 4",
        descricao: "Descrição",
        curiosidades: "Curiosidades",
        dataDoacao: itemDonationDate,
        privado: false,
        colecao: "Quadro",
        imagens: [],
      });
    }).then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${quadroId}/publico/${itemId}`);
    });
  });

  after(() => {
    cy.logout();
    cy.callFirestore("delete", "colecoes");
  });

  it("Deve alterar a privacidade de um item para privado e acessar deslogado deve falhar (403)", () => {
    // Continua com o restante do teste
    cy.get('[data-cy="edit-button"]').should("exist");
    cy.get('[data-cy="edit-button"]').click();
    cy.get('[data-cy="checkbox-privado"]').should("exist");
    cy.get('[data-cy="checkbox-privado"]').click();
    cy.get('[data-cy="save-button"]').should("exist");
    cy.get('[data-cy="save-button"]').click();
    cy.wait(1000);
    cy.get('[data-cy="dialog-confirm-save"]').should("exist").then(() => {
      cy.get('[data-cy="button-ok-dialog-save"]').should("exist");
      cy.get('[data-cy="button-ok-dialog-save"]').click();
      cy.logout();
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${quadroId}/privado/${itemId}`);
      cy.reload();

      cy.get('[data-cy="title-item-acervo"]').should("not.exist");
    });
  });
});


describe("Nome atualizado não pode ser vazio", () => {
  let itemId: string;
  const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
  let moedasId: string;

  before(() => {
    cy.login()
    cy.callFirestore("add", "colecoes/publico/lista/", {
      nome: "Quadro",
    }).then((docRef) => {
      moedasId = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a primeira operação termina, adiciona o item na coleção
      return cy.callFirestore("add", `colecoes/publico/lista/${moedasId}/publico`, {
        nome: "Item de teste 4",
        descricao: "Descrição",
        curiosidades: "Curiosidades",
        dataDoacao: itemDonationDate,
        privado: false,
        colecao: "Quadro",
        imagens: [],
      });
    }).then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${moedasId}/publico/${itemId}`);
    });
  });

  it("Nome atualizado não pode ser vazio", () => {

    const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
    cy.callFirestore("add", "colecoes/publico/lista/Quadro/publico", { nome: "", descricao: "Descrição", curiosidades: "Curiosidades", dataDoacao: itemDonationDate , privado: false, colecao: "Fotografia", imagens: [] })
    .then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/colecoes/publico/lista/Quadro/publico/${itemId}`);
      cy.get('[data-cy="edit-button"]').should("exist");
      cy.get('[data-cy="edit-button"]').click();
      cy.get('[data-cy="Textfield-nome"]').should("exist")
      cy.get('[data-cy="save-button"]').should("exist");
      cy.get('[data-cy="save-button"]').click();

      cy.get('#Textfield-nome-helper-text').should('have.text', 'Nome do item é obrigatório');
    });
  });

  after(() => {
    cy.logout();
  });
})

describe("Nenhuma informação deve ser modificada ao clicar em cancelar alterações", () => {
  let itemId: string;
  let cedulasId: string;
  const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);

  before(() => {
    cy.login()
    cy.callFirestore("add", "colecoes/publico/lista/", {
      nome: "Quadro",
    }).then((docRef) => {
      cedulasId = docRef._path.segments[3]; // Pegando o ID da coleção criada

      // Depois que a primeira operação termina, adiciona o item na coleção
      return cy.callFirestore("add", `colecoes/publico/lista/${cedulasId}/publico`, {
        nome: "Item de teste 5",
        descricao: "Descrição",
        curiosidades: "Curiosidades",
        dataDoacao: itemDonationDate,
        privado: false,
        colecao: "Cédulas",
        imagens: [],
      });
    }).then((docRef) => {
      itemId = docRef._path.segments[5]; // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/colecoes/publico/lista/${cedulasId}/publico/${itemId}`);
    });
  });

  after(() => {
    cy.logout();
  });

  it("Nenhuma informação deve ser modificada ao clicar em cancelar alterações", () => {

    const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
    cy.callFirestore("add", "colecoes/publico/lista/Quadro/publico", { nome: "Item de teste 5", descricao: "Descrição", curiosidades: "Curiosidades", dataDoacao: itemDonationDate , privado: false, colecao: "Fotografia", imagens: []})

    cy.visit(`http://localhost:5173/colecoes/publico/lista/${cedulasId}/publico/${itemId}`);
      cy.get('[data-cy="edit-button"]').should("exist");
      cy.get('[data-cy="edit-button"]').click();
      cy.get('[data-cy="Textfield-nome"]').should("exist")
      cy.get('[data-cy="Textfield-nome"]').type(" alterado");
      cy.get('[data-cy="Textfield-descricao"]').should("exist");
      cy.get('[data-cy="Textfield-descricao"]').type("do item");
      cy.get('[data-cy="Textfield-curiosidades"]').should("exist");
      cy.get('[data-cy="Textfield-curiosidades"]').type(" do item");
      cy.get('[data-cy="cancel-button"]').should("exist");
      cy.get('[data-cy="cancel-button"]').click();
      cy.get('[data-cy="edit-button"]').click();

      it("Nome não mudou", () => {
        cy.get('[data-cy="title-item-acervo"]').should("exist");
        cy.contains("Item de teste 5").should("exist");
      });

      it("Descrição não mudou", () => {
        cy.get('[data-cy="description-item-acervo"]').should("exist");
        cy.contains("Descrição").should("exist");
      });

      it("Curiosidades não mudou", () => {
        cy.get('[data-cy="curiosities-item-acervo"]').should("exist");
        cy.contains("Curiosidades").should("exist");
      });

      it("Data de doação não mudou", () => {
        cy.get('[data-cy="donation-date-item-acervo"]').should("exist");
        cy.contains(itemDonationDate.toString()).should("exist");
      });

      it("Privacidade não mudou", () => {
        cy.get('[data-cy="private-item-acervo"]').should("exist");
        cy.contains("Item privado").should("not.exist");
      });

  });
});
