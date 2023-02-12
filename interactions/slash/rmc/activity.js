/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
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
		)
        .addStringOption((option2) =>
        option2
            .setName("activity")
            .setDescription("Enter a Activity type")
    ),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		let name = interaction.options.getString("player");
		let activity = interaction.options.getString("activity");

		/**
		 * @type {EmbedBuilder}
		 * @description Help command's embed
		 */

        const embed = new EmbedBuilder().setColor("Random");


		if (name && activity) {

            // step 1 check user db

            axios.get(`https://j-stats.xyz/api/getUser?user=${name.toLowerCase()}`)
            .then(function(response) {

                if(response.status == 503 || response.status == 500 || response.status == 400)
                {
                    
                    embed
                    .setTitle("Activity Error")
                    .setDescription("`Error getting user`");    


                    interaction.reply({
                        embeds: [embed],
                    });  
                }
				else if(response.data.error) {
					embed
                    .setTitle("Activity Error")
                    .setDescription(`No record in jstats db`);  
                    
                    
                    interaction.reply({
                        embeds: [embed],
                    });  

				}
                else {

                    // step 2 send activity request
                        axios.get(`https://j-stats.xyz/api/activity?uuid=${response.data.uuid}&method=${activity}`)
                        .then(function(response2) {
               
                            if(response2.status == 503 || response2.status == 500 || response2.status == 400)
                            {
                                
                                embed
                                .setTitle("Activity Error")
                                .setDescription("`Error getting user`");    
                            }
                            else if(response2.data.error) {
                                embed
                                .setTitle("Activity Error")
                                .setDescription(`**not enough activity logged/invalid method**\n ${response2.data.methods.join("\n")}`);   
                            }
                            else {
                            // Create the chart
                            const chart = new QuickChart();
                            chart.setConfig({
                                type: 'line',
                                data: { 
                                    fill: false,
                                    lineTension: 0,
                                    backgroundColor: "rgba(65, 222, 249, 0.76)",
                                    borderColor: "rgba(92, 227, 250, 0.8)",
                                    labels: response2.data.timestamps, datasets: [{ label: response2.data.method, data: response2.data[response2.data.method_name]}] },
                              });

                              chart.setWidth(500).setHeight(300).setBackgroundColor('#202225');

                              embed
                              .setTitle(`Player Activity`)
                              .setFooter({ text: `${response.data.username}'s ${response2.data.method} activity`, iconURL: `https://crafatar.com/avatars/${response.data.uuid}?size=128&overlay` })
                              .setImage(chart.getUrl())
                            }

                            interaction.reply({
                                embeds: [embed],
                            });  
                        });
                    }


            });
		}
        else {
            embed
            .setTitle("Activity Error")
            .setDescription("`You need to provide the agruments`");    


            interaction.reply({
                embeds: [embed],
            });  
        }
	}
};
