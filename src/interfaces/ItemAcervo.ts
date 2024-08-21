import { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";
import Imagem from "./Imagem";

export interface ItemAcervo {
  id?: string;
  nome: string;
  descricao: string;
  curiosidades: string;
  dataDoacao: Date | Dayjs | null | Timestamp; /* DatePicker utilizam Dayjs, Timestamp
  é do Firebase para facilitar a parte update das datas
  */
  colecao: string;
  doacao: boolean;
  doacaoAnonima: boolean;
  nomeDoador: string;
  telefoneDoador: string;
  privado: boolean;
  imagens: Imagem[];
}
