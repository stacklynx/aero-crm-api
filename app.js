var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./scheduler.properties');

var member = require('./src/routes/MemberRouter');
var subMember = require('./src/routes/SubMemberRouter');
var task = require('./src/routes/TaskRouter');
var payment = require('./src/routes/PaymentRouter');
var notification = require('./src/routes/NotificationRouter');
var medical = require('./src/routes/MedicalHistoryRouter');
var personal = require('./src/routes/PersonalBestRouter');
var paymentPlan = require('./src/routes/PaymentPlanRouter');
var subject = require('./src/routes/SubjectRouter');
var image = require('./src/routes/ImageRouter');


var app = express();
const port = 2021;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token, authorization");
  res.header("Access-Control-Expose-Headers", "x-token, authorization");
  res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, OPTION");
  next();
});

app.use('/api/member', member);
app.use('/api/submember', subMember);
app.use('/api/task', task);
app.use('/api/payment', payment);
app.use('/api/notification', notification);
app.use('/api/medical', medical);
app.use('/api/personal', personal);
app.use('/api/plan', paymentPlan);
app.use('/api/subject', subject);
app.use('/api/image', image);

app.get('/test', (req, resp) => {
  resp.send('Gym API');
});


//Scheduler Task will run everyday at 12am
var notoficationDao = require('./src/dao/NotificationDAO');

schedule.scheduleJob(properties.get('everydayMidNight'), function(){
  notoficationDao.create(function (result, error) {
    if(error) {
      console.log('Error');
    }

    if(result) {
      console.log('Notification inserted');
    }
  })
});

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || port, function () {
  console.log(`listening on *:${port}`);
});

module.exports = app;
