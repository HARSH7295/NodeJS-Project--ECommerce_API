const mongoose = require('mongoose')
const Product = require('../models/product')

const reviewSchema = mongoose.Schema({
    title:{
        type : String,
        trim : true,
        required :[true,'Please provide review title'],
        maxlength : 100
    },
    rating:{
        type : Number,
        min : 1,
        max : 5,
        required :[true,'Please provide review rating']
    },
    comment:{
        type : String,
        required :[true,'Please provide review comment']
    },
    user:{
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required :true
    },
    product:{
        type : mongoose.Types.ObjectId,
        ref : 'Product',
        required :true
    }
},{
    timestamps : true
})

// compound index
// user can write only 1 review for per product
reviewSchema.index({product : 1, user : 1},{unique : true})
/*
// using static as it is on schema/class not on any instance
reviewSchema.static.calAvgRating = async function(prodID){
    const result = await this.aggregate([
        { $match : { product : prodID } },
        { $group : {
            _id : null,
            avgRating : { $avg : '$rating' },
            numOfReviews : { $sum : 1 },
        },
     }
    ])
    
}
*/

// FUNCTION FOR PRODUCT TO COUNT AVERAGE AND NUM-OF-REVIEWS AFTER EACH SAVE AND REMOVE OF REVIEW
// in the function already written -> there is isse that each time we save review that just add value and take avg.
// now that concept is correct for new review, but what if the old review is updated then we neeed to find that old rating and 
// update it wih new and then find avg.

const FindAvgAndNumOfReviews = async function(prodId){
    const product = await Product.findOne({
        _id : prodId
    })
    const reviews = await reviewModel.find({
        product : product._id
    })
    const numOfReviews = reviews.length
    var sum = 0
    
    for(let i=0;i<reviews.length;i++){
        sum += reviews[i].rating
    }

    const avg = (sum/numOfReviews)
    return {
        avg : avg,
        count : numOfReviews
    }
}


// NOTE--> HERE IN post.save and post.remove =  we are calculating the avg rating as any new thing is added or removed

// post functionality --> it does thing after saving review
reviewSchema.post('save',async function(){
    // this will call method of schema/class
    //await this.constuctor.calAvgRating(this.product)
    const product = await Product.findOne({
        _id : this.product
    })

    // NOTE --> ADDING NEW ACG. AND FINDING THE WHOLE AVG
    //logic
    // new_avg = ((old_avg)*(old_count) + (new_avg_entry)/(new_count)) 
    //product.avgRating = ((product.avgRating)*(product.numOfReviews) + this.rating)/(product.numOfReviews + 1)
    //product.numOfReviews = (product.numOfReviews + 1)
    
    // BELOW IS NEW FUNC. FOR UPDATING PRODUCT'S PROP
    const result = await FindAvgAndNumOfReviews(this.product)
    product.avgRating = result.avg
    product.numOfReviews = result.count
    await product.save()
    
})

// post -> so after removing review
reviewSchema.post('remove',async function(){
    // this will call method of schema/class
    //await this.constuctor.calAvgRating(this.product)
    const product = await Product.findOne({
        _id : this.product
    })

    // NOTE --> REMOVING ITEM FROM ACVG. AND FINDING NEW AVG
    //logic
    // new_avg = ((old_avg)*(old_count) - (new_avg_entry)/(new_count)) 
    //product.avgRating = ((product.avgRating)*(product.numOfReviews) - this.rating)/(product.numOfReviews - 1)
    //product.numOfReviews = (product.numOfReviews - 1)
    
    // BELOW IS NEW FUNC. FOR UPDATING PRODUCT'S PROP
    const result = await FindAvgAndNumOfReviews(this.product)
    product.avgRating = result.avg
    product.numOfReviews = result.count
    await product.save()

})
const reviewModel = mongoose.model('Review',reviewSchema)

module.exports = reviewModel