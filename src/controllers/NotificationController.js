var notoficationDao = require('../dao/NotificationDAO');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');
const jwt = require('jsonwebtoken');

exports.create = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            notoficationDao.create(function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }

                if (result) {
                    if (result == commonUtil.ERROR) {
                        resp.status('400');
                        resp.send(result);
                    } else {
                        resp.status('200');
                        resp.json({
                            message: commonUtil.INSERT_SUCCESS
                        });
                    }
                }
            });
        }
    });

    return resp;
};

exports.getById = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            notoficationDao.getById(req.params.id, function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }

                if (result) {
                    resp.status('200');
                    resp.send(result);
                }
            });
        }
    });

    return resp;
};

exports.getByMemberId = function (req, resp, next) {
    notoficationDao.getByMemberId(req.params.memberId, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            if (result == commonUtil.ERROR) {
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

exports.deleteById = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            notoficationDao.deleteById(req.params.id, function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }

                if (result) {
                    resp.status('200');
                    resp.json({
                        message: commonUtil.DELETE_SUCCESS
                    });
                }
            });

            return resp;
        }
    });

    return resp;
};

exports.markedReadById = function (req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            notoficationDao.markedReadById(req.params.id, function (result, error) {
                if (error) {
                    resp.status('500');
                    resp.send(error);
                }

                if (result) {
                    resp.status('200');
                    resp.json({
                        message: commonUtil.UPDATE_SUCCESS
                    });
                }
            });

            return resp;
        }
    });

    return resp;
};

exports.notificationCount = function (req, resp, next) {
    notoficationDao.notificationCount(req.params.memberId, function (result, error) {
        if (error) {
            resp.status('500');
            resp.send(error);
        }

        if (result) {
            resp.status('200');
            resp.send(result);
        }
    });

    return resp;
};