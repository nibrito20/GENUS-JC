import Navbar from "../components/Navbar";
import { Container4 } from "../components/Container";
import { ButtonRed } from "../components/MoreNewsButton";
import { useEffect, useState } from "react";
import { getUser, updateUser } from "../services/api";
import { useNavigate } from "react-router-dom";

import backArrow from "../assets/icons/backArrow.png";

import "../css/perfilinfo.css";

export default function PerfilInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Estado para os campos do formulário
  const [form, setForm] = useState({
    username: "",
    email: "",
    telefone: "",
    nascimento: "",
  });

  const voltar = () => navigate(-1);

  // Carregar dados do usuário
  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const data = await getUser();

        if (data?.user) {
          setForm({
            username: data.user.username || "",
            email: data.user.email || "",
            telefone: data.user.telefone || "",
            nascimento: data.user.nascimento || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  // Atualização dos inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Função para salvar no backend
  async function salvar() {
    try {
      const resp = await updateUser(form);
      alert("Alterações salvas com sucesso!");
      console.log(resp);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações");
    }
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      <Navbar />
      <div>
        <Container4>
          <img src={backArrow} alt="Voltar" onClick={voltar} />
          <h1 className="page-name">Informações da conta</h1>

          <div className="user-info-container">
            <div className="user-info-div">
              <label>Nome de usuário</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="user-info-div">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="user-info-div">
              <label>Telefone</label>
              <input
                name="telefone"
                placeholder="(opcional)"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div className="user-info-div">
              <label>Data de nascimento</label>
              <input
                type="date"
                name="nascimento"
                value={form.nascimento}
                onChange={handleChange}
              />
            </div>

            <ButtonRed
              buttonText="Salvar alterações"
              onClick={salvar}
            />
          </div>
        </Container4>
      </div>
    </>
  );
}