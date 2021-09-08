const { User , Wallet} = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { responseHandler } = require('../utils/responseHandler')
const Wallets = require('./wallet')


class Auth {
    static async register(req, res) {

        try {
            const { firstName, lastName, email, password } = req.body
            const user = await User.findOne({ where: { email } })
            if (user) {
               return  responseHandler(res,409,{},"user with that email already exist",true)
               
            }
            const newUser = await User.create({ firstName, lastName, email, password })
              await Wallets.createWallet(newUser.dataValues.id)
            return  responseHandler(res,201,{},`welcome ${newUser.firstName}`)
               
        } catch (error) {
            console.log(error)
            return  responseHandler(res,500,{},"error occourred, contact support",true)
            
               
           
        }




    }
    static async login(req, res) {

        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email } })
            if (user === null) {
                return  responseHandler(res,404,{},"user with that email does not exist",true)
               
            }
            const comparedPassword = await bcrypt.compare(password, user.dataValues.password);
            
            if (!comparedPassword) {
                return  responseHandler(res,401,{},"email and password do not match",true)
               
            }
            const token = jwt.sign({ id: user.dataValues.id }, process.env.JWTSECRET, { expiresIn: process.env.TOKENVALIDITY })
          
            const userData = {
                "uuid":user.dataValues.uuid, 
                "firstName":user.dataValues.firstName,
                  "email" :user.dataValues.email
            }
            return responseHandler(res,200,{token,userData},"")
           
        } catch (error) {
            console.log(error)
            return  responseHandler(res,500,{},"error,contact support",true)
          
        }




    }
    static async verifyToken(req, res, next) {

        const authorizationHeaader = req.headers
        try {
            if (authorizationHeaader) {
                const token = authorizationHeaader.authorization.split(' ')[1]



                let decoded = await jwt.verify(token, process.env.JWTSECRET, { expiresIn: process.env.TOKENVALIDITY })
                req.user = decoded


            }
            next()



        } catch (err) {
            return  responseHandler(res,403,{},"please login",true)
           
        }


    }
}
module.exports = Auth
