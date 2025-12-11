import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "../components/Container";

import "../css/registro.css";

import LogoJC from "../assets/imgs/Logo JC.png";
import BackArrow from "../assets/icons/backArrow.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [erro, setErro] = useState("");

  const handleRegister = async () => {
    setErro("");

    if (!nome || !email || !password) {
      setErro("Nome, email e senha são obrigatórios.");
      return;
    }

    if (password !== password2) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nome,
          email,
          data_nascimento: dataNascimento || null,
          telefone: telefone || null,
          password,
          password2,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao registrar.");
        return;
      }

      navigate("/");
    } catch (error) {
      setErro("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <Container>
      <div className="register-card">
        <div className="head">
          <img src={BackArrow} alt="voltar" onClick={() => navigate(-1)} className="back-arrow"/>
          <Link to="/">
            <img src={LogoJC} alt="Logo JC" className="logo"/>
          </Link>
        </div>

        <h1>Registrar-se</h1>

        {erro && <p className="erro">{erro}</p>}

        <section className="input-section">
          <div>
            <p>Nome completo</p>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Email</p>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Data de nascimento</p>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>

          <div>
            <p>Telefone</p>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <p>Senha</p>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Confirmar senha</p>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
        </section>

        <section className="registrar">
          <button onClick={handleRegister}>Registrar</button>
        </section>
      </div>
    </Container>
  );
}
