const { client, Discord } = require("../Apex.js");
const chalk = require("chalk");
const { DateTime } = require("luxon");
const config = require("../config.json");

client.on("message", (msg) => {
	if (msg.channel.type == "dm" || msg.author.bot || msg.webhookID) return;
	if (!msg.content.startsWith(client.commandPrefix)) return;

	const webhook = new Discord.WebhookClient(config.logs.webhookID, config.logs.webhookToken);

	webhook
		.send(
			`<t:${Math.floor(msg.createdTimestamp / 1000)}:R> \`[${msg.guild.name}](#${msg.channel.name})\` **${
				msg.author.tag
			}**: ${msg.content}`
		)
		.catch((err) => {
			chalk`{red [${DateTime.local().toFormat("hh:mm:ss")}] Error: ${err}}`;
		});
});
