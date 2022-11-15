const { StatusCodes } = require("http-status-codes")
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const authentication = async (req,res,next) =>{
    const token = req.headers.authorization
    if(!token.startsWith('Bearer')){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : "Invalid Authorization Header Format...Try again.!!!"
        })
    }
    else{
        try{
            const {data : { _id : id,email:email, name: name, role : role}} = jwt.verify((token.split(' ')[1]),'jwtsecretkey')
            const user = await User.findOne({_id : id})
            if(!user)
            {
                res.status(StatusCodes.NOT_ACCEPTABLE).json({
                    errorMsg : "Authentication Invalid.!!!"
                })
            }
            else{
                req.user = { 
                    name : name,
                    email : email,
                    role: role,
                    id: id
                }
                next()
            }
        }
        catch(error){
            res.status(StatusCodes.REQUEST_TIMEOUT).json({
                errorMsg : error
            })
        }
        
    }
}

module.exports = authentication