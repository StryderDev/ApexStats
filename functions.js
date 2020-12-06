const fs = require("fs");

module.exports = (client) => {
  fs.readdir("./events/", (err, files) => {
    if (err) console.err(err);
    let jsFiles = files.filter((f) => f.split(".").pop() === "js");

    if (files.length <= 0) return console.log("There are no events to load.");

    console.log(`Loading ${jsFiles.length} events`);

    jsFiles.forEach((f, i) => {
      require(`./events/${f}`);
      console.log(`${i + 1}: ${f} loaded!`);
    });
  });
};
