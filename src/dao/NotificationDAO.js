var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');
var moment = require('moment');

module.exports.create = function (callback) {

    var subMemberSelect = 'select * from sub_member where now() > last_payment_date and is_delete = 0';
    connection.query(subMemberSelect, function (error, result, fields) {
        if (error) {
            callback(error);
        }

        if (result) {
            var notificationQuery = 'insert into notification(sub_member_id, owner_id, is_read, is_delete, created_on) values';
            var dataQuery = '';
            for(var i=0; i<result.length; i++) {
                dataQuery = dataQuery + '(' +  result[i].id + ', ' + result[i].created_by + ', "0", "0", now()' + '),'
            }

            notificationQuery = notificationQuery + dataQuery.slice(0, -1);

            connection.query(notificationQuery, function (error, result, fields) {
                if (error) {
                    callback(error);
                }
                
                if (result) {
                    callback(result);
                }
            });

        }
    });
};

module.exports.getById = function (id, callback) {
    var sql = 'select * from notification where id = ' + id;
    connection.query(sql, function (error, result, fields) {
        if (error) {
            callback(error);
        }
        if (result) {
            callback(result);
        }
    });
};

module.exports.getByMemberId = function (memberId, callback) {
    if (memberId) {
        var sql = `select n.*, s.id as sub_member_id, s.first_name, s.last_name, s.last_payment_date FROM notification n 
                        inner join sub_member s on s.id = n.sub_member_id 
                   where n.owner_id = ` + memberId + ` and n.is_delete = 0 and s.is_delete = 0;`;
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                callback(result);
            }
        });
    }
};

module.exports.deleteById = function (id, callback) {
    if (id) {
        var sql = 'select * from notification where id = ' + id;
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                if (result.length > 0) {
                    var deleteSql = 'update notification set is_delete = 1 where id = ' + id;
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

module.exports.markedReadById = function (id, callback) {
    if (id) {
        var sql = 'select * from notification where id = ' + id;
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                if (result.length > 0) {
                    var deleteSql = 'update notification set is_read = 1 where id = ' + id;
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

module.exports.notificationCount = function (memberId, callback) {
    if (memberId) {
        var sql = 'select count(*) as count from notification where is_read = 0 and is_delete = 0 and owner_id = ' + memberId;
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