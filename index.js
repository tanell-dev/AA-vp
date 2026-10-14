const express = require('express');
const fs = require('fs').promises;
const bodyparser = require('body-parser');
require('dotenv').config({ quiet: true });
const dateET = require('./src/dateTimeET.js');

//moodul andmebaasiga suhtlemiseks, koos async võimalustega
//const mysql = require('mysql2/promise');
//
//const dbConf = {
//	host: process.env.DB_HOST,
//	user: process.env.DB_USER,
//	password: process.env.DB_PASS,
//	database: process.env.DB_NAME
//};


const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

// Käivitan express funktsiooni ja tähistan töötava asja nimega "app"
const app = express();
// Määrame veebilehe malli järgi renderdamise mootori (EJS)
app.set('view engine', 'ejs');
// muudan "public" veebiserverile kättesaadavaks
app.use(express.static('public'));
// Hakkme päringuid parsima
app.use(bodyparser.urlencoded({extended: false}));

app.get('/', (reg, res)=>{
	//res.send('Express.js veeb käivitus!');
	const day = dateET.dayET();
	const date = dateET.dateET(0);
	const time = dateET.timeET();
	res.render('index', {day: day, date: date, time: time});
});

app.get('/vanasona', async (reg, res)=>{
		try {
			const data = await fs.readFile(textRef, 'utf8');
			let folkWisdom = data.split(';');
			let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
			res.render('wisdom', {wisdom: wisdom});
		}
		catch (err){
			console.log(err);
			res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud'});
		}
});

//app.get('/regvisit', (reg, res)=>{
//	res.render('regvisit');
//});
//
//app.post('/regvisit', async (reg, res)=>{
//	console.log(reg.body);
//	try {
//		await fs.open(regTextRef, 'a');
//		await fs.appendFile(regTextRef, reg.body.nameInput + ', ' + dateET.dateET(0) + ', ' + dateET.timeET() + ';');
//	}
//	catch (err) {
//		
//	}
//	res.render('regvisit');
//});

app.get('/minust', (reg, res)=>{
	res.render('minust');
});


//app.get('/viimane', async (reg, res)=>{
//	try {
//		const data = await fs.readFile(regTextRef, 'utf8');
//		let visits = data.split(';');
//		let lastVisit = visits[visits.length - 2];
//		let parts = lastVisit.split(',');
//		let name = parts[0].trim();
//		let date = parts[1].trim();
//		let time = parts[2].trim();
//		let visitText = 'Viimati registreeriti külastus ' + date + ', kell ' + time + ' kui seda tegi ' + name;
//		res.render('viimane', {visitText: visitText});
//	}
//	catch (err) {
//		console.log(err);
//		res.render('viimane', {visitText: 'Kahjuks ühtegi külastust ei leitud'});
//	}
//});

//Külastuste marsruudid
const kulastusedRouter = require('./routes/kulastusedRoutes');
app.use('/kulastused', kulastusedRouter);

//Eesti filmi marsruudid
const eestiFilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestiFilmRouter);

//Vanad Eesti filmi marsruudid (tõstetud controllers/routes alla):
//app.get('/eestifilm', async (reg, res)=>{
//	res.render('eestifilm');
//});
//
//app.get(['/eestifilm/inimesed', '/eestifilm/film_inimesed'], async (req, res)=>{
//	let conn;
//	try {
//		conn = await mysql.createConnection(dbConf);
//		//defineerime SQL päringu
//		let sqlReq = 'SELECT * FROM person';
//		const [sqlRes] = await conn.execute(sqlReq);
//		//console.log(sqlRes);
//		res.render('film_inimesed', {personList: sqlRes});
//	}
//	catch (err) {
//		console.log('Andmebaasiga suhtlemise viga: ' + err);
//		res.render('film_inimesed', {personList: []});
//	}
//	finally {
//		if(conn){
//			await conn.end();
//		}
//	}
//});
//
//app.get('/eestifilm/inimesed_lisa', (req, res)=>{
//	res.render('eesti_film_lisainimesed', {notice: 'Ootan sisestust!', firstNameInput: null, lastNameInput: null, bornInput: null, deceasedInput: null});
//});
//
//app.post('/eestifilm/inimesed_lisa', async (req, res)=>{
//	console.log(req.body);
//	//kontrollime andmeid, teeme kõige lahjema kontrolli
//	//sisestatud sünnikuupäev (tekst) teisendada kuupäevaks
//
//	const formData = {
//		firstNameInput: req.body.firstNameInput,
//		lastNameInput: req.body.lastNameInput,
//		bornInput: req.body.bornInput,
//		deceasedInput: req.body.deceasedInput
//	};
//	const bornDate = new Date(req.body.bornInput);
//	const timeNow = new Date();
//
//	if(!req.body.firstNameInput){
//		console.log("Eesnimi on puudu!");
//		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Eesnimi on puudu!'}, formData));
//	}
//	if(!req.body.lastNameInput){
//		console.log("Perekonnanimi on puudu!");
//		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Perekonnanimi on puudu!'}, formData));
//	}
//	if(!req.body.bornInput){
//		console.log("Sünnikuupäev on puudu!");
//		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Sünnikuupäev on puudu!'}, formData));
//	}
//	if(isNaN(bornDate.getTime())){
//		console.log("Sünnikuupäev ei ole reaalne kuupäev!");
//		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Sünnikuupäev ei ole reaalne kuupäev!'}, formData));
//	}
//	if(bornDate > timeNow){
//		console.log("Sünnikuupäev ei tohi olla tulevikus!");
//		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Sünnikuupäev ei tohi olla tulevikus!'}, formData));
//	}
//
//	let deceasedDate = null;
//	if(req.body.deceasedInput != ''){
//		deceasedDate = req.body.deceasedInput;
//		const deceasedDateObj = new Date(req.body.deceasedInput);
//		if(isNaN(deceasedDateObj.getTime())){
//			console.log("Surmakuupäev ei ole reaalne kuupäev!");
//			return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Surmakuupäev ei ole reaalne kuupäev!'}, formData));
//		}
//		if(deceasedDateObj > timeNow){
//			console.log("Surmakuupäev ei tohi olla tulevikus!");
//			return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Surmakuupäev ei tohi olla tulevikus!'}, formData));
//		}
//		if(deceasedDateObj < bornDate){
//			console.log("Surmakuupäev ei tohi olla varasem kui sünnikuupäev!");
//			return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Surmakuupäev ei tohi olla varasem kui sünnikuupäev!'}, formData));
//		}
//	}
//
//	let conn;
//	try {
//		conn = await mysql.createConnection(dbConf);
//		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
//		await conn.execute(sqlReq, [
//			req.body.firstNameInput,
//			req.body.lastNameInput,
//			req.body.bornInput,
//			deceasedDate
//		]);
//		res.render('eesti_film_lisainimesed', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud!', firstNameInput: null, lastNameInput: null, bornInput: null, deceasedInput: null});
//	}
//	catch (err) {
//		console.log('Viga andmebaasiga suhtlemisel: ' + err);
//		res.render('eesti_film_lisainimesed', {notice: 'Tekkis viga, midagi ei salvestatud!', firstNameInput: req.body.firstNameInput, lastNameInput: req.body.lastNameInput, bornInput: req.body.bornInput, deceasedInput: req.body.deceasedInput});
//	}
//	finally {
//		if(conn){
//			await conn.end();
//		}
//	}
//});
//
//app.get('/eestifilm/filmid_lisa', (req, res)=>{
//	res.render('eesti_film_lisafilmid', {notice: 'Ootan sisestust!', titleInput: null, yearInput: null, durationInput: null, descriptionInput: null});
//});
//
//app.post('/eestifilm/filmid_lisa', async (req, res)=>{
//	const formData = {
//		titleInput: req.body.titleInput,
//		yearInput: req.body.yearInput,
//		durationInput: req.body.durationInput,
//		descriptionInput: req.body.descriptionInput
//	};
//	const yearNum = Number(req.body.yearInput);
//	const durationNum = Number(req.body.durationInput);
//	const yearNow = new Date().getFullYear();
//	let descriptionValue = null;
//	if(req.body.descriptionInput != ''){
//		descriptionValue = req.body.descriptionInput;
//	}
//
//	if(!req.body.titleInput){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Filmi pealkiri on puudu!'}, formData));
//	}
//	if(!req.body.yearInput){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta on puudu!'}, formData));
//	}
//	if(isNaN(yearNum) || !Number.isInteger(yearNum)){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta peab olema täisarv!'}, formData));
//	}
//	if(yearNum < 1895){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta ei ole reaalne!'}, formData));
//	}
//	if(yearNum > yearNow){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta ei saa olla tulevikus!'}, formData));
//	}
//	if(!req.body.durationInput){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Kestus on puudu!'}, formData));
//	}
//	if(isNaN(durationNum) || !Number.isInteger(durationNum) || durationNum <= 0){
//		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Kestus peab olema positiivne täisarv minutites!'}, formData));
//	}
//
//	let conn;
//	try {
//		conn = await mysql.createConnection(dbConf);
//		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
//		await conn.execute(sqlReq, [
//			req.body.titleInput,
//			yearNum,
//			durationNum,
//			descriptionValue
//		]);
//		res.render('eesti_film_lisafilmid', {notice: req.body.titleInput + ' andmebaasi salvestatud!', titleInput: null, yearInput: null, durationInput: null, descriptionInput: null});
//	}
//	catch (err) {
//		console.log('Viga andmebaasiga suhtlemisel: ' + err);
//		res.render('eesti_film_lisafilmid', Object.assign({notice: 'Tekkis viga, midagi ei salvestatud!'}, formData));
//	}
//	finally {
//		if(conn){
//			await conn.end();
//		}
//	}
//});
//
//app.get('/eestifilm/ametid_lisa', (req, res)=>{
//	res.render('eesti_film_lisaametid', {notice: 'Ootan sisestust!', titleInput: null, descriptionInput: null});
//});
//
//app.post('/eestifilm/ametid_lisa', async (req, res)=>{
//	const formData = {
//		titleInput: req.body.titleInput,
//		descriptionInput: req.body.descriptionInput
//	};
//	let descriptionValue = null;
//	if(req.body.descriptionInput != ''){
//		descriptionValue = req.body.descriptionInput;
//	}
//
//	if(!req.body.titleInput){
//		return res.render('eesti_film_lisaametid', Object.assign({notice: 'Ameti nimetus on puudu!'}, formData));
//	}
//
//	let conn;
//	try {
//		conn = await mysql.createConnection(dbConf);
//		let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';
//		await conn.execute(sqlReq, [
//			req.body.titleInput,
//			descriptionValue
//		]);
//		res.render('eesti_film_lisaametid', {notice: req.body.titleInput + ' andmebaasi salvestatud!', titleInput: null, descriptionInput: null});
//	}
//	catch (err) {
//		console.log('Viga andmebaasiga suhtlemisel: ' + err);
//		res.render('eesti_film_lisaametid', Object.assign({notice: 'Tekkis viga, midagi ei salvestatud!'}, formData));
//	}
//	finally {
//		if(conn){
//			await conn.end();
//		}
//	}
//});

app.get('/tlu', (reg, res)=>{
	res.render('tlu');
});

app.listen(53277);