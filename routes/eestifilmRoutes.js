const express = require('express');
const router = express.Router();

//kasutatavad kontrollerid
const {
	eestifilm,
	inimesed,
	inimesedlisa,
	inimesedlisapost,
	filmid,
	filmidlisa,
	filmidlisapost,
	ametid,
	ametidlisa,
	ametidlisapost,
	seosed,
	seosedlisa,
	seosedlisapost} = require('../controllers/eestifilmControllers');

router.route('/').get(eestifilm);
router.route('/inimesed').get(inimesed);
router.route('/film_inimesed').get(inimesed);
router.route('/inimesed_lisa').get(inimesedlisa);
router.route('/inimesed_lisa').post(inimesedlisapost);
router.route('/filmid').get(filmid);
router.route('/filmid_lisa').get(filmidlisa);
router.route('/filmid_lisa').post(filmidlisapost);
router.route('/ametid').get(ametid);
router.route('/ametid_lisa').get(ametidlisa);
router.route('/ametid_lisa').post(ametidlisapost);
router.route('/seosed').get(seosed);
router.route('/seosed_lisa').get(seosedlisa);
router.route('/seosed_lisa').post(seosedlisapost);

module.exports = router;
