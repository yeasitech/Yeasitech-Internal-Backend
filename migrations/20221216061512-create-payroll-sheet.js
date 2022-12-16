'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payrollSheets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      salary: {
        type: Sequelize.FLOAT
      },
      presentDays: {
        type: Sequelize.INTEGER
      },
      totalSalary: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
      },
      bonus: {
        type: Sequelize.FLOAT
      },
      totalDays: {
        type: Sequelize.INTEGER
      },
      totalPayable: {
        type: Sequelize.FLOAT
      },
      payrollId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payrollSheets');
  }
};