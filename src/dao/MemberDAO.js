var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./mail.properties');
var emailUtil = require('../util/MailUtils');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('GymApplication');

module.exports.create = function (jsonBody, callback) {
    if (jsonBody.email && jsonBody.password && jsonBody.user_name) {
        var encryptPassword = cryptr.encrypt(jsonBody.password);
    
        var createSql = 'insert into member (user_name, password, gender, email) values (?, ?, ?, ?)';
        connection.query(createSql, [jsonBody.user_name, encryptPassword, jsonBody.gender, jsonBody.email], function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                callback(result);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.login = function (jsonBody, callback) {
    if(jsonBody.user_name && jsonBody.password) {
        
        var encryptPassword = cryptr.encrypt(jsonBody.password);
    
        var selectQuery = 'select * from member where user_name = "' + jsonBody.user_name + '" and password = "' + encryptPassword + '"';
        console.log(selectQuery);
        connection.query(selectQuery, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            
            var data = {
                message : '',
                info : ''
            }
            if (result.length > 0) {
                data.message = commonUtil.LOGIN_SUCCESS;
                data.info = {
                    id : result[0].id,
                    user_name : result[0].user_name,
                    email : result[0].email
                }
                callback(data);
            } else {
                data.message = commonUtil.LOGIN_FAILED;
                callback(data);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.forgotUsername = function (email, callback) {
    if (email) {
        var sql = 'SELECT * FROM member WHERE email = "' + email + '"';
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result.length > 0) {
                var htmlToSend = `<html>
                                <body>
                                    <p>
                                        Username : ` + result[0].user_name + `
                                    </p>
                                </body>
                            </html>`;
                emailUtil.sendEmail(email, properties.get('forgot_uersname'), '', htmlToSend);
                callback(commonUtil.MAIL_SENT);
            } else {
                callback(commonUtil.EMAIL_NOT_EXIST);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.checkEmail = function (email, callback) {
    if (email) {
        var sql = 'SELECT * FROM member WHERE email = "' + email + '"';
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result.length > 0) {
                callback(commonUtil.EMAIL_EXIST);
            } else {
                callback(commonUtil.EMAIL_NOT_EXIST);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.checkUsername = function (userName, callback) {
    if (userName) {
        var sql = 'SELECT * FROM member WHERE user_name = "' + userName + '"';
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result.length > 0) {
                callback(commonUtil.USER_NAME_EXIST);
            } else {
                callback(commonUtil.USER_NAME_NOT_EXIST);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.passwordChange = function (email, password, callback) {
    if (email && password) {
        var sql = 'SELECT * FROM member WHERE email = "' + email + '"';
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result.length > 0) {
                var updateSql = 'update member set password = "' + cryptr.encrypt(password) + '" where email = "' + email + '"';
                connection.query(updateSql, function (error, resultUpdate, fields) {
                    if(error) {
                        callback(error);
                    }

                    if(resultUpdate) {
                        callback(commonUtil.PASSWORD_CHANGED);
                    }
                });

            } else {
                callback(commonUtil.EMAIL_NOT_EXIST);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};