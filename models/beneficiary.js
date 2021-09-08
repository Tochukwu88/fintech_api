'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Beneficiary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User, { foreignKey: "beneficiaryId" })
      this.belongsTo(User, { foreignKey: "benefactorId" })
    }
  };
  Beneficiary.init({
    beneficiaryId:  {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    benefactorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Beneficiary',
  });
  return Beneficiary;
};