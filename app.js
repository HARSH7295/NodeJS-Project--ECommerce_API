const express = require('express')

const connectDB = require('./db/connect')

const fileUpload = require('express-fileupload')

const app = express()

// don't forget to add this express.json() -> else gone get error in parsing body data of request
app.use(express.json())


const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const orderRouter = require('./routes/orderRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')


// using static to define path for static files
app.use(express.static('./public'))
// using fileupload
app.use(fileUpload())

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/order',orderRouter)
app.use('/api/product',productRouter)
app.use('/api/review',reviewRouter)


// start function that starts server and connects to dbs
const start = async() =>{
    try{
        await connectDB('mongodb://127.0.0.1:27017/Project-2--ECOMMERCE-API')        
        app.listen(3000,()=>{
            console.log('Server is running on port 3000')
        })        
    }
    catch(error){
        console.log(error)
    }
}


// server check request
app.get('/isServerOn',(req,res)=>{
    res.send('Hello, server is running')
})

start()