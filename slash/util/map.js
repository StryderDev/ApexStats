const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');
const chalk = require('chalk');
const { getTime, nextMap, checkAmount, mapImage } = require('../../functions/map.js');

module.exports = {
	name: 'map',
	description: 'Show current and future map rotations.',

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
		if (!interaction.options.get('amount')) {
			var amount = 1;
		} else {
			var amount = interaction.options.get('amount').value;
		}

		axios
			.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`)
			.then(response => {
				const data = response.data.br;
				const next = data.next;

				const map = new MessageEmbed()
					.setDescription(
						`:map: The current map is **${data.map}** for ${getTime(
							data.times.next,
						)}.\n:clock3: The next map is **${data.next[0].map}** for ${
							data.next[0].duration
						} minutes.\n:fire: The current ranked map is **${data.ranked.map}**.`,
					)
					.setImage(
						`https://cdn.apexstats.dev/ApexStats/Maps/Season_010/BR/${mapImage(data.map)}.gif?q=${version}`,
					)
					.setFooter('Data provided by https://rexx.live/');

				const future = new MessageEmbed()
					.setTitle(`${checkAmount(amount)} Future Map Rotations`)
					.setDescription(nextMap(next));

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
				if (err.response) {
					// Request made and server responded
					console.log(err.response.data);
					console.log(err.response.status);
					console.log(err.response.headers);

					interaction.followUp({ content: `Error: \`${err.response.data.error}\`` });
				} else if (err.request) {
					// The request was made but no response was received
					console.log(err.request);

					interaction.followUp({ content: `Error: \`${err.request}\`` });
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', err.message);
					interaction.followUp({ content: `Error: \`${err.message}\`` });
				}
			});
	},
};
