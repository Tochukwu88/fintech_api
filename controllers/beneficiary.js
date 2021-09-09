
const { User, Beneficiary } = require('../models/index');
const { internalResponse } = require('../utils/responseHandler');
class BeneficiaryController {
  static async add(id, beneficiaryEmail) {
    try {
      const bUser = await User.findOne({ where: { email: beneficiaryEmail } })
      const user = await User.findOne({ where: { id } })
      let beneficiaryId;

      if (!bUser) {
        return internalResponse(false, "", 404, "beneficiary does not exist")

      }
      if (!user) {
        return internalResponse(false, "", 404, "beneficiary does not exist")
      }
      beneficiaryId = bUser.dataValues.id

      const check = await Beneficiary.findAll({
        where: {
          beneficiaryId,
          benefactorId: id

        }
      })

      if (check.length > 0) {
        return internalResponse(false, "", 404, "user is already a beneficiary")
      }
      await Beneficiary.create({ benefactorId: id, beneficiaryId })
      return internalResponse(true, "", 200, `${bUser.dataValues.firstName} added as a beneficiary`)

    } catch (error) {
      throw new Error("adding beneficiary failed")
    }

  }
  static async remove(id, beneficiaryEmail) {
    try {
      const bUser = await User.findOne({ where: { email: beneficiaryEmail } })
      const user = await User.findOne({ where: { id } })
      if (!bUser) {
        return internalResponse(false, "", 404, "beneficiary does not exist")

      }
      if (!user) {
        return internalResponse(false, "", 404, "beneficiary does not exist")

      }
      let beneficiaryId;


      beneficiaryId = bUser.dataValues.id

      const check = await Beneficiary.findAll({
        where: {
          beneficiaryId,
          benefactorId: id

        }
      })
      if (check.length < 1) {
        return internalResponse(false, "", 404, "not a beneficiary")
      }

      await Beneficiary.destroy({ where: { beneficiaryId, benefactorId: id } })
      return internalResponse(true, "", 200, "succesfully removed beneficiary")
    } catch (err) {
      throw new Error("removing beneficiary failed")
    }
  }

}
module.exports = BeneficiaryController