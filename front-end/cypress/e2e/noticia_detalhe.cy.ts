/// <reference types="cypress" />

describe("Página de Detalhe da Notícia", () => {
  
  const noticiaMock = {
    id: 99,
    slug: "noticia-teste-detalhe",
    titulo: "Avanços na Tecnologia em 2024",
    reporter: "Maria Jornalista",
    data: "2024-05-20T10:00:00Z",
    resumo: "Um resumo impactante sobre tecnologia.",
    detalhes: "Aqui vai o texto completo da notícia com todos os parágrafos...",
    imagem_url: "https://via.placeholder.com/600x400",
    generos: [{ id: 1, nome: "Tecnologia" }, { id: 2, nome: "Inovação" }]
  };

  context("Usuário NÃO Logado (Visitante)", () => {
    beforeEach(() => {

      cy.intercept("GET", "**/api/noticias/noticia-teste-detalhe*", {
        statusCode: 200,
        body: {
          noticia: noticiaMock,
          is_favorito: false
        }
      }).as("getNoticia");

      cy.intercept("GET", "**/api/user/**", {
        statusCode: 401,
        body: { error: "Não autenticado" }
      }).as("checkUser");

      cy.visit("http://localhost:5173/noticia/noticia-teste-detalhe");
    });

    it("deve renderizar o conteúdo da notícia corretamente", () => {
      cy.wait("@getNoticia");

      cy.get("h1").should("contain", "Avanços na Tecnologia em 2024");
      
      cy.get(".reporter-red").should("contain", "Maria Jornalista");
      
      cy.get(".noticia-meta").should("contain", "2024"); 

      cy.get("img.noticia-imagem")
        .should("be.visible")
        .and("have.attr", "src", noticiaMock.imagem_url);

      cy.get(".noticia-conteudo").should("contain", "texto completo da notícia");

      cy.contains(".genero-badge", "Tecnologia").should("be.visible");
    });

    it("deve mostrar alerta ao tentar favoritar sem login", () => {
      cy.wait("@getNoticia");

      const stub = cy.stub();
      cy.on("window:alert", stub);

      cy.get(".noticia-fav-btn")
        .should("have.attr", "src")
        .and("include", "not-stared"); 

      cy.get(".noticia-fav-btn").click()
        .then(() => {
          // Verifica se o alerta foi chamado com a mensagem correta
          expect(stub.getCall(0)).to.be.calledWith("Faça login para adicionar aos favoritos");
        });
    });
  });

  context("Usuário Logado", () => {
    beforeEach(() => {
      // 1. Mock do Usuário Logado (AuthContext precisa disso)
      cy.intercept("GET", "**/api/user/**", {
        statusCode: 200,
        body: {
          authenticated: true,
          user: { id: 1, name: "Tester", email: "test@test.com" }
        }
      }).as("checkUserLogged");

      // 2. Mock da Notícia (Inicialmente NÃO favoritada)
      cy.intercept("GET", "**/api/noticias/noticia-teste-detalhe*", {
        statusCode: 200,
        body: {
          noticia: noticiaMock,
          is_favorito: false
        }
      }).as("getNoticia");

      // 3. Mocks das ações de Favoritar
      // Supondo que a API seja POST /api/favoritos/ ou similar
      cy.intercept("POST", "**/favorito*", { statusCode: 200 }).as("addFav");
      cy.intercept("DELETE", "**/favorito*", { statusCode: 200 }).as("removeFav");

      cy.visit("http://localhost:5173/noticia/noticia-teste-detalhe");
    });

    it("deve permitir favoritar e desfavoritar a notícia", () => {
      // Espera carregar usuário e notícia
      cy.wait("@getNoticia");
      // As vezes o checkUser demora um pouco no React, aguardamos para garantir
      // que o AuthContext já atualizou o estado "user"
      cy.wait("@checkUserLogged"); 

      // --- CENÁRIO 1: FAVORITAR ---
      
      // Verifica estado inicial (Vazio)
      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "not-stared");

      // Clica para favoritar
      cy.get(".noticia-fav-btn").click();

      // Espera a requisição POST sair
      // (O mock responde 200, então o front atualiza o estado)
      // Nota: Como não sabemos a URL exata do seu serviço 'adicionarFavorito',
      // se o teste falhar no 'wait', remova o cy.wait e confie na mudança visual.
      // cy.wait("@addFav"); 

      // Verifica se a imagem mudou para "stared" (cheia)
      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "stared.png");


      // --- CENÁRIO 2: DESFAVORITAR ---

      // Clica novamente (agora para remover)
      cy.get(".noticia-fav-btn").click();

      // cy.wait("@removeFav");

      // Verifica se voltou a ser "not-stared" (vazia)
      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "not-stared");
    });
  });
});