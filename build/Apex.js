"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var botConfig_1 = require("./botConfig");
var _a = require('discord.js'), Client = _a.Client, GatewayIntentBits = _a.GatewayIntentBits, Partials = _a.Partials;
var Guilds = GatewayIntentBits.Guilds;
var _b = Partials;
var client = new Client({ intents: [Guilds] });
client.login(botConfig_1.default.token).then(function () { return console.log('Logged in.'); });
//# sourceMappingURL=Apex.js.map