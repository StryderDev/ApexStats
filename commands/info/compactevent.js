const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js-light");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");

let mysql = require("mysql");
const {DateTime} = require("luxon");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "compactevent",
      group: "info",
      memberName: "compactevent",
      description: "Shows compact information on current in-game events.",
      examples: ["compactevent"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    msg.channel.startTyping();

    let legendQuery = `SELECT * FROM ${config.SQL.eventTable} ORDER BY \`id\` DESC`;

    connection.getConnection(function (err, connection) {
      if (err) return console.log(chalk`{red ${err}}`);

      connection.query(legendQuery, function (err, result) {
        if (err) {
          connection.release();
          console.log(chalk`{red ${err}}`);
        }

        var event = result[0];

        function checkTime() {
          // Pre-Event CountDown
          if (event.start - Math.floor(Date.now() / 1000) >= 0) return 1;

          // After event/No current event
          if (event.end - Math.floor(Date.now() / 1000) <= 0) return 2;

          // Event is currently running
          return 0;
        }

        function formatDate(timestamp) {
          return DateTime.fromSeconds(timestamp, {zone: "America/Los_Angeles"}).toFormat(
            "cccc LLL dd, yyyy\nhh:mm a ZZZZ"
          );
        }

        function countdownURL(timestamp) {
          var time = DateTime.fromSeconds(timestamp).toFormat("hh:mma_d_LLLL_yyyy_ZZZZ");

          return `[Countdown in Your Timezone](https://time.is/countdown/${time})`;
        }

        // I don't want to change it in fear of
        // breaking it, but maybe make this...
        // better? in the future
        function time(milliseconds) {
          var currentDate = DateTime.local();
          var fixMilliseconds = milliseconds + 6000;
          var futureDate = DateTime.local().plus({
            milliseconds: fixMilliseconds,
          });

          var timeTill = futureDate.diff(currentDate, ["days", "hours", "minutes", "seconds"]);

          var finalTime = timeTill.toObject();

          const pluralize = (count, noun, suffix = "s") =>
            `${count} ${noun}${count !== 1 ? suffix : ""}`;

          return `${pluralize(
            finalTime.days,
            "day"
          )}, ${pluralize(finalTime.hours, "hour")}, ${pluralize(finalTime.minutes, "minute")}.`;
        }

        const preEventEmbed = new MessageEmbed()
          .setTitle(`${event.name} Event`)
          .setDescription(
            `[Read event article.](${event.blogURL})\nStarts in ${time(
              event.start * 1000 - Date.now()
            )}`
          )
          .addField("Start Time", `${formatDate(event.start)}\n${countdownURL(event.start)}`, true)
          .addField("End Time", `${formatDate(event.end)}\n${countdownURL(event.end)}`, true);

        const eventEmbed = new MessageEmbed()
          .setTitle(
            `${event.name} Event\nEnds in **${event.name} Event** will end in ${time(
              event.end * 1000 - Date.now()
            )}`
          )
          .setDescription(`${event.description}\n\n[Read the full article.](${event.blogURL})`)
          .addField("Start Time", formatDate(event.start), true)
          .addField("End Time", `${formatDate(event.end)}\n${countdownURL(event.end)}`, true);

        const noEventEmbed = new MessageEmbed()
          .setTitle("No Active Event")
          .setDescription("There is no currently active event.");

        if (checkTime() == 0) msg.say(eventEmbed);

        if (checkTime() == 1) msg.say(preEventEmbed);

        if (checkTime() == 2) msg.say(noEventEmbed);

        msg.channel.stopTyping();

        connection.release();
      });
    });
  }
};
