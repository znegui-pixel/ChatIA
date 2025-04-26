import { Navigate, Route, Routes, Link } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, Toolbar } from "@mui/material";
import Dashboard from "./Dashboard";
import Intents from "./Intents";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoutes() {
  const {user} = useAuth();
  if (!user || user.role !== "admin") return <Navigate to="/" />;

  const items = [
    { label: "Dashboard BI", path: "dashboard" },
    { label: "Intents", path: "intents" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent">
        <Toolbar />
        <List>
          {items.map((item) => (
            <ListItemButton key={item.path} component={Link} to={item.path}>
              {item.label}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="intents" element={<Intents />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </Box>
    </Box>
  );
}
