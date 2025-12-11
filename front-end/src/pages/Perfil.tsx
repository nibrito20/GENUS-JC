import { Navbar2 } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import PerfilOptions from "../components/PerfilOption";
import { Container4 } from "../components/Container";

import backArrow from "../assets/icons/backArrow.png";
import noUser from "../assets/icons/noUser.png";
import "../css/perfil.css";

import userInfo from "../assets/icons/userInfo.png";
import engrenagem from "../assets/icons/engrenagem.png";
import acessibilidade from "../assets/icons/acessibilidade.png";
import star from "../assets/icons/star.png";
import padlock from "../assets/icons/padlock.png";
import suport from "../assets/icons/suport.png";
import logoutIcon from "../assets/icons/logout.png";
import Cacto from "../assets/icons/Cacto.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Perfil() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const voltar = () => navigate(-1);
  
  // Função para obter a foto do usuário
  function getUserPhoto() {
    if (user?.profile?.foto_url_display) {
      return user.profile.foto_url_display;
    }
    if (user?.profile?.foto_url) {
      return user.profile.foto_url;
    }
    return noUser;
  }
  
  // Função para obter o nome do usuário
  function getUserName() {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return user?.username || "Nome do usuário";
  }

  const fazerLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });

      logout(); // ← Limpa o user do AuthContext
      navigate("/"); // ← Volta para home pública
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  return (
    <>
      <Navbar2 />
      <Container4>
        <div></div>
      </Container4>
      <img
        src={backArrow}
        alt="Voltar"
        onClick={voltar}
        className="back-arrow"
      />

      <div className="user-name-photo">
        <img src={getUserPhoto()} alt="Foto do usuário" className="user-image" />
        <h1>{getUserName()}</h1>
      </div>

      <PerfilOptions
        title="Informações da conta"
        icon={userInfo}
        link="/perfil/info"
      />
      <PerfilOptions title="Cacto" icon={Cacto} link="/cacto" />
      <PerfilOptions
        title="Personalização de conteúdo"
        icon={engrenagem}
        link="/perfil/personalizacao"
      />
      <PerfilOptions
        title="Acessibilidade"
        icon={acessibilidade}
        link="/perfil/acessibilidade"
      />
      <PerfilOptions title="Favoritos" icon={star} link="/favoritos" />

      <PerfilOptions title="Suporte" icon={suport} link="/perfil/suporte" />

      <PerfilOptions
        title="Sair da conta"
        icon={logoutIcon}
        onClick={fazerLogout}
        isButton={true}
      />
    </>
  );
}
