// src/pages/Acervo.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, TextField, IconButton, Grid, Pagination,
  CircularProgress,
} from '@mui/material';
import { 
  Clear as ClearIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SortByAlpha
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CardItemAcervo from '../components/CardItemAcervo/CardItemAcervo';
import { ItemAcervo } from '../interfaces/ItemAcervo';
import { auth } from '../../firebase/firebase'
import { CalendarIcon } from '@mui/x-date-pickers';
import { getItensAcervo } from '../Utils/itemAcervoFirebase';

const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}));

const Heading = styled(Box)(() => ({
  textAlign: 'center'
}));

const List = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const Filter = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2)
}));

const Description = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const Acervo: React.FC = () => {
  const [itens, setItens] = useState<ItemAcervo[]>([]);
  const [filteredItens, setFilteredItens] = useState<ItemAcervo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [nomeFilter, setNomeFilter] = useState('');
  const [colecaoFilter, setColecaoFilter] = useState('');
  
  const [alfabeticOrder, setAlfabeticOrder] = useState<'asc' | 'desc'>('asc');
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc');
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const fetchItens = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getItensAcervo(auth.currentUser ? true : false);
      setItens(data);
      setFilteredItens(data);
    } catch (err) {
      setError('Erro ao buscar itens do acervo');
    } finally {
      setLoading(false);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    fetchItens();
  }, [fetchItens]);

  useEffect(() => {
    let filtered = itens;
    
    if (nomeFilter) {
      filtered = filtered.filter(item => 
        item.nome.toLowerCase().includes(nomeFilter.toLowerCase())
      );
    }
    
    if (colecaoFilter) {
      filtered = filtered.filter(item => 
        item.colecao.toLowerCase().includes(colecaoFilter.toLowerCase())
      );
    }

    filtered = filtered.filter(item => isLoggedIn || !item.privado);
    
    filtered.sort((a, b) => {
      if (alfabeticOrder === 'asc') {
        return a.nome.localeCompare(b.nome);
      } else {
        return b.nome.localeCompare(a.nome);
      }
    });
    
    filtered.sort((a, b) => {
      const dateA = a.dataDoacao ? new Date(a.dataDoacao.toString()).getTime() : 0;
      const dateB = b.dataDoacao ? new Date(b.dataDoacao.toString()).getTime() : 0;
      if (dateOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredItens(filtered);
    setPage(1);
  }, [itens, nomeFilter, colecaoFilter, alfabeticOrder, dateOrder, isLoggedIn]);

  const clearFilters = useCallback(() => {
    setNomeFilter('');
    setColecaoFilter('');
  }, []);

  const toggleAlfabeticOrder = useCallback(() => {
    setAlfabeticOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const toggleDateOrder = useCallback(() => {
    setDateOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  if (loading) {
    return <CircularProgress data-cy="loading" />;
  }

  if (error) {
    return <Typography color="error" data-cy="error-message">{error}</Typography>;
  }

  const paginatedItens = filteredItens.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  return (
    <Content data-cy="acervo-content">
      <Heading>
        <Typography variant="h4" sx={{paddingTop: '32px'}} data-cy="acervo-title">Acervo</Typography>
        <Typography variant="subtitle1" data-cy="acervo-subtitle">Explore os itens do nosso acervo</Typography>
      </Heading>
      
      <List sx={{
            display: 'flex',
            alignItems: 'center',
            }}
        >
        <Filter>
          <TextField 
            label="Nome do item"
            value={nomeFilter}
            onChange={(e) => setNomeFilter(e.target.value)}
            inputProps={{ 'data-cy': 'nome-filter' }}
          />
          <TextField 
            label="Coleção"
            value={colecaoFilter}
            onChange={(e) => setColecaoFilter(e.target.value)}
            inputProps={{ 'data-cy': 'colecao-filter' }}
          />
        </Filter>
        
        <Description>
          <Box>
            <IconButton onClick={toggleAlfabeticOrder} data-cy="alfabetic-order">
              <SortByAlpha />
              {alfabeticOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </IconButton>
            <IconButton onClick={toggleDateOrder} data-cy="date-order">
              <CalendarIcon />
              {dateOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </IconButton>
            <IconButton onClick={clearFilters} data-cy="clear-filters">
              <ClearIcon />
            </IconButton>
          </Box>
          <Typography data-cy="items-count">
            {filteredItens.length} itens encontrados
          </Typography>
        </Description>

        <Pagination 
              count={Math.ceil(filteredItens.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              data-cy="pagination"
        />

        {filteredItens.length === 0 ? (
          <Typography data-cy="no-items-message">Nenhum item encontrado com os filtros atuais</Typography>
        ) : (
          <>
            <Grid container spacing={2} data-cy="items-grid">
              {paginatedItens.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <CardItemAcervo item={item} data-cy="item-card" />
                </Grid>
              ))}
            </Grid>
            <Pagination 
              count={Math.ceil(filteredItens.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              data-cy="pagination"
            />
          </>
        )}
      </List>
    </Content>
  );
};

export default Acervo;