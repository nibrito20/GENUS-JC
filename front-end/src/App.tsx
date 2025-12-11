import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import Cacto from "./pages/Cacto";
import Noticia from "./pages/Noticia";
import Favoritos from "./pages/Favoritos";
import Noticias from "./pages/Noticias";
import Personalizacao from "./pages/Personalizacao";
import PerfilInfo from "./pages/PerfilInfo";
import Feedback from "./pages/Feedback";
import Loading from "./components/Loading";
import Suporte from "./pages/Suporte";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <Loading />
    );

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/noticia/:slug" element={<Noticia />} />
      <Route path="/noticias" element={<Noticias />} />

      {/* Rotas privadas */}
      <Route
        path="/perfil"
        element={user ? <Perfil /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/perfil/personalizacao"
        element={user ? <Personalizacao /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/perfil/info"
        element={user ? <PerfilInfo /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/cacto"
        element={user ? <Cacto /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/favoritos"
        element={user ? <Favoritos /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/feedback"
        element={user ? <Feedback /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/suporte"
        element={user ? <Suporte /> : <Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
}

export default App;
