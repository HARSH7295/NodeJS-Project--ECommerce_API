const { StatusCodes } = require("http-status-codes")
const Product  = require('../models/product')
const path = require('path')

const Review = require("../models/review")

const createProduct = async(req,res) =>{
    req.body.user = req.user.id
    // by this we are adding user field in body data from user
    // so that can directly be used to create model as below
    try{
        const product = await Product.create(req.body)
        res.status(StatusCodes.CREATED).json({
            product : product
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMsg : error
        })
    }
}

const getAllProducts = async(req,res) =>{
    try{
        const products = await Product.find({})
        res.status(StatusCodes.OK).json({
            products : products,
            count : products.length
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errorMsg : error
        })
    }
}

const getSingleProduct = async(req,res) =>{
    const {id : prodId } = req.params
    //above is same as prodId = req.params.id 
    
    const product = await Product.findOne({
        _id : prodId
    })

    if(!product){
        res.status(StatusCodes.NOT_FOUND).json({
            errorMsg : `No product with id : ${prodId}`
        })
    }else{
        res.status(StatusCodes.OK).json({
            product : product
        })
    }

}
const updateProduct = async(req,res) =>{
    const {id : prodId} = req.params
    
    //NOTE -> AS HERE, PRODUCT IS ONLY UPDATED BY ADMIN(AUTHORIZED USER), SO 
    // NOT PROVIDING ANY CHECKING OF VALID FIELD AS ASSUMED THAT AUTHORIZED PERSON HAS IDEA ABOUT MODEL

    const product = await Product.findOneAndUpdate({
        _id : prodId
    },
    req.body,
    {
        new : true,
        runValidators : true,
    })

    if(!product){
        res.status(StatusCodes.NOT_FOUND).json({
            errorMsg : `No product with id : ${prodId}`
        })
    }
    else{
        res.status(StatusCodes.ACCEPTED).json({
            product : product
        })
    }
}

const deleteProduct = async(req,res) =>{
    const {id : prodId} = req.params

    const product = await Product.findOne({
        _id : prodId
    })

    if(!product){
        res.status(StatusCodes.NOT_FOUND).json({
            errorMsg : `No product with id : ${prodId}`
        })
    }
    else{
        await product.remove()
        res.status(StatusCodes.ACCEPTED).json({
            'msg':'Success.!! Product removed'
        })
    }
}


const uploadProductImage = async(req,res) =>{
    // if files are not added then, 
    if(!req.files){
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg:'No file uploaded.!!  Please upload file'
        })
    }
    else{
        const prodImg = req.files.image
        // if user uploads files other than image then,
        if(!prodImg.mimetype.startsWith('image')){
            res.status(StatusCodes.BAD_REQUEST).json({
                errorMsg : 'Please upload image only....'
            })
        }
        else{
            const maxSize = 1024*1024
            // if image size is more than 1MB then,
            if(prodImg.size > maxSize){
                res.status(StatusCodes.ACCEPTED).json({
                    errorMsg : 'Please upload image smaller than 1MB.!!'
                })
            }
            else{
                // joining path for image 
                const imgPath = path.join(
                    __dirname,
                    '../public/uploads/'+`${prodImg.name}`
                )

                // mv() function --> IT IS USED FOR MOVING FILES FROM ONE LOC. TO ANOTHER
                await prodImg.mv(imgPath)
                res.status(StatusCodes.OK).json({
                    image : `/uploads/${prodImg.name}`
                })
            }
        }
    }
}

const getSingleProductReviews = async(req,res) =>{
    const { id : reviewId } = req.params

    // Review model has field "product"
    // that "product" field is referencing to Product model
    // now if we populate('{referencing field name}') on referencing object then we can get details of referenced models details
    // as here, review.populate('product') --> will give the product details : as review reference to product using "product" field
    const review = await Review.findOne({
        _id : reviewId
    }).populate('product')
    res.status(StatusCodes.OK).json({
        prod : review
    })
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    getSingleProductReviews
}