const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { version } = require('../../../package.json');
const { embedColor } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('info').setDescription('Show info about the bot.'),

	async execute(interaction) {
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime % (60 * 60)) / 60);
		const hours = Math.floor(uptime / (60 * 60)) % 24;
		const days = Math.floor(uptime / 86400);

		const info = new EmbedBuilder()
			.setTitle('Apex Legends Stats Bot')
			.setDescription('User and ranked stats, map rotations, news, random loadout & drop locations, and more. Start by typing `/` for a list of commands!')
			.setThumbnail(`https://specter.apexstats.dev/ApexStats/Avatar/Shockwave.png?t=${Math.floor(Math.random() * 10) + 1}&key=${process.env.SPECTER}`)
			.addFields([
				{
					name: 'Links',
					value: `[Ko-Fi](https://ko-fi.com/sdcore)\n[GitHub](https://github.com/StryderDev/ApexStats)\n[Support Server](https://discord.gg/eH8VxssFW6)`,
					inline: true,
				},
				{
					name: 'Bot Info',
					value: `Shard ${interaction.client.shard.ids[0] + 1}/${interaction.client.shard.count}\nVersion ${version}\nCodename "${process.env.RELEASE}"`,
					inline: true,
				},
				{
					name: 'Uptime',
					value: `${days}d, ${hours}h, ${minutes}m, ${seconds}s`,
					inline: true,
				},
			])
			.setColor(embedColor)
			.setFooter({ text: 'Wanna add the bot to your server? Click the "Apex Stats" username and press "Add to Server".' });

		await interaction.editReply({ embeds: [info] });
	},
};
