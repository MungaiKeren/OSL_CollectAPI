const ReportsController = require("./Reports.controller");
const ReportsModel = require("./Reports.model");
const verifyToken = require("../Utils/VerifyToken");

exports.ReportsRoutes = function (app) {
  app.post("/reports/create", [
    verifyToken,
    ReportsModel.uploadFile,
    ReportsController.insert,
  ]);

  app.get("/reports/paginatedfilter/:component/:offset", [
    verifyToken,
    ReportsController.findReportsPaginatedFilter,
  ]);

  app.get("/reports/stats", [verifyToken, ReportsController.getStats]);

  app.get("/reports/nrw/performance/:start/:end", [
    verifyToken,
    ReportsController.PerformanceNRW,
  ]);

  app.get("/reports/dwq/performance/:start/:end", [
    verifyToken,
    ReportsController.PerformanceDWQ,
  ]);

  app.get("/reports/bod/performance/:start/:end", [
    verifyToken,
    ReportsController.BoardMembers,
  ]);

  app.get("/reports/training/performance/:start/:end", [
    ReportsController.TrainingParticipants,
  ]);

  app.get("/reports/womenleadership/performance/:start/:end", [
    verifyToken,
    ReportsController.WomenLeadership,
  ]);

  app.get("/reports/wspoperations/performance/:start/:end", [
    verifyToken,
    ReportsController.WSPOperations,
  ]);

  //to filter the budget year based on input
  app.get("/reports/budget/performance", [
    verifyToken,
    ReportsController.BudgetAllocations,
  ]);

  app.get("/reports/legal/performance", [
    verifyToken,
    ReportsController.LegalInstruments,
  ]);

  app.get("/reports/county/stats", [
    verifyToken,
    ReportsController.getCountyStats,
  ]);

  app.get("/stats/filter/reports/:component", [
    verifyToken,
    ReportsController.filterReportsByComponents,
  ]);

  app.get("/reports/bar/stats", [
    verifyToken,
    ReportsController.getReportBarStats,
  ]);

  app.put("/reports/:id", [verifyToken, ReportsController.updateByID]);

  app.get("/reports/:id", [verifyToken, ReportsController.findByID]);

  app.get("/reports", [verifyToken, ReportsController.findAll]);

  app.delete("/reports/:id", [verifyToken, ReportsController.deleteById]);

  app.get("/reports/paginated/:offset", [
    verifyToken,
    ReportsController.findReportsPaginated,
  ]);

  app.get("/reports/paginated/component/all", [
    verifyToken,
    ReportsController.findReportsByComponent,
  ]);

  app.get("/reports/paginated/:type/:offset", [
    verifyToken,
    ReportsController.findReportsType,
  ]);

  app.get("/reports/paginated/:component/:type/:offset", [
    verifyToken,
    ReportsController.findReportsByType,
  ]);

  //untested end points

  app.get("/reports/search/:query/:offset", [
    verifyToken,
    ReportsController.findByKeyword,
  ]);

  app.get("/reports/search/:q", [verifyToken, ReportsController.searchReports]);

  app.get("/reports/stats/:category", [
    verifyToken,
    ReportsController.getStatstype,
  ]);

  app.get("/reports/charts", [verifyToken, ReportsController.findCharts]);

  app.get("/reports/monthly/published/:start/:end", [
    verifyToken,
    ReportsController.findMonthlyPublished,
  ]);
};
