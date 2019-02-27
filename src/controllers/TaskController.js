var taskDao = require('../dao/TaskDAO');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');
const jwt = require('jsonwebtoken');

exports.create = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            taskDao.create(req.body, function (result, error) {
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
                            id: result.insertId,
                            message: commonUtil.INSERT_SUCCESS
                        });
                    }
                }
            });
        }
    });

    return resp;
};

exports.update = function(req, resp, next) {
    
};

exports.getById = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            taskDao.getById(req.params.id, function(result, error) {
                if(error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if(result) {
                    if(result == commonUtil.NO_DATA) {
                        resp.status('400');
                        resp.send(result);
                    } else {
                        resp.status('200');
                        resp.send(result);
                    }
                }
            });
        }
    });

    return resp;
};

exports.getByMemberId = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            taskDao.getByMemberId(req.params.memberId, function(result, error) {
                if(error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if(result) {
                    if(result == commonUtil.ERROR) {
                        resp.status('400');
                        resp.send(result);
                    } else {
                        resp.status('200');
                        resp.send(result);
                    }
                }
            });
        }
    });

    return resp;
};

exports.search = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            taskDao.search(req.body, function(result, error) {
                if(error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if(result) {
                    if(result == commonUtil.NO_DATA) {
                        resp.status('400');
                        resp.send(result);
                    } else {
                        resp.status('200');
                        resp.send(result);
                    }
                }
            });
        }
    });

    return resp;
};