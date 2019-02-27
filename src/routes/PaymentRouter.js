var express = require('express');
var router = express.Router();

var paymentController = require('../controllers/PaymentController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, paymentController.create);
router.post('/get/:id', verification.verifyToken, paymentController.getById);
router.post('/all/payment/:subMemberId', verification.verifyToken, paymentController.getBySubMemberId);
router.post('/all/member/payment/:memberId', verification.verifyToken, paymentController.getMemberId);
router.delete('/delete/:id', verification.verifyToken, paymentController.deleteById);

module.exports = router;