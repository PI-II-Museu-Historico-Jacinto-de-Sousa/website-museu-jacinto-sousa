import { Colecao } from "../interfaces/Colecao";
import { ItemAcervo } from "../interfaces/ItemAcervo";
import { adicionarItemAcervo, getItemAcervo, updateItemAcervo, deleteItemAcervo } from "../Utils/itemAcervoFirebase";

/*
- Atualizar precisa comparar imagens com File e imagens com strings
- strings já incluem o caminho completo pro storage, e pro firestore
- id da coleção em vez do nome
- updateDoc não precisa ser executado junto de setDoc
- Retornar o novo id do item

*/
const Home = () => {
  const colecao = {
    id: "/colecoes/publico/lista/xr0gTwGsafGllvoMkT1c",
    nome: "Teste",
    privado: false,
  } as Colecao
  return (
    <div style={{ padding: "20px" }}>
      <input type="file" id="file" multiple />
      <button onClick={async () => {
        const input = document.getElementById('file') as HTMLInputElement;
        const files = input?.files;
        const imagens = Array.from(files || []).map(file => {
          return {
            title: file?.name,
            alt: "Imagem",
            src: file
          } as Imagem
        })
        const ItemAcervo = {
          dataDoacao: new Date(),
          descricao: "Descrição",
          colecao: "Item doméstico",
          nome: "Nome",
          curiosidades: "Curiosidades",
          privado: false,
          imagens: imagens
        } as ItemAcervo

        await adicionarItemAcervo(ItemAcervo, colecao).then((docRef) => {
          console.log("docRef", docRef)
        })
      }}>Adicionar</button>
      <button onClick={async () => {
        console.log(await getItemAcervo("colecoes/publico/lista/Teste/publico/E2skrEPGcGlPGKLIXqdK"))
      }}>Buscar</button>
      <button onClick={async () => {
        const imagensMantidas = [
          {
            title: "images/delete.png",
            alt: "Imagem",
            src: "src"
          },
        ]
        const input = document.getElementById('file') as HTMLInputElement;
        const files = input?.files;
        const imagensAdicionadas = Array.from(files || []).map(file => {
          return {
            title: file?.name,
            alt: "Imagem",
            src: file
          } as Imagem
        })
        const ItemAcervoAtualizado = {
          id: "colecoes/publico/lista/xr0gTwGsafGllvoMkT1c/publico/RMBR0Qdxu11qwRb5voRW",
          dataDoacao: new Date(),
          descricao: "Descrição",
          colecao: "Item doméstico",
          nome: "Nome",
          curiosidades: "Curiosidades",
          privado: true,
          imagens: [...imagensMantidas, ...imagensAdicionadas],
          doacao: false,
          doacaoAnonima: true,
          nomeDoador: "",
          telefoneDoador: ""
        } as ItemAcervo
        await updateItemAcervo(ItemAcervoAtualizado, colecao)
      }
      }>
        Editar mudando a privacidade
      </button>

      <button onClick={async () => {
        await deleteItemAcervo("/colecoes/publico/lista/xr0gTwGsafGllvoMkT1c/privado/RMBR0Qdxu11qwRb5voRW")
      }}>Remover</button>
    </div>
  )
}

export default Home
