const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const reviewCol = mongoCollections.review;
const {ObjectId} = require('mongodb');
const patientData = require('./patient');
const doctorData = require('./doctor');

const createReview = async(
doctorId,
patientId,
rating,
reviewText = null
) => {
    doctorId = helper.common.isValidId(doctorId);
    patientId = helper.common.isValidId(patientId);
    rating = helper.review.checkRating(rating);

    const doctor = await doctorData.getDoctorById(doctorId);
    await patientData.getPatientById(patientId);

    const reviewCollection = await reviewCol();

    const newReview = {
        doctorId : doctorId,
        patientId : patientId,
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
    const reviewsArray = await reviewCollection.find({doctorId: doctorId}).toArray();
    let totalRating = 0; 
    reviewsArray.forEach(element => {
        totalRating += element.rating;
    });
    const finalRating = totalRating/reviewsArray.length;
    if(doctor.rating != finalRating)
        await doctorData.updateDoctor(doctorId, {rating:finalRating});
    const review = await getReviewById(newId);
  
    await doctorData.changeReviewStatus(doctorId,[patientId], true);
    review._id = review._id.toString();
    return review;
}

const getReviewById = async(reviewId) =>{
    reviewId = helper.common.isValidId(reviewId);

    const reviewCollection = await reviewCol();
    const review = await reviewCollection.findOne({_id: ObjectId(reviewId)});

    if(review === null) 
    {
        throw {status: '404', error : 'No review with that id'};
    }

    review._id = review._id.toString();

    return review;
}

const getAllReviewByDoctorId = async (doctorId) => {
    doctorId = helper.common.isValidId(doctorId);
    await doctorData.getDoctorById(doctorId);
    const reviewCollection = await reviewCol();
    const reviewsArray = await reviewCollection.find({doctorId: doctorId}).toArray();
  
    if (!reviewsArray) throw {status: '404', error : 'Could not get all review'};
  
    return reviewsArray;
}

module.exports = {
    createReview,
    getReviewById,
    getAllReviewByDoctorId
};