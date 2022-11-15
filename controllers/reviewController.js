const { StatusCodes } = require('http-status-codes')
const Review = require('../models/review')
const Product = require('../models/product')
const { findOne } = require('../models/product')

const getAllReviews = async(req,res)=>{

    try{
        const reviews = await Review.find({})
        res.status(StatusCodes.OK).json({
            reviews : reviews,
            count : reviews.length
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMsg : error
        })
    }
}

const createReview = async(req,res)=>{
    const {product : prodId} = req.body

    //checking if product is valid or not?
    const product = await Product.findOne({
        _id : prodId
    })
    if(!product){
        res.status(StatusCodes.NOT_FOUND).json({
            errorMsg : `No product with id : ${prodId}`
        })
    }
    
    // checking if user has already submitted the review for this product?
    const reviewExists = await Review.findOne({
        product : prodId,
        user : req.user.id
    })
    if(reviewExists){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : 'Already submitted review for this product'
        })
    }
    req.body.user = req.user.id
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({
        review : review
    })
    
}
const updateReview = async(req,res)=>{
    
    
    const { id : reviewId } = req.params
    
    const { rating, title, comment } = req.body
    // NOTE -> AS IT IS UPDATED BY ANY USER WHO CREATED IT, OS NEED TO ADD VALIDATION OF UPDATION FIELDS
    
    // CHECKING THAT THE USER WHO REQUESTING UPDATE,  IS THE ONE WHO CREATED REVIEW?
    const review = await Review.findOne({
        _id : reviewId
    }) 
    if(!review){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg : `No review with id : ${reviewId}`
        })
    }
    if(!(review.user.toString() === req.user.id)){
        res.status(StatusCodes.UNAUTHORIZED).json({
            errorMsg : 'You are not authorized to update this review.!!'
        })
    }
    if(rating){
        review.rating = rating
    }
    if(title){
        review.title = title
    }
    if(comment){
        review.comment = comment
    }
    await review.save()
    res.status(StatusCodes.OK).json({
        msg : 'Success.!! update done'
    })
}
const deleteReview = async(req,res)=>{
    const { id : reviewId } = req.params
    
    // NOTE -> AS IT IS UPDATED BY ANY USER WHO CREATED IT, OS NEED TO ADD VALIDATION OF UPDATION FIELDS
    
    // CHECKING THAT THE USER WHO REQUESTING UPDATE,  IS THE ONE WHO CREATED REVIEW?
    const review = await Review.findOne({
        _id : reviewId
    }) 

    if(!(review.user.toString() === req.user.id)){
        res.status(StatusCodes.UNAUTHORIZED).json({
            errorMsg : 'You are not authorized to delete this review.!!'
        })
    }
    else{
        await review.remove()
        res.status(StatusCodes.OK).json({
            msg : "Success.!! Delete done"
        })
    }
}
const getSingleReview = async(req,res)=>{

    const { id : reviewId } = req.params

    try{
        const review = await Review.findOne({
            _id : reviewId
        })
        res.status(StatusCodes.OK).json({
            review : review,
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMsg : error
        })
    }
    
}

module.exports = {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
}