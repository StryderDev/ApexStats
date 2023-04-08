const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { api } = require('../../config.json');
const { embedColor, Emotes } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('threshold').setDescription('Shows the current Apex Predator RP Threshold for Battle Royale.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Fetching RP Threshold...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.mozambiquehe.re/predator?auth=${api.als}`)
			.then(async response => {
				const data = response.data;

				const thresholdEmbed = new EmbedBuilder()
					.setTitle('Apex Predator RP Threshold')
					.addFields([
						{
							name: `${Emotes.Misc.Platform_PC} PC (Steam / EA App)`,
							value: `${Emotes.Misc.GrayBlank} Threshold: ${data['RP']['PC']['val'].toLocaleString()} RP\n${Emotes.Misc.GrayBlank} Player Count: ${data['RP']['PC'][
								'totalMastersAndPreds'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: `${Emotes.Misc.Platform_PlayStation} PlayStation`,
							value: `${Emotes.Misc.GrayBlank} Threshold: ${data['RP']['PS4']['val'].toLocaleString()} RP\n${Emotes.Misc.GrayBlank} Player Count: ${data['RP']['PS4'][
								'totalMastersAndPreds'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: `${Emotes.Misc.Platform_Xbox} Xbox`,
							value: `${Emotes.Misc.GrayBlank} Threshold: ${data['RP']['X1']['val'].toLocaleString()} RP\n${Emotes.Misc.GrayBlank} Player Count: ${data['RP']['X1'][
								'totalMastersAndPreds'
							].toLocaleString()}`,
							inline: true,
						},
						{
							name: `${Emotes.Misc.Platform_Switch} Nintendo Switch`,
							value: `${Emotes.Misc.GrayBlank} Threshold: ${data['RP']['SWITCH']['val'].toLocaleString()} RP\n${Emotes.Misc.GrayBlank} Player Count: ${data['RP'][
								'SWITCH'
							]['totalMastersAndPreds'].toLocaleString()}`,
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
					])
					.setColor(embedColor)
					.setFooter({ text: 'RP Threshold data provided by https://apexlegendsstatus.com.' });

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
