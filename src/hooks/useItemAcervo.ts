import { getItemAcervo } from "../Utils/itemAcervoFirebase";
import { useForm } from "react-hook-form";
import { ItemAcervo } from "../interfaces/ItemAcervo";

const useItemAcervo = async (id: string) => {
  const defaultValues = {nome: "", descricao: "", curiosidades: "", dataDoacao: "", privado: false, colecao: "", imagens: null, error: null}
  const { data: itemData , error: itemError } = await getItemAcervo(id);
  const { register, watch, setError, control, handleSubmit, formState, reset } =
    useForm<ItemAcervo>({
      defaultValues: { ...defaultValues },
    });
    console.log(itemError)
    console.log(itemData)
  return {
    data: itemData || defaultValues,
    error: itemError,
  };
};

export default useItemAcervo;
