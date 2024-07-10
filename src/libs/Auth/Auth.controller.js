const AuthModel = require("./Auth.model");

exports.insert = (req, res) => {
  AuthModel.createAuth(req.body).then(
    (result) => {
     
      res.status(200).send(result);
    },
    (err) => {
      
      res.status(203).send(err);
    }
  );
};

exports.login = (req, res) => {
  AuthModel.AuthLogin(res, req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAuthById = (req, res) => {
  AuthModel.findAuthById(req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.updateAuthById = (req, res) => {
  AuthModel.updateAuthById(req.body, req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.deleteAuthById = (req, res) => {
  AuthModel.deleteAuthById(req.params.authID).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.forgotPassword = (req, res) => {
  AuthModel.forgotPassword(req.body).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
exports.findAllAuth = (req, res) => {
  AuthModel.findAllAuth().then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.findAuthPaginated = (req, res) => {
  AuthModel.findAuthPaginated(req.params.offset).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.logout = (req, res) => {
  res.cookie("nimda_ksa", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).send({ success: "Logout successful" });
};

exports.searchByPhone = (req, res) => {
  AuthModel.searchByPhone(req.params.role, req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.searchByName = (req, res) => {
  AuthModel.searchByName(req.params.role, req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};

exports.quickSearch = (req, res) => {
  AuthModel.quickSearch(req.params.q).then(
    (result) => {
      res.status(200).send(result);
    },
    (err) => {
      res.status(203).send(err);
    }
  );
};
