


const { internalResponse } = require('../utils/responseHandler');

const { Bank, BankDetails } = require('../models/index');
const Paystack = require('../utils/paystack');
class BankController {
  static async addBank(name, account_number, bank_name, userId) {
    try {
      //you can get list of banks using paystack and save them in the database
      const bankDetails = await Bank.findOne({ where: { name: bank_name } })
      if (!bankDetails) {
        return internalResponse(false, "", 404, "bank not found")
      }
      const bankCode = bankDetails.dataValues.code
      let recipientCode;
      //resolve account number using paystack
      const response = await Paystack.resolveAcct_Num(account_number, bankCode)
      if (response.status) {
        //create a transfer recipient  to get a recipient which you will use to initiate transfers 
        const result = await Paystack.transferRecipient(name, account_number, bankCode)
        recipientCode = result.data.recipient_code
      }
      await BankDetails.create({ name, account_number, bank_name, bank_code: bankCode, recipient_code: recipientCode, userId })
      return internalResponse(true, "", 201, "bank added succefully")

    } catch (err) {
      console.log(err)
      throw new Error("unable to add bank")
    }


  }

}
module.exports = BankController