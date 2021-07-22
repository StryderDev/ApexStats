const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js-light");
const axios = require("axios");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "status",
      group: "utility",
      memberName: "status",
      description: "Shows the current server status.",
      examples: ["status"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    msg.channel.startTyping();

    msg.say("Retrieving server status...").then(async (msg) => {
      var statusURL = `https://api.mozambiquehe.re/servers?auth=${config.MozambiqueAPI}`;
      var announcementURL = "https://apexlegendsstatus.com/anno.json";

      var status = axios.get(statusURL);
      var announcement = axios.get(announcementURL);

      // Status Emojis
      var onlineCircle = "<:StatusUp:786800700533112872>";
      var onlineTop = "<:onlineTop:836525149674536980>";
      var onlineMiddle = "<:onlineMiddle:836525149553426454>";
      var onlineBottom = "<:onlineBottom:836525149645045760>";
      var slowTop = "<:slowTop:836525570112225291>";
      var slowMiddle = "<:slowMiddle:836525642299867147>";
      var slowBottom = "<:slowMottom:836525570078539806>";
      var downTop = "<:onlineTop:836526070559539280>";
      var downMiddle = "<:onlineMiddle:836526063290810429>";
      var downBottom = "<:onlineBottom:836526055128694794>";

      axios.all([status, announcement]).then(
        axios.spread((...responses) => {
          var originResult = responses[0].data["Origin_login"];
          var OauthCrossplay = responses[0].data["ApexOauth_Crossplay"];
          var novaResult = responses[0].data["EA_novafusion"];
          var accountsResult = responses[0].data["EA_accounts"];
          var platformResult = responses[0].data["otherPlatforms"];
          var mozamResponse = responses[0].data["selfCoreTest"];

          function getStatus(status, position) {
            if (status == "UP") {
              if (position == "top") return onlineTop;
              if (position == "middle") return onlineMiddle;
              if (position == "bottom") return onlineBottom;
            }
            if (status == "SLOW") {
              if (position == "top") return slowTop;
              if (position == "middle") return slowMiddle;
              if (position == "bottom") return slowBottom;
            }
            if (status == "DOWN") {
              if (position == "top") return downTop;
              if (position == "middle") return downMiddle;
              if (position == "bottom") return downBottom;
            }
            if (status == "OVERLOADED") {
              if (position == "top") return downTop;
              if (position == "middle") return downMiddle;
              if (position == "bottom") return downBottom;
            }
          }

          function checkAnnouncement() {
            var now = Math.round(new Date().getTime() / 1000);
            var release = responses[1].data.Release;
            var duration = responses[1].data.Duration;
            var math = now - release;

            if (math >= duration) return `${onlineCircle} No announcements at this time.`;

            return `🚨 ${responses[1].data.Content}`;
          }

          const statusEmbed = new MessageEmbed()
            .setTitle("Apex Legends Server Status")
            .setColor("C21D27")
            .setDescription(checkAnnouncement())
            .addField(
              "[CrossPlay] Apex Login",
              `${getStatus(OauthCrossplay["EU-West"].Status, "top")}EU West (${
                OauthCrossplay["EU-West"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["EU-East"].Status, "middle")}EU East (${
                OauthCrossplay["EU-East"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["US-West"].Status, "middle")}US West (${
                OauthCrossplay["US-West"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["US-Central"].Status, "middle")}US Central (${
                OauthCrossplay["US-Central"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["US-East"].Status, "middle")}US East (${
                OauthCrossplay["US-East"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["SouthAmerica"].Status, "middle")}South America (${
                OauthCrossplay["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(OauthCrossplay["Asia"].Status, "bottom")}Asia (${
                OauthCrossplay["Asia"].ResponseTime
              }ms)\n`,
              true
            )
            .addField(
              "Origin Login",
              `${getStatus(originResult["EU-West"].Status, "top")}EU West (${
                originResult["EU-West"].ResponseTime
              }ms)\n${getStatus(originResult["EU-East"].Status, "middle")}EU East (${
                originResult["EU-East"].ResponseTime
              }ms)\n${getStatus(originResult["US-West"].Status, "middle")}US West (${
                originResult["US-West"].ResponseTime
              }ms)\n${getStatus(originResult["US-Central"].Status, "middle")}US Central (${
                originResult["US-Central"].ResponseTime
              }ms)\n${getStatus(originResult["US-East"].Status, "middle")}US East (${
                originResult["US-East"].ResponseTime
              }ms)\n${getStatus(originResult["SouthAmerica"].Status, "middle")}South America (${
                originResult["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(originResult["Asia"].Status, "bottom")}Asia (${
                originResult["Asia"].ResponseTime
              }ms)\n`,
              true
            )
            .addField(
              "Origin/XBL/PSN",
              `${getStatus(mozamResponse["Origin-API"].Status, "top")}Origin\n${getStatus(
                platformResult["Xbox-Live"].Status,
                "middle"
              )}Xbox Live\n${getStatus(
                platformResult["Playstation-Network"].Status,
                "bottom"
              )}PlayStation Network`,
              true
            )
            .addField(
              "EA Accounts",
              `${getStatus(accountsResult["EU-West"].Status, "top")}EU West (${
                accountsResult["EU-West"].ResponseTime
              }ms)\n${getStatus(accountsResult["EU-East"].Status, "middle")}EU East (${
                accountsResult["EU-East"].ResponseTime
              }ms)\n${getStatus(accountsResult["US-West"].Status, "middle")}US West (${
                accountsResult["US-West"].ResponseTime
              }ms)\n${getStatus(accountsResult["US-Central"].Status, "middle")}US Central (${
                accountsResult["US-Central"].ResponseTime
              }ms)\n${getStatus(accountsResult["US-East"].Status, "middle")}US East (${
                accountsResult["US-East"].ResponseTime
              }ms)\n${getStatus(accountsResult["SouthAmerica"].Status, "middle")}South America (${
                accountsResult["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(accountsResult["Asia"].Status, "bottom")}Asia (${
                accountsResult["Asia"].ResponseTime
              }ms)\n`,
              true
            )
            .addField(
              "EA Novafusion",
              `${getStatus(novaResult["EU-West"].Status, "top")}EU West (${
                novaResult["EU-West"].ResponseTime
              }ms)\n${getStatus(novaResult["EU-East"].Status, "middle")}EU East (${
                novaResult["EU-East"].ResponseTime
              }ms)\n${getStatus(novaResult["US-West"].Status, "middle")}US West (${
                novaResult["US-West"].ResponseTime
              }ms)\n${getStatus(novaResult["US-Central"].Status, "middle")}US Central (${
                novaResult["US-Central"].ResponseTime
              }ms)\n${getStatus(novaResult["US-East"].Status, "middle")}US East (${
                novaResult["US-East"].ResponseTime
              }ms)\n${getStatus(novaResult["SouthAmerica"].Status, "middle")}South America (${
                novaResult["SouthAmerica"].ResponseTime
              }ms)\n${getStatus(novaResult["Asia"].Status, "bottom")}Asia (${
                novaResult["Asia"].ResponseTime
              }ms)\n`,
              true
            )
            .addField("\u200b", "\u200b", true)
            .setFooter("Data provided by https://apexlegendsstatus.com/");

          msg.delete();
          msg.say(statusEmbed);

          msg.channel.stopTyping();
        })
      );
    });
  }
};
