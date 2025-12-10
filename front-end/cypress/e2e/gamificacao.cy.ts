/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Página de Gamificação (Cacto)", () => {
  
  beforeEach(() => {

    cy.intercept("GET", "**/api/user/**", {
      statusCode: 200,
      body: { 
        authenticated: true, 
        user: { id: 1, name: "Gamer", email: "gamer@teste.com" } 
      }
    }).as("checkUser");

    cy.intercept("GET", "**gamificacao*", {
      statusCode: 200,
      body: {
        sequencia: 12,
        dias_restantes: 5, 
        imagem_url: "" 
      }
    }).as("getGamificacao");

    cy.visit("http://localhost:5173/cacto");
  });

  it("deve carregar as estatísticas e a imagem do cacto corretamente", () => {
    cy.wait("@getGamificacao");
    
    cy.get("h1.h1-margin").should("contain", "Cacto");

    cy.get("img.cacto-representation")
      .should("be.visible")
      .and("have.attr", "src")
      .and("include", "cacto2.png"); 

    cy.get(".cacto-statistics").within(() => {

      cy.contains("Dias consecutivos").should("be.visible");
      cy.contains("12").should("be.visible");

      cy.contains("Dias para o Próximo visual").should("be.visible");
      
      cy.contains("5").should("be.visible");

      cy.contains("Para acumular dias e subir o nível").should("be.visible");
    });
  });

  it("deve permitir voltar para a página anterior", () => {
    cy.get(".arrowback").should("be.visible").click();
    cy.get(".arrowback").should("not.exist");
  });
});