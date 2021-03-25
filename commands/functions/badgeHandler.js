const accountBadges = require("../../GameData/BadgeData/accountBadges.json");
const bpBadges = require("../../GameData/BadgeData/battlepassBadges.json");

function badgeTitle(id) {
  // If there's no badge equipped
  if (id == "1488777442") return "No Data";

  // If badge is found
  if (accountBadges[id] != null) return `${accountBadges[id].fullName}`;
  if (bpBadges[id] != null) return `${bpBadges[id].fullName}`;

  // If badge isn't found
  return id;
}

function badgeValue(id, value) {
  // If there's no badge equipped
  if (id == "1488777442") return "<:DefaultBadge:824409685553053716> -";

  // If badge is found
  function checkValue(pretext, value, fix) {
    if (pretext != false) return `${pretext} ${value - fix}`;

    return "";
  }

  if (accountBadges[id] != null)
    return `<:${accountBadges[id].emoteName}:${accountBadges[id].id}> ${checkValue(
      accountBadges[id].preText,
      value,
      accountBadges[id].fix
    )}`;
  if (bpBadges[id] != null)
    return `<:${bpBadges[id].emoteName}:${bpBadges[id].id}> ${checkValue(
      bpBadges[id].preText,
      value,
      bpBadges[id].fix
    )}`;

  // If badge is found
  return "<:DefaultBadge:824409685553053716> -";
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
