import { useForm } from "react-hook-form";

/** Hook contendo o formulario para as informacoes de um item do acervo, podendo ser usado tanto para criar como atualizar. No caso de um item ser passado para o formulário, os valores default retornados serão os do item */
const useLoginForm = () => {

  const { register, watch, setError, control, handleSubmit, formState, reset  } = useForm();

  return {
    setError,
    register,
    watch,
    control,
    handleSubmit,
    reset,
    formState,
  };
};

export default useLoginForm;