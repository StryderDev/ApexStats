const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');
const chalk = require('chalk');

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

		function checkAmount(amount) {
			if (amount == null || amount == undefined) return 1;
			if (amount >= 10) return 10;
			if (amount <= 1) return 1;

			return amount;
		}

		axios
			.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`)
			.then(response => {
				const data = response.data.br;
				const next = data.next;

				function getTime(timestamp) {
					var time = Math.floor(Date.now() / 1000);
					var seconds = timestamp - time;

					var hours = Math.floor(seconds / 3600) % 24;
					var minutes = Math.floor(seconds / 60) % 60;
					var seconds = Math.floor(seconds) % 60;

					return `${hours} hours, ${minutes} minutes`;
				}

				function nextMap(map) {
					return map
						.map(x => `**${x.map}**\nStarts in ${getTime(x.timestamp)} and lasts for ${x.duration}\n\n`)
						.join(``);
				}

				const map = new MessageEmbed()
					.setDescription(
						`The current map is **${data.map}** for ${getTime(data.times.next)}.\nThe next map is **${
							data.next[0].map
						}** for ${data.next[0].duration} minutes.\nThe current ranked map is **${data.ranked.map}**.`,
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
