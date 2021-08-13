const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const Cluster = require('discord-hybrid-sharding');

const { discord } = require('./config.json');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
	shards: Cluster.data.SHARD_LIST,
	shardCount: Cluster.data.TOTAL_SHARDS,
});

module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();

// Init Command Handler
require('./handler.js')(client);

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

const rotations = fs.readdirSync('./rotations').filter(file => file.endsWith('.js'));

for (const file of rotations) {
	const event = require(`./rotations/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.cluster = new Cluster.Client(client);
client.login(discord.token);
