const {client, Discord} = require("../ApexStats.js");
var {DateTime} = require("luxon");
const config = require("../config.json");
const axios = require("axios");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

client.once("ready", () => {
  // ----- APEX MAP ROTATION UPDATE ----- //
  function updateMapRotation() {
    let query = `SELECT * FROM ${config.SQL.mapEventTable} ORDER BY \`id\` DESC LIMIT 1`;
    var mapURL = "https://fn.alphaleagues.com/v1/apex/map/?next=1";

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

        axios.get("https://fn.alphaleagues.com/v1/apex/map/?next=1").then((result) => {
          var event = results[0];
          var map = result.data;
          var nextMap = map.next[0];
          var nextMaps = map.next;
          var currentTimestamp = Math.floor(DateTime.local().toFormat("ooo"));

          function mapImage(name) {
            var maps = ["Kings Canyon", "World's Edge", "Olympus"];

            if (name.includes("Olympus")) {
              var mapName = "Olympus";
            } else if (name.includes("World's")) {
              var mapName = "World's Edge";
            } else if (name.includes("Kings")) {
              var mapName = "Kings Canyon";
            } else {
              var mapName = name;
            }

            if (maps.indexOf(mapName) != -1) {
              if (mapName == "World's Edge") {
                return "Season%208/WorldsEdge";
              } else if (mapName == "Kings Canyon") {
                return "Season%208/KingsCanyon";
              } else if (mapName == "Olympus") {
                return "Season%208/Olympus";
              }

              return mapName;
            } else {
              return "NoMapData";
            }
          }

          function getMapName(name) {
            if (name.includes("Olympus")) {
              return (mapName = "Olympus");
            } else if (name.includes("World's")) {
              return (mapName = "World's Edge");
            } else if (name.includes("Kings") || name.includes("King's")) {
              return (mapName = "Kings Canyon");
            } else {
              return (mapName = name);
            }
          }

          function time(seconds) {
            var currentDate = DateTime.local();
            var futureDate = DateTime.local().plus({
              seconds: seconds,
            });

            var timeTill = futureDate.diff(currentDate, ["hours", "minutes", "seconds"]);

            var finalTime = timeTill.toObject();

            const pluralize = (count, noun, suffix = "s") =>
              `${count} ${noun}${count !== 1 ? suffix : ""}`;

            return `${pluralize(finalTime.hours, "hour")}, ${pluralize(
              finalTime.minutes,
              "minute"
            )}`;
          }

          function getMapCountdown(startTime) {
            var currentTime = DateTime.local().toMillis() / 1000;

            return time(startTime - currentTime);
          }

          function getMap() {
            return nextMaps.map(
              (x) =>
                `**${x.map}**\n**Duration**: ${
                  x.duration
                } minutes.\n**Starts in:** ${getMapCountdown(x.timestamp)}\n`
            );
          }

          function mapEventChecker() {
            var currentTime = Math.floor(DateTime.local().toSeconds());

            if (event.timeStart < currentTime && event.timeEnd > currentTime) {
              return mapEventEmbed;
            } else {
              return mapEmbed;
            }
          }

          const mapEmbed = new Discord.MessageEmbed()
            .setDescription(
              `The current map is **${getMapName(map.map)}**.\nThe next map is **${getMapName(
                nextMap.map
              )}** in **${time(map.times.remaining.seconds)}** which will last for **${
                nextMap.duration
              } minutes**.`
            )
            .setImage(
              `https://cdn.apexstats.dev/Maps/${mapImage(map.map)}.png?q=${currentTimestamp}`
            )
            .setFooter("Provided by https://rexx.live");

          const mapEventEmbed = new Discord.MessageEmbed()
            .setTitle(`Map Rotations Disabled - ${getMapName(event.mapName)}`)
            .setDescription(
              `**${
                event.eventName
              } Active** - All in-game map rotations are disabled for another **${getMapCountdown(
                event.timeEnd
              )}**.`
            )
            .setImage(
              `https://cdn.apexstats.dev/Maps/${mapImage(event.mapName)}.png?q=${currentTimestamp}`
            )
            .setFooter("Provided by https://rexx.live")
            .setTimestamp();

          const guild = client.guilds.cache.get(config.autoUpdate.guildID);
          if (!guild) return console.log("Unable to find guild.");

          const channel = guild.channels.cache.find(
            (c) => c.id === config.autoUpdate.map.channel && c.type === "text"
          );
          if (!channel) return console.log("Unable to find channel.");

          try {
            const message = channel.messages.fetch(config.autoUpdate.map.message);
            if (!message) return console.log("Unable to find message.");

            channel.messages.fetch(config.autoUpdate.map.message).then((msg) => {
              msg.edit(mapEventChecker());
            });
          } catch (err) {
            console.error(`Other Error: ${err}`);
          }
        });
      });
    });
  }

  if (config.autoUpdate.map.enabled == "true") {
    updateMapRotation();
    console.log(`[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`);
  }

  setInterval(function () {
    if (config.autoUpdate.map.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.map.interval == 0) {
        updateMapRotation();
        console.log(`[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`);
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
