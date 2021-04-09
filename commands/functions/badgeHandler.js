const accountBadges = require("../../GameData/BadgeData/accountBadges.json");
const bpBadges = require("../../GameData/BadgeData/battlepassBadges.json");

function badgeTitle(id, legend) {
  var trackerFile = require(`../../GameData/BadgeData/legendBadges/${legend}.json`);

  // If there's no badge equipped
  if (id == "1488777442") return "No Data";

  // If badge is found
  if (accountBadges[id] != null) return `${accountBadges[id].fullName}`;
  if (bpBadges[id] != null) return `${bpBadges[id].fullName}`;

  if (trackerFile[id] != null) return `${trackerFile[id].fullName}`;

  // If badge isn't found
  return id;
}

function badgeValue(id, value, legend) {
  var trackerFile = require(`../../GameData/BadgeData/legendBadges/${legend}.json`);

  // If there's no badge equipped
  if (id == "1488777442") return "<:DefaultBadge:824409685553053716> -";

  // If badge is found
  function checkBadgeValue(emote, id, pretext, fix, tiered, tiers, value) {
    if (pretext != false) return `<:${emote}:${id}> ${pretext} ${value - fix}`;
    if (tiered != false) return tiers[value];

    return `<:${emote}:${id}>`;
  }

  // If badge has multiple tiers, it will have the same ID, but not the
  // same value. There needs to be a way to check the value before
  // outputting the badge and title
  if (accountBadges[id] != null)
    return `${checkBadgeValue(
      accountBadges[id].emoteName,
      accountBadges[id].id,
      accountBadges[id].preText,
      accountBadges[id].fix,
      accountBadges[id].tiered,
      accountBadges[id].tiers,
      value
    )}`;
  if (bpBadges[id] != null) {
    if (value > 110) {
      var setValue = 112;
    } else if (value <= 0) {
      var setValue = 2;
    } else {
      var setValue = value;
    }

    return `${checkBadgeValue(
      bpBadges[id].emoteName,
      bpBadges[id].id,
      bpBadges[id].preText,
      bpBadges[id].fix,
      bpBadges[id].tiered,
      bpBadges[id].tiers,
      setValue
    )}`;
  }

  if (trackerFile[id] != null)
    return `${checkBadgeValue(
      trackerFile[id].emoteName,
      trackerFile[id].id,
      trackerFile[id].preText,
      trackerFile[id].fix,
      trackerFile[id].tiered,
      trackerFile[id].tiers,
      value
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
