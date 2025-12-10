/// <reference types="cypress" />
describe("Fluxo de Registro", () => {
  it("deve simular um registro com sucesso e redirecionar", () => {
    
    cy.intercept("POST", "**/api/register/", {
      statusCode: 201,
      body: { 
        message: "Usuário criado com sucesso!",
        user: { email: "teste@teste.com", id: 1 } 
      },
    }).as("reqRegistro");

    cy.visit("http://localhost:5173/registro");

    cy.get('input[placeholder="Digite seu usuario"]').type("novo@teste.com");
    cy.get('input[placeholder="Digite sua senha"]').type("123456");
    cy.get('input[placeholder="Confirme sua senha"]').type("123456");

    cy.contains("button", "Registrar").click();

    cy.wait("@reqRegistro");

    cy.url().should("include", "/login");
  });
});