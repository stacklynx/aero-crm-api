var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');
var submemberDao = require('../dao/SubMemberDAO');

module.exports.create = function (jsonBody, callback) {

    if (jsonBody.amount && jsonBody.paid_by && jsonBody.payment_date && jsonBody.next_payment_start_date && jsonBody.payment_period_start && jsonBody.payment_period_end && jsonBody.created_by) {

        var json = {
            id: jsonBody.paid_by,
            next_payment_start_date: jsonBody.next_payment_start_date,
            next_payment_end_date: jsonBody.next_payment_end_date
        };
        
        submemberDao.updateNextPaymentStratEndDate(json, function (result, error) {
            if (error) {
                callback(error);
            }

            if (result) {
                var createSql = 'insert into payment (amount, paid_by, payment_date, next_payment_date, payment_period_start, payment_period_end, is_delete, created_by) values(?, ?, ?, ?, ?, ?, ?, ?)';
                connection.query(createSql, [jsonBody.amount, jsonBody.paid_by, jsonBody.payment_date, jsonBody.next_payment_start_date, jsonBody.payment_period_start, jsonBody.payment_period_end, 0, jsonBody.created_by], function (error, result, fields) {
                    console.log(error);
                    console.log(result);
                    if (error) {
                        callback(error);
                    }

                    if (result) {
                        callback(result);
                    }
                });
            }
        });

    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.getById = function (id, callback) {
    if (id) {
        var sql = 'select * from payment where id = ' + id;
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                if (result.length > 0) {
                    callback(result);
                } else {
                    console.log(result);
                    callback(commonUtil.NO_DATA);
                }
            }
        });
    }
};

module.exports.getBySubMemberId = function (memberId, callback) {
    if (memberId) {
        var sql = 'select p.*, s.* from payment p inner join sub_member s on s.id = p.paid_by where p.paid_by = ' + memberId + ' and s.is_delete = 0 order by p.next_payment_date desc;';
        connection.query(sql, function (error, result, fields) {
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

module.exports.getMemberId = function (memberId, callback) {
    if (memberId) {
        var sql = 'select p.*, s.* from payment p inner join sub_member s on s.id = p.paid_by where p.created_by = ' + memberId + ' and s.is_delete = 0 order by p.next_payment_date desc;';
        connection.query(sql, function (error, result, fields) {
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

module.exports.deleteById = function (id, callback) {
    if (id) {
        var sql = 'select * from payment where id = ' + id;
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                if (result.length > 0) {
                    var deleteSql = 'update payment set is_delete = 1 where id = ' + id;
                    connection.query(deleteSql, function (error, result, fields) {
                        if (error) {
                            callback(error);
                        }

                        if (result) {
                            callback(result);
                        }
                    });
                } else {
                    callback(commonUtil.NO_DATA);
                }
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};