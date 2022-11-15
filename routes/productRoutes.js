
const express = require('express')
const router = express.Router()

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    getSingleProductReviews
  } = require('../controllers/productController');
  
  const authentication = require('../middleware/authentication')
  const authorization = require('../middleware/authorization')

  router
    .route('/getAllProducts')
    .get(authentication,getAllProducts)

  router.route('/createProduct')
    .post(authentication,authorization('admin'),createProduct)
  
  router
    .route('/uploadProductImage')
    .post(authentication,authorization('admin'),uploadProductImage);
  
  router
    .route('/:id')
    .get(authentication,getSingleProduct)

  router.route('/:id/reviews').get(authentication,getSingleProductReviews)

  router.route('/update/:id')
    .patch(authentication,authorization('admin'),updateProduct)

  router.route('/delete/:id')
    .delete(authentication,authorization('admin'),deleteProduct)


  module.exports = router;