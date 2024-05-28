import { useForm } from "react-hook-form";
import { ItemAcervo } from "../interfaces/ItemAcervo";

/** Hook contendo o formulario para as informacoes de um item do acervo, podendo ser usado tanto para criar como atualizar. No caso de um item ser passado para o formulário, os valores default retornados serão os do item */
const useFormItemAcervo = (itemAcervo?: ItemAcervo) => {
  const defaultValues = itemAcervo || {
    doacao: true,
    doacaoAnonima: false,
    privado: false,
    colecao: "",
    telefoneDoador: "",
    nome: "",
    descricao: "",
    curiosidades: "",
  };
  const { register, watch, setError, control, handleSubmit, formState, reset, setValue } =
    useForm<ItemAcervo>({
      defaultValues: { ...defaultValues },
    });
  return {
    register,
    watch,
    setError,
    control,
    handleSubmit,
    formState,
    reset,
    setValue,
  };
};

export default useFormItemAcervo;
