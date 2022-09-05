const { request } = require("express");
const db = require("../models/index");
const Holiday = db.Holiday;

exports.createHoliday = async (request, response) => {
  const { title, holidayDate } = request.body;
  const holidayInfo = {
    title: title,
    holidayDate: new Date(holidayDate),
  };
  try {
    const createHoliday = await Holiday.create(holidayInfo);
    response.status(200).json({ ack: 1, msg: createHoliday });
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || `Server Error` });
  }
};

exports.getAllHoliday = async (request, response) => {
  const allHolidays = await Holiday.findAll();
  response.status(200).json({ ack: 1, msg: allHolidays });
};

exports.updateHoliday = async (request, response) => {
  const HolidayId = request.params.HolidayId;
  const { title, holidayDate } = request.body;

  const updatedHoliday = await Holiday.update(
    {
      title: title,
      holidayDate: new Date(holidayDate),
    },
    { where: { id: HolidayId } }
  );
  response.status(200).json({ ack: 1, msg: `successfully updated holiday` });
};
