
 const { User , Wallet, Beneficiary} = require('../models/index')
class BeneficiaryController{
  static async add(id,beneficiaryEmail){
  try{
    const bUser =  await User.findOne({ where: { email:beneficiaryEmail } })
    const user  =  await User.findOne({ where: { id } })
    let beneficiaryId;
    
    if(!bUser){
        throw new Error("user does not exist")
    }
    if(!user){
        throw new Error("user does not exist")
    }
    beneficiaryId = bUser.dataValues.id
    
    const check = await Beneficiary.findAll({where:{
      beneficiaryId,
      benefactorId:id

    }})
    
    if(check.length > 0){
        throw new Error("beneficiary already exist")
    }
    await Beneficiary.create({benefactorId:id,beneficiaryId})

  }catch(error){
    throw new Error("adding beneficiary failed")
  }

  }
  static  async remove(id,beneficiaryEmail){
   try{
    const bUser =  await User.findOne({ where: { email:beneficiaryEmail } })
    const user  =  await User.findOne({ where: { id } })
    if(!bUser){
        throw new Error("user does not exist")
    }
    if(!user){
        throw new Error("user does not exist")
    }
    let beneficiaryId;

   
    beneficiaryId = bUser.dataValues.id
    
    const check = await Beneficiary.findAll({where:{
        beneficiaryId,
        benefactorId:id

      }})
      if(check.length < 1){
          throw new Error("beneficiary does not exist")
      }

      await Beneficiary.destroy({where:{beneficiaryId,benefactorId:id}})
   }catch(err){
       throw new Error("removing beneficiary failed")
   }
  }

}
module.exports = BeneficiaryController