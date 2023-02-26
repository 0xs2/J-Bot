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
        .setName("village")
        .setDescription(
            "Get a Village's Information on RetroMC."
        )
        .addStringOption((option) =>
            option
            .setName("name")
            .setDescription("Enter a Village name")
            .setRequired(true)
        ),

    async execute(interaction) {
        /**
         * @type {string}
         * @description The "command" argument
         */
        let name = interaction.options.getString("name");

        /**
         * @type {EmbedBuilder}
         * @description Help command's embed
         */

        const embed = new EmbedBuilder().setColor("Random");


        if (name) {

            axios.get(`https://j-stats.xyz/api/v2/village?q=${name.toLowerCase()}`)
                .then(function (response) {

                    if (response.status == 503 || response.status == 500 || response.status == 400) {

                        embed
                            .setTitle("Error :(")
                            .setDescription("Could not fetch from API")
                            .setColor("#FF0000")

                        interaction.reply({
                            embeds: [embed],
                        });
                    } else if (response.data.code == 2) {
                        embed
                            .setTitle("Village Error")
                            .setDescription(`No Village exists within your query`)
                            .setColor("#FF0000")


                        interaction.reply({
                            embeds: [embed],
                        });

                    } else {

                        embed
                            .setTitle(`Village ${response.data.name}`)
                            .setURL(`https://j-stats.xyz/village?u=${response.data.uuid}`)
                            .addFields({
                                name: "Spawn",
                                value: `${response.data.spawn.x}, ${response.data.spawn.y}, ${response.data.spawn.z}`,
                                inline: true
                            }, {
                                name: "Claims",
                                value: response.data.claims.toString(),
                                inline: true
                            }, )

                            .addFields({
                                name: "Members",
                                value: response.data.members.toString()
                            }, {
                                name: "Assistants",
                                value: response.data.assistants.toString(),
                                inline: true
                            })

                            .addFields({
                                name: "Notice",
                                value: "Discord can't display the full list of members and assistants. Click the title to see the list."
                            })
                            .setDescription(
                                `This is ${response.data.name}'s Information`
                            )
                            .setFooter({
                                text: `Owned By ${response.data.owner}`,
                                iconURL: `https://crafatar.com/avatars/${response.data.owner_uuid}?size=128&overlay`
                            })
                    }

                    interaction.reply({
                        embeds: [embed],
                    });
                });
        }
    }
};