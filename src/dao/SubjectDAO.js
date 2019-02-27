var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function(jsonBody, callback){
    if (jsonBody.name && jsonBody.category && jsonBody.created_by) {
        var insertQuery = 'insert into subject(name, category, is_delete, created_by, created_on) values(?, ?, ?, ?, ?)';
        
        connection.query(insertQuery, [jsonBody.name, jsonBody.category, 0, jsonBody.created_by, new Date()], function (error, result, fields) {
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
    if(jsonBody.id && jsonBody.name) {
        var select = 'select * from subject where is_delete = 0 and id = ' + jsonBody.id;
        connection.query(select, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                result[0].name = jsonBody.name;

                var updateQuery = 'update subject set name = ? where id = ?';
                connection.query(updateQuery, [result[0].name, result[0].id], function (error, updateResult, fields) {
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
        var sql = 'select * from subject where id = ' + id;
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
        var sql = 'select * from subject where created_by = ' + memberId + ' order by created_on desc;';
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

module.exports.getByCategoryAndMemberId = function(category, memberId, callback){
    if (category && memberId) {
        var sql = 'select * from subject where category = "' + category + '" and created_by = ' + memberId + ' order by created_on desc;';
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