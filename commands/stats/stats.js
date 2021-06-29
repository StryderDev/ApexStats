const { Command } = require("discord.js-light-commando");
const chalk = require("chalk");
const { checkMessage } = require("../functions/checkMessage");
const axios = require("axios");
const { DateTime } = require("luxon");
const { MessageEmbed } = require("discord.js");
const statsLookup = require("../functions/statsLookup.js");

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
					default: "",
				},
				{
					key: "username",
					prompt: "What is your username?",
					type: "string",
					default: "",
				},
			],
		});
	}
	onError(error) {
		console.log(chalk`{red ${error}}`);
	}
	run(msg, { platform, username }) {
		if (checkMessage(msg) == 1) return;

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

			if (platform == null || platform == undefined || platform == "") return 2;

			return 0;
		}

		if (username == null || username == undefined || username == "")
			return msg.channel.send(`Please provide a username.`);

		// If there is no valid platform provided
		if (checkPlatform(platform) == 0)
			return msg.channel.send(
				`\`${platform}\` is not a valid platform.\nTry PC for Origin/Steam, X1 for Xbox, or PS4 for PlayStation.`
			);

		// If provided platform is Switch
		if (checkPlatform(platform) == 1)
			return msg.channel.send(`Stats for the Nintendo Switch are not currently supported. Sorry!`);

		// If there is no platform provided
		if (checkPlatform(platform) == 2) return msg.channel.send(`Please provide a platform such as PC, X1, or PS4.`);

		var apiURL = `https://api.apexstats.dev/stats?platform=${checkPlatform(platform)}&player=${encodeURIComponent(
			username
		)}`;
		var accountLevelEmote = "<:AccountLevel:824571962420101122>";
		var battlepassLevelEmote = "<:Season_9:847250004087144458>";

		msg.say(`Retrieving stats for **${username}**...`).then(async (msg) => {
			axios.get(apiURL).then(function (response) {
				msg.channel.startTyping();

				console.log(chalk`{white.bold [${DateTime.local().toFormat("hh:mm")}] Fetching data...}`);
				var response = response.data;
				console.log(chalk`{green.bold [${DateTime.local().toFormat("hh:mm")}] Data fetched, parsing}`);

				// User Data
				var userData = response.userData;
				var username = userData.username;
				var platform = userData.platform;
				var online = userData.online;
				var ingame = userData.ingame;

				// Account Info
				var accountInfo = response.accountInfo;
				var legend = accountInfo.active.legend;
				var level = accountInfo.level;

				// BR  Ranked
				var BR = accountInfo.Ranked_BR;
				var BR_Rank = BR.name;
				var BR_Pos = BR.ladderPos;
				var BR_Div = BR.division;
				var BR_Score = BR.score;

				function bpLevel() {
					if (accountInfo.battlepass.history === null) return 0;

					if (accountInfo.battlepass.history.season9 > 110) return 110;

					return accountInfo.battlepass.history.season9;
				}

				const userEmbed = new MessageEmbed()
					.setTitle(`Stats for ${username} on ${platform} playing ${statsLookup.findLegendByID(legend)}`)
					.setColor(statsLookup.setColor(legend))
					.setDescription(statsLookup.checkStatus(online, ingame))
					.addField(
						`${accountLevelEmote} Account`,
						`Level ${level.toLocaleString()}/500 (${statsLookup.getPercent(
							level,
							500,
							true
						)})\n${statsLookup.getPercentageBar(
							500,
							level
						)}\n\n**${battlepassLevelEmote} Season 9 BattlePass**\nLevel ${bpLevel()}/110 (${statsLookup.getPercent(
							bpLevel(),
							110,
							false
						)})\n${statsLookup.getPercentageBar(110, bpLevel())}`,
						true
					)
					.addField("Battle Royal Ranked", statsLookup.findRank(BR_Rank, BR_Pos, BR_Div), true);
				msg.delete();
				msg.say(userEmbed);

				msg.channel.stopTyping();
			});

			msg.channel.stopTyping();
		});
	}
};
