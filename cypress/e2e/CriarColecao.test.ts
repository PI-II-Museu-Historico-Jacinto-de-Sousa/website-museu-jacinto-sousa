describe("Renderizar página de criar coleção", () =>{
  before(() =>{
    cy.login()
  })
  beforeEach(() => {
    cy.visit("http://localhost:5173/colecoes/criar-colecao");
  })
  context("Vizualização Desktop", () =>{
    beforeEach(() =>{
      cy.viewport(1366, 768)
    })
    it("Deve renderizar a página normalmente", () =>{
      cy.get("[data-cy='page-content']").should("exist")
    })
    it("Deve renderizar todos os campos", () =>{
      cy.get("[data-cy='collection-name']").should("exist")
      cy.get("[data-cy='collection-description']").should("exist")
      cy.get("[data-cy='collection-curiosity']").should("exist")
    })
  })
  context("Vizualização Mobile", () =>{
    beforeEach(() =>{
      cy.viewport("samsung-s10")
    })
    it("Deve renderizar a página normalmente", () =>{
      cy.get("[data-cy='page-content']").should("exist")
    })
    it("Deve renderizar todos os campos", () =>{
      cy.get("[data-cy='collection-name']").should("exist")
      cy.get("[data-cy='collection-description']").should("exist")
      cy.get("[data-cy='collection-curiosity']").should("exist")
    })
  })
}) 

describe("Criar uma nova coleção", () =>{
  before(() =>{
    cy.login()
  })
  beforeEach(() => {
    cy.visit("http://localhost:5173/colecoes/criar-colecao");
  })
  context("Vizualização Desktop", () =>{
    beforeEach(() =>{
      cy.viewport(1366, 768)
    })
    it("Deve criar uma coleção sem possuir um nome", () =>{
      cy.get("[data-cy='collection-description']").type("Descrição de teste")
      cy.get("[data-cy='collection-curiosity']").type("Curiosidade de teste")
      cy.get("[data-cy='submit-button']").click()
  
      cy.get("[data-cy='dialog']").contains("Nome da coleção é obrigatório")
    })
    it("Deve criar uma coleção com um nome", () =>{
      cy.get("[data-cy='collection-name']").type("Nome de teste")
      cy.get("[data-cy='collection-description']").type("Descrição de teste")
      cy.get("[data-cy='collection-curiosity']").type("Curiosidade de teste")
      cy.get("[data-cy='submit-button']").click()
  
      cy.get("[data-cy='dialog']").contains("Coleção criada com sucesso")
    })
    it("Deve criar uma coleção e campos devem ser limpos", () =>{
      cy.get("[data-cy='collection-name']").type("Nome de teste")
      cy.get("[data-cy='collection-description']").type("Descrição de teste")
      cy.get("[data-cy='collection-curiosity']").type("Curiosidade de teste")
      cy.get("[data-cy='collection-private']").click()

      cy.get("[data-cy='submit-button']").click()
  
      cy.get("[data-cy='dialog']").contains("Coleção criada com sucesso")

      cy.get("[data-cy='dialog-button']").click()

      cy.get("[data-cy='collection-name']").should("have.value", "")
      cy.get("[data-cy='collection-description']").should("have.value", "")
      cy.get("[data-cy='collection-curiosity']").should("have.value", "")
    })
  })
  context("Vizualização Mobile", () =>{
    beforeEach(() =>{
      cy.viewport("samsung-s10")
    })
    it("Deve criar uma coleção sem possuir um nome", () =>{
      cy.get("[data-cy='collection-description']").type("Descrição de teste")
      cy.get("[data-cy='collection-curiosity']").type("Curiosidade de teste")
      cy.get("[data-cy='submit-button']").click()
  
      cy.get("[data-cy='dialog']").contains("Nome da coleção é obrigatório")
    })
    it("Deve criar uma coleção com um nome", () =>{
      cy.get("[data-cy='collection-name']").type("Nome de teste")
      cy.get("[data-cy='collection-description']").type("Descrição de teste")
      cy.get("[data-cy='collection-curiosity']").type("Curiosidade de teste")
      cy.get("[data-cy='submit-button']").click()
  
      cy.get("[data-cy='dialog']").contains("Coleção criada com sucesso")
    })
    it("Deve criar uma coleção e campos devem ser limpos", () =>{
      cy.get("[data-cy='collection-name']").type("Nome de teste")
      cy.get("[data-cy='collection-description']").type("Descrição de teste")
      cy.get("[data-cy='collection-curiosity']").type("Curiosidade de teste")
      cy.get("[data-cy='collection-private']").click()

      cy.get("[data-cy='submit-button']").click()
  
      cy.get("[data-cy='dialog']").contains("Coleção criada com sucesso")

      cy.get("[data-cy='dialog-button']").click()

      cy.get("[data-cy='collection-name']").should("have.value", "")
      cy.get("[data-cy='collection-description']").should("have.value", "")
      cy.get("[data-cy='collection-curiosity']").should("have.value", "")
    })
  })
}) 