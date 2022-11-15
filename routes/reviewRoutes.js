const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication')

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.route('/createReview').post(authentication,createReview)
router.route('/getAllReviews').get(authentication,getAllReviews);

router
  .route('/:id')
  .get(authentication,getSingleReview)
router.route('/update/:id')
  .patch(authentication,updateReview)
router.route('/delete/:id')
  .delete(authentication,deleteReview);

module.exports = router;
