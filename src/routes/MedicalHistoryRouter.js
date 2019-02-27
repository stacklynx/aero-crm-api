var express = require('express');
var router = express.Router();

var medicalController = require('../controllers/MedicalHistoryController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, medicalController.create);
router.put('/update', verification.verifyToken, medicalController.update);
router.post('/get/:id', verification.verifyToken, medicalController.getById);
router.post('/all/member/:memberId', verification.verifyToken, medicalController.getBySubMemberId);
router.delete('/delete/:id', verification.verifyToken, medicalController.delete);

module.exports = router;