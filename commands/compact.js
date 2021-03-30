const {Discord} = require("../ApexStats.js");
const config = require("../config.json");
const percentage = require("percentagebar");

const {default: axios} = require("axios");

module.exports = {
  name: "compact",
  description: "Shows user legend stats, but compact.",
  execute(message, args) {
    let platform = args[0];

    if (args[1]) {
      if (args[2]) {
        if (args[3]) {
          var player = `${args[1]}%20${args[2]}%20${args[3]}`;
        } else {
          var player = `${args[1]}%20${args[2]}`;
        }
      } else {
        var player = args[1];
      }
    }

    if (!args.length)
      // No args
      return message.channel.send(
        `To use this command, use the following format: \n\`${config.prefix}compact [platform] [username]\``
      );

    if (!platform || !player)
      // Arg 1 or 2 is missing
      return message.channel.send(
        `To use this command, use the following format:\n\`${config.prefix}compact [platform] [username]\``
      );

    if (platform && player) var platformUppercase = platform.toUpperCase();

    // Check is user uses PSN or PS5, XBOX or XBSX when checking stats
    if (platformUppercase == "PSN" || platformUppercase == "PS5" || platformUppercase == "PS") {
      var platformCheck = "PS4";
    } else if (platformUppercase == "XBOX" || platformUppercase == "XBSX") {
      var platformCheck = "X1";
    } else {
      var platformCheck = platformUppercase;
    }

    var plats = [
      // Current list of supported platforms
      "X1",
      "PS4",
      "PC",
    ];

    if (plats.indexOf(platformCheck) == -1)
      return message.channel.send(
        "Sorry, it looks like you didn't provide a valid platform.\nFor reference, PC = Origin/Steam, X1 = Xbox, and PS4 = Playstation Network."
      );

    function formatNumbers(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    mainURL = `https://api.apexstats.dev/v5.php?platform=${platformCheck}&player=${player}`;

    message.channel
      .send("Retrieving stats...")
      .then(async (msg) => {
        axios.get(mainURL).then(function (response) {
          // Response Data
          var mainResponse = response.data;

          // Season/Account Info
          var season = "8";
          var currentRank = mainResponse.accountInfo.ranked;
          var accountBP = mainResponse.accountInfo.battlepass.level;
          var accountLevel = mainResponse.accountInfo.level;

          function getAccountLevel(level) {
            if (level >= 500) {
              return 500;
            } else {
              return level;
            }
          }

          function getAccountBP(BP) {
            if (BP != -1) {
              if (BP >= 110) {
                return 110;
              } else {
                return BP;
              }
            } else {
              return 0;
            }
          }

          function getRankBadge(rankName) {
            if (rankName == "Silver") {
              return "<:rankedSilver:787174770424021083>";
            } else if (rankName == "Gold") {
              return "<:rankedGold:787174769942462474>";
            } else if (rankName == "Platinum") {
              return "<:rankedPlatinum:787174770780667944>";
            } else if (rankName == "Diamond") {
              return "<:rankedDiamond:787174769728290816>";
            } else if (rankName == "Master") {
              return "<:rankedMaster:787174770680135680>";
            } else if (rankName == "Predator" || rankName == "Apex Predator") {
              return "<:rankedPredator:787174770730336286>";
            } else {
              return "<:rankedBronze:787174769623302204>";
            }
          }

          function findRank(rankName, ladderPos, rankDiv) {
            if (rankName == "Apex Predator") {
              var rank = `[#${ladderPos}] Apex Predator`;
            } else {
              var rank = `${rankName} ${rankDiv}`;
            }

            return `${getRankBadge(rankName)} ${rank}`;
          }

          // Main Stats Embed
          const statsMain = new Discord.MessageEmbed()
            .setTitle(`Stats for ${mainResponse.userData.username} on ${platformUppercase}`)
            .addField(
              "Account Stats",
              `**Rank**\n${findRank(
                currentRank.name,
                currentRank.ladderPOS,
                currentRank.division
              )}\n**Score**\n${formatNumbers(currentRank.score)}`,
              true
            )
            .addField(
              `Account/S${season} BP Level`,
              `**Account Level ${accountLevel.toLocaleString()}/500**\n${percentage(
                500,
                getAccountLevel(accountLevel),
                10
              )}\n**BattlePass Level ${getAccountBP(accountBP)}/110**\n${percentage(
                110,
                getAccountBP(accountBP),
                10
              )}`,
              true
            );

          msg.delete();
          msg.channel.send(statsMain);
        });
      })
      .catch((errors) => {
        console.log(`Error: ${errors}`);
        msg.delete();
        message.channel.send(
          "There was an error looking up that username. If you're on PC, try your origin username. If the problem persists, contact support."
        );
      });
  },
};
