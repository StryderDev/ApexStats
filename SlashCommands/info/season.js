const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');

module.exports = {
	name: 'season',
	description: 'Show current and previous season information.',

	options: [
		{
			name: 'season',
			description: 'Select a season.',
			type: 'STRING',
			required: true,
			choices: [
				{
					name: 'Pre-Season (Season 0)',
					value: '000',
				},
				{
					name: 'Season 1 - The Wild Frontier',
					value: '001',
				},
				{
					name: 'Season 2 - Battle Charge',
					value: '002',
				},
				{
					name: 'Season 3 - Meltdown',
					value: '003',
				},
				{
					name: 'Season 4 - Assimilation',
					value: '004',
				},
				{
					name: "Season 5 - Fortune's Favor",
					value: '005',
				},
				{
					name: 'Season 6 - Boosted',
					value: '006',
				},
				{
					name: 'Season 7 - Ascension',
					value: '007',
				},
				{
					name: 'Season 8 - Mayhem',
					value: '008',
				},
				{
					name: 'Legacy',
					value: '009',
				},
				{
					name: 'Emergence',
					value: '010',
				},
			],
		},
	],

	run: async (client, interaction) => {
		// Args
		const seasonNumber = interaction.options.get('season');

		function isWhiteSpace(text) {
			return ' \t\n'.includes(text);
		}

		function isPunct(text) {
			return ';:.,?!-\'"(){}'.includes(text);
		}

		function compress(string) {
			return string
				.split('')
				.filter(char => !isWhiteSpace(char) && !isPunct(char))
				.join('');
		}

		axios.get(`https://api.apexstats.dev/season?id=${seasonNumber.value}`).then(result => {
			var season = result.data;

			const seasonEmbed = new MessageEmbed()
				.setTitle(`Apex Legends Season ${season.info.number} - ${season.info.title}`)
				.setThumbnail(`https://cdn.apexstats.dev/SeasonIcons/Season_${season.info.number}.png?q=${version}`)
				.setDescription(`${season.info.description}\n\n[Read More](${season.info.link})`)
				.addField(
					'Dates',
					`**Start:** ${DateTime.fromSeconds(season.info.start_date, {
						zone: 'America/Los_Angeles',
					}).toFormat("cccc, LLLL dd, y 'at' hh:mm a ZZZZ")}\n**End:** ${DateTime.fromSeconds(
						season.info.end_date,
						{
							zone: 'America/Los_Angeles',
						},
					).toFormat("cccc, LLLL dd, y 'at' hh:mm a ZZZZ")}`,
					false,
				)
				.addField('Featured Map', season.data.map, true)
				.addField('Legend Debut', season.data.legend, true)
				.addField('Weapon Debut', season.data.weapon, true)
				.addField(
					'Trailers',
					`${season.trailers.StoriesFromTheOutlands}\n${season.trailers.Launch}\n${season.trailers.Gameplay}\n${season.trailers.Character}\n${season.trailers.BattlePass}`,
				)
				.setImage(`https://cdn.apexstats.dev/Maps/SeasonList/${compress(season.data.map)}.png?q=${version}`);

			interaction.followUp({ embeds: [seasonEmbed] });
		});
	},
};
