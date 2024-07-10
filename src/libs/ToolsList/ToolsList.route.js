const ToolsListController = require("./ToolsList.controller");
const verifyToken = require("../Utils/VerifyToken");

exports.ToolsListRoutes = function (app) {
  app.post("/toolslist/create", [verifyToken, ToolsListController.create]);

  app.post("/toolslist/submittabledata/:tableName", [
    verifyToken,
    ToolsListController.submitTableData,
  ]);

  app.post("/toolslist/createtable", [
    verifyToken,
    ToolsListController.createTable,
  ]);

  app.get("/toolslist/quicksearch/:column/:q", [
    verifyToken,
    ToolsListController.quickSearch,
  ]);

  app.get("/toolslist/bytablename/:table", [
    verifyToken,
    ToolsListController.getByTableName,
  ]);

  app.get("/toolslist/paginated/:offset", [
    verifyToken,
    ToolsListController.findToolsListPagnited,
  ]);

  app.get("/toolslist/totalmapped", [
    verifyToken,
    ToolsListController.totalMapped,
  ]);

  app.get("/toolslist/:ID", [
    verifyToken,
    ToolsListController.findToolsListById,
  ]);

  app.get("/toolslist/details/:ID", [
    verifyToken,
    ToolsListController.findToolsListByObjectId,
  ]);

  app.put("/toolslist/:ID", [
    verifyToken,
    ToolsListController.updateToolsListById,
  ]);

  app.get("/toolslist", [verifyToken, ToolsListController.findAllToolsList]);

  app.delete("/toolslist/:ID", [
    verifyToken,
    ToolsListController.deleteToolsListById,
  ]);
};
