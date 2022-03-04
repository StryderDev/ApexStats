const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const legends = require('../data/legends.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Shows rank for a specific user.')
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

		const loadingEmbed = new MessageEmbed().setDescription(
			`<a:ApexBot_Loading:940037271980220416> Loading stats for ${username} on ${platformName(platform)}...`,
		);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`)
			.then(response => {
				const data = response.data;

				const brRanked = data.ranked.BR;
				const arenasRanked = data.ranked.Arenas;

				function rankLayout(type, score, name, division, pos) {
					function showDiv(name, div) {
						if (name == 'Master' || name == 'Apex Predator' || name == 'Unranked') return '';

						return div;
					}

					function showPos(name, pos) {
						if (name == 'Apex Predator') return `[#${pos}]`;

						return '';
					}

					return `${showPos(name, pos)} ${name} ${showDiv(
						name,
						division,
					)}\n${score.toLocaleString()} ${type}`;
				}

				const embed = new MessageEmbed()
					.setTitle(`Rank Stats for ${data.user.username} on ${platformName(platform)}`)
					.addField(
						`Battle Royale Ranked`,
						`${rankLayout('RP', brRanked.score, brRanked.name, brRanked.division, brRanked.ladderPos)}`,
						true,
					)
					.addField(
						`Arenas Ranked`,
						`${rankLayout(
							'AP',
							arenasRanked.score,
							arenasRanked.name,
							arenasRanked.division,
							arenasRanked.ladderPos,
						)}`,
						true,
					)
					.setFooter({
						text: `User ID: ${data.user.id} · https://apexstats.dev/`,
					});

				interaction.editReply({ embeds: [embed] });
			})
			.catch(error => {
				// Request failed with a response outside of the 2xx range
				if (error.response) {
					console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);

					interaction.editReply({ content: `**Error**\n\`${error.response.data.error}\``, embeds: [] });
				} else if (error.request) {
					console.log(error.request);
					interaction.editReply({
						content: `**Error**\n\`The request was not returned successfully.\``,
						embeds: [],
					});
				} else {
					console.log(error.message);
					interaction.editReply({
						content: `**Error**\n\`Unknown. Try again or tell SDCore#0001.\``,
						embeds: [],
					});
				}
			});
	},
};
