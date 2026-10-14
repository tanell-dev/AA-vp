const express = require('express');
const router = express.Router();

//kasutatavad kontrollerid
const {
	kulastused,
	registreeri,
	registreeripost} = require('../controllers/kulastusedControllers');

router.route('/').get(kulastused);

router.route('/registreeri').get(registreeri);

router.route('/registreeri').post(registreeripost);

module.exports = router;
