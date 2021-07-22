// Main Config
const config = require("./config.json");

// Discord Client
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

// On ready...
client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.discord.token);
