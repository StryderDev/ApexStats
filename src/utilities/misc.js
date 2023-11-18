const chalk = require('chalk');

function uptime(length) {
	const seconds = `${Math.floor(length % 60)} Seconds`;
	const minutes = `${Math.floor((length % (60 * 60)) / 60)} Minutes`;
	const hours = `${Math.floor((length / (60 * 60)) % 24)} Hours`;
	const days = `${Math.floor(length / 86400)} Days`;

	return `Uptime: ${days}, ${hours}, ${minutes}`;
}

module.exports = { uptime };
