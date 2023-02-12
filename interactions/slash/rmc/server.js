/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder, Attachment } = require("discord.js");
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

        axios.get(`https://j-stats.xyz/ajax/getServer`)
            .then(function(response) {

                const embed = new EmbedBuilder().setColor("Random")


                if(response.status == 503 || response.status == 500 || response.status == 400)
                {
                    embed
                    .setTitle("Server Error")
                    .setDescription("`Error getting server information`");    
                }
                else {

                    // server players
                    let data  = [];
                    response.data[0].players.forEach(element => {
                        data.push(element[0]);
                    })
                    let p = data.join(", ");

                    // server player graph

                // Create the chart
                const chart = new QuickChart();
                chart.setConfig({
                    type: 'line',
                    data: { labels: response.data[0].player_date, datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(44, 207, 97)",
                        borderColor: "rgba(44, 207, 97,0.7)",
                        label: 'Players Overtime', data: response.data[0].player_history}] },
                  });

                  chart.setWidth(500).setHeight(300).setBackgroundColor('#202225');

                embed
                .setTitle(`${response.data[0].online} Players Online`)
                .setDescription(p)
                .setImage(chart.getUrl())
                }

                interaction.reply({
                    embeds: [embed]
                });
            });
          
	}
    
};
