const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const legends = require('../data/legends.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Show your in-game stats!')
		.addStringOption(option =>
			option
				.setName('platform')
				.setDescription('The platform you play Apex on.')
				.setRequired(true)
				.addChoices([
					['PC (Steam/Origin)', 'PC'],
					['Xbox (Xbox One, Xbox Series X)', 'X1'],
					['PlayStation (PS4/PS5)', 'PS4'],
				]),
		)
		.addStringOption(option => option.setName('username').setDescription('In-game username.').setRequired(true)),
	async execute(client, interaction) {
		const username = interaction.options.getString('username');
		const platform = interaction.options.getString('platform');

		function platformName(platform) {
			if (platform == 'X1') return 'Xbox';
			if (platform == 'PS4') return 'PlayStation';

			return platform;
		}

		function findLegendByID(id) {
			const legend = legends[id];

			if (!legend) return 'Unknown';

			return legend.Name;
		}

		function trackerTitle(id, legend) {
			const tracker = require(`../data/trackers/${legend}.json`);

			if (id == '1905735931') return 'No Data';

			if (!tracker || !tracker[id]) return id.toString();

			return tracker[id]['Name'];
		}

		function trackerValue(id, value) {
			if (id == '1905735931') return '-';

			return value.toLocaleString();
		}

		function userRank(name, division, pos) {
			if (name == 'Apex Predator') return `**[#${pos}] Apex Predator**`;

			return `${name} ${division}`;
		}

		const loadingEmbed = new MessageEmbed().setDescription('Loading your stats...');

		await interaction.reply({ embeds: [loadingEmbed] });

		axios
			.get(`https://api.apexstats.dev/stats?player=${username}&platform=${platform}`)
			.then(res => {
				const data = res.data;

				const username = data.user.username;

				const statsEmbed = new MessageEmbed()
					.setTitle(`Stats for ${username} on ${platformName(platform)}`)
					.setDescription(
						`**Battle Royale Rank:** ${userRank(
							data.ranked.BR.name,
							data.ranked.BR.division,
							data.ranked.BR.ladderPos,
						)} (${data.ranked.BR.score.toLocaleString()} RP)\n**Arenas Ranked:** ${userRank(
							data.ranked.Arenas.name,
							data.ranked.Arenas.division,
							data.ranked.Arenas.ladderPos,
						)} (${data.ranked.Arenas.score.toLocaleString()} AP)\n\n**Currently Selected Trackers**`,
					)
					.addField(
						`${trackerTitle(data.active.trackers[0].id, findLegendByID(data.active.legend))}`,
						`${trackerValue(data.active.trackers[0].id, data.active.trackers[0].value)}`,
						true,
					)
					.addField(
						`${trackerTitle(data.active.trackers[1].id, findLegendByID(data.active.legend))}`,
						`${trackerValue(data.active.trackers[1].id, data.active.trackers[1].value)}`,
						true,
					)
					.addField(
						`${trackerTitle(data.active.trackers[2].id, findLegendByID(data.active.legend))}`,
						`${trackerValue(data.active.trackers[2].id, data.active.trackers[2].value)}`,
						true,
					)
					.setImage(`https://cdn.apexstats.dev/LegendBanners/${findLegendByID(data.active.legend)}.png`)
					.setTimestamp();

				interaction.editReply({ embeds: [statsEmbed] });
				console.log(`Found stats for ${username} on ${platformName(platform)}`);
			})
			.catch(err => {
				if (err) console.log('Err', err.response);

				if (err.response) {
					if (err.response.data) {
						const errorEmbed = new MessageEmbed().setTitle(`${err.response.data.error}`).setTimestamp();

						interaction.editReply({ embeds: [errorEmbed] });
					} else {
						const errorEmbed = new MessageEmbed().setTitle(`${err.response}`).setTimestamp();

						interaction.editReply({ embeds: [errorEmbed] });
					}
				} else {
					const errorEmbed = new MessageEmbed().setTitle(`${err}!`).setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
