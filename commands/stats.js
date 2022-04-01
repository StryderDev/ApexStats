const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const legends = require('../data/legends.json');
const { Season } = require('../data/icons.json');

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
		.addStringOption(option => option.setName('username').setDescription('Your in-game username.').setRequired(true)),
	async execute(interaction) {
		// Options
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		function platformName(platform) {
			if (platform == 'X1') return 'Xbox';
			if (platform == 'PS4') return 'PlayStation';

			return platform;
		}

		const loadingEmbed = new MessageEmbed().setDescription(`<a:ApexStats_Loading:940037271980220416> Loading stats for ${username} on ${platformName(platform)}...`);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`)
			.then(response => {
				const data = response.data;

				const brRanked = data.ranked.BR;
				const arenasRanked = data.ranked.Arenas;
				const trackers = data.active.trackers;
				const legend = data.active.legend;
				const status = data.user.status;

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
					const globalTrackers = require('../data/globalTrackers.json');

					function textCheck(text) {
						return text ? text : '';
					}

					function emoteCheck(emote, icons) {
						if (emote != null && emote != 'undefined' && emote.length != 0) {
							return icons[emote];
						} else {
							return '';
						}
					}

					if (globalTrackers[id] == null || globalTrackers[id] == 'undefined') {
						// If the tracker ID doesn't exist in the global trackers file, check
						// the legend specific tracker file
						if (legendTracker[id] == null || legendTracker[id] == 'undefined') {
							// If the tracker ID doesn't exist in the global or legend tracker
							// files, just return the ID of the tracker
							return id;
						} else {
							return `${emoteCheck(legendTracker[id].Emote, Season)} ${textCheck(legendTracker[id].Type)} ${legendTracker[id].Name}`;
						}
					} else {
						return globalTrackers[id];
					}
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

					return `${showPos(name, pos)} ${name} ${showDiv(name, division)}\n${score.toLocaleString()} ${type}`;
				}

				function getStatus(status) {
					// Status Emotes
					const offline = '<:ApexStats_BlackDot:955005604248838145>';
					const online = '<:ApexStats_GreenDot:955008202116845568>';
					const inMatch = '<:ApexStats_YellowDot:955008542862110760>';

					seconds = Math.floor(status.matchLength % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
					minutes = Math.floor(status.matchLength / 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });

					if (status.online == 1 && status.ingame == 0) {
						if (status.matchLength != -1) return `${online} Lobby (${minutes}:${seconds})`;

						return `${online} Online (Lobby)`;
					}

					if (status.online == 1 && status.ingame == 1) {
						if (status.matchLength != -1) return `${inMatch} In a Match (${minutes}:${seconds})`;

						return `${inMatch} In a Match`;
					}

					return `${offline} Offline / Invite Only`;
				}

				// Emotes
				const accountLevel = '<:ApexStats_AccountLevel:909364972943999016>';
				const battlePass = '<:ApexStats_Season12BP:955001758315323432>';

				// Stats Embed
				const embed = new MessageEmbed()
					.setTitle(`Stats for ${data.user.username} on ${platformName(platform)} playing ${legends[legend]}`)
					.setDescription(`**Status**\n${getStatus(status)}`)
					.addField(
						`Account`,
						`${accountLevel} Level ${data.account.level.toLocaleString()}\n\n**Battle Royale Ranked**\n${rankLayout(
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
						`${battlePass} Level ${bpLevel(data.account.battlepass)}\n\n**Arenas Ranked**\n${rankLayout(
							'AP',
							arenasRanked.score,
							arenasRanked.name,
							arenasRanked.division,
							arenasRanked.ladderPos,
						)}`,
						true,
					)
					.addField(`\u200b`, '**Current Equipped Trackers**')
					.addField(`${trackerID(legend, trackers[0].id)}`, `${trackerValue(trackers[0].id, trackers[0].value)}`, true)
					.addField(`${trackerID(legend, trackers[1].id)}`, `${trackerValue(trackers[1].id, trackers[1].value)}`, true)
					.addField(`${trackerID(legend, trackers[2].id)}`, `${trackerValue(trackers[2].id, trackers[2].value)}`, true)
					.setImage(`https://cdn.apexstats.dev/Bot/Legends/Banners/${encodeURIComponent(legends[data.active.legend])}.png`)
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
