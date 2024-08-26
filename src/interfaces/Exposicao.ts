import Imagem from "./Imagem";
import { ItemAcervo } from "./ItemAcervo";
interface Exposicao {
  id?: string;
  nome: string;
  descricao?: string;
  privado: boolean;
  permanente: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  itensPorColecao: Map<string, Array<string | ItemAcervo>>; //mapeando os itens ou a lista de ids para cada colecao,
  imagem?: Imagem;
  readonly dataCriacao: Date;
}

export default Exposicao;
