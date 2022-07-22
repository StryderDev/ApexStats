const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const { api } = require('../../config.json');

const { Misc, serverStatus } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('status').setDescription('Shows current in-game server status.'),
	async execute(interaction) {
		const loading = new EmbedBuilder().setDescription(`${Misc.Loading} Loading server status data...`).setColor('2F3136');

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

		function checkStatus(status) {
			if (status['EU-West'].Status != 'UP') EUWest = 1;
			else var EUWest = 0;

			if (status['EU-East'].Status != 'UP') var EUEast = 1;
			else var EUEast = 0;

			if (status['US-West'].Status != 'UP') var USWest = 1;
			else var USWest = 0;

			if (status['US-East'].Status != 'UP') var USEast = 1;
			else var USEast = 0;

			if (status['US-Central'].Status != 'UP') var USCentral = 1;
			else var USCentral = 0;

			if (status['SouthAmerica'].Status != 'UP') var SouthAmerica = 1;
			else var SouthAmerica = 0;

			if (status['Asia'].Status != 'UP') var Asia = 1;
			else var Asia = 0;

			return EUWest + EUEast + USWest + USEast + USCentral + SouthAmerica + Asia;
		}

		await axios
			.get(`https://api.mozambiquehe.re/servers?auth=${api.apex}`)
			.then(response => {
				const data = response.data;

				const origin = data['Origin_login'];
				const apex = data['ApexOauth_Crossplay'];
				const accounts = data['EA_accounts'];
				const novafusion = data['EA_novafusion'];

				const statusAmount = checkStatus(origin) + checkStatus(apex) + checkStatus(accounts) + checkStatus(novafusion);

				if (statusAmount <= 4) {
					var embedColor = '43B581';
				} else if (statusAmount <= 10) {
					var embedColor = 'FAA61A';
				} else {
					var embedColor = 'F04747';
				}

				const status = new EmbedBuilder()
					.setTitle('Apex Legends Server Status')
					.addFields([
						{
							name: '[Crossplay] Apex Login',
							value: statusLayout(apex),
							inline: true,
						},
						{
							name: 'Origin Login',
							value: statusLayout(origin),
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: 'EA Accounts',
							value: statusLayout(accounts),
							inline: true,
						},
						{
							name: 'Lobby & Matchmaking Services',
							value: statusLayout(novafusion),
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
					])
					.setColor(embedColor)
					.setFooter({ text: 'Status data provided by https://apexlegendsstatus.com/' });

				// origin xbl psn
				// ea ccount
				// ea novafusion

				interaction.editReply({ embeds: [status] });
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setDescription(`**Error**\n\`\`\`${error.response.data.error}\`\`\``).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder().setDescription(`**Error**\n\`\`\`The request was not returned successfully. Try again\`\`\``).setColor('D0342C');

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
