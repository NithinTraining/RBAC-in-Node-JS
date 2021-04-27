const db = require("../models")
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')
const validToken = require('../middlewares/middleware')


module.exports = {
    signUp: async (req, res) => {

        try {
            const salt = await bcryptjs.genSalt(10)
            const hash = await bcryptjs.hash(req.body.password, salt)
            const users = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role_id: req.body.isAdmin ? 1 : 2
            }
            
            console.log({users})
            const result = await db.user.create(users)
            console.log({result});



            return res.status(200).json({
                success: true,
                message: "user created Successfully"
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "something went wrong"
            })

        }




    },
    login: async (req, res) => {
        try {

            const user = await db.user.findOne({ where: { email: req.body.email } })
            if (!user) {
                res.status(401).json({
                    message: "No User Found"
                })
            } else {
                bcryptjs.compare(req.body.password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                            email: user.email,
                            user_id: user.id
                        }, 'secret')
                        res.status(200).json({
                            success: true,
                            message: "authentication successfull",
                            token: token
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "invalid credentials"
                        })
                    }
                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "something went wrong"

            })
        }




    },
    allUsers: async (req, res) => {

        try {
            const user= await db.user.findOne({where: {email: req.user.email}, raw: true})
            console.log(user);
            if(user.role_id !==1){
                return res.status(400).json({
                    success: false,
                    message: "you have no permission to view all users"
                })
            }

            const usersList = await db.user.findAll()

            return res.status(200).json({
                success: true,
                message: "Got All the users",
                data: usersList
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "server error"

            })

        }
    },
    getProfile: async (req, res) => {
        try {
            // console.log(req);
            const user = await db.user.findOne({ where: { email: req.user.email } ,raw:true})

            if(user.role_id!==2){
                return res.status(400).json({
                    success: false,
                    message: "you have no permission"
                })
            }
            return res.status(200).json({
                success: true,
                message: "get user profile successfully",
                data:{
                    user
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "server error"

            })

        }
    }
}
