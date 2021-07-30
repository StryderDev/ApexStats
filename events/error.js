const client = require('../Apex.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');

client.once('error', error => {
	console.log(chalk`{red [${DateTime.local().toFormat('hh:mm:ss')}] ERROR: ${error}}`);
});
