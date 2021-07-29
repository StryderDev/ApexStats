const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js-light");
const axios = require("axios");
var {DateTime, Duration} = require("luxon");
const {checkMsg} = require("../functions/checkMsg.js");
const {version} = require("../../package.json");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "arenas",
      aliases: ["arena"],
      group: "utility",
      memberName: "arenas",
      description: "Shows current and future in-game arena rotations.",
      examples: ["arena"],
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
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg, {amount}) {
    if (checkMsg(msg) == 1) return;

    msg.channel.startTyping();

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
      var future = DateTime.local().plus({seconds: math + 60});

      var timeUntil = future.diff(now, ["hours", "minutes", "seconds"]);

      var time = timeUntil.toObject();

      return `${pluralize(time.hours, "hour")}, ${pluralize(time.minutes, "minute")}`;
    }

    function removeSpaces(string) {
      return string.replace(/ /g, "");
    }

    if (lengthCheck(amount) >= 1) {
      msg.say("Retrieving in-game arena rotation schedule...").then(async (message) => {
        // Just show current map
        axios
          .get(`https://fn.alphaleagues.com/v2/apex/map/?next=${lengthCheck(amount)}`)
          .then((result) => {
            var nextMap = result.data.arenas.next;

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

            msg.channel.stopTyping();
          });
      });
    } else {
      msg.say("Retrieving in-game arena rotation schedule...").then(async (message) => {
        // Just show current map
        axios.get("https://fn.alphaleagues.com/v2/apex/map/?next=1").then((result) => {
          var map = result.data.arenas;
          var nextMap = result.data.arenas.next;

          const mapEmbed = new MessageEmbed()
            .setDescription(
              `:map: The current arena is **${map.map}** for ${getTime(
                map.times.next
              )}.\n:clock1: The next arena is **${
                nextMap[0].map
              }** and lasts for ${Duration.fromMillis(nextMap[0].duration * 60 * 1000).toFormat(
                "h'h,' m'm.'"
              )}`
            )
            .setImage(
              `https://cdn.apexstats.dev/Maps/Season%209/Arena_${removeSpaces(
                map.map
              )}_01.gif?v=${version}`
            )
            .setFooter("Provided by https://rexx.live/");

          message.delete();
          message.embed(mapEmbed);

          msg.channel.stopTyping();
        });
      });
    }
  }
};
