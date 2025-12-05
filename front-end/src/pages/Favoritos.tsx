import Navbar from "../components/Navbar";
import Container, { Container4 } from "../components/Container";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { getFavoritos } from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/favoritos.css";

export default function Favoritos() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function carregarFavoritos() {
      try {
        setLoading(true);
        const data = await getFavoritos();
        setFavoritos(data.favoritos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar favoritos"
        );
      } finally {
        setLoading(false);
      }
    }

    carregarFavoritos();
  }, [user, navigate]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  const handleRemoverFavorito = (noticia_id: number) => {
    setFavoritos(favoritos.filter((fav) => fav.noticia.id !== noticia_id));
  };

  return (
    <>
      <Navbar />

      <Container4>
        <h1>Meus Favoritos</h1>
      </Container4>
      {favoritos.length === 0 ? (
        <Container>
          <p>Você não tem notícias favoritas ainda.</p>
        </Container>
      ) : (
        <div className="news-container">
          {favoritos.map((fav) => (
            <NewsCard
              key={fav.id}
              noticia_id={fav.noticia.id}
              newsImg={fav.noticia.imagem_url || ""}
              newsTitle={fav.noticia.titulo}
              topicLink={`/noticia/${fav.noticia.slug}`}
              newsTopic={{
                topicTitle: fav.noticia.generos[0]?.nome || "Geral",
              }}
              isFavorito={true}
              onFavoritoChange={(isFavorito) => {
                if (!isFavorito) {
                  handleRemoverFavorito(fav.noticia.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
