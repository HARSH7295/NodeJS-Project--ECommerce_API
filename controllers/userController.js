const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')

//GET ALL USERS
const getAllUsers = async(req,res) =>{
    try{
        const users = await User.find({})
        res.status(StatusCodes.OK).json({
            usersList : users
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMsg : 'Some error occured.!!'
        })
    }
}

//GET CURRENT USER
const getCurrentUser = async(req,res) =>{
    res.status(StatusCodes.OK).json({
        user : req.user
    })
}

// UPDATE USER
const updateUser = async(req,res) =>{
    const keys = Object.keys(req.body)
    const allowedFields = ['email','name']

    const isOperationOK = keys.every((key)=>{
        if(allowedFields.includes(key)){
            return true
        }
        else{
            return false
        }
    })
    // this func. will check that each and every key is belongs to allowedFields , no other key is there

    if(!isOperationOK){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : "Please provide valid fields for update..allowed fields = [ 'name', 'email ]"
        })
    }
    else{
        try{
            const user = await User.findByIdAndUpdate({
                _id : req.user.id
            },
            req.body,
            {
                new : true,
                runValidators : true
            })
            req.user = {
                name : user.name,
                email : user.email,
                role : user.role,
                id : user._id
            }
            res.status(StatusCodes.OK).json({
                user : req.user
            })
        }
        catch(error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMsg : error
            })
        }
        
    }
}

// UPDATE USER'S PASSWORD
const updateUserPassword = async(req,res) =>{
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : 'Please provide oldpassword and newpassword both.!!'
        })
    }
    else{
        try{
            const user = await User.findOne({
                _id : req.user.id
            })

            const isPasswordCorrect = await user.comparePassword(oldPassword)
            if(!isPasswordCorrect){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    errorMsg : 'Invalid old password..Try again.!!!'
                })
            }
            else{
                user.password = newPassword
                await user.save()
                res.status(StatusCodes.OK).json({
                    'msg':"Success.!! Password Updated"
                })
            }
        }
        catch(error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMsg : error
            })
        }
    }
}

// GET SINGLE USER
const getSingleUser = async(req,res) =>{
    const id = req.params.id
    try{
        const user = await User.findOne({
            _id: id
        })
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({
                errorMsg : 'No user by this id...Try different one.!!!'
            })
        }
        res.status(StatusCodes.OK).json({
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMsg : error
        })
    }
}

module.exports = {
    getAllUsers,
    getCurrentUser,
    updateUser,
    updateUserPassword,
    getSingleUser
}