const legends = require("../../GameData/legends.json");

var OnlineEmoji = "<:StatusUp:786800700533112872>";
var OfflineEmoji = "<:StatusDown:786800700201238570>";

function findLegendByID(ID) {
  var legend = legends[ID].Name;

  if (legend == "undefined" || legend == null) return "Unknown";

  return legend;
}

function checkStatus(status) {
  if (status == "1") return `${OnlineEmoji} In Game`;

  return `${OfflineEmoji} Offline`;
}

function getColor(legend) {
  return legends[legend].Color;
}

function findRank(name, pos, div) {
  function isMaster(name, div) {
    if (name == "Master") return "";

    return div;
  }

  if (name == "Apex Predator")
    return `<:rankedPredator:787174770730336286> [#${pos}] Apex Predator`;

  function findBadge(name) {
    if (name == "Bronze") return "<:rankedBronze:787174769623302204>";
    if (name == "Silver") return "<:rankedSilver:787174770424021083>";
    if (name == "Gold") return "<:rankedGold:787174769942462474>";
    if (name == "Platinum") return "<:rankedPlatinum:787174770780667944>";
    if (name == "Diamond") return "<:rankedDiamond:787174769728290816>";
    if (name == "Master") return "<:rankedMaster:787174770680135680>";

    return "<:rankedBronze:787174769623302204>";
  }

  return `${findBadge(name)} ${name} ${isMaster(name, div)}`;
}

function getBPLevel(level) {
  if (level != -1) {
    if (level >= 110) return 110;
    return level;
  }

  return 0;
}

function trackerTitle(id, legend) {
  if (id == "1905735931") return "No data";

  var tracker = require(`../../GameData/TrackerData/${legend}.json`);

  if (tracker[id] == "undefined" || tracker[id] == null) return id;

  return tracker[id].Name;
}

function trackerValue(id, value) {
  if (id == "1905735931") return "-";

  return value.toLocaleString();
}

module.exports = {
  findLegendByID,
  checkStatus,
  getColor,
  findRank,
  getBPLevel,
  trackerTitle,
  trackerValue,
};
