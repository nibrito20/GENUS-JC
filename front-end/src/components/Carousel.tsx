import { useState, useEffect } from "react";
import "../css/carousel.css";

type Slide = {
  image: string;
  title: string;
};

type CarouselProps = {
  slides: Slide[];
};

const Carousel = ({ slides }: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  // Auto slide (troca a cada 5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          className={`carousel-slide ${index === current ? "active" : ""} ${
            index === 0 ? "initial" : ""
          }`}
          key={index}
        >
          <img src={slide.image} alt={slide.title} className="carousel-image" />

          {/* Overlay com degradê */}
          <div className="carousel-overlay">
            <h2 className="carousel-title">{slide.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
