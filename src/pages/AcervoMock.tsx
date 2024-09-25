import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, TextField, IconButton, Grid, Pagination,
  CircularProgress, FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import { 
  Clear as ClearIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SortByAlpha
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { CalendarIcon } from '@mui/x-date-pickers';
import { onAuthStateChanged } from 'firebase/auth';
import CardItemAcervo from '../components/CardItemAcervo/CardItemAcervo';
import { ItemAcervo } from '../interfaces/ItemAcervo';
import { auth } from '../../firebase/firebase';

const getItensAcervo = async (isLoggedIn: boolean): Promise<ItemAcervo[]> => {
  const mockItems = [
    { id: '1', nome: 'Item A', colecao: 'Coleção 1', privado: false, dataDoacao: new Date('2024-09-01'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '2', nome: 'Item B', colecao: 'Coleção 2', privado: false, dataDoacao: new Date('2024-09-02'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '3', nome: 'Item C', colecao: 'Coleção 1', privado: true, dataDoacao: new Date('2024-09-03'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '4', nome: 'Item D', colecao: 'Coleção 3', privado: false, dataDoacao: new Date('2024-09-04'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '5', nome: 'Item E', colecao: 'Coleção 2', privado: false, dataDoacao: new Date('2024-09-05'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '6', nome: 'Item F', colecao: 'Coleção 3', privado: true, dataDoacao: new Date('2024-09-06'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '7', nome: 'Item G', colecao: 'Coleção 1', privado: false, dataDoacao: new Date('2024-09-07'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '8', nome: 'Item H', colecao: 'Coleção 2', privado: false, dataDoacao: new Date('2024-09-08'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '9', nome: 'Item I', colecao: 'Coleção 3', privado: false, dataDoacao: new Date('2024-09-09'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] },
    { id: '10', nome: 'Item J', colecao: 'Coleção 1', privado: true, dataDoacao: new Date('2024-09-10'), descricao: '', curiosidades: '', doacao: false, doacaoAnonima: false, nomeDoador: '', telefoneDoador: '', imagens: [] }
  ];
  return isLoggedIn ? mockItems : mockItems.filter(item => !item.privado);
}

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

const AcervoMock: React.FC = () => {
  const [itens, setItens] = useState<ItemAcervo[]>([]);
  const [filteredItens, setFilteredItens] = useState<ItemAcervo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [nomeFilter, setNomeFilter] = useState('');
  const [colecaoFilter, setColecaoFilter] = useState('');
  const [colecoes, setColecoes] = useState<string[]>([]);
  
  const [alfabeticOrder, setAlfabeticOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc' | 'none'>('desc');
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const fetchItens = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getItensAcervo(isLoggedIn);
      setItens(data);
      setFilteredItens(data);
      const uniqueColecoes = Array.from(new Set(data.map(item => item.colecao)));
      setColecoes(uniqueColecoes);
    } catch (err) {
      setError('Erro ao buscar itens do acervo');
    } finally {
      // Add a slight delay to ensure the loading state is visible
      setTimeout(() => setLoading(false), 500);
    }
  }, [isLoggedIn]);

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
      filtered = filtered.filter(item => item.colecao === colecaoFilter);
    }
  
    if (!isLoggedIn) {
      filtered = filtered.filter(item => !item.privado);
    }

    if (alfabeticOrder !== 'none') {
      filtered.sort((a, b) => {
        return alfabeticOrder === 'asc' 
          ? a.nome.localeCompare(b.nome)
          : b.nome.localeCompare(a.nome);
      });
    } else if (dateOrder !== 'none') {
      filtered.sort((a, b) => {
        const dateA = a.dataDoacao instanceof Date ? a.dataDoacao.getTime() : 0;
        const dateB = b.dataDoacao instanceof Date ? b.dataDoacao.getTime() : 0;
        return dateOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
  
    setFilteredItens(filtered);
    setPage(1);
  }, [itens, nomeFilter, colecaoFilter, alfabeticOrder, dateOrder, isLoggedIn]);

  const clearFilters = useCallback(() => {
    setNomeFilter('');
    setColecaoFilter('');
    setAlfabeticOrder('none');
    setDateOrder('desc');
  }, []);

  const toggleAlfabeticOrder = useCallback(() => {
    setAlfabeticOrder(prev => {
      if (prev === 'asc') return 'desc';
      if (prev === 'desc') return 'none';
      return 'asc';
    });
    setDateOrder('none');
    setPage(1);
  }, []);
  
  const toggleDateOrder = useCallback(() => {
    setDateOrder(prev => {
      if (prev === 'asc') return 'desc';
      if (prev === 'desc') return 'none';
      return 'asc';
    });
    setAlfabeticOrder('none');
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    void(event)
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
          <FormControl sx={{minWidth: '150px'}}>
            <InputLabel>Coleção</InputLabel>
            <Select
              value={colecaoFilter}
              onChange={(e) => setColecaoFilter(e.target.value as string)}
              label="Coleção"
              inputProps={{ 'data-cy': 'colecao-filter' }}
            >
              <MenuItem value="">Todas</MenuItem>
              {colecoes.map((colecao) => (
                <MenuItem key={colecao} value={colecao}>{colecao}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Filter>
        
        <Description>
          <Box>
            <IconButton onClick={toggleAlfabeticOrder} data-cy="alfabetic-order">
              <SortByAlpha />
              {alfabeticOrder === 'asc' ? <ArrowUpIcon /> : alfabeticOrder === 'desc' ? <ArrowDownIcon /> : null}
            </IconButton>
            <IconButton onClick={toggleDateOrder} data-cy="date-order">
              <CalendarIcon />
              {dateOrder === 'asc' ? <ArrowUpIcon /> : dateOrder === 'desc' ? <ArrowDownIcon /> : null}
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
                  <CardItemAcervo item={item} data-cy="item-card" data-id={item.id} />
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

export default AcervoMock;