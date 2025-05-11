import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Snackbar, Alert, Tabs, Tab, Chip, Tooltip,
  LinearProgress, List, ListItem, ListItemText
} from '@mui/material';
import {
  Add, Delete, Edit, FileUpload, FileDownload,
  Search, Refresh, Category
} from '@mui/icons-material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const Gestion = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [importProgress, setImportProgress] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const loadChats = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("Token manquant");

      const res = await axios.get('http://localhost:5000/api/v1/stats/questions', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      setChats(res.data);
      setFilteredChats(res.data);
    } catch (err: any) {
      console.error("Erreur Axios:", err?.response?.data || err.message);
      showSnackbar('Erreur lors du chargement des chats', 'error');
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    const filtered = chats.filter(chat =>
      chat.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.response?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchTerm, chats]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setImportProgress({ fileName: file.name, progress: 0 });
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/chat/chats/import', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImportProgress((prev: any) => ({ ...prev, progress }));
        }
      });

      showSnackbar(`${res.data.importedCount} chats importés avec succès`, 'success');
      loadChats();
    } catch (err) {
      showSnackbar('Erreur lors de l\'import', 'error');
    } finally {
      setTimeout(() => setImportProgress(null), 3000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1
  });

  const handleExport = async (format: string) => {
    try {
      const res = await axios.get(`/chat/chats/export?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chats_export.${format}`);
      document.body.appendChild(link);
      link.click();
      showSnackbar('Export réussi', 'success');
    } catch (err) {
      showSnackbar('Erreur lors de l\'export', 'error');
    }
  };

  const handleCreateChat = async (chat: any) => {
    if (!validateChat(chat)) return;
    try {
      await axios.post('/admin/chats', chat);
      showSnackbar('Chat créé', 'success');
      loadChats();
    } catch (err) {
      showSnackbar('Erreur création', 'error');
    } finally {
      setOpenDialog(false);
    }
  };

  const handleUpdateChat = async (id: string, chat: any) => {
    if (!validateChat(chat)) return;
    try {
      await axios.put(`/chat/chats/${id}`, chat);
      showSnackbar('Chat mis à jour', 'success');
      loadChats();
    } catch (err) {
      showSnackbar('Erreur mise à jour', 'error');
    } finally {
      setOpenDialog(false);
    }
  };

  const handleDeleteChat = async (index: number) => {
    const chat = chats[index];
    if (!chat?._id) return;
    try {
      await axios.delete(`/chat/chats/${chat._id}`);
      showSnackbar('Chat supprimé', 'success');
      loadChats();
    } catch (err) {
      showSnackbar('Erreur suppression', 'error');
    }
  };

  const validateChat = (chat: any) => {
    const errors: string[] = [];
    if (!chat.tag) errors.push('Tag manquant');
    if (!chat.question) errors.push('Question manquante');
    if (!chat.response) errors.push('Réponse manquante');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          <Category sx={{ mr: 1 }} />
          Gestion des Chats
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setCurrentChat({ tag: '', question: '', response: '' });
            setOpenDialog(true);
          }}
        >
          Nouveau
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Toutes les Questions" />
        <Tab label="Validation" />
        <Tab label="Import/Export" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Rechercher..."
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
            />
            <Button variant="outlined" startIcon={<Refresh />} onClick={loadChats}>
              Actualiser
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Tag</TableCell>
                  <TableCell sx={{ color: 'white' }}>Question</TableCell>
                  <TableCell sx={{ color: 'white' }}>Réponse</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChats.map((chat, index) => (
                  <TableRow key={index}>
                    <TableCell><Chip label={chat.tag} color="primary" size="small" /></TableCell>
                    <TableCell>{chat.question}</TableCell>
                    <TableCell>{chat.response}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => {
                        setCurrentChat(chat);
                        setOpenDialog(true);
                      }}><Edit color="primary" /></IconButton>
                      <IconButton onClick={() => handleDeleteChat(index)}><Delete color="error" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {activeTab === 1 && (
        <Box>
          {validationErrors.length > 0 ? (
            <List>
              {validationErrors.map((error, idx) => (
                <ListItem key={idx} sx={{ color: 'red' }}>
                  <ListItemText primary={error} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: 'green' }}>
              Tous les chats sont valides.
            </Typography>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box {...getRootProps()} sx={{ p: 2, border: '2px dashed #1976d2', textAlign: 'center', backgroundColor: '#e3f2fd' }}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography variant="h6" sx={{ color: '#1976d2' }}>Déposez le fichier JSON ici</Typography>
            ) : (
              <Typography variant="h6" sx={{ color: '#1976d2' }}>Glissez un fichier JSON à importer</Typography>
            )}
          </Box>
          {importProgress && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={importProgress.progress} />
              <Typography variant="body2" align="center">{importProgress.fileName} ({importProgress.progress}%)</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<FileDownload />} onClick={() => handleExport('json')}>
              Exporter JSON
            </Button>
            <Button variant="contained" startIcon={<FileDownload />} onClick={() => handleExport('csv')}>
              Exporter CSV
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentChat?.tag ? 'Modifier Chat' : 'Créer Chat'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tag"
            fullWidth
            variant="outlined"
            margin="normal"
            value={currentChat?.tag || ''}
            onChange={(e) => setCurrentChat({ ...currentChat, tag: e.target.value })}
          />
          <TextField
            label="Question"
            fullWidth
            variant="outlined"
            margin="normal"
            value={currentChat?.question || ''}
            onChange={(e) => setCurrentChat({ ...currentChat, question: e.target.value })}
          />
          <TextField
            label="Réponse"
            fullWidth
            variant="outlined"
            margin="normal"
            value={currentChat?.response || ''}
            onChange={(e) => setCurrentChat({ ...currentChat, response: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Annuler</Button>
          <Button
            onClick={() => {
              if (currentChat?._id) {
                handleUpdateChat(currentChat._id, currentChat);
              } else {
                handleCreateChat(currentChat);
              }
            }}
            color="primary"
          >
            {currentChat?._id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gestion;
