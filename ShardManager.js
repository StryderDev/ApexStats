// Main Config
const config = require('./config.json');
const chalk = require('chalk');
const { DateTime } = require('luxon');

// Sharding Manager
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./Apex.js', {
	token: config.discord.token,
	totalShards: config.discord.shards,
});

Manager.on('shardCreate', shard => {
	console.log(chalk`{yellow [${DateTime.local().toFormat('hh:mm:ss')}] Spawning Shard ${shard.id}... }`);
	console.log(chalk`{green [${DateTime.local().toFormat('hh:mm:ss')}] Shard ${shard.id} Spawned }`);

	shard.on('ready', () => {
		console.log(chalk`{green [${DateTime.local().toFormat('hh:mm:ss')}] Shard ${shard.id} Connected }`);

		// Sending Data to Shard
		shard.send({ type: 'shardId', data: { shardId: shard.id } });
	});
});

Manager.spawn();

// Top GG
const { AutoPoster } = require('topgg-autoposter');

if (config.botLists.topGG.enabled == true) {
	const AP = AutoPoster(config.botLists.topGG.token, Manager);

	AP.on('posted', () => {
		console.log(chalk`{green Posted TopGG Stats}`);
	});
}

process.on('uncaughtException', function (err) {
	console.log(`Uncaught Exception Error: ${err}`);
});
