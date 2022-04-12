const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { release } = require('../../config.json');
const { version } = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder().setName('info').setDescription('Shows info about the bot.'),
	async execute(interaction) {
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime % (60 * 60)) / 60);
		const hours = Math.floor(uptime / (60 * 60)) % 24;
		const days = Math.floor(uptime / 86400);

		const info = new MessageEmbed()
			.setTitle('Apex Legends Stats Bot')
			.setDescription('Get user stats, Battle Royale and Arenas map rotations, news, and more. Start by typing `/` for a list of commands.')
			.setThumbnail('https://cdn.apexstats.dev/Bot/Avatar/2022/Season%2012.png')
			.addField('Links', '[Ko-Fi](https://ko-fi.com/sdcore)\n[GitHub](https://github.com/stryderdev/apex-stats-bot)\n[Support Server](https://discord.gg/eH8VxssFW6)', true)
			.addField('Bot Info', `Shard ${interaction.client.shard.ids[0] + 1}/${interaction.client.shard.count}\nVersion ${version}\nCodename "${release.name}"`, true)
			.addField('Uptime', `${days}d, ${hours}h, ${minutes}m, ${seconds}s`, true)
			.setFooter({ text: 'Wanna add the bot to your server? Click the "Apex Stats" username and press "Add to Server"' });

		await interaction.editReply({ embeds: [info] });
	},
};
