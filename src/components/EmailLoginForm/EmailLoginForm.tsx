import React, { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled, Theme } from "@mui/material/styles";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Tooltip from '@mui/material/Tooltip';
import useLoginForm from '../../hooks/useLoginForm'
import { Controller, SubmitHandler } from "react-hook-form";

const EmailLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar se a senha está visível
    const [buttonClicked, setButtonClicked] = useState(false); // Estado para controlar se o botão foi clicado
    const [dialogOpen, setDialogOpen] = useState(false);
    const { register, watch, control, handleSubmit, reset } = useLoginForm();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
      setDialogOpen(false);
    };

    const watchEmail = watch('email');
    const watchSenha = watch('senha');
    const watchEmailRedefinicaoSenha = watch('emailRedefinicaoSenha');

    const submitForm: SubmitHandler<{ email: string | undefined, senha: string | undefined, emailRedefinicaoSenha: string }> = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email!, data.senha!);
        } catch (error) {
            throw new Error('Erro ao fazer login');
        }
    }

    useEffect(() => {
      if (!dialogOpen) {
          reset({ emailRedefinicaoSenha: '' });
      }
  }, [dialogOpen, reset]);


    const handlePasswordReset: SubmitHandler<{ emailRedefinicaoSenha: string }> = async (data) => {
        try {
            await sendPasswordResetEmail(auth, data.emailRedefinicaoSenha);
            closeDialog();
        } catch (error) {
            throw new Error('Erro ao enviar email de redefinição de senha');
        }
    }

    return (
        <>
            <Formulario
            data-cy='email-login-form'
            onSubmit={handleSubmit(submitForm)}
            >
                {/* Aqui você pode adicionar qualquer conteúdo que deseja exibir acima do formulário */}
                <Controller
                    control={control}
                    {...register('email')}
                    render={({ field }) => (
                        <Dados
                            {...field}
                            type='email'
                            placeholder='Email'
                            data-cy='email'
                            className={buttonClicked && !watchEmail ? 'highlight' : ''}
                        />
                    )}
                />
                {/* Campo da senha que oculta e mostra dependendo da voltade e image no final*/}
                <Controller
                    control={control}
                    {...register('senha')}
                    render={({ field }) => (
                        <Dados
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Senha"
                            data-cy='password'
                            className={buttonClicked && !watchSenha ? 'highlight' : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <AbrirDialog variant='bodyMedium' onClick={openDialog}>Esqueceu sua senha?</AbrirDialog>
                <Tooltip
                  title="Preencha ambos os campos"
                  disableHoverListener={!!watchEmail && !!watchSenha}
                  data-cy='tooltipCamposVazios'
                >
                    <span>
                      <BotaoEntrar
                          type="submit"
                          disabled={!watchEmail || !watchSenha}
                          onClick={() => {
                              setButtonClicked(true);
                          }}
                          data-cy='botaoEntrar'
                          onFocus={() => setButtonClicked(true)}
                      >
                          Entrar
                      </BotaoEntrar>
                    </span>
                </Tooltip>
            </Formulario>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                {/* Aqui você pode adicionar qualquer conteúdo que deseja exibir dentro do diálogo */}
                <Formulario onSubmit={handleSubmit(handlePasswordReset)}>
                    <Controller
                        control={control}
                        {...register('emailRedefinicaoSenha')}
                        render={({ field }) => (
                            <Dados
                                {...field}
                                type='email'
                                placeholder='Email'
                                data-cy='emailRedefinicaoSenha'
                            />
                        )}
                    />
                    <SecaoBotao>
                      <BotaoCancelar onClick={closeDialog}>Cancelar</BotaoCancelar>
                      <BotaoEntrar
                        type='submit'
                        data-cy='botaoEnviarEmailRedefinicaoSenha'
                        disabled={!watchEmailRedefinicaoSenha}
                      >
                          Enviar
                      </BotaoEntrar>
                    </SecaoBotao>
                </Formulario>
            </Dialog>
        </>
    );
}

//Estilização dos componentes

const Formulario = styled('form')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  width: '577px',
  padding: 'var(--Content-vpad, 24px) var(--Content-hpad, 32px)',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'var(--Content-gap, 40px)',
  backgroundColor: theme.palette.surfaceContainerLow.main
}));

const SecaoBotao = styled('section')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(5),
}));

const Dados = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  width: '300px',
  height: '56px',
  flexDirection: 'column',
  backgroundColor: theme.palette.surfaceContainerHighest.main,
  borderRadius: '4px 4px 0px 0px',
  '&.highlight': {
      backgroundColor: theme.palette.error.main,
  },
}));

const BotaoEntrar = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: '100px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.onPrimary.main,
  textTransform: 'initial'
}));

const BotaoCancelar = styled(Button)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '150px',
  color: theme.palette.onSecondary.main,
  textTransform: 'initial',
}));

//Estilização do link para redefinir senha

const AbrirDialog = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.shadow.main,
  cursor: 'pointer', // Muda o cursor do mouse para apontador quando passa por cima
  textDecoration: 'none', // Remove qualquer decoração de texto por padrão
  textDecorationLine: 'underline',
}));


export default EmailLoginForm;