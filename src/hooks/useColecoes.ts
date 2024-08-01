import { useEffect, useState } from "react";
import { getColecoes } from "../Utils/colecaoFirebase";
import { Colecao } from "../interfaces/Colecao";
/** Hook que retorna uma lista com nome de coleções */
const useNomeColecoes = () => {
  const [nomesColecoes, setNomescolecoes] = useState<Colecao[]>([]);
  useEffect(() => {
    getColecoes()
      .then((nomes) => {
        setNomescolecoes(nomes);
      })
      .catch(() => {
        setNomescolecoes([]);
      });
  }, []);
  return nomesColecoes;
};

export default useNomeColecoes;
