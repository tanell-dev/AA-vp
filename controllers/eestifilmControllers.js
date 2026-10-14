const mysql = require('mysql2/promise');

const dbConf = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
};

//@desc home page for Estonian Film section
//@route GET /eestifilm
//@access public

const eestifilm = (req, res) => {
	res.render('eestifilm');
};

//@desc home page for people involved in Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public

const inimesed = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = 'SELECT * FROM person';
		const [sqlRes] = await conn.execute(sqlReq);
		res.render('film_inimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('film_inimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding people involved in Estonian Film industry
//@route GET /eestifilm/inimesed_lisa
//@access public

const inimesedlisa = (req, res) => {
	res.render('eesti_film_lisainimesed', {notice: 'Ootan sisestust!', firstNameInput: null, lastNameInput: null, bornInput: null, deceasedInput: null});
};

//@desc page for adding people involved in Estonian Film industry
//@route POST /eestifilm/inimesed_lisa
//@access public

const inimesedlisapost = async (req, res) => {
	console.log(req.body);
	const formData = {
		firstNameInput: req.body.firstNameInput,
		lastNameInput: req.body.lastNameInput,
		bornInput: req.body.bornInput,
		deceasedInput: req.body.deceasedInput
	};
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();

	if(!req.body.firstNameInput){
		console.log("Eesnimi on puudu!");
		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Eesnimi on puudu!'}, formData));
	}
	if(!req.body.lastNameInput){
		console.log("Perekonnanimi on puudu!");
		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Perekonnanimi on puudu!'}, formData));
	}
	if(!req.body.bornInput){
		console.log("Sünnikuupäev on puudu!");
		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Sünnikuupäev on puudu!'}, formData));
	}
	if(isNaN(bornDate.getTime())){
		console.log("Sünnikuupäev ei ole reaalne kuupäev!");
		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Sünnikuupäev ei ole reaalne kuupäev!'}, formData));
	}
	if(bornDate > timeNow){
		console.log("Sünnikuupäev ei tohi olla tulevikus!");
		return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Sünnikuupäev ei tohi olla tulevikus!'}, formData));
	}

	let deceasedDate = null;
	if(req.body.deceasedInput != ''){
		deceasedDate = req.body.deceasedInput;
		const deceasedDateObj = new Date(req.body.deceasedInput);
		if(isNaN(deceasedDateObj.getTime())){
			console.log("Surmakuupäev ei ole reaalne kuupäev!");
			return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Surmakuupäev ei ole reaalne kuupäev!'}, formData));
		}
		if(deceasedDateObj > timeNow){
			console.log("Surmakuupäev ei tohi olla tulevikus!");
			return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Surmakuupäev ei tohi olla tulevikus!'}, formData));
		}
		if(deceasedDateObj < bornDate){
			console.log("Surmakuupäev ei tohi olla varasem kui sünnikuupäev!");
			return res.render('eesti_film_lisainimesed', Object.assign({notice: 'Surmakuupäev ei tohi olla varasem kui sünnikuupäev!'}, formData));
		}
	}

	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('eesti_film_lisainimesed', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud!', firstNameInput: null, lastNameInput: null, bornInput: null, deceasedInput: null});
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eesti_film_lisainimesed', Object.assign({notice: 'Tekkis viga, midagi ei salvestatud!'}, formData));
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for list Estonian Films
//@route GET /eestifilm/filmid
//@access public

const filmid = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const sqlReq = 'SELECT * FROM movie ORDER BY title';
		const [sqlRes] = await conn.execute(sqlReq);
		res.render('film_filmid', {movieList: sqlRes});
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('film_filmid', {movieList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding Estonian Films
//@route GET /eestifilm/filmid_lisa
//@access public

const filmidlisa = (req, res) => {
	res.render('eesti_film_lisafilmid', {notice: 'Ootan sisestust!', titleInput: null, yearInput: null, durationInput: null, descriptionInput: null});
};

//@desc page for adding Estonian Films
//@route POST /eestifilm/filmid_lisa
//@access public

const filmidlisapost = async (req, res) => {
	const formData = {
		titleInput: req.body.titleInput,
		yearInput: req.body.yearInput,
		durationInput: req.body.durationInput,
		descriptionInput: req.body.descriptionInput
	};
	const yearNum = Number(req.body.yearInput);
	const durationNum = Number(req.body.durationInput);
	const yearNow = new Date().getFullYear();
	let descriptionValue = null;
	if(req.body.descriptionInput != ''){
		descriptionValue = req.body.descriptionInput;
	}

	if(!req.body.titleInput){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Filmi pealkiri on puudu!'}, formData));
	}
	if(!req.body.yearInput){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta on puudu!'}, formData));
	}
	if(isNaN(yearNum) || !Number.isInteger(yearNum)){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta peab olema täisarv!'}, formData));
	}
	if(yearNum < 1895){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta ei ole reaalne!'}, formData));
	}
	if(yearNum > yearNow){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Valmimisaasta ei saa olla tulevikus!'}, formData));
	}
	if(!req.body.durationInput){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Kestus on puudu!'}, formData));
	}
	if(isNaN(durationNum) || !Number.isInteger(durationNum) || durationNum <= 0){
		return res.render('eesti_film_lisafilmid', Object.assign({notice: 'Kestus peab olema positiivne täisarv minutites!'}, formData));
	}

	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
		await conn.execute(sqlReq, [
			req.body.titleInput,
			yearNum,
			durationNum,
			descriptionValue
		]);
		res.render('eesti_film_lisafilmid', {notice: req.body.titleInput + ' andmebaasi salvestatud!', titleInput: null, yearInput: null, durationInput: null, descriptionInput: null});
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eesti_film_lisafilmid', Object.assign({notice: 'Tekkis viga, midagi ei salvestatud!'}, formData));
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page listing professions related to film
//@route GET /eestifilm/ametid
//@access public

const ametid = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const sqlReq = 'SELECT * FROM profession ORDER BY id';
		const [sqlRes] = await conn.execute(sqlReq);
		res.render('film_ametid', {professionList: sqlRes});
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('film_ametid', {professionList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding professions related to film
//@route GET /eestifilm/ametid_lisa
//@access public

const ametidlisa = (req, res) => {
	res.render('eesti_film_lisaametid', {notice: 'Ootan sisestust!', titleInput: null, descriptionInput: null});
};

//@desc page for adding professions related to film
//@route POST /eestifilm/ametid_lisa
//@access public

const ametidlisapost = async (req, res) => {
	const formData = {
		titleInput: req.body.titleInput,
		descriptionInput: req.body.descriptionInput
	};
	let descriptionValue = null;
	if(req.body.descriptionInput != ''){
		descriptionValue = req.body.descriptionInput;
	}

	if(!req.body.titleInput){
		return res.render('eesti_film_lisaametid', Object.assign({notice: 'Ameti nimetus on puudu!'}, formData));
	}

	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';
		await conn.execute(sqlReq, [
			req.body.titleInput,
			descriptionValue
		]);
		res.render('eesti_film_lisaametid', {notice: req.body.titleInput + ' andmebaasi salvestatud!', titleInput: null, descriptionInput: null});
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eesti_film_lisaametid', Object.assign({notice: 'Tekkis viga, midagi ei salvestatud!'}, formData));
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

const seoseVormiAndmed = async () => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const [personList] = await conn.execute('SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name');
		const [movieList] = await conn.execute('SELECT id, title, release_year FROM movie ORDER BY title');
		const [professionList] = await conn.execute('SELECT id, title FROM profession ORDER BY title');
		return {personList: personList, movieList: movieList, professionList: professionList};
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

const seoseVorm = (notice, formData, lists) => {
	return Object.assign({
		notice: notice,
		personInput: null,
		movieInput: null,
		professionInput: null,
		characterInput: null
	}, lists, formData);
};

//@desc leht isiku, filmi ja ameti seoste näitamiseks
//@route GET /eestifilm/seosed
//@access public

const seosed = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const sqlReq = 'SELECT person.first_name, person.last_name, movie.title AS movie_title, movie.release_year, profession.title AS profession_title, person_in_movie.character_name FROM person_in_movie JOIN person ON person.id = person_in_movie.person_id JOIN movie ON movie.id = person_in_movie.movie_id JOIN profession ON profession.id = person_in_movie.profession_id ORDER BY movie.title, person.last_name, person.first_name';
		const [sqlRes] = await conn.execute(sqlReq);
		res.render('film_seosed', {seosList: sqlRes});
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('film_seosed', {seosList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc leht isiku, filmi ja ameti seose lisamiseks
//@route GET /eestifilm/seosed_lisa
//@access public

const seosedlisa = async (req, res) => {
	try {
		const lists = await seoseVormiAndmed();
		res.render('eesti_film_lisaseosed', seoseVorm('Ootan sisestust!', {}, lists));
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eesti_film_lisaseosed', seoseVorm('Andmeid ei õnnestunud laadida!', {}, {personList: [], movieList: [], professionList: []}));
	}
};

//@desc isiku, filmi ja ameti seose salvestamine
//@route POST /eestifilm/seosed_lisa
//@access public

const seosedlisapost = async (req, res) => {
	const formData = {
		personInput: req.body.personInput,
		movieInput: req.body.movieInput,
		professionInput: req.body.professionInput,
		characterInput: req.body.characterInput
	};
	let lists = {personList: [], movieList: [], professionList: []};
	try {
		lists = await seoseVormiAndmed();
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		return res.render('eesti_film_lisaseosed', seoseVorm('Andmeid ei õnnestunud laadida!', formData, lists));
	}

	if(!req.body.personInput){
		return res.render('eesti_film_lisaseosed', seoseVorm('Isik on valimata!', formData, lists));
	}
	if(!req.body.movieInput){
		return res.render('eesti_film_lisaseosed', seoseVorm('Film on valimata!', formData, lists));
	}
	if(!req.body.professionInput){
		return res.render('eesti_film_lisaseosed', seoseVorm('Amet on valimata!', formData, lists));
	}

	const personId = Number(req.body.personInput);
	const movieId = Number(req.body.movieInput);
	const professionId = Number(req.body.professionInput);
	let characterValue = null;
	if(req.body.characterInput != ''){
		characterValue = req.body.characterInput;
	}

	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const [olemas] = await conn.execute(
			'SELECT id FROM person_in_movie WHERE person_id = ? AND movie_id = ? AND profession_id = ?',
			[personId, movieId, professionId]
		);
		if(olemas.length > 0){
			return res.render('eesti_film_lisaseosed', seoseVorm('Selline seos on juba olemas!', formData, lists));
		}
		await conn.execute(
			'INSERT INTO person_in_movie (character_name, person_id, movie_id, profession_id) VALUES (?,?,?,?)',
			[characterValue, personId, movieId, professionId]
		);
		res.render('eesti_film_lisaseosed', seoseVorm('Seos andmebaasi salvestatud!', {}, lists));
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eesti_film_lisaseosed', seoseVorm('Tekkis viga, midagi ei salvestatud!', formData, lists));
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

module.exports = {
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
	seosedlisapost
};
