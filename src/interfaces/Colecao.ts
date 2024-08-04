import { ItemAcervo } from "./ItemAcervo";

export interface Colecao {
  id?: string;
  nome: string;
  descricao: string;
  privado: boolean;
  itens: ItemAcervo[];
}

export type ColecaoCreate = {
  nome: string;
  descricao: string;
  privado: boolean;
};
