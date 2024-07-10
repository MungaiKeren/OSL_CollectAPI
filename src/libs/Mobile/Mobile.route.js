const MobileController = require("./Mobile.controller");
const verifyToken = require("../Utils/VerifyToken");

exports.MobileRoutes = function (app) {
  app.get("/mobile/seachbyphone/:role/:q", [
    verifyToken,
    MobileController.searchByPhone,
  ]);

  app.get("/mobile/seachbyname/:role/:q", [
    verifyToken,
    MobileController.searchByName,
  ]);

  app.get("/mobile/findbyrole/:role/:offset", [
    verifyToken,
    MobileController.findAuthByRole,
  ]);

  app.get("/mobile/quicksearch/:q", [
    verifyToken,
    MobileController.quickSearch,
  ]);

  app.get("/mobile/logout", [verifyToken, MobileController.logout]);

  app.post("/mobile/login", [MobileController.MobileLogin]);

  app.post("/mobile/forgot", [MobileController.forgotPassword]);

  app.get("/mobile/paginated/:offset", [
    verifyToken,
    MobileController.findAuthPaginated,
  ]);

  app.get("/mobile/:authID", [MobileController.findAuthById]);

  app.put("/mobile/:authID", [MobileController.updateAuthById]);

  app.delete("/mobile/:authID", [verifyToken, MobileController.deleteAuthById]);

  app.get("/mobile", [MobileController.findAllAuth]);
};
