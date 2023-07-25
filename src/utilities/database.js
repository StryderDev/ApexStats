var database = require('mysql2');
var db;

function databaseConnection() {
	if (!db) {
		db = database.createPool({
			host: 'containers-us-west-156.railway.app',
			database: 'railway',
			user: 'root',
			password: 'c4IR9a921Xq5Mw9SNSTA',
			port: 5978,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0,
			maxIdle: 10,
			idleTimeout: 30000,
			enableKeepAlive: true,
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
