const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const reviewCol = mongoCollections.review;
const {ObjectId} = require('mongodb');
const patient = require('./patient');
const doctor = require('./doctor');
const createReview = async(
doctorID,
patientId,
reviewText,
rating
) => {
    doctorData = await doctor.getDoctorById(doctorID);
    patientData = await patient.getDoctorById(patientId);
    if(!reviewText){

    }
    rating = helper.review.checkRating(rating);

    const reviewCollection = await reviewCol();
    if(!reviewText){
        const newReview = {
            doctorID,
            patientId,
            rating
          };
    }else{
    const newReview = {
        doctorID,
        patientId,
        reviewText,
        rating
      };
    }
  
    const insertInfo = await reviewCollection.insertOne(newReview);
  
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw {status: '500', error : 'Could not add review'};
  
    const newId = insertInfo.insertedId.toString();
    const review = await getreviewById(newId);
  
    return review;
}
const getreviewById = async(reviewId) =>{
    reviewId = helper.common.isValidId(reviewId);

    const reviewCollection = await reviewCol();
    const review = await reviewCollection.findOne({_id: ObjectId(reviewId)});

    if (review === null) 
    {
        throw {status: '404', error : 'No review with that id'};
    }

    review._id = review._id.toString();

    return review;
}
const getAllreview = async (doctorID) => {
    reviewId = helper.common.isValidId(doctorID);

    const reviewCollection = await reviewCol();
    const reviewsArray = await reviewCollection.find({'review.doctorID': doctorID})
    .toArray();find().toArray();
  
    if (!reviewsArray) throw {status: '500', error : 'Could not get all doctors'};
  
    return reviewsArray;
  };
module.exports = {
    createReview,
    getreviewById,
    getAllreview
};