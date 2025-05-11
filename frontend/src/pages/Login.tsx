import React, { useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import Button from "@mui/material/Button";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const login = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Connexion</h2>

      {/* Bouton normal (email/mdp) ici si besoin */}

      <hr />

      {/* Bouton de reconnaissance faciale */}
      <FaceLoginButton />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please fill all fields.");
        return;
      }
  
      console.log("Email:", email.trim());
      console.log("Password:", password.trim());
      
      toast.loading("Signing In...", { id: "login" });
  
      const res = await auth?.login(email.trim(), password.trim());
  
      toast.success("Signed In Successfully!", { id: "login" });
  
      if (res?.redirect) {
        navigate(res.redirect); // 🛠 utilise le redirect
      } else {
        navigate("/chat"); // fallback si jamais
      }
  
    } catch (error) {
      console.log(error);
      toast.error("Signing In Failed!", { id: "login" });
    }
  };
  
  
  return (
    <Box width="100%" height="100%" display="flex" flex={1}>
      <Box padding={8} mt={8} display={{ md: "flex", sm: "none", xs: "none" }}>
        <img src="airobot.png" alt="Robot" style={{ width: "400px" }} />
      </Box>

      <Box
        display="flex"
        flex={{ xs: 1, md: 0.5 }}
        justifyContent="center"
        alignItems="center"
        padding={2}
        ml="auto"
        mt={16}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              padding={2}
              fontWeight={600}
            >
              Login
            </Typography>

            <CustomizedInput
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomizedInput
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#00fffc",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
              endIcon={<IoIosLogIn />}
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
