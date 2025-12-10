import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getGeneros } from "../services/api";
import "../css/configuracoes.css";
import { LoadingNews } from "../components/Loading";

export default function Configuracoes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [generos, setGeneros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function carregarGeneros() {
      try {
        const data = await getGeneros();
        setGeneros(data.generos);
      } catch (err) {
        console.error("Erro ao carregar gêneros:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarGeneros();
  }, [user, navigate]);

  if (loading) return (<LoadingNews />);

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <section className="section-gap">
            <h1>Configurações da Conta</h1>
            <div className="config-section">
              <h2>Foto do Perfil</h2>
              <p>Adicione ou altere sua foto de perfil aqui.</p>
            </div>

            <div className="config-section">
              <h2>Gêneros Favoritos</h2>
              <p>Selecione seus gêneros favoritos:</p>
              <div className="generos-list">
                {generos.map((genero) => (
                  <label key={genero.id}>
                    <input type="checkbox" value={genero.id} />
                    {genero.nome}
                  </label>
                ))}
              </div>
            </div>

            <div className="config-section">
              <h2>Segurança</h2>
              <p>Altere sua senha aqui.</p>
            </div>
          </section>
        </Container3>
      </div>
      <Footer />
    </>
  );
}
