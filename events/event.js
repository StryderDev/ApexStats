const { client, Discord } = require("../ApexStats.js");
const config = require("../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

var { DateTime } = require("luxon");

client.once("ready", () => {
  function updateEventInfo() {
    let query = `SELECT * FROM ${config.SQL.eventTable} ORDER BY \`id\` DESC`;

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

        var event = results[0];

        var countdown = DateTime.fromISO(event.eventEnd, {
          zone: "America/Los_Angeles",
        }).toFormat("hh:mma_d_LLLL_yyyy_ZZZZ");

        var currentTime = DateTime.local().toMillis();
        var startDate = DateTime.fromISO(event.eventStart).toMillis();
        var endDate = DateTime.fromISO(event.eventEnd).toMillis();

        var dateMath = currentTime - endDate;
        var realDateMath = endDate - currentTime;
        var timeTillDate = startDate - currentTime;

        function time(milliseconds) {
          var currentDate = DateTime.local();
          var fixMilliseconds = milliseconds + 6000;
          var futureDate = DateTime.local().plus({
            milliseconds: fixMilliseconds,
          });

          var timeTill = futureDate.diff(currentDate, [
            "days",
            "hours",
            "minutes",
            "seconds",
          ]);

          var finalTime = timeTill.toObject();

          const pluralize = (count, noun, suffix = "s") =>
            `${count} ${noun}${count !== 1 ? suffix : ""}`;

          return `${pluralize(
            finalTime.days,
            "day"
          )}, ${pluralize(finalTime.hours, "hour")}, ${pluralize(finalTime.minutes, "minute")}.`;
        }

        function formatDate(date) {
          return DateTime.fromISO(date, {
            zone: "America/Los_Angeles",
          }).toFormat("cccc LLLL d, yyyy\nhh:mm a ZZZZ");
        }

        function getCountdownURL(date) {
          return `https://time.is/countdown/${DateTime.fromISO(date, {
            zone: "America/Los_Angeles",
          }).toFormat("hh:mma_d_LLLL_yyyy_ZZZZ")}`;
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

        const preEventEmbed = new Discord.MessageEmbed()
          .setTitle(`[Event Countdown] ${event.eventName} Event`)
          .setDescription(
            `${event.eventDescription}\n\n[Read the full article.](${event.blogURL})`
          )
          .addField(
            "Event Start",
            `${formatDate(
              event.eventStart
            )}\n[Countdown in Your Timezone](${getCountdownURL(
              event.eventStart
            )})`,
            true
          )
          .addField(
            "Event End",
            `${formatDate(
              event.eventEnd
            )}\n[Countdown in Your Timezone](${getCountdownURL(
              event.eventEnd
            )})`,
            true
          )
          .addField(
            "Countdown",
            `The **${event.eventName} Event** will start **${time(
              timeTillDate
            )}**.`
          )
          .setImage(`https://sdcore.dev/cdn/ApexStats/Events/${event.imageURL}`)
          .setTimestamp();

        const guild = client.guilds.cache.get(config.autoUpdate.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.autoUpdate.event.channel && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(
            config.autoUpdate.event.message
          );
          if (!message) return console.log("Unable to find message.");

          channel.messages
            .fetch(config.autoUpdate.event.message)
            .then((msg) => {
              if (timeTillDate >= 0) {
                msg.edit(preEventEmbed);
              } else if (dateMath <= 0) {
                msg.edit(eventEmbed);
              } else {
                msg.edit(noEventEmbed);
              }
            });

          connection.release();
        } catch (err) {
          console.error(`Other Error: ${err}`);
        }
      });
    });
  }

  if (config.autoUpdate.event.enabled == "true") {
    updateEventInfo();
    console.log(
      `[${DateTime.local().toFormat(
        "hh:mm:ss"
      )}] Updated Event Information Embed`
    );
  }

  setInterval(function () {
    if (config.autoUpdate.event.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.event.interval == 0) {
        updateEventInfo();
        console.log(
          `[${DateTime.local().toFormat(
            "hh:mm:ss"
          )}] Updated Event Information Embed`
        );
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
