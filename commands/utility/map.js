const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js");
const axios = require("axios");
var {DateTime, Duration} = require("luxon");
const {checkMsg} = require("../functions/checkMsg.js");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "map",
      group: "utility",
      memberName: "map",
      description: "Shows current and future in-game map rotations.",
      examples: ["map, map 5"],
      args: [
        {
          key: "amount",
          prompt: "How many future map rotations do you want to see (up to 10)?",
          type: "string",
          default: "",
        },
      ],
    });
  }
  run(msg, {amount}) {
    if (checkMsg(msg) == 1) return;

    function lengthCheck(num) {
      if (!num) return 0;
      if (isNaN(num)) return 0;
      if (num >= 10) return 10;
      if (num <= 1) return 1;

      return num;
    }

    const pluralize = (count, noun, suffix = "s") => `${count} ${noun}${count !== 1 ? suffix : ""}`;

    function getTime(time) {
      var now = DateTime.local();
      var nowSeconds = Math.floor(DateTime.local().toSeconds());
      var math = time - nowSeconds;
      var future = DateTime.local().plus({seconds: math});

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
        return `Season%208/${mapName}_02`;
      } else {
        return "NoMapData";
      }
    }

    if (lengthCheck(amount) >= 1) {
      msg.say("Retrieving in-game map rotation schedule...").then(async (message) => {
        // Just show current map
        axios
          .get(`https://fn.alphaleagues.com/v1/apex/map/?next=${lengthCheck(amount)}`)
          .then((result) => {
            var nextMap = result.data.next;

            function nextMaps() {
              return nextMap.map(
                (x) =>
                  `**${x.map}**\nStarts in ${getTime(
                    x.timestamp
                  )} and lasts for ${Duration.fromMillis(x.duration * 60 * 1000).toFormat(
                    "h'h,' m'm.'"
                  )}\n`
              );
            }

            const mapEmbed = new MessageEmbed()
              .setDescription(nextMaps())
              .setFooter("Provided by https://rexx.live/");

            message.delete();
            message.embed(mapEmbed);
          });
      });
    } else {
      msg.say("Retrieving in-game map rotation schedule...").then(async (message) => {
        // Just show current map
        axios.get("https://fn.alphaleagues.com/v1/apex/map/?next=1").then((result) => {
          var map = result.data;
          var nextMap = result.data.next;

          const mapEmbed = new MessageEmbed()
            .setDescription(
              `:map: The current map is **${map.map}** for ${getTime(
                map.times.nextMap
              )}.\n:clock1: The next map is **${
                nextMap[0].map
              }** and lasts for ${Duration.fromMillis(nextMap[0].duration * 60 * 1000).toFormat(
                "h'h,' m'm.'"
              )}\n<:ApexPredator:787174770730336286> The current ranked map is **Olympus**.`
            )
            .setImage(`https://cdn.apexstats.dev/Maps/${mapImage(map.map)}.png`)
            .setFooter("Provided by https://rexx.live/");

          message.delete();
          message.embed(mapEmbed);
        });
      });
    }
  }
};
