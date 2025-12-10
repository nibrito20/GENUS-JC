/// <reference types="cypress" />

describe("Login", () => {
  
  it("deve fazer login com sucesso (Simulado)", () => {

    cy.intercept("POST", "**/api/login/", {
      statusCode: 200,
      body: { success: true }
    }).as("loginReq");

    cy.intercept("GET", "**/api/user/**", {
      statusCode: 200,
      body: {
        authenticated: true,
        user: { 
          id: 1, 
          email: "usuario@teste.com", 
          name: "Usuário Teste",
          foto: "" 
        }
      }
    }).as("userCheck");

    cy.visit("http://localhost:5173/login");

    cy.get('input[placeholder="Digite seu Usuario"]').type("usuario@teste.com");
    cy.get('input[placeholder="Digite sua senha"]').type("senha123");

    cy.contains("button", "Entrar").click();

    cy.wait("@loginReq");

    cy.wait("@userCheck"); 

    cy.url().should("eq", "http://localhost:5173/");
    
  });

  it("deve mostrar erro ao tentar login inválido", () => {

    cy.intercept("POST", "**/api/login/", {
      statusCode: 401,
      body: { error: "Credenciais inválidas." }
    }).as("loginFalha");

    cy.visit("http://localhost:5173/login");

    cy.get('input[placeholder="Digite seu Usuario"]').type("errado@teste.com");
    cy.get('input[placeholder="Digite sua senha"]').type("senhaerrada");

    cy.contains("button", "Entrar").click();

    cy.wait("@loginFalha");

    cy.get("p.erro").should("be.visible");
    cy.url().should("include", "/login");
  });
});