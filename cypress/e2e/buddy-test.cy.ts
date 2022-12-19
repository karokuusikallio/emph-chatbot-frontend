/// <reference types="cypress" />

const testUser = {
  username: "newUser",
  password: "newUser",
};

describe("Logging in", function () {
  before(function () {
    cy.request("POST", "http://localhost:3000/api/reset");
  });

  beforeEach(function () {
    cy.visit("http://localhost:3000/");
  });

  it("Login form is shown", function () {
    cy.contains("Login");
  });

  it("creating a user account", function () {
    cy.intercept("/api/user/me").as("getUserInfo");
    cy.url().should("eq", "http://localhost:3000/login");
    cy.get("#createNewUser").click();

    cy.get("#newUsername").type(testUser.username);
    cy.get("#newPassword").type(testUser.password);
    cy.wait("@getUserInfo");

    cy.get("#submitNewUserForm").click();

    cy.contains(`User ${testUser.username} created.`);
  });

  it("fails with wrong credentials", function () {
    cy.intercept("/api/user/me").as("getUserInfo");
    cy.url().should("eq", "http://localhost:3000/login");

    cy.get("#loginUsername").type("wrong user");
    cy.get("#loginPassword").type("wrong password");
    cy.wait("@getUserInfo");

    cy.get("#submitLogin").click();

    cy.contains("Invalid credentials.");
  });

  it("logging in with right credentials", function () {
    cy.intercept("/api/user/me").as("getUserInfo");
    cy.url().should("eq", "http://localhost:3000/login");

    cy.get("#loginUsername").type(testUser.username);
    cy.get("#loginPassword").type(testUser.password);
    cy.wait("@getUserInfo");

    cy.get("#submitLogin").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.get("form").contains("Send");
  });
});

describe.only("When logged in", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3000/api/reset");
    cy.request("POST", "http://localhost:3000/api/user", testUser);
    cy.request("POST", "http://localhost:3000/api/login", testUser);
  });

  it("A message receives an answer", function () {
    cy.intercept("/api/user/me").as("getUserInfo");
    cy.visit("http://localhost:3000/");
    cy.wait("@getUserInfo");

    cy.get("#userInput").type("Hello there!");
    cy.get("#messageSendButton").click();

    cy.get(".buddyMessageBot");
  });

  it("Messages can be cleared", function () {
    cy.intercept("/api/user/me").as("getUserInfo");
    cy.visit("http://localhost:3000/");
    cy.wait("@getUserInfo");

    cy.get("#react-burger-menu-btn").click();
    cy.get("#clearChat").click();

    cy.wait("@getUserInfo");

    cy.contains("Don't be shy, write something!");
  });

  it("Logging out works", function () {
    cy.intercept("/api/user/me").as("getUserInfo");
    cy.visit("http://localhost:3000/");
    cy.wait("@getUserInfo");

    cy.get("#react-burger-menu-btn").click();
    cy.get("#logOut").click();

    cy.url().should("eq", "http://localhost:3000/login");
    cy.contains("Login");
  });
});

export {};
