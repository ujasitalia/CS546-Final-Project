const checkRating = (rating) => {
    rating = rating.toString();
    if(!rating.match(/^[\d.]+$/)) throw {status: '400', error : `Invalid ${rating}`};
    rating=parseFloat(rating);
    if(isNaN(rating) || typeof rating != 'number'){
        throw {status: '400', error : 'Not a number'}
    }
    if(rating<1 || rating>5){
        throw {status: '400', error : 'rating must between 1 to 5'};
    }
    if((rating*10)%1 != 0){
        throw {status: '400', error : 'invalid input'};
    }
    return rating;
  };
  const checkReviewText = (reviewText) => {

    if(!reviewText || typeof reviewText != 'string'){
        throw {status: '400', error : 'Not a string'};
    }
    reviewText = reviewText.trim();
    if(reviewText.length <4 || reviewText.length > 500){
        throw {status: '400', error : 'Review over/under character limit'};
    }
    return reviewText;
  };
module.exports = {
    checkRating,
    checkReviewText
};