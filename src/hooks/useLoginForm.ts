import { useEffect } from "react";
import { useForm } from "react-hook-form";

/** Hook contendo o formulario para as informacoes de um item do acervo, podendo ser usado tanto para criar como atualizar. No caso de um item ser passado para o formulário, os valores default retornados serão os do item */
const useLoginForm = (email?: string, senha?: string) => {

  const defaultValues = {
    email: email,
    senha: senha,
    emailRedefinicaoSenha: "",
  } || {
    email: "",
    senha: "",
    emailRedefinicaoSenha: "",
  }

  const { register, watch, setError, control, handleSubmit, formState, reset } =
    useForm({
      defaultValues: { ...defaultValues },
    });

    useEffect(() => {
      reset({ email: email, senha: senha, emailRedefinicaoSenha: ""});
    }, [email, senha]);

  return {
    register,
    watch,
    setError,
    control,
    handleSubmit,
    formState,
    reset,
  };
};

export default useLoginForm;