const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const { ShardingManager } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

const db_mapIndex = new Database(`${__dirname}/databases/mapIndex.sqlite`);

dotenv.config();

const manager = new ShardingManager(path.join(__dirname, 'Apex.js'), { token: process.env.DISCORD_TOKEN, totalShards: 2 });

manager.on('shardCreate', shard => {
	console.log(chalk.yellow(`${chalk.bold('SHARD:')} Launched Shard #${shard.id + 1}`));

	// Set default values for mapIndex
	db_mapIndex.prepare(`INSERT OR REPLACE INTO currentMapIndex (id, brMapIndex, rankedMapIndex) VALUES (?, ?, ?)`).run((shard.id + 1).toString(), '0', '0');
});

if (process.env.TOPGG_TOKEN != '0') {
	const poster = AutoPoster(process.env.TOPGG_TOKEN, manager);

	poster.on('posted', stats => {
		console.log(chalk.green(`${chalk.bold('TopGG:')} Posted Bot Stats to TopGG - ${stats.serverCount} Servers - ${stats.shardCount} Shards`));
	});
}

manager.spawn().catch(err => console.log(chalk.red(`${chalk.bold('BOT:')} ${err.statusText}`)));
