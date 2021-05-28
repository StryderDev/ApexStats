const accountBadges = require("../../GameData/BadgeData/accountBadges.json");
const teaserBadges = require("../../GameData/BadgeData/teaserBadges.json");

function badgeImage(id) {
  if (id == "1488777442") return "EmptyBadge.png";

  if (accountBadges[id] != null) return accountBadges[id].name;
  if (teaserBadges[id] != null) return teaserBadges[id].name;

  return "EmptyBadge.png";
}

function hasValue(id) {
  if (id == "1488777442") return false;

  if (accountBadges[id] != null) return accountBadges[id].hasValue;
  if (teaserBadges[id] != null) return teaserBadges[id].hasValue;

  return false;
}

function getValue(id, value) {
  if (id == "1488777442") return false;

  if (accountBadges[id] != null) {
    if (accountBadges[id].fix != false) return value - accountBadges[id].fix;

    return accountBadges[id].hasValue;
  }

  if (teaserBadges[id] != null) {
    if (teaserBadges[id].fix != false) return value - teaserBadges[id].fix;

    return teaserBadges[id].hasValue;
  }
}

module.exports = {badgeImage, hasValue, getValue};
