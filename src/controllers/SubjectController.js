var subjectDao = require('../dao/SubjectDAO');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./security.properties');
const jwt = require('jsonwebtoken');

exports.create = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            subjectDao.create(req.body, function (result, error) {
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
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            subjectDao.update(req.body, function (result, error) {
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
                            message: commonUtil.UPDATE_SUCCESS
                        });
                    }
                }
            });
        }
    });

    return resp;
};

exports.getById = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            subjectDao.getById(req.params.id, function(result, error) {
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
            subjectDao.getByMemberId(req.params.memberId, function(result, error) {
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

exports.getByCategoryAndMemberId = function(req, resp, next) {
    console.log('Hii');
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            console.log(req.params.category);
            subjectDao.getByCategoryAndMemberId(req.params.category, req.params.memberId, function(result, error) {
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

exports.delete = function(req, resp, next) {
    jwt.verify(req.token, properties.get('secretKey'), (err, authData) => {
        if (err) {
            resp.sendStatus(403);
        } else {
            subjectDao.delete(req.params.id, function(result, error) {
                if(error) {
                    resp.status('500');
                    resp.send(error);
                }
        
                if(result) {
                    resp.status('200');
                    resp.json({
                        message : commonUtil.DELETE_SUCCESS
                    });
                }
            });
        }
    });

    return resp;
};