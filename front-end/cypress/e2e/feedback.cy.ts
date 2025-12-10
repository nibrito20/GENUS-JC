/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Página de Feedback", () => {
  
  beforeEach(() => {
   
    cy.intercept("GET", "**/api/user/**", {
      statusCode: 200,
      body: { 
        authenticated: true, 
        user: { id: 1, name: "Usuario Feedback" } 
      }
    });

    cy.visit("http://localhost:5173/feedback");
  });

  it("deve manter o botão desabilitado até preencher estrelas e comentário", () => {

    cy.get(".feedback-button").should("be.disabled");

    cy.get(".star").eq(2).click(); 
    
    cy.get(".feedback-button").should("be.disabled");

    cy.reload();

    cy.get(".feedback-textarea").type("Apenas texto sem nota");
    
    cy.get(".feedback-button").should("be.disabled");

    cy.get(".star").eq(4).click();
    
    cy.get(".feedback-button").should("not.be.disabled");
  });

  it("deve enviar feedback com sucesso e limpar o formulário", () => {

    cy.intercept("POST", "**/api/feedback/", {
      statusCode: 200,
      body: { success: true } 
    }).as("enviarFeedback");

    const stub = cy.stub();
    cy.on("window:alert", stub);

    cy.get(".star").last().click();
    
    cy.get(".star.selected").should("have.length", 5);

    const textoFeedback = "Adorei a experiência gamificada!";
    cy.get(".feedback-textarea").type(textoFeedback);

    cy.get(".feedback-button").click();

    cy.wait("@enviarFeedback").then((interception) => {

       expect(interception.request.body).to.include("estrelas=5");
       expect(interception.request.body).to.include("detalhes=");
    });

    cy.wrap(stub).should("be.calledWith", "Feedback enviado!");

    cy.get(".feedback-textarea").should("have.value", "");
    cy.get(".star.selected").should("have.length", 0); 
  });

  it("deve mostrar erro se a API falhar", () => {
    cy.intercept("POST", "**/api/feedback/", {
      statusCode: 200, 
      body: { success: false } 
    }).as("falhaFeedback");

    const stub = cy.stub();
    cy.on("window:alert", stub);

    cy.get(".star").first().click(); 
    cy.get(".feedback-textarea").type("Não funcionou bem.");
    cy.get(".feedback-button").click();

    cy.wait("@falhaFeedback");

    cy.wrap(stub).should("be.calledWith", "Erro ao enviar feedback.");
    
    cy.get(".feedback-textarea").should("have.value", "Não funcionou bem.");
  });

});