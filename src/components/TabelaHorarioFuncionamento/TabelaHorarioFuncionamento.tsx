import { styled, Theme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRowModel, GridRowsProp } from '@mui/x-data-grid';
import HorarioFucionamentoMethods from '../../Utils/HorarioFuncionamentoFireBase.ts';
import { useState, useEffect } from "react";
import { Horario } from "../../interfaces/Horario.ts";
import { auth } from "../../../firebase/firebase";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const TabelaHorarioFuncionamento = () => {
  const [logged, setLogged] = useState<boolean>(false);

  const [data, setData] = useState<Horario[]>([]);

  const [changesMade, setChangesMade] = useState<boolean>(false);

  const [tempData, setTempData] = useState<Horario[]>([]);

  const ordemDiasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const diasDaSemana = data.map(horario => horario.dia);

  const diasOrdenados = ordemDiasDaSemana.filter(dia => diasDaSemana.includes(dia));

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLogged(true)
      } else {
        setLogged(false)
      }
    })
  }, [])


  const handleProcessRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      setTempData(prev => prev.map(item => {
        if(newRow.id === 'horaInicio') {
          if(item.dia === 'Segunda') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Segunda.split(':')[0], newRow.Segunda.split(':')[1])),
            }
          }
          if(item.dia === 'Terça') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Terça.split(':')[0], newRow.Terça.split(':')[1])),
            }
          }
          if(item.dia === 'Quarta') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Quarta.split(':')[0], newRow.Quarta.split(':')[1])),
            }
          }
          if(item.dia === 'Quinta') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Quinta.split(':')[0], newRow.Quinta.split(':')[1])),
            }
          }
          if(item.dia === 'Sexta') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Sexta.split(':')[0], newRow.Sexta.split(':')[1])),
            }
          }
          if(item.dia === 'Sábado') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Sábado.split(':')[0], newRow.Sábado.split(':')[1])),
            }
          }
          if(item.dia === 'Domingo') {
            return {
              ...item,
              horaInicio: dayjs(item.horaInicio?.$d.setHours(newRow.Domingo.split(':')[0], newRow.Domingo.split(':')[1]))
            }
          }
        } else {
          if(item.dia === 'Segunda') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Segunda.split(':')[0], newRow.Segunda.split(':')[1])),
            }
          }
          if(item.dia === 'Terça') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Terça.split(':')[0], newRow.Terça.split(':')[1])),
            }
          }
          if(item.dia === 'Quarta') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Quarta.split(':')[0], newRow.Quarta.split(':')[1])),
            }
          }
          if(item.dia === 'Quinta') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Quinta.split(':')[0], newRow.Quinta.split(':')[1])),
            }
          }
          if(item.dia === 'Sexta') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Sexta.split(':')[0], newRow.Sexta.split(':')[1])),
            }
          }
          if(item.dia === 'Sábado') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Sábado.split(':')[0], newRow.Sábado.split(':')[1])),
            }
          }
          if(item.dia === 'Domingo') {
            return {
              ...item,
              horaFim: dayjs(item.horaFim?.$d.setHours(newRow.Domingo.split(':')[0], newRow.Domingo.split(':')[1]))
            }
          }
        }
        return item;
      }));
    }
    setChangesMade(true);
    return newRow;
  };



  useEffect(() => {
    HorarioFucionamentoMethods.getHorarioFuncionamento().then((horarios) => {
      setData(horarios);
      setTempData(horarios); // Inicializa tempData com os dados originais
    })
  }, [])

  const columns: GridColDef[] = [
    ...diasOrdenados.map((dia) => ({
      field: dia,
      headerName: dia,
      editable: logged ? true : false,
    }))
  ];

  const atualizarHorarios = async () => {
    try {
      await HorarioFucionamentoMethods.updateHorarioFuncionamento(tempData);
      setChangesMade(false);
      const horariosAtualizados = await HorarioFucionamentoMethods.getHorarioFuncionamento();
      setData(horariosAtualizados);
      setTempData(horariosAtualizados); // Atualiza tempData com os novos dados
    } catch (error) {
      throw new Error("Erro ao atualizar horário de funcionamento");
    }
   setChangesMade(false);
  }

  const rows: GridRowsProp = [
    {
      id: 'horaInicio',
      className: 'horarios',
      ...Object.fromEntries(data.map(horario => [
        horario.dia,
        horario.horaInicio ? dayjs(horario.horaInicio.toDate()).format('HH:mm') : '',
      ])),
    },
    {
      id: 'horaFim',
      className: 'horarios',
      ...Object.fromEntries(data.map(horario => [
        horario.dia,
        horario.horaFim ? dayjs(horario.horaFim.toDate()).format('HH:mm') : '',
      ])),
    }
  ];

  return (
    <>
      <Container spacing={4} >
        <Typography variant="displaySmall">Horário de Funcionamento</Typography>
        <TabelaHorarios
          data-cy="tabela-horario-funcionamento"
          rows={rows}
          columns={columns}
          autoHeight
          processRowUpdate={handleProcessRowUpdate}
          getRowClassName={(params) => params.row.className}
        />
        {
          logged && changesMade && (
            <BotaoEditar onClick={() => atualizarHorarios()} data-cy="botao-alterar" >Alterar</BotaoEditar>
          )
        }
      </Container>
    </>
  )
}

const Container = styled(Stack)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  padding: `${theme.spacing(0)} ${theme.spacing(0.5)}`,
  flexDirection: 'column',
  alignItems: 'center',
}))

const TabelaHorarios = styled(DataGrid)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',

  '& .horarios': {
    backgroundColor: theme.palette.primaryContainer.main,
  },
}))

const BotaoEditar = styled(Button)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.onPrimary.main,
  padding: theme.spacing(1),
  borderRadius: '100px',
}))

export default TabelaHorarioFuncionamento;