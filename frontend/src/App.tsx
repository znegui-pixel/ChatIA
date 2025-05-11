import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import React from "react";

// Admin
import AdminRoutes from "./pages/admin/AdminRoutes";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import Gestion from "./pages/admin/Gestion";
import QuestionsPage from './pages/admin/QuestionsPage';

function App() {
  const auth = useAuth();

  return (
    <main>
      <Header />
      <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/chat" element={<Chat />} />

  {/* Admin Routes */}
  <Route path="/admin/*" element={<AdminRoutes />}>
    <Route index element={<AdminHome />} />
    <Route path="AdminUsers" element={<AdminUsers />} />
    <Route path="Gestion" element={<Gestion />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="questions" element={<QuestionsPage />} />
  </Route>

  {/* Not Found */}
  <Route path="*" element={<NotFound />} />
</Routes>

    </main>
  );
}

export default App;
