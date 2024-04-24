import ImageCard from "../ImageCard"
import getDesignTokens from "../../../theme/theme"
import { ThemeProvider, createTheme } from "@mui/material"

const mockFunctions = {
  onClose: () => { }
}
const theme = createTheme(getDesignTokens('light'))


describe("Testando componente ImageCard", () => {
  it("renderiza a imagem quando o arquivo é válido", () => {
    cy.fixture('images/default_image.png').then((imageBase64) => {
      const file = new File([imageBase64], 'default_image.png', { type: 'image/png' })
      const image = {
        src: file,
        title: 'default_image.png',
        alt: ''
      }
      cy.mount(<ThemeProvider theme={theme}>
        <ImageCard image={image} onClose={() => { }} />
      </ThemeProvider>)
      cy.get("img").should('exist').should('have.attr', 'src')
    })
  })
  it("renderiza a imagem quando a string é válida", () => {
    cy.fixture('images/default_image.png').then((imageBase64) => {
      const file = new File([imageBase64], 'default_image.png', { type: 'image/png' })
      const url = URL.createObjectURL(file)
      const image = {
        src: url,
        title: 'default_image.png',
        alt: ''
      }
      cy.mount(<ThemeProvider theme={theme}>
        <ImageCard image={image} onClose={() => { }} />
      </ThemeProvider>)
      cy.get("img").should('exist').should('have.attr', 'src', url)
    })
  })
  it("renderiza mensagem de erro quando a imagem é inválida", () => {
    const invalidImage = {
      src: 'invalid_image',
      title: 'invalid_image',
      alt: ''
    }
    cy.mount(<ThemeProvider theme={theme}>
      <ImageCard image={invalidImage} onClose={() => { }} />
    </ThemeProvider>)
    cy.get("[data-cy='image-card-header']").should('exist').should('have.text', 'Falha ao carregar imagem')
  })
  it("Altera o texto alternativo de uma imagem", () => {
    cy.fixture('images/default_image.png').then((imageBase64) => {
      const file = new File([imageBase64], 'default_image.png', { type: 'image/png' })
      const url = URL.createObjectURL(file)
      const image = {
        src: url,
        title: 'default_image.png',
        alt: ""
      }
      cy.mount(<ThemeProvider theme={theme}>
        <ImageCard image={image} onClose={() => { }} />
      </ThemeProvider>)

      cy.get("[data-cy='image-card-edit-button']").click()
      cy.get("[data-cy='image-card-edit-textfield']").type('Texto alternativo')
      cy.get("[data-cy='image-card-edit-button']").click()

      cy.get("[data-cy='image-card-text']").should('have.text', 'Texto alternativo')
    })
  })

  it("Chama a função onClose ao clicar no botão de remover", () => {
    cy.fixture('images/default_image.png').then((imageBase64) => {
      const file = new File([imageBase64], 'default_image.png', { type: 'image/png' })
      const image = {
        src: file,
        title: 'default_image.png',
        alt: ''
      }
      cy.spy(mockFunctions, 'onClose')

      cy.mount(<ThemeProvider theme={theme}>
        <ImageCard image={image} onClose={mockFunctions.onClose} />
      </ThemeProvider>)

      cy.get("[data-cy=image-card-remove-button").click().then(() => {
        expect(mockFunctions.onClose).to.be.called
      })
    })
  })
}
)
