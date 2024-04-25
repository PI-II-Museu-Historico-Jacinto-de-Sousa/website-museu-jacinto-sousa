import { Dayjs } from "dayjs";

export interface ItemAcervo {
  id?: string;
  nome: string;
  descricao: string;
  curiosidades: string;
  dataDoacao: Date | Dayjs | null; // DatePicker utilizam Dayjs
  colecao: string;
  doacao: boolean;
  doacaoAnonima: boolean;
  nomeDoador: string;
  telefoneDoador: string;
  privado: boolean;
  imagens: string[];
}
