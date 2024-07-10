const ReportsModel = require("./Reports.model");

exports.insert = (req, res) => {
  if (req.file) req.body.File = req.file.filename;

  ReportsModel.create(req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findAll = (req, res) => {
  ReportsModel.findAll().then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findCharts = (req, res) => {
  ReportsModel.findCharts().then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findReportsType = (req, res) => {
  ReportsModel.findReportsType(req.params.type, req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findReportsByType = (req, res) => {
  ReportsModel.findReportsByType(
    req.params.component,
    req.params.type,
    req.params.offset
  ).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.findMonthlyPublished = (req, res) => {
  ReportsModel.findMonthlyPublished(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findByID = (req, res) => {
  ReportsModel.findByID(req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.updateByID = (req, res) => {
  ReportsModel.updateByID(req.body, req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error.message);
    }
  );
};

exports.findByKeyword = (req, res) => {
  ReportsModel.findByKeyWord(req.params.query, req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.deleteById = (req, res) => {
  ReportsModel.deleteById(req.params.id).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(203).send(error);
    }
  );
};

exports.getStats = (req, res) => {
  ReportsModel.getStats().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.PerformanceNRW = (req, res) => {
  ReportsModel.PerformanceNRW(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.PerformanceDWQ = (req, res) => {
  ReportsModel.PerformanceDWQ(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.BoardMembers = (req, res) => {
  ReportsModel.BoardMembers(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.TrainingParticipants = (req, res) => {
  ReportsModel.TrainingParticipants(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
   
      res.status(203).send(err);
    }
  );
};

exports.LegalInstruments = (req, res) => {
  ReportsModel.LegalInstruments().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.WomenLeadership = (req, res) => {
  ReportsModel.WomenLeadership(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.WSPOperations = (req, res) => {
  ReportsModel.WSPOperations(req.params.start, req.params.end).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.BudgetAllocations = (req, res) => {
  ReportsModel.BudgetAllocations().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.getCountyStats = (req, res) => {
  ReportsModel.getCountyStats().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.filterReportsByComponents = (req, res) => {
  ReportsModel.filterReportsByComponents(req.params.component).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.getReportBarStats = (req, res) => {
  ReportsModel.getReportBarStats().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.getStatstype = (req, res) => {
  ReportsModel.getStatstype(req.params.category).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.filterType = (req, res) => {
  ReportsModel.filterType(req.params.type, req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.searchReports = (req, res) => {
  ReportsModel.searchReports(req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findReportsPaginatedFilter = (req, res) => {
  ReportsModel.findReportsPaginatedFilter(
    req.params.component,
    req.params.offset
  ).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findReportsPaginated = (req, res) => {
  ReportsModel.findReportsPaginated(req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findReportsByComponent = (req, res) => {
  ReportsModel.findReportsByComponent().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
