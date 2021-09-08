const express = require('express')
const Auth = require('../controllers/auth')
const UserController = require('../controllers/user')


const router = express.Router()
router.post("/add",Auth.verifyToken, UserController.addBeneficiary )
router.post("/remove",Auth.verifyToken, UserController.removeBeneficiary )



module.exports = router


