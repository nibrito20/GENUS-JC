import React, { useEffect } from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import useEmblaCarousel from 'embla-carousel-react'
import { Link } from 'react-router-dom'
import '../css/embla-carousel.css'

type Slide = {
  image: string
  title: string
  slug: string
}

type PropType = {
  slides: Slide[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides } = props
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    containScroll: false,
  })

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  // Auto-play a cada 7.5 segundos
  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 7500)

    return () => clearInterval(interval)
  }, [emblaApi])

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <Link to={`/noticia/${slide.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', width: '100%', height: 'var(--slide-height)' }}>
                  <img src={slide.image} alt={slide.title} className="embla__slide__image" />
                  <div className="embla__slide__overlay">
                    <h2 className="embla__slide__title">{slide.title}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
