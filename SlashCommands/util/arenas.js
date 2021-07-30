const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { DateTime, Duration } = require('luxon');
const { version } = require('../../package.json');

module.exports = {
	name: 'arenas',
	description: 'Show current and future arenas rotations.',

	options: [
		{
			name: 'amount',
			description: 'Amount of future arenas rotations',
			type: 'INTEGER',
			required: false,
		},
	],

	run: async (client, interaction) => {
		// Args
		const amount = interaction.options.get('amount');

		function checkAmount(amount) {
			if (amount == null || amount == undefined) return '1';

			if (amount.value > 10) return '10';

			return amount.value;
		}

		const pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;

		function getTime(time) {
			var now = DateTime.local();
			var nowSeconds = Math.floor(DateTime.local().toSeconds());
			var math = time - nowSeconds;
			var future = DateTime.local().plus({ seconds: math + 60 });

			var timeUntil = future.diff(now, ['hours', 'minutes', 'seconds']);

			var time = timeUntil.toObject();

			return `${pluralize(time.hours, 'hour')}, ${pluralize(time.minutes, 'minute')}`;
		}

		function removeSpaces(string) {
			return string.replace(/ /g, '');
		}

		axios.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`).then(result => {
			var map = result.data.arenas;
			var next = map.next;

			function nextMaps() {
				return next
					.map(
						x =>
							`**${x.map}**\nStarts in ${getTime(x.timestamp)} and lasts for ${Duration.fromMillis(
								x.duration * 60 * 1000,
							).toFormat("h'h,' m'm.")}\n\n`,
					)
					.join(``);
			}

			const current = new MessageEmbed()
				.setDescription(
					`:map: The current map is **${map.map}** for ${getTime(
						map.times.next,
					)}.\n:clock3: The next map is **${next[0].map}** and lasts for ${Duration.fromMillis(
						next[0].duration * 60 * 1000,
					).toFormat("h'h,' m'm.'")}`,
				)
				.setImage(
					`https://cdn.apexstats.dev/Maps/Season%209/Arena_${removeSpaces(map.map)}_01.gif?v=${version}`,
				)
				.setFooter('Provided by https://rexx.live/');

			const future = new MessageEmbed()
				.setDescription(`**${checkAmount(amount)} Future Map Rotations**\n\n${nextMaps()}`)
				.setFooter('Provided by https://rexx.live/');

			if (checkAmount(amount) == 1) {
				interaction.followUp({ embeds: [current] });
			} else {
				interaction.followUp({ embeds: [future] });
			}
		});
	},
};