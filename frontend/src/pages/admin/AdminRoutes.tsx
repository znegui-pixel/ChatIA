import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoutes() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoggedIn === false && auth.user === null) {
    return <div>Chargement...</div>;
  }

  if (!auth.user || auth.user.role !== "admin") {
    return <Navigate to="/" />;
  }

  const items = [
    { label: "Accueil", path: "" },
    { label: "Liste des Utilisateurs", path: "AdminUsers" },
    { label: "Liste des Questions", path: "questions" },
    { label: "Gestion des Questions", path: "Gestion" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#1f2937", // gris foncé
            color: "#ffffff", // texte blanc
          },
        }}
      >
        <Toolbar />
        <List>
          {items.map((item) => {
            const isActive = location.pathname === `/admin/${item.path}` || (item.path === "" && location.pathname === "/admin"); // Comparaison exacte pour "Accueil"
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={`/admin/${item.path}`}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 1,
                  backgroundColor: isActive ? "#2563eb" : "transparent", // bleu uniquement si actif
                  color: isActive ? "#ffffff" : "#e5e7eb", // texte blanc si actif
                  "&:hover": {
                    backgroundColor: "#374151", // gris plus clair au survol (pas de bleu)
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
