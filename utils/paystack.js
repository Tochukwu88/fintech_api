const fetch = require('isomorphic-fetch')

const { Bank } = require('../models/index')
class Paystack{
    static async initialize(email,amount){
        try{
            const response = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRETKEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "amount": amount*100
                })
            })
            return response.json()
        }catch(error){
            console.log(err)
        }
    }
    static async verify(ref){
        try {




            const response = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRETKEY}`,
                    'Content-Type': 'application/json'
                },
    
            })
            return await response.json()
    
    
    
        } catch (err) {
            console.log(err)
        }
    
    }
    //to get all the banks and their code , should be run just once
    static async listbanks(req,res){
        try {


           

            const response = await fetch(`https://api.paystack.co/bank`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRETKEY}`,
                    'Content-Type': 'application/json'
                },
    
            })
            console.log(response)
            const r =await response.json()
            const data = r.data
            for(const bank of data){

                await Bank.create({name:bank.name,code:bank.code})
            }

            res.send(r)
    
    
    
        } catch (err) {
            console.log(err)
        }
    
    }
    static async resolveAcct_Num(number,code){
        try {




            const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${number}&bank_code=${code}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRETKEY}`,
                    'Content-Type': 'application/json'
                },
    
            })
            return await response.json()
    
    
    
        } catch (err) {
            console.log(err)
        }
    
    }
    static async transferRecipient(name,acctNum,bankCode){
        try {




            const response = await fetch(`https://api.paystack.co/transferrecipient`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRETKEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type":"nuban",
                    "name" : name,
                    "account_number": acctNum,
                    "bank_code": bankCode,
                    "currency": "NGN"
                })
    
            })
            return await response.json()

    
    
    
        } catch (err) {
            console.log(err)
        }
    
    }
    static async initiateTransfer(amount,code){
        try {




            const response = await fetch(`https://api.paystack.co/transfer`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRETKEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "source": "balance",
                    "amount": amount,
                    "recipient": code,
                    "reason": "you deserve it"
                })
    
            })
           
            return await response.json()
    
    
    
        } catch (err) {
            console.log(err)
        }
    
    }
}
module.exports = Paystack
