import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/admin/users", {
          withCredentials: true, // Envoie des cookies avec la requête
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les utilisateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 5, backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" color="#2958a3">
        Liste des Utilisateurs
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center" mt={5}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2958a3", color: "#fff" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Rôle</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date d’inscription</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "Utilisateur"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Tooltip title="Modifier">
                        <IconButton color="primary" sx={{ marginRight: 1 }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminUsers;
