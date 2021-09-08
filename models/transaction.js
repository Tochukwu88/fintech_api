'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Wallet}) {
      // define association here
      
      this.belongsTo(Wallet, { foreignKey: "walletId" })
    }
  };
  Transaction.init({
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currentBalance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false
    },
  
    walletId:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    description: {
      type: DataTypes.STRING,
      
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};