const MobileModel = require("./Mobile.model");



exports.MobileLogin = (req, res) => {
  MobileModel.MobileLogin(res, req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.forgotPassword = (req, res) => {
  MobileModel.forgotPassword(req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAuthById = (req, res) => {
  MobileModel.findAuthById(req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.updateAuthById = (req, res) => {
  MobileModel.updateAuthById(req.body, req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.deleteAuthById = (req, res) => {
  MobileModel.deleteAuthById(req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.findAllAuth = (req, res) => {
  MobileModel.findAllAuth().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAuthPaginated = (req, res) => {
  MobileModel.findAuthPaginated(req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.quickSearch = (req, res) => {
  MobileModel.quickSearch(req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAuthByRole = (req, res) => {
  MobileModel.findAuthByRole(req.params.role, req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.searchByPhone = (req, res) => {
  MobileModel.searchByPhone(req.params.role, req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.searchByName = (req, res) => {
  MobileModel.searchByName(req.params.role, req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).send({ success: "Logout successful" });
};
