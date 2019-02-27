var mysql = require('mysql');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./db.properties');

var connection = mysql.createConnection({
    connectionLimit : properties.get('pool'),
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Database is not connected" + err);
    }
}
);

module.exports = connection;
