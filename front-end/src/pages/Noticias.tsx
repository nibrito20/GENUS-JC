import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { getNoticias } from "../services/api";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Noticias() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const q = query.get("q") || undefined;
        const section = query.get("section") || undefined;
        const genero = query.get("genero") || undefined;
        let ordenacao = "-data";

        // se section for 'recentes' usamos ordenacao decrescente
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
  }, [useLocation().search]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <section className="section-gap">
            <h1>Notícias</h1>
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
          </section>
        </Container3>
      </div>
      <Footer />
    </>
  );
}
