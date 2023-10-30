const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const { ShardingManager } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

const db_mapIndex = new Database(`${__dirname}/databases/mapIndex.sqlite`);

dotenv.config();

// Create tables if they don't exist
const createMapIndexTable = `CREATE TABLE IF NOT EXISTS currentMapIndex (id TEXT, brMapIndex INTEGER NOT NULL DEFAULT "0", rankedMapIndex INTEGER NOT NULL DEFAULT "0", PRIMARY KEY (id));`;

// Execute the queries to create the tables
db_mapIndex.exec(createMapIndexTable);

const manager = new ShardingManager(path.join(__dirname, 'Apex.js'), { token: process.env.DISCORD_TOKEN, totalShards: parseInt(process.env.SHARD_COUNT) });

manager.on('shardCreate', shard => {
	console.log(chalk.yellow(`${chalk.bold('[SHARD]')} Launched Shard #${shard.id + 1}`));

	// Set default values for mapIndex
	db_mapIndex.prepare(`INSERT OR REPLACE INTO currentMapIndex (id, brMapIndex, rankedMapIndex) VALUES (?, ?, ?)`).run((shard.id + 1).toString(), '0', '0');
});

if (process.env.TOPGG_TOKEN != '0') {
	const poster = AutoPoster(process.env.TOPGG_TOKEN, manager);

	poster.on('posted', stats => {
		console.log(chalk.green(`${chalk.bold('[TopGG]')} Posted Bot Stats to TopGG - ${stats.serverCount} Servers - ${stats.shardCount} Shards`));
	});
}

manager.spawn().catch(err => {
	if (err.statusText) {
		console.log(chalk.red(`${chalk.bold('[BOT]')} ${err.statusText}`));
	} else {
		console.log(chalk.red(`${chalk.bold('[BOT]')} ${err}`));
	}
});
