import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, CardHeader, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { getDownloadURL, ref } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { app } from '../../../firebase/firebase';
import { ItemAcervo } from '../../interfaces/ItemAcervo';
import notFoundImage from '../../assets/not-found.png';

const storage = getStorage(app);

interface CardItemAcervoProps {
  item: ItemAcervo;
}

const CardItemAcervo: React.FC<CardItemAcervoProps> = ({ item }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [urlImagem, setUrlImagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (item.imagens && item.imagens.length > 0) {
        const imagemSrc = item.imagens[0].src;
        
        // Caso 1: A imagem já é uma URL completa
        if (typeof imagemSrc === 'string' && !imagemSrc.startsWith('images/')) {
          setUrlImagem(imagemSrc);
          return;
        }
        
        // Caso 2: A imagem precisa ser carregada do Storage
        if (imagemSrc instanceof File || (typeof imagemSrc === 'string' && imagemSrc.startsWith('images/'))) {
          try {
            const imagePath = imagemSrc instanceof File ? `images/${imagemSrc.name}` : imagemSrc;
            const imageRef = ref(storage, imagePath);
            const url = await getDownloadURL(imageRef);
            setUrlImagem(url);
          } catch (error) {
            console.error('Erro ao carregar imagem:', error);
            setUrlImagem(notFoundImage);
          }
          return;
        }
        
        // Caso 3: Formato de imagem não reconhecido
        console.error('Formato de imagem não reconhecido');
        setUrlImagem(notFoundImage);
      } else {
        // Caso 4: Não há imagens
        setUrlImagem(notFoundImage);
      }
    };
  
    fetchImageUrl();
  }, [item]);

  if (!item) {
    return (
      <Card sx={{ width: isMobile ? '100%' : '400px', maxWidth: '100%', textAlign: 'left' }}>
        <CardContent>
          <Typography variant="body1">
            Carregando...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { colecao, nome, privado, descricao } = item;

  return (
    <Card 
      sx={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '400px',
        textAlign: 'left',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column'
      }}
      data-cy="card-item-container"
    >
      <CardHeader
        title={colecao ? colecao : 'Coleção'}
        sx={{ 
          backgroundColor: theme.palette.primary.main, 
          color: theme.palette.primary.contrastText 
        }}
        titleTypographyProps={{
          variant: 'subtitle1',
          fontFamily: 'Roboto',
        }}
      />
      {urlImagem && (
        <CardMedia
          component="img"
          sx={{
            height: 200,
            objectFit: 'contain',
            padding: '10px',
            objectPosition: 'center',
            width: '100%'
          }}
          image={urlImagem}
          alt={item.imagens.length !== 0 ? item.imagens[0].alt : 'Imagem não encontrada'}
          data-cy='card-item-image'
        />
      )}
      <CardContent>
        <Typography variant="body1" sx={{ fontSize: '20px' }} data-cy="card-item-nome">
          {nome ? nome : 'Nome do item'}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '15px' }} data-cy={privado ? 'item-privado' : 'item-publico'}>
          {privado ? 'Fora de exposição' : 'Em exposição'}
        </Typography>
        <Typography sx={{ marginTop: '15px', marginBottom: '15px' }} data-cy='card-item-description'>
          {descricao ? descricao : 'Descrição do item'}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" href={`/${item.id}`}>
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItemAcervo;