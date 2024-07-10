const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../configs/connection");
const Mobile = require("../../models/Auth")(sequelize, Sequelize);
const jwt = require("jsonwebtoken");
const forgotPassword = require("../Utils/ForgotPassword");
const Mailer = require("../Utils/Mailer");
const bcrypt = require("bcrypt");
const getContent = require("../Utils/NewUserEmailContent");

Mobile.sync({ force: false });

exports.MobileLogin = (res, AuthData) => {
  let firstTimeLogin = false;
  return new Promise(async (resolve, reject) => {
    //check email
    Mobile.findAll({
      where: {
        Email: AuthData.Email,
      },
      raw: true,
    }).then(
      async (result) => {
        console.log(result[0].Level);
        if (result.length === 0) reject({ error: "This user does not exist!" });
        if (
          result.length != 0 &&
          (await bcrypt.compare(AuthData.Password, result[0].Password))
        ) {
          if (
            result[0].Level === "Full Access" ||
            result[0].Level === "Mobile"
          ) {
            if (!result[0].Status)
              return reject({ error: "Account disabled by administrator!" });

            const token = jwt.sign(
              {
                UserID: result[0].UserID,
                Name: result[0].Name,
                Email: result[0].Email,
                Position: result[0].Position,
                County: result[0].County,
                Level: result[0].Level,
                Status: result[0].Status,
                Role: result[0].Role,
                Phone: result[0].Phone,
                FirstTimeLogin: firstTimeLogin,
              },
              process.env.TOKEN_KEY,
              {
                expiresIn: "0.5h",
              }
            );

            res.cookie("wkwp_cookie", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });

            resolve({ token: token, success: "Login successful" });
          } else {
            reject({ error: "You are not authorised to access this module" });
          }
        } else {
          reject({ error: "Authentication failed" });
        }
      },
      (err) => {
        console.log(err);
        reject({ error: "Login failed!" });
      }
    );
  });
};

exports.forgotPassword = async (MobileData) => {
  if (MobileData.Email) {
    return new Promise((resolve, reject) => {
      Mobile.findAll({
        where: {
          Email: MobileData.Email,
        },
        raw: true,
      }).then(
        async (result) => {
          if (result.length === 0) {
            reject({ error: "This user does not exist!" });
          }
          if (result.length != 0) {
            const pass = Math.random().toString(36).slice(-8);
            const name = result[0].Name;
            const email = result[0].Email;
            MobileData.Password = await bcrypt.hash(pass, 10);
            Mobile.update(MobileData, {
              where: {
                Email: MobileData.Email,
              },
            }).then(
              async (result) => {
                const content = await forgotPassword.getContent(
                  "Admin",
                  name,
                  pass
                );
                const response = await Mailer.sendMail(
                  "Password reset successful!",
                  email,
                  content
                );
                if (response.accepted.length > 0) {
                  resolve({
                    success: "Password reset successful! Check your email",
                  });
                } else {
                  reject({
                    error: "System email issue. Contact administrator",
                  });
                }
              },
              (err) => {
                reject({ error: "Email not sent!" });
              }
            );
          }
        },
        (err) => {
          reject({ error: "Retrieve failed" });
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      reject({ error: "Email is required!" });
    });
  }
};

exports.searchByPhone = (role, q) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT "UserID","Name","Phone" FROM "Auths" WHERE "Role"=:role AND "Phone" ILIKE :phone LIMIT 2 OFFSET 0;`,
        {
          replacements: { role: role, phone: `${q}%` },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      resolve(data);
    } catch (error) {
      reject([]);
    }
  });
};

exports.searchByName = (role, q) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT "UserID","Name","Phone" FROM "Auths" WHERE  "Name" ILIKE :name LIMIT 2 OFFSET 0;`,
        {
          replacements: { role: role, name: `%${q}%` },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      resolve(data);
    } catch (error) {
      reject([]);
    }
  });
};

exports.findAuthByRole = (role, offset) => {
  return new Promise((resolve, reject) => {
    Mobile.findAll({
      where: { Role: role },
      offset: offset,
      limit: 12,
    }).then(
      async (result) => {
        const count = await Mobile.count({ where: { Role: role } });
        resolve({
          result: result,
          total: count,
        });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findAuthById = (id) => {
  return new Promise((resolve, reject) => {
    Mobile.findByPk(id).then(
      (result) => {
        if (result == null) {
          reject({ error: "User not found" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.updateAuthById = async (MobileData, AuthID) => {
  if (MobileData.Password) {
    return new Promise((resolve, reject) => {
      Mobile.findAll({
        where: {
          UserID: AuthID,
        },
        raw: true,
      }).then(
        async (result) => {
          if (result.length === 0) {
            reject({ error: "This user does not exist!" });
          }
          if (
            result.length != 0 &&
            (await bcrypt.compare(MobileData.Password, result[0].Password))
          ) {
            MobileData.Password = await bcrypt.hash(MobileData.NewPassword, 10);

            Mobile.update(MobileData, {
              where: {
                UserID: AuthID,
              },
            }).then(
              (result) => {
                resolve({ success: "New password Updated Successfully!" });
              },
              (err) => {
                reject({ error: "Retrieve failed" });
              }
            );
          } else {
            reject({ error: "Old Password Incorrect" });
          }
        },
        (err) => {
          reject({ error: "Retrieve failed" });
        }
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      Mobile.update(MobileData, {
        where: {
          UserID: AuthID,
        },
      }).then(
        (result) => {
          resolve({ success: "Updated Successfully" });
        },
        (err) => {
          reject({ error: "Retrieve failed" });
        }
      );
    });
  }
};

exports.deleteAuthById = (AuthID) => {
  return new Promise((resolve, reject) => {
    Mobile.destroy({
      where: {
        UserID: AuthID,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ success: "Deleted successfully!!!" });
        else reject({ error: "User does not exist!!!" });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findAllAuth = () => {
  return new Promise((resolve, reject) => {
    Mobile.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findAuthPaginated = (offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "Auths" ORDER BY "updatedAt" DESC LIMIT 12 OFFSET ${offset}`
      );
      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*)::int  FROM "Auths"`
      );

      resolve({ data: data, total: count[0].count });
    } catch (error) {
      reject(null);
    }
  });
};

exports.quickSearch = (q) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "Auths" WHERE "Name" ILIKE '%${q}%' LIMIT 12 OFFSET 0;`
      );
      console.log(data);
      resolve({ data: data, total: 12 });
    } catch (error) {
      reject([]);
    }
  });
};

exports.logout = (res) => {
  return new Promise((resolve, reject) => {
    try {
      res.cookie("nimda_ksa", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      resolve({ success: "Logout successful" });
    } catch (error) {
      reject({ error: "logout failed!" });
    }
  });
};
