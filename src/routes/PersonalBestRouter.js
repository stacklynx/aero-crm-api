var express = require('express');
var router = express.Router();

var personalBestController = require('../controllers/PersonalBestController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, personalBestController.create);
router.put('/update', verification.verifyToken, personalBestController.update);
router.post('/get/:id', verification.verifyToken, personalBestController.getById);
router.post('/all/member/:memberId', verification.verifyToken, personalBestController.getBySubMemberId);
router.delete('/delete/:id', verification.verifyToken, personalBestController.delete);

module.exports = router;