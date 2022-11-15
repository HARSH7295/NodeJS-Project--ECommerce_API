const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        maxlength : 50,
        required : [true, 'Please provide name.!!!']
    },
    email : {
        type : String,
        unique : true,
        required : [true, 'Please provide email.!!!'],
        validate : {
            validator : validator.isEmail,
            message : 'Please provide valid Email .!!!'
        }
    },
    password : {
        type : String,
        required : [true, 'Please provide password.!!!'],
        minlength : 6
    },
    role : {
        type : String,
        enum : ['admin','user'],
        default : 'user'
    }
})

// setting for saving hashed password
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        // 10 rounds of hashing
        this.password = await bcrypt.hash(this.password,salt)
    }
    // never forget to add next() else further other process is never gone run
    next()
})

// instance method :- comparing password with stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatched = await bcrypt.compare(candidatePassword,this.password)
    return isMatched
}

const userModel = mongoose.model('User',userSchema)
module.exports = userModel