const client = require('../Apex.js');
const { rotations } = require('../config.json');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('../config.json');

async function updateStatus() {
	const timeLogs = DateTime.local().toFormat('hh:mm:ss');

	if (client.guilds.cache.get(config.rotations.guild)) {
		try {
			const response = await axios.get(`https://api.mozambiquehe.re/servers?auth=${config.api.mozambique}`);

			const data = response.data;

			var originResult = data['Origin_login'];
			var OauthCrossplay = data['ApexOauth_Crossplay'];
			var novaResult = data['EA_novafusion'];
			var accountsResult = data['EA_accounts'];
			var platformResult = data['otherPlatforms'];
			var mozamResponse = data['selfCoreTest'];

			function getStatus(status) {
				if (status == 'UP') {
					return ':green_circle: ';
				}
				if (status == 'SLOW') {
					return ':orange_circle: ';
				}
				if (status == 'DOWN') {
					return ':red_circle: ';
				}
				if (status == 'OVERLOADED') {
					return ':black_circle: ';
				}
			}

			const status = new MessageEmbed()
				.setTitle('Apex Legends Server Status')
				.addField(
					'[CrossPlay] Apex Login',
					`${getStatus(OauthCrossplay['EU-West'].Status)}EU West (${
						OauthCrossplay['EU-West'].ResponseTime
					}ms)\n${getStatus(OauthCrossplay['EU-East'].Status)}EU East (${
						OauthCrossplay['EU-East'].ResponseTime
					}ms)\n${getStatus(OauthCrossplay['US-West'].Status)}US West (${
						OauthCrossplay['US-West'].ResponseTime
					}ms)\n${getStatus(OauthCrossplay['US-Central'].Status)}US Central (${
						OauthCrossplay['US-Central'].ResponseTime
					}ms)\n${getStatus(OauthCrossplay['US-East'].Status)}US East (${
						OauthCrossplay['US-East'].ResponseTime
					}ms)\n${getStatus(OauthCrossplay['SouthAmerica'].Status)}South America (${
						OauthCrossplay['SouthAmerica'].ResponseTime
					}ms)\n${getStatus(OauthCrossplay['Asia'].Status)}Asia (${OauthCrossplay['Asia'].ResponseTime}ms)\n`,
					true,
				)
				.addField(
					'Origin Login',
					`${getStatus(originResult['EU-West'].Status)}EU West (${
						originResult['EU-West'].ResponseTime
					}ms)\n${getStatus(originResult['EU-East'].Status)}EU East (${
						originResult['EU-East'].ResponseTime
					}ms)\n${getStatus(originResult['US-West'].Status)}US West (${
						originResult['US-West'].ResponseTime
					}ms)\n${getStatus(originResult['US-Central'].Status)}US Central (${
						originResult['US-Central'].ResponseTime
					}ms)\n${getStatus(originResult['US-East'].Status)}US East (${
						originResult['US-East'].ResponseTime
					}ms)\n${getStatus(originResult['SouthAmerica'].Status)}South America (${
						originResult['SouthAmerica'].ResponseTime
					}ms)\n${getStatus(originResult['Asia'].Status)}Asia (${originResult['Asia'].ResponseTime}ms)\n`,
					true,
				)
				.addField(
					'Origin/XBL/PSN',
					`${getStatus(mozamResponse['Origin-API'].Status)}Origin\n${getStatus(
						platformResult['Xbox-Live'].Status,
						'middle',
					)}Xbox Live\n${getStatus(platformResult['Playstation-Network'].Status)}PlayStation Network`,
					true,
				)
				.addField(
					'EA Accounts',
					`${getStatus(accountsResult['EU-West'].Status)}EU West (${
						accountsResult['EU-West'].ResponseTime
					}ms)\n${getStatus(accountsResult['EU-East'].Status)}EU East (${
						accountsResult['EU-East'].ResponseTime
					}ms)\n${getStatus(accountsResult['US-West'].Status)}US West (${
						accountsResult['US-West'].ResponseTime
					}ms)\n${getStatus(accountsResult['US-Central'].Status)}US Central (${
						accountsResult['US-Central'].ResponseTime
					}ms)\n${getStatus(accountsResult['US-East'].Status)}US East (${
						accountsResult['US-East'].ResponseTime
					}ms)\n${getStatus(accountsResult['SouthAmerica'].Status)}South America (${
						accountsResult['SouthAmerica'].ResponseTime
					}ms)\n${getStatus(accountsResult['Asia'].Status)}Asia (${accountsResult['Asia'].ResponseTime}ms)\n`,
					true,
				)
				.addField(
					'EA Novafusion',
					`${getStatus(novaResult['EU-West'].Status)}EU West (${
						novaResult['EU-West'].ResponseTime
					}ms)\n${getStatus(novaResult['EU-East'].Status)}EU East (${
						novaResult['EU-East'].ResponseTime
					}ms)\n${getStatus(novaResult['US-West'].Status)}US West (${
						novaResult['US-West'].ResponseTime
					}ms)\n${getStatus(novaResult['US-Central'].Status)}US Central (${
						novaResult['US-Central'].ResponseTime
					}ms)\n${getStatus(novaResult['US-East'].Status)}US East (${
						novaResult['US-East'].ResponseTime
					}ms)\n${getStatus(novaResult['SouthAmerica'].Status)}South America (${
						novaResult['SouthAmerica'].ResponseTime
					}ms)\n${getStatus(novaResult['Asia'].Status)}Asia (${novaResult['Asia'].ResponseTime}ms)\n`,
					true,
				)
				.addField('\u200b', '\u200b', true)
				.setFooter('Data provided by https://apexlegendsstatus.com/')
				.setTimestamp();

			const guild = client.guilds.cache.get(rotations.guild);
			// if (!guild) return console.log(chalk`{gray Unable to find guild for Map Updates.}`);
			if (!guild) return;

			const channel = guild.channels.cache.find(
				c => c.id === rotations.status.channel && c.type === 'GUILD_TEXT',
			);
			// if (!channel) return console.log('Unable to find channel.');
			if (!channel) return;

			try {
				const message = channel.messages.fetch(rotations.status.message);
				if (!message) return; // console.log('Unable to find message.');

				channel.messages.fetch(rotations.status.message).then(msg => {
					msg.edit({ embeds: [status] });
				});

				console.log(chalk`{blue.bold [${DateTime.local().toFormat('hh:mm:ss')}] Updated Status Embed}`);
			} catch (err) {
				console.error(`Other Error: ${err}`);
			}
		} catch (error) {
			console.error(chalk`{red.bold [${timeLogs}] Error: ${error} on Status API in Status Update.}`);
		}
	} else {
		return;
	}
}

module.exports = { updateStatus };
