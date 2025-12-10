import Navbar from "../components/Navbar";
import { Container4 } from "../components/Container";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { getNoticias } from "../services/api";
import { useLocation } from "react-router-dom";
import { LoadingNews } from "../components/Loading";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Noticias() {
  const location = useLocation();
  const query = useQuery();

  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);

        const q = query.get("q") || undefined;
        const section = query.get("section") || undefined;
        const genero = query.get("genero") || undefined;

        let ordenacao = "-data";
        if (section === "recentes") ordenacao = "-data";
        if (section === "antigas") ordenacao = "data";

        const data = await getNoticias(q, genero, ordenacao, 50, 0);
        setNoticias(data.noticias || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [location.search]);

  if (loading) return (<LoadingNews />);
  if (error) return <div>Erro: {error}</div>;

  // título da página
  const genero = query.get("genero");
  const section = query.get("section");

  const pageTitle =
    genero ? genero :
    section ? section :
    "";

  return (
    <>
      <Navbar />
      <Container4>
        <h1 className="page-header">Notícias {pageTitle ? `/ ${pageTitle}` : ""}</h1>
      </Container4>

      <div className="news-container">
        {noticias.map((noticia) => (
          <NewsCard
            key={noticia.id}
            noticia_id={noticia.id}
            newsImg={noticia.imagem_url || ""}
            newsTitle={noticia.titulo}
            topicLink={`/noticia/${noticia.slug}`}
            newsTopic={{ topicTitle: noticia.generos[0]?.nome || "Geral" }}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}
