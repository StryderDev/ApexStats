const accountBadges = require("../../GameData/BadgeData/accountBadges.json");
const teaserBadges = require("../../GameData/BadgeData/teaserBadges.json");

function badgeImage(id, value) {
  if (id == "1488777442") return "EmptyBadge.png";

  if (accountBadges[id] != null) return `${accountBadges[id].name}`;
  if (teaserBadges[id] != null) return `${teaserBadges[id].name}`;

  return "EmptyBadge.png";
}

module.exports = {badgeImage};
