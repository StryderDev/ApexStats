const client = require('../Apex.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { Message } = require('discord.js');

client.on('messageCreate', msg => {
	if (msg.author.bot || !msg.guild || !msg.content.toLowerCase().startsWith('>>')) return;

	msg.reply(
		"Hey! Commands for this bot have converted to Slash Commands.\nPlease make sure users have the approriate permissions (Use Slash Commands) in the channels where you want them to use this bot.\nIf, for some reason, Slash Commands don't seem to be registering, try readding the bot using this link: <https://apexstats.dev/invite>, then use the `/info` command to see more information.\nAs a last resort, you can join the support server for help/troubleshooting using this invite code: eH8VxssFW6",
	);
});
