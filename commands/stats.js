const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const legends = require('../data/legends.json');

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

		const loadingEmbed = new MessageEmbed().setDescription(
			`<a:ApexBot_Loading:940037271980220416> Loading stats for ${username} on ${platformName(platform)}...`,
		);

		await interaction.reply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.apexstats.dev/stats?platform=PC&player=${decodeURIComponent(username)}`)
			.then(response => {
				const data = response.data;

				const ranked = data.ranked;
				const trackers = data.active.trackers;

				const embed = new MessageEmbed()
					.setTitle(
						`<:BlackDot:909363272447311872> Stats for ${data.user.username} on ${platformName(platform)}`,
					)
					.addField(
						`Account`,
						`Level ${data.account.level.toLocaleString()}\n\n**Battle Royale Ranked**\n[#${
							ranked.BR.ladderPos
						}] ${ranked.BR.name} ${ranked.BR.division} (${ranked.BR.score.toLocaleString()} RP)`,
						true,
					)
					.addField(
						`Escape BattlePass`,
						`Level ${data.account.battlepass.level}\n\n**Arenas Ranked**\n[#${ranked.Arenas.ladderPos}] ${
							ranked.Arenas.name
						} ${ranked.Arenas.division} (${ranked.Arenas.score.toLocaleString()} AP)`,
						true,
					)
					.addField(`\u200b`, '**Current Equipped Trackers**')
					.addField(`${trackers[0].id}`, `${trackers[0].value}`, true)
					.addField(`${trackers[1].id}`, `${trackers[1].value}`, true)
					.addField(`${trackers[2].id}`, `${trackers[2].value}`, true)
					.setImage(`https://cdn.apexstats.dev/LegendBanners/${legends[data.active.legend]}.png`)
					.setFooter({
						text: `UserID: ${data.user.id} · https://apexstats.dev/`,
					});

				interaction.editReply({ embeds: [embed] });
			})
			.catch(error => {
				// Request failed with a response outside of the 2xx range
				if (error.response) {
					console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);

					interaction.editReply({ content: `Error: ${error.response.data.error}`, embeds: [] });
				} else if (error.request) {
					console.log(error.request);
					interaction.editReply({ content: `Error: The request was not returned successfully.`, embeds: [] });
				} else {
					console.log(error.message);
					interaction.editReply({ content: `Error: Unknown. Try again or tell SDCore#0001.`, embeds: [] });
				}
			});
	},
};
