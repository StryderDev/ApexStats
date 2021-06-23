const config = require("./config.json");
const Discord = require("discord.js-light");
const Commando = require("discord.js-light-commando");

const client = new Commando.Client({
	owner: "360564818123554836",
	commandPrefix: ">>",
	disabledEveryone: true,
});

client.login(config.discord.token);

client.on("message", (msg) => {
	function logMessage(message) {
		if (message.webhookID) return;

		const webhook = new Discord.WebhookClient(config.logs.webhookID, config.logs.webhookToken);

		webhook
			.send(
				`<t:${Math.floor(message.createdTimestamp / 1000)}:R> \`(${message.channel.name})\` ${message.content}`
			)
			.catch(console.error);
	}

	logMessage(msg);
});

process.on("unhandledRejection", (error) => {
	console.log(chalk`{red Error: ${error}}`);
});
