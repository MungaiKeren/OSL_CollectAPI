const QuestionsController = require("./Questions.controller");
const verifyToken = require("../Utils/VerifyToken");

exports.QuestionsRoutes = function (app) {
  app.post("/questions/create", [verifyToken, QuestionsController.create]);

  app.get("/questions/quicksearch/:column/:q", [
    verifyToken,
    QuestionsController.quickSearch,
  ]);

  app.get("/questions/paginated/:offset", [
    verifyToken,
    QuestionsController.findQuestionsPagnited,
  ]);

  app.get("/questions/databytablename/:table", [
    verifyToken,
    QuestionsController.dataByTable,
  ]);

  app.get("/questions/bytablename/:table", [
    verifyToken,
    QuestionsController.findByTable,
  ]);

  app.get("/components/summary/stats/:county", [
    verifyToken,
    QuestionsController.allFormsStatsByCounty,
  ]);

  app.get("/questions/totalmapped", [
    verifyToken,
    QuestionsController.totalMapped,
  ]);

  app.get("/questions/:ID", [
    verifyToken,
    QuestionsController.findQuestionsById,
  ]);

  app.get("/questions/details/:ID", [
    verifyToken,
    QuestionsController.findQuestionsByObjectId,
  ]);

  app.put("/questions/:ID", [
    verifyToken,
    QuestionsController.updateQuestionsById,
  ]);

  app.get("/questions", [verifyToken, QuestionsController.findAllQuestions]);

  app.delete("/questions/:ID", [
    verifyToken,
    QuestionsController.deleteQuestionsById,
  ]);
};
