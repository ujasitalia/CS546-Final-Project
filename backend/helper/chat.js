const checkMessage = (message) => {
    if(!message || typeof message != 'string'){
        throw 'Not a string'
    }
    message = message.trim();
    if(message.length > 1000){
        throw 'message over character limit';
    }
    return message;
  };
module.exports = {
    checkMessage
};