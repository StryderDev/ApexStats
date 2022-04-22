const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const { api } = require('../../config.json');

const { Misc, serverStatus } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('status').setDescription('Shows current in-game server status.'),
	async execute(interaction) {
		const loading = new MessageEmbed().setDescription(`${Misc.Loading} Loading server status data...`);

		await interaction.editReply({ embeds: [loading] });

		function statusLayout(type) {
			function getEmote(status) {
				if (status == 'UP') return serverStatus.Online;
				if (status == 'SLOW') return serverStatus.Slow;
				if (status == 'DOWN' || status == 'OVERLOADED') return serverStatus.Down;
			}

			return `${getEmote(type['US-East']['Status'])} **US East:** ${type['US-East']['ResponseTime']}ms\n${getEmote(type['US-Central']['Status'])} **US Central:** ${
				type['US-Central']['ResponseTime']
			}ms\n${getEmote(type['US-West']['Status'])} **US West:** ${type['US-West']['ResponseTime']}ms\n${getEmote(type['EU-East']['Status'])} **EU East:** ${
				type['EU-East']['ResponseTime']
			}ms\n${getEmote(type['EU-West']['Status'])} **EU West:** ${type['EU-West']['ResponseTime']}ms\n${getEmote(type['SouthAmerica']['Status'])} **South America:** ${
				type['SouthAmerica']['ResponseTime']
			}ms\n${getEmote(type['Asia']['Status'])} **Asia:** ${type['Asia']['ResponseTime']}ms`;
		}

		await axios
			.get(`https://api.mozambiquehe.re/servers?auth=${api.apex}`)
			.then(response => {
				const data = response.data;

				const origin = data['Origin_login'];
				const apex = data['ApexOauth_Crossplay'];
				const accounts = data['EA_accounts'];
				const novafusion = data['EA_novafusion'];

				const status = new MessageEmbed()
					.setTitle('Apex Legends Server Status')
					.addField('[Crossplay] Apex Login', statusLayout(apex), true)
					.addField('Origin Login', statusLayout(origin), true)
					.addField(`\u200b`, `\u200b`, true)
					.addField('EA Accounts', statusLayout(accounts), true)
					.addField('Lobby & MatchMaking Services', statusLayout(novafusion), true)
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
