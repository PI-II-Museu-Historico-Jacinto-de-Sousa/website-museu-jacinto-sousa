import { useEffect, useState } from "react";
import { getNomesColecoes } from "../Utils/colecaoFirebase";

/** Hook que retorna uma lista com nome de coleções */
const useNomeColecoes = () => {
  const [nomesColecoes, setNomescolecoes] = useState<string[]>([]);
  useEffect(() => {
    getNomesColecoes()
      .then((nomes) => {
        setNomescolecoes(nomes);
      })
      .catch((error) => {
        console.error(error);
        setNomescolecoes([]);
      });
  });
  return nomesColecoes;
};

export default useNomeColecoes;
