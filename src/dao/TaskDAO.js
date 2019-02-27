var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./mail.properties');
var emailUtil = require('../util/MailUtils');

module.exports.create = function(jsonBody, callback){
    if (jsonBody.assign_to && jsonBody.assign_by && jsonBody.task && jsonBody.task_date) {
        var createSql = 'insert into task (assign_to, assign_by, task, created_on, task_date) values ';

        var modifiedSql = '';
        var ids = '';
        for(var i=0; i<jsonBody.assign_to.length; i++) { 
            ids = ids + jsonBody.assign_to[i] + ',';

            var sql = '(' + jsonBody.assign_to[i] + ',' + jsonBody.assign_by + ', "' + jsonBody.task + '", now(), "' + jsonBody.task_date + '"),';
            modifiedSql = modifiedSql + sql;
        }

        var htmlToSend = `<html>
                            <body>
                                <p>
                                    <b>Task Date : </b>` + jsonBody.task_date + `
                                </p>
                                <p>
                                    <u><b>Below Task TODO : </b></u>` + jsonBody.task + `
                                </p>
                            </body>
                        </html>`;

        var selectTaskSubject = 'select * from subject where category = "task"';
        var emailSubject = '';
        connection.query(selectTaskSubject, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result.length > 0) {
                emailSubject = result[0].name;
            }
        });

        var selectQuery = 'select * from sub_member where id in (' + ids.slice(0, -1) + ')';
        connection.query(selectQuery, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                var emails = '';
                for(var i=0; i< result.length; i++) {
                    emails = emails + result[i].email + ';'
                }

                emailUtil.sendEmail(emails, emailSubject, '', htmlToSend);

            }
        });


        createSql = createSql + modifiedSql;
        connection.query(createSql.slice(0, -1), function (error, result, fields) {
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
    
};

module.exports.getById = function(id, callback){
    if (id) {
        var sql = 'select * from task where id = ' + id + ' order by created_on desc';
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
        var sql = 'select t.*, m.user_name, s.first_name, s.last_name FROM task t inner join sub_member s on s.id = t.assign_to inner join member m on m.id = t.assign_by where assign_by = ' + memberId + ' order by t.created_on desc;';
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

module.exports.search = function(jsonBody, callback){
    var sql = 'select t.*, m.user_name, s.first_name, s.last_name FROM task t inner join sub_member s on s.id = t.assign_to inner join member m on m.id = t.assign_by where assign_by = ' + jsonBody.assign_by;
    if(jsonBody.assign_to && jsonBody.assign_to.length > 0) {
        var ids = '';
        for(var i=0; i<jsonBody.assign_to.length; i++) {
            ids = ids + jsonBody.assign_to[i] + ','
        }

        if(ids) {
            ids = ids.slice(0, -1)
        }

        sql = sql + ' and t.assign_to in (' + ids + ')';
    }

    if(jsonBody.task_date) {
        sql = sql + ' and t.task_date >= "' + jsonBody.task_date + ' 00:00:00" and t.task_date <= "' + jsonBody.task_date + ' 23:59:59"'
    }

    connection.query(sql, function (error, result, fields) {
        if (error) {
            callback(error);
        }
        if (result) {
            callback(result);
        }
    });
};