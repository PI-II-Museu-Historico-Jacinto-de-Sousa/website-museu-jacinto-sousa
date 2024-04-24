import { Card, CardContent, CardMedia, CardHeader } from '@mui/material';
import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { app } from "../../../firebase/firebase";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);

const CardItemAcervo = ({ id }: { id: string }) => {
    const [data, setData] = useState<any>({});

    useEffect(() => {
        getDoc(doc(db, 'acervo', id)).then((doc) => {
            if (doc.exists()) {
                setData(doc.data());
            }
        });
    }, [id]);

    const itemCollection: string = data.itemCollection || 'Coleção';
    const itemImages: Array<string> = data.itemImages || [''];
    const itemName: string = data.itemName || 'Nome do item';
    const itemPrivate: boolean = data.itemPrivate ?? true;
    const itemDescription: string = data.itemDescription || 'Descrição do item';

    return (
        <Card sx={{ textAlign: 'left', width: '400px' }}>
            <CardHeader
                title={ itemCollection }
                sx={{ backgroundColor: 'primary.main', color: 'onPrimary.main' }}
            />
            <CardMedia
                component="img"
                height="200"
                image={ itemImages[0] }
                alt="Imagem do item"
            />
            <CardContent>
                <Typography sx={{ color: 'onSurface.main', fontSize: '20px'}}>
                    { itemName }
                </Typography>
                <Typography sx={{ color: 'onSurfaceVariant.main', fontSize: '15px'}}>
                    { itemPrivate ? 'Fora de exposição' : 'Em exposição' }
                </Typography>
                <Typography sx={{ marginTop: '15px', marginBottom: '15px' }}>
                    { itemDescription }
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" href={`acervo/item/${id}`}>
                        Visualizar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default CardItemAcervo;