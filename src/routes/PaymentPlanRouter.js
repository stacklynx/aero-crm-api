var express = require('express');
var router = express.Router();

var paymentPlanController = require('../controllers/PaymentPlanController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, paymentPlanController.create);
router.put('/update', verification.verifyToken, paymentPlanController.update);
router.post('/get/:id', verification.verifyToken, paymentPlanController.getById);
router.post('/all/member/:memberId', verification.verifyToken, paymentPlanController.getByMemberId);
router.delete('/delete/:id', verification.verifyToken, paymentPlanController.delete);

module.exports = router;