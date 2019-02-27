var express = require('express');
var router = express.Router();

var taskController = require('../controllers/TaskController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, taskController.create);
router.put('/update', verification.verifyToken, taskController.update);
router.put('/get/:id', verification.verifyToken, taskController.getById);
router.post('/all/member/:memberId', verification.verifyToken, taskController.getByMemberId);
router.post('/search', verification.verifyToken, taskController.search);

module.exports = router;