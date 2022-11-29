const commonHelper = require('./common');

const isValidAge = (age) => {
    if(!age || typeof age!='number' || age<1 || age>120 || age%1) throw {status:400, error:'Invalid age'};
    return age;
}

const isValidPatientUpdate = (body) => {
    const fields = ['email','age','profilePicture','name','city','state','zip','password'];
    for(let bodyField in body)
    {
        let flag=0;
        for(let f of fields)
        {
            if(bodyField==f)
            {
                flag=1;
                break;
            }
        }
        if(flag) continue;
        else throw {code:400, error:`Invalid update field for patient - ${bodyField}`};
    }
    
    for(let bodyField in body)
    {
        if(bodyField == 'email') body[bodyField]=commonHelper.isValidEmail(body[bodyField]);
        if(bodyField == 'age') body[bodyField]=isValidAge(body[bodyField]);
        if(bodyField == 'profilePicture') body[bodyField]=commonHelper.isValidFilePath(body[bodyField]);
        if(bodyField == 'name') body[bodyField]=commonHelper.isValidName(body[bodyField]);
        if(bodyField == 'city') body[bodyField]=commonHelper.isValidCity(body[bodyField]);
        if(bodyField == 'state') body[bodyField]=commonHelper.isValidState(body[bodyField]);
        if(bodyField == 'zip') body[bodyField]=commonHelper.isValidZip(body[bodyField]);
        if(bodyField == 'password') body[bodyField]=commonHelper.isValidPassword(body[bodyField]);
    }

    return body;
}

module.exports = {
    isValidAge,
    isValidPatientUpdate
};
