const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name :{
        type : String,
        minlength : 3,
        maxlength : 50,
        required : [true,'Please provide name'],
    },
    price : {
        type : Number,
        required : [true,'Please provide price'],
        default : 0,
        validate : function(value){
            if(value < 0){
                throw new Error('Price can not be less than zero..Try again.!!')
            }
        }
    },
    description : {
        type : String,
        required : [true,'Please provide description'],
        maxlength : [1000,'Description can not be longer than 1000 characters'],
    },
    image : {
        type : String,
        default : 'uploads/example.jpg'
    },
    category : {
        type : String,
        required : [true,'Please provide caategory'],
        enum : ['office','kitchen','bedroom']
    },
    company : {
        type : String,
        required : [true,'Please provide company'],
        enum : {
            values : ['ikea','liddy','marcos'],
            message : '{VALUE} is not supported'
        }
    },
    colors : {
        // here type is list of string element
        type : [String],
        default : ['#222'],
        required : true,
    },
    featured : {
        type : Boolean,
        default : false
    },
    freeShipping : {
        type : Boolean,
        default : false
    },
    inventory : {
        type : Number,
        required : true,
        default : 15
    },
    avgRating : {
        type : Number,
        default : 0,
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    }
},{
    timestamps : true,
    toJSON : { virtuals : true },
    toObject : { virtuals : true  }

})

// for reviews field for product {virtual field -- not showin in dbs}
productSchema.virtual('reviews',{
    ref : 'Review',
    localField : '_id',
    foreignField : 'product',
    justOne : false
})

// when removing product , remove the reviews made for it
/*
productSchema.pre('remove',async function(next){
    await this.model('Review').deleteMany({
        product : this._id
    })
})*/

const productModel = mongoose.model('Product',productSchema)

module.exports = productModel