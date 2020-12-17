const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");
const fs = require("fs");
const moment = require("moment");
const percentagebar = require("percentagebar");
const colours = require("../legendColours.json");

// Require Wrapper Library
const MozambiqueAPI = require("mozambique-api-wrapper");

// Create Client instance by passing in API key
let mozambiqueClient = new MozambiqueAPI(config.APIKey);

module.exports = {
  name: "stats",
  description: "Apex user stats.",
  execute(message, args) {
    let platformArg = args[0];
    let player = args[1];

    if (platformArg != null && player != null) {
      var platform = platformArg.toUpperCase();
    }

    message.channel.send("Fetching stats...").then(async (msg) => {
      mozambiqueClient
        .search({
          platform: platform,
          player: player,
        })
        .then(function (result) {
          if (platform != null && player != null) {
            if (platform == "PC" || platform == "PS4" || platform == "X1") {
              var seasonBP = result.global.battlepass.history.season7;
              var currentSeason = "7";

              function getLegendBanner(legend) {
                var legends = [
                  // Current list of legends that have banner images
                  "Bangalore",
                  "Bloodhound",
                  "Caustic",
                  "Crypto",
                  "Gibraltar",
                  "Horizon",
                  "Lifeline",
                  "Loba",
                  "Mirage",
                  "Octane",
                  "Pathfinder",
                  "Rampart",
                  "Revenant",
                  "Wattson",
                  "Wraith",
                  99999999, // Temp new character CData value until it gets updated on the API
                ];

                var tempLegendCDataValue = 99999999;

                if (legends.indexOf(legend) != -1) {
                  if (legend == tempLegendCDataValue) {
                    return `https://sdcore.dev/cdn/ApexStats/LegendBanners/NoBanner.png?q=${moment().valueOf()}`;
                  } else {
                    return `https://sdcore.dev/cdn/ApexStats/LegendBanners/${legend}.png?q=${moment().valueOf()}`;
                  }
                } else {
                  return `https://sdcore.dev/cdn/ApexStats/LegendBanners/NoBanner.png?q=${moment().valueOf()}`;
                }
              }

              function getBPLevel() {
                if (seasonBP != -1) {
                  if (seasonBP >= 110) {
                    return 110;
                  } else {
                    return seasonBP;
                  }
                } else {
                  return "0";
                }
              }

              function getAccountLevel() {
                if (result.global.level >= 500) {
                  return 500;
                } else {
                  return result.global.level;
                }
              }

              function hasAvatar() {
                if (result.global.avatar != "Not available") {
                  return result.global.avatar;
                } else {
                  return "https://sdcore.dev/cdn/ApexStats/Icon.png";
                }
              }

              function getRank(name) {
                if (name == "Silver") {
                  return "<:rankedSilver:787174770424021083>";
                } else if (name == "Gold") {
                  return "<:rankedGold:787174769942462474>";
                } else if (name == "Platinum") {
                  return "<:rankedPlatinum:787174770780667944>";
                } else if (name == "Diamond") {
                  return "<:rankedDiamond:787174769728290816>";
                } else if (name == "Master") {
                  return "<:rankedMaster:787174770680135680>";
                } else if (name == "Predator" || name == "Apex Predator") {
                  // I, for the life of me, cannot find a single person who
                  // is Apex Predator this season. At this point I'm pretty
                  // convinced the API only returns Masters people. Guess we'll
                  // find out when I dig more into it... sometime.
                  return "<:rankedPredator:787174770730336286>";
                } else {
                  return "<:rankedBronze:787174769623302204>";
                }
              }

              function getFieldTitle(fieldData) {
                if (fieldData != null) {
                  return fieldData.name;
                } else if (fieldData == "undefined") {
                  return "No data";
                } else {
                  return "No data";
                }
              }

              function getFieldValue(fieldData) {
                if (fieldData != null && fieldData != "undefined") {
                  return fieldData.value.toLocaleString("en-US");
                } else if (fieldData == "undefined") {
                  return "-";
                } else {
                  return "-";
                }
              }

              var legendName = result.legends.selected.LegendName;

              const stats = new Discord.MessageEmbed()
                .setColor(colours[legendName])
                .setAuthor(
                  `Apex Legends Stats for ${result.global.name} on ${platform}`,
                  hasAvatar()
                )
                .setDescription(
                  `Rank: ${getRank(result.global.rank.rankName)} ${
                    result.global.rank.rankName
                  } ${
                    result.global.rank.rankDiv
                  }\nScore: ${result.global.rank.rankScore.toLocaleString(
                    "en-US"
                  )}`
                )
                .addField(
                  `Account Level ${getAccountLevel()}/500`,
                  `${percentagebar(500, getAccountLevel(), 10)}`,
                  true
                )
                .addField(
                  `S${currentSeason} BP Level ${getBPLevel()}/110`,
                  `${percentagebar(110, getBPLevel(), 10)}`,
                  true
                )
                .addField("\u200b", "\u200b", true)
                .addField(
                  `${getFieldTitle(result.legends.selected.data[0])}`,
                  `${getFieldValue(result.legends.selected.data[0])}`,
                  true
                )
                .addField(
                  `${getFieldTitle(result.legends.selected.data[1])}`,
                  `${getFieldValue(result.legends.selected.data[1])}`,
                  true
                )
                .addField(
                  `${getFieldTitle(result.legends.selected.data[2])}`,
                  `${getFieldValue(result.legends.selected.data[2])}`,
                  true
                )
                .setImage(getLegendBanner(result.legends.selected.LegendName))
                .setFooter(
                  `${process.env.CREATOR_NAME}  •  Data provided by https://apexlegendsapi.com`,
                  process.env.CREATOR_LOGO
                );

              msg.delete();
              message.reply(stats);
            } else {
              msg.delete();
              message.reply(
                "Sorry, it looks like you didn't provide a valid platform.\nFor reference, PC = Origin/Steam, X1 = Xbox, and PS4 = Playstation Network."
              );
            }
          }
        })
        .catch(function (e) {
          if (platform == null && player == null) {
            msg.delete();
            message.channel.send(
              `To use this command, use the following format:\n\`${config.prefix}stats [platform] [username]\``
            );
            return;
          }
          msg.delete();
          message.channel.send(
            "Uncaught error processing stats. Please try again or contact a mod if the problem persists."
          );
          console.log(e);
        });
    });
  },
};
