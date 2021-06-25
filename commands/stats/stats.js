const { Command } = require("discord.js-light-commando");
const chalk = require("chalk");

module.exports = class MapCommand extends Command {
	constructor(client) {
		super(client, {
			name: "stats",
			group: "stats",
			memberName: "stats",
			description: "Show stats about a user.",
			args: [
				{
					key: "platform",
					prompt: "What platform are you on?",
					type: "string",
					default: "PC",
				},
				{
					key: "username",
					prompt: "What is your username?",
					type: "string",
					default: "SDCore",
				},
			],
		});
	}
	onError(error) {
		console.log(chalk`{red ${error}}`);
	}
	run(msg, { platform, username }) {
		// Set platform to uppercase so it's sent correctly to the API
		var platform = platform.toUpperCase();

		// Checck to see if the platform is supported
		function checkPlatform(platform) {
			if (platform == "PC" || platform == "STEAM" || platform == "ORIGIN") return "PC";
			if (platform == "XBOX" || platform == "X1" || platform == "XB1" || platform == "XBL") return "X1";
			if (
				platform == "PS4" ||
				platform == "PS5" ||
				platform == "PS" ||
				platform == "PSN" ||
				platform == "Playstation"
			)
				return "PS4";

			if (platform == "SWITCH" || platform == "NINTENDO" || platform == "NINTENDO SWITCH" || platform == "NS")
				return 1;

			return 0;
		}

		// If there is no valid platform provided
		if (checkPlatform(platform) == 0)
			return msg.channel.send(
				`\`${platform}\` is not a valid platform.\nTry PC for Origin/Steam, X1 for Xbox, or PS4 for PlayStation.`
			);

		// If platform is Switch
		if (checkPlatform(platform) == 1)
			return msg.channel.send(`Stats for the Nintendo Switch are not currently supported. Sorry!`);
	}
};
