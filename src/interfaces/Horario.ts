import { Dayjs } from "dayjs";

export interface Horario {
  dia: string;
  horaInicio: Dayjs | Date | null;
  horaFim: Dayjs | Date | null;
}