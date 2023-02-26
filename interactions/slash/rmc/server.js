/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const {
    EmbedBuilder,
    SlashCommandBuilder,
    Attachment
} = require("discord.js");
const axios = require('axios');
const QuickChart = require('quickchart-js');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */

module.exports = {
    // The data needed to register slash commands to Discord.

    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("List all of the players on RetroMC."),


    async execute(interaction) {

        axios.get(`https://j-stats.xyz/api/v2/server`)
            .then(function (response) {

                const embed = new EmbedBuilder().setColor("Random")


                if (response.status == 503 || response.status == 500 || response.status == 400) {
                    embed
                        .setTitle("Error :(")
                        .setDescription("Could not fetch from API")
                        .setColor("#FF0000")
                } else {

                    let p = '';

                    // server player list
                    if (response.data.online != 0) {
                        // server players
                        let data = [];
                        response.data.players.forEach(element => {
                            data.push(element.username);
                        })
                        p = `\`${data.join("`, `")}\``;
                    } else {
                        p = 'No users online';
                    }

                    // Create the chart
                    const chart = new QuickChart();
                    chart.setConfig({
                        type: 'line',
                        data: {
                            labels: response.data.player_date,
                            datasets: [{
                                fill: false,
                                lineTension: 0,
                                backgroundColor: "rgb(44, 207, 97)",
                                borderColor: "rgba(44, 207, 97,0.7)",
                                label: 'Players Overtime',
                                data: response.data.player_history
                            }]
                        },
                    });

                    chart.setWidth(500).setHeight(300).setBackgroundColor('#202225');
                    let stats = `${response.data.daily_total} today's peak, ${response.data.monthly_total} monthly peak, ${response.data.peek_total} all time peak`


                    embed
                        .setTitle(`${response.data.online} Players Online`)
                        .setURL(`https://j-stats.xyz/server`)
                        .setDescription(p)
                        .setImage(chart.getUrl())
                        .setFooter({
                            text: stats
                        })

                    interaction.reply({
                        embeds: [embed]
                    });
                }
            });
    }

};