var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function(jsonBody, callback){
    if (jsonBody.no_of_time && jsonBody.time_unit && jsonBody.plan_name && jsonBody.created_by) {
        var insertQuery = 'insert into payment_plan (no_of_time, time_unit, plan_name, created_by, created_on, is_delete) values(?,?,?,?,?,?)';
        
        connection.query(insertQuery, [jsonBody.no_of_time, jsonBody.time_unit, jsonBody.plan_name, jsonBody.created_by, new Date(), 0], function (error, result, fields) {
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

module.exports.update = function(jsonBody, callback){
    if(jsonBody.no_of_time && jsonBody.time_unit && jsonBody.plan_name) {
        var select = 'select * from payment_plan where is_delete = 0 and id = ' + jsonBody.id;
        connection.query(select, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                result[0].no_of_time = jsonBody.no_of_time;
                result[0].time_unit = jsonBody.time_unit;
                result[0].plan_name = jsonBody.plan_name;
                result[0].created_by = jsonBody.created_by;
                result[0].created_on = jsonBody.created_on;
                result[0].is_delete = jsonBody.is_delete;
                
                var updateQuery = 'update payment_plan set no_of_time = ?, time_unit = ?, plan_name = ? where id = ?';
                connection.query(updateQuery, [result[0].no_of_time, result[0].time_unit, result[0].plan_name, result[0].id], function (error, updateResult, fields) {
                    if (error) {
                        callback(error);
                    }
                    
                    console.log(updateResult);
                    if(updateResult) {
                        callback(updateResult);
                    }
                })
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.getById = function(id, callback){
    if (id) {
        var sql = 'select * from payment_plan where id = ' + id;
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

module.exports.getByMemberId = function(memberId, callback){
    if (memberId) {
        var sql = 'select * from payment_plan where created_by = ' + memberId + ' and is_delete = 0 order by created_on desc;';
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

module.exports.delete = function(id, callback){
    var deleteSql = 'update payment_plan set is_delete = 1 where id = ' + id;
    connection.query(deleteSql, function (error, result, fields) {
        if (error) {
            callback(error);
        }
        if (result) {
            callback(result);
        }
    });
};