const {Discord} = require("../ApexStats.js");
const config = require("../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

var {DateTime} = require("luxon");

module.exports = {
  name: "algs",
  description: "Shows information about ALGS (if there's future events).",
  execute(message) {
    let query = `SELECT * FROM ${config.SQL.ALGSTable} ORDER BY \`id\` DESC`;

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return message.channel.send(
          "There was an error connecting to the database. Please try again later."
        );
      }

      connection.query(query, function (err, results) {
        if (err) {
          connection.release();
          console.log(err);
          return message.channel.send(
            "There was a problem with the SQL syntax. Please try again later."
          );
        }

        var ALGS = results[0];

        const ALGSEmbed = new Discord.MessageEmbed()
          .setTitle(ALGS.title)
          .setDescription(ALGS.description)
          .addField("Useful Links", ALGS.links, true)
          .addField("Official Site", ALGS.external, true)
          .addField("Countdown", `The **${ALGS.title} Event** will start on ${ALGS.date}.`);

        message.channel.send(ALGSEmbed);

        //if (timeTillDate >= 0) {
        //  message.channel.send(preEventEmbed);
        //} else if (dateMath <= 0) {
        //  message.channel.send(eventEmbed);
        //} else {
        //  message.channel.send(noEventEmbed);
        //}

        connection.release();
      });
    });
  },
};
