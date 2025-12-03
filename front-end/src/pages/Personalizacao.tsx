import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getGeneros, updateProfileGeneros } from "../services/api";

export default function Personalizacao() {
  const [generos, setGeneros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const data = await getGeneros();
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
      alert('Preferências salvas!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar preferências');
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <section className="section-gap">
            <h1>Personalização de conteúdo</h1>
            {loading ? (
              <p>Carregando gêneros...</p>
            ) : (
              <div>
                <div className="generos-list">
                  {generos.map((g, idx) => (
                    <label key={g.id}>
                      <input
                        type="checkbox"
                        checked={!!g.selected}
                        onChange={() => {
                          const copy = [...generos];
                          copy[idx].selected = !copy[idx].selected;
                          setGeneros(copy);
                        }}
                      />
                      {g.nome}
                    </label>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <button onClick={salvar}>Salvar preferências</button>
                </div>
              </div>
            )}
          </section>
        </Container3>
      </div>
      <Footer />
    </>
  );
}
