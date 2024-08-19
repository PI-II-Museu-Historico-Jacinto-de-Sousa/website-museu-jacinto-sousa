import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { Theme, styled } from "@mui/material/styles";
import { Colecao } from "../../interfaces/Colecao";
import { useNavigate } from "react-router-dom";
import { CardContent, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";

const CardColecoes = ({ colecao }: { colecao: Colecao }) => {
  const navigate = useNavigate();

  return (
    <HorizontalCard
      data-cy="card-colecao"
    >
      <Content>
        <Header>
          <Typography variant="headlineSmall"
           data-cy="nome"
          >{colecao.nome}</Typography>
          <Typography variant="labelLarge"
            data-cy="descricao"
          >
            {colecao.descricao}
          </Typography>
        </Header>
        <BotaoDetalhes
          data-cy="botao-detalhes"
          onClick={() => navigate(`/${colecao.id}`)}>
          <ArrowForwardIosIcon />
          Ver detalhes
        </BotaoDetalhes>
      </Content>
    </HorizontalCard>
  );
};

const HorizontalCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.onSurface.main,
  display: 'flex',
  alignItems: 'flex-start',
  borderRadius: '18px',
  backgroundColor: theme.palette.outlineVariant.main,
  borderTop: `1.5px solid ${theme.palette.outlineVariant.main}`,
  borderRight: `1.5px solid ${theme.palette.outlineVariant.main}`,
  borderBottom: `1.5px solid ${theme.palette.outlineVariant.main}`,
}));

const Content = styled(CardContent)(() => ({
  display: 'flex',
  justifyContent: 'space-between', // Espaça o conteúdo e o botão
  alignItems: 'center',
  flex: '1 0 0',
  alignSelf: 'stretch',
  flexDirection: 'row', // Disposição em linha
}));

const Header = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  gap: '8px', // Espaçamento entre nome e descrição
}));

const BotaoDetalhes = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'row', // Ícone e texto em linha
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '18px',
}));

export default CardColecoes;
