const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const { platformName, getStatus, rankLayout } = require('./functions/stats.js');

const { Misc, Status, Ranked } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Shows in-game Battle Royale and Arenas rank for a specific user.')
		.addStringOption(option =>
			option
				.setName('platform')
				.setDescription('The platform you play Apex on.')
				.setRequired(true)
				.addChoices({ name: 'PC (Steam / Origin)', value: 'PC' }, { name: 'Xbox', value: 'X1' }, { name: 'PlayStation', value: 'PS4' }),
		)
		.addStringOption(option => option.setName('username').setDescription('Your in-game username.').setRequired(true)),
	async execute(interaction) {
		// Options
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		const loading = new EmbedBuilder().setDescription(`${Misc.Loading} Loading ranked data for ${username} on ${platformName(platform)}...`).setColor('2F3136');

		await interaction.editReply({ embeds: [loading] });

		await axios
			.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`)
			.then(response => {
				const data = response.data;

				// User data
				const user = data.user;
				const status = user.status;

				// Ranked Data
				const ranked = data.ranked;
				const br = ranked.BR;
				const arenas = ranked.Arenas;

				const stats = new EmbedBuilder()
					.setTitle(`Ranked Stats for ${user.username} on ${platformName(platform)}`)
					.setDescription(`**Status**\n${getStatus(status, Status)}`)
					.addFields([
						{
							name: 'Battle Royale Ranked',
							value: rankLayout('RP', br, Ranked),
							inline: true,
						},
						{
							name: 'Arenas Ranked',
							value: rankLayout('AP', arenas, Ranked),
							inline: true,
						},
					])
					//.addField(`Battle Royale Ranked`, `${rankLayout('RP', br, Ranked)}`, true)
					//.addField('Arenas Ranked', `${rankLayout('AP', arenas, Ranked)}`, true)
					.setColor('2F3136')
					.setFooter({ text: `ID: ${data.user.id} · https://apexstats.dev/` })
					.setTimestamp();

				interaction.editReply({ embeds: [stats] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setDescription(`**Lookup Error**\n\`\`\`${error.response.data.error}\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder().setDescription(`**Lookup Error**\n\`\`\`The request was not returned successfully. Try again\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder()
						.setDescription(`**Unknown Error**\n\`\`\`Unknown or uncaught error. Try again or contact SDCore#0001.\`\`\``)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
