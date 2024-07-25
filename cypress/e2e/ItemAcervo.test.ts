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

    cy.callFirestore("add", "acervo", { nome: "Item de teste 1", privado: false }).then((docRef) => {
      itemId = docRef._path.segments[1]; // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
    });

    cy.get('[data-cy="delete-button"]').should("exist");
    cy.get('[data-cy="delete-button"]').click();
    cy.get('[data-cy="dialog-excluir"]').should("exist");
    cy.wait(1000);
    cy.get('[data-cy="confirm-button-dialog-excluir"]').should("exist").click()
    .then(() => {
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
    });
    cy.contains("Item não encontrado").should("exist");

  });

  it("Deve exibir a página de erro 404 quando está editando", () => {

    cy.callFirestore("add", "acervo", { itemName: "Item de teste 2", itemPrivate: false }).then((docRef) => {
      itemId = docRef._path.segments[1]; // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
    });

    cy.get('[data-cy="edit-button"]').should("exist");
    cy.get('[data-cy="edit-button"]').click();
    cy.get('[data-cy="delete-button"]').click();
    cy.get('[data-cy="dialog-excluir"]').should("exist");
    cy.wait(1000);
    cy.get('[data-cy="confirm-button-dialog-excluir"]').should("exist");
    cy.get('[data-cy="confirm-button-dialog-excluir"]').click().then(() => {
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
    })
    cy.contains("Item não encontrado").should("exist");
  });

});

describe(" Alterar a privacidade de um item para público e acessar deslogado deve ser sucedido", () => {
    let itemId: string;

    before(() => {
      cy.login()
    });

    after(() => {
      cy.logout();
    });

    it("Deve alterar a privacidade de um item para público e acessar deslogado deve ser sucedido", () => {

        const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
        cy.callFirestore("add", "coleções", { nome: "Fotografia" })
        cy.callFirestore("add", "acervo", { nome: "Item de teste 3", descricao: "Descrição", curiosidades: "Curiosidades", dataDoacao: itemDonationDate , privado: true, colecao: "Fotografia" })
        .then((docRef) => {
          itemId = docRef._path.segments[1] // Pegando o ID do item criado
          cy.visit(`http://localhost:5173/acervo/${itemId}`);
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
            cy.reload();
            cy.get('[data-cy="title-item-acervo"]').should("exist");
          });
        });
    });

});


describe("Alterar a privacidade de um item para privado e acessar deslogado deve falhar (403)", () => {

  let itemId: string;
  before(() => {
    cy.login()
  });

  it("Deve alterar a privacidade de um item para privado e acessar deslogado deve falhar (403)", () => {
    const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
    cy.callFirestore("add", "coleções", { nome: "Fotografia" })
    cy.callFirestore("add", "acervo", { nome: "Item de teste 4", descricao: "Descrição", curiosidades: "Curiosidades", dataDoacao: itemDonationDate , privado: false, colecao: "Fotografia" })
    .then((docRef) => {
      itemId = docRef._path.segments[1] // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
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
        cy.visit(`http://localhost:5173/acervo/${itemId}`);
        cy.reload();

        cy.get('[data-cy="title-item-acervo"]').should("not.exist");
      });
    });
  });

  after(() => {
    cy.logout();
  });

});

describe("Nome atualizado não pode ser vazio", () => {
  let itemId: string;

  before(() => {
    cy.login()
  });

  it("Nome atualizado não pode ser vazio", () => {
    const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
    cy.callFirestore("add", "coleções", { nome: "Fotografia" })
    cy.callFirestore("add", "acervo", { nome: "", descricao: "Descrição", curiosidades: "Curiosidades", dataDoacao: itemDonationDate , privado: false, colecao: "Fotografia" })
    .then((docRef) => {
      itemId = docRef._path.segments[1] // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
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

  before(() => {
    cy.login()
  });

  after(() => {
    cy.logout();
  });

  it("Nenhuma informação deve ser modificada ao clicar em cancelar alterações", () => {
    const itemDonationDate: Timestamp = new Timestamp(dayjs().unix(), 0);
    cy.callFirestore("add", "coleções", { nome: "Fotografia" })
    cy.callFirestore("add", "acervo", { nome: "Item de teste 5", descricao: "Descrição", curiosidades: "Curiosidades", dataDoacao: itemDonationDate , privado: false, colecao: "Fotografia" })

    .then((docRef) => {
      itemId = docRef._path.segments[1] // Pegando o ID do item criado
      cy.visit(`http://localhost:5173/acervo/${itemId}`);
      cy.get('[data-cy="edit-button"]').should("exist");
      cy.get('[data-cy="edit-button"]').click();
      cy.get('[data-cy="Textfield-nome"]').should("exist")
      cy.get('[data-cy="Textfield-nome"]').type(" alterado");
      cy.get('[data-cy="Textfield-descricao"]').should("exist");
      cy.get('[data-cy="Textfield-descricao"]').type("do item");
      cy.get('[data-cy="Textfield-curiosidades"]').should("exist");
      cy.get('[data-cy="Textfield-curiosidades"]').type(" do item");
      cy.get('[data-cy="cancel-button"]').should("exist");

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
})
