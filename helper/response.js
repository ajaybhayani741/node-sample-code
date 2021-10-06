const {OK , BAD_REQUEST , UNAUTHORIZED } = require('../config/messages');
const data = [""]

exports.success = (res, message, data, type) => {
    return res.status(OK).json({message, data, type});
}

exports.failure = (res, message, data, type) => {
    return res.status(BAD_REQUEST).json({message, data, type});
}
