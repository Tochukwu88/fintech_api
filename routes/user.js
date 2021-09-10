const express = require('express')
const Auth = require('../controllers/auth')
const PaystackController = require('../controllers/paystack')
const UserController = require('../controllers/user')
const Paystack = require('../utils/paystack')


const router = express.Router()
router.post("/add",Auth.verifyToken, UserController.addBeneficiary )
router.post("/remove",Auth.verifyToken, UserController.removeBeneficiary )
router.post("/fund",Auth.verifyToken, PaystackController.initPaystack )
//webhooks route where paystack sends event to
router.post("/verify",PaystackController.verify)
router.post("/transfer",Auth.verifyToken,UserController.transfer)
router.post("/withdraw",Auth.verifyToken,UserController.withdraw)
router.post("/withdraw/beneficiary",Auth.verifyToken,UserController.withdrawToBeneficiary)
router.post("/addbank",Auth.verifyToken,UserController.addBank)
// paystack callback url
router.get("/cb",(req,res)=>{
    res.send("account successfully funded")
})
//to get list of banks from paystack
 router.get("/banks",Paystack.listbanks)


module.exports = router


