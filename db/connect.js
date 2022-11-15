
const mongoose = require('mongoose')

const connectDB = async(url)=>{
    console.log('Connection to dbs established.!!!')
    return mongoose.connect(url,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })

}

module.exports = connectDB