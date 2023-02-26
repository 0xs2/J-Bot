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
const moment = require('moment');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
    // The data needed to register slash commands to Discord.

    data: new SlashCommandBuilder()
        .setName("player")
        .setDescription(
            "Get the Player's Statistics."
        )
        .addStringOption((option) =>
            option
            .setName("username")
            .setDescription("Enter a Player username")
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

            axios.get(`https://j-stats.xyz/api/v2/player?user=${name.toLowerCase()}`)
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

                        embed
                            .setTitle(`Player ${response.data.username}`)
                            .setURL(`https://j-stats.xyz/player?u=${response.data.uuid}`)
                            .setThumbnail(`https://crafatar.com/avatars/${response.data.uuid}?size=128&overlay`)
                            .setDescription(
                                `This is ${response.data.username}'s Information`
                            )

                            .addFields({
                                name: 'Group',
                                value: response.data.group
                            })
                            // time field
                            .addFields({
                                name: 'Playtime',
                                value: moment.duration(response.data.playTime, 'seconds').hours() + ' hours',
                                inline: true
                            }, {
                                name: 'Joined',
                                value: moment.unix(response.data.firstJoin).format("L"),
                                inline: true
                            }, {
                                name: 'Last Join',
                                value: moment.unix(response.data.lastJoin).format("L"),
                                inline: true
                            })
                            // statistics field
                            .addFields({
                                    name: 'Trust Level',
                                    value: response.data.trustLevel.toString(),
                                    inline: true
                                }, {
                                    name: 'Trust Score',
                                    value: response.data.trustScore.toString(),
                                    inline: true
                                }, {
                                    name: 'Balance',
                                    value: response.data.money.toString(),
                                    inline: true
                                }

                            )
                            .addFields({
                                name: 'Mobs Killed',
                                value: response.data.creaturesKilled.toString(),
                                inline: true
                            }, {
                                name: 'Players Killed',
                                value: response.data.playersKilled.toString(),
                                inline: true
                            }, {
                                name: 'Meters Traveled',
                                value: response.data.metersTraveled.toString(),
                                inline: true
                            })
                            .addFields({
                                name: 'Blocks Placed',
                                value: response.data.blocksPlaced.toString(),
                                inline: true
                            }, {
                                name: 'Blocks Destroyed',
                                value: response.data.blocksDestroyed.toString(),
                                inline: true
                            }, {
                                name: 'Items Dropped',
                                value: response.data.itemsDropped.toString(),
                                inline: true
                            }, )
                            .setFooter({
                                text: `${response.data.uuid} (UUID)`
                            })

                    }

                    interaction.reply({
                        embeds: [embed],
                    });
                });
        }
    }
};