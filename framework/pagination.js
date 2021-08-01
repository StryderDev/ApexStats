const { Structures } = require('discord.js')
/** 
 * @name Discord.JS-Button-Pagination
 * @author Connor!#0800
*/
module.exports = (client) => {
    const { MessageButton, MessageActionRow } = require("discord-buttons");

    class TextChannel extends Structures.get("TextChannel") {
        async createSlider(userID, embeds, emojiNext, emojiBack) {

            const button_back = new MessageButton()
                .setStyle('blurple')
                .setID('back');

            const button_next = new MessageButton()
                .setStyle('blurple')
                .setID('next');

            const button_back_disabled = new MessageButton()
                .setStyle('gray')
                .setID('back_disabled')
                .setDisabled();

            const button_next_disabled = new MessageButton()
                .setStyle('gray')
                .setID('next_disabled')
                .setDisabled();

            if (emojiNext && emojiBack) {
                button_back.setEmoji(emojiBack)
                button_next.setEmoji(emojiNext)
                button_back_disabled.setEmoji(emojiBack)
                button_next_disabled.setEmoji(emojiNext)
            }
            else {
                button_back.setLabel('❰❰');
                button_next.setLabel('❱❱');
                button_back_disabled.setLabel('❰❰');
                button_next_disabled.setLabel('❱❱');
            };

            const buttonsActive = new MessageActionRow()
                .addComponents([button_back, button_next]);

            const buttonsDisabled = new MessageActionRow()
                .addComponents([button_back_disabled, button_next_disabled]);

            this.send({ embed: embeds[0], component: buttonsActive }).then(msg => {
                const collector = msg.createButtonCollector((button) => userID === userID, { time: 120 * 1000 });

                let currentPage = 0;

                collector.on('collect', button => {
                    button.reply.defer();

                    if (button.clicker.user.id == userID) {
                        if (button.id == "back") {
                            if (currentPage !== 0) {
                                --currentPage;
                                msg.edit({ embed: embeds[currentPage], component: buttonsActive });
                            } else {
                                currentPage = embeds.length - 1
                                msg.edit({ embed: embeds[currentPage], component: buttonsActive });
                            };
                        }

                        else if (button.id == "next") {
                            if (currentPage < embeds.length - 1) {
                                currentPage++;
                                msg.edit({ embed: embeds[currentPage], component: buttonsActive });
                            } else {
                                currentPage = 0
                                msg.edit({ embed: embeds[currentPage], component: buttonsActive });
                            };
                        };
                    };
                });
                collector.on('end', collected => {
                    msg.edit({ embed: embeds[0], component: buttonsDisabled })
                });
                collector.on("error", (e) => console.log(e))
            })
        }
    };

    Structures.extend("TextChannel", () => TextChannel);
}