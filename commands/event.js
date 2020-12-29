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
  name: "event",
  description:
    "Shows information about the current in-game event (if there is one).",
  execute(message) {
    let query = `SELECT * FROM ${config.SQL.eventTable} ORDER BY \`id\` DESC`;

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

        var event = results[0];

        var countdown = DateTime.fromISO(event.eventEnd, {
          zone: "America/Los_Angeles",
        }).toFormat("hh:mma_d_LLLL_yyyy_ZZZZ");

        var currentTime = DateTime.local().toMillis();
        var endDate = DateTime.fromISO(event.eventEnd).toMillis();

        var dateMath = currentTime - endDate;
        var realDateMath = endDate - currentTime;

        function time(milliseconds) {
          return DateTime.local()
            .plus({ milliseconds: milliseconds })
            .toRelative({ style: "long" });
        }

        const eventEmbed = new Discord.MessageEmbed()
          .setTitle(`${event.eventName} Event`)
          .setDescription(
            `${event.eventDescription}\n\n[Read the full article.](${event.blogURL})`
          )
          .addField(
            "Event Start",
            `${DateTime.fromISO(event.eventStart, {
              zone: "America/Los_Angeles",
            }).toFormat("cccc LLLL d, yyyy\nhh:mm a ZZZZ")}`,
            true
          )
          .addField(
            "Event End",
            `${DateTime.fromISO(event.eventEnd, {
              zone: "America/Los_Angeles",
            }).toFormat(
              "cccc LLLL d, yyyy\nhh:mm a ZZZZ"
            )}\n[Countdown in Your Timezone](https://time.is/countdown/${countdown})`,
            true
          )
          .addField(
            "Countdown",
            `The **${event.eventName} Event** will end **${time(
              realDateMath
            )}**`
          )
          .setImage(`https://sdcore.dev/cdn/ApexStats/Events/${event.imageURL}`)
          .setTimestamp();

        const noEventEmbed = new Discord.MessageEmbed()
          .setTitle("No Active Event")
          .setDescription(
            "There is no currently active event. Check back another time!"
          )
          .setImage("https://sdcore.dev/cdn/ApexStats/Events/NoEvent.png")
          .setTimestamp();

        if (dateMath <= 0) {
          message.channel.send(eventEmbed);
        } else {
          message.channel.send(noEventEmbed);
        }

        connection.release();
      });
    });
  },
};
