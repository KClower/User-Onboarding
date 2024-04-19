describe("This is a Test and Only a Test", () => {
    it("should return true", () => {
        expect(true).to.equal(true);
    })
})

describe("Testing the Form", () => {
    beforeEach(function () {
        cy.visit("http://localhost:3003");
    });
   it("Should fill out form", () => {
    cy.get('#username')
     .type("Kclower")
     .should("have.value", "Kclower")

     cy.get('[type="radio"]')
     .first()
     .check()
     .should("be.checked")

     cy.get("select")
     .select("Pizza")
     .should("have.value", "pizza")

     cy.get('input[type="checkbox"]')
     .check()
     .should("be.checked")

     cy.get('form')
     .submit()
   })
  
})