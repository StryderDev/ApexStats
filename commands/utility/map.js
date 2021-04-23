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
      axios.get("https://fn.alphaleagues.com/v1/apex/map/").then((result) => {
        var map = result.data;

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

        const mapEmbed = new MessageEmbed().setDescription(
          `The current map is **${map.map}**, which lasts for ${getTime(
            map.times.nextMap
          )}.\nThe current ranked map is **Olympus**.`
        );

        return msg.embed(mapEmbed);
      });
    }
  }
};
