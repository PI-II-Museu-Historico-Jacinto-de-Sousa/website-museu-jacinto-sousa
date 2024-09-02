import { useForm } from "react-hook-form";
import Exposicao from "../interfaces/Exposicao";

/** Hook contendo o formulario para as informacoes de um item do acervo, podendo ser usado tanto para criar como atualizar. No caso de um item ser passado para o formulário, os valores default retornados serão os do item */
const useExposicao = (exposicao?: Exposicao) => {
  const defaultValues = exposicao || {
      nome: "",
      descricao: "",
      privado: true,
      permanente: true,
      imagem: { src: "", title: "", alt: "" },
      itensPorColecao: new Map<string, Array<[string, Exposicao]>>(),
      dataCriacao: new Date()
  };
  const {
    register,
    watch,
    setError,
    control,
    handleSubmit,
    formState,
    reset,
    setValue,
  } = useForm<Exposicao>({
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

export default useExposicao;
