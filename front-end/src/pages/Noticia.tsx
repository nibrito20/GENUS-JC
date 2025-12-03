import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Footer from "../components/Footer";
import { useEffect, useState, useContext } from "react";
import { getNoticiaDetalhe, adicionarFavorito, removerFavorito } from "../services/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/noticia.css";
import staredImg from "../assets/icons/stared.png";
import notStaredImg from "../assets/icons/notStared.png";

export default function Noticia() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useContext(AuthContext);
  const [noticia, setNoticia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function carregarNoticia() {
      try {
        setLoading(true);
        const data = await getNoticiaDetalhe(slug as string);
        setNoticia(data.noticia);
        setFavorito(data.is_favorito || false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar notícia");
      } finally {
        setLoading(false);
      }
    }

    carregarNoticia();
  }, [slug]);

  const handleFavoritoToggle = async () => {
    if (!user) {
      alert("Faça login para adicionar aos favoritos");
      return;
    }

    if (!noticia) return;

    try {
      setLoading(true);
      if (favorito) {
        await removerFavorito(noticia.id);
        setFavorito(false);
      } else {
        await adicionarFavorito(noticia.id);
        setFavorito(true);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
      alert("Erro ao atualizar favorito");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!noticia) return <div>Notícia não encontrada</div>;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <article className="noticia-detalhe">
            <div className="noticia-header">
              <h1>{noticia.titulo}</h1>
              <img
                src={favorito ? staredImg : notStaredImg}
                alt={favorito ? "Remover favorito" : "Adicionar favorito"}
                onClick={handleFavoritoToggle}
                className={`noticia-fav-btn ${favorito ? "favorito-active" : ""}`}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="noticia-meta">
              <span>{noticia.reporter}</span>
              <span>{new Date(noticia.data).toLocaleDateString("pt-BR")}</span>
            </div>
            {noticia.imagem_url && (
              <img src={noticia.imagem_url} alt={noticia.titulo} className="noticia-imagem" />
            )}
            <p className="noticia-resumo">{noticia.resumo}</p>
            <div className="noticia-conteudo">{noticia.detalhes}</div>
            <div className="noticia-generos">
              {noticia.generos.map((genero: any) => (
                <span key={genero.id} className="genero-badge">
                  {genero.nome}
                </span>
              ))}
            </div>
          </article>
        </Container3>
      </div>
      <Footer />
    </>
  );
}
