import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Container from "../components/Container";
import "../css/login.css";

import LogoJC from "../assets/imgs/Logo JC.png";
import backArrow from "../assets/icons/backArrow.png";

import { AuthContext } from "../context/AuthContext";
import { getUser } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Login() {
  const navigate = useNavigate();

  // PEGAR DO CONTEXTO (apenas UMA VEZ!)
  const { setUserLoggedIn, refreshUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const voltar = () => navigate(-1);

  const fazerLogin = async () => {
    setErro("");

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (resposta.ok) {
        try {
          const userData = await getUser();
          if (userData.authenticated) {
            setUserLoggedIn(userData.user);
          }
        } catch (e) {
          console.error("Erro ao buscar usuário:", e);
        }

        await refreshUser();

        navigate("/");
      } else {
        const dados = await resposta.json();
        setErro(dados.error || "Credenciais inválidas.");
      }
    } catch (err) {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <Container>
      <div className="login-card">
        <div className="header">
          <img src={backArrow} alt="Voltar" onClick={voltar} />
          <Link to="/">
            <img src={LogoJC} alt="Logo JC" />
          </Link>
        </div>

        <h1>Entrar</h1>

        {erro && <p className="erro">{erro}</p>}

        <section className="inputs-section">
          <div>
            <p>Email</p>
            <input
              type="text"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <p>Senha</p>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </section>

        <section className="logar">
          <button onClick={fazerLogin}>Entrar</button>
          <Link to="/registro">Não tenho uma conta</Link>
        </section>
      </div>
    </Container>
  );
}