import Header from "./components/Header";

import {Routes , Route} from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import React from "react";
import AdminRoutes from "./pages/admin/AdminRoutes";
function App() {
  const auth = useAuth();

  return (
  <main>
   <Header />
   <Routes>
    <Route path="/"element={<Home />} />
    <Route path="/login"element={<Login />} />
    <Route path="/signup"element={<Signup />} />
    <Route path="/chat"element={<Chat />} />
    <Route path="*"element={<NotFound />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
  </Routes>

   

  </main>
  );
}
export default App;

