import "../css/home.css";

import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Topic from "../components/Topic";
import Carousel from "../components/Carousel";
import NewsCard from "../components/NewsCard";
import MoreNewsButton from "../components/MoreNewsButton";
import { DividerTopic } from "../components/Topic";
import AdSimulator, { AdSimulator2 } from "../components/AdSimulator";
import ChargeCard from "../components/ChargeCard";
import Colunista from "../components/Colunista";
import Footer from "../components/Footer";

import CarouselEx1 from "../assets/imgs/carousel-ex1.png";
import CarouselEx2 from "../assets/imgs/carousel-ex2.png";
import CarouselEx3 from "../assets/imgs/carousel-ex3.png";
import CarouselEx4 from "../assets/imgs/carousel-ex4.png";
import CarouselEx5 from "../assets/imgs/carousel-ex5.png";

import Colunista1 from "../assets/imgs/Colunista1.png";
import Colunista2 from "../assets/imgs/Colunista2.png";
import Colunista3 from "../assets/imgs/Colunista3.png";
import Colunista4 from "../assets/imgs/Colunista4.png";
import Colunista5 from "../assets/imgs/Colunista5.png";
import Colunista6 from "../assets/imgs/Colunista6.png";

import DayleCharge from "../assets/imgs/dayle-charge.png";

export default function Home() {
  const slides = [
    { image: CarouselEx1, title: "Greve no metrô chega ao 3º dia" },
    { image: CarouselEx2, title: "Estações continuam fechadas" },
    { image: CarouselEx3, title: "Ônibus ficam lotados" },
    { image: CarouselEx4, title: "Sindicato pede negociação" },
    { image: CarouselEx5, title: "Cidades buscam alternativas" },
  ];
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <section className="section-gap">
            <Topic topicTitle="Relevantes" />
            <Carousel slides={slides} />
          </section>
          <section className="section-gap"></section>
          <section className="section-gap">
            <Topic topicTitle="Recentes" />
            <div className="news-container">
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/" />
          </section>
          <section className="section-gap">
            <AdSimulator />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Para você" />
            <Carousel slides={slides} />
            <div className="news-container">
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Política" }}
              />
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/" />
          </section>
          <section className="section-gap">
            <AdSimulator />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Blog do torcedor" />
            <Carousel slides={slides} />
            <div className="news-container">
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Blog do torcedor" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Blog do torcedor" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Blog do torcedor" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Blog do torcedor" }}
              />
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/" />
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
            <Carousel slides={slides} />
            <div className="news-container">
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/" />
          </section>
          <section className="section-gap">
            <DividerTopic topicTitle="Entrete nimento" />
            <Carousel slides={slides} />
            <div className="news-container">
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
              <NewsCard
                newsImg={CarouselEx2}
                newsTitle="sei la o que sei la o que"
                newsTopic={{ topicTitle: "Segurança" }}
              />
            </div>
            <MoreNewsButton buttonText="Ver mais" buttonLink="/" />
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
