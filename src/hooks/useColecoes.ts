import { useEffect, useState } from "react";
import { ClientColecoesFirebase } from "../Utils/colecaoFirebase";
import { Colecao } from "../interfaces/Colecao";
/** Hook que retorna uma lista com nome de coleções */
const useNomeColecoes = () => {
  const [nomesColecoes, setNomescolecoes] = useState<Omit<Colecao, "itens">[]>(
    []
  );
  const client = new ClientColecoesFirebase();
  useEffect(() => {
    client
      .getColecoes()
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
