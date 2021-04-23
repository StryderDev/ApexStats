const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js");
const axios = require("axios");
var {DateTime} = require("luxon");
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

    if (lengthCheck(amount) >= 1) {
      // Do current map rotation + however many future rotations
      return msg.say("future rotations: 19238102301983");
    } else {
      // Just show current map
      axios.get("https://fn.alphaleagues.com/v1/apex/map/?next=1").then((result) => {
        var map = result.data;
        var nextMap = result.data.next;

        function getTime(time) {
          var now = DateTime.local();
          var nowSeconds = Math.floor(DateTime.local().toSeconds());
          var math = time - nowSeconds;
          var future = DateTime.local().plus({seconds: math});

          var timeUntil = future.diff(now, ["hours", "minutes", "seconds"]);

          var time = timeUntil.toObject();

          const pluralize = (count, noun, suffix = "s") =>
            `${count} ${noun}${count !== 1 ? suffix : ""}`;

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
            return `Season%208/${mapName}`;
          } else {
            return "NoMapData";
          }
        }

        const mapEmbed = new MessageEmbed()
          .setDescription(
            `:map: The current map is **${map.map}** for ${getTime(
              map.times.nextMap
            )}.\n:clock1: The next map is **${nextMap[0].map}** which lasts for ${
              nextMap[0].duration
            } minutes.\n<:ApexPredator:787174770730336286> The current ranked map is **Olympus**.`
          )
          .setImage(`https://cdn.apexstats.dev/Maps/${mapImage(map.map)}.png`)
          .setFooter("Provided by https://rexx.live/");

        return msg.embed(mapEmbed);
      });
    }
  }
};
