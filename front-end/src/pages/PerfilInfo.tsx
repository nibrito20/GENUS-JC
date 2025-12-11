import Navbar from "../components/Navbar";
import { Container4 } from "../components/Container";
import { ButtonRed } from "../components/MoreNewsButton";
import { useEffect, useState } from "react";
import { getUser, updateUser } from "../services/api";
import { useNavigate } from "react-router-dom";

import backArrow from "../assets/icons/backArrow.png";

import "../css/perfilinfo.css";
import { LoadingInfo } from "../components/Loading";

export default function PerfilInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Estado para os campos do formulário
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  // Campos somente leitura (não podem ser alterados)
  const [readOnlyFields, setReadOnlyFields] = useState({
    telefone: "",
    data_nascimento: "",
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
            password: "",
            password2: "",
          });

          // Campos somente leitura do profile
          setReadOnlyFields({
            telefone: data.user.profile?.telefone || "",
            data_nascimento: data.user.profile?.data_nascimento || "",
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
      // Validar senhas se fornecidas
      if (form.password && form.password !== form.password2) {
        alert("As senhas não coincidem.");
        return;
      }

      if (form.password && form.password.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres.");
        return;
      }

      // Preparar dados para envio (sem telefone e nascimento)
      const dataToSend: any = {
        username: form.username,
        email: form.email,
      };

      // Incluir senha apenas se fornecida
      if (form.password) {
        dataToSend.password = form.password;
      }

      const resp = await updateUser(dataToSend);
      alert("Alterações salvas com sucesso!");
      
      // Limpar campos de senha após salvar
      setForm({
        ...form,
        password: "",
        password2: "",
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao salvar alterações");
    }
  }

  if (loading) return (<LoadingInfo />);

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
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="user-info-div">
              <label>Nova senha (deixe em branco para não alterar)</label>
              <input
                type="password"
                name="password"
                placeholder="Digite a nova senha"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="user-info-div">
              <label>Confirmar nova senha</label>
              <input
                type="password"
                name="password2"
                placeholder="Confirme a nova senha"
                value={form.password2}
                onChange={handleChange}
              />
            </div>

            <div className="user-info-div">
              <label>Telefone (somente leitura)</label>
              <input
                type="tel"
                name="telefone"
                value={readOnlyFields.telefone || "Não informado"}
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            </div>

            <div className="user-info-div">
              <label>Data de nascimento (somente leitura)</label>
              <input
                type="date"
                name="data_nascimento"
                value={readOnlyFields.data_nascimento || ""}
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
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