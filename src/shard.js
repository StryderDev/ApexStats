const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');
const { ShardingManager } = require('discord.js');

// Load environment variables from .env file
dotenv.config();

// If bot is in dev mode, show that in the console
if (process.env.DEBUG === 'true') console.log(chalk.yellow(`${chalk.bold('[BOT]')} Bot started in debug environment`));

const shardManager = new ShardingManager(path.join(__dirname, 'apexstats.js'), { token: process.env.DISCORD_TOKEN, totalShards: 'auto' });

console.log(chalk.yellow(`${chalk.bold('[SHARD MANAGER]')} Creating bot shards...`));

shardManager.on(`shardCreate`, shard => {
	console.log(chalk.yellow(`${chalk.bold('[SHARD_' + shard.id + ']')} Shard #${shard.id} created`));
	console.log(chalk.green(`${chalk.bold('[SHARD_' + shard.id + ']')} Shard #${shard.id} launched`));
});

shardManager.spawn().catch(err => {
	console.log(err);
});
