import { FormState, useForm, Control, UseFormRegister } from 'react-hook-form';
import { InfoMuseu } from '../interfaces/InfoMuseu';

export default function useInfoMuseuForm(defaultValues: InfoMuseu): {
  register: UseFormRegister<InfoMuseu>;
  control: Control<InfoMuseu>;
  handleSubmit: <T>(callback: (data: InfoMuseu) => Promise<void>) => (event: React.SyntheticEvent) => void;
  formState: FormState<InfoMuseu>;
} {
  const { register, control, handleSubmit, formState } = useForm<InfoMuseu>({ defaultValues });

  return { register, control, handleSubmit, formState };
}
