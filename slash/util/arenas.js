const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const got = require('got');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');
const chalk = require('chalk');
const { nextMap, checkAmount, mapImage } = require('../../functions/map.js');

module.exports = {
	name: 'arenas',
	description: 'Show current and future arenas rotations.',

	options: [
		{
			name: 'amount',
			description: 'The number of future rotations you want to see (up to 10).',
			type: 'INTEGER',
			required: false,
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

		if (!interaction.options.get('amount')) {
			var amount = 1;
		} else {
			var amount = interaction.options.get('amount').value;
		}

		got.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`, { responseType: 'json' })
			.then(res => {
				const data = JSON.parse(res.body);
				const next = data.arenas.next;

				console.log(chalk`{yellow ${time} Map Command Response Code: ${res.statusCode}}`);

				const map = new MessageEmbed()
					.setDescription(
						`:map: The current arena is **${data.arenas.map}** and ends <t:${data.arenas.times.next}:R>.\n:clock3: The next arena is **${data.arenas.next[0].map}** for ${data.arenas.next[0].duration} minutes.`,
					)
					.setImage(
						`https://cdn.apexstats.dev/ApexStats/Maps/Season_010/Arenas/${mapImage(
							data.arenas.map,
						)}.gif?q=${version}`,
					)
					.setFooter('Data provided by https://rexx.live/');

				const future = new MessageEmbed()
					.setTitle(`${checkAmount(amount)} Future Arena Rotations`)
					.setDescription(nextMap(next))
					.setFooter('Hover over the times to get an exact time in your timezone!');

				if (checkAmount(amount) > 1) {
					interaction.followUp({ embeds: [future] }).catch(err => {
						console.log(err);
						interaction.followUp({ content: `\`${err}\`` });
					});
				} else {
					interaction.followUp({ embeds: [map] }).catch(err => {
						console.log(err);
						interaction.followUp({ content: `\`${err}\`` });
					});
				}
			})
			.catch(err => {
				console.log('Error: ', err);
			});
	},
};
