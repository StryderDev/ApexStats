const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed, Message} = require("discord.js");
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
        },
      ],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg, {name}) {
    if (checkMsg(msg) == 1) return;

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

        // TODO: Add icons for recon/scout/medic/whatever and add them to embed title

        const legendEmbed = new MessageEmbed()
          .setTitle(
            `${legend.type} <:onlineMiddle:836526063290810429> ${legend.name} (${legend.realName}) - ${legend.tagline}`
          )
          .setDescription(`*${legend.introLine}*\n\n${legend.description}`);

        msg.say(legendEmbed);
      });
    });
  }
};
