import { Theme, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Controller, useForm } from "react-hook-form";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from "@mui/material/TextField";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";

interface SlidingBannerProps {
  images: Imagem[];
  addImage: () => void;
  editAlt: (key: number) => void;
  removeImage: (key: number) => void;
}
const SlidingBanner = (slidingBanner: SlidingBannerProps) => {
  const [slide, setSlide] = useState(0);
  const [editing, setEditing] = useState(false);
  const [logged, setLogged] = useState(false);
  const imagensSlidingBanner = slidingBanner?.images ?? [];

  const { control } = useForm();

  const handlePrevious = () => {
    setSlide((prev: number) => (prev === 0 ? imagensSlidingBanner.length - 1 : prev - 1))
  };

  const handleNext = () => {
    setSlide((prev: number) => (prev === imagensSlidingBanner.length - 1 ? 0 : prev + 1))
  };

  const handleIndicatorClick = (index: number) => {
    setSlide(index);
  };

  const handleChangeNext = () => {
    handleNext();
  };

  const handleChangePrevious = () => {
    handlePrevious();
  }


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    })
  }, []);


  useEffect(() => {
    if(!editing) {
      const interval = setInterval(() => {
        setSlide((prev) => (prev === imagensSlidingBanner.length - 1 ? 0 : prev + 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imagensSlidingBanner.length, editing]);

  const renderFields = () => {
    return (
      <ContainerImagem className="sliding-banner">
        <FormControlLabel
          control={
            <ArrowButton
              position="left"
              onClick={handleChangePrevious}
              data-cy="botaoAnterior"
            >
              <ArrowBackIosNewIcon />
            </ArrowButton>
          }
          label={undefined}
        />
        <Image>
            {
              logged && (
                <EditField
                  data-cy="menu-editar-sliding-banner"
                >

                  {
                    editing === true ? (
                      <>
                        <BotaoEditar data-cy="botaoSalvar" onClick={() => slidingBanner && slidingBanner.editAlt && slidingBanner.editAlt(slide) }>Salvar</BotaoEditar>
                        <BotaoDeletarImagem onClick={() => slidingBanner && slidingBanner.removeImage && slidingBanner.removeImage(slide)}>Deletar imagem</BotaoDeletarImagem>
                        <BotaoCancelar onClick={() => setEditing(false)}>Cancelar</BotaoCancelar>
                      </  >
                    )
                    :
                    (
                      <EditField>
                        <IconButton
                          data-cy="botaoEditar"
                          onClick={() => setEditing(true)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </EditField>
                    )
                  }
                </EditField>
              )
            }
          {
            imagensSlidingBanner.map((image, index) => {
              // Verifica se image.src é do tipo File
              const src = image.src instanceof File ? URL.createObjectURL(image.src) : image.src;

              return (
                <Fade key={index} in={index === slide} timeout={600}>
                  <div style={{ display: index === slide ? "block" : "none" }}>
                    <Imagens src={src} alt={image.alt} />
                  </div>
                </Fade>
              );
            })
          }
        
          {
          imagensSlidingBanner.map((image, index) => (
            <div key={index} style={{ display: index === slide ? "block" : "none" }}>
              {
                editing ?
                (
                  <Controller
                    name={`alt-${index}`}
                    control={control}
                    defaultValue={image.alt}
                    render={({ field }) => (
                      <AltText
                        {...field}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                ) :
                (
                  <Typography variant="labelLarge">{image.alt}</Typography>
                )
              }
              {
                  <Pagination>
                  {
                    imagensSlidingBanner.map((_, index) => (
                      <PageIndicator
                        key={index}
                        active={index === slide}
                        onClick={() => handleIndicatorClick(index)}
                      />
                    ))
                  }
                  </Pagination>
              }
            </div>
          ))
        }
        
          {
            logged && (
              <EditField>
                <BotaoEditar data-cy="botao-adicionar-imagem" onClick={() => slidingBanner && slidingBanner.addImage && slidingBanner.addImage()}>Adicionar imagem</BotaoEditar>
              </EditField>
            )
          }
        </Image>
        <FormControlLabel
          control={
            <ArrowButton
              position="right"
              onClick={handleChangeNext}
              data-cy="botaoProximo"
            >
              <ArrowForwardIosIcon />
            </ArrowButton>
          }
          label={undefined}
        />
      </ContainerImagem>
    );
  };

  return renderFields();
};

const ContainerImagem = styled(Container)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'stretch',
  position: 'relative', // Para posicionar os botões de navegação
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  width: '40%',
}));

const Image = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const AltText = styled(TextField)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '6px 6px 0 0',
  backgroundColor: theme.palette.surfaceVariant.main,
}));

const Imagens = styled('img')(({ theme }) => ({
  minWidth: '270px',
  minHeight: '200px',
  maxWidth: '1100px',
  maxHeight: '300px',

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
    maxHeight: '300px',
  }
}));

const EditField = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: theme.spacing(5),
}));



const BotaoCancelar = styled(Button)(({ theme }: { theme: Theme }) => ({
  borderRadius: '150px',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  textTransform: 'initial',
}));

const BotaoEditar = styled(Button)(({ theme }: { theme: Theme }) => ({
  borderRadius: '150px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textTransform: 'initial',
}));

const ArrowButton = styled(IconButton)(({ position }: { position: string }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  [position]: '1rem',
}));

const Pagination = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const BotaoDeletarImagem = styled(Button)(({ theme }: { theme: Theme }) => ({
  borderRadius: '150px',
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  textTransform: 'initial',
}));

const PageIndicator = styled('div')<{ active: boolean }>(({ theme, active }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[400],
  cursor: 'pointer',
}));

export default SlidingBanner;