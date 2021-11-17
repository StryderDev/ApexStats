const { ShardingManager } = require('discord.js');
const config = require('./config.json');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { AutoPoster } = require('topgg-autoposter');

const timeLogs = DateTime.local().toFormat('hh:mm:ss');

const manager = new ShardingManager('./Apex.js', {
	totalShards: config.discord.shards,
	token: config.discord.token,
});

if (config.debug == false) {
	const poster = AutoPoster(config.topgg, manager);

	poster.on('posted', stats => {
		console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
	});
}

manager.on('shardCreate', shard => console.log(chalk`{blue.bold [${timeLogs}] Shard Launched. ID: ${shard.id}}`));

manager.spawn();
