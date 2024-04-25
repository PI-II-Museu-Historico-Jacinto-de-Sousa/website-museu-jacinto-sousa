import { styled, Theme } from "@mui/material/styles";
import { IconButton, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {scroolMethods} from "../../Utils/scroolToTop"; // Corrigido o nome do utilitário

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            // Calcular a altura total do conteúdo da página
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            // Calcular a posição atual de rolagem
            const currentScroll = (document.documentElement.scrollTop || document.body.scrollTop);

            // Calcular a porcentagem atual de rolagem
            const scrollPercentage = (currentScroll / totalHeight) * 100;

            // Verificar se a porcentagem de rolagem é maior que 8.2%
            setVisible(scrollPercentage > 8.2);
        };
        
        window.addEventListener("scroll", checkScroll);
        
        return () => window.removeEventListener("scroll", checkScroll);
    }, []);
      
    return (
        <BotaoComIcone 
            onClick={scroolMethods.scroolToTop}
            style={{ visibility: visible ? 'visible' : 'hidden' }}
            data-cy="scrollToTop"
            ariel-label="Voltar ao topo"
        >
            <ExpandLessIcon />
        </BotaoComIcone>
    );
}

const BotaoComIcone = styled(Button)(({ theme }: { theme: Theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.onPrimary.main,
    gap: theme.spacing(1.25),
}))

export default ScrollToTop;