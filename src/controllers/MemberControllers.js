var memberDao = require('../dao/MemberDAO');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');
var emailProperties = PropertiesReader('./mail.properties');
var emailUtil = require('../util/MailUtils');
const jwt = require('jsonwebtoken');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('GymAppPass');


exports.create = function (req, resp, next) {
    memberDao.create(req.body, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            console.log(result);
            if (result == commonUtil.ERROR) {
                resp.status('400');
                resp.send(result);
            } else {
                resp.status('200');
                resp.json({
                    id: result.insertId,
                    message: commonUtil.INSERT_SUCCESS
                });
            }
        }
    });

    return resp;
};

exports.login = function (req, resp, next) {
    memberDao.login(req.body, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result.message == commonUtil.LOGIN_FAILED) {
                resp.status('403');
                resp.send(result);
            } else if (result == commonUtil.ERROR) {
                resp.status('400');
                resp.send(result);
            } else if (result.message == commonUtil.LOGIN_SUCCESS) {
                jwt.sign({ user_name: req.body.user_name }, properties.get('secretKey'), { expiresIn: properties.get('expireIn') }, (err, token) => {
                    if (err) {

                        resp.status('500');
                        resp.send(error);
                    }
                    if (token) {
                        resp.setHeader('x-token', token);
                        resp.json({
                            'message': commonUtil.LOGIN_SUCCESS,
                            'info': result.info
                        });
                    }
                });
            }
        }
    });

    return resp;
};

exports.forgotUsername = function (req, resp, next) {
    memberDao.forgotUsername(req.params.email, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result == commonUtil.MAIL_SENT) {
                resp.status('200');
                resp.send(result);
            } else {
                resp.status('400');
                resp.send(result);
            }
        }
    });

    return resp;
};

exports.forgotPassword = function (req, resp, next) {

    if (req.params.email) {

        jwt.sign({ email: req.params.email }, properties.get('passSecret'), { expiresIn: properties.get('passExpireIn') }, (err, token) => {
            if (err) {

                resp.status('500');
                resp.send(error);
            }
            if (token) {
                var encryptEmail = cryptr.encrypt(req.params.email);
                var changePwdUrl = req.body.currentUrl.replace('forgot-password', 'pwd-change');
                var tokenAndEmail = token + '(-*-)' + encryptEmail;
                var finalUrl = changePwdUrl + '/' + tokenAndEmail;

                console.log(finalUrl);

                var htmlToSend = `<html>
                    <body>
                        <p>
                            Please go to this <a href='` + finalUrl + `'>Link</a> to change your password.<br/>
                            Or click on below link to generate a password.<br/>
                            `+ finalUrl + `
                        </p>
                        <span style='color:red;'><b>NOTE: </b></span><span>This link valid only for 5 minute.</span>
                    </body>
                </html>`;
                emailUtil.sendEmail(req.params.email, emailProperties.get('forgot_password'), '', htmlToSend);

                resp.status(200);
                resp.json({
                    'message': commonUtil.CHECK_EMAIL
                });
            }
        });
    } else {
        resp.status('400');
        resp.send('Email not entered');
    }

    return resp;
};

exports.checkEmail = function (req, resp, next) {
    memberDao.checkEmail(req.params.email, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result == commonUtil.EMAIL_EXIST) {
                resp.status('400');
                resp.send(result);
            } else {
                resp.status('200');
                resp.send(result);
            }
        }
    });

    return resp;
};

exports.checkUsername = function (req, resp, next) {
    memberDao.checkUsername(req.params.username, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result == commonUtil.USER_NAME_EXIST) {
                resp.status('400');
                resp.send(result);
            } else {
                resp.status('200');
                resp.send(result);
            }
        }
    });

    return resp;
};

exports.passwordChange = function (req, resp, next) {
    
    jwt.verify(req.body.token, properties.get('passSecret'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            var decryptEmail = cryptr.decrypt(req.body.email);
            console.log(decryptEmail);

            memberDao.passwordChange(decryptEmail, req.body.password, function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if (result) {
                    if (result == commonUtil.EMAIL_NOT_EXIST) {
                        resp.status('400');
                        resp.send(result);
                    } else if(commonUtil.PASSWORD_CHANGED) {
                        resp.status('200');
                        resp.send(result);
                    } else {
                        resp.status('500');
                    }
                }
            });
        }
    });

    return resp;
}