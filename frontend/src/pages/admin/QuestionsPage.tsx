import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Table, TableHead, TableBody,
  TableCell, TableRow, TableContainer, Paper, Chip, IconButton, Pagination
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import axios from 'axios';

const ITEMS_PER_PAGE = 10; // Changer de 6 à 10

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadQuestions = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get('http://localhost:5000/api/v1/stats/questions', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setQuestions(res.data);
      setFiltered(res.data);
    } catch (err: any) {
      console.error("Erreur chargement des questions:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    const filteredResults = questions.filter((q) =>
      q.tag?.toLowerCase().includes(search.toLowerCase()) ||
      q.question?.toLowerCase().includes(search.toLowerCase()) ||
      q.response?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredResults);
    setPage(1); // Reset page when search changes
  }, [search, questions]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" mb={3} color="primary" fontWeight="bold">
        Liste des Questions
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Rechercher une question..."
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
        />
        <IconButton onClick={loadQuestions}>
          <Refresh />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Tag</TableCell>
              <TableCell sx={{ color: 'white' }}>Question</TableCell>
              <TableCell sx={{ color: 'white' }}>Réponse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((q, i) => (
              <TableRow key={i}>
                <TableCell><Chip label={q.tag} color="primary" size="small" /></TableCell>
                <TableCell>{q.question}</TableCell>
                <TableCell>{q.response}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination en bas centrée */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default QuestionsPage;
