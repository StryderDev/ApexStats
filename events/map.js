const {client} = require("../ApexStats.js");
const chalk = require("chalk");
const {DateTime, Duration} = require("luxon");
const axios = require("axios");
const config = require("../config.json");
const {MessageEmbed} = require("discord.js");

client.once("ready", () => {
  const guild = client.guilds.cache.get(config.autoUpdate.guildID);
  if (!guild) return console.log(chalk`{gray Unable to find guild for Map Updates.}`);

  function updateMap() {
    axios.get("https://fn.alphaleagues.com/v1/apex/map/?next=1").then((result) => {
      var map = result.data;
      var next = map.next;

      const pluralize = (count, noun, suffix = "s") =>
        `${count} ${noun}${count !== 1 ? suffix : ""}`;

      function getTime(time) {
        var now = DateTime.local();
        var nowSeconds = Math.floor(DateTime.local().toSeconds());
        var math = time - nowSeconds;
        var future = DateTime.local().plus({seconds: math + 60});

        var timeUntil = future.diff(now, ["hours", "minutes", "seconds"]);

        var time = timeUntil.toObject();

        return `${pluralize(time.hours, "hour")}, ${pluralize(time.minutes, "minute")}`;
      }

      function mapImage(map) {
        var maps = ["Kings Canyon", "World's Edge", "Olympus"];
        var mapName = map
          .replace(
            /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
            ""
          )
          .replace(/\s/g, "");

        if (maps.indexOf(map) != -1) {
          // _01 for Ranked Split 1
          // _02 for Ranked Split 2
          return `Season%209/${mapName}_02.gif`;
        } else {
          return "NoMapData.png";
        }
      }

      const mapEmbed = new MessageEmbed()
        .setDescription(
          `:map: The current map is **${map.map}** for ${getTime(
            map.times.nextMap
          )}.\n:clock1: The next map is **${next[0].map}** and lasts for ${Duration.fromMillis(
            next[0].duration * 60 * 1000
          ).toFormat(
            "h'h,' m'm.'"
          )}\n<:ApexPredator:787174770730336286> The current ranked map is **Olympus**.`
        )
        .setImage(`https://cdn.apexstats.dev/Maps/${mapImage(map.map)}`)
        .setTimestamp()
        .setFooter("Provided by https://rexx.live/");

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
          msg.edit(mapEmbed);
        });

        console.log(
          chalk`{blueBright [${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Embed}`
        );
      } catch (err) {
        console.error(`Other Error: ${err}`);
      }
    });
  }

  if (config.autoUpdate.map.enabled == "true") updateMap();

  setInterval(function () {
    if (config.autoUpdate.map.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.map.interval == 0) {
        updateMap();
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
