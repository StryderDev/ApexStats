const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

module.exports = class ALGSCommand extends Command {
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
      if (num >= 10) return 10;
      if (num <= 1) return 1;

      return num;
    }

    return msg.say(`Hi, I'm awake! You want to see ${lengthCheck(amount)} future map rotations.`);
  }
};
