const { responseHandler } = require("../utils/responseHandler")
const BeneficiaryController = require("./beneficiary")

class UserController {
    static async fund(){}
    static async transfer(req,res){
        try{
            const authId = req.user.id
            const {email,description} = req.body
            await BeneficiaryController.transfer(authId,email,description)
            return responseHandler(res,200,{},` transaction successfull`)
        }catch(error){
            return responseHandler(res,400,{},`${error}`,true)
        }
    }
    static async addBeneficiary (req,res){
      try{
          
        const authId = req.user.id
        const email = req.body.email
       await  BeneficiaryController.add(authId,email)
       return responseHandler(res,201,{},"beneficiary added")

      }catch(error){
          console.log(error)
        return responseHandler(res,400,{},`${error}`,true)

      }

    }
    static async removeBeneficiary(req,res){
        try{
            const authId = req.user.id
            const email = req.body.email
           await  BeneficiaryController.remove(authId,email)
           return responseHandler(res,200,{},"beneficiary removed")
    
          }catch(error){
              console.log(error)
            return responseHandler(res,400,{},`${error}`,true)
    
          }
    }
}
module.exports = UserController