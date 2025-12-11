import Navbar from "../components/Navbar";
import { Container4 } from "../components/Container";
import Footer from "../components/Footer";
import { useEffect, useState, useContext } from "react";
import {
  getNoticiaDetalhe,
  adicionarFavorito,
  removerFavorito,
} from "../services/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/noticia.css";
import staredImg from "../assets/icons/stared.png";
import notStaredImg from "../assets/icons/not-stared.png";
import TextToSpeech from "../components/OuvirNoticiaButton";
import { LoadingNews } from "../components/Loading";
import AdSimulator from "../components/AdSimulator";

export default function Noticia() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useContext(AuthContext);

  const [noticia, setNoticia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorito, setFavorito] = useState(false);
  const [relacionadas, setRelacionadas] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    async function carregarNoticia() {
      try {
        setLoading(true);
        const data = await getNoticiaDetalhe(slug as string);

        setNoticia(data.noticia);
        setFavorito(data.is_favorito || false);
        setRelacionadas(data.noticias_relacionadas || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar notícia"
        );
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

  if (loading) return <LoadingNews />;
  if (error) return <div>Erro: {error}</div>;
  if (!noticia) return <div>Notícia não encontrada</div>;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container4>
          <article className="noticia-detalhe">
            <div className="noticia-header">
              <h1>{noticia.titulo}</h1>
            </div>

            <div className="noticia-meta-star">
              <div className="noticia-meta">
                <p className="reporter-p">por</p>
                <span className="reporter-red">{noticia.reporter}</span>
                <span>
                  {new Date(noticia.data).toLocaleDateString("pt-BR")}
                </span>
              </div>

              <img
                src={favorito ? staredImg : notStaredImg}
                alt={favorito ? "Remover favorito" : "Adicionar favorito"}
                onClick={handleFavoritoToggle}
                className={`noticia-fav-btn ${
                  favorito ? "favorito-active" : ""
                }`}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="centralizer-speak-button">
              <TextToSpeech />
            </div>

            {noticia.imagem_url && (
              <img
                src={noticia.imagem_url}
                alt={noticia.titulo}
                className="noticia-imagem"
              />
            )}

            <div id="texto-noticia" className="padding-for-text">
              <p className="noticia-resumo">{noticia.resumo}</p>

              <AdSimulator />

              <div className="noticia-conteudo">{noticia.detalhes}</div>

              <div className="noticia-generos">
                {noticia.generos.map((genero: any) => (
                  <span key={genero.id} className="genero-badge">
                    {genero.nome}
                  </span>
                ))}
              </div>

              <div className="noticias-relacionadas">
                <h2>Notícias relacionadas</h2>

                {relacionadas.length === 0 && (
                  <p>Nenhuma notícia relacionada encontrada.</p>
                )}

                <div className="relacionadas-grid">
                  {relacionadas.map((item) => (
                    <a
                      href={`/noticia/${item.slug}`}
                      key={item.id}
                      className="rel-card"
                    >
                      <img src={item.imagem_url} alt={item.titulo} />
                      <h3>{item.titulo}</h3>
                      <p>{item.resumo}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Container4>
      </div>
      <Footer />
    </>
  );
}
