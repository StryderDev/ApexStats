const axios = require("axios");
const Canvas = require("canvas");
const chalk = require("chalk");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

const percentage = require("percentagebar");
const {
  findLegendByID,
  checkStatus,
  getColor,
  findRank,
  getBPLevel,
  trackerTitle,
  trackerValue,
} = require("../functions/stats.js");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "image",
      group: "admin",
      memberName: "image",
      description: "N/A. Only usable by bot owner.",
      examples: ["image"],
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
  async run(msg, {platform, username}) {
    if (checkMsg(msg) == 1) return;

    // Set platform to uppercase because the API
    // only accepts uppercase platform variables
    var platform = platform.toUpperCase();

    // Check to see if the platform is a supported
    // platform on the API
    function checkPlatform(platform) {
      if (platform == "PSN" || platform == "PS5" || platform == "PS" || platform == "PS4")
        return "PS4";

      if (platform == "XBOX" || platform == "X1") return "X1";

      if (platform == "PC" || platform == "STEAM" || platform == "ORIGIN") return "PC";

      return 0;
    }

    // If the platform isn't one that is supported,
    // return an error
    if (checkPlatform(platform) == 0)
      return msg.say(
        `There was not a valid platform provided.\nFor reference, Use PC for Origin/Steam, X1 for Xbox, or PS4 for PlayStation.`
      );

    msg.say("Retrieving user stats...").then(async (msg) => {
      axios
        .get(
          `https://api.apexstats.dev/stats.php?platform=${checkPlatform(
            platform
          )}&player=${encodeURIComponent(username)}`
        )
        .then(async function (response) {
          // Set main response to data object
          console.log("-- LOOKING UP USER DATA --");
          var response = response.data;
          console.log("-- USER DATA ASSIGNED HERE --");

          const canvas = Canvas.createCanvas(500, 700);
          const ctx = canvas.getContext("2d");
          const background = await Canvas.loadImage(
            "https://cdn.apexstats.dev/CanvasTesting/010.png"
          );

          function trackerImage(id, legend) {
            if (id == "1905735931") return "Default";

            var tracker = require(`../../GameData/TrackerData/${legend}.json`);

            if (tracker[id] == "undefined" || tracker[id] == null) return id;

            return tracker[id].Image;
          }

          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

          // Sort data into variables for organization :bop:
          var username = response.userData.username;
          var platform = response.userData.platform;
          var isOnline = response.userData.status;

          // Banner info
          var legend = response.accountInfo.active.legend;
          var level = response.accountInfo.level;
          var bpLevel = response.accountInfo.battlepass.level;

          // Ranked
          var rankName = response.accountInfo.ranked.name;
          var rankPos = response.accountInfo.ranked.ladderPos;
          var rankDiv = response.accountInfo.ranked.division;
          var rankScore = response.accountInfo.ranked.score;

          function truncate(str, n) {
            return str.length > n ? str.substr(0, n - 1) + "..." : str;
          }

          // Trackers
          var tracker = response.accountInfo.active;
          var tOne = tracker.trackers[0];
          var tTwo = tracker.trackers[1];
          var tThree = tracker.trackers[2];

          const legendImage = await Canvas.loadImage(
            `https://cdn.apexstats.dev/CanvasTesting/Legends/${findLegendByID(legend)}.png`
          );
          ctx.drawImage(legendImage, 0, 0, canvas.width, canvas.height);

          const tOneImage = await Canvas.loadImage(
            `https://cdn.apexstats.dev/CanvasTesting/trackerImages/${findLegendByID(
              legend
            )}/${trackerImage(tOne.id, findLegendByID(legend))}.png`
          );

          ctx.drawImage(tOneImage, 14, 432, 237, 79);

          const tTwoImage = await Canvas.loadImage(
            `https://cdn.apexstats.dev/CanvasTesting/trackerImages/${findLegendByID(
              legend
            )}/${trackerImage(tTwo.id, findLegendByID(legend))}.png`
          );

          ctx.drawImage(tTwoImage, 14, 514, 237, 79);

          const tThreeImage = await Canvas.loadImage(
            `https://cdn.apexstats.dev/CanvasTesting/trackerImages/${findLegendByID(
              legend
            )}/${trackerImage(tThree.id, findLegendByID(legend))}.png`
          );

          ctx.drawImage(tThreeImage, 14, 596, 237, 79);

          // Display user text
          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "28px arial";
          ctx.textAlign = "center";
          let text = truncate(username, 12);
          ctx.fillText(text, 127, 56);

          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "18px arial";
          ctx.textAlign = "left";
          let trackerOneTitle = trackerTitle(tOne.id, findLegendByID(legend));
          ctx.fillText(trackerOneTitle, 32, 460);

          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "27px arial";
          ctx.textAlign = "left";
          let trackerOneValue = trackerValue(tOne.id, tOne.value);
          ctx.fillText(trackerOneValue, 32, 492);

          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "18px arial";
          ctx.textAlign = "left";
          let trackerTwoTitle = trackerTitle(tTwo.id, findLegendByID(legend));
          ctx.fillText(trackerTwoTitle, 32, 542);

          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "27px arial";
          ctx.textAlign = "left";
          let trackerTwoValue = trackerValue(tTwo.id, tTwo.value);
          ctx.fillText(trackerTwoValue, 32, 577);

          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "18px arial";
          ctx.textAlign = "left";
          let trackerThreeTitle = trackerTitle(tThree.id, findLegendByID(legend));
          ctx.fillText(trackerThreeTitle, 32, 624);

          ctx.fillStyle = "#ffffff"; // White text
          ctx.font = "27px arial";
          ctx.textAlign = "left";
          let trackerThreeValue = trackerValue(tThree.id, tThree.value);
          ctx.fillText(trackerThreeValue, 32, 659);

          const embed = new MessageEmbed()
            .setTitle(`Stats for ${username} on ${platform} playing ${findLegendByID(legend)}`)
            .setDescription(checkStatus(isOnline))
            .setColor(getColor(legend))
            .addField(
              "Account Stats",
              `${findRank(
                rankName,
                rankPos,
                rankDiv
              )}\n**Score**\n${rankScore.toLocaleString()} RP`,
              true
            )
            .addField(
              "Account & Season 9 BattlePass Level",
              `**Account Level ${level.toLocaleString()}/500**\n${percentage(
                500,
                level,
                10
              )}\n**BattlePass Level ${getBPLevel(bpLevel)}/110**\n${percentage(
                110,
                getBPLevel(bpLevel),
                10
              )}`,
              true
            )
            .addField("\u200b", "**Currently Equipped Trackers**")
            .addField(
              trackerTitle(tOne.id, findLegendByID(legend)),
              trackerValue(tOne.id, tOne.value),
              true
            )
            .addField(
              trackerTitle(tTwo.id, findLegendByID(legend)),
              trackerValue(tTwo.id, tTwo.value),
              true
            )
            .addField(
              trackerTitle(tThree.id, findLegendByID(legend)),
              trackerValue(tThree.id, tThree.value),
              true
            )
            .setImage(`https://cdn.apexstats.dev/LegendBanners/${findLegendByID(legend)}.png`)
            .setFooter(
              "Weird tracker name? Let SDCore#1234 know!\nBattlePass level not correct? Equip the badge in-game!"
            );

          const attachment = new MessageAttachment(canvas.toBuffer(), "stats.png");

          msg.delete();
          msg.say(attachment);
        })
        .catch((error) => {
          console.log("-- ERROR OUTPUT --");
          console.log(error);

          if (
            error.response.data == null ||
            error.response.data == undefined ||
            error.response.data == "undefined"
          ) {
            console.log("-- ERROR WAS NOT DEFINED --");
            return msg.say("There was an error that was not caught. Please try again.");
          }

          var error = error.response.data;

          console.log(chalk`{red Error: ${error.error}}`);

          function checkErrorType(code) {
            if (code == 1)
              return "**Error**\nThere was no platform and/or username specific. This shouldn't happen, so contact SDCore#1234 if you see this.";

            if (code == 2)
              return "**Error**\nThere was not a valid platform provided. Please use PC/X1/PS4.";

            if (code == 3)
              return "**Error**\nThere was an error connecting to an external API. Please try again or contact SDCore#1234 if the problem persists.";

            if (code == 4)
              return "**Error**\nThat username wasn't found. Either it is incorrect, or it doesn't exist. Try using the username of your Origin account.";

            if (code == 5)
              return "**Error**\nThe username was found, but that account hasn't played Apex. Try a different username.";

            return "**Error**\nGeneric, unhandled error. Contact SDCore#1234 if you see this.";
          }

          canvas.clearRect(0, 0, canvas.width, canvas.height);
          msg.delete();
          msg.say(checkErrorType(error.errorCode));
        });
    });
  }
};
