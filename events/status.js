const {Discord, client} = require("../ApexStats.js");
const axios = require("axios");
const config = require("../config.json");

var UpEmoji = "<:StatusUp:786800700533112872>";
var SlowEmoji = "<:StatusSlow:786800700541501461>";
var DownEmoji = "<:StatusDown:786800700201238570>";
var NoDataEmoji = "<:StatusNoData:786800700499034122>";
var {DateTime} = require("luxon");

client.once("ready", () => {
  function updateStatus() {
    axios.get(`https://api.mozambiquehe.re/servers?auth=${config.MozambiqueAPI}`).then((res) => {
      function getStatus(status) {
        if (status == "UP") {
          return UpEmoji;
        } else if (status == "SLOW") {
          return SlowEmoji;
        } else if (status == "DOWN") {
          return DownEmoji;
        } else if (status == "OVERLOADED") {
          return DownEmoji;
        } else {
          return NoDataEmoji;
        }
      }

      var originResult = res.data["Origin_login"];
      var novaResult = res.data["EA_novafusion"];
      var accountsResult = res.data["EA_accounts"];
      var OauthPC = res.data["ApexOauth_PC"];
      var OauthPS4 = res.data["ApexOauth_PS4"];
      var OauthX1 = res.data["ApexOauth_X1"];
      var OauthSteam = res.data["ApexOauth_Steam"];
      var OauthCrossplay = res.data["ApexOauth_Crossplay"];

      const statusEmbed = new Discord.MessageEmbed()
        .setTitle("Apex Legends Server Status")
        .addField(
          "Origin Login",
          `${getStatus(originResult["EU-West"].Status)}EU West (${
            originResult["EU-West"].ResponseTime
          }ms)\n${getStatus(originResult["EU-East"].Status)}EU East (${
            originResult["EU-East"].ResponseTime
          }ms)\n${getStatus(originResult["US-West"].Status)}US West (${
            originResult["US-West"].ResponseTime
          }ms)\n${getStatus(originResult["US-Central"].Status)}US Central (${
            originResult["US-Central"].ResponseTime
          }ms)\n${getStatus(originResult["US-East"].Status)}US East (${
            originResult["US-East"].ResponseTime
          }ms)\n${getStatus(originResult["SouthAmerica"].Status)}South America (${
            originResult["SouthAmerica"].ResponseTime
          }ms)\n${getStatus(originResult["Asia"].Status)}Asia (${
            originResult["Asia"].ResponseTime
          }ms)`,
          true
        )
        .addField(
          "EA Novafusion",
          `${getStatus(novaResult["EU-West"].Status)}EU West (${
            novaResult["EU-West"].ResponseTime
          }ms)\n${getStatus(novaResult["EU-East"].Status)}EU East (${
            novaResult["EU-East"].ResponseTime
          }ms)\n${getStatus(novaResult["US-West"].Status)}US West (${
            novaResult["US-West"].ResponseTime
          }ms)\n${getStatus(novaResult["US-Central"].Status)}US Central (${
            novaResult["US-Central"].ResponseTime
          }ms)\n${getStatus(novaResult["US-East"].Status)}US East (${
            novaResult["US-East"].ResponseTime
          }ms)\n${getStatus(novaResult["SouthAmerica"].Status)}South America (${
            novaResult["SouthAmerica"].ResponseTime
          }ms)\n${getStatus(novaResult["Asia"].Status)}Asia (${novaResult["Asia"].ResponseTime}ms)`,
          true
        )
        .addField(
          "EA Accounts",
          `${getStatus(accountsResult["EU-West"].Status)}EU West (${
            accountsResult["EU-West"].ResponseTime
          }ms)\n${getStatus(accountsResult["EU-East"].Status)}EU East (${
            accountsResult["EU-East"].ResponseTime
          }ms)\n${getStatus(accountsResult["US-West"].Status)}US West (${
            accountsResult["US-West"].ResponseTime
          }ms)\n${getStatus(accountsResult["US-Central"].Status)}US Central (${
            accountsResult["US-Central"].ResponseTime
          }ms)\n${getStatus(accountsResult["US-East"].Status)}US East (${
            accountsResult["US-East"].ResponseTime
          }ms)\n${getStatus(accountsResult["SouthAmerica"].Status)}South America (${
            accountsResult["SouthAmerica"].ResponseTime
          }ms)\n${getStatus(accountsResult["Asia"].Status)}Asia (${
            accountsResult["Asia"].ResponseTime
          }ms)`,
          true
        )
        .addField(
          "[Crossplay] Apex Login",
          `${getStatus(OauthCrossplay["EU-West"].Status)}EU West (${
            OauthCrossplay["EU-West"].ResponseTime
          }ms)\n${getStatus(OauthCrossplay["EU-East"].Status)}EU East (${
            OauthCrossplay["EU-East"].ResponseTime
          }ms)\n${getStatus(OauthCrossplay["US-West"].Status)}US West (${
            OauthCrossplay["US-West"].ResponseTime
          }ms)\n${getStatus(OauthCrossplay["US-Central"].Status)}US Central (${
            OauthCrossplay["US-Central"].ResponseTime
          }ms)\n${getStatus(OauthCrossplay["US-East"].Status)}US East (${
            OauthCrossplay["US-East"].ResponseTime
          }ms)\n${getStatus(OauthCrossplay["SouthAmerica"].Status)}South America (${
            OauthCrossplay["SouthAmerica"].ResponseTime
          }ms)\n${getStatus(OauthCrossplay["Asia"].Status)}Asia (${
            OauthCrossplay["Asia"].ResponseTime
          }ms)`,
          true
        )
        .addField(
          "[Steam] Apex Login",
          `${getStatus(OauthSteam["EU-West"].Status)}EU West (${
            OauthSteam["EU-West"].ResponseTime
          }ms)\n${getStatus(OauthSteam["EU-East"].Status)}EU East (${
            OauthSteam["EU-East"].ResponseTime
          }ms)\n${getStatus(OauthSteam["US-West"].Status)}US West (${
            OauthSteam["US-West"].ResponseTime
          }ms)\n${getStatus(OauthSteam["US-Central"].Status)}US Central (${
            OauthSteam["US-Central"].ResponseTime
          }ms)\n${getStatus(OauthSteam["US-East"].Status)}US East (${
            OauthSteam["US-East"].ResponseTime
          }ms)\n${getStatus(OauthSteam["SouthAmerica"].Status)}South America (${
            OauthSteam["SouthAmerica"].ResponseTime
          }ms)\n${getStatus(OauthSteam["Asia"].Status)}Asia (${OauthSteam["Asia"].ResponseTime}ms)`,
          true
        )
        .setFooter("Data provided by https://apexlegendsstatus.com")
        .setTimestamp();

      const guild = client.guilds.cache.get(config.autoUpdate.guildID);
      if (!guild) return console.log("Unable to find guild.");

      const channel = guild.channels.cache.find(
        (c) => c.id === config.autoUpdate.status.channel && c.type === "text"
      );
      if (!channel) return console.log("Unable to find channel.");

      try {
        const message = channel.messages.fetch(config.autoUpdate.status.message);
        if (!message) return console.log("Unable to find message.");

        channel.messages.fetch(config.autoUpdate.status.message).then((msg) => {
          msg.edit(statusEmbed);
        });
      } catch (err) {
        console.error(`Other Error: ${err}`);
      }
    });
  }

  if (config.autoUpdate.status.enabled == "true") {
    updateStatus();
    console.log(`[${DateTime.local().toFormat("hh:mm:ss")}] Updated Server Status Embed`);
  }

  setInterval(function () {
    if (config.autoUpdate.status.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.status.interval == 0) {
        updateStatus();
        console.log(`[${DateTime.local().toFormat("hh:mm:ss")}] Updated Server Status Embed`);
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
