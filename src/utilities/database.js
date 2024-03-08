const chalk = require('chalk');
var database = require('mysql2');

var db;

function databaseConnection() {
	if (!db) {
		db = database.createPool({
			host: process.env.DB_HOST,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			port: process.env.DB_PORT,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			maxIdle: 10,
			idleTimeout: 30000,
			enableKeepAlive: true,
			ssl: { rejectUnauthorized: false },
		});

		db.getConnection(err => {
			if (err) {
				console.log(chalk.red(`${chalk.bold('[SPYGLASS]')} Error connecting to database: ${err}`));
			} else {
				console.log(chalk.blue(`${chalk.bold('[SPYGLASS]')} Database connection complete. Spyglass operational.`));
			}
		});
	}

	return db;
}

module.exports = databaseConnection();
