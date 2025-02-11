const chalk = require('chalk');
var database = require('mysql2');

var db;

function dbConnect() {
	console.log(chalk.yellow(`${chalk.bold('[SPYGLASS]')} Attemping connection to Spyglass...`));

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
				if (err.errors) {
					err.errors.forEach(error => {
						console.log(chalk.red(`${chalk.bold('[SPYGLASS]')} Error connecting to Spyglass: ${error.message}`));
					});
				} else {
					console.log(chalk.red(`${chalk.bold('[SPYGLASS]')} Error connecting to Spyglass: ${err.message}`));
				}

				return;
			}

			console.log(chalk.green(`${chalk.bold('[SPYGLASS]')} Spyglass Connection Successful`));
		});
	}

	return db;
}

module.exports = dbConnect();
