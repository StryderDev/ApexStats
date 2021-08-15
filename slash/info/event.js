const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const got = require('got');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');
const chalk = require('chalk');

module.exports = {
	name: 'event',
	description: 'Show info about current or upcoming events.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

		got.get(`https://api.apexstats.dev/event`, { responseType: 'json' })
			.then(res => {
				const data = JSON.parse(res.body);

				console.log(chalk`{yellow ${time} Event Command Response Code: ${res.statusCode}}`);

				function checkTime(start, end) {
					// Pre-Event CountDown
					if (start - Math.floor(Date.now() / 1000) >= 0) return 1;

					// After event/No current event
					if (end - Math.floor(Date.now() / 1000) <= 0) return 2;

					// Event is currently running
					return 0;
				}

				const preEvent = new MessageEmbed()
					.setTitle(`[Pre-Event Countdown] ${data.info.name}`)
					.setDescription(`${data.info.description}\n\n[Read Full Post](${data.assets.url})`)
					.addField('Start Date', `<t:${data.dates.start_time}:F>`, true)
					.addField('End Date', `<t:${data.dates.end_time}:F>`, true)
					.addField('Countdown', `The **${data.info.name}** will start <t:${data.dates.start_time}:R>.`)
					.setImage(`${data.assets.image}?q=${version}`);

				const currentEvent = new MessageEmbed()
					.setTitle(data.info.name)
					.setDescription(`${data.info.description}\n\n[Read Full Post](${data.assets.url})`)
					.addField('Start Date', `<t:${data.dates.start_time}:F>`, true)
					.addField('End Date', `<t:${data.dates.end_time}:F>`, true)
					.addField('Countdown', `The **${data.info.name}** will end <t:${data.dates.end_time}:R>.`)
					.setImage(`${data.assets.image}?q=${version}`);

				const noEvent = new MessageEmbed()
					.setTitle(`No Active Event`)
					.setDescription(`There is currently no active event. Check back later!`)
					.setImage('https://cdn.apexstats.dev/Events/NoEvent.png');

				if (checkTime(data.dates.start_time, data.dates.end_time) == 0)
					interaction.followUp({ embeds: [currentEvent] }).catch(err => {
						console.log(err);
						interaction.followUp({ content: `\`${err}\`` });
					});

				if (checkTime(data.dates.start_time, data.dates.end_time) == 1)
					interaction.followUp({ embeds: [preEvent] }).catch(err => {
						console.log(err);
						interaction.followUp({ content: `\`${err}\`` });
					});

				if (checkTime(data.dates.start_time, data.dates.end_time) == 2)
					interaction.followUp({ embeds: [noEvent] }).catch(err => {
						console.log(err);
						interaction.followUp({ content: `\`${err}\`` });
					});
			})
			.catch(err => {
				console.log('Error: ', err);
			});
	},
};
