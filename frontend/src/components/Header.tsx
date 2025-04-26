import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";


const Header = () => {
  const auth = useAuth();
  return (
    <AppBar sx={{bgcolor : "transparent",position : "static", boxShadow : "none"}}>
      <Toolbar sx={{display : "flex"}}>
        <Logo />
        <div> {auth?.isLoggedIn ? (
          <>
             <NavigationLink
                bg="#00fffc"
                to="/chat"
                text="Go to chat"
                textColor="black"/>
                 <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/"
                text="lagout"
                onClick = {auth.logout}
              />
              </>
               ):(<>
               <NavigationLink
                bg="#00fffc"
                to="/login"
                text="login"
                textColor="black"/>
                 <NavigationLink
                bg="#51538f"
                textColor="white"
                to="/signup"
                text="signup"
                />
               </>)} </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
