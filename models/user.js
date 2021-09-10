'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Wallet,Beneficiary,BankDetails}) {
      // define association here
      this.hasMany(Wallet,{foreignKey:"userId"})
      this.hasMany(Beneficiary,{foreignKey:"beneficiaryId"})
      this.hasMany(Beneficiary,{foreignKey:"benefactorId"})
      this.hasOne(BankDetails,{foreignKey:"userId"})
    }
  };
  User.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    firstName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lastName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: true
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    hooks:{
      beforeCreate: async(user)=>{
        if (user.password) {
          const  hash = await bcrypt.hash(user.password, 10)
        user.password = hash
       }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};