import { ItemAcervo } from "../interfaces/ItemAcervo";
import { useState } from "react";
import {subscribeItemAcervo, updateItemAcervo} from "../Utils/itemAcervoFirebase";

/** Hook contendo o formulario para as informacoes de um item do acervo,
 * podendo ser usado tanto para criar como atualizar. No caso de um item ser
 * passado para o formulário, os valores default retornados serão os do item */

type Status = "loading" | "success" | "error.permission-denied" | "error.not-found";

interface useItemAcervoReturnType {
  status: Status;
  itemAcervo: ItemAcervo | null;
  atualizarItemAcervo: (itemAcervo: ItemAcervo) => Promise<void>;
}

const useItemAcervo = (
  id: string
): useItemAcervoReturnType => {
  const [data, setData] = useState<ItemAcervo | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const unsubscribe = subscribeItemAcervo(id??'', data, setData, setStatus);

  if (status === "error.not-found" || status === 'error.permission-denied' || status === "success") {
    unsubscribe();
  }
  // função de update fixada no id passado
  const update = (itemAcervo: ItemAcervo) => updateItemAcervo(itemAcervo, id); // Swap the arguments

  return { status: status, itemAcervo: data, atualizarItemAcervo: update };
}
export default useItemAcervo;
