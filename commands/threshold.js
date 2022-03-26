const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const legends = require('../data/legends.json');

module.exports = {
	data: new SlashCommandBuilder().setName('threshold').setDescription('Shows the Apex Predator threshold for PC, PlayStation, and Xbox.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`<a:ApexStats_Loading:940037271980220416> Gathering data for Apex Predator threshold...`);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.apexstats.dev/minPred`)
			.then(response => {
				const data = response.data;

				const season = data.season;
				const PC = data.PC;
				const PS4 = data.PS4;
				const X1 = data.X1;

				const embed = new MessageEmbed()
					.setTitle(`Apex Predator Threshold for Apex Legends: ${season.name} Split ${season.split}`)
					.addField(
						'Battle Royale',
						`PC (Steam/Origin): ${PC.min_BR_RP.toLocaleString()} RP\nPlayStation: ${PS4.min_BR_RP.toLocaleString()} RP\nXbox: ${X1.min_BR_RP.toLocaleString()} RP\n`,
						true,
					)
					.addField(
						'Arenas',
						`PC (Steam/Origin): ${PC.min_AR_AP.toLocaleString()} AP\nPlayStation: ${PS4.min_AR_AP.toLocaleString()} AP\nXbox: ${X1.min_AR_AP.toLocaleString()} AP\n`,
						true,
					)
					.setFooter({ text: 'Data updated hourly.\nThis is an approximation and may not be entirely accurate.' });

				interaction.editReply({ embeds: [embed] });
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
