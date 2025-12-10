/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Funcionalidade Ouvir Notícia (Text-to-Speech)", () => {
  
  const noticiaMock = {
    id: 100,
    slug: "noticia-para-ouvir",
    titulo: "Notícia para Teste de Áudio",
    reporter: "Repórter Sônico",
    data: "2024-05-20T10:00:00Z",
    resumo: "Este é o resumo que será lido pelo robô.",
    detalhes: "Conteúdo completo...",
    imagem_url: "https://via.placeholder.com/600",
    generos: [{ id: 1, nome: "Audio" }]
  };

  beforeEach(() => {

    cy.intercept("GET", "**/api/noticias/noticia-para-ouvir*", {
      statusCode: 200,
      body: {
        noticia: noticiaMock,
        is_favorito: false
      }
    }).as("getNoticia");


    cy.intercept("GET", "**/api/user/**", {
      statusCode: 200,
      body: { authenticated: true, user: { name: "Tester" } }
    });
  });

  it("deve acionar o sintetizador de voz ao clicar no botão", () => {
    cy.visit("http://localhost:5173/noticia/noticia-para-ouvir", {
      onBeforeLoad(win) {

        cy.stub(win.speechSynthesis, "speak").as("speakSpy");
        cy.stub(win.speechSynthesis, "cancel").as("cancelSpy");
      },
    });

    cy.wait("@getNoticia");


    cy.get(".centralizer-speak-button").should("be.visible").click();


    cy.get("@speakSpy").should("have.been.calledOnce");

    cy.get("@speakSpy").should((spy: any) => {
      const utterance = spy.args[0][0]; 
      expect(utterance.text).to.contain(noticiaMock.resumo);
    });
  });

});