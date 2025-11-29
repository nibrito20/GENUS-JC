import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";

function App() {
  const { user } = useContext(AuthContext); // pega o usuário logado do contexto

  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rota privada */}
      <Route
        path="/perfil"
        element={user ? <Perfil /> : <Navigate to="/login" replace />}
      />

      {/* Rota fallback para páginas não encontradas */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}

export default App;
