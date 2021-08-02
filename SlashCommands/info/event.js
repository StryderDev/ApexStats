const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json');
const { DateTime } = require('luxon');

module.exports = {
	name: 'event',
	description: 'Show current event information.',

	run: async (client, interaction) => {
		axios.get(`https://api.apexstats.dev/event`).then(result => {
			var event = result.data;

			function checkTime() {
				// Pre-Event CountDown
				if (event.dates.start_time - Math.floor(Date.now() / 1000) >= 0) return 1;

				// After event/No current event
				if (event.dates.end_time - Math.floor(Date.now() / 1000) <= 0) return 2;

				// Event is currently running
				return 0;
			}

			function formatDate(timestamp) {
				return DateTime.fromSeconds(timestamp, { zone: 'America/Los_Angeles' }).toFormat(
					'cccc LLL dd, yyyy\nhh:mm a ZZZZ',
				);
			}

			function countdownURL(timestamp) {
				var time = DateTime.fromSeconds(timestamp).toFormat('hh:mma_d_LLLL_yyyy');

				return `[Countdown in Your Timezone](https://time.is/countdown/${time})`;
			}

			// I don't want to change it in fear of breaking it,
			// but maybe make this... better? in the future?
			function time(milliseconds) {
				var currentDate = DateTime.local();
				var fixMilliseconds = milliseconds + 6000;
				var futureDate = DateTime.local().plus({
					milliseconds: fixMilliseconds,
				});

				var timeTill = futureDate.diff(currentDate, ['days', 'hours', 'minutes', 'seconds']);

				var finalTime = timeTill.toObject();

				const pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;

				return `${pluralize(finalTime.days, 'day')}, ${pluralize(finalTime.hours, 'hour')}, ${pluralize(
					finalTime.minutes,
					'minute',
				)}.`;
			}

			const preEventEmbed = new MessageEmbed()
				.setTitle(`[Pre-Event Countdown] ${event.info.name}`)
				.setDescription(`${event.info.description}\n\n[Read Full Post](${event.assets.url})`)
				.addField(
					'Start Date',
					`${formatDate(event.dates.start_time)}\n${countdownURL(event.dates.start_time)}`,
					true,
				)
				.addField(
					'End Date',
					`${formatDate(event.dates.end_time)}\n${countdownURL(event.dates.end_time)}`,
					true,
				)
				.addField(
					'Countdown',
					`The **${event.info.name}** will start in ${time(event.dates.start_time * 1000 - Date.now())}`,
				)
				.setImage(`${event.assets.image}?q=${version}`);

			const currentEventEmbed = new MessageEmbed()
				.setTitle(event.info.name)
				.setDescription(`${event.info.description}\n\n[Read Full Post](${event.assets.url})`)
				.addField('Start Date', `${formatDate(event.dates.start_time)}`, true)
				.addField(
					'End Date',
					`${formatDate(event.dates.end_time)}\n${countdownURL(event.dates.end_time)}`,
					true,
				)
				.addField(
					'Countdown',
					`The **${event.info.name}** will end in ${time(event.dates.end_time * 1000 - Date.now())}`,
				)
				.setImage(`${event.assets.image}?q=${version}`);

			const noEventEmbed = new MessageEmbed()
				.setTitle(`No Active Event`)
				.setDescription(`There is currently no active event. Check back later!`)
				.setImage('https://cdn.apexstats.dev/Events/NoEvent.png');

			if (checkTime() == 0) interaction.followUp({ embeds: [currentEventEmbed] });

			if (checkTime() == 1) interaction.followUp({ embeds: [preEventEmbed] });

			if (checkTime() == 2) interaction.followUp({ embeds: [noEventEmbed] });
		});
	},
};
