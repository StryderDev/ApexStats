const {Command} = require("discord.js-light-commando");

module.exports = class ALGSCommand extends Command {
  constructor(client) {
    super(client, {
      name: "algs",
      group: "comp",
      memberName: "algs",
      description: "Shows current and future ALGS information.",
      examples: ["N/A"],
    });
  }
  run(msg) {
    return msg.say("Hi, I'm awake!");
  }
};
