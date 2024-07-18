import { useEffect, useState } from "react";
import {
  atualizarInfoMuseu,
  getInfoMuseu,
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

  useEffect(() => {
    const fetchInfoMuseu = async () => {
      try {
        const info = await getInfoMuseu(id);
        setData(info);
        setStatus("success");
      } catch (_) {
        setStatus("error");
      }
    };
    fetchInfoMuseu();
  }, [id]);

  //função de update fixada no id passado
  const update = async (infoMuseu: InfoMuseu) => {
    await atualizarInfoMuseu(id, infoMuseu);
    if (data || data!.imagem != infoMuseu?.imagem) {
      setData(infoMuseu);
    }
  };

  return { status: status, infoMuseu: data, atualizarInfoMuseu: update };
};

export default useInfoMuseu;
