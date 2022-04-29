const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Shows current or future event information.')
		.addBooleanOption(option => option.setName('compact').setDescription('test').setRequired(false)),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading in-game event information...`).setColor('2F3136');

		await interaction.editReply({ embeds: [loadingEmbed] });

		// Options
		const isCompact = interaction.options.getBoolean('compact');

		function compactEmbed(option) {
			return !option ? false : true;
		}

		await axios
			.get(`https://api.apexstats.dev/events`)
			.then(response => {
				const data = response.data.event;

				const preEvent = new MessageEmbed()
					.setTitle(`Countdown to ${data.name}`)
					.setURL(data.assets.link)
					.setDescription(`${data.description}\n\n[Link to Article](${data.assets.link})`)
					.addField('Start Date', `<t:${data.time.startTimestamp}:f>\nor <t:${data.time.startTimestamp}:R>`, true)
					.addField('End Date', `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`, true)
					.setImage(data.assets.image)
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const activeEvent = new MessageEmbed()
					.setTitle(data.name)
					.setURL(data.assets.link)
					.setDescription(`${data.description}\n\n[Link to Article](${data.assets.link})`)
					.addField('Start Date', `<t:${data.time.startTimestamp}:f>`, true)
					.addField('End Date', `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`, true)
					.setImage(data.assets.image)
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const postEvent = new MessageEmbed().setTitle('No Event Active').setDescription('No event is active or upcoming. Check back later for updates!').setColor('2F3136');

				const preEventCompact = new MessageEmbed()
					.setTitle(`Countdown to ${data.name}`)
					.setURL(data.assets.link)
					.addField('Start Date', `<t:${data.time.startTimestamp}:f>\nor <t:${data.time.startTimestamp}:R>`, true)
					.addField('End Date', `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`, true)
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const activeEventCompact = new MessageEmbed()
					.setTitle(data.name)
					.setURL(data.assets.link)
					.setDescription(`[Link to News](${data.assets.link})`)
					.addField('Start Date', `<t:${data.time.startTimestamp}:f>`, true)
					.addField('End Date', `<t:${data.time.endTimestamp}:f>\nor <t:${data.time.endTimestamp}:R>`, true)
					.setColor('2F3136')
					.setFooter({ text: 'Dates are formatted automatically for your timezone.' });

				const postEventCompact = new MessageEmbed()
					.setTitle('No Event Active')
					.setDescription('No event is active or upcoming. Check back later for updates!')
					.setColor('2F3136');

				// 0 = Pre-Event
				// 1 = Event Active
				// 2 = Event Passed
				if (compactEmbed(isCompact) == true) {
					if (data.time.activeState == 0) interaction.editReply({ embeds: [preEventCompact] });
					if (data.time.activeState == 1) interaction.editReply({ embeds: [activeEventCompact] });
					if (data.time.activeState == 2) interaction.editReply({ embeds: [postEventCompact] });
				} else if (compactEmbed(isCompact) == false) {
					if (data.time.activeState == 0) interaction.editReply({ embeds: [preEvent] });
					if (data.time.activeState == 1) interaction.editReply({ embeds: [activeEvent] });
					if (data.time.activeState == 2) interaction.editReply({ embeds: [postEvent] });
				}
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
