const config = require("../../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.APISQL.host,
  user: config.APISQL.username,
  password: config.APISQL.password,
  database: config.APISQL.database,
});

function updateKills(userID, trackerID, trackerValue) {
  // List of current supported kill trackers
  var killTrackers = [
    1814522143, // Bang Kills
    607426151, // Bang Kills
    303788636, // Octane Kills
    1431979280, // Octane Kills
  ];

  // Should only run if the tracker is not found in the list
  if (killTrackers.indexOf(trackerID) == -1) return console.log("Tracker ID not found;");

  // Check if connection to DB is successful
  connection.getConnection(function (err, connection) {
    // If not successful, throw an error
    if (err) {
      console.log(err);
      return message.channel.send(
        "There was an error connecting to the database. Please try again later."
      );
    }

    // If successful, check if our query is valid
    getUserFromKillsDB = `SELECT * FROM userKills WHERE \`PlayerID\` = '${userID}'`;
  });

  return console.log(`UserID: ${userID}. TrackerID: ${trackerID}. TrackerValue: ${trackerValue}.`);
}

module.exports = {updateKills};
