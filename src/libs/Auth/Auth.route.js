const AuthController = require("./Auth.controller");
const verifyToken = require("../Utils/VerifyToken");

exports.AuthRoutes = function (app) {
  app.post("/auth/register", [AuthController.insert]);

  app.post("/auth/login", [AuthController.login]);

  app.get("/auth/logout", [verifyToken, AuthController.logout]);

  app.get("/auth/seachbyphone/:role/:q", [verifyToken, AuthController.searchByPhone]);

  app.get("/auth/seachbyname/:role/:q", [verifyToken, AuthController.searchByName]);

  app.get("/auth/quicksearch/:q", [verifyToken, AuthController.quickSearch]);

  app.post("/auth/forgot", [AuthController.forgotPassword]);

  app.get("/auth/paginated/:offset", [verifyToken, AuthController.findAuthPaginated]);

  app.delete("/auth/:authID", [verifyToken, AuthController.deleteAuthById]);

  app.put("/auth/:authID", [verifyToken, AuthController.updateAuthById]);

  app.get("/auth/:authID", [verifyToken, AuthController.findAuthById]);

  app.get("/auth", [verifyToken, AuthController.findAllAuth]);
};
