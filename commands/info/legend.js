const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js-light");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "legend",
      group: "info",
      memberName: "legend",
      description: "Shows information about specific legends.",
      examples: ["legend Octane"],
      args: [
        {
          key: "name",
          prompt: "Reply with the name of a legend from the current in-game roster.",
          type: "string",
          default: "Valkyrie",
        },
      ],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg, {name}) {
    if (checkMsg(msg) == 1) return;

    msg.channel.startTyping();

    var name = name.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

    var legends = [
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
      "Fuse",
      "Valkyrie",
    ];

    if (legends.indexOf(name) == -1) return msg.say("Seems that legend isn't in our database yet.");

    let legendQuery = `SELECT * FROM ${config.SQL.legendTable} WHERE \`name\` = ${mysql.escape(
      name
    )}`;

    connection.getConnection(function (err, connection) {
      if (err) return console.log(chalk`{red ${err}}`);

      connection.query(legendQuery, function (err, result) {
        if (err) {
          connection.release();
          console.log(chalk`{red ${err}}`);
        }

        var legend = result[0];

        function getType(type) {
          if (type == "Offensive") return "<:offensive:837590674743230464>";
          if (type == "Defensive") return "<:defensive:837590674945474631>";
          if (type == "Support") return "<:support:837590675045220352>";
          if (type == "Recon") return "<:recon:837590674882560020>";
        }

        const legendEmbed = new MessageEmbed()
          .setTitle(
            `${getType(legend.type)} ${legend.name} (${legend.realName}) - ${legend.tagline}`
          )
          .setColor(legend.hex)
          .setDescription(legend.description)
          .addField("Entry Season", legend.season, true)
          .addField("Age", legend.age, true)
          .addField("Home World", legend.homeWorld, true)
          .addField(
            "Passive",
            `<:${legend.shortName}Passive:${legend.passiveEmote}> ${legend.passive}`,
            true
          )
          .addField(
            "Tactical",
            `<:${legend.shortName}Tactical:${legend.tacticalEmote}> ${legend.tactical}`,
            true
          )
          .addField(
            "Ultimate",
            `<:${legend.shortName}Ultimate:${legend.ultimateEmote}> ${legend.ultimate}`,
            true
          )
          .setImage(`https://cdn.apexstats.dev/LegendBanners/${legend.name}.png`)
          .setFooter(legend.introLine);

        msg.say(legendEmbed);

        msg.channel.stopTyping();

        connection.release();
      });

      msg.channel.stopTyping();
    });
  }
};
