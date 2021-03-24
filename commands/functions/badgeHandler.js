const accountBadges = require("../../GameData/BadgeData/accountBadges.json");

function badgeTitle(id) {
  // Empty badge
  if (id == "1488777442") return "No Data";

  // If badge isn't found
  if (accountBadges[id] == null) return id;

  return `${accountBadges[id].fullName} - ${accountBadges[id].fix}`;
}

function badgeValue(id, value) {
  // Empty badge
  if (id == "1488777442") return "-";

  // If badge isn't found
  if (accountBadges[id] == null) return "-";

  var emoteID = accountBadges[id].id;
  var emoteName = accountBadges[id].emoteName;

  return `<:${emoteName}:${emoteID}> Level ${value - accountBadges[id].fix}`;
}

module.exports = {badgeTitle, badgeValue};

// BADGE NOTES
//
// Main idea is:
// Check if ID is empty badge ID.
// If yes, Display "No Data" and "-", similar to trackers
// Otherwise:
// Step 1.
// Check if the ID of the badge is one of the following:
// - Account Badge
// - BattlePass Badge
// - Club Badge
// - Content Pack Badge
// - GameMode Badge
// - Ranked Badge
// - Event Badges
// If it is, return the nessecary info
// If it isn't, get the current character, check their related
//  badge json file, and return the nessecary info
// Step 2.
// Associate the badge ID with 2 things:
// 1. Emote ID (gonna need a lot of emotes... and servers...)
// 2. Emote Name (to associate the ID with the emote on discord)
// Step 3.
// Return badge emote and, if legend specific badge, name
//
// If there is no ID currently in the files, return
// "No Data" and "-", similar to trackers
//
// Default Badge Icon
// https://apexlegends.fandom.com/wiki/File:CosmeticIcon_Badges.png
// - Might have to recreate a higher resolution version for the bot
//
// Default BadgeID for empty badge slots
// 1488777442
