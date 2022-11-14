const isValidAge = (age) => {
    if(!age || typeof age!='number' || age<1 || age>120 || age%1) throw {status:400, error:'Invalid age'};
}

module.exports = {
    isValidAge
};