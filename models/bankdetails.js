'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" })
    }
  };
  BankDetails.init({
    type: {
      allowNull:false,
      type: DataTypes.STRING,
      defaultValue:"nuban"
    },
    name: {
      allowNull:false,
      type: DataTypes.STRING
    },
    account_number: {
      allowNull:false,
      type: DataTypes.STRING
    },
    bank_name: {
      allowNull:false,
      type: DataTypes.STRING
    },
    bank_code: {
      allowNull:false,
      type: DataTypes.STRING
    },
    currency: {
      allowNull:false,
      type: DataTypes.STRING,
      defaultValue:"NGN"
    },
    recipient_code:{
      type: DataTypes.STRING,
    },
    userId: {
      allowNull:false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'BankDetails',
  });
  return BankDetails;
};