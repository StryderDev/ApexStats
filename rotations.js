const fs = require("fs");

module.exports = (client) => {
  fs.readdir("./rotations/", (err, files) => {
    if (err) console.err(err);
    let jsFiles = files.filter((f) => f.split(".").pop() === "js");

    if (files.length <= 0) return console.log("There are no rotations to load.");

    console.log(`Loading ${jsFiles.length} rotations`);

    jsFiles.forEach((f, i) => {
      require(`./rotations/${f}`);
      console.log(`${i + 1}: ${f} loaded!`);
    });
  });
};
