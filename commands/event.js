let mysql = require("mysql");
const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");
var { DateTime } = require("luxon");

let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

module.exports = {
  name: "event",
  description: "Info about the current in-game event.",
  execute(message, args) {
    let sql = `SELECT * FROM ${config.SQL.eventTable} ORDER BY \`id\` DESC`;

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        console.log(
          "There was a problem with our database. If this problem persists, please contact a mod."
        );
      }

      connection.query(sql, function (err, results, fields) {
        if (err) {
          connection.release();
          console.log(err);
          console.log(
            "There was a problem with our database. If this problem persists, please contact a mod."
          );
        }

        // URL to construct
        // https://time.is/countdown/10:00am_4_january_2021_pst

        var timeisDate = DateTime.fromISO(results[0].eventEnd, {
          zone: "America/Los_Angeles",
        }).toFormat("hh:mma_d_LLLL_yyyy_ZZZZ");

        var currentDate = DateTime.local().toMillis();
        var endDate = DateTime.fromISO(results[0].eventEnd).toMillis();

        var dateMath = currentDate - endDate;
        var realDateMath = endDate - currentDate;

        function time(milliseconds) {
          return DateTime.local()
            .plus({ milliseconds: milliseconds })
            .toRelative({ style: "long" });
        }

        const event = new Discord.MessageEmbed()
          .setTitle(`${results[0].eventName}`)
          .setDescription(
            `${results[0].eventDescription}\n\n[Read the full article here.](${results[0].blogURL})`
          )
          .addField(
            "Event Start",
            `${DateTime.fromISO(results[0].eventStart, {
              zone: "America/Los_Angeles",
            }).toFormat("cccc, LLLL d, yyyy\nhh:mm a ZZZZ")}`,
            true
          )
          .addField(
            "Event End",
            `${DateTime.fromISO(results[0].eventEnd, {
              zone: "America/Los_Angeles",
            }).toFormat(
              "cccc, LLLL d, yyyy\nhh:mm a ZZZZ"
            )}\n[Countdown in Your Timezone](https://time.is/countdown/${timeisDate})`,
            true
          )
          .addField(
            "Countdown",
            `The **${results[0].eventName}** event will end **${time(
              realDateMath
            )}**.`
          )
          .setImage(
            `https://sdcore.dev/cdn/ApexStats/Events/${results[0].imageURL}`
          )
          .setTimestamp();

        const noEvent = new Discord.MessageEmbed()
          .setTitle(`No Active Event`)
          .setDescription(
            `There is no active event. Check back another time to see if there is an active event!`
          )
          .setImage(`https://sdcore.dev/cdn/ApexStats/Events/NoEvent.png`)
          .setTimestamp();

        if (dateMath <= 0) {
          message.channel.send(event);
        } else {
          message.channel.send(noEvent);
        }
      });
    });
  },
};
