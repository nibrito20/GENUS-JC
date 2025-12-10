import "../css/personalizacao.css"

import Navbar from "../components/Navbar";
import { Container4 } from "../components/Container";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getGeneros, updateProfileGeneros } from "../services/api";
import { LoadingGender } from "../components/Loading";

import Politica from "../assets/icons/politica-icon.png";
import Mundo from "../assets/icons/mundo-icon.png";
import Pernambuco from "../assets/icons/pernambuco-icon.png";
import Economia from "../assets/icons/economia-icon.png";
import Esportes from "../assets/icons/esportes-icon.png";
import Saude from "../assets/icons/saude-icon.png";
import Educacao from "../assets/icons/educação-icon.png";
import Cultura from "../assets/icons/cultura-icon.png";
import Receitas from "../assets/icons/receitas-icon.png";
import Mobilidade from "../assets/icons/mobilidade-icon.png";
import Seguranca from "../assets/icons/seguranca-icon.png";
import Entretenimento from "../assets/icons/entretenimento-icon.png";
import Arte from "../assets/icons/arte-icon.png";
import Meteorologia from "../assets/icons/meteorologia-icon.png";

export default function Personalizacao() {
  const [generos, setGeneros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MAPA QUE LIGA NOME → ÍCONE
  const iconMap: any = {
    "Política": Politica,
    "Mundo": Mundo,
    "Pernambuco": Pernambuco,
    "Economia": Economia,
    "Esportes": Esportes,
    "Saúde": Saude,
    "Educação": Educacao,
    "Cultura": Cultura,
    "Receitas": Receitas,
    "Mobilidade": Mobilidade,
    "Segurança": Seguranca,
    "Entretenimento": Entretenimento,
    "Arte": Arte,
    "Meteorologia": Meteorologia,
  };

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const data = await getGeneros();
        // Os gêneros já vêm com o campo 'selected' do backend
        setGeneros(data.generos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  async function salvar() {
    const ids = generos.filter(g => g.selected).map(g => g.id);
    try {
      await updateProfileGeneros(ids);
      alert("Preferências salvas!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar preferências");
    }
  }

  return (
    <>
      <Navbar />
      <Container4>
        <section className="personalizacao-section">
          <h1 className="titulo">Personalização de conteúdo</h1>
          <p className="subtitulo">
            Escolha os temas que mais interessam a você
          </p>

          {loading ? (
            <LoadingGender />
          ) : (
            <>
              <div className="generos-grid">
                {generos.map((g, idx) => (
                  <button
                    key={g.id}
                    className={`genero-btn ${g.selected ? "selecionado" : ""}`}
                    onClick={() => {
                      const copy = [...generos];
                      copy[idx].selected = !copy[idx].selected;
                      setGeneros(copy);
                    }}
                  >
                    <span className="genero-icone">
                      <img
                        src={iconMap[g.nome] || Politica}
                        alt={`Ícone de ${g.nome}`}
                        className="gender-img"
                      />
                    </span>

                    <span className="genero-texto">{g.nome}</span>
                  </button>
                ))}
              </div>

              <button className="salvar-btn" onClick={salvar}>
                Salvar preferências
              </button>
            </>
          )}
        </section>
      </Container4>
      <Footer />
    </>
  );
}
