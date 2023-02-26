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
const QuickChart = require('quickchart-js');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
    // The data needed to register slash commands to Discord.

    data: new SlashCommandBuilder()
        .setName("activity")
        .setDescription(
            "Get the Player's Activity on RetroMC."
        )
        .addStringOption((option) =>
            option
            .setName("player")
            .setDescription("Enter a Player username")
            .setRequired(true)

        )
        .addStringOption((option2) =>
            option2
            .setName("activity")
            .setDescription("Enter a Activity type")
            .setRequired(true)

        ),

    async execute(interaction) {
        /**
         * @type {string}
         * @description The "command" argument
         */
        let name = interaction.options.getString("player");
        let activity = interaction.options.getString("activity");
        let m = ["money", "playerDeaths", "trustScore", "playersKilled", "joinCount", "metersTraveled", "blocksPlaced", "playTime", "itemsDropped", "trustLevel", "creaturesKilled", "blocksDestroyed"];

        /**
         * @type {EmbedBuilder}
         * @description Help command's embed
         */

        const embed = new EmbedBuilder().setColor("Random");



        if (name && activity) {
            axios.get(`https://j-stats.xyz/api/v2/activity?user=${name}&activity=${activity}`)
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
                    } else if (response.data.code == 4) {
                        embed
                            .setTitle("Invalid Activity Type")
                            .setDescription(`**Activity types**: \`${m.join("`, `")}\``)
                            .setColor("#FF0000")
                    } else {
                        // Create the chart
                        const chart = new QuickChart();
                        chart.setConfig({
                            type: 'line',
                            data: {
                                fill: false,
                                lineTension: 0,
                                backgroundColor: "rgba(65, 222, 249, 0.76)",
                                borderColor: "rgba(92, 227, 250, 0.8)",
                                labels: response.data.timestamps,
                                datasets: [{
                                    label: response.data.method,
                                    data: response.data[response.data.method_name]
                                }]
                            },
                        });

                        chart.setWidth(500).setHeight(300).setBackgroundColor('#202225');

                        embed
                            .setTitle(`${response.data.username}'s ${response.data.method} Activity`)
                            .setURL(`https://j-stats.xyz/activity?u=${response.data.uuid}&a=${response.data.method}`)
                            .setFooter({
                                text: `Last Updated: ${response.data.timestamps.at(-1)}`,
                                iconURL: `https://crafatar.com/avatars/${response.data.uuid}?size=128&overlay`
                            })
                            .setImage(chart.getUrl())
                    }

                    interaction.reply({
                        embeds: [embed],
                    });
                });
        } else {
            embed
                .setTitle("Activity")
                .setDescription(`**Usage**: \`/activity [player] [activity]\`\n**Activity types**: \`${m.join("`, `")}\``);
            interaction.reply({
                embeds: [embed],
            });
        }
    }
};