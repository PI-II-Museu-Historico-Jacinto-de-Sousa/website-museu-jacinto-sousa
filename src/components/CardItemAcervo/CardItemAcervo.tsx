import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, CardHeader, Button, Typography } from '@mui/material';
import { getDoc, doc, DocumentData } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../../firebase/firebase';

const db = getFirestore(app);
const storage = getStorage(app);

interface ItemData {
  itemCollection?: string;
  itemImages?: string[];
  itemName?: string;
  itemPrivate?: boolean;
  itemDescription?: string;
}

interface CardItemAcervoProps {
  id: string;
}

const CardItemAcervo: React.FC<CardItemAcervoProps> = ({ id }) => {
  const [data, setData] = useState<ItemData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'acervo', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data() as ItemData);

          // Verificar se o item possui imagens
          if (docSnap.data().itemImages && docSnap.data().itemImages.length > 0) {
            // Buscar a URL da primeira imagem no Storage do Firebase
            const imageRef = ref(storage, docSnap.data().itemImages[0]);
            const url = await getDownloadURL(imageRef);
            setImageUrl(url);
          }
        } else {
          setError('Item não encontrado.');
        }
      } catch (error) {
        setError('Erro ao buscar dados do item.');
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <Card sx={{ textAlign: 'left', width: '400px' }}>
        <CardContent>
          <Typography variant="body1" sx={{ color: 'error.main' }}>
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
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
    itemCollection = 'Coleção',
    itemName = 'Nome do item',
    itemPrivate = true,
    itemDescription = 'Descrição do item',
  } = data;

  return (
    <Card sx={{ textAlign: 'left', width: '400px' }}>
      <CardHeader
        title={itemCollection}
        sx={{ backgroundColor: 'primary.main', color: 'onPrimary.main' }}
        titleTypographyProps={{
          variant: 'subtitle1', // M3/title/medium
          fontFamily: 'Roboto',
        }}
      />
      {imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt="Imagem do item"
        />
      )}
      <CardContent>
        <Typography variant="body1" sx={{ color: 'onSurface.main', fontSize: '20px' }}>
          {itemName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'onSurfaceVariant.main', fontSize: '15px' }}>
          {itemPrivate ? 'Fora de exposição' : 'Em exposição'}
        </Typography>
        <Typography sx={{ marginTop: '15px', marginBottom: '15px', color: 'onSurfaceVariant.main' }}>
          {itemDescription || 'Nenhuma descrição disponível.'}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" href={`acervo/item/${id}`}>
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardItemAcervo;
