import { useEffect } from "react";
import {
  Control,
  FormState,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { InfoMuseu } from "../interfaces/InfoMuseu";

type Status = "loading" | "success" | "error";

interface InfoMuseuFormReturnType {
  register: UseFormRegister<InfoMuseu>;
  control: Control<InfoMuseu>;
  handleSubmit: UseFormHandleSubmit<InfoMuseu, undefined>;
  formState: FormState<InfoMuseu>;
  watch: UseFormWatch<InfoMuseu>;
  setValue: UseFormSetValue<InfoMuseu>;
  reset: UseFormReset<InfoMuseu>;
  resetField: UseFormResetField<InfoMuseu>;
}

const useInfoMuseuForm = (
  infoMuseu?: InfoMuseu,
  loaded?: Status
): InfoMuseuFormReturnType => {
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    setValue,
    reset,
    resetField,
  } = useForm<InfoMuseu>({
    defaultValues: { nome: "", texto: "" },
  });
  //necessário utilizar useEffect por que o valor de
  //defaultValues fica como cache após a primeira renderização
  //adicionar infoMuseu como dependência do useEffect causa uma atualização infinita
  useEffect(() => {
    reset(infoMuseu ? infoMuseu : { nome: "", texto: "" });
  }, [loaded]);

  return {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    setValue,
    reset,
    resetField,
  };
};

export default useInfoMuseuForm;
