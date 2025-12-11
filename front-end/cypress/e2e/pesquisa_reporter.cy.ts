/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Funcionalidade: Pesquisar por Repórter (Barra Principal)", () => {
  
  const nomeReporter = "Jornalista Teste";
  
  const noticiaDoReporterMock = {
    id: 500,
    slug: "noticia-do-reporter",
    titulo: "Matéria Exclusiva do Repórter",
    resumo: "Esta notícia deve aparecer na busca.",
    reporter: nomeReporter,
    data: "2024-06-01T10:00:00Z",
    imagem_url: "https://via.placeholder.com/300",
    generos: [{ id: 1, nome: "Geral" }]
  };

  beforeEach(() => {
    // Mock do Utilizador
    cy.intercept("GET", "**/api/user/**", {
      statusCode: 200,
      body: { authenticated: true, user: { name: "Leitor" } }
    }).as("checkUser");

    // Mock da Home
    cy.intercept("GET", "**/api/noticias/*", (req) => {
      if (!req.url.includes("q=")) {
        req.reply({
          statusCode: 200,
          body: {
            noticias: [
              { ...noticiaDoReporterMock, id: 999, titulo: "Outra Notícia", reporter: "Outro Fulano" }
            ]
          }
        });
      }
    }).as("getHome");

    cy.visit("http://localhost:5173/");
    cy.wait("@getHome");
  });

  it("deve encontrar a notícia ao escrever o nome do repórter na barra de busca", () => {
    // CORREÇÃO AQUI:
    // Em vez de tentar adivinhar se o navegador vai usar %20 ou +,
    // usamos o * entre os nomes (Jornalista*Teste) para aceitar qualquer um dos dois.
    cy.intercept("GET", `**/api/noticias/?q=Jornalista*Teste*`, {
      statusCode: 200,
      body: {
        noticias: [noticiaDoReporterMock]
      }
    }).as("pesquisaReporter");

    cy.get('img[alt="Buscar"]').first().click();
    cy.get('input[placeholder="Pesquisar"]').type(`${nomeReporter}{enter}`);

    // Validação de URL mais flexível também
    cy.url().should("include", "/noticias?q=");
    
    // Agora o wait deve funcionar
    cy.wait("@pesquisaReporter");

    cy.get(".news-container").should("be.visible");
    cy.contains("Matéria Exclusiva do Repórter").should("be.visible");
  });

  it("deve mostrar zero resultados para um repórter inexistente", () => {
    const reporterFantasma = "Gasparzinho";

    cy.intercept("GET", `**/api/noticias/?q=${reporterFantasma}*`, {
      statusCode: 200,
      body: { noticias: [] }
    }).as("pesquisaVazia");

    cy.get('img[alt="Buscar"]').first().click();
    cy.get('input[placeholder="Pesquisar"]').type(`${reporterFantasma}{enter}`);

    cy.wait("@pesquisaVazia");

    cy.get(".news-card-container").should("have.length", 0);
  });
});