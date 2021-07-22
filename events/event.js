const {client} = require("../ApexStats.js");
const config = require("../config.json");
const {MessageEmbed} = require("discord.js-light");
var {DateTime} = require("luxon");
const chalk = require("chalk");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

client.once("ready", () => {
  const guild = client.guilds.cache.get(config.autoUpdate.guildID);
  if (!guild) return console.log(chalk`{gray Unable to find guild for Event Updates.}`);

  function updateEvent() {
    let query = `SELECT * FROM ${config.SQL.eventTable} ORDER BY \`id\` DESC`;

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return message.channel.send(
          "There was an error connecting to the database. Please try again later."
        );
      }

      connection.query(query, function (err, result) {
        if (err) {
          connection.release();
          console.log(err);
          return message.channel.send(
            "There was a problem with the SQL syntax. Please try again later."
          );
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
          return DateTime.fromSeconds(timestamp).toFormat("cccc LLL dd, yyyy\nhh:mm a ZZZZ");
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
          .setTitle(`[Event Countdown] ${event.name} Event`)
          .setDescription(`${event.description}\n\n[Read the full article.](${event.blogURL})`)
          .addField("Start Time", `${formatDate(event.start)}\n${countdownURL(event.start)}`, true)
          .addField("End Time", `${formatDate(event.end)}\n${countdownURL(event.end)}`, true)
          .addField(
            "Countdown",
            `The **${event.name} Event** will start in ${time(event.start * 1000 - Date.now())}`
          )
          .setImage(`https://cdn.apexstats.dev/Events/${event.image}`)
          .setTimestamp();

        const eventEmbed = new MessageEmbed()
          .setTitle(`${event.name} Event`)
          .setDescription(`${event.description}\n\n[Read the full article.](${event.blogURL})`)
          .addField("Start Time", formatDate(event.start), true)
          .addField("End Time", `${formatDate(event.end)}\n${countdownURL(event.end)}`, true)
          .addField(
            "Countdown",
            `The **${event.name} Event** will end in ${time(event.end * 1000 - Date.now())}`
          )
          .setImage(`https://cdn.apexstats.dev/Events/${event.image}`)
          .setTimestamp();

        const noEventEmbed = new MessageEmbed()
          .setTitle("No Active Event")
          .setDescription("There is no currently active event. Check back another time!")
          .setImage("https://cdn.apexstats.dev/Events/NoEvent.png")
          .setTimestamp();

        const guild = client.guilds.cache.get(config.autoUpdate.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.autoUpdate.event.channel && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(config.autoUpdate.event.message);
          if (!message) return console.log("Unable to find message.");

          channel.messages.fetch(config.autoUpdate.event.message).then((msg) => {
            if (checkTime() == 0) msg.edit(eventEmbed);

            if (checkTime() == 1) msg.edit(preEventEmbed);

            if (checkTime() == 2) msg.edit(noEventEmbed);
          });

          console.log(
            chalk`{blueBright [${DateTime.local().toFormat("hh:mm:ss")}] Updated Event Embed}`
          );

          connection.release();
        } catch (err) {
          console.error(`Other Error: ${err}`);
        }
      });
    });
  }

  if (config.autoUpdate.event.enabled == "true") updateEvent();

  setInterval(function () {
    if (config.autoUpdate.event.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.event.interval == 0) {
        updateEvent();
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
