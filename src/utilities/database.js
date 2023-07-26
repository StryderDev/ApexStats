var database = require('mysql2');
var db;

function databaseConnection() {
	if (!db) {
		db = database.createPool({
			host: 'aws.connect.psdb.cloud',
			database: 'dev',
			user: '4ryeuysbuhyuot3ryrqw',
			password: 'pscale_pw_iGuDgvlq6Xyf1CHPqayw8l7nm8DnetcTwCo1XhsmZbZ',
			port: 3306,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			maxIdle: 10,
			idleTimeout: 30000,
			enableKeepAlive: true,
			ssl: {},
		});

		db.getConnection(err => {
			if (err) {
				console.log(`Error connecting to database: ${err}`);
			} else {
				console.log('Database connection complete. Spyglass operational.');
			}
		});
	}

	return db;
}

module.exports = databaseConnection();
