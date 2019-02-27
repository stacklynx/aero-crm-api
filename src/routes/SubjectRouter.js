var express = require('express');
var router = express.Router();

var subjectController = require('../controllers/SubjectController');
var verification = require('../util/verification');

router.post('/category/:category/member/:memberId', verification.verifyToken, subjectController.getByCategoryAndMemberId);
router.post('/create', verification.verifyToken, subjectController.create);
router.put('/update', verification.verifyToken, subjectController.update);
router.post('/get/:id', verification.verifyToken, subjectController.getById);
router.post('/all/member/:memberId', verification.verifyToken, subjectController.getByMemberId);
router.delete('/delete/:id', verification.verifyToken, subjectController.delete);

module.exports = router;