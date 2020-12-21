const { client, Discord } = require("../ApexStats.js");
var { DateTime, Duration } = require("luxon");
const config = require("../config.json");
const axios = require("axios");
let mysql = require("mysql");

let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

// Require Wrapper Library
const MozambiqueAPI = require("mozambique-api-wrapper");

// Create Client instance by passing in API key
let mozambiqueClient = new MozambiqueAPI(config.APIKey);

// Top.GG API
const DBL = require("dblapi.js");

if (config.topGG == "0") {
  console.log("Don't send data to Top.GG");
} else {
  const dbl = new DBL(config.topGG, client);
  dbl.on("posted", () => {
    console.log("Server count posted!");
  });
}

client.once("ready", () => {
  console.log(`Logging in as ${client.user.tag}`);

  function setPresence() {
    client.user
      .setPresence({
        activity: {
          name: `${config.prefix}commands | Providing data for ${client.guilds.cache.size} servers`,
          type: "WATCHING",
        },
        status: "online",
      })
      .catch(console.error);
  }

  // Set intitial bot presence on load, otherwise presence
  // will be empty until the next update
  setPresence();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
      client.user.tag
    }`
  );

  // Update the bot presence every 30 minutes to update
  // the amount of servers the bot is in
  setInterval(function () {
    setPresence();
    console.log(
      `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
        client.user.tag
      }`
    );
  }, Math.max(1, 30 || 1) * 60 * 1000);

  // ----- APEX MAP ROTATION UPDATE ----- //
  function updateMapRotation() {
    axios
      .get("https://fn.alphaleagues.com/v1/apex/map/")
      .then((res) => {
        function mapImage(name) {
          if (name == "Olympus") {
            return `Olympus.png?q=${DateTime.local().toFormat("X")}`;
          } else if (name == "World's Edge") {
            return `WorldsEdge.png?q=${DateTime.local().toFormat("X")}`;
          } else {
            return `NoMapData.png?q=${DateTime.local().toFormat("X")}`;
          }
        }

        function nextMap(name) {
          if (name == "Olympus") {
            return "World's Edge";
          } else if (name == "World's Edge") {
            return "Olympus";
          }
        }

        function time(seconds) {
          return DateTime.local()
            .plus({ seconds: seconds })
            .toRelative({ style: "long" });
        }

        const mapRotation = new Discord.MessageEmbed()
          .setDescription(
            `The current map is **${
              res.data.map
            }**.\nThe next map in rotation is **${nextMap(res.data.map)} ${time(
              res.data.times.remaining.seconds
            )}.**`
          )
          .setImage(
            `https://sdcore.dev/cdn/ApexStats/Maps/${mapImage(res.data.map)}`
          )
          .setTimestamp();

        const guild = client.guilds.cache.get(config.mapRotation.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.mapRotation.channelID && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(config.mapRotation.messageID);
          if (!message) return console.log("Unable to find message.");

          channel.messages.fetch(config.mapRotation.messageID).then((mesg) => {
            mesg.edit(mapRotation);
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateMapRotation();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`
  );

  setInterval(function () {
    var date = new Date();

    console.log("Checking update interval...");

    if (date.getMinutes() % config.mapRotation.updateInterval == 0) {
      updateMapRotation();
      console.log(
        `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`
      );
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);

  // ----- APEX INFO UPDATE ----- //
  function updateApexInfo() {
    if (config.apexInfo.enabled == "true") {
      mozambiqueClient
        .news()
        .then(function (result) {
          const news = new Discord.MessageEmbed()
            .setTitle(result[0].title)
            .setURL(result[0].link)
            .setDescription(
              `${result[0].short_desc}\n\n**[Link to Full Article](${result[0].link})**`
            )
            .setImage(result[0].img)
            .setFooter(`Data provided by https://apexlegendsapi.com`)
            .setTimestamp();

          const guild = client.guilds.cache.get(config.apexInfo.guildID);
          if (!guild) return console.log("Unable to find guild.");

          const channel = guild.channels.cache.find(
            (c) => c.id === config.apexInfo.channelID && c.type === "text"
          );
          if (!channel) return console.log("Unable to find channel.");

          try {
            const message = channel.messages.fetch(config.apexInfo.messageID);
            if (!message) return console.log("Unable to find message.");

            channel.messages.fetch(config.apexInfo.messageID).then((mesg) => {
              mesg.edit(news);
            });
          } catch (err) {
            console.error(err);
          }
        })
        .catch(function (e) {
          msg.delete();
          msg.channel.send(
            "Could not retreive latest article. Please try again later."
          );
          console.log(e);
        });
    } else {
      console.log("Apex Info Update is disabled. Enable it in the config.");
    }
  }

  if (config.apexInfo.enabled == "true") {
    updateApexInfo();
    console.log(
      `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Apex Info Embed`
    );
  }

  setInterval(function () {
    if (config.apexInfo.enabled == "true") {
      var date = new Date();

      console.log("Checking update interval...");

      if (date.getMinutes() % config.apexInfo.updateInterval == 0) {
        updateApexInfo();
        console.log(
          `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Apex Info Embed`
        );
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);

  function updateEventInfo() {
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

        const guild = client.guilds.cache.get(config.apexInfo.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.apexInfo.channelID && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(config.apexInfo.messageID);
          if (!message) return console.log("Unable to find message.");

          channel.messages.fetch(config.apexInfo.messageID).then((mesg) => {
            // end date test 2021-01-04T18:00:00+0000

            if (dateMath <= 0) {
              mesg.edit(event);
            } else {
              mesg.edit(noEvent);
            }
          });
        } catch (err) {
          console.error(err);
        }
      });
    });
  }

  updateEventInfo();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Event Info Embed`
  );

  setInterval(function () {
    if (config.eventInfo.enabled == "true") {
      var date = new Date();

      console.log("Checking update interval...");

      if (date.getMinutes() % config.eventInfo.updateInterval == 0) {
        updateEventInfo();
        console.log(
          `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Event Info Embed`
        );
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
