const config = require("./config.json");
const Commando = require("discord.js-light-commando");

const client = new Commando.Client({
	owner: "360564818123554836",
	commandPrefix: ">>",
	disabledEveryone: true,
});

client.login(config.discord.token);
