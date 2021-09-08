 
 const { User , Wallet,Transaction} = require('../models/index')
 class Wallets{
    static async createWallet (userid){
        const user = await User.findOne({where:{id:userid}})
        if (user) {
            const wallet = await Wallet.findOne({ where: { userId: user.dataValues.id } })

            if (!wallet) {

                await Wallet.create({  userId: user.dataValues.id, balance: 0.00 })
               
            }
        }
        

    }
    static async creditWallet (id,amount,description){
      try{
        if(amount < 0.00){
            throw new Error("amount must be greater than 0.00")
        }
        const wallet = await Wallet.findOne({ where: { id } })
        if(!wallet) {
            throw new Error("wallet not found")
        }
        wallet.increment({
            balance:+amount
        })
        await Transaction.create({
            amount,
            transactionType:"credit",
            walletId:id,
            currentBalance:wallet.balance,
            description
          
        
        })
      }catch(error){
          throw new Error("transaction failed")
      }


    }
    static async debitWallet (id,amount,description){
      try{
        if(amount < 0.00){
            throw new Error("amount must be greater than 0.00")
        }
        const wallet = await Wallet.findOne({ where: { id } })
        if(!wallet) {
            throw new Error("wallet not found")
        }
        if(wallet.balance < amount){
            throw new Error("insufficient funds")
        }
        wallet.decrement({
            balance:-amount
        })
        await Transaction.create({
            amount,
            transactionType:"debit",
            walletId:id,
            currentBalance:wallet.balance,
            description
          
        
        })


      }catch(error){
          throw new Error('transaction failed')
      }
    }
    static async transfer(id,email,amount,description){
        try{
            const user = await User.findOne({where:{id}})
        const beneficiary = await User.findOne({where:{email}})
        let userWallet
        let beneficiaryWallet;
        if (user) {
            userWallet = await Wallet.findOne({ where: { userId: user.dataValues.id } })

            if (!userWallet) {

                throw new Error('user does not have a wallet')
               
            }
        }
        if(beneficiary){
            beneficiaryWallet = await Wallet.findOne({ where: { userId: beneficiary.dataValues.id } })

            if (!beneficiaryWallet) {

                throw new Error('beneciciary does not have a wallet')
               
            }
        }
        await   this.debitWallet(userWallet.dataValues.id, amount,description)
         await  this.creditWallet(beneficiaryWallet.dataValues.id,amount,description)

        }catch(error){
            throw new Error('transaction failed')
        }
    }
       

 }
 module.exports =  Wallets