const checkRating = (rating) => {
    if(isNaN(rating) || typeof rating != 'number'){
        throw {status: '400', error : 'Not a number'}
    }
    if(rating<0 || rating>5){
        throw {status: '400', error : 'rating must between 1 to 5'};
    }
    if((rating*10)%1 != 0){
        throw {status: '400', error : 'invalid input'};
    }
    return rating;
  };
  const checkReviewText = (reviewText) => {
    if(!reviewText || reviewText == null){
        return null;
    }
    if(typeof reviewText != 'string'){
        throw {status: '400', error : 'Not a string'};
    }
    reviewText = reviewText.trim();
    if(reviewText.length > 500){
        throw {status: '400', error : 'Review over character limit'};
    }
    return reviewText;
  };
module.exports = {
    checkRating,
    checkReviewText
};