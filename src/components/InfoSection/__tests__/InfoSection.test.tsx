import { ThemeProvider, createTheme } from "@mui/material"
import { auth } from "../../../../firebase/firebase"
import { adicionarInfoMuseu } from "../../../Utils/infoMuseuFirebase"
import getDesignTokens from "../../../theme/theme"
import InfoSection from "../InfoSection"

const theme = createTheme(getDesignTokens('light'))
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/

Cypress.on('uncaught:exception', (err) => {
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false
  }
})

// adicionando dados de teste programaticamente em cada conjunto de testes
const addInfoWithImage = async (imagemBase64: string): Promise<string> => {
  let id = ""
  //convertendo base64 para File
  const response = await fetch(`data:image/jpeg;base64,${imagemBase64}`);
  const file = new File([await response.blob()], "default_image.png", { type: "image/png" });
  const infoComImagem = {
    nome: "Teste",
    texto: "Teste",
    imagem: {
      src: file,
      alt: "",
      title: "",
    }
  }
  id = await adicionarInfoMuseu(infoComImagem)
  return id
}

const addInfoWithoutImage = async (): Promise<string> => {
  const infoSemImagem = {
    nome: "Teste",
    texto: "Teste",
  }
  const id = await adicionarInfoMuseu(infoSemImagem)
  return id
}

describe("Testando componente InfoSection", () => {

  describe("Renderização do componente", () => {
    // before em todos os testes segue o mesmo processo: adicionar dois itens, um com imagem e outro sem
    // depois de adicionar, o usuário é deslogado
    let idComImagem: string, idSemImagem: string
    before(() => {
      cy.loginComponent(auth, "test@mail", "testpassword").then(() => {
        cy.fixture("images/default_image.png").then(async (fileContent) => {
          idComImagem = await addInfoWithImage(fileContent)
        }).then(async () => {
          idSemImagem = await addInfoWithoutImage()
        }).then(() => {
          cy.logoutComponent(auth)
        })
      })
    })
    it("Deve renderizar o componente normalmente com item válido e com imagem ", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idComImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-title']").should("exist")
      cy.get("[data-cy='info-text']").should("exist")
      cy.get("[data-cy='info-image']").should("exist")
    })
    it("Deve renderizar o componente normalmente com item válido e sem imagem", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idSemImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-title']").should("exist")
      cy.get("[data-cy='info-text']").should("exist")
    })
    it("Deve renderizar erro com id inválido", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id='-1' />
        </ThemeProvider>)
      cy.get("[data-cy='info-error-title']").should("exist")
    })
    describe("Visualização mobile", () => {
      before(() => {
        cy.viewport("samsung-s10")
      })
      it("Deve renderizar conteúdo em uma coluna", () => {
        cy.mount(
          <ThemeProvider theme={theme}>
            <InfoSection id={idComImagem} />
          </ThemeProvider>
        )
        cy.get("section").should("have.css", "flex-direction", "column-reverse")
      })
    })

    describe("Visualização desktop", () => {
      before(() => {
        cy.viewport(1366, 768)
      })

      it("deve renderizar imagem ao lado do texto", () => {
        cy.mount(
          <ThemeProvider theme={theme}>
            <InfoSection id={idComImagem} />
          </ThemeProvider>
        )
        cy.get("[data-cy='info-title']").should("exist")
        cy.get("section").children().then(($children) => {
          const firstChildTop = $children.first().position().top;

          // verificando se todas as divs estão na mesma linha
          $children.each((_, child) => {
            expect(Cypress.$(child).position().top).to.eq(firstChildTop);
          });
        })
      })
    })
  })

  describe("Interação usuário não logado", () => {
    let idSemImagem: string
    before(() => {
      cy.loginComponent(auth, "test@mail", "testpassword").then(async () => {
        idSemImagem = await addInfoWithoutImage()
      }).then(() => {
        cy.logoutComponent(auth)
      })
    })
    it("Não deve permitir edição", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idSemImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-title']").should("exist")
      cy.get("[data-cy='info-edit-button']").should("not.exist")
    })
  })

  describe("Interação usuário logado", () => {
    let idComImagem: string, idSemImagem: string
    before(() => {
      cy.loginComponent(auth, "test@mail", "testpassword").then(() => {
        cy.fixture("images/default_image.png").then(async (fileContent) => {
          idComImagem = await addInfoWithImage(fileContent)
        }).then(async () => {
          idSemImagem = await addInfoWithoutImage()
        })
      })
    })
    it("Deve permitir edição do título", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idSemImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-edit-button']").click().then(() => {
        cy.get("[data-cy='info-title']").should("not.exist")

        cy.get("[data-cy='info-edit-title-field']").should("exist").find('input').clear().then(() => {
          cy.get("[data-cy='info-edit-title-field']").type("Teste de edição")
        })

        cy.get("[data-cy='info-submit-button']").click().then(() => {
          cy.get("[data-cy='info-title']").should("exist")
          cy.get("[data-cy='info-title']").contains("Teste de edição")
        })
      })
    })

    it("Deve permitir edição do texto", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idSemImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-edit-button']").click().then(() => {
        cy.get("[data-cy='info-text']").should("not.exist")

        cy.get("[data-cy='info-edit-text-field']").should("exist").click().find('textarea').first().clear().then(() => {
          cy.get("[data-cy='info-edit-text-field']").type("Teste de edição")
        })

        cy.get("[data-cy='info-submit-button']").click().then(() => {
          cy.get("[data-cy='info-text']").should("exist")
          cy.get("[data-cy='info-text']").contains("Teste de edição")
        })
      })
    })

    it("Deve permitir alteração da imagem", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idComImagem} />
        </ThemeProvider>
      )
      cy.fixture("images/default_image_copy.png").as("defaultImageCopy");
      cy.get("[data-cy='info-edit-button']").click().then(() => {
        cy.get("[data-cy='info-image']").should("exist").then(($image) => {
          const src = $image.attr("src")
          cy.get("[data-cy='info-image-button']").selectFile("@defaultImageCopy").then(() => {
            cy.get("[data-cy='info-submit-button']").click().then(() => {
              cy.get("[data-cy='info-title']").should("exist").then(() => {
                cy.get("[data-cy='info-image']").should("exist").should("have.attr", "src").should("not.eq", src)
              })
            })
          })
        })
      })
    })
    it("Deve permitir alteração do texto alternativo", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idComImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-edit-button']").click().then(() => {
        cy.get("[data-cy='info-image']").should("exist")
        cy.get("[data-cy='info-image-alt-field']").should("exist").click().find('input').clear().type("Texto alternativo")
        cy.get("[data-cy='info-submit-button']").click().then(() => {
          cy.get("[data-cy='info-title']").should("exist")
          cy.get("[data-cy='info-image']").should("exist").should("have.attr", "alt", "Texto alternativo")
        })
      })
    })
    it("Deve permitir remoção da imagem", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idComImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-edit-button']").click().then(() => {
        cy.get("[data-cy='info-image']").should("exist")
        cy.get("[data-cy='info-image-remove-button']").click().then(() => {
          cy.get("[data-cy='info-image']").should("not.exist")
        })
      })
    })

    it("Deve manter o mesmo conteúdo ao cancelar a edição", () => {
      cy.mount(
        <ThemeProvider theme={theme}>
          <InfoSection id={idSemImagem} />
        </ThemeProvider>
      )
      cy.get("[data-cy='info-text']").should("exist").then(($infoTextSpan) => {
        const previousText = $infoTextSpan.text()
        cy.get("[data-cy='info-edit-button']").click().then(() => {
          cy.get("[data-cy='info-text']").should("not.exist")
          cy.get("[data-cy='info-edit-text-field']").should("exist").click().find('textarea').first().clear().type(previousText + ' editado')

          cy.get("[data-cy='info-cancel-button']").click().then(() => {
            cy.get("[data-cy='info-text']").should("exist")
            cy.get("[data-cy='info-text']").invoke("text").should("equal", previousText)
          })
        })
      })
    })
  })
})
