describe("template spec", () => {
  it("Adiciona hello_world ao firestore", () => {
    cy.callFirestore("add", "test_hello_world", { some: "value" });
    cy.login();
  });
});
