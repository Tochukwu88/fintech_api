'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      amount: {
        type: DataTypes.INTEGER
      },
     
      walletId:{
        type: DataTypes.INTEGER,
        allowNull:false
      },
      currentBalance: {
        type: DataTypes.INTEGER
      },
      transactionType: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Transactions');
  }
};