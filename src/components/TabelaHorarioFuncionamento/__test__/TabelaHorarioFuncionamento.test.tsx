import { ThemeProvider } from "@mui/material";
import getDesignTokens from "../../../theme/theme";
import TabelaHorarioFuncionamento from "../TabelaHorarioFuncionamento";
import { auth } from "../../../../firebase/firebase";
import HorarioFucionamentoMethods from "../../../Utils/HorarioFuncionamentoFirebase";
import { Timestamp } from 'firebase/firestore';
import { Horario } from "../../../interfaces/Horario";
import dayjs from 'dayjs';

const theme = getDesignTokens('light');

const DiasHorariosFuncionamento = [
  {
    dia: 'Segunda',
    //horaInicio: Timestamp.fromDate(dayjs().set('hours', 8).set('seconds', 0).toDate()),
    horaInicio: Timestamp.fromDate(dayjs().set('hours', 8).set('minutes', 0) .toDate()),
    horaFim: Timestamp.fromDate(dayjs().set('hours', 18).set('minutes', 0).toDate())
  },
] as unknown as Horario[];

describe('Teste de renderização do componente', () => {
  HorarioFucionamentoMethods.adicionarHorarioFuncionamento(DiasHorariosFuncionamento[0]);
  it('Deve renderizar o componente sem erros', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <TabelaHorarioFuncionamento />
      </ThemeProvider>
    );
    cy.get("[data-cy='tabela-horario-funcionamento']").should('exist');
  });
});

describe('Teste de visibilidade do botão alterar', () => {
  beforeEach(() => {
    cy.loginComponent(auth, 'test@mail', 'testpassword');
    cy.mount(
      <ThemeProvider theme={theme}>
        <TabelaHorarioFuncionamento />
      </ThemeProvider>
    );
  });

  it('Deve renderizar o botão de alterar quando o usuário está logado e faz alteração na tabela', () => {
    // Seleciona a célula específica e assegura que está visível
    // Simula uma alteração na tabela
    cy.get("[data-cy='tabela-horario-funcionamento']").get('.horarios').first().scrollIntoView().dblclick();

    // Aguarda o input de edição aparecer e interage com ele
    cy.get('.horarios input')
      .should('be.visible')
      .clear({ force: true })
      .type('14:30', { force: true })
      .type('{enter}', { force: true });

    // Verifica se o botão "Alterar" aparece
    cy.get("[data-cy='botao-alterar']").should('exist');
  });

  it('Não deve renderizar o botão de alterar quando o usuário está logado e não faz alteração na tabela', () => {
    cy.get("[data-cy='botao-editar']").should('not.exist');
  });

  it('Não deve renderizar o botão de alterar quando o usuário não está logado', () => {
    // Simula um logout para este teste específico
    cy.logoutComponent(auth);

    cy.mount(
      <ThemeProvider theme={theme}>
        <TabelaHorarioFuncionamento />
      </ThemeProvider>
    );

    cy.get("[data-cy='botao-editar']").should('not.exist');
  });
});

describe('Função de alterar horários executa', () => {
  beforeEach(() => {
    cy.loginComponent(auth, 'test@mail', 'testpassword');
    cy.mount(
      <ThemeProvider theme={theme}>
        <TabelaHorarioFuncionamento />
      </ThemeProvider>
    );
  });

  it('O botão deve sumir após o click', () => {
    // Seleciona a célula específica e assegura que está visível
    // Simula uma alteração na tabela
    //cy.get("[data-cy='tabela-horario-funcionamento']").get('.MuiDataGrid-cell').first().scrollIntoView().dblclick();
    cy.get("[data-cy='tabela-horario-funcionamento']").get('.horarios').first().scrollIntoView().dblclick();

    // Aguarda o input de edição aparecer e interage com ele
    cy.get('.horarios input')
      .should('be.visible')
      .clear({ force: true })
      .type('14:30', { force: true })
      .type('{enter}', { force: true });

    // Clica no botão "Alterar"
    cy.get("[data-cy='botao-alterar']").click();

    // Verifica se o botão "Alterar" desaparece
    cy.get("[data-cy='botao-alterar']").should('not.exist');
  });
});

describe('Teste de atualização de horários', () => {
  beforeEach(() => {
    cy.loginComponent(auth, 'test@mail', 'testpassword');
    cy.mount(
      <ThemeProvider theme={theme}>
        <TabelaHorarioFuncionamento />
      </ThemeProvider>
    );
  });

  it('Deve atualizar os horários de funcionamento', () => {
    // Seleciona a célula específica e assegura que está visível
    // Simula uma alteração na tabela
    cy.get("[data-cy='tabela-horario-funcionamento']").get('.horarios').first().scrollIntoView().dblclick();

    // Aguarda o input de edição aparecer e interage com ele
    cy.get('.horarios input')
      .should('be.visible')
      .clear({ force: true })
      .type('15:00', { force: true })
      .type('{enter}', { force: true });

    // Clica no botão "Alterar"
    cy.get("[data-cy='botao-alterar']").click();

    // Verifica se o botão "Alterar" desaparece
    cy.get("[data-cy='botao-alterar']").should('not.exist');

    // Verifica se a tabela foi atualizada
    cy.get('.horarios').first().should('have.text', '15:00');
  });
});