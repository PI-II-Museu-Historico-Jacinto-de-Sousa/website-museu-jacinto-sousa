import { ThemeProvider } from "@emotion/react"
import { CssBaseline, createTheme } from "@mui/material"
import { BrowserRouter } from "react-router-dom"
import getDesignTokens from "../../../theme/theme"
import DialogAddItem from "../DialogAddItem"
import { ItemAcervo } from "../../../interfaces/ItemAcervo"
import { Colecao } from "../../../interfaces/Colecao"
import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { app } from "../../../../firebase/firebase"

const theme = createTheme(getDesignTokens('light'))

const auth = getAuth(app)

function mockColection(){

  const item1: ItemAcervo = {
    nome: "item1",
    descricao: "Descrição do item1",
    curiosidades: "Curiosidades sobre o item1",
    dataDoacao: new Date('2024-08-08'),
    colecao: "Coleção teste",
    doacao: false,
    doacaoAnonima: false,
    nomeDoador: "Tester",
    telefoneDoador: "9999-9999",
    privado: false,
    imagens: []
  }
  
  const item2: ItemAcervo = {
    nome: "item2",
    descricao: "Descrição do item2",
    curiosidades: "Curiosidades sobre o item2",
    dataDoacao: new Date('2024-08-08'),
    colecao: "Coleção teste",
    doacao: false,
    doacaoAnonima: false,
    nomeDoador: "Tester",
    telefoneDoador: "9999-9999",
    privado: false,
    imagens: []
  }
  
  const colecaoTeste: Colecao = {
    nome: "Coleção Testando",
    descricao: "Descrição da coleção teste",
    privado: false,
    itens: [item1, item2]
  }

  const mockMap = new Map<Colecao, ItemAcervo[]>()
  
  mockMap.set(colecaoTeste, [item1, item2])

  return mockMap
}

const DialogTest = () =>{
  return(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <DialogAddItem itensInicias={mockColection()} setItens={([]) =>{}} open={true}/>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe("Testando componente DialogAddItem", () =>{
  beforeEach(() =>{
    cy.loginComponent(auth, 'test@mail', 'testpassword')
  })
  it("Renderiza corretamente", () =>{
    cy.mount(<DialogTest/>)
  })
})