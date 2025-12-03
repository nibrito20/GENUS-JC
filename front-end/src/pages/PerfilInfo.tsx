import Navbar from "../components/Navbar";
import { Container3 } from "../components/Container";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";

export default function PerfilInfo() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const data = await getUser();
        setUser(data.user || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Container3>
          <section className="section-gap">
            <h1>Informações da conta</h1>
            {user ? (
              <div>
                <label>Nome de usuário</label>
                <input defaultValue={user.username} />

                <label>Email</label>
                <input defaultValue={user.email} />

                <label>Telefone</label>
                <input placeholder="(opcional)" />

                <label>Data de nascimento</label>
                <input type="date" />

                <div style={{ marginTop: 16 }}>
                  <button>Salvar alterações</button>
                </div>
              </div>
            ) : (
              <p>Usuário não autenticado</p>
            )}
          </section>
        </Container3>
      </div>
      <Footer />
    </>
  );
}
