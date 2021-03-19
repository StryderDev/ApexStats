const config = require("../../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.APISQL.host,
  user: config.APISQL.username,
  password: config.APISQL.password,
  database: config.APISQL.database,
});

function updateKills(userID, userPlatform, legendID, trackerID, trackerValue) {
  // List of current supported kill trackers
  var killTrackers = [
    1814522143, // Bang Kills
    607426151,
    1049917798, // Bloodhound Kills
    1665776136,
    15753331, // Caustic Kills
    1154431005, // Crpyto Kills
    526398026,
    752923862, // Fuse Kills
    1333056666,
    345008354, // Gibraltar Kills
    1677456416,
    904179299, // Horizon Kills
    1509839340, // Lifeline Kills
    1912458032,
    1359275248, // Loba Kills
    989931955,
    1730527550, // Mirage Kills
    710621083,
    303788636, // Octane Kills
    1431979280,
    196161681, // Pathfinder Kills
    765384635,
    1489531670,
    81517437, // Rampart Kills
    2139766576,
    1793313476, // Revenant Kills
    1994761139,
    1449585426, // Wattson Kills
    1520016036,
    1618935778, // Wraith Kills
    798933091,
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

    // If successful, continue
    getUserFromKillsDB = `SELECT * FROM userKills WHERE \`PlayerID\` = '${userID}'`;
    lastUpdated = Math.floor(Date.now() / 1000);

    connection.query(getUserFromKillsDB, function (err, results) {
      if (err) {
        connection.release();
        console.log(err);
        return message.channel.send(
          "There was a problem with the SQL syntax. Please try again later."
        );
      }

      if (results.length == 0) {
        // User does not exist, create row with user info and populate kills
        var createUser = `INSERT INTO userKills (PlayerID, Platform, lastUpdated, \`${legendID}\`) VALUES ('${userID}', '${userPlatform}', '${lastUpdated}', '${trackerValue}')`;

        connection.query(createUser, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");

          connection.release();
        });
      } else {
        // User does not exist, create row with user info
        var createUser = `UPDATE userKills SET \`lastUpdated\` = '${lastUpdated}', \`${legendID}\` = '${trackerValue}', \`Platform\` = '${userPlatform}' WHERE \`PlayerID\` = '${userID}'`;

        connection.query(createUser, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");

          connection.release();
        });
      }
    });
  });

  return console.log(`UserID: ${userID}. TrackerID: ${trackerID}. TrackerValue: ${trackerValue}.`);
}

module.exports = {updateKills};
