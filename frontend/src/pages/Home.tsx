import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import React from "react";
import TypingAnim from "../components/typer/TypingAnim";
import Footer from "../components/footer/Footer";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box width={"100%"} height={"100%"}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          mt: 3,
        }}
      >
        <Box>
          <TypingAnim />
        </Box>

        {/* Section des 3 images avec titres */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { md: "row", xs: "column", sm: "column" },
            gap: 5,
            my: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src="ChatBot.png"
              alt="robot"
              style={{ width: "300px", margin: "auto" }}
            />
            <Typography variant="subtitle1" mt={2}>
              Agent support IT
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <img
              src="ChatGPT.png"
              alt="robot"
              style={{ width: "300px", margin: "auto" }}
            />
            <Typography variant="subtitle1" mt={2}>
              Agent commercial
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <img
              className="image-inverted rotate"
              src="ChatBot_Logo.png"
              alt="openai"
              style={{ width: "300px", margin: "auto", filter: "none" }}
            />
            <Typography variant="subtitle1" mt={2}>
              Agent Headsapp
            </Typography>
          </Box>
        </Box>

        {/* Vidéo unique avec style */}
        <Box sx={{ display: "flex", mx: "auto", justifyContent: "center" }}>
          <video
            src="vedio.mp4" // Remplace ce chemin par ton vrai fichier vidéo
            controls
            autoPlay
            muted
            loop
            style={{
              display: "block",
              margin: "auto",
              width: isBelowMd ? "100%" : "100%", // Augmente la taille ici, "80%" est un exemple
              height: isBelowMd ? "auto" : "500px", // Ajuste aussi la hauteur si nécessaire
              borderRadius: 20,
              boxShadow: "-5px -5px 105px rgb(100, 169, 243)",
              marginTop: 20,
              marginBottom: 20,
              padding: 10,
            }}
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
