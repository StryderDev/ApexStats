const config = require("./config.json");
const Discord = require("discord.js-light");
const Commando = require("discord.js-light-commando");

const client = new Commando.Client({
	owner: "360564818123554836",
	commandPrefix: ">>",
	disabledEveryone: true,
	cacheGuilds: true,
	cacheChannels: true,
	cacheOverwrites: false,
	cacheRoles: false,
	cacheEmojis: false,
	cachePresences: false,
});

require("./events.js")(client);

client.login(config.discord.token).catch(console.error);

client.on("message", (msg) => {
	function logMessage(message) {
		if (message.webhookID) return;

		const webhook = new Discord.WebhookClient(config.logs.webhookID, config.logs.webhookToken);

		webhook
			.send(
				`<t:${Math.floor(message.createdTimestamp / 1000)}:R> \`[${message.guild.name}](#${
					message.channel.name
				})\` **${message.author.tag}:** ${message.content}`
			)
			.catch(console.error);
	}

	logMessage(msg);
});

process.on("unhandledRejection", (error) => {
	console.log(chalk`{red Error: ${error}}`);
});

module.exports = {
	client: client,
	Discord: require("discord.js-light"),
};
