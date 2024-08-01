import { ItemAcervo } from "../interfaces/ItemAcervo";
import { useEffect, useState } from "react";
import { updateItemAcervo } from "../Utils/itemAcervoFirebase";
import { getItemAcervo } from "../Utils/itemAcervoFirebase";

/** Hook contendo o formulario para as informacoes de um item do acervo,
 * podendo ser usado tanto para criar como atualizar. No caso de um item ser
 * passado para o formulário, os valores default retornados serão os do item */

type Status = "loading" | "success" | "error.permission-denied" | "error.not-found";

interface useItemAcervoReturnType {
  status: string;
  itemAcervo: ItemAcervo | null;
  atualizarItemAcervo: (itemAcervo: ItemAcervo) => Promise<void>;
}

const useItemAcervo = (
  fullPath: string
): useItemAcervoReturnType => {
  const [data, setData] = useState<ItemAcervo | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    setStatus("loading");

    getItemAcervo('colecoes/' + fullPath)
      .then((itemAcervo) => {
        setData(itemAcervo);
        setStatus("success");
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "permission-denied") {
          console.log("permission-denied");
          setStatus("error.permission-denied");
        } else {
          setStatus("error.not-found");
        }
      });

    // Cleanup function (optional, depending on the implementation of getItemAcervo)
    return () => {
      // Any cleanup logic goes here if necessary
    };
  }, [fullPath]); // Dependência: o effect será chamado novamente se fullPath mudar

  // função de update fixada no id passado
  const update = (itemAcervo: ItemAcervo) => updateItemAcervo(itemAcervo, id); // Swap the arguments

  return { status, itemAcervo: data, atualizarItemAcervo: update };
}
export default useItemAcervo;
