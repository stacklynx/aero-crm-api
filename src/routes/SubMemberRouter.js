var express = require('express');
var router = express.Router();

var subMemberController = require('../controllers/SubMemberController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, subMemberController.create);
router.put('/update', verification.verifyToken, subMemberController.update);
router.post('/get/:id', verification.verifyToken, subMemberController.getById);
router.post('/email/:email/member/:memberId', verification.verifyToken, subMemberController.checkEmail);
router.post('/all/member/:memberId', verification.verifyToken, subMemberController.getByMemberId);
router.delete('/delete/:id', verification.verifyToken, subMemberController.deleteById);
router.get('/search/member/:name', verification.verifyToken, subMemberController.searchByName);

module.exports = router;