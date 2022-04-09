const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const { api } = require('../config.json');

const { Misc } = require('../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('status').setDescription('Shows current in-game server status.'),
	async execute(interaction) {
		const loading = new MessageEmbed().setDescription(`${Misc.Loading} Loading server status data...`);

		await interaction.editReply({ embeds: [loading] });

		await axios
			.get(`https://api.mozambiquehe.re/servers?auth=${api.apex}`)
			.then(response => {
				const data = response.data;

				const origin = data['Origin_login'];
				const apex = data['ApexOauth_Crossplay'];

				const status = new MessageEmbed()
					.setTitle('Status')
					.addField(
						'[Crossplay] Apex Login',
						`**US East:** ${apex['US-East']['ResponseTime']}ms\n**US Central:** ${apex['US-Central']['ResponseTime']}ms\n**US West:** ${apex['US-West']['ResponseTime']}ms\n**EU East:** ${apex['EU-East']['ResponseTime']}ms\n**EU West:** ${apex['EU-West']['ResponseTime']}ms\n**South America:** ${apex['SouthAmerica']['ResponseTime']}ms\n**Asia:** ${apex['Asia']['ResponseTime']}ms`,
						true,
					)
					.setFooter({ text: 'Status data provided by https://apexlegendsstatus.com/' });

				interaction.editReply({ embeds: [status] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new MessageEmbed().setDescription(`**Error**\n\`\`\`${error.response.data.error}\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new MessageEmbed().setDescription(`**Error**\n\`\`\`The request was not returned successfully. Try again\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new MessageEmbed()
						.setDescription(`**Unknown Error**\n\`\`\`Unknown or uncaught error. Try again or contact SDCore#0001.\`\`\``)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
