const moment = require("moment");
const XLSX = require("xlsx");
const { format } = require("date-fns");
const { Op } = require("sequelize");
const { payroll, payrollSheet, User, Salary } = require("../models");

exports.createPayroll = async (request, response) => {
  const body = request.body;
  try {
    const createPayroll = await payroll.create({
      ...body.payroll,
      isProcessed: false,
    });

    const createPayrollSheet = await Promise.all(
      body.sheet.map((data) => {
        return payrollSheet.create({ ...data, payrollId: createPayroll.id });
      })
    );
    const totalPayableAmount = createPayrollSheet.map((data) => {
      return data.totalPayable;
    });
    const sumOfTotalPayableAmount = totalPayableAmount.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const updatedPayroll = await payroll.update(
      { total: sumOfTotalPayableAmount },
      { where: { id: createPayroll.id } }
    );
    response
      .status(200)
      .json({ ack: 1, data: createPayroll, createPayrollSheet });
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

// is precessing update
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
        const updatedPayroll = await payroll.update(
          { isProcessed: !payrollData.isProcessed },
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
      response.status(500).json({ ack: 0, msg: `invalid payrollId` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `invalid payroll Data` });
      } else {
        const deletedPayroll = await payroll.destroy({
          where: { id },
        });
        response.status(200).json({
          ack: 1,
          msg: `Successfully Deleted payroll`,
          data: deletedPayroll,
        });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};
exports.createPayrollSheet = async (request, response) => {
  try {
    const { presentDays, bonus, tax, userId, totalPayable, totalSalary } =
      request.body;
    const salaryData = await Salary.findOne({
      order: [["updatedAt", "DESC"]],
      where: { userId },
    });

    const userData = await User.findOne({
      where: { id: userId },
      attributes: ["firstName", "middleName", "lastName"],
    });
    if (!userData) {
      response
        .status(200)
        .json({ ack: 1, data: "No User found  with this userid" });
      return;
    }
    if (!salaryData) {
      response
        .status(200)
        .json({ ack: 1, data: "No salary data found  with this userid" });
      return;
    }
    //console.log(`qwertyuiop`, salaryData.dataValues.currentSalary);
    //const daysInMongth = moment().daysInMonth();
    // const totalSalary =
    //   (salaryData.dataValues.currentSalary / daysInMongth) * presentDays;

    const fullName =
      userData.dataValues.firstName +
      " " +
      // userData.dataValues.middleName +
      // " " +
      userData.dataValues.lastName;
    let payload = {
      presentDays,
      totalSalary,
      tax,
      bonus,
      totalPayable,
      // totalPayable: totalSalary + bonus - tax,
      salary: salaryData.dataValues.currentSalary,
      name: fullName,
    };
    const payrollSheetData = await payrollSheet.create(payload);
    //console.log("sdfghjk", payrollSheetData);
    response.status(200).json({ ack: 1, data: payrollSheetData });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

exports.deletePayrollSheet = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid id` });
    else {
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
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows: payrollSheetData } =
      await payrollSheet.findAndCountAll({
        limit,
        offset,
        //order: [["createdAt", "AESC"]],
      });
    response.status(200).json({
      ack: 1,
      data: payrollSheetData,
      elementCount: payrollSheetData.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
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
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  const month = moment().month() + 1;
  const year = moment().year();
  const fromDate = moment(`${year}-${month}-01`);
  const toDate = fromDate.add(1, "month").subtract(1, "second");
  console.log("toDate", toDate.format());
  console.log("fromDate", fromDate.format());

  try {
    const payrollSheetData = await payrollSheet.findAll({
      attributes: { exclude: ["id", "createdAt", "updatedAt", "payrollId"] },
      where: {
        createdAt: { [Op.between]: [fromDate.format(), toDate.format()] },
      },
    });

    const now = new Date();
    const date = format(now, "yyyyMMddHHmmss");
    const data = payrollSheetData.map((e) => e.dataValues);
    console.log(data);
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Employee_payroll_Sheet");

    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    //XLSX.writeFile(workBook, `${date}.xlsx`);

    response.status(200).json({
      ack: 1,
      data: payrollSheetData,
      // elementCount: payrollSheetData.length,
      // totalElements: count,
      // totalpage: Math.ceil(count / elements),
      // page: parseInt(page),
      // elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
