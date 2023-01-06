const moment = require("moment");
const { S3 } = require("aws-sdk");
const { format } = require("date-fns");
const { Parser } = require("json2csv");
const fs = require("fs");
var path = require("path");


const puppeteer = require("puppeteer");
const hbs = require("handlebars");
require("dotenv").config();

const { payroll, payrollSheet, Salary, BankDetails } = require("../models");





exports.createPayroll = async (request, response) => {
  const body = request.body;
  try {
    const createPayroll = await payroll.create({
      ...body.payroll,
      isProcessed: false,
    });
    const createPayrollSheet = await Promise.all(
      body.sheet.map(async (data) => {
        const salaryData = await Salary.findOne({
          order: [["updatedAt", "DESC"]],
          where: { userId: data.userId },
        });
        let currentSalary = salaryData.dataValues.currentSalary;
        let totalSalary = (data.presentDays / data.totalDays) * currentSalary;
        let totalPayable = totalSalary + data.bonus - data.tax;
        return await payrollSheet.create({
          name: data.name,
          salary: currentSalary,
          presentDays: data.presentDays,
          totalDays: data.totalDays,
          totalSalary: totalSalary,
          tax: data.tax,
          bonus: data.bonus,
          totalPayable: totalPayable,
          userId: data.userId,
          payrollId: createPayroll.id,
        });
      })
    );
    let date = new Date();
    const now = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDate = format(now, "yyyy/MM/dd");

    let excelData = await payrollSheetListToExcel(createPayroll.id);

    let userPdfData = excelData.payrollSheetData.map((e) => e.dataValues);

    let pdfdata = {};
    pdfdata.TotalAmount = createPayroll.total;
    pdfdata.date = firstDate;
    pdfdata.users = userPdfData;

    let pdf = await letterHead(pdfdata);


    return response.status(200).json({
      ack: 1,
      msg: "successfully created payroll & payroll sheet",
      data: createPayroll,
      createPayrollSheet,
      excelData,
      pdfdata,
    });
  } catch (error) {
    console.log("error", error);
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

//edit payroll with sheet
exports.editPayrollWithSheet = async (request, response) => {
  const body = request.body;
  const payrollId = request.params.id;

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

async function payrollSheetListToExcel(id) {
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
    await Promise.all(
      payrollSheetData.map(async (e) => {
        const bankInfo = await BankDetails.findOne({
          order: [["updatedAt", "DESC"]],
          where: { userId: e.userId },
          attributes: ["accountNumber", "ifscCode"],
        });
        if (bankInfo == null) {
          delete e.dataValues.name;
          delete e.dataValues.totalPayable;
          delete e.dataValues.userId;
        } else {
          delete e.dataValues.userId;
          e.dataValues.accountNumber = bankInfo.dataValues.accountNumber;
          e.dataValues.ifscCode = bankInfo.dataValues.ifscCode;
          e.dataValues.id = bankInfo.dataValues.id;
        }
        return e.dataValues;
      })
    );

    if (payrollSheetData.length == 0) {
      console.log(`qwertyu7`);
    } else {
      const now = new Date();
      const year = now.getFullYear();
      // const month = now
      //   .getMonth()
      //   .toLocaleString("default", { month: "short" });
      let month;
      switch (now.getMonth()) {
        case 0:
          month = "Jan";
          break;
        case 1:
          month = "Feb";
          break;
        case 2:
          month = "Mar";
          break;
        case 3:
          month = "Apr";
          break;
        case 4:
          month = "May";
          break;
        case 5:
          month = "Jun";
          break;
        case 6:
          month = "Jul";
          break;
        case 7:
          month = "Aug";
          break;
        case 8:
          month = "Sep";
          break;
        case 9:
          month = "Oct";
          break;
        case 10:
          month = "Nov";
          break;
        case 11:
          month = "Dec";
      }
      const date = format(now, "yyyyMMddHHmmss");

      const fields = [
        {
          label: "CUSTOMER NAME",
          value: "dataValues.name",
        },
        {
          label: "ACCOUNT NUMBER",
          value: "dataValues.accountNumber",
        },
        {
          label: "IFSC CODE",
          value: "dataValues.ifscCode",
        },
        {
          label: "SALARY",
          value: "dataValues.totalPayable",
        },
      ];

      const json2csvParser = new Parser({ fields });

      const csv = json2csvParser.parse(payrollSheetData);

      // fs.writeFileSync("./data.csv", csv);
      const csvBuffer = Buffer.from(csv);

      let dirName = "payroll";
      if (process.env.ENV == "production") {
        dirName = "docs";
      }
      const params = {
        dirName: dirName,
        Bucket: BUCKET,
        Key: `${dirName}/${year}-${month}/${date}.csv`,
        Body: csvBuffer,
        ContentType: "text/csv",
      };

      const uploadData = await s3.upload(params).promise();
      const url = uploadData.Location;
   
      await payroll.update({ url: url }, { where: { id: id } });

      return { payrollSheetData, url };
    }
  } catch (error) {
    console.log(error);
  }
}
let date = new Date();
const now = new Date(date.getFullYear(), date.getMonth(), 1);
const firstDate = format(now, "yyyy/MM/dd");
console.log(`qwerty6uiop`, firstDate);
let data = {
  TotalAmount: 5000,
  date: firstDate,
  users: [
    {},
    {
      name: " sayantan",
      totalPayable: 9516.67,
      accountNumber: "7875486464654",
      ifscCode: "1234sgsddc",
    },
    {
      name: " ramjan sk.",
      totalPayable: 67426.7,
      accountNumber: "01356545655",
      ifscCode: "1234656",
    },
  ],
};

async function compareHtmlToPdf(fileName, data) {
  let template = path.join(__dirname, "..", "pdfTemplate", "index.html");
  console.log(`readFileSync`, data);
  const html = fs.readFileSync(template, "utf-8");
  return hbs.compile(html)(data);
}

exports.htmlToPdf = async (response) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setContent(
    //   "<table><tr><td>1</td><td>ABC</td></tr><tr><td>2</td><td>DEF</td></tr><tr><td>3</td><td>GHI</td></tr></table>"
    // );
    const content = await compareHtmlToPdf("index.html", data);
    await page.setContent(content);
    // create a pdf document
    const pdf = await page.pdf({
      path: "test.pdf",
      format: "A4",
      printBackground: true,
    });
    console.log(`Done Creating Pdf`);
    await browser.close();
    return pdf;
    //process.exit();
  } catch (error) {
    console.log(error);
  }
};

// async function compareHtmlToPdf(fileName, data) {
//   let template = path.join(__dirname, "..", "pdfTemplate", "index.html");
//   console.log(`readFileSync`, data);
//   const html = fs.readFileSync(template, "utf-8");
//   return hbs.compile(html)(data);
// }

async function letterHead(data) {
  try {
    let template = path.join(__dirname, "..", "pdfTemplate", "index.html");

    const html = fs.readFileSync(template, "utf-8");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const content = hbs.compile(html)(data);

    //const content = await compareHtmlToPdf("index.html", data);
    await page.setContent(content);
    // create a pdf document
    const pdf = await page.pdf({
      path: "test.pdf",
      format: "A4",
      printBackground: true,
    });
    console.log(`Done Creating Pdf`);
    await browser.close();
    return pdf;
    //process.exit();
  } catch (error) {
    console.log(error);
  }
}

// exports.htmlToPdf = async (response) => {
//   let doc = new jsPDF();
//   let template = path.join("pdfTemplate", "index.html");
//   const data = fs.readFileSync(template);
//   // let options = { format: "Letter" };
//   // pdf.fromHTML(data, options);
//   // pdf.save("test.pdf");
//   // console.log(`qwertyui`, data);
//   try {
//     var april_2_html_table = "<table><tr><td>1</td><td>ABC</td></tr></table>";
//     doc.fromHTML(april_2_html_table, 10, 140);
//     doc.addPage();
//     const arrayBuffer = doc.output("arraybuffer");
//     pdf.save("test.pdf");
//     doc.close();

//     // convert to Buffer
//     const pdfBuffer = Buffer.from(new Uint8Array(arrayBuffer));
//   } catch (error) {
//     console.log(error);
//   }
// };
