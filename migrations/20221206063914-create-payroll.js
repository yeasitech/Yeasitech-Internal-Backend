"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payrolls", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      month: {
        type: Sequelize.STRING,
      },
      processingDate: {
        type: Sequelize.DATEONLY,
      },
      isProcessed: {
        type: Sequelize.BOOLEAN,
      },
      generateDate: {
        type: Sequelize.DATEONLY,
      },
      total: {
        type: Sequelize.FLOAT,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payrolls");
  },
};
