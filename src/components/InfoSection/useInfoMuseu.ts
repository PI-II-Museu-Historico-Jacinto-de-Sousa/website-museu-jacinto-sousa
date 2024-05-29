import { useState } from "react";
import {
  atualizarInfoMuseu,
  subscribeInfoMuseu,
} from "../../Utils/infoMuseuFirebase";
import { InfoMuseu } from "../../interfaces/InfoMuseu";

type Status = "loading" | "success" | "error";

type useInfoSectionReturnType = {
  status: Status;
  infoMuseu: InfoMuseu | null;
  atualizarInfoMuseu: (info: InfoMuseu) => Promise<void>;
};

/**
 * hook que retorna uma informação do museu junto do callback para atualizar ela
 * @param id
 * @returns infoMuseu com o id respectivo e a função atualizar fixada para o id passado
 */
const useInfoMuseu = (id: string): useInfoSectionReturnType => {
  const [data, setData] = useState<InfoMuseu | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const unsubscribe = subscribeInfoMuseu(id, data, setData, setStatus);

  if (status === "error" || status === "success") {
    unsubscribe();
  }
  //função de update fixada no id passado
  const update = atualizarInfoMuseu.bind(null, id);

  return { status: status, infoMuseu: data, atualizarInfoMuseu: update };
};

export default useInfoMuseu;
