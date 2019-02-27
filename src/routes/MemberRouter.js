var express = require('express');
var router = express.Router();

var memberController = require('../controllers/MemberControllers');
var verification = require('../util/verification');

router.post('/create', memberController.create);
router.post('/login', memberController.login);
router.post('/forgot-uesrname/:email', memberController.forgotUsername);
router.post('/forgot-password/:email', memberController.forgotPassword);
router.post('/email/:email', memberController.checkEmail);
router.post('/username/:username', memberController.checkUsername);
router.post('/password/change', verification.verifyTokenForPassword, memberController.passwordChange);

module.exports = router;