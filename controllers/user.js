const { errorResponse, successRes } = require("../utils/responseHandler")
const BeneficiaryController = require("./beneficiary")
const { User, Wallet, Transaction } = require('../models/index')
const Wallets = require("./wallet")
const BankController = require("./bank")

class UserController {
  static async fund(data) {
    const { amount, customer } = data
    const amountInNaira = parseInt(amount) / 100
    const user = await User.findOne({ where: { email: customer.email } })
    let userWallet
    if (user) {
      const wallet = await Wallet.findOne({ where: { userId: user.dataValues.id } })
      userWallet = wallet ? wallet : await Wallets.createWallet(user.dataValues.id)
    }
    const walletId = userWallet.dataValues.id
    return await Wallets.creditWallet(walletId, amountInNaira)

  }
  static async transfer(req, res) {
    try {
      const authId = req.user.id
      const { email, description, amount } = req.body
      const response = await Wallets.transfer(authId, email, parseInt(amount), description)
      console.log(response)
      if (!response.status) {
        return errorResponse(res, response.message, response.statusCode)
      }
      return successRes(res, {}, response.message, response.statusCode)

    } catch (error) {
      console.log(error)
      return errorResponse(res, "error occourred, contact support", 500)
    }
  }
  static async withdraw (req,res){
    try {
      const authId = req.user.id
      const {  amount } = req.body
      const response = await Wallets.withdraw(  parseInt(amount),authId)
      if (!response.status) {
        return errorResponse(res, response.message, response.statusCode)
      }
      return successRes(res, {}, response.message, response.statusCode)

    } catch (error) {
      console.log(error)
      return errorResponse(res, "error occourred, contact support", 500)
    }

  }
  static async withdrawToBeneficiary (req,res){
    try {
      const authId = req.user.id
      const {  amount,email } = req.body
      const response = await Wallets.withdrawToBeneficiary(  parseInt(amount),authId,email)
      if (!response.status) {
        return errorResponse(res, response.message, response.statusCode)
      }
      return successRes(res, {}, response.message, response.statusCode)

    } catch (error) {
      console.log(error)
      return errorResponse(res, "error occourred, contact support", 500)
    }

  }
  static async addBeneficiary(req, res) {
    try {

      const authId = req.user.id
      const email = req.body.email
      const response = await BeneficiaryController.add(authId, email)
      if (!response.status) {
        return errorResponse(res, response.message, response.statusCode)
      }
      return successRes(res, {}, response.message, response.statusCode)


    } catch (error) {
      return errorResponse(res, "error occourred, contact support", 500)

    }

  }
  static async removeBeneficiary(req, res) {
    try {
      const authId = req.user.id
      const email = req.body.email
      const response = await BeneficiaryController.remove(authId, email)
      if (!response.status) {
        return errorResponse(res, response.message, response.statusCode)
      }
      return successRes(res, {}, response.message, response.statusCode)


    } catch (error) {
      return errorResponse(res, "error occourred, contact support", 500)
    }
  }
  static async addBank(req,res){
    const authId = req.user.id
    const{name,account_number,bank_name} = req.body
      const response = await BankController.addBank(name,account_number,bank_name,authId)
      if(!response.status){
        return errorResponse(res, response.message, response.statusCode)

      }
      return successRes(res, {}, response.message, response.statusCode)

  }
}
module.exports = UserController