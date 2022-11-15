const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')
const createUserToken = require('../utils/createUserToken')


// REGISTERING USER

const register = async (req,res) =>{
    const {name,email,password} = req.body
    if(!name || !email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : "PLease provide name, email, password for creating user"
        })
    }
    // checking if emailIsAlreadyRegistred?
    const emailAlreaydyExists = await User.findOne({
        email : email
    })
    if(emailAlreaydyExists){
        res.status(StatusCodes.NOT_ACCEPTABLE).json({
            errorMsg : 'Email is already used..Try different one.!!!'
        })
    }

    if (req.query.specialPermission && req.query.specialPermission === "harsh@6519@2163@7295@5282"){
        try{
            // creation of admin user
            const user = await User.create({
                name : name,
                email : email,
                password : password,
                role : 'admin'
            })
            const userToken = await createUserToken(user)
            res.status(StatusCodes.CREATED).json({
                user : {
                    name : user.name,
                    email : user.email,
                    id : user._id,
                    role : user.role
                },
                token : userToken
            })
        }
        catch(error){
            res.status(StatusCodes.BAD_REQUEST).json({
                errorMsg : 'Error in creatig "ADMIN" user..Contact developer.!!!'
            })
        }
    }
    else{
        try{
            // creation of normal user
            const user = await User.create({
                name : name,
                email : email,
                password : password
            })
            // here explicitly role is not given means it takes DEFAULT that we set in User is 'user'
            const userToken = await createUserToken(user)
            res.status(StatusCodes.CREATED).json({
                user : {
                    name : user.name,
                    email : user.email,
                    id : user._id,
                    role : user.role
                },
                token : userToken
            })
        }
        catch(error){
            res.status(StatusCodes.BAD_REQUEST).json({
                errorMsg : 'Error in creatig user..Contact developer.!!!'
            })
        }
    }
}

// LOGINING IN USER
const login = async (req,res) =>{
    const {email, password} = req.body

    if(!email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : 'Please provide email and password.!!!'
        })
    }
    else{
        const user = await User.findOne({
            email : email
        })

        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({
                errorMsg : 'No user by this email, try again.!!'
            })
        }
        else{
            const isPasswordCorrect = await user.comparePassword(password)
            if(!isPasswordCorrect){
                res.status(StatusCodes.FORBIDDEN).json({
                    errorMsg : 'Invalid Credentials.!!!'
                }) 
            }
            else{
                const userToken = await createUserToken(user)
                res.status(StatusCodes.OK).json({
                    user : {
                        name : user.name,
                        email : user.email,
                        id : user._id,
                        role : user.role
                    },
                    token : userToken
                })
            }
        }
    }
}

const logout = async (req,res) =>{
    res.send('Logout route')
}


module.exports = {
    register,
    login,
    logout
}