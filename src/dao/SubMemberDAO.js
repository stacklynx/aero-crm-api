var connection = require('../../db');
var commonUtil = require('../util/CommonUtil');

module.exports.create = function (jsonBody, callback) {
    
    if (jsonBody.first_name && jsonBody.last_name && jsonBody.email && jsonBody.payment_plan && jsonBody.last_payment_date) {
        var createSql = 'insert into sub_member (first_name, last_name, email, gender, created_by, created_on, is_delete, payment_plan, payment_start_date, last_payment_date, phone_number, address, payment_plan_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(createSql, [jsonBody.first_name, jsonBody.last_name, jsonBody.email, jsonBody.gender, jsonBody.created_by, new Date(), 0, jsonBody.payment_plan, jsonBody.payment_start_date, jsonBody.last_payment_date, jsonBody.phone_number, jsonBody.address, jsonBody.payment_plan_id], function (error, result, fields) {
            if (error) {
                callback(error);
            }
            console.log(result);
            if (result) {
                callback(result);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.update = function (jsonBody, callback) {
    if(jsonBody.id && jsonBody.first_name && jsonBody.last_name && jsonBody.email && jsonBody.payment_plan && jsonBody.last_payment_date) {
        var select = 'select * from sub_member where is_delete = 0 and id = ' + jsonBody.id;
        connection.query(select, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                result[0].first_name = jsonBody.first_name;
                result[0].last_name = jsonBody.last_name;
                result[0].email = jsonBody.email;
                result[0].gender = jsonBody.gender;
                result[0].payment_plan = jsonBody.payment_plan;
                result[0].payment_start_date = jsonBody.payment_start_date;
                result[0].last_payment_date = jsonBody.last_payment_date;
                result[0].phone_number = jsonBody.phone_number;
                result[0].address = jsonBody.address;
                result[0].payment_plan_id = jsonBody.payment_plan_id;
                
                var updateQuery = 'update sub_member set first_name = ?, last_name = ?, email = ?, gender = ?, payment_plan = ?, payment_start_date = ?, last_payment_date = ?, phone_number = ?, address = ?, payment_plan_id = ? where id = ?';
                connection.query(updateQuery, [result[0].first_name, result[0].last_name, result[0].email, result[0].gender, result[0].payment_plan, result[0].payment_start_date, result[0].last_payment_date, result[0].phone_number, result[0].address, result[0].payment_plan_id, result[0].id], function (error, updateResult, fields) {
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

module.exports.getById = function (id, callback) {
    if (id) {
        var sql = 'select s.*, p.id as plan_id, p.plan_name, p.no_of_time, p.time_unit from sub_member s inner join payment_plan p on p.id = s.payment_plan where s.id = ' + id;
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

module.exports.checkEmail = function (email, memberId, callback) {
    if (email) {
        var sql = 'SELECT * FROM sub_member WHERE is_delete <> 1 and email = "' + email + '" and created_by = ' + memberId;
        console.log(sql);
        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result && result.length > 0) {
                callback(commonUtil.EMAIL_EXIST);
            } else {
                callback(commonUtil.EMAIL_NOT_EXIST);
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
};

module.exports.getByMemberId = function (memberId, callback) {
    if (memberId) {
        var sql = 'select s.*, p.plan_name from sub_member s inner join payment_plan p on p.id = s.payment_plan where s.is_delete = 0 order by s.created_on desc';
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
    if(id) {
        var sql = 'select * from sub_member where id = ' + id;
        connection.query(sql, function (error, result, fields) {
            if(error) {
                callback(error);
            }
            if(result) {
                if(result.length > 0) {
                    var deleteSql = 'update sub_member set is_delete = 1 where id = ' + id;
                    connection.query(deleteSql, function (error, result, fields) {
                        if(error) {
                            callback(error);
                        }

                        if(result) {
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

module.exports.updateNextPaymentStratEndDate = function (jsonBody, callback) {
    if(jsonBody.id && jsonBody.next_payment_start_date && jsonBody.next_payment_end_date) {
        var select = 'select * from sub_member where is_delete = 0 and id = ' + jsonBody.id;
        connection.query(select, function (error, result, fields) {
            if (error) {
                callback(error);
            }

            if (result) {
                
                result[0].payment_start_date = jsonBody.next_payment_start_date;
                result[0].last_payment_date = jsonBody.next_payment_end_date;
                    
                var updateQuery = 'update sub_member set payment_start_date = ?, last_payment_date = ? where id = ?';
                connection.query(updateQuery, [result[0].payment_start_date, result[0].last_payment_date, result[0].id], function (error, updateResult, fields) {
                    if (error) {
                        callback(error);
                    }
                    
                    if(updateResult) {
                        callback(updateResult);
                    }
                })
            }
        });
    } else {
        callback(commonUtil.ERROR);
    }
}

module.exports.searchByName = function (memberName, callback) {
    try {
        var fname = '';
        var lname = '';
        if(memberName && memberName.indexOf(' ') != -1) {
            var dataArr = memberName.split(' ');
            fname = dataArr[0];
            lname = dataArr[dataArr.length - 1];
        } else {
            fname = memberName;
            lname = fname
        }

        var sql = '';
        if(memberName != 'NODATA') {
            sql = 'SELECT * FROM sub_member where first_name LIKE "%' + fname + '%" OR last_name LIKE "%' + lname + '%"';
        } else {
            sql = 'SELECT * FROM sub_member s where s.is_delete = 0 order by s.created_on desc';
        }

        connection.query(sql, function (error, result, fields) {
            if (error) {
                callback(error);
            }
            if (result) {
                callback(result);
            }
        });
    } catch(err) {
        callback(commonUtil.ERROR);
    }
}