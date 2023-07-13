const path = require('path');
const dotenv = require('dotenv');
const { ShardingManager } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

dotenv.config();

const manager = new ShardingManager(path.join(__dirname, 'Apex.js'), { token: process.env.DISCORD_TOKEN, totalShards: 'auto' });

manager.on('shardCreate', shard => {
	console.log(`Launched Shard #${shard.id + 1}`);
});

if (process.env.TOPGG_TOKEN != '0') {
	const poster = AutoPoster(process.env.TOPGG_TOKEN, manager);

	poster.on('posted', stats => {
		console.log(`[> Posted Bot Stats to TopGG - ${stats.serverCount} Servers - ${stats.shardCount} Shards <]`);
	});
}

manager.spawn().catch(err => console.log(`Error: ${err.statusText}`));
