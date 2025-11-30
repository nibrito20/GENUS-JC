import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import Cacto from "./pages/Cacto";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;


  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rotas privadas */}
      <Route
        path="/perfil"
        element={user ? <Perfil /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/cacto"
        element={user ? <Cacto /> : <Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}

export default App;