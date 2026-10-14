function dateFormattedET(type) {
    const timeNow = new Date();
    const dateNow = timeNow.getDate();
    const monthNow = timeNow.getMonth();
    const yearNow = timeNow.getFullYear();

    const monthNamesET = [
        'jaanuar', 'veebruar', 'märts', 'aprill',
        'mai', 'juuni', 'juuli', 'august',
        'september', 'oktoober', 'november', 'detsember'
    ];

    const folkMonthNamesET = [
        'näärikuu', 'küünlakuu', 'radokuu', 'jürikuu',
        'lehekuu', 'jaanikuu', 'heinakuu', 'lõikuskuu',
        'mihklikuu', 'porikuu', 'mardikuu', 'jõulukuu'
    ];

    let monthName;

    if (type === 1) {
        monthName = folkMonthNamesET[monthNow];
    } else {
        monthName = monthNamesET[monthNow];
    }

    return dateNow + '. ' + monthName + ' ' + yearNow;
}

function timeFormattedET() {
    const timeNow = new Date();
    let hourNow = timeNow.getHours();
    let minuteNow = timeNow.getMinutes();
    let secondNow = timeNow.getSeconds();

    if (minuteNow < 10) {
        minuteNow = '0' + minuteNow;
    }

    if (secondNow < 10) {
        secondNow = '0' + secondNow;
    }

    return hourNow + ':' + minuteNow + ':' + secondNow;
}

function dayFormattedET() {
    const timeNow = new Date();
    const dayNow = timeNow.getDay();

    const dayNamesET = [
        'pühapäev',
        'esmaspäev',
        'teisipäev',
        'kolmapäev',
        'neljapäev',
        'reede',
        'laupäev'
    ];

    return dayNamesET[dayNow];
}

function folkMonthFormattedET() {
    const monthNow = new Date().getMonth();

    const folkMonthNamesET = [
        'näärikuu', 'küünlakuu', 'radokuu', 'jürikuu',
        'lehekuu', 'jaanikuu', 'heinakuu', 'lõikuskuu',
        'mihklikuu', 'porikuu', 'mardikuu', 'jõulukuu'
    ];

    const name = folkMonthNamesET[monthNow];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

module.exports = {
    dateET: dateFormattedET,
    timeET: timeFormattedET,
    dayET: dayFormattedET,
    folkMonthET: folkMonthFormattedET
};
