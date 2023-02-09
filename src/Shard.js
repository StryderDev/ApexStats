const path = require('path');
const { ShardingManager } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

const { discord, topgg } = require('./config.json');

const manager = new ShardingManager(path.join(__dirname, 'Apex.js'), { token: discord.token, totalShards: 'auto' });

manager.on('shardCreate', shard => {
	console.log(`Launched Shard #${shard.id + 1}`);
});

if (topgg.enabled == true) {
	const poster = AutoPoster(topgg.token, manager);

	poster.on('posted', stats => {
		console.log(`[> Posted Bot Stats to TopGG - ${stats.serverCount} Servers - ${stats.shardCount} Shards <]`);
	});
}

manager.spawn();
