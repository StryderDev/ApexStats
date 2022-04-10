const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const { api } = require('../config.json');

const { Misc, serverStatus } = require('../data/emotes.json');

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
				const accounts = data['EA_accounts'];
				const novafusion = data['EA_novafusion'];

				function getEmote(status) {
					if (status == 'UP') return serverStatus.Online;
					if (status == 'SLOW') return serverStatus.Slow;
					if (status == 'DOWN' || status == 'OVERLOADED') return serverStatus.Down;
				}

				const status = new MessageEmbed()
					.setTitle('Apex Legends Server Status')
					.addField(
						'[Crossplay] Apex Login',
						`${getEmote(apex['US-East']['Status'])} **US East:** ${apex['US-East']['ResponseTime']}ms\n${getEmote(apex['US-Central']['Status'])} **US Central:** ${
							apex['US-Central']['ResponseTime']
						}ms\n${getEmote(apex['US-West']['Status'])} **US West:** ${apex['US-West']['ResponseTime']}ms\n${getEmote(apex['EU-East']['Status'])} **EU East:** ${
							apex['EU-East']['ResponseTime']
						}ms\n${getEmote(apex['EU-West']['Status'])} **EU West:** ${apex['EU-West']['ResponseTime']}ms\n${getEmote(
							apex['SouthAmerica']['Status'],
						)} **South America:** ${apex['SouthAmerica']['ResponseTime']}ms\n${getEmote(apex['Asia']['Status'])} **Asia:** ${apex['Asia']['ResponseTime']}ms`,
						true,
					)
					.addField(
						'Origin Login',
						`${getEmote(origin['US-East']['Status'])} **US East:** ${origin['US-East']['ResponseTime']}ms\n${getEmote(
							origin['US-Central']['Status'],
						)} **US Central:** ${origin['US-Central']['ResponseTime']}ms\n${getEmote(origin['US-West']['Status'])} **US West:** ${
							origin['US-West']['ResponseTime']
						}ms\n${getEmote(origin['EU-East']['Status'])} **EU East:** ${origin['EU-East']['ResponseTime']}ms\n${getEmote(origin['EU-West']['Status'])} **EU West:** ${
							origin['EU-West']['ResponseTime']
						}ms\n${getEmote(origin['SouthAmerica']['Status'])} **South America:** ${origin['SouthAmerica']['ResponseTime']}ms\n${getEmote(
							origin['Asia']['Status'],
						)} **Asia:** ${origin['Asia']['ResponseTime']}ms`,
						true,
					)
					.addField(`\u200b`, `\u200b`, true)
					.addField(
						'EA Accounts',
						`${getEmote(accounts['US-East']['Status'])} **US East:** ${accounts['US-East']['ResponseTime']}ms\n${getEmote(
							accounts['US-Central']['Status'],
						)} **US Central:** ${accounts['US-Central']['ResponseTime']}ms\n${getEmote(accounts['US-West']['Status'])} **US West:** ${
							accounts['US-West']['ResponseTime']
						}ms\n${getEmote(accounts['EU-East']['Status'])} **EU East:** ${accounts['EU-East']['ResponseTime']}ms\n${getEmote(
							accounts['EU-West']['Status'],
						)} **EU West:** ${accounts['EU-West']['ResponseTime']}ms\n${getEmote(accounts['SouthAmerica']['Status'])} **South America:** ${
							accounts['SouthAmerica']['ResponseTime']
						}ms\n${getEmote(accounts['Asia']['Status'])} **Asia:** ${accounts['Asia']['ResponseTime']}ms`,
						true,
					)
					.addField(
						'EA Novafusion',
						`${getEmote(novafusion['US-East']['Status'])} **US East:** ${novafusion['US-East']['ResponseTime']}ms\n${getEmote(
							novafusion['US-Central']['Status'],
						)} **US Central:** ${novafusion['US-Central']['ResponseTime']}ms\n${getEmote(novafusion['US-West']['Status'])} **US West:** ${
							novafusion['US-West']['ResponseTime']
						}ms\n${getEmote(novafusion['EU-East']['Status'])} **EU East:** ${novafusion['EU-East']['ResponseTime']}ms\n${getEmote(
							novafusion['EU-West']['Status'],
						)} **EU West:** ${novafusion['EU-West']['ResponseTime']}ms\n${getEmote(novafusion['SouthAmerica']['Status'])} **South America:** ${
							novafusion['SouthAmerica']['ResponseTime']
						}ms\n${getEmote(novafusion['Asia']['Status'])} **Asia:** ${novafusion['Asia']['ResponseTime']}ms`,
						true,
					)
					.addField(`\u200b`, `\u200b`, true)
					.setFooter({ text: 'Status data provided by https://apexlegendsstatus.com/' });

				// origin xbl psn
				// ea ccount
				// ea novafusion

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
