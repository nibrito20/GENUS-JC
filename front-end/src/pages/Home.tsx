import "../css/home.css";

import Navbar from "../components/Navbar";
import { Container2 } from "../components/Container";
import Topic from "../components/Topic";
import Carousel from "../components/Carousel";
import NewsCard from "../components/NewsCard";
import MoreNewsButton from "../components/MoreNewsButton";
import { DividerTopic } from "../components/Topic";
import AdSimulator from "../components/AdSimulator";

import CarouselEx1 from "../assets/imgs/carousel-ex1.png";
import CarouselEx2 from "../assets/imgs/carousel-ex2.png";
import CarouselEx3 from "../assets/imgs/carousel-ex3.png";
import CarouselEx4 from "../assets/imgs/carousel-ex4.png";
import CarouselEx5 from "../assets/imgs/carousel-ex5.png";

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
      <Container2>
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
      </Container2>
    </>
  );
}
