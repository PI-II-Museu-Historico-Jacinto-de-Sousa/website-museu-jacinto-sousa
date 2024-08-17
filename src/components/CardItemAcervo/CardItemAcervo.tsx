import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, CardHeader, Button, Typography } from '@mui/material';
import { getDownloadURL, ref } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { app } from '../../../firebase/firebase';
import { ItemAcervo } from '../../interfaces/ItemAcervo';

const storage = getStorage(app);

interface CardItemAcervoProps {
  item: ItemAcervo;
}

const CardItemAcervo: React.FC<CardItemAcervoProps> = ({ item }) => {
  const [urlImagem, setUrlImagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        if (item.imagens && item.imagens.length > 0) {
          const imagemSrc = item.imagens[0].src;
          if (typeof imagemSrc === 'string') {
            const imagemRef = ref(storage, imagemSrc);
            const url = await getDownloadURL(imagemRef);
            setUrlImagem(url);
          } else if (imagemSrc instanceof File) {
            const url = URL.createObjectURL(imagemSrc);
            setUrlImagem(url);
          }
        } else {
          // Adicionar imagem padrão (imagens/image_not_found.png)
          const imagemRef = ref(storage, 'imagens/not_found.png');
          const url = await getDownloadURL(imagemRef);
          setUrlImagem(url);
        }
      } catch (error) {
        console.error('Erro ao buscar URL da imagem:', error);
      }
    };

    fetchImageUrl();
  }, [item]);

  if (!item) {
    return (
      <Card sx={{ textAlign: 'left', width: '400px' }}>
        <CardContent>
          <Typography variant="body1" sx={{ color: 'onSurface.main' }}>
            Carregando...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    colecao,
    nome,
    privado,
    descricao,
  } = item;

  return (
    <Card sx={{ textAlign: 'left', width: '400px' }}>
      <CardHeader
        title={colecao ? colecao : 'Coleção'}
        sx={{ backgroundColor: 'primary.main', color: 'onPrimary.main' }}
        titleTypographyProps={{
          variant: 'subtitle1', // M3/title/medium
          fontFamily: 'Roboto',
        }}
      />
      {urlImagem && (
        <CardMedia
          component="img"
          height="200"
          sx={{ minHeight: '200px' }}
          image={urlImagem}
          alt={item.imagens.length != 0 ? item.imagens[0].alt : 'Imagem não encontrada'}
          data-cy='card-item-image'
        />
      )}
      <CardContent>
        <Typography variant="body1" sx={{ color: 'onSurface.main', fontSize: '20px' }}>
          {nome ? nome : 'Nome do item'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'onSurfaceVariant.main', fontSize: '15px' }}>
          {privado ? 'Fora de exposição' : 'Em exposição'}
        </Typography>
        <Typography sx={{ marginTop: '15px', marginBottom: '15px', color: 'onSurfaceVariant.main' }} data-cy='card-item-description'>
          {descricao ? descricao : 'Descrição do item'}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" href={`acervo/item/${item.id}`}>
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItemAcervo;
