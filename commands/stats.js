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
			.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`)
			.then(response => {
				const data = response.data;

				const brRanked = data.ranked.BR;
				const arenasRanked = data.ranked.Arenas;
				const trackers = data.active.trackers;
				const legend = data.active.legend;

				function bpLevel(battlepass) {
					if (!battlepass.history) {
						if (battlepass.level > 110) return 110;

						return battlepass.level;
					}

					if (battlepass.history.season12 > 111) return 110;

					return battlepass.history.season12;
				}

				function trackerID(legend, id) {
					const legendName = require('../data/legends.json');

					if (id == '1905735931') return 'No Data';

					const legendTracker = require(`../data/trackers/${legendName[legend]}.json`);

					if (legendTracker[id] == 'undefined' || legendTracker[id] == null) return id;

					return legendTracker[id];
				}

				function trackerValue(id, value) {
					if (id == '1905735931') return '-';

					return value.toLocaleString();
				}

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
					.setTitle(
						`<:BlackDot:909363272447311872> Stats for ${data.user.username} on ${platformName(
							platform,
						)} playing ${legends[legend]}`,
					)
					.addField(
						`Account`,
						`Level ${data.account.level.toLocaleString()}\n\n**Battle Royale Ranked**\n${rankLayout(
							'RP',
							brRanked.score,
							brRanked.name,
							brRanked.division,
							brRanked.ladderPos,
						)}`,
						true,
					)
					.addField(
						`Defiance Battle Pass`,
						`Level ${bpLevel(data.account.battlepass)}\n\n**Arenas Ranked**\n${rankLayout(
							'AP',
							arenasRanked.score,
							arenasRanked.name,
							arenasRanked.division,
							arenasRanked.ladderPos,
						)}`,
						true,
					)
					.addField(`\u200b`, '**Current Equipped Trackers**')
					.addField(
						`${trackerID(legend, trackers[0].id)}`,
						`${trackerValue(trackers[0].id, trackers[0].value)}`,
						true,
					)
					.addField(
						`${trackerID(legend, trackers[1].id)}`,
						`${trackerValue(trackers[1].id, trackers[1].value)}`,
						true,
					)
					.addField(
						`${trackerID(legend, trackers[2].id)}`,
						`${trackerValue(trackers[2].id, trackers[2].value)}`,
						true,
					)
					.setImage(
						`https://cdn.apexstats.dev/LegendBanners/${encodeURIComponent(
							legends[data.active.legend],
						)}.png`,
					)
					.setFooter({
						text: `User ID: ${data.user.id} · https://apexstats.dev/\nBattle Pass level incorrect? Equip the badge in-game!`,
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
