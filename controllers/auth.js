const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { successRes, errorResponse } = require('../utils/responseHandler')
const Wallets = require('./wallet')
const db = require('../models/index')


class Auth {
    static async register(req, res) {
        let transaction

        try {
            transaction = await db.sequelize.transaction()
            const { firstName, lastName, email, password } = req.body
            const user = await User.findOne({ where: { email } }, { transaction })
            if (user) {
                return errorResponse(res, "user with that email already exist", 409)


            }
            const newUser = await User.create({ firstName, lastName, email, password }, { transaction })
            await Wallets.createWallet(newUser.dataValues.id)
            await transaction.commit()
            return successRes(res, {}, `welcome ${newUser.firstName}`, 201)



        } catch (error) {
            await transaction.rollback()

            return errorResponse(res, "error occourred, contact support", 500)




        }




    }
    static async login(req, res) {

        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email } })
            if (user === null) {
                return errorResponse(res, "user with that email does not  exist", 404)


            }
            const comparedPassword = await bcrypt.compare(password, user.dataValues.password);

            if (!comparedPassword) {
                return errorResponse(res, "email and password do not match", 401)


            }
            const token = jwt.sign({ id: user.dataValues.id }, process.env.JWTSECRET, { expiresIn: process.env.TOKENVALIDITY })

            const userData = {
                "uuid": user.dataValues.uuid,
                "firstName": user.dataValues.firstName,
                "email": user.dataValues.email
            }
            return successRes(res, { token, userData }, "", 200)


        } catch (error) {

            return errorResponse(res, "error occourred, contact support", 500)

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
            return errorResponse(res, "please login", 403)


        }


    }
}
module.exports = Auth
