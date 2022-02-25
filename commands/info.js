const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { release } = require('../config.json');
const { version } = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder().setName('info').setDescription('Shows info about the bot.'),
	async execute(interaction) {
		const info = new MessageEmbed()
			.setTitle('Apex Legends Stats Bot')
			.setDescription('Legend stats, map info, and random legend picker.')
			.addField('Version', `v${version} "${release.name}"`, true)
			.addField(
				'Links',
				'[GitHub](https://github.com/sdcore/apex-stats-bot)\n[Support Server](https://discord.gg/eH8VxssFW6)',
				true,
			);

		await interaction.editReply({ embeds: [info] });
	},
};
