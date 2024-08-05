import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Horario } from "../interfaces/Horario";
import { getDocs } from "firebase/firestore";
import dayjs from "dayjs";

const getHorarioFuncionamento = async (): Promise<Horario[]> => {
  try {
    const horariosCollection = collection(db, "HorarioFuncionamento");
    const horarios = await getDocs(horariosCollection);
    return horarios.docs.map((doc) => {
      const data = doc.data();
      return {
        dia: data.dia,
        horaInicio: dayjs(data.horaInicio?.toDate()),
        horaFim: dayjs(data.horaFim?.toDate())
      } as Horario;
    }) as Horario[]; // Explicit type assertion to Horario[]
  } catch (error) {
    throw new Error("Erro ao buscar horário de funcionamento");
  }
}

// Função para atualizar os horários de funcionamento com base no campo 'dia'
const updateHorarioFuncionamento = async (horarios: Horario[]): Promise<void> => {
  try {
    // Obter todos os documentos da coleção
    const horariosCollection = collection(db, "HorarioFuncionamento");
    const existingHorariosSnapshot = await getDocs(horariosCollection);

    // Mapear os documentos existentes por dia
    const existingHorarios = new Map();
    existingHorariosSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      existingHorarios.set(data.dia, doc.id);
    });

    // Atualizar os documentos correspondentes
    const updatePromises = horarios.map(async (horario) => {
      const docId = existingHorarios.get(horario.dia);
      if (docId) {
        const horarioDocRef = doc(db, "HorarioFuncionamento", docId);
        await updateDoc(horarioDocRef, {
          horaInicio: Timestamp.fromDate(horario?.horaInicio?.toDate()),
          horaFim: Timestamp.fromDate(horario?.horaFim?.toDate())
        });
      }
    });

    await Promise.all(updatePromises);
  } catch (error) {
    throw new Error("Erro ao atualizar horário de funcionamento");
  }
}

const adicionarHorarioFuncionamento = async (horario: Horario): Promise<void> => {
  try {
    console.log(horario);
    const horariosCollection = collection(db, "HorarioFuncionamento");
    console.log(horario.horaInicio);
    console.log(Timestamp.fromDate(horario?.horaInicio?.toDate()));
    await addDoc(horariosCollection, {
      dia: horario.dia,
      horaInicio: Timestamp.fromDate(horario?.horaInicio?.toDate()),
      horaFim: Timestamp.fromDate(horario?.horaFim?.toDate()),
    });
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao adicionar horário de funcionamento");
  }
}


const HorarioFucionamentoMethods = {
  getHorarioFuncionamento,
  updateHorarioFuncionamento,
  adicionarHorarioFuncionamento,
}

export default HorarioFucionamentoMethods;