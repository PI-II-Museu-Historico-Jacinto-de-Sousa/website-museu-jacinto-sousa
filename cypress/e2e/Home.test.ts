describe("Renderizar página Home", () =>{
  beforeEach(() =>{
    cy.visit("http://localhost:5173/home")
  })
  context("Visualização desktop", () =>{
    beforeEach(() =>{
      cy.viewport(1366, 768)
    })
    it("Deve renderizar normalmente", () =>{
      cy.get("[data-cy='page-content']").should("exist")
    })
  })
  context("Visualização mobile", () =>{
    beforeEach(() =>{
      cy.viewport("samsung-s10")
    })
    it("Deve renderizar normalmente", () =>{
      cy.get("[data-cy='page-content']").should("exist")
    })
  })
})

describe("Adicionar imagens ao slidingBanner", () =>{
  beforeEach(() =>{
    cy.visit("http://localhost:5173/home")
  })
  it("Deve aumentar o número de imagens no banner", () =>{
    cy.fixture("images/default_image.png").as("defaultImage")
    cy.fixture("images/default_image_copy.png").as("defaultImageCopy")
    
    cy.get("[data-cy='botao-adicionar-imagem']").click()
    cy.get("[id='input-file']").should("not.be.visible").invoke("show").selectFile("@defaultImage", {force: true})

    cy.get("[data-cy='botao-adicionar-imagem']").click()
    cy.get("[id='input-file']").selectFile("@defaultImageCopy", {force: true})

    cy.get("[data-cy='images-container']").find("[data-cy='imageSlidingBanner']").should("have.length", 2)
  }) 
  it("Deve aumentar o número de imagens no banner", () =>{
    cy.fixture("images/default_image.png").as("defaultImage")
    cy.fixture("images/default_image_copy.png").as("defaultImageCopy")
    
    cy.get("[data-cy='botao-adicionar-imagem']").click()
    cy.get("[id='input-file']").should("not.be.visible").invoke("show").selectFile("@defaultImage", {force: true})

    cy.get("[data-cy='botao-adicionar-imagem']").click()
    cy.get("[id='input-file']").selectFile("@defaultImageCopy", {force: true})

    cy.get("[data-cy='images-container']").find("[data-cy='imageSlidingBanner']").should("have.length", 2)
  })
})

describe("Editar o texto alternativo de uma imagem no slidingBanner", () =>{

}) 