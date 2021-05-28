const axios = require("axios");
const Canvas = require("canvas");
const chalk = require("chalk");
const {MessageAttachment} = require("discord.js");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

const {findLegendByID, getBPLevel, trackerTitle, trackerValue} = require("../functions/stats.js");
const {badgeImage, hasValue, getValue} = require("../functions/imageBadge.js");

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
  async run(msg, {platform, username}) {
    if (checkMsg(msg) == 1) return;

    // Apex server, Console server, TGM Server, Dev server
    if (
      msg.guild.id != "664717517666910220" &&
      msg.guild.id != "553989741565968409" &&
      msg.guild.id != "541484311354933258" &&
      msg.guild.id != "546118385092788251"
    )
      return;

    function truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + "..." : str;
    }

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

    function trackerImage(id, legend) {
      if (id == "1905735931") return "Default";

      var tracker = require(`../../GameData/TrackerData/${legend}.json`);

      if (tracker[id] == "undefined" || tracker[id] == null) return id;

      return tracker[id].Image;
    }

    // Constructed API URL from args
    var APIURL = `https://api.apexstats.dev/stats?platform=${checkPlatform(
      platform
    )}&player=${encodeURIComponent(username)}`;

    msg.say(`Retrieving user stats for ${username}...`).then(async (msg) => {
      axios.get(APIURL).then(async function (response) {
        // Create Canvas with info
        // Username
        Canvas.registerFont("fonts/blocktastic.otf", {family: "blocktastic"});
        // Tracker Titles
        Canvas.registerFont("fonts/OpenSans-Regular.ttf", {family: "OpenSans"});
        Canvas.registerFont("fonts/OpenSans-Bold.ttf", {family: "OSBold"});
        Canvas.registerFont("fonts/OpenSans-Light.ttf", {family: "OSLight"});
        // Tracker Values
        Canvas.registerFont("fonts/Cousine.ttf", {family: "Cousine"});

        const canvas = Canvas.createCanvas(500, 700);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(
          "https://cdn.apexstats.dev/CanvasTesting/014.png"
        );

        // Draw background banner image
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        console.log("-- Fetching user data --");
        var response = response.data;
        console.log("-- Data fetched, parsing --");

        // Grab info for banner
        var username = response.userData.username;
        var legend = response.accountInfo.active.legend;

        // Badges
        var badge = response.accountInfo.active;
        var bOne = badge.badges[0];
        var bTwo = badge.badges[1];
        var bThree = badge.badges[2];

        // Trackers
        var tracker = response.accountInfo.active;
        var one = tracker.trackers[0];
        var two = tracker.trackers[1];
        var three = tracker.trackers[2];

        // Display user info on banner
        ctx.fillStyle = "#ffffff";
        ctx.font = "28px blocktastic";
        ctx.textAlign = "center";
        let user = truncate(username, 15);
        ctx.fillText(user, 127, 57);

        // Legend Image
        const legendImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/CanvasTesting/Legends/${findLegendByID(legend)}.png`
        );
        ctx.drawImage(legendImage, 0, 0);

        // Top Badge
        const badgeOneImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/Badges/${badgeImage(bOne.id, bOne.value)}`
        );
        ctx.drawImage(badgeOneImage, 80, 86, 95, 95);

        // Top Badge Value
        if (hasValue(bOne.id, bOne.value)) {
          const textOneBackground = await Canvas.loadImage(
            `https://cdn.apexstats.dev/Badges/textBackground.png`
          );
          ctx.drawImage(textOneBackground, 80, 86, 95, 95);

          ctx.fillStyle = "#FFFFFFF";
          ctx.font = "13px OSBold";
          ctx.textAlign = "center";
          let oneTitle = getValue(bOne.id, bOne.value);
          ctx.fillText(oneTitle, 127, 170);
        }

        // Middle Badge
        const badgeTwoImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/Badges/${badgeImage(bTwo.id, bTwo.value)}`
        );
        ctx.drawImage(badgeTwoImage, 80, 201, 95, 95);

        // Middle Badge Value
        if (hasValue(bTwo.id, bTwo.value)) {
          const textTwoBackground = await Canvas.loadImage(
            `https://cdn.apexstats.dev/Badges/textBackground.png`
          );
          ctx.drawImage(textTwoBackground, 80, 201, 95, 95);

          ctx.fillStyle = "#FFFFFFF";
          ctx.font = "13px OSBold";
          ctx.textAlign = "center";
          let oneTitle = getValue(bTwo.id, bTwo.value);
          ctx.fillText(oneTitle, 127, 286);
        }

        // Bottom Badge
        const badgeThreeImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/Badges/${badgeImage(bThree.id, bThree.value)}`
        );
        ctx.drawImage(badgeThreeImage, 80, 321, 95, 95);

        // Bottom Badge Value
        if (hasValue(bThree.id, bThree.value)) {
          const textThreeBackground = await Canvas.loadImage(
            `https://cdn.apexstats.dev/Badges/textBackground.png`
          );
          ctx.drawImage(textThreeBackground, 80, 321, 95, 95);

          ctx.fillStyle = "#FFFFFFF";
          ctx.font = "13px OSBold";
          ctx.textAlign = "center";
          let oneTitle = getValue(bThree.id, bThree.value);
          ctx.fillText(oneTitle, 127, 406);
        }

        // Top Tracker
        // Image
        const oneImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/CanvasTesting/trackerImages/${findLegendByID(
            legend
          )}/${trackerImage(one.id, findLegendByID(legend))}.png`
        );
        ctx.drawImage(oneImage, 14, 432, 237, 79);

        // Title
        ctx.fillStyle = "#FFFFFFF";
        ctx.font = "15px OSBold";
        ctx.textAlign = "left";
        let oneTitle = truncate(trackerTitle(one.id, findLegendByID(legend)).toUpperCase(), 19);
        ctx.fillText(oneTitle, 32, 458);

        // Value
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Cousine";
        ctx.textAlign = "left";
        let oneValue = trackerValue(one.id, one.value);
        ctx.fillText(oneValue, 32, 495);

        // Middle Tracker
        // Image
        const twoImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/CanvasTesting/trackerImages/${findLegendByID(
            legend
          )}/${trackerImage(two.id, findLegendByID(legend))}.png`
        );
        ctx.drawImage(twoImage, 14, 514, 237, 79);

        // Title
        ctx.fillStyle = "#FFFFFFF";
        ctx.font = "15px OSBold";
        ctx.textAlign = "left";
        let twoTitle = truncate(trackerTitle(two.id, findLegendByID(legend)).toUpperCase(), 19);
        ctx.fillText(twoTitle, 32, 540);

        // Value
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Cousine";
        ctx.textAlign = "left";
        let twoValue = trackerValue(two.id, two.value);
        ctx.fillText(twoValue, 32, 577);

        // Bottom Tracker
        // Image
        const threeImage = await Canvas.loadImage(
          `https://cdn.apexstats.dev/CanvasTesting/trackerImages/${findLegendByID(
            legend
          )}/${trackerImage(three.id, findLegendByID(legend))}.png`
        );
        ctx.drawImage(threeImage, 14, 596, 237, 79);

        // Title
        ctx.fillStyle = "#FFFFFFF";
        ctx.font = "15px OSBold";
        ctx.textAlign = "left";
        let threeTitle = truncate(trackerTitle(three.id, findLegendByID(legend)).toUpperCase(), 23);
        ctx.fillText(threeTitle, 32, 622);

        // Value
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "30px Cousine";
        ctx.textAlign = "left";
        let threeValue = trackerValue(three.id, three.value);
        ctx.fillText(threeValue, 32, 659);

        // Set canvas image as attachment and send
        const attachment = new MessageAttachment(canvas.toBuffer(), "stats.png");

        msg.delete();
        msg.say(attachment);
      });
    });
  }
};
