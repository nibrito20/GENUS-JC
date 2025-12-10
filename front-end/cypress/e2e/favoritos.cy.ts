/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Funcionalidade: Adicionar aos Favoritos", () => {
  
  const noticiaMock = {
    id: 50,
    slug: "noticia-favorita",
    titulo: "Notícia Incrível",
    reporter: "Reporter Teste",
    data: "2024-05-20T10:00:00Z",
    resumo: "Resumo da notícia.",
    detalhes: "Conteúdo...",
    imagem_url: "https://via.placeholder.com/600",
    generos: [{ id: 1, nome: "Geral" }]
  };

  context("Usuário Visitante (Sem Login)", () => {
    beforeEach(() => {

      cy.intercept("GET", "**/api/noticias/noticia-favorita*", {
        statusCode: 200,
        body: { noticia: noticiaMock, is_favorito: false }
      }).as("getNoticia");


      cy.intercept("GET", "**/api/user/**", {
        statusCode: 401,
        body: { error: "Não autenticado" }
      }).as("checkUserGuest");

      cy.visit("http://localhost:5173/noticia/noticia-favorita");
    });

    it("deve exibir um alerta pedindo login ao clicar na estrela", () => {
      cy.wait("@getNoticia");


      const stub = cy.stub();
      cy.on("window:alert", stub);

      cy.get(".noticia-fav-btn").click();


      cy.then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Faça login para adicionar aos favoritos");
      });
    });
  });

  
  context("Usuário Logado", () => {
    beforeEach(() => {
      
      cy.intercept("GET", "**/api/user/**", {
        statusCode: 200,
        body: { 
          authenticated: true, 
          user: { id: 1, name: "Usuario Teste", email: "teste@teste.com" } 
        }
      }).as("checkUserLogged");

      cy.intercept("POST", "**", { statusCode: 200, body: { success: true } }).as("addFav");
      cy.intercept("DELETE", "**", { statusCode: 200, body: { success: true } }).as("removeFav");
    });

    it("deve favoritar (estrela cheia) e desfavoritar (estrela vazia)", () => {
      
      cy.intercept("GET", "**/api/noticias/noticia-favorita*", {
        statusCode: 200,
        body: { noticia: noticiaMock, is_favorito: false }
      }).as("getNoticiaFalse");

      cy.visit("http://localhost:5173/noticia/noticia-favorita");
      cy.wait("@getNoticiaFalse");
      cy.wait("@checkUserLogged"); 

      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "not-stared");

      cy.get(".noticia-fav-btn").click();

      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "stared.png");

      cy.get(".noticia-fav-btn").click();

      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "not-stared");
    });

    it("deve carregar a página já com a estrela cheia se a API disser que é favorito", () => {
    
      cy.intercept("GET", "**/api/noticias/noticia-favorita*", {
        statusCode: 200,
        body: { noticia: noticiaMock, is_favorito: true }
      }).as("getNoticiaTrue");

      cy.visit("http://localhost:5173/noticia/noticia-favorita");
      cy.wait("@getNoticiaTrue");

      cy.get(".noticia-fav-btn")
        .should("have.attr", "src").and("include", "stared.png");
    });
  });
});