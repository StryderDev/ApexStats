const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { als_token } = require('../../config.json');
const { embedColor, Emotes } = require('../../data/utilities.json');
const { statusLayout, statusCount, statusColor } = require('../../utilities/status.js');

module.exports = {
	data: new SlashCommandBuilder().setName('status').setDescription('Shows the status of login and matchmaking servers. Not always indicative of server status.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Fetching Apex server status...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.mozambiquehe.re/servers?auth=${als_token}`)
			.then(async response => {
				const status = response.data;

				// Server Categories
				const apex = status['ApexOauth_Crossplay'];
				const eaLogin = status['Origin_login'];
				const eaAccounts = status['EA_accounts'];
				const eaNovafusion = status['EA_novafusion'];

				const statusEmbed = new EmbedBuilder()
					.setTitle('Apex Legends Server Status')
					.addFields([
						{
							name: '[Crossplay] Apex Login',
							value: statusLayout(apex),
							inline: true,
						},
						{
							name: 'EA Login',
							value: statusLayout(eaLogin),
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: 'EA Accounts',
							value: statusLayout(eaAccounts),
							inline: true,
						},
						{
							name: 'Lobby & Matchmaking Services',
							value: statusLayout(eaNovafusion),
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
					])
					.setColor(statusColor(statusCount(apex) + statusCount(eaLogin) + statusCount(eaAccounts) + statusCount(eaNovafusion)))
					.setFooter({ text: 'Status data provided by https://apexlegendsstatus.com\nNot always indicative of server status.' });

				await interaction.editReply({ embeds: [statusEmbed] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('Server Status Lookup Failed').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

					axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Site Lookup Error')
						.setDescription(`The request was not returned successfully.\nThis is potentially an error with the API.\nPlease try again shortly.`)
						.setColor('D0342C')
						.setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Unknown Error')
						.setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
