function updateKills(trackerID, trackerValue) {
  // List of current supported kill trackers
  var killTrackers = [
    1814522143, // Bang Kills
    607426151, // Bang Kills
    303788636, // Octane Kills
    1431979280, // Octane Kills
  ];

  // Should only run if the tracker is not found in the list
  if (killTrackers.indexOf(trackerID) == -1) return console.log("Tracker ID not found;");

  return console.log(`TrackerID: ${trackerID}. TrackerValue: ${trackerValue}.`);
}

module.exports = {updateKills};
