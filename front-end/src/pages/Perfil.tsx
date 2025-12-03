import { Navbar2 } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import PerfilOptions from "../components/PerfilOption";

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

export default function Perfil() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // ← IMPORTANTE

  const voltar = () => navigate(-1);

  const fazerLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });

      logout();       // ← Limpa o user do AuthContext
      navigate("/");  // ← Volta para home pública
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  return (
    <>
      <Navbar2 />

      <img
        src={backArrow}
        alt="Voltar"
        onClick={voltar}
        className="back-arrow"
      />

      <div className="user-name-photo">
        <img src={noUser} alt="Foto do usuário" className="user-image" />
        <h1>Nome do usuário</h1>
      </div>

          <PerfilOptions title="Informações da conta" icon={userInfo} link="/perfil/info" />
          <PerfilOptions title="Cacto" icon={Cacto} link="/cacto" />
          <PerfilOptions title="Personalização de conteúdo" icon={engrenagem} link="/perfil/personalizacao" />
          <PerfilOptions title="Acessibilidade" icon={acessibilidade} link="/perfil/acessibilidade" />
          <PerfilOptions title="Favoritos" icon={star} link="/favoritos" />
          <PerfilOptions title="Redefinir senha" icon={padlock} link="/perfil/senha" />
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