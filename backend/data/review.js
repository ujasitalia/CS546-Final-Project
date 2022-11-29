const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const reviewCol = mongoCollections.review;
const {ObjectId} = require('mongodb');
const patient = require('./patient');
const doctor = require('./doctor');

const createReview = async(
doctorId,
patientId,
reviewText = null,
rating
) => {
    doctorId = helper.common.isValidId(doctorId);
    patientId = helper.common.isValidId(patientId);
    rating = helper.review.checkRating(rating);

    await doctor.getDoctorById(doctorId);
    await patient.getPatientById(patientId);

    const reviewCollection = await reviewCol();

    const newReview = {
        doctorId,
        patientId,
        rating
    };

    if(reviewText != null){
        reviewText = helper.review.checkReviewText(reviewText);
        newReview.reviewText = reviewText;
    }

    const insertInfo = await reviewCollection.insertOne(newReview);
  
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw {status: '500', error : 'Could not add review'};
  
    const newId = insertInfo.insertedId.toString();
    const review = await getReviewById(newId);
  
    review._id = review._id.toString();
    return review;
}

const getReviewById = async(reviewId) =>{
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

const getAllReviewByDoctorId = async (doctorID) => {
    doctorID = helper.common.isValidId(doctorID);
    await doctor.getDoctorById(doctorID);
    const reviewCollection = await reviewCol();
    const reviewsArray = await reviewCollection.find({doctorID: ObjectId(doctorID)}).toArray();
  
    if (!reviewsArray) throw {status: '404', error : 'Could not get all review'};
  
    return reviewsArray;
}

module.exports = {
    createReview,
    getReviewById,
    getAllReviewByDoctorId
};