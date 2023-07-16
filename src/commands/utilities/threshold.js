const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('threshold').setDescription('Shows the current Apex Predator LP Threshold for ranked.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Fetching LP Threshold...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.jumpmaster.xyz/misc/predThreshold`)
			.then(async response => {
				const data = response.data;

				const thresholdEmbed = new EmbedBuilder()
					.setTitle('Apex Predator Ladder Point Threshold')
					.setDescription(`**Last Updated:** <t:${data['timestamp']}:R>`)
					.addFields([
						{
							name: `${Misc.Platform_PC} PC (Steam / EA App)`,
							value: `${Misc.GrayBlank} Threshold: ${data['PC']['value'].toLocaleString()} LP\n${Misc.GrayBlank} Player Count: ${data['PC'][
								'count'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: `${Misc.Platform_PlayStation} PlayStation`,
							value: `${Misc.GrayBlank} Threshold: ${data['Playstation']['value'].toLocaleString()} LP\n${Misc.GrayBlank} Player Count: ${data['Playstation'][
								'count'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: `${Misc.Platform_Xbox} Xbox`,
							value: `${Misc.GrayBlank} Threshold: ${data['Xbox']['value'].toLocaleString()} LP\n${Misc.GrayBlank} Player Count: ${data['Xbox'][
								'count'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: `${Misc.Platform_Switch} Nintendo Switch`,
							value: `${Misc.GrayBlank} Threshold: ${data['Switch']['value'].toLocaleString()} LP\n${Misc.GrayBlank} Player Count: ${data['Switch'][
								'count'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
					])
					.setColor(embedColor)
					.setFooter({
						text: 'LP Threshold data provided by https://apexlegendsstatus.com.\nAs of Season 17 (Arsenal), "Ranked Points" are now "Ladder Points" or "LP".',
					});

				await interaction.editReply({ embeds: [thresholdEmbed] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('RP Threshold Lookup Failed').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

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
