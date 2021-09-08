'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User,Transaction}) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" })
      this.hasMany(Transaction,{foreignKey:"walletId"})
    }
  };
  Wallet.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    balance:  {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};