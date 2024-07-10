const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = require("../../configs/connection");
const ToolsList = require("../../models/ToolsList")(sequelize, Sequelize);
const Path = require("path");
const { log } = require("console");

ToolsList.sync({ force: false });
exports.createToolsList = (ToolsListData) => {
  return new Promise(async (resolve, reject) => {
    if (ToolsListData.ToolName === undefined) {
      reject({ error: "Body is required" });
    }
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "ToolsLists" WHERE "DataTableName" = '${ToolsListData.DataTableName}'`
      );
      const [data2, cmeta] = await sequelize.query(
        `CREATE TABLE tools."${ToolsListData.DataTableName}" (id serial PRIMARY KEY);`
      );
      if (data.length === 0) {
        ToolsList.create(ToolsListData).then(
          async (result) => {
            resolve({
              success: "Created successfully",
              ID: result.dataValues.ID,
            });
          },
          (err) => {
            reject({ error: "ToolsList creation failed" });
          }
        );
      } else {
        reject({ error: "Data Table Name exists!!!" });
      }
    } catch (error) {
      reject({ error: "ToolsList creation failed" });
    }
  });
};

exports.submitTableData = (TableData, TableName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert TableName to lowercase
      let columns = "";
      let values = "";
      Object.keys(TableData).map((i) => {
        if (columns == "") columns += `"${i}"`;
        else columns += ", " + `"${i}"`;
      });
     
      Object.values(TableData).map((i) => {
        if (values == "") values += `'${i}'`;
        else values += ", " + `'${i}'`;
      });
      const [data, meta] = await sequelize.query(
        `INSERT INTO tools."${TableName}" (${columns}) VALUES (${values})`
      );

      resolve({
        success: "Submitted Successfuly",
      });
    } catch (error) {
  
      reject({ success: error.message ?? "Data submission failed!!" });
    }
  });
};

function getDataTyps(type) {
  switch (type) {
    case "TEXT":
      return "VARCHAR";
    case "LLONGTEXT":
      return "TEXT";
    case "INTEGER":
      return "INTEGER";
    case "DECIMAL":
      return "FLOAT";
    case "DATE":
      return "DATE";
    default:
      return "VARCHAR";
  }
}

exports.createTable = (ToolsListData) => {
  return new Promise(async (resolve, reject) => {
   
    if (ToolsListData.columns === undefined) {
      reject({ error: "Body is required" });
    }

    try {
      let columns = "";
      ToolsListData.columns.map((e) => {
        if (columns === "") {
          if (e.Column != "geom") {
            columns += `"${e.Column}" ${getDataTyps(e.DataType)} ${
              e.Required == "Yes" ? "NOT NULL" : "NULL"
            }`;
          } else {
            columns += `"Latitude"  FLOAT NOT NULL, "Longitude"  FLOAT NOT NULL`;
          }
        } else {
          if (e.Column != "geom") {
            columns += `, "${e.Column}" ${getDataTyps(e.DataType)} ${
              e.Required == "Yes" ? "NOT NULL" : "NULL"
            }`;
          } else {
            columns += `, "Latitude"  FLOAT NOT NULL, "Longitude"  FLOAT NOT NULL`;
          }
        }
      });

      let query = `CREATE TABLE tools."${
        ToolsListData.TableName
      }" (id serial PRIMARY KEY ${columns == "" ? "" : ", " + columns});`;

      const [countQuery, _] = await sequelize.query(
        `SELECT COUNT(*)::int FROM tools."${ToolsListData.TableName}";`
      );
    

      if (countQuery[0].count > 0) {
        const date = new Date()
          .toISOString()
          .replaceAll(":", "")
          .replaceAll("-", "")
          .substring(0, 13);
        const [rn, rnm] = await sequelize.query(
          `ALTER TABLE tools."${ToolsListData.TableName}" RENAME TO "${
            ToolsListData.TableName + date
          }";`
        );
        const [data, meta] = await sequelize.query(`${query}`);

        resolve({
          success: "Operation successfully",
        });
      } else {
        const [rn, rnm] = await sequelize.query(
          `DROP TABLE tools."${ToolsListData.TableName}";`
        );
        const [data, meta] = await sequelize.query(`${query}`);

        resolve({
          success: "Operation successfully",
        });
      }
    } catch (error) {
      reject({ error: error.message ?? "ToolsList creation failed" });
    }

    try {
    } catch (error) {
   
      reject({ error: error.message ?? "ToolsList creation failed" });
    }
  });
};

exports.findToolsListById = (id) => {
  return new Promise((resolve, reject) => {
    ToolsList.findByPk(id).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, error: "ToolsList not found" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.updateToolsListById = (ToolsListData, id) => {
  return new Promise((resolve, reject) => {
    ToolsList.update(ToolsListData, {
      where: {
        ID: id,
      },
    }).then(
      (result) => {
        resolve({ success: "Updated successfully", ID: id });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.deleteToolsListById = (id) => {
  return new Promise((resolve, reject) => {
    ToolsList.destroy({
      where: {
        ID: id,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ success: "Deleted successfully!!!" });
        else reject({ error: "ToolsList does not exist!!!" });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findToolsListByObjectId = (id) => {
  return new Promise((resolve, reject) => {
    ToolsList.findAll({
      where: {
        ObjectID: id,
      },
    }).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findAllToolsList = () => {
  return new Promise((resolve, reject) => {
    ToolsList.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.getByTableName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, meta] = await sequelize.query(
        `SELECT * FROM "ToolsLists" WHERE "DataTableName" = '${name}'`
      );
     
      resolve(result);
    } catch (error) {
  
      reject(null);
    }
  });
};

exports.findToolsListPagnited = (offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, meta] = await sequelize.query(
        `SELECT * FROM "ToolsLists" ORDER BY "updatedAt" DESC LIMIT 12 OFFSET ${offset}`
      );
      const [count, mdata] = await sequelize.query(
        `SELECT COUNT(*)::int as total FROM "ToolsLists"`
      );
      resolve({
        data: result,
        total: count[0].total,
      });
    } catch (error) {
      reject({ error: "Retrieve Failed!" });
    }
  });
};

exports.allFormsStatsByCounty = (county, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tafcount, tdata] = await sequelize.query(
        `SELECT Count(*)::int FROM "TAFs" WHERE "County" = '${county}'`
      );
      const [arfcount, adata] = await sequelize.query(
        `SELECT Count(*)::int FROM "ARFs" WHERE "County" = '${county}'`
      );
      const [rmfcount, rdata] = await sequelize.query(
        `SELECT Count(*)::int FROM "ToolsLists" WHERE "County" = '${county}'`
      );

      resolve({
        TAF: tafcount[0].count,
        ARF: arfcount[0].count,
        ToolsList: rmfcount[0].count,
      });
    } catch (error) {
      reject({ error: "Retrieve Failed!" });
    }
  });
};

exports.totalMapped = (offset) => {
  return new Promise((resolve, reject) => {
    ToolsList.findAll({}).then(
      async (result) => {
        const count = await ToolsList.count();
        resolve({
          success: count,
        });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.quickSearch = (column, q) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, meta] = await sequelize.query(
        `SELECT * FROM "ToolsLists" WHERE "${column}" ILIKE '%${q}%' ORDER BY "updatedAt" DESC LIMIT 12 OFFSET 0`
      );

      resolve({
        data: result,
        total: 12,
      });
    } catch (error) {
      reject({ error: "Retrieve Failed!" });
    }
  });
};
