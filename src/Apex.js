const chalk = require('chalk');
const Database = require('better-sqlite3');
const { Client, GatewayIntentBits } = require('discord.js');

const { loadEvents } = require('./Events.js');
const { uptime } = require('./utilities/misc.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create and load database files
const db_mapIndex = new Database(`${__dirname}/databases/mapIndex.sqlite`);

// Create tables if they don't exist
const createMapIndexTable = `CREATE TABLE IF NOT EXISTS currentMapIndex (id TEXT, brMapIndex INTEGER NOT NULL DEFAULT "0", rankedMapIndex INTEGER NOT NULL DEFAULT "0", PRIMARY KEY (id));`;

// Execute the queries to create the tables
db_mapIndex.exec(createMapIndexTable);

client
	.login(process.env.DISCORD_TOKEN)
	.then(() => {
		loadEvents(client);
	})
	.catch(error => {
		console.log(chalk.red(`${chalk.bold('BOT:')} Error during login: ${error}`));
	});

uptime(client);

module.exports = { client };
