const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = require("../../configs/connection");
const Questions = require("../../models/Questions")(sequelize, Sequelize);
const Path = require("path");

Questions.sync({ force: false });

exports.createQuestions = (QuestionsData) => {

  return new Promise(async (resolve, reject) => {
    if (QuestionsData.TableName == undefined) {
      reject({ error: "Body is required" });
    }

    try {
      const [data, _m] = await sequelize.query(
        `SELECT * FROM "Questions" WHERE "TableName" = '${QuestionsData.TableName}' AND "Column" = '${QuestionsData.Column}'`
      );
      const [count, _c] = await sequelize.query(
        `SELECT Count(*)::int FROM "Questions" WHERE "TableName" = '${QuestionsData.TableName}'`
      );
      if (data.length === 0) {
        QuestionsData.Order = count[0].count + 1;
        Questions.create(QuestionsData).then(
          async (result) => {
            const [data1, cmeta] = await sequelize.query(
              `SELECT * FROM "Questions" WHERE "TableName" = '${QuestionsData.TableName}' ORDER BY "Order"`
            );
            resolve(data1);
          },
          (err) => {

            reject({ error: "Questions creation failed" });
          }
        );
      } else {
        reject({ error: "This question already exists!!!" });
      }
    } catch (error) {

      reject({ error: "Questions creation failed" });
    }
  });
};

exports.findQuestionsById = (id) => {
  return new Promise((resolve, reject) => {
    Questions.findByPk(id).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, error: "Questions not found" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.updateQuestionsById = (QuestionsData, id) => {
  return new Promise((resolve, reject) => {
    Questions.update(QuestionsData, {
      where: {
        ID: id,
      },
    }).then(
      async (result) => {
        const [data1, cmeta] = await sequelize.query(
          `SELECT * FROM "Questions" WHERE "TableName" = '${QuestionsData.TableName}' ORDER BY "Order"`
        );
        resolve(data1);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.deleteQuestionsById = (id) => {
  return new Promise(async (resolve, reject) => {
    const [order, meta] =
      await sequelize.query(`SELECT "Order" FROM "Questions" WHERE "ID"::TEXT = '${id}';
        `);
    Questions.destroy({
      where: {
        ID: id,
      },
    }).then(
      async (result) => {
        const [data, meta] =
          await sequelize.query(`UPDATE "Questions" SET "Order" = "Order" - 1 WHERE "Order" > '${order[0].Order}';
        `);
        if (result != 0) resolve({ success: "Deleted successfully!!!" });
        else reject({ error: "Questions does not exist!!!" });
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findQuestionsByObjectId = (id) => {
  return new Promise((resolve, reject) => {
    Questions.findAll({
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

exports.findAllQuestions = () => {
  return new Promise((resolve, reject) => {
    Questions.findAll({}).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject({ error: "Retrieve failed" });
      }
    );
  });
};

exports.findQuestionsPagnited = (offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [result, meta] = await sequelize.query(
        `SELECT * FROM "Questions" ORDER BY "updatedAt" DESC LIMIT 12 OFFSET ${offset}`
      );
      const [count, mdata] = await sequelize.query(
        `SELECT COUNT(*)::int as total FROM "Questions"`
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

exports.findByTable = (table) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, cmeta] = await sequelize.query(
        `SELECT * FROM "Questions" WHERE "TableName" = '${table}' ORDER BY "Order"`
      );
      resolve(data);
    } catch (error) {
      reject([]);
    }
  });
};

exports.dataByTable = (table) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, cmeta] = await sequelize.query(
        `SELECT * FROM tools."${table}" ORDER BY "id"`
      );
      resolve(data);
    } catch (error) {
      reject([]);
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
        `SELECT Count(*)::int FROM "Questions" WHERE "County" = '${county}'`
      );

      resolve({
        TAF: tafcount[0].count,
        ARF: arfcount[0].count,
        Questions: rmfcount[0].count,
      });
    } catch (error) {
      reject({ error: "Retrieve Failed!" });
    }
  });
};

exports.totalMapped = (offset) => {
  return new Promise((resolve, reject) => {
    Questions.findAll({}).then(
      async (result) => {
        const count = await Questions.count();
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
        `SELECT * FROM "Questions" WHERE "${column}" ILIKE '%${q}%' ORDER BY "updatedAt" DESC LIMIT 12 OFFSET 0`
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
