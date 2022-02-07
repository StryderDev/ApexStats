const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows stats for a specific user.')
		.addStringOption(option =>
			option
				.setName('platform')
				.setDescription('The platform that you play Apex on.')
				.setRequired(true)
				.addChoice('PC (Steam/Origin)', 'PC')
				.addChoice('Xbox', 'X1')
				.addChoice('PlayStation', 'PS4'),
		)
		.addStringOption(option =>
			option.setName('username').setDescription('Your in-game username.').setRequired(true),
		),
	async execute(interaction) {
		// Options
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		function platformName(platform) {
			if (platform == 'X1') return 'Xbox';
			if (platform == 'PS4') return 'PlayStation';

			return platform;
		}

		await interaction.reply(
			`<a:ApexBot_Loading:940037271980220416> Loading stats for ${username} on ${platformName(platform)}...`,
		);

		await axios
			.get('https://api.apexstats.dev/stats?platform=PC&player=SDCore')
			.then(response => {
				response.toJSON();
			})
			.then(json => {
				const embed = new MessageEmbed().setTitle('Response').setDescription(`response: ${json}`);

				interaction.editReply({ embeds: [embed] });
			});
	},
};
