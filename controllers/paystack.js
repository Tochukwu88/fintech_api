
const { User, Wallet, Beneficiary } = require('../models/index')
const Paystack = require("../utils/paystack")
const crypto = require('crypto');
const { successRes, errorResponse } = require('../utils/responseHandler');
const UserController = require('./user');

class PaystackController {
  static async initPaystack(req, res) {
    try {
      const { amount } = req.body
      const user = await User.findOne({ where: { id: req.user.id } })
      const response = await Paystack.initialize(user.dataValues.email, parseInt(amount))
      return successRes(res, response)

    } catch (error) {
      return errorResponse(res, "error occourred, contact support", 500)
    }

  }
  static async verify(req, res) {
    try {
      let hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRETKEY).update(JSON.stringify(req.body)).digest('hex');
      if (hash == req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        const response = req.body;
        if (response.event === 'charge.success') {
          await UserController.fund(response.data)


        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.log(error)
      return errorResponse(res, "error occourred, contact support", 500)
    }

  }
}
module.exports = PaystackController