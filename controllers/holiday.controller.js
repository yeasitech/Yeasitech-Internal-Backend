const { HolidayModel } = require("../models/index");

//create Holidays
exports.createHoliday = async (request, response) => {
  const { title, holidayDate } = request.body;
  const holidayInfo = {
    title: title,
    holidayDate: new Date(holidayDate),
  };
  try {
    const createHoliday = await HolidayModel.create(holidayInfo);
    response.status(200).json({ ack: 1, msg: createHoliday });
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || `Server Error` });
  }
};

// get Holiday
exports.getAllHoliday = async (request, response) => {
  const allHolidays = await HolidayModel.findAll();
  response.status(200).json({ ack: 1, msg: allHolidays });
};

// update Holiday
exports.updateHoliday = async (request, response) => {
  const HolidayId = request.params.HolidayId;
  const { title, holidayDate } = request.body;
  if (!HolidayId || HolidayId === null) {
    response.status(500).json({ ack: 0, msg: `please provide proper Holiday` });
  }
  try {
    const updatedHoliday = await HolidayModel.update(
      {
        title: title,
        holidayDate: new Date(holidayDate),
      },
      { where: { id: HolidayId } }
    );
    response.status(200).json({ ack: 1, msg: `successfully updated holiday` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

// delete Holiday
exports.deleteHoliday = async (request, response) => {
  const holidayId = request.params.holidayId;

  if (!holidayId || holidayId === null) {
    response.status(500).json({ ack: 1, msg: `please provide proper holiday` });
  }
  try {
    const deleteHoliday = await HolidayModel.destroy({
      where: { id: holidayId },
    });
    response.status(200).json({ ack: 1, msg: `successfully deleted holiday` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

//holiday pagination
exports.holidayPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  //console.log(`limit`,limit);
  const offset = parseInt(limit * (page - 1));
  console.log(`offsets`, offset);
  try {
    const { count, rows } = await HolidayModel.findAndCountAll({
      limit,
      offset,
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementCount: rows.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
