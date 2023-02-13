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
                else  {
	
		    let p = '';
                    
                    // server player list
		if(response.data[0].online != 0) {
		    // server players
                    let data  = [];
                    response.data[0].players.forEach(element => {
                        data.push(element[0]);
                    })
                    p = `\`${data.join("`, `")}\``;
		}
		else {
		p = 'No users online';
		}

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

                // step 2 get the stats data
                axios.get(`https://j-stats.xyz/api/server`)
                .then(function(response2) {

                    let stats = '';

                    if(response2.status == 503 || response2.status == 500 || response2.status == 400)
                    {
                        stats = 'Server: Could not fetch information';
                    }
                    else  {
                        stats = `${response2.data.daily_total} today's peak, ${response2.data.monthly_total} month peak,  ${response2.data.peek_total} all time peak`
                    }

                    embed
                    .setTitle(`${response.data[0].online} Players Online`)
                    .setDescription(p)
                    .setImage(chart.getUrl())
                    .setFooter({text: stats})
    
                    interaction.reply({
                        embeds: [embed]
                    });

                });
            }
        });
	}
    
};
