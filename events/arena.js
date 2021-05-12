const {client} = require("../ApexStats.js");
const chalk = require("chalk");
const {DateTime, Duration} = require("luxon");
const axios = require("axios");
const config = require("../config.json");
const {MessageEmbed} = require("discord.js");

client.once("ready", () => {
  function updateArena() {
    axios
      .get(`https://api.mozambiquehe.re/maprotation?version=2&auth=${config.MozambiqueAPI}`)
      .then((result) => {
        var arena = result.data.arenas;

        const pluralize = (count, noun, suffix = "s") =>
          `${count} ${noun}${count !== 1 ? suffix : ""}`;

        function getTime(time) {
          var now = DateTime.local();
          var nowSeconds = Math.floor(DateTime.local().toSeconds());
          var math = time - nowSeconds;
          var future = DateTime.local().plus({seconds: math + 60});

          var timeUntil = future.diff(now, ["hours", "minutes", "seconds"]);

          var time = timeUntil.toObject();

          return pluralize(time.minutes, "minute");
        }

        function mapImage(map) {
          var mapName = map
            .replace(
              /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
              ""
            )
            .replace(/\s/g, "");

          return mapName;
        }

        function mapName(name) {
          if (name == "Phase runner") return "Phase Runner";
          if (name == "Party crasher") return "Party Crasher";
          if (name == "Thermal station") return "Thermal Station";

          return name;
        }

        const mapEmbed = new MessageEmbed()
          .setDescription(
            `:map: The current arena map is **${mapName(arena.current.map)}** for ${getTime(
              arena.current.end
            )}.\n:clock1: The next map is **${mapName(arena.next.map)}**.`
          )
          .setImage(
            `https://cdn.apexstats.dev/Maps/Season%209/Arena_${mapImage(
              mapName(arena.current.map)
            )}_01.gif`
          )
          .setTimestamp()
          .setFooter("Provided by https://apexlegendsapi.com/");

        const guild = client.guilds.cache.get(config.autoUpdate.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.autoUpdate.arena.channel && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(config.autoUpdate.arena.message);
          if (!message) return console.log("Unable to find message.");

          channel.messages.fetch(config.autoUpdate.arena.message).then((msg) => {
            msg.edit(mapEmbed);
          });

          console.log(
            chalk`{blueBright [${DateTime.local().toFormat(
              "hh:mm:ss"
            )}] Updated map embed, set map to ${arena.next.map}}`
          );
        } catch (err) {
          console.error(`Other Error: ${err}`);
        }
      });
  }

  if (config.autoUpdate.arena.enabled == "true") updateArena();

  setInterval(function () {
    if (config.autoUpdate.arena.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.arena.interval == 0) {
        updateArena();
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
