describe("Barra de Pesquisa", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:8000/api/noticias/*").as("getNoticias");

    cy.visit("http://localhost:5173/");
    cy.wait("@getNoticias");
  });

  it("deve permitir pesquisar uma noticia", () => {
    cy.get('img[alt="Buscar"]').first().click();

    cy.get('input[placeholder="Pesquisar"]').type("economia{enter}");

    cy.url().should("contain", "/noticias?q=economia");

    cy.intercept("GET", /api\/noticias\/\?q=economia/).as("pesquisaNoticias");
    cy.wait("@pesquisaNoticias");

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

    cy.get(".news-container")
      .should("exist")
      .within(() => {
        cy.get(".news-card-container").should("have.length", 0);
      });
  });
});
