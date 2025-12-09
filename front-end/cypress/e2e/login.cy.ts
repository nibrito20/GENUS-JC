describe("Login", () => {

  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/register/",
      body: {
        email: "cypress_user@gmail.com",
        password: "cypress_password",
        password2: "cypress_password",
      },
      failOnStatusCode: false,
    });
  });

  it("deve fazer login com sucesso", () => {
    cy.intercept("GET", "http://localhost:8000/api/user/").as("userCheck");
    cy.intercept("POST", "http://localhost:8000/api/login/").as("loginReq");

    cy.visit("http://localhost:5173/login");

    cy.wait("@userCheck");

    cy.get('input[placeholder="Digite seu Usuario"]', { timeout: 10000 })
      .should("be.visible")
      .type("cypress_user@gmail.com");

    cy.get('input[placeholder="Digite sua senha"]', { timeout: 10000 })
      .should("be.visible")
      .type("cypress_password");

    cy.contains("button", "Entrar").click();

    cy.wait("@loginReq").its("response.statusCode").should("eq", 200);

    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    cy.contains(/| Relevantes|Recentes/, { timeout: 10000 }).should("be.visible");
  });

  it("deve mostrar erro ao tentar login inválido", () => {
    cy.intercept("GET", "http://localhost:8000/api/user/").as("userCheck");
    cy.intercept("POST", "http://localhost:8000/api/login/").as("loginReq");

    cy.visit("http://localhost:5173/login");

    cy.wait("@userCheck");

    cy.get('input[placeholder="Digite seu Usuario"]', { timeout: 10000 })
      .should("be.visible")
      .type("email@que.nao.existe.com");

    cy.get('input[placeholder="Digite sua senha"]', { timeout: 10000 })
      .should("be.visible")
      .type("senhaerrada");

    cy.contains("button", "Entrar").click();

    cy.wait("@loginReq").its("response.statusCode").should("eq", 400);

    cy.url().should("include", "/login");

    cy.contains("Email ou senha incorretos", { timeout: 8000 })
      .should("be.visible");
  });

});
