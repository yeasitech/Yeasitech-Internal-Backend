const moment = require("moment");
const { S3 } = require("aws-sdk");
const XLSX = require("xlsx");
const { format } = require("date-fns");
const { Op } = require("sequelize");
const { Parser } = require("json2csv");
const fs = require("fs/promises");
require("dotenv").config();

const {
  payroll,
  payrollSheet,
  User,
  Salary,
  BankDetails,
} = require("../models");

exports.createPayroll = async (request, response) => {
  const body = request.body;
  try {
    const createPayroll = await payroll.create({
      ...body.payroll,
      isProcessed: false,
    });
    // let totalDays = 30;
    const createPayrollSheet = await Promise.all(
      body.sheet.map((data) => {
        return payrollSheet.create({
          ...data,
          payrollId: createPayroll.id,
        });
      })
    );

    // const totalPayableAmount = createPayrollSheet.map((data) => {
    //   return data.totalPayable;
    // });
    // const sumOfTotalPayableAmount = totalPayableAmount.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue
    // );
    // const updatedPayroll = await payroll.update(
    //   { total: sumOfTotalPayableAmount },
    //   { where: { id: createPayroll.id } }
    // );
    response
      .status(200)
      .json({ ack: 1, data: createPayroll, createPayrollSheet });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
//edit payroll with sheet

exports.editPayrollWithSheet = async (request, response) => {
  const body = request.body;
  const payrollId = request.params.id;
  //console.log("data", request.body.payroll);

  try {
    const dataSheet = await payrollSheet.findAll({
      where: { payrollId: payrollId },
    });
    const payrollData = await payroll.findOne({ where: { id: payrollId } });
    if (!dataSheet || !payrollData) {
      response.status(200).json({ ack: 0, msg: `No data found with this id ` });
    } else {
      const updatedPayroll = await payroll.update(
        { ...request.body.payroll },
        { where: { id: payrollId } }
      );

      const updatedPayrollSheet = await Promise.all(
        body.sheet.map((data) => {
          return payrollSheet.update({ ...data }, { where: { id: data.id } });
        })
      );
      response
        .status(200)
        .json({ ack: 1, data: { updatedPayroll, updatedPayrollSheet } });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

// edit payroll
exports.editPayroll = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payrollId` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `invalid payroll Data` });
      } else {
        const updatedPayroll = await payroll.update(
          { ...request.body },
          {
            where: { id },
          }
        );
        response
          .status(200)
          .json({ ack: 1, msg: `Successfully Updated payroll` });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

// payroll list
exports.payrollList = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows: payrollData } = await payroll.findAndCountAll({
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: payrollData,
      elementCount: payrollData.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Processing date update
exports.editIsProcess = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payrollId` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `invalid payroll Data` });
      } else {
        const date = new Date();

        const updatedPayroll = await payroll.update(
          {
            isProcessed: !payrollData.isProcessed,
            processingDate: date,
          },
          {
            where: { id },
          }
        );
        response
          .status(200)
          .json({ ack: 1, msg: `Successfully Updated payroll` });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

// delete payroll
exports.deletePayroll = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payroll Id` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(200).json({ ack: 0, msg: `invalid payroll Id` });
      } else {
        const deleteSheet = await payrollSheet.destroy({
          where: { payrollId: id },
        });
        const deletedPayroll = await payroll.destroy({
          where: { id },
        });
        response.status(200).json({
          ack: 1,
          msg: `Successfully Deleted payroll and payroll-sheet`,
          data: { deletedPayroll, deleteSheet },
        });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

exports.deletePayrollSheet = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0) {
      response.status(500).json({ ack: 0, msg: `invalid id` });
    } else {
      const payrollData = await payrollSheet.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `No Data found` });
      } else {
        const deletedPayroll = await payrollSheet.destroy({
          where: { id },
        });
        response.status(200).json({
          ack: 1,
          msg: `Successfully Deleted `,
          data: deletedPayroll,
        });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

exports.payrollSheetList = async (request, response) => {
  const payrollId = request.params.id;
  // const limit = parseInt(elements);
  // const offset = parseInt(limit * (page - 1));

  try {
    const payrollData = await payroll.findOne({
      where: { id: payrollId },
    });
    if (!payrollData) {
      response.status(500).json({ ack: 0, msg: `No data found` });
    } else {
      const payrollSheetData = await payrollSheet.findAll({
        where: { payrollId: payrollId },
      });
      response.status(200).json({
        ack: 1,
        data: { payrollData, payrollSheetData },
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.singlePayrollSheet = async (request, response) => {
  const id = request.params.id;
  try {
    const data = await payrollSheet.findByPk(id);
    if (!data) {
      response.status(200).json({ ack: 1, data: "No data found" });
      return;
    }
    response.status(200).json({ ack: 1, data: data });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.editPayrollSheet = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payrollSheetId` });
    else {
      const payrollData = await payrollSheet.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `No Data found` });
      } else {
        const updatedPayroll = await payrollSheet.update(
          { ...request.body },
          {
            where: { id },
          }
        );
        response
          .status(200)
          .json({ ack: 1, msg: `Successfully Updated payrollSheet` });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

exports.payrollSheetListToExcel = async (request, response) => {
  const id = request.params.id;
  const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
  const SECRET_KEY = process.env.AWS_SECRET_KEY;
  const BUCKET = process.env.AWS_BUCKET;
  const s3 = new S3({ accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY });

  try {
    const payrollSheetData = await payrollSheet.findAll({
      where: {
        payrollId: id,
      },
      attributes: ["name", "totalPayable", "userId"],
    });

    for (let i = 0; i < payrollSheetData.length; i++) {
      let userIds = payrollSheetData[i].userId;

      let bankInfo = await BankDetails.findOne({
        where: { userId: userIds },
        attributes: ["accountNumber", "ifscCode"],
      });
      payrollSheetData[i].dataValues.accountNumber =
        bankInfo.dataValues.accountNumber;
      payrollSheetData[i].dataValues.ifscCode = bankInfo.dataValues.ifscCode;
    }

    if (payrollSheetData.length == 0) {
      response.status(200).json({
        ack: 1,
        msg: `No data found.`,
      });
    } else {
      const now = new Date();
      const date = format(now, "yyyyMMddHHmmss");

      const fields = [
        {
          label: "CUSTOMER NAME",
          value: "name",
        },
        {
          label: "ACCOUNT NUMBER",
          value: "accountNumber",
        },
        {
          label: "IFSC CODE",
          value: "ifscCode",
        },
        {
          label: "SALARY",
          value: "totalPayable",
        },
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(payrollSheetData);
      //console.log("csv", csv);
      const csvBuffer = Buffer.from(csv);
      const params = {
        Bucket: BUCKET,
        Key: `Payroll_${date}.csv`,
        Body: csvBuffer,
        ContentType: "text/csv",
      };
      const uploadData = await s3.upload(params).promise();
      const url = uploadData.Location;
      const result = await payroll.update(
        { url: uploadData.Location },
        { where: { id: id } }
      );
      response.status(200).json({
        ack: 1,
        data: { payrollSheetData, url },
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
