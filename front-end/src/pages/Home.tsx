import "../css/home.css";

import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Topic from "../components/Topic";
import EmblaCarousel from "../components/EmblaCarousel";
import NewsCard from "../components/NewsCard";
import MoreNewsButton from "../components/MoreNewsButton";
import { DividerTopic } from "../components/Topic";
import AdSimulator, { AdSimulator2 } from "../components/AdSimulator";
import ChargeCard from "../components/ChargeCard";
import Colunista from "../components/Colunista";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getNoticias } from "../services/api";

import Colunista1 from "../assets/imgs/Colunista1.png";
import Colunista2 from "../assets/imgs/Colunista2.png";
import Colunista3 from "../assets/imgs/Colunista3.png";
import Colunista4 from "../assets/imgs/Colunista4.png";
import Colunista5 from "../assets/imgs/Colunista5.png";
import Colunista6 from "../assets/imgs/Colunista6.png";

import DayleCharge from "../assets/imgs/dayle-charge.png";

export default function Home() {
  const [slides, setSlides] = useState<any[]>([]);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        // Carregar notícias para o carousel (relevantes)
        const dataRelevantes = await getNoticias(
          undefined,
          undefined,
          "-data",
          5,
          0
        );
        if (dataRelevantes.noticias) {
          const slidesFormatados = dataRelevantes.noticias.map(
            (noticia: any) => ({
              image: noticia.imagem_url || "",
              title: noticia.titulo,
              slug: noticia.slug,
            })
          );
          setSlides(slidesFormatados);
        }

        // Carregar notícias para exibição
        const dataRecentes = await getNoticias(
          undefined,
          undefined,
          "-data",
          20,
          0
        );
        if (dataRecentes.noticias) {
          setNoticias(dataRecentes.noticias);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) {
    return <div className="loading">Carregando notícias...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <section className="section-gap">
            <Topic topicTitle="Relevantes" />
            {slides.length > 0 && <EmblaCarousel slides={slides} options={{ loop: true }} />}
          </section>
          <section className="section-gap"></section>
          <section className="section-gap">
            <Topic topicTitle="Recentes" />
            <div className="news-container">
              {noticias.slice(0, 4).map((noticia) => (
                <NewsCard
                  key={noticia.id}
                  noticia_id={noticia.id}
                  newsImg={noticia.imagem_url || ""}
                  newsTitle={noticia.titulo}
                  topicLink={`/noticia/${noticia.slug}`}
                  newsTopic={{
                    topicTitle: noticia.generos[0]?.nome || "Geral",
                  }}
                />
              ))}
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/noticias?section=recentes" />
          </section>
          <section className="section-gap">
            <AdSimulator />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Para você" />
            <div className="news-container">
              {noticias.slice(4, 8).map((noticia) => (
                <NewsCard
                  key={noticia.id}
                  noticia_id={noticia.id}
                  newsImg={noticia.imagem_url || ""}
                  newsTitle={noticia.titulo}
                  topicLink={`/noticia/${noticia.slug}`}
                  newsTopic={{
                    topicTitle: noticia.generos[0]?.nome || "Geral",
                  }}
                />
              ))}
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/noticias?section=para-voce" />
          </section>
          <section className="section-gap">
            <AdSimulator />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Blog do torcedor" />
            <div className="news-container">
              {noticias.slice(8, 12).map((noticia) => (
                <NewsCard
                  key={noticia.id}
                  noticia_id={noticia.id}
                  newsImg={noticia.imagem_url || ""}
                  newsTitle={noticia.titulo}
                  topicLink={`/noticia/${noticia.slug}`}
                  newsTopic={{ topicTitle: "Blog do torcedor" }}
                />
              ))}
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/noticias?genero=Blog%20do%20torcedor" />
          </section>
          <section className="section-gap">
            <div className="charge-container">
              <AdSimulator2 />
              <ChargeCard
                newsTopic={{ topicTitle: "Charge do dia" }}
                newsImg={DayleCharge}
              />
            </div>
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Vídeos da TV jornal" />
            <div className="news-container">
              {noticias.slice(12, 16).map((noticia) => (
                <NewsCard
                  key={noticia.id}
                  noticia_id={noticia.id}
                  newsImg={noticia.imagem_url || ""}
                  newsTitle={noticia.titulo}
                  topicLink={`/noticia/${noticia.slug}`}
                  newsTopic={{ topicTitle: "Segurança" }}
                />
              ))}
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/noticias?section=videos" />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Entretenimento" />
            <div className="news-container">
              {noticias.slice(16, 20).map((noticia) => (
                <NewsCard
                  key={noticia.id}
                  noticia_id={noticia.id}
                  newsImg={noticia.imagem_url || ""}
                  newsTitle={noticia.titulo}
                  topicLink={`/noticia/${noticia.slug}`}
                  newsTopic={{ topicTitle: "Segurança" }}
                />
              ))}
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/noticias?section=entretenimento" />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Colunistas" />
            <div className="colunistas-container">
              <Colunista colunistaImg={Colunista1} />
              <Colunista colunistaImg={Colunista2} />
              <Colunista colunistaImg={Colunista3} />
              <Colunista colunistaImg={Colunista4} />
              <Colunista colunistaImg={Colunista5} />
              <Colunista colunistaImg={Colunista6} />
            </div>
          </section>
        </Container3>
      </div>
      <Footer />
    </>
  );
}
