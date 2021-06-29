const chalk = require("chalk");
const config = require("../../config.json");
var { DateTime } = require("luxon");

function checkMessage(msg) {
	// If the server is the Apex server
	if (msg.guild.id == config.checkMessage.guildID) {
		// If the user has the Discord Moderator or Admin role, send the message
		if (
			msg.member.roles.cache.some((role) => role.name === "Discord Moderator") ||
			msg.member.roles.cache.some((role) => role.name === "Admin")
		) {
			console.log(
				chalk`{magenta.bold Apex Mod} ({white.bold ${DateTime.local().toFormat("hh:mm")}}) {white.bold [${
					msg.guild.name
				}:#${msg.channel.name}]} {dim ${msg.content}}`
			);
			return 0;
		}

		// If the command is ran in the #use-bots-here channel
		if (msg.channel.id == config.checkMessage.channelID) {
			console.log(
				chalk`{white.bold #use-bots-here} ({white.bold ${DateTime.local().toFormat("hh:mm")}}) {white.bold [${
					msg.guild.name
				}:#${msg.channel.name}]} {dim ${msg.content}}`
			);
			return 0;
		}

		console.log(
			chalk`{red.bold Not Allowed} ({white.bold ${DateTime.local().toFormat("hh:mm")}}) {white.bold [${
				msg.guild.name
			}:#${msg.channel.name}]} {dim ${msg.content}}`
		);
		return 1;
	}

	// Not in the Apex server, continue as normal
	console.log(
		chalk`({white.bold ${DateTime.local().toFormat("hh:mm")}}) {white.bold [${msg.guild.name}:#${
			msg.channel.name
		}]} {dim ${msg.content}}`
	);
	return 0;
}

module.exports = { checkMessage };
