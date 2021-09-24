const guildEvent = event => require(`../events/${event}`);
const Discord = require('discord.js');

function loadEvents(client) {
	// Client Events
	// client.on('ready', () => clientEvent('ready')(client));

	// Guild Events
	client.on('interactionCreate', m => guildEvent('interactionCreate')(m, client));
}

module.exports = {
	loadEvents,
};
