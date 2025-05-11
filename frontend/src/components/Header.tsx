import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  // Attendre que l'état d'auth soit chargé (évite les bugs au refresh)
  if (auth.loading) return null;

  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <AppBar
      sx={{
        bgcolor: "transparent",
        position: "static",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Logo />
        <div style={{ display: "flex", gap: "10px" }}>
          {auth.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#00fffc"
                to="/chat"
                text="Go to chat"
                textColor="black"
              />
              {auth.user?.role === "admin" && (
                <NavigationLink
                  bg="#ffa500"
                  to="/admin" // assure-toi que ce route est bien configuré
                  text="Dashboard"
                  textColor="white"
                />
              )}
              <NavigationLink
                bg="#51538f"
                textColor="white"
                text="Logout"
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="#00fffc"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
