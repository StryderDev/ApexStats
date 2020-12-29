const { Discord } = require("../ApexStats.js");
const config = require("../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

var { DateTime } = require("luxon");

module.exports = {
  name: "legend",
  description:
    "Information about a legend such as their biography, age, home world, and abilities.",
  execute(message, args) {
    if (!args.length)
      return message.channel.send("Please provide a legend name.");

    var legend = args[0].toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

    // List of current supported legends
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
    ];

    if (legends.indexOf(legend) == -1)
      return message.channel.send(
        "Seems that legend isn't in our database yet."
      );

    let query = `SELECT * FROM ${
      config.SQL.legendTable
    } WHERE \`name\` = ${mysql.escape(legend)}`;

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return message.channel.send(
          "There was an error connecting to the database. Please try again later."
        );
      }

      connection.query(query, function (err, results, fields) {
        if (err) {
          connection.release();
          console.log(err);
          return message.channel.send(
            "There was a problem with the SQL syntax. Please try again later."
          );
        }

        var currentTimestamp = Math.floor(DateTime.local().toFormat("X") / 2);

        const legendEmbed = new Discord.MessageEmbed()
          .setTitle(`${results[0].name} - ${results[0].tagline}`)
          .setColor(results[0].hex)
          .setDescription(results[0].description)
          .addField("Entry Season", `Season ${results[0].season}`, true)
          .addField("Age", results[0].age, true)
          .addField("Home World", results[0].homeWorld, true)
          .addField(
            "Passive",
            `<:${results[0].shortName}Passive:${results[0].passiveEmote}> ${results[0].passive}`,
            true
          )
          .addField(
            "Tactical",
            `<:${results[0].shortName}Tactical:${results[0].tacticalEmote}> ${results[0].tactical}`,
            true
          )
          .addField(
            "Ultimate",
            `<:${results[0].shortName}Ultimate:${results[0].ultimateEmote}> ${results[0].ultimate}`,
            true
          )
          .setImage(
            `https://sdcore.dev/cdn/ApexStats/LegendBanners/${results[0].name}.png?q=${currentTimestamp}`
          );

        message.channel.send(legendEmbed);
        connection.release();
      });
    });
  },
};
