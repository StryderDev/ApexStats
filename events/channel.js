const {client} = require("../ApexStats.js");
const axios = require("axios");
const config = require("../config.json");
const chalk = require("chalk");

var {DateTime} = require("luxon");

client.once("ready", () => {
  function updateStatus() {
    statusURL = `https://api.mozambiquehe.re/servers?auth=${config.MozambiqueAPI}`;

    var status = axios.get(statusURL);

    axios.all([status]).then(
      axios.spread((...responses) => {
        // Response Data
        var originResult = responses[0].data["Origin_login"];
        var novaResult = responses[0].data["EA_novafusion"];
        var accountsResult = responses[0].data["EA_accounts"];
        var OauthCrossplay = responses[0].data["ApexOauth_Crossplay"];

        function checkOrigin() {
          if (originResult["EU-West"].Status != "UP") var EUWest = 0.1;
          else var EUWest = 0;

          if (originResult["EU-East"].Status != "UP") var EUEast = 0.1;
          else var EUEast = 0;

          if (originResult["US-West"].Status != "UP") var USWest = 0.1;
          else var USWest = 0;

          if (originResult["US-East"].Status != "UP") var USEast = 0.1;
          else var USEast = 0;

          if (originResult["US-Central"].Status != "UP") var USCentral = 0.1;
          else var USCentral = 0;

          if (originResult["SouthAmerica"].Status != "UP") var SouthAmerica = 0.1;
          else var SouthAmerica = 0;

          if (originResult["Asia"].Status != "UP") var Asia = 0.1;
          else var Asia = 0;

          return EUWest + EUEast + USWest + USEast + USCentral + SouthAmerica + Asia;
        }

        function checkNova() {
          if (novaResult["EU-West"].Status != "UP") var EUWest = 0.1;
          else var EUWest = 0;

          if (novaResult["EU-East"].Status != "UP") var EUEast = 0.1;
          else var EUEast = 0;

          if (novaResult["US-West"].Status != "UP") var USWest = 0.1;
          else var USWest = 0;

          if (novaResult["US-East"].Status != "UP") var USEast = 0.1;
          else var USEast = 0;

          if (novaResult["US-Central"].Status != "UP") var USCentral = 0.1;
          else var USCentral = 0;

          if (novaResult["SouthAmerica"].Status != "UP") var SouthAmerica = 0.1;
          else var SouthAmerica = 0;

          if (novaResult["Asia"].Status != "UP") var Asia = 0.1;
          else var Asia = 0;

          return EUWest + EUEast + USWest + USEast + USCentral + SouthAmerica + Asia;
        }

        function checkAccounts() {
          if (accountsResult["EU-West"].Status != "UP") var EUWest = 0.1;
          else var EUWest = 0;

          if (accountsResult["EU-East"].Status != "UP") var EUEast = 0.1;
          else var EUEast = 0;

          if (accountsResult["US-West"].Status != "UP") var USWest = 0.1;
          else var USWest = 0;

          if (accountsResult["US-East"].Status != "UP") var USEast = 0.1;
          else var USEast = 0;

          if (accountsResult["US-Central"].Status != "UP") var USCentral = 0.1;
          else var USCentral = 0;

          if (accountsResult["SouthAmerica"].Status != "UP") var SouthAmerica = 0.1;
          else var SouthAmerica = 0;

          if (accountsResult["Asia"].Status != "UP") var Asia = 0.1;
          else var Asia = 0;

          return EUWest + EUEast + USWest + USEast + USCentral + SouthAmerica + Asia;
        }

        function checkCrossplay() {
          if (OauthCrossplay["EU-West"].Status != "UP") var EUWest = 0.1;
          else var EUWest = 0;

          if (OauthCrossplay["EU-East"].Status != "UP") var EUEast = 0.1;
          else var EUEast = 0;

          if (OauthCrossplay["US-West"].Status != "UP") var USWest = 0.1;
          else var USWest = 0;

          if (OauthCrossplay["US-East"].Status != "UP") var USEast = 0.1;
          else var USEast = 0;

          if (OauthCrossplay["US-Central"].Status != "UP") var USCentral = 0.1;
          else var USCentral = 0;

          if (OauthCrossplay["SouthAmerica"].Status != "UP") var SouthAmerica = 0.1;
          else var SouthAmerica = 0;

          if (OauthCrossplay["Asia"].Status != "UP") var Asia = 0.1;
          else var Asia = 0;

          return EUWest + EUEast + USWest + USEast + USCentral + SouthAmerica + Asia;
        }

        function statusSum() {
          var sum = checkOrigin() + checkNova() + checkAccounts() + checkCrossplay();

          return sum;
        }

        if (statusSum() > 1.8) {
          var statusEmoji = "🔴";
        } else if (statusSum() > 1) {
          var statusEmoji = "🟡";
        } else {
          var statusEmoji = "🟢";
        }

        const guild = client.guilds.cache.get(config.autoUpdate.guildID);
        if (!guild) return console.log(chalk`{red Unable to find guild.}`);

        const channel = guild.channels.cache.find(
          (c) => c.id === config.autoUpdate.channelStatus.channel && c.type === "text"
        );
        if (!channel) return console.log(chalk`{red Unable to find channel.}`);

        try {
          var channelName = client.channels.cache.get(config.autoUpdate.channelStatus.channel);
          channelName.setName(`${statusEmoji}-game-status`);

          console.log(
            chalk`{blueBright [${DateTime.local().toFormat(
              "hh:mm:ss"
            )}] Updated Channel Status Indicator}`
          );
        } catch (err) {
          console.error(`Other Error: ${err}`);
        }
      })
    );
  }

  if (config.autoUpdate.channelStatus.enabled == "true") updateStatus();

  setInterval(function () {
    if (config.autoUpdate.channelStatus.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.channelStatus.interval == 0) {
        updateStatus();
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
