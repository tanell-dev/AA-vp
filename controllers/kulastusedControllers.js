const fs = require('fs').promises;
const path = require('path');
const dateET = require('../src/dateTimeET.js');

const visiidifail = path.join(__dirname, '../public/txt/visits.txt');

//@desc külastuste osa avaleht, näitab viimast külastust
//@route GET /kulastused
//@access public

const kulastused = async (req, res) => {
	try {
		const data = await fs.readFile(visiidifail, 'utf8');
		let visits = data.split(';');
		let lastVisit = visits[visits.length - 2];
		let parts = lastVisit.split(',');
		let name = parts[0].trim();
		let date = parts[1].trim();
		let time = parts[2].trim();
		let visitText = 'Viimati registreeriti külastus ' + date + ', kell ' + time + ' kui seda tegi ' + name;
		res.render('kulastused', {visitText: visitText});
	}
	catch (err) {
		console.log(err);
		res.render('kulastused', {visitText: 'Kahjuks ühtegi külastust ei leitud'});
	}
};

//@desc külastuse registreerimise leht
//@route GET /kulastused/registreeri
//@access public

const registreeri = (req, res) => {
	res.render('regvisit');
};

//@desc külastuse registreerimise salvestamine
//@route POST /kulastused/registreeri
//@access public

const registreeripost = async (req, res) => {
	console.log(req.body);
	try {
		await fs.open(visiidifail, 'a');
		await fs.appendFile(visiidifail, req.body.nameInput + ', ' + dateET.dateET(0) + ', ' + dateET.timeET() + ';');
		res.redirect('/kulastused');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
};

module.exports = {
	kulastused,
	registreeri,
	registreeripost
};
