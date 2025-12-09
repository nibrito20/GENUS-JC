/// <reference types="cypress" />

describe("Barra de Pesquisa", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:8000/api/noticias/*").as("getNoticias");

    cy.visit("http://localhost:5173/");
    cy.wait("@getNoticias");
  });

  it("deve permitir pesquisar uma noticia", () => {
    // abrir barra de busca
    cy.get('img[alt="Buscar"]').first().click();

    // digitar termo e enviar
    cy.get('input[placeholder="Pesquisar"]').type("economia{enter}");

    // verificar redirecionamento
    cy.url().should("contain", "/noticias?q=economia");

    // intercept da pesquisa
    cy.intercept("GET", /api\/noticias\/\?q=economia/).as("pesquisaNoticias");
    cy.wait("@pesquisaNoticias");

    // deve exibir pelo menos 1 card
    cy.get(".news-container")
      .should("exist")
      .and("be.visible")
      .within(() => {
        cy.get(".news-card-container", { timeout: 10000 })
          .should("have.length.greaterThan", 0);
      });
  });

  it("deve mostrar zero resultados quando nenhuma noticia existe", () => {
    const termo = "asdlkjashdlkajshdlkajshd";

    cy.get('img[alt="Buscar"]').first().click();
    cy.get('input[placeholder="Pesquisar"]').type(`${termo}{enter}`);

    cy.intercept("GET", new RegExp(`/api/noticias/\\?q=${termo}`)).as("pesquisaReq");
    cy.wait("@pesquisaReq");

    // não usar "be.visible" porque a div pode ficar com altura zero
    cy.get(".news-container")
      .should("exist")
      .within(() => {
        cy.get(".news-card-container").should("have.length", 0);
      });
  });
});
