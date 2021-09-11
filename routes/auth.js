const express = require('express')
const {  userValidationRules,
    
    validate,
    signinValidationRules,
    signinvalidate} =  require('../validation/index')



const Auth = require('../controllers/auth')

const router = express.Router()
router.post("/register",userValidationRules(),validate, Auth.register )
router.post("/login",     signinValidationRules(),
signinvalidate,Auth.login )



module.exports = router


