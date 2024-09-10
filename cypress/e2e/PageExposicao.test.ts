import { Timestamp } from "firebase/firestore";

describe("Testes página de visualizar exposição", () => {
  after(() => {
    if (Cypress.env("CLEAR_TEST_DATA") == "true") {
      // adicionando atributo exist para que a operacao delete encontre o caminho
      // cy.callFirestore("set", "exposicoes/publico/lista", {
      //   exist: true,
      // });
      // cy.callFirestore("set", "exposicoes/privado/lista", {
      //   exist: true,
      // });
      cy.callFirestore("delete", "exposicoes/publico/lista");
      cy.callFirestore("delete", "exposicoes/privado/lista");
      console.log(`Limpando dados de teste, ${Cypress.env("CLEAR_TEST_DATA")}`);
    } else {
      console.log(`Mantendo dados de teste, ${Cypress.env("CLEAR_TEST_DATA")}`);
    }
  });

  describe("Testes de renderização da página", () => {
    it("Deve carregar uma exposição pública", () => {
      addExposicaoMock(false, false).then((idExposicaoPublica) => {
        cy.visit(`/${idExposicaoPublica}`);
        cy.get("[data-cy='titulo-exposicao']").should("exist");
        cy.get("[data-cy='descricao-exposicao']").should("exist");
        cy.get("input[name='dataInicio']")
          .should("exist")
          .should("have.attr", "readonly");
        cy.get("input[name='dataFim']")
          .should("exist")
          .should("have.attr", "readonly");
      });
    });
    it("Deve carregar uma exposição privada para um usuário logado", () => {
      cy.login()
        .then(() => addExposicaoMock(false, true))
        .then((idExposicaoPrivada) => {
          cy.visit(`/${idExposicaoPrivada}`);
          cy.get("[data-cy='titulo-exposicao']").should("exist");
          cy.get("[data-cy='descricao-exposicao']").should("exist");
          cy.get("input[name='dataInicio']")
            .should("exist")
            .should("have.attr", "readonly");
          cy.get("input[name='dataFim']")
            .should("exist")
            .should("have.attr", "readonly");
        });
      cy.logout();
    });
    it("Não deve carregar uma exposição privada para um usuário não logado", () => {
      addExposicaoMock(false, true).then((idExposicaoPrivada) => {
        cy.visit(`/${idExposicaoPrivada}`);
        cy.get("p").contains("Erro").should("exist");
        cy.get("[data-cy='titulo-exposicao']").should("not.exist");
        cy.get("[data-cy='descricao-exposicao']").should("not.exist");
        cy.get("input[name='dataInicio']").should("not.exist");
        cy.get("input[name='dataFim']").should("not.exist");
      });
    });
    it("Não deve carregar o botão de deletar exposição para um usuário não logado", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-excluir-exposicao']").should("not.exist");
      });
    });
  });
  describe("Testes de interação usuário logado", () => {
    beforeEach(() => {
      cy.login();
    });
    afterEach(() => {
      cy.logout();
    });
    describe("Testes de adição e modificação da imagem", () => {
      it("Deve permitir a adição de uma imagem", () => {
        addExposicaoMock(false, false).then((idExposicaoSemItens) => {
          cy.visit(`/${idExposicaoSemItens}`);

          cy.get("[data-cy='button-editar-exposicao']").should("exist").click();
          cy.fixture("images/default_image.png").as("defaultImage");
          cy.get("label[for='button-file']").selectFile({
            contents: "cypress/fixtures/images/default_image.png",
            fileName: "file.png",
            mimeType: "image/png",
          });
          cy.get("[data-cy='image-exposicao']")
            .should("exist")
            .should("have.attr", "src");

          cy.get("form").submit();
          cy.get("[data-cy='dialog-sucesso-atualizar']").should("exist");
        });
      });

      it("Deve permitir a alteração de uma imagem por outra", () => {
        addExposicaoMock(false, false).then((idExposicaoSemItens) => {
          cy.visit(`/${idExposicaoSemItens}`);
          cy.get("[data-cy='button-editar-exposicao']").should("exist").click();
          cy.fixture("images/default_image.png").as("defaultImage");
          cy.get("label[for='button-file']").selectFile({
            contents: "cypress/fixtures/images/default_image.png",
            fileName: "file.png",
            mimeType: "image/png",
          });
          cy.get("[data-cy='image-exposicao']")
            .should("exist")
            .should("have.attr", "src");

          cy.get("form").submit();
          cy.get("[data-cy='button-dialog-sucesso-atualizar']")
            .should("exist")
            .click();
        });
      });
      it("Deve permitir a remoção de uma imagem", () => {
        addExposicaoMock(false, false).then((idExposicaoSemItens) => {
          cy.visit(`/${idExposicaoSemItens}`);
          cy.get("[data-cy='button-editar-exposicao']").should("exist").click();
          cy.fixture("images/default_image.png").as("defaultImage");
          cy.get("label[for='button-file']").selectFile({
            contents: "cypress/fixtures/images/default_image.png",
            fileName: "file.png",
            mimeType: "image/png",
          });
          cy.get("[data-cy='image-exposicao']")
            .should("exist")
            .should("have.attr", "src");

          cy.get("form").submit();
          cy.get("[data-cy='button-dialog-sucesso-atualizar']")
            .should("exist")
            .click()
            .then(() => {
              cy.get("[data-cy='button-editar-exposicao']").click();
              cy.get("[data-cy='button-remover-imagem']").click();
              cy.get("[data-cy='image-exposicao']").should("not.exist");

              cy.get("form").submit();
              cy.get("[data-cy='dialog-sucesso-atualizar']").should("exist");
            });
        });
      });
    });

    it("Deve baixar o QR code da exposição", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-compartilhar-exposicao']").click();
        cy.get("[data-cy='button-baixar-qrcode']")
          .click()
          .then(() => {
            const downloadsFolder = Cypress.config("downloadsFolder");
            cy.readFile(downloadsFolder + "/" + "Exposição teste-QR.png");
          });
      });
    });
    it("Deve copiar o link da exposição para a área de transferência", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-compartilhar-exposicao']").click();
        cy.get("[data-cy='button-copiar-link']").click();
        cy.window().then((win) => {
          win.navigator.clipboard.readText().then((text) => {
            expect(text).to.eq(cy.url);
          });
        });
      });
    });
    it("Deve permitir a adição de um item do acervo", () => {
      addExposicaoMock(false, false).then((idExposicaoSemItens) => {
        cy.visit(`${idExposicaoSemItens}`);
        cy.get("[data-cy='button-adicionar-item']").click();
        throw new Error("Not implemented");
      });
    });
    it("Deve permitir a remoção de um item do acervo", () => {
      addExposicaoMock(true, false).then((idExposicaoComItens) => {
        cy.visit(`${idExposicaoComItens}`);
        cy.get("[data-cy='button-excluir-item']").click();
        throw new Error("Not implemented");
      });
    });
    it("Não deve mostrar a opção de excluir quando o usuário não estiver editando", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-excluir-exposicao']")
          .contains("Excluir")
          .should("exist");

        cy.get("[data-cy='button-editar-exposicao']")
          .click()
          .then(() => {
            cy.get("[data-cy='button-excluir-exposicao']").should("not.exist");
          });
      });
    });
    it("Deve redirecionar após a exclusão de uma exposição", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-excluir-exposicao']")
          .should("exist")
          .click()
          .then(() => {
            cy.get("[data-cy='button-confirmar-exclusao']")
              .should("exist")
              .click()
              .then(() => {
                cy.url().should("not.eq", `/${idExposicao}`);
              });
          });
      });
    });
    it("Deve permitir a edição das informações de uma exposição", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-editar-exposicao']")
          .click()
          .then(() => {
            cy.get("input[name='nome']").type("Exposição teste");
            cy.get("textarea[name='descricao']").type("Exposição de teste");

            cy.get("input[name='privado']").check();

            cy.get("textarea[name='descricao']").type("Exposição de teste");

            cy.contains("label", "Data de início")
              .next()
              .as("datePickerInicio");
            cy.get("@datePickerInicio")
              .find("button")
              .click()
              .then(() => {
                cy.get("button[aria-current='date']").click();
              });

            cy.contains("label", "Data de término")
              .next()
              .as("datePickerTermino");
            cy.get("@datePickerTermino")
              .find("button")
              .click()
              .then(() => {
                cy.get("button[aria-current='date']").click();
              });

            cy.get("form").submit();
            cy.get("[data-cy='dialog-sucesso-atualizar']").should("exist");
          });
      });
    });
    it("Deve recarregar a página mesma url após atualizar sem mudar a privacidade", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-excluir-exposicao']")
          .contains("Excluir")
          .should("exist");

        cy.get("[data-cy='button-editar-exposicao']")
          .click()
          .then(() => {
            cy.get("input[name='nome']").type("Exposição teste");
            cy.get("form").submit();
            cy.get("[data-cy='dialog-sucesso-atualizar']").should("exist");
            cy.get("[data-cy='button-dialog-sucesso-atualizar']")
              .should("exist")
              .click()
              .then(() => {
                cy.url().should("contain", `/${idExposicao}`);
              });
          });
      });
    });
    it("Deve recarregar a página em uma nova url após atualizar mudando a privacidade", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-editar-exposicao']")
          .click()
          .then(() => {
            cy.get("input[name='privado']").check();
            cy.get("form").submit();
            cy.get("[data-cy='dialog-sucesso-atualizar']").should("exist");
            cy.get("[data-cy='button-dialog-sucesso-atualizar']")
              .should("exist")
              .click()
              .then(() => {
                cy.url().should("not.contain", `/${idExposicao}`);
              });
          });
      });
    });
    it("Deve manter a exposição inalterada caso o usuário cancele a edição", () => {
      addExposicaoMock(false, false).then((idExposicao) => {
        cy.visit(`/${idExposicao}`);
        cy.get("[data-cy='button-editar-exposicao']")
          .click()
          .then(() => {
            cy.get("input[name='nome']")
              .type("Exposição teste")
              .then((input) => {
                const nomeEditado = input;
                cy.wrap(nomeEditado).as("nome");
              });

            cy.get("textarea[name='descricao']")
              .type("Exposição de teste")
              .then((input) => {
                const descricaoEditada = input;
                cy.wrap(descricaoEditada).as("descricao");
              });

            cy.contains("label", "Data de início")
              .next()
              .as("datePickerInicio");
            cy.get("@datePickerInicio")
              .find("input")
              .then((input) => {
                const dataInicioEditada = input;
                cy.wrap(dataInicioEditada).as("dataInicio");
              });
            cy.get("@datePickerInicio")
              .find("button")
              .click()
              .then(() => {
                cy.get("button[aria-selected='false']").first().click();
              });

            cy.contains("label", "Data de término")
              .next()
              .as("datePickerTermino");
            cy.get("@datePickerTermino")
              .find("input")
              .then((input) => {
                const dataTerminoEditada = input;
                cy.wrap(dataTerminoEditada).as("dataTermino");
              });
            cy.get("@datePickerTermino")
              .find("button")
              .click()
              .then(() => {
                cy.get("button[aria-selected='false']").first().click();
              });

            cy.get("[data-cy='button-cancelar-edicao']")
              .click()
              .then(() => {
                cy.get("@nome").then((nome) => {
                  cy.get("[data-cy='titulo-exposicao']")
                    .should("exist")
                    .invoke("text")
                    .then((text) => {
                      expect(nome.val()).to.not.equal(text);
                    });
                });

                cy.get("@descricao").then((descricao) => {
                  cy.get("[data-cy='descricao-exposicao']")
                    .should("exist")
                    .invoke("text")
                    .then((text) => {
                      expect(descricao.val()).to.contain(text);
                    });
                });
                cy.get("@dataInicio").then((dataInicio) => {
                  cy.get("input[name='dataInicio']")
                    .should("exist")
                    .invoke("val")
                    .then((val) => {
                      expect(val).to.not.eq(dataInicio);
                    });
                });
                cy.get("@dataTermino").then((dataTermino) => {
                  cy.get("input[name='dataFim']")
                    .should("exist")
                    .invoke("val")
                    .then((val) => {
                      expect(val).to.not.eq(dataTermino);
                    });
                });
              });
          });
      });
    });
  });
});

const addExposicaoMock = (withItem: boolean, isPrivate: boolean) => {
  const subCollection = isPrivate ? "privado" : "publico";
  const mockItemAcervo = {
    nome: "Item de teste",
    descricao: "",
    curiosidades: "Curiosidades",
    dataDoacao: new Date(),
    privado: false,
    colecao: "Teste",
    imagens: [],
  };
  const mockExposicao = {
    nome: "Exposição teste",
    descricao: "Exposição de teste",
    privado: isPrivate,
    permanente: false,
    dataInicio: Timestamp.fromDate(new Date()),
    dataFim: Timestamp.fromDate(new Date()),
    itensPorColecao: {},
    dataCriacao: Timestamp.fromDate(new Date()),
  };
  if (withItem) {
    cy.callFirestore(
      "add",
      `colecoes/publico/lista/teste/publico`,
      mockItemAcervo
    ).then(
      (docRef) =>
        (mockExposicao.itensPorColecao = new Map([
          [docRef._path.segments[3], docRef._path.segments.join()],
        ]))
    );
  }
  const subpath = cy
    .callFirestore("add", `exposicoes/${subCollection}/lista`, mockExposicao)
    .then((docRef) => docRef._path.segments.join("/"));
  return subpath;
};
