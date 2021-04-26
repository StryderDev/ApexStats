const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed, Message} = require("discord.js");
const axios = require("axios");
var {DateTime, Duration} = require("luxon");
const {checkMsg} = require("../functions/checkMsg.js");

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

    Message.channel.send("Retrieving server status...").then(async, (msg) => {
      statusURL = `https://api.mozambiquehe.re/servers?auth=${config.MozambiqueAPI}`;
      announcementURL = "https://apexlegendsstatus.com/anno.json";

      var status = axios.get(statusURL);
      var announcement = axios.get(announcementURL);

      axios.all([status, announcement]).then(axios.spread((...responses) => {}));
    });
  }
};
