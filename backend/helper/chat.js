const checkMessage = (message) => {
    if(!message || typeof message != 'string'){
        throw {status: '400', error : 'Not a string'};
    }
    message = message.trim();
    if(message.length > 1000){
        throw {status: '400', error : 'message over character limit'};
    }
    return message;
  };
module.exports = {
    checkMessage
};