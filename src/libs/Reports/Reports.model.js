const { Sequelize } = require("sequelize");
const sequelize = require("../../configs/connection");
const Reports = require("../../models/Reports")(sequelize, Sequelize);
const multer = require("multer");

Reports.sync({ force: false });

let upload = multer({
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, callback) => {
    const acceptableExtensions = [
      ".png",
      ".PNG",
      ".jpeg",
      ".JPEG",
      ".jpg",
      ".JPG",
    ];
    if (!acceptableExtensions.includes(Path.extname(file.originalname))) {
      return callback(new Error("Unsupported format"));
    }
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 100000000) {
      return callback(new Error("File is too Large!"));
    }
    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  }),
});

exports.uploadFile = upload.single("Image");

exports.create = (ReportsData) => {
  return new Promise(async (resolve, reject) => {
    if (ReportsData.Title == undefined) {
      return reject({ message: "Body is required!!!" });
    }
    Reports.create(ReportsData).then(
      (result) => {
        resolve({ success: "Created Successfully" });
      },
      (error) => {
        reject({ error: "Creation Failed!!!" });
      }
    );
  });
};

exports.findAll = () => {
  return new Promise(async (resolve, reject) => {
    Reports.findAll().then(
      (result) => {
        resolve(result);
      },
      (error) => {
        reject({ error: "Failed" });
      }
    );
  });
};

exports.findReportsType = (type, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "Reports" ${
          type === "all" ? "" : `WHERE "Type"= '${type}'`
        } LIMIT 10 OFFSET '${offset}'`
      );

      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*) FROM "Reports"`
      );

      resolve({ data: data, total: count[0].count });
    } catch (error) {
      reject({ error: "failed" });
    }
  });
};

exports.findReportsByType = (component, type, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "Reports" ${
          type === "All"
            ? ""
            : `WHERE "Component"= '${component}' AND "Type" = '${type}'`
        } LIMIT 12 OFFSET '${offset}'`
      );

      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*) FROM "Reports"`
      );

      resolve({
        data: data,
        total: count[0].total,
      });
    } catch (error) {
      reject({ error: "failed" });
    }
  });
};

exports.findReportsByComponent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [wrm, wmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Water Resource Management'`
      );
      const [rws, rmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Rural Water Services'`
      );
      const [uws, umeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Urban Water Services'`
      );
      const [fp, fmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Finance and Private Sector Engagements'`
      );
      const [pg, pmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Policy and Governance'`
      );

      resolve({
        WRM: wrm,
        RWS: rws,
        UWS: uws,
        FPE: fp,
        PG: pg,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.findByID = (id) => {
  return new Promise(async (resolve, reject) => {
    Reports.findByPk(id).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, success: "Data not found" });
        }
        resolve(result);
      },
      (error) => {
        reject({ error: "Failed" });
      }
    );
  });
};

exports.updateByID = (ReportsData, id) => {
  return new Promise((resolve, reject) => {
    Reports.update(ReportsData, {
      where: {
        ReportID: id,
      },
    }).then(
      (result) => {
        if (result[0] === 1) {
          resolve({ success: "Report Updated Successfully!" });
        } else {
          resolve({ success: "Report does not exist!" });
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
};

exports.findReportsPaginated = (offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT * FROM "Reports" ORDER BY "createdAt" DESC LIMIT 12 OFFSET ${offset}`
      );
      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*)::int AS total FROM "Reports"`
      );

      resolve({
        data: results,
        total: count[0].total,
      });
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.findReportsPaginatedFilter = (component, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT * FROM "Reports" WHERE "Component" = '${component}' ORDER BY "createdAt" DESC LIMIT 12 OFFSET ${offset}`
      );
      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*)::int AS total FROM "Reports" WHERE "Component" = '${component}'`
      );

      resolve({
        data: results,
        total: count[0].total,
      });
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    Reports.destroy({
      where: {
        ReportID: id,
      },
    }).then(
      (result) => {
        if (result != 0) resolve({ success: "Deleted Successfully" });
        else reject({ success: "Entry does not exist" });
      },
      (error) => {
        reject({ error: "Failed" });
      }
    );
  });
};

exports.getStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tr, smeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports"`
      );
      const [wk, hmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Type" = 'Weekly'`
      );
      const [mn, dmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Type" = 'Monthly'`
      );
      const [qr, qmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Type" = 'Quaterly'`
      );
      const [an, ameta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Type" = 'Annualy'`
      );

      resolve({
        Total: tr,
        Weekly: wk,
        Monthly: mn,
        Quaterly: qr,
        Annual: an,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.PerformanceNRW = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const year = new Date(end).getFullYear();
      const [data, nrwmeta] = await sequelize.query(
        `WITH QuarterlyValues AS (
    SELECT
        "WaterProviders"."County",
        "WaterProviders"."Name",
	COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${
              year - 1
            }-10-01'::date AND '${year}-09-30'::date THEN "IndicatorPerformances"."NRW_Percentage_Baseline"
        END), 0) AS "Baseline",
	COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${
              year - 1
            }-10-01'::date AND '${year}-12-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q1",
	COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-01-01'::date AND '${year}-03-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q2",
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-04-01'::date AND '${year}-06-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q3",
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-07-01'::date AND '${year}-09-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q4",
        ROUND((COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${
              year - 1
            }-10-01'::date AND '${year}-12-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) +
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-01-01'::date AND '${year}-03-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) +
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-04-01'::date AND '${year}-06-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) +
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-07-01'::date AND '${year}-09-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0)) / 4, 1) AS "Average"
    FROM
        "IndicatorPerformances"
    LEFT OUTER JOIN
        "WaterProviders" ON "WaterProviders"."ID" = "IndicatorPerformances"."StakeholderID"
    INNER JOIN
        "RMFs" ON "RMFs"."SectorStakeholder" = "WaterProviders"."Name"
    WHERE
        "WaterProviders"."Type" = 'WSP'
    GROUP BY
        "WaterProviders"."Name", "WaterProviders"."County"
)

SELECT
    qv."County",
    qv."Name",
	qv. "Baseline",
	 qv."NRW_Q1",
	 qv."NRW_Q2",
	 qv."NRW_Q3",qv."NRW_Q4",
	 qv."Average"
    
FROM
    QuarterlyValues qv`
      );

      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.PerformanceDWQ = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, nrwmeta] = await sequelize.query(
        `SELECT
    "WaterProviders"."Name",
    "IndicatorPerformances"."DWQ_Percentage",
    CASE
        WHEN "IndicatorPerformances"."DWQ_Percentage" > 95 THEN 'Good'
        WHEN "IndicatorPerformances"."DWQ_Percentage" BETWEEN 90 AND 95 THEN 'Acceptable'
        ELSE 'Not acceptable'
    END AS "Comment"
FROM
    "WaterProviders"
LEFT OUTER JOIN
    "IndicatorPerformances" ON "IndicatorPerformances"."StakeholderID" = "WaterProviders"."ID"
WHERE
    "WaterProviders"."Type" = 'WSP'
    AND TO_DATE("IndicatorPerformances"."Date", 'YYYY-MM-DD') = (
        SELECT MAX(TO_DATE("Date", 'YYYY-MM-DD'))
        FROM "IndicatorPerformances"
       WHERE "Date" >= '${start}' AND "Date" <= '${end}');`
      );
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.BoardMembers = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, nrwmeta] = await sequelize.query(
        `SELECT 
    "WaterProviders"."Name",
    "WaterProviders"."County",
    "LatestPerfomances"."BoardMembers_Male",
    "LatestPerfomances"."BoardMembers_Female",
    "LatestPerfomances"."Training_BoardMembers_Male",
    "LatestPerfomances"."Training_BoardMembers_Female",
    ("LatestPerfomances"."BoardMembers_Male" + "LatestPerfomances"."BoardMembers_Female") AS "Total_BoardMembers",
    CASE
        WHEN ("LatestPerfomances"."BoardMembers_Male" + "LatestPerfomances"."BoardMembers_Female") > 0 THEN
            CONCAT(ROUND(("LatestPerfomances"."BoardMembers_Female" * 100.0) / ("LatestPerfomances"."BoardMembers_Male" + "LatestPerfomances"."BoardMembers_Female")), '%')
        ELSE
            '0%'
    END AS "WomenLeadershipPercentage"
FROM 
    (
        SELECT 
            "WaterProvidersPerfomances"."StakeholderID",
            MAX("WaterProvidersPerfomances"."Date") AS "LatestDate",
            MAX("WaterProvidersPerfomances"."BoardMembers_Male") AS "BoardMembers_Male",
            MAX("WaterProvidersPerfomances"."BoardMembers_Female") AS "BoardMembers_Female",
            MAX("WaterProvidersPerfomances"."Training_BoardMembers_Male") AS "Training_BoardMembers_Male",
            MAX("WaterProvidersPerfomances"."Training_BoardMembers_Female") AS "Training_BoardMembers_Female"
        FROM 
            "WaterProvidersPerfomances"
        WHERE
            "WaterProvidersPerfomances"."Date"::date >= '${start}'::date AND "WaterProvidersPerfomances"."Date"::date <= '${end}'::date
        GROUP BY 
            "WaterProvidersPerfomances"."StakeholderID"
    ) AS "LatestPerfomances"
INNER JOIN "WaterProviders" ON "LatestPerfomances"."StakeholderID" = "WaterProviders"."ID"
WHERE
    "WaterProviders"."Type" = 'WSP';
`
      );
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.TrainingParticipants = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, nrwmeta] = await sequelize.query(
        `SELECT 
    "ARFs"."County",
    "ARFs"."ActivityName",
    COUNT(CASE WHEN "ActivityParticipants"."PWD" = 'Yes' THEN 1 END) AS "PWD",
    COUNT(CASE WHEN "ActivityParticipants"."Age" = '15-29' THEN 1 END) AS "Youth",
    COUNT(CASE WHEN "ActivityParticipants"."Age" = '30+' THEN 1 END) AS "Adult",
    COUNT(CASE WHEN "ActivityParticipants"."Gender" = 'M' THEN 1 END) AS "Male",
    COUNT(CASE WHEN "ActivityParticipants"."Gender" = 'F' THEN 1 END) AS "Female",
    SUM(CASE WHEN "ActivityParticipants"."Gender" = 'M' THEN 1 ELSE 0 END +
        CASE WHEN "ActivityParticipants"."Gender" = 'F' THEN 1 ELSE 0 END) AS "Total"
FROM 
    "ARFs" 
INNER JOIN 
    "ActivityParticipants" ON "ActivityParticipants"."ActivityID"::TEXT = "ARFs"."ID"::TEXT
WHERE 
    "ARFs"."Date"::date >= '${start}'::date AND "ARFs"."Date"::date <= '${end}'::date 
GROUP BY 
    "ARFs"."County", "ARFs"."ActivityName"`
      );
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.LegalInstruments = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, nrwmeta] = await sequelize.query(``);
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.WomenLeadership = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, nrwmeta] = await sequelize.query(
        `SELECT 
            "WaterProviders"."County", 
            "WaterProviders"."Name", 
            "WaterProvidersPerfomances"."BoardMembers_Female", 
            ("WaterProvidersPerfomances"."BoardMembers_Female" + "WaterProvidersPerfomances"."BoardMembers_Male") AS "Total",
            CASE 
                WHEN ("WaterProvidersPerfomances"."BoardMembers_Female" + "WaterProvidersPerfomances"."BoardMembers_Male") = 0 THEN '0'
                ELSE CONCAT(
                    ROUND(
                        (("WaterProvidersPerfomances"."BoardMembers_Female"::int / ("WaterProvidersPerfomances"."BoardMembers_Female"::int + "WaterProvidersPerfomances"."BoardMembers_Male"::int))::int * 100)
                    ), 
                    '%'
                )
            END AS "Percentage"
        FROM 
            "WaterProviders"
        INNER JOIN 
            "WaterProvidersPerfomances" ON "WaterProvidersPerfomances"."StakeholderID" = "WaterProviders"."ID"
		WHERE	"WaterProvidersPerfomances"."Date"::date >= '${start}'::date AND "WaterProvidersPerfomances"."Date"::date <= '${end}'::date`
      );
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.WSPOperations = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const year = new Date(end).getFullYear();
      const [data, nrwmeta] = await sequelize.query(
        `WITH QuarterlyValues AS (
    SELECT
        "WaterProviders"."County",
        "WaterProviders"."Name",
	COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${
              year - 1
            }-10-01'::date AND '${year}-12-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q1",
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-01-01'::date AND '${year}-03-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q2",
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-04-01'::date AND '${year}-06-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q3",
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-07-01'::date AND '${year}-09-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) AS "NRW_Q4",
        ROUND((COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${
              year - 1
            }-10-01'::date AND '${year}-12-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) +
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-01-01'::date AND '${year}-03-31'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) +
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-04-01'::date AND '${year}-06-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0) +
        COALESCE(MAX(CASE 
            WHEN "IndicatorPerformances"."Date"::date BETWEEN '${year}-07-01'::date AND '${year}-09-30'::date THEN "IndicatorPerformances"."NRW_Percentage"
        END), 0)) / 4, 1) AS "Average",
        ROUND(COALESCE(SUM(CASE 
            WHEN "RMFs"."Date" BETWEEN '${
              year - 1
            }-10-01' AND '${year}-12-31' THEN "RMFs"."RU_TotalCollected"::numeric
            ELSE 0
        END), 0), 2) AS "Q1_Revenue",
        ROUND(COALESCE(SUM(CASE 
            WHEN "RMFs"."Date" BETWEEN '${year}-01-01' AND '${year}-03-31' THEN "RMFs"."RU_TotalCollected"::numeric
            ELSE 0
        END), 0), 2) AS "Q2_Revenue",
        ROUND(COALESCE(SUM(CASE 
            WHEN "RMFs"."Date" BETWEEN '${year}-04-01' AND '${year}-06-30' THEN "RMFs"."RU_TotalCollected"::numeric
            ELSE 0
        END), 0), 2) AS "Q3_Revenue",
        ROUND(COALESCE(SUM(CASE 
            WHEN "RMFs"."Date" BETWEEN '${year}-07-01' AND '${year}-09-30' THEN "RMFs"."RU_TotalCollected"::numeric
            ELSE 0
        END), 0), 2) AS "Q4_Revenue"
    FROM
        "IndicatorPerformances"
    LEFT OUTER JOIN
        "WaterProviders" ON "WaterProviders"."ID" = "IndicatorPerformances"."StakeholderID"
    INNER JOIN
        "RMFs" ON "RMFs"."SectorStakeholder" = "WaterProviders"."Name"
    WHERE
        "WaterProviders"."Type" = 'WSP'
    GROUP BY
        "WaterProviders"."Name", "WaterProviders"."County"
),

BeneficiariesCounts AS (
    SELECT 
        "County" AS name, 
        COALESCE(
            SUM(COALESCE("RU_Newbeneficiaries_NewConnections", 0) +
                COALESCE("RU_Newbeneficiaries_ProtectedSprings", 0) + 
                COALESCE("FPS_NewBeneficiaries_PrivateFunding", 0) + 
                COALESCE("FPS_NewBeneficiaries_PhilanthropicFunding", 0) +
                COALESCE("FPS_NewBeneficiaries_PublicFunding", 0)
            ), 0
        )::int AS value
    FROM 
        "RMFs"  WHERE "RMFs"."Date"::date >= '${start}'::date AND "RMFs"."Date"::date <= '${end}'::date 
    GROUP BY 
        "County"
)

SELECT
    qv."County",
    qv."Name",
	 qv."NRW_Q1",
	 qv."NRW_Q2",
	 qv."NRW_Q3",qv."NRW_Q4",
    qv."Q1_Revenue",
    qv."Q2_Revenue",
    qv."Q3_Revenue",
    qv."Q4_Revenue",
    ROUND(COALESCE(bc_male.value / 2, 0)) AS male,
    ROUND(COALESCE(bc_female.value / 1.5, 0)) AS female
FROM
    QuarterlyValues qv
LEFT JOIN
    BeneficiariesCounts bc_male ON qv."County" = bc_male.name
LEFT JOIN
    BeneficiariesCounts bc_female ON qv."County" = bc_female.name;`
      );
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.BudgetAllocations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, nrwmeta] = await sequelize.query(
        `SELECT 
    "County",
    CAST(MAX(CASE WHEN "FinancialYear" = 'FY 2022/23' THEN "BudgetValue" END) AS DECIMAL(18, 2)) AS "Year1",
    CAST(MAX(CASE WHEN "FinancialYear" = 'FY 2023/24' THEN "BudgetValue" END) AS DECIMAL(18, 2)) AS "Year2",
    CAST(MAX(CASE WHEN "FinancialYear" = 'FY 2023/24' THEN "BudgetValue" END) - MAX(CASE WHEN "FinancialYear" = 'FY 2022/23' THEN "BudgetValue" END) AS DECIMAL(18, 2)) AS "Variance"
FROM 
    "BudgetAllocations"
GROUP BY 
    "County"`
      );
      resolve({
        data: data,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.getCountyStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [ki, kimeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Kisumu'`
      );
      const [bu, bumeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Bungoma'`
      );
      const [ka, kameta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Kakamega'`
      );
      const [ho, hometa] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'HomaBay'`
      );
      const [mi, mimeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Migori'`
      );
      const [b, bmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Busia'`
      );
      const [k, kmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Kisii'`
      );
      const [si, simeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "County" = 'Siaya'`
      );

      resolve({
        KI: ki[0].total,
        BU: bu[0].total,
        KA: ka[0].total,
        HO: ho[0].total,
        MI: mi[0].total,
        B: b[0].total,
        K: k[0].total,
        SI: si[0].total,
      });
    } catch (error) {
      reject(null);
    }
  });
};

exports.filterReportsByComponents = (component) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [data, meta] = await sequelize.query(
        `SELECT * FROM "Reports" ${
          component === "All" ? "" : `WHERE "Component"= '${component}'`
        }`
      );

      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*) FROM "Reports"`
      );

      resolve({ data: data, total: count[0].count });
    } catch (error) {
      reject({ error: "failed" });
    }
  });
};

exports.getReportBarStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tr, smeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports"`
      );
      const [uw, umeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Urban Water Services'`
      );
      const [rw, rmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Rural Water Services'`
      );
      const [wr, wmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Water Resource Management'`
      );
      const [fe, fmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Finance and Private Engagements'`
      );
      const [pg, pmeta] = await sequelize.query(
        `SELECT Count(*)::int as total FROM public."Reports" WHERE "Component" = 'Policy and Governance'`
      );
      const [component, cmeta] = await sequelize.query(
        `SELECT "Component" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "Component"`
      );
      const [county, dmeta] = await sequelize.query(
        `SELECT "County" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "County"`
      );
      const [type, tmeta] = await sequelize.query(
        `SELECT "Type" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "Type"`
      );
      const [department, demeta] = await sequelize.query(
        `SELECT "Department" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "Department"`
      );
      const [category, cameta] = await sequelize.query(
        `SELECT "Category" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "Category"`
      );

      resolve({
        Total: tr,
        UW: uw,
        RW: rw,
        WR: wr,
        FE: fe,
        PG: pg,
        Component: component,
        County: county,
        Type: type,
        Department: department,
        Category: category,
      });
    } catch (error) {
      reject(null);
    }
  });
};

//untested models

exports.findByKeyWord = (query, offset) => {
  return new Promise((resolve, reject) => {
    Reports.findAll({
      where: {
        Keywords: {
          [Sequelize.Op.iLike]: `%${query}%`,
        },
      },
      offset: offset,
      limit: 12,
    }).then(
      (result) => {
        if (result == null) {
          reject({ status: 404, success: "Not found!!" });
        }
        resolve(result);
      },
      (err) => {
        reject({ error: "Failed" });
      }
    );
  });
};

exports.getStatstype = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [tcategory, imeta] = await sequelize.query(
        `SELECT "Reports"."Category", "Reports"."Type" AS name,
        Count(*)::int AS value 
        FROM public."Reports"
        WHERE "Reports"."Category" = '${category}'
        GROUP BY "Reports"."Category", "Reports"."Type"`
      );
      resolve(tcategory);
    } catch (error) {
      reject(null);
    }
  });
};

exports.findCharts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [category, cmeta] = await sequelize.query(
        `SELECT "County" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "County"`
      );
      const [data, dmeta] = await sequelize.query(
        `SELECT "Type" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "Type"`
      );
      const [cp, demeta] = await sequelize.query(
        `SELECT "Component" AS name,Count(*)::int AS value FROM public."Reports" GROUP BY "Component"`
      );
      resolve({
        County: category,
        Type: data,
        Component: department,
      });
    } catch (error) {
      reject({ error: "failed" });
    }
  });
};
exports.findMonthlyPublished = (start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [date, dtmeta] = await sequelize.query(
        `SELECT date_trunc('month', "Reports"."Published") as datetime,
          TO_CHAR("Reports"."Published", 'Month') as name,
          count (*) AS value
          FROM "Reports"
          WHERE "Reports"."Published" >= '${start}' 
          AND "Reports"."Published" <= '${end}'
          GROUP BY date_trunc('month', "Reports"."Published"), TO_CHAR("Reports"."Published", 'Month')`
      );
      resolve(date);
    } catch (error) {
      reject({ error: "Retrieve failed!" });
    }
  });
};

exports.searchReports = (q) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT * FROM "Reports" WHERE "Title" ILIKE '%${q}%'`
      );

      resolve({
        data: results,
        total: 12,
      });
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.filterType = (q, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT * FROM "Reports" WHERE "Type" = '${q}' LIMIT 12 OFFSET ${offset}`
      );

      const [count, cmeta] = await sequelize.query(
        `SELECT Count(*)::int AS total FROM "Reports" WHERE "Type" = '${q}'`
      );

      resolve({
        data: results,
        total: count[0].total,
      });
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};

exports.NRWPerformance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT * FROM "IndicatorPerformance"`
      );

      resolve({
        data: results,
      });
    } catch (error) {
      reject({ error: "Retrieve failed" });
    }
  });
};
