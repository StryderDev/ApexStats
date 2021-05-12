const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js");
const axios = require("axios");
var {DateTime, Duration} = require("luxon");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "arenas",
      aliases: ["arena"],
      group: "utility",
      memberName: "arenas",
      description: "Shows current and future in-game arena rotations.",
      examples: ["arena"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

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

    msg.say("Retrieving in-game arena rotation schedule...").then(async (message) => {
      // Just show current map
      axios
        .get(`https://api.mozambiquehe.re/maprotation?version=2&auth=${config.MozambiqueAPI}`)
        .then((result) => {
          var arena = result.data.arenas;

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
            .setFooter("Provided by https://apexlegendsapi.com/");

          message.delete();
          message.embed(mapEmbed);
        });
    });
  }
};
