var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function(jsonBody, callback){
    if (jsonBody.issue && jsonBody.sub_member_id && jsonBody.created_by) {
        var insertQuery = 'insert into medical_history(medical_issue_date, issue, created_on, created_by, sub_member_id, is_delete) values(?, ?, now(), ?, ?, ?)';
        
        connection.query(insertQuery, [jsonBody.medical_issue_date, jsonBody.issue, jsonBody.created_by, jsonBody.sub_member_id, 0], function (error, result, fields) {
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
    if(jsonBody.id && jsonBody.issue) {
        var select = 'select * from medical_history where is_delete = 0 and id = ' + jsonBody.id;
        connection.query(select, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                result[0].medical_issue_date = jsonBody.medical_issue_date;
                result[0].issue = jsonBody.issue;
                result[0].sub_member_id = jsonBody.sub_member_id;
                
                var updateQuery = 'update medical_history set medical_issue_date = ?, issue = ? where id = ?';
                connection.query(updateQuery, [result[0].medical_issue_date, result[0].issue, result[0].id], function (error, updateResult, fields) {
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
        var sql = 'select * from medical_history where id = ' + id;
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
        var sql = 'select * from medical_history where sub_member_id = ' + memberId + ' and is_delete = 0 order by created_on desc;';
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
    var deleteSql = 'update medical_history set is_delete = 1 where id = ' + id;
    console.log(deleteSql);
    connection.query(deleteSql, function (error, result, fields) {
        if (error) {
            callback(error);
        }
        if (result) {
            callback(result);
        }
    });
};