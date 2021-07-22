const chalk = require("chalk");
const {MessageEmbed} = require("discord.js-light");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const axios = require("axios");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "badgelist",
      group: "admin",
      memberName: "badgelist",
      description: "N/A. Only usable by bot owner.",
      examples: ["badgeList"],
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
          default: "RSPN_Hideouts",
        },
      ],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }
  run(msg, {platform, username}) {
    if (checkMsg(msg) == 1) return;

    // Set platform to uppercase since the API only allows
    // uppercase platform variables
    var platform = platform.toUpperCase();

    // Check to see if the platform is a supported platform
    // on the API
    function checkPlatform(platform) {
      if (platform == "PSN" || platform == "PS5" || platform == "PS" || platform == "PS4")
        return "PS4";

      if (platform == "XBOX" || platform == "X1") return "X1";

      if (platform == "PC" || platform == "STEAM" || platform == "ORIGIN") return "PC";

      return 0;
    }

    // If there wasn't a valid platform sent, return an error
    if (checkPlatform(platform) == 0)
      return msg.say(
        `There was not a valid platform provided.\nFor reference, Use PC for Origin/Steam, X1 for Xbox, or PS4 for PlayStation.`
      );

    // Constructed API URL from args
    var APIURL = `https://api.apexstats.dev/stats?platform=${checkPlatform(
      platform
    )}&player=${encodeURIComponent(username)}`;

    msg.say(`Retrieving user stats for ${username}...`).then(async (msg) => {
      axios.get(APIURL).then(async function (response) {
        console.log("-- Fetching user data --");
        var response = response.data;
        console.log("-- Data fetched, parsing --");

        // Grab info for banner
        var username = response.userData.username;

        // Badges
        var badge = response.accountInfo.active;
        var bOne = badge.badges[0];
        var bTwo = badge.badges[1];
        var bThree = badge.badges[2];

        msg.delete();
        msg.say(
          `Badge list for **${username}**\n**Badge 1**\nID: ${bOne.id}\nValue: ${bOne.value}\n\n**Badge 2**\nID: ${bTwo.id}\nValue: ${bTwo.value}\n\n**Badge 3**\nID: ${bThree.id}\nValue: ${bThree.value}`
        );
      });
    });
  }
};
