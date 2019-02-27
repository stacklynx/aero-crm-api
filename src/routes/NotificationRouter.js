var express = require('express');
var router = express.Router();

var notificationController = require('../controllers/NotificationController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, notificationController.create);
router.post('/get/:id', verification.verifyToken, notificationController.getById);
router.post('/all/:memberId', notificationController.getByMemberId);
router.delete('/delete/:id', verification.verifyToken, notificationController.deleteById);
router.post('/marked/read/:id', verification.verifyToken, notificationController.markedReadById);
router.post('/count/:memberId', notificationController.notificationCount);


module.exports = router;