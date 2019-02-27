var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function(jsonBody, callback){
    if (jsonBody.details && jsonBody.created_by && jsonBody.sub_member_id) {
        var insertQuery = 'insert into personal_best (details, reps, kg, time, created_on, created_by, sub_member_id, is_delete) values(?, ?, ?, ?, ?, ?, ?, ?)';
        
        connection.query(insertQuery, [jsonBody.details, jsonBody.reps, jsonBody.kg, jsonBody.time, new Date(), jsonBody.created_by, jsonBody.sub_member_id, 0], function (error, result, fields) {
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
    if(jsonBody.details && jsonBody.id) {
        var select = 'select * from personal_best where is_delete = 0 and id = ' + jsonBody.id;
        connection.query(select, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                result[0].details = jsonBody.details;
                result[0].reps = jsonBody.reps;
                result[0].kg = jsonBody.kg;
                result[0].time = jsonBody.time;
                
                var updateQuery = 'update personal_best set details = ?, reps = ?, kg = ?, time = ? where id = ?';
                connection.query(updateQuery, [result[0].details, result[0].reps, result[0].kg, result[0].time, result[0].id], function (error, updateResult, fields) {
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
        var sql = 'select * from personal_best where id = ' + id;
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

module.exports.getBySubMemberId = function(memberId, callback){
    if (memberId) {
        var sql = 'select * from personal_best where sub_member_id = ' + memberId + ' and is_delete = 0 order by created_on desc;';
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
    var deleteSql = 'update personal_best set is_delete = 1 where id = ' + id;
    connection.query(deleteSql, function (error, result, fields) {
        if (error) {
            callback(error);
        }
        if (result) {
            callback(result);
        }
    });
};