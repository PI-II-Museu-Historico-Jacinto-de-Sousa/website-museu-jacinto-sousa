describe("template spec", () => {
  it("Adiciona hello_world ao firestore", () => {
    cy.callFirestore("add", "test_hello_world", { some: "value" });
    cy.fixture("user.json").then((user) => {
      cy.login("user.uid");
    });
  });
});
