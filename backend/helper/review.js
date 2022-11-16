const checkRating = (rating) => {
    rating = rating.trim();
    if(typeof rating !== 'string'){
      throw 'not a string';
    }
    if(rating !== 'G' && rating !== 'PG' && rating !== 'PG-13' && rating !== 'R' && rating !== 'NC-17'){
        throw 'not proper rating';
    }
    return rating;
  };

module.exports = {
    checkRating
};