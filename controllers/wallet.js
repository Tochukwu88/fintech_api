
const db = require('../models/index');
const { User, Wallet, Transaction, BankDetails, Beneficiary } = require('../models/index');
const Paystack = require('../utils/paystack');
const { internalResponse } = require('../utils/responseHandler');

class Wallets {
    static async createWallet(userid) {
        let transaction
        try {
            transaction = await db.sequelize.transaction()
            const user = await User.findOne({ where: { id: userid } }, { transaction })
            if (user) {
                const wallet = await Wallet.findOne({ where: { userId: user.dataValues.id } }, { transaction })

                if (!wallet) {

                    await Wallet.create({ userId: user.dataValues.id, balance: 0.00 }, { transaction })

                }
            }
            await transaction.commit()

        } catch (error) {
            await transaction.rollbaack()
        }


    }
    static async creditWallet(id, amount, description) {
        let transaction
        try {
            transaction = await db.sequelize.transaction()
            if (amount < 0.00) {
                return internalResponse(false, "", 400, "amount must be greater than 0.00")
            }
            const wallet = await Wallet.findOne({ where: { id } }, { transaction })
            if (!wallet) {
                return internalResponse(false, "", 404, "wallet not found")

            }
            const updatedwallet = await wallet.increment('balance', {
                by: amount
            }, { transaction })
            const updatedbalance = await Wallet.findOne({ where: { id: updatedwallet.dataValues.id } }, { transaction })

            await Transaction.create({
                amount,
                transactionType: "credit",
                walletId: id,
                currentBalance: updatedbalance.dataValues.balance,
                description


            }, { transaction })
            await transaction.commit()
            return internalResponse(true, "", 200, "wallet credited")


        } catch (error) {
            await transaction.rollbaack()
            throw new Error("transaction failed")
        }


    }
    static async debitWallet(id, amount, description) {
        let transaction
        try {
            transaction = await db.sequelize.transaction()
            if (amount < 0.00) {
                return internalResponse(false, "", 400, "amount must be greater than 0.00")
            }
            const wallet = await Wallet.findOne({ where: { id } }, { transaction })
            if (!wallet) {
                return internalResponse(false, "", 404, "wallet not found")
            }
            if (wallet.dataValues.balance < amount) {
                return internalResponse(false, "", 400, "insufficient funds")
            }
            const updatedwallet = await wallet.decrement('balance', {
                by: amount
            }, { transaction })
            const updatedbalance = await Wallet.findOne({ where: { id: updatedwallet.dataValues.id } }, { transaction })

            await Transaction.create({
                amount,
                transactionType: "debit",
                walletId: id,
                currentBalance: updatedbalance.dataValues.balance,
                description


            }, { transaction })
            transaction.commit()
            return internalResponse(true, "", 200, "transaction succesfull")



        } catch (error) {
            transaction.rollback()
            console.log(error)
            throw new Error('transaction failed')
        }
    }
    static async transfer(id, email, amount, description) {
        //transfer to any registered user with their email
        let transaction
        try {
            transaction = await db.sequelize.transaction()
            const user = await User.findOne({ where: { id } }, { transaction })
            const beneficiary = await User.findOne({ where: { email } }, { transaction })
            let userWallet
            let beneficiaryWallet;
            if (user) {
                userWallet = await Wallet.findOne({ where: { userId: user.dataValues.id } }, { transaction })

                if (!userWallet) {
                    return internalResponse(false, "", 404, "user does not have a wallet")



                }
            }
            if (beneficiary) {
                beneficiaryWallet = await Wallet.findOne({ where: { userId: beneficiary.dataValues.id } }, { transaction })

                if (!beneficiaryWallet) {
                    return internalResponse(false, "", 404, "beneciciary does not have a wallet")



                }
            }
            const dresponse = await this.debitWallet(userWallet.dataValues.id, amount, description)
            if (!dresponse.status) return dresponse
            const cresponse = await this.creditWallet(beneficiaryWallet.dataValues.id, amount, description)
            if (!cresponse.status) return cresponse
            await transaction.commit()
            return internalResponse(true, "", 200, "transaction successful")


        } catch (error) {
            console.log(error)
            await transaction.rollbaack()
            throw new Error('transaction failed')
        }
    }
    static async withdraw(amount, id) {
        //withdraw from user's wallet to user's bank using paystack
        let transaction
        try {
            transaction = await db.sequelize.transaction()
            const user = await User.findOne({ where: { id } }, { transaction })
            let userWallet
            let userBankDetails
            if (user) {
                userWallet = await Wallet.findOne({ where: { userId: user.dataValues.id } }, { transaction })

                if (!userWallet) {
                    return internalResponse(false, "", 404, "user does not have a wallet")



                }
                userBankDetails = await BankDetails.findOne({ where: { userId: user.dataValues.id } }, { transaction })
                if (!userBankDetails) return internalResponse(false, "", 404, "no bank details")
            }
            const dresponse = await this.debitWallet(userWallet.dataValues.id, amount)

            const result = await Paystack.initiateTransfer(amount, userBankDetails.dataValues.recipient_code)
            //at this point you will receive this json response from paystack
            //   {  status: false,
            //     message: 'You cannot initiate third party payouts as a starter business'}
            // console.log(result)--->> uncomment this to see the response from paystack


            if (dresponse) return dresponse
            await transaction.commit()


        } catch (error) {
            await transaction.rollback()
            throw new Error('transaction failed')
        }

    }
    static async withdrawToBeneficiary(amount, userId, email) {
        //withdraw from user's wallet to beneficiary's account  using paystack
        let transaction
        try {
            transaction = await db.sequelize.transaction()
            const user = await User.findOne({ where: { id: userId } })
            const bUser = await User.findOne({ where: { email } })
            if (!bUser) return internalResponse(false, "", 404, "  beneficiary with that email does not exist")
            const beneficiaryId = bUser.dataValues.id
            const benefactorId = user.dataValues.id
            let check = await Beneficiary.findOne({ where: { beneficiaryId, benefactorId } })

            if (check.length < 1) {
                return internalResponse(false, "", 404, "user is not a beneficiary")
            }



            let userWallet = await Wallet.findOne({ where: { userId: user.dataValues.id } })

            if (!userWallet) {
                return internalResponse(false, "", 404, "user does not have a wallet")



            }
            let BUserBankDetails = await BankDetails.findOne({ where: { userId: beneficiaryId } })
            if (!BUserBankDetails) return internalResponse(false, "", 404, " beneficiary has no bank details")

            const dresponse = await this.debitWallet(userWallet.dataValues.id, amount)

            const result = await Paystack.initiateTransfer(amount, BUserBankDetails.dataValues.recipient_code)
            if (dresponse) return dresponse
            await transaction.commit()
        } catch (error) {
            console.log(error)
            await transaction.rollback()
            throw new Error('transaction failed')
        }

    }




}
module.exports = Wallets