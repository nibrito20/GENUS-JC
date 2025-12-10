/// <reference types="cypress" />

describe("Barra de Pesquisa", () => {
  
  const noticiaMock = {
    id: 10,
    titulo: "Grande notícia sobre Economia",
    slug: "grande-noticia-economia",
    imagem_url: "https://via.placeholder.com/300",
    generos: [{ nome: "Economia" }]
  };

  beforeEach(() => {

    cy.intercept("GET", "**/api/noticias/*", (req) => {

      if (!req.url.includes("q=")) {
        req.reply({
          statusCode: 200,
    
          body: {
            noticias: [
              noticiaMock, 
              { ...noticiaMock, id: 11, titulo: "Outra notícia" }
            ]
          }
        });
      }
    }).as("getNoticiasIniciais");

    cy.visit("http://localhost:5173/");
    cy.wait("@getNoticiasIniciais");
  });

  it("deve permitir pesquisar uma noticia e encontrar resultados", () => {

    cy.intercept("GET", "**/api/noticias/?q=economia*", {
      statusCode: 200,

      body: {
        noticias: [noticiaMock] 
      }
    }).as("pesquisaEconomia");

    cy.get('img[alt="Buscar"]').first().click();
    cy.get('input[placeholder="Pesquisar"]').type("economia{enter}");

    cy.url().should("contain", "/noticias?q=economia");

    cy.wait("@pesquisaEconomia");


    cy.get(".news-container").should("exist").and("be.visible");
    cy.contains("Grande notícia sobre Economia").should("be.visible");
  });

  it("deve mostrar zero resultados quando nenhuma noticia existe", () => {
    const termo = "asdlkjashdlkajshdlkajshd";

    cy.intercept("GET", `**/api/noticias/?q=${termo}*`, {
      statusCode: 200,

      body: {
        noticias: []
      }
    }).as("pesquisaVazia");

    cy.get('img[alt="Buscar"]').first().click();
    cy.get('input[placeholder="Pesquisar"]').type(`${termo}{enter}`);

    cy.wait("@pesquisaVazia");

    cy.get(".news-container").should("exist");
    cy.get(".news-card-container").should("have.length", 0);
  });
});