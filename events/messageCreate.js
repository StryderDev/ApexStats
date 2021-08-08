const client = require('../Apex.js');
const { Message } = require('discord.js');

client.on('messageCreate', msg => {
	if (msg.author.bot || !msg.guild || !msg.content.toLowerCase().startsWith('>>')) return;

	msg.reply(
		"Hey! We've switched to Slash Commands. Use `/` to start typing a command. If you're having issues, reinvite the bot using this link: <https://apexstats.dev/invite>.",
	);
});
