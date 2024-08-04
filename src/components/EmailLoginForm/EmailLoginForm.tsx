import React, { useEffect, useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
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
import Tooltip from '@mui/material/Tooltip';
import useLoginForm from '../../hooks/useLoginForm';
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';

const EmailLoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [erroLogin, setErroLogin] = useState(false);

    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    const [loginError, setLoginError] = useState<string | null>(null);
    const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);

    const navigate = useNavigate(); // Hook para navegação
    const {
        register: registerLogin,
        watch: watchLogin,
        handleSubmit: handleSubmitLogin,
    } = useLoginForm();

    const {
        register: registerPasswordReset,
        watch: watchPasswordReset,
        handleSubmit: handleSubmitPasswordReset,
        reset: resetPasswordReset
    } = useLoginForm();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const openDialog = () => setDialogOpen(true);

    const closeDialog = () => setDialogOpen(false);

    const watchEmail = watchLogin('email');
    const watchSenha = watchLogin('senha');
    const watchEmailRedefinicaoSenha = watchPasswordReset('emailRedefinicaoSenha');

    useEffect(() => {
        if (!dialogOpen) {
            resetPasswordReset({ emailRedefinicaoSenha: '' });
        }
    }, [dialogOpen, resetPasswordReset]);

    const submitForm: SubmitHandler<FieldValues> = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email!, data.senha!).then(() => {
              navigate('/home');
              setErroEmail('');
              setErroSenha('');
              setLoginError('');
            }).catch((error) => {
                if(error.code === 'auth/wrong-password') {
                  setErroSenha('Senha incorreta')
                } else if(error.code === 'auth/user-not-found') {
                  setErroEmail('Nenhum usuário com o email passado')
                } else if(error.code === 'auth/invalid-email') {
                  setErroEmail('Email inválido')
                } else {
                    setLoginError('Erro ao fazer login');
                }
            })
        } catch (error) {
            setErroLogin(true);
            setLoginError('Email ou senha incorretos');
        }
    };

    const handlePasswordReset: SubmitHandler<FieldValues> = async (data) => {
        try {
            await sendPasswordResetEmail(auth, data.emailRedefinicaoSenha);
            closeDialog();
        } catch (error) {
            setErroLogin(true);
            setLoginError('Erro ao enviar email de redefinição de senha');
            setResetPasswordError('Erro ao enviar email de redefinição de senha');
        }
    };

    return (
        <>
            <Content>
                <Formulario onSubmit={handleSubmitLogin(submitForm)}>
                    <Typography variant='headlineLarge'>Login Administrativo</Typography>
                    <Dados
                        {...registerLogin('email', { required: "Email é obrigatório" })}
                        id='email'
                        type='email'
                        name='email'
                        placeholder='Email'
                        error={erroEmail !== '' && erroEmail !== undefined}
                        helperText={buttonClicked && !watchEmail ? "Email é obrigatório" : erroEmail}
                        data-cy='email'
                    />
                    <Dados
                        {...registerLogin('senha', { required: "Senha é obrigatória" })}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha"
                        id='senha'
                        name='senha'
                        error={erroSenha !== '' && erroSenha !== undefined}
                        helperText={buttonClicked && !watchSenha ? "Senha é obrigatória" : erroSenha}
                        data-cy='password'
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
                    <AbrirDialog variant='bodyMedium' onClick={openDialog}>Esqueceu sua senha?</AbrirDialog>
                    <Tooltip
                        title="Preencha ambos os campos"
                        disableHoverListener={!!watchEmail && !!watchSenha}
                        data-cy='tooltipCamposVazios'
                    >
                        {
                            // Se ambos os campos estiverem preenchidos, o botão é habilitado
                            !!watchEmail && !!watchSenha ? (
                                <BotaoEntrar
                                    type='submit'
                                    data-cy='botaoEntrar'
                                >
                                    Entrar
                                </BotaoEntrar>
                            ) : (
                                <span
                                    onClick={() => setButtonClicked(true)}
                                >
                                    <BotaoEntrar
                                        type="submit"
                                        disabled={!watchEmail || !watchSenha}
                                        data-cy='botaoEntrar'
                                    >
                                        Entrar
                                    </BotaoEntrar>
                                </span>
                            )
                        }
                    </Tooltip>
                </Formulario>
            </Content>

            <Dialog open={dialogOpen} onClose={closeDialog}>
                <Formulario onSubmit={handleSubmitPasswordReset(handlePasswordReset)}>
                    <Dados
                        {...registerPasswordReset('emailRedefinicaoSenha', { required: "Email é obrigatório" })}
                        type='email'
                        placeholder='Email'
                        error={!!resetPasswordError}
                        helperText={resetPasswordError || ''}
                        data-cy='emailRedefinicaoSenha'
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

            <Dialog open={erroLogin} onClose={() => setErroLogin(false)}>
                <Typography variant='bodyMedium'>
                    {loginError}
                </Typography>
                <SecaoBotao>
                    <BotaoCancelar onClick={() => setErroLogin(false)}>Ok</BotaoCancelar>
                </SecaoBotao>
            </Dialog>
        </>
    );
}

const Content = styled(Container)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    [theme.breakpoints.down('sm')]: { // Para telas pequenas
        minWidth: '100%',
        minHeight: 'auto',
        maxWidth: '100%',
        maxHeight: 'auto',
    },
    [theme.breakpoints.up('md')]: { // Para telas médias
        minWidth: '270px',
        minHeight: '200px',
        maxWidth: '350px',
        maxHeight: '300px',
    },
    [theme.breakpoints.up('lg')]: { // Para telas grandes
        minWidth: '270px',
        minHeight: '200px',
        maxWidth: '577px',
        maxHeight: '350px',
    },
    //padding: var(--Content-vpad, 24px) var(--Content-hpad, 32px);
    padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
    flexDirection: 'column',
    justifycontent: 'center',
    alignItems: 'center',
    //gap: var(--Content-gap, 40px),
    gap: theme.spacing(5),
    backgroundColor: theme.palette.surfaceContainerLow.main,
}));

// Estilização dos componentes
const Formulario = styled('form')(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    padding: 'var(--Content-vpad, 24px) var(--Content-hpad, 32px)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(4),
    [theme.breakpoints.down('sm')]: { // Para telas pequenas
        minWidth: '100%',
        minHeight: 'auto',
        maxWidth: '100%',
        maxHeight: '200px',
    },
    [theme.breakpoints.up('md')]: { // Para telas médias
        minWidth: '270px',
        minHeight: '200px',
        maxWidth: '800px',
        maxHeight: '300px',
    },
    [theme.breakpoints.up('lg')]: { // Para telas grandes
        minWidth: '270px',
        minHeight: '200px',
        maxWidth: '1100px',
        maxHeight: '360px',
    }
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

// Estilização do link para redefinir senha
const AbrirDialog = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.shadow.main,
    cursor: 'pointer',
    textDecoration: 'none',
    textDecorationLine: 'underline',
}));

export default EmailLoginForm;
