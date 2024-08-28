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
    cy.get("[id='input-file']").selectFile(
      [
        {
          contents: "cypress/fixtures/images/default_image.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )

    cy.get("[id='input-file']").selectFile([
        {
          contents: "cypress/fixtures/images/default_image_copy.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )

    cy.get("[data-cy='images-container']").find("[data-cy='imageSlidingBanner']").should("have.length", 2)
  }) 
  it("Deve deletar uma imagens no banner", () =>{
    cy.get("[id='input-file']").selectFile(
      [
        {
          contents: "cypress/fixtures/images/default_image.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )

    cy.get("[data-cy='botaoEditar']").click()
    cy.get("[data-cy='botaoDeletar']").click()
    cy.get("[data-cy='images-container']").find("[data-cy='imageSlidingBanner']").should("have.length", 0)
  })
})

describe("Editar o texto alternativo de uma imagem no slidingBanner", () =>{
  beforeEach(() =>{
    cy.visit("http://localhost:5173/home")
  })
  it("Deve adicionar o texto alternativo em uma imagem no slidingBanner", () =>{
    cy.get("[id='input-file']").selectFile(
      [
        {
          contents: "cypress/fixtures/images/default_image.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )

    cy.get("[data-cy='botaoEditar']").click()
    cy.get("[data-cy='inputAltText']").type("Teste de texto alternativo")
    cy.get("[data-cy='botaoSalvar']").click()
  })
  it("Deve remover o texto alternativo em uma imagem no slidingBanner", () =>{
    cy.get("[id='input-file']").selectFile(
      [
        {
          contents: "cypress/fixtures/images/default_image.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )

    cy.get("[data-cy='botaoEditar']").click()
    cy.get("[data-cy='inputAltText']").type("Teste de texto alternativo")
    cy.get("[data-cy='botaoSalvar']").click()

    cy.get("[data-cy='botaoEditar']").click()
    cy.get("[data-cy='inputAltText']").click().focused().clear()
    cy.get("[data-cy='botaoSalvar']").click()
  })
})

describe("Editar uma seção de informação", () =>{
  beforeEach(() =>{
    cy.visit("http://localhost:5173/home")
  })
  it("Deve adicionar uma seção de informação e ela deve permanecer ao recarregar a página", () =>{
    cy.get("[data-cy='add-info-section']").click()
    cy.get("[data-cy='info-edit-button']").click()

    cy.get("[data-cy='info-edit-title-field']").find("input").type("Teste de título da seção")
    cy.get("[data-cy='info-edit-text-field']").click().type("Teste de descrição da seção")
    cy.get("[data-cy='info-image-button']").click().selectFile(
      [
        {
          contents: "cypress/fixtures/images/default_image.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )
    cy.get("[data-cy='info-image-alt-field']").click().type("Teste de texto alternativo")
    cy.get("[data-cy='info-submit-button']").click()
    cy.reload()
  })
  it("Deve adiconar uma seção, editar seus campos e a mesma deve permanecer ao recarregar a página", () =>{
    cy.get("[data-cy='add-info-section']").click()
    cy.get("[data-cy='info-edit-button']").as('editButton').click()

    cy.get("[data-cy='info-edit-title-field']").find("input").as('titleField').type("Teste de título da seção")
    cy.get("[data-cy='info-edit-text-field']").as('textField').click().type("Teste de descrição da seção")
    cy.get("[data-cy='info-image-button']").click().selectFile(
      [
        {
          contents: "cypress/fixtures/images/default_image.png",
          fileName: "file.png",
          mimeType: "image/png"
        }
      ],
      {force: true}
    )
    cy.get("[data-cy='info-image-alt-field']").click().type("Teste de texto alternativo")
    cy.get("[data-cy='info-submit-button']").click()
    cy.get("[data-cy='edit-close-button']").click()
    
    cy.get("[data-cy='info-edit-button']").first().click()

    cy.get("[data-cy='info-edit-title-field']").find("input").as('titleField').should("be.visible").clear().type("Novo título da seção")
    cy.get("[data-cy='info-edit-text-field']").as('textField').clear().type("Nova descrição da seção")
    cy.get("[data-cy='info-submit-button']").click()
  })
})