const { isPlural, emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { version } = require('../../../package.json');
const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder().setName('info').setDescription('Show bot info'),

	async execute(interaction) {
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime % (60 * 60)) / 60);
		const hours = Math.floor(uptime / (60 * 60)) % 24;
		const days = Math.floor(uptime / 86400);

		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading bot info...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

		const infoEmbed = new EmbedBuilder()
			.setTitle('Apex Stats')
			.setDescription('Player stats and utilities for Apex Legends.')
			.addFields([
				{
					name: '🔗 Links',
					value: `${emotes.listArrow} [GitHub](https://github.com/StryderDev/ApexStats)\n${emotes.listArrow} [Support Server](https://discord.gg/eH8VxssFW6)`,
					inline: true,
				},
				{
					name: '🤖 Bot',
					value: `${emotes.listArrow} v${version}\n${emotes.listArrow} Shard ${interaction.client.shard.ids[0] + 1}/${interaction.client.shard.count}`,
					inline: true,
				},
				{
					name: '🕒 Uptime',
					value: `${emotes.listArrow} ${isPlural(days, 'Day')}, ${isPlural(hours, 'Hour')}, ${isPlural(minutes, 'Minute')}, ${isPlural(seconds, 'Second')}\n${emotes.listArrow} Last Restart: <t:${Math.floor(
						(Date.now() - interaction.client.uptime) / 1000,
					)}:R>`,
				},
			])
			.setFooter({ text: 'Use the bot in your server or DMs by opening the profile and pressing "Add App"' });

		await interaction.editReply({ embeds: [infoEmbed] });
	},
};
