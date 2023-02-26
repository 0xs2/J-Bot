/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const {
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const axios = require('axios');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
    // The data needed to register slash commands to Discord.

    data: new SlashCommandBuilder()
        .setName("vplayer")
        .setDescription(
            "Get the Player's Villages on RetroMC."
        )
        .addStringOption((option) =>
            option
            .setName("username")
            .setDescription("Enter a username")
            .setRequired(true)
        ),

    async execute(interaction) {
        /**
         * @type {string}
         * @description The "command" argument
         */
        let name = interaction.options.getString("username");

        /**
         * @type {EmbedBuilder}
         * @description Help command's embed
         */

        const embed = new EmbedBuilder().setColor("Random");


        if (name) {
            axios.get(`https://j-stats.xyz/api/v2/uservillage?user=${name}`)
                .then(function (response) {

                    if (response.status == 503 || response.status == 500 || response.status == 400) {

                        embed
                            .setTitle("Error :(")
                            .setDescription("Could not fetch from API")
                            .setColor("#FF0000")
                    } else if (response.data.code == 2) {
                        embed
                            .setTitle("Error :(")
                            .setDescription(`Could not find this user`)
                            .setColor("#FF0000")
                    } else {

                        // handle this shit
                        let final = '';
                        if (typeof response.data.owner != 'undefined' && response.data.owner.length != 0) {
                            let o = [];
                            response.data.owner.forEach(l => {
                                o.push(l.village);
                            });
                            final = o.join('\n');
                        } else {
                            final = 'None';
                        }

                        let final1 = '';
                        if (typeof response.data.assistant != 'undefined' && response.data.assistant.length != 0) {
                            let a = [];
                            response.data.assistant.forEach(k => {
                                a.push(k.village);
                            });
                            final1 = a.join("\n");
                        } else {
                            final1 = "None";
                        }


                        let final2 = '';
                        if (typeof response.data.member != 'undefined' && response.data.member.length != 0) {
                            let a = [];
                            response.data.member.forEach(k => {
                                a.push(k.village);
                            });
                            final2 = a.join("\n");
                        } else {
                            final2 = "None";
                        }



                        embed

                            .setTitle(`${response.data.username}'s Villages`)
                            .addFields({
                                name: "Owns",
                                value: final,
                                inline: true
                            }, {
                                name: "Member",
                                value: final2,
                                inline: true
                            }, {
                                name: "Assistant",
                                value: final1,
                                inline: true
                            }, )
                            .setThumbnail(`https://crafatar.com/avatars/${response.data.uuid}?size=128&overlay`)
                    }

                    interaction.reply({
                        embeds: [embed],
                    });
                });
        }
    }
};