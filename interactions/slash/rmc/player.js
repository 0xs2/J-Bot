/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
const moment = require('moment');
const QuickChart = require('quickchart-js');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("player")
		.setDescription(
			"Get the Player's Player on RetroMC."
		)
		.addStringOption((option) =>
			option
				.setName("username")
				.setDescription("Enter a Player username")
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

            // step 1 check user db

            axios.get(`https://j-stats.xyz/api/getUser?user=${name.toLowerCase()}`)
            .then(function(response) {

                if(response.status == 503 || response.status == 500 || response.status == 400)
                {
                    
                    embed
                    .setTitle("Player Error")
                    .setDescription("`Error getting user`");    


                    interaction.reply({
                        embeds: [embed],
                    });  
                }
				else if(response.data.error) {
					embed
                    .setTitle("Player Error")
                    .setDescription(`No Mojang Username exists for this user`);  
                    
                    
                    interaction.reply({
                        embeds: [embed],
                    });  

				}
                else {

                    // step 2 send player request
                        axios.get(`https://statistics.johnymuffin.com/api/v1/getUser?serverID=0&uuid=${response.data.uuid}`)
                        .then(function(response2) {
               
                            if(response2.status == 503 || response2.status == 500 || response2.status == 400)
                            {
                                
                                embed
                                .setTitle("Player Error")
                                .setDescription("`Error getting user`");    
                            }
                            else if(!response2.data.found) {
                                embed
                                .setTitle("Player Error")
                                .setDescription(`Could not find this user`);   
                            }
                            else {

   
                              embed
                              .setTitle(`${response.data.username}'s Information`)
                              .setThumbnail(`https://crafatar.com/avatars/${response.data.uuid}?size=128&overlay`)
                              .setDescription(
                                `
                                Playtime: **${moment.duration({"seconds": response2.data.playTime}).humanize()}**
                                Join Count: **${response2.data.joinCount}**
                                Joined: **${moment.unix(response2.data.firstJoin).format("L")}**
                                Last Join: **${moment.unix(response2.data.lastJoin).format("L")}**
                                Trust Level: **${response2.data.trustLevel}**
                                Trust Score: **${Math.floor(response2.data.trustScore)}**
                                Balance: **${Math.floor(response2.data.money)}**
                                Killed: **${response2.data.playersKilled}**
                                Mobs Killed: **${response2.data.creaturesKilled}**
                                Deaths: **${response2.data.playerDeaths}**
                                Blocks Placed: **${response2.data.blocksPlaced}**
                                Blocks Destroyed: **${response2.data.blocksDestroyed}**
                                Items Dropped: **${response2.data.itemsDropped}**
                                Meters Traveled: **${response2.data.metersTraveled}**
                                `
                              )
                              .setFooter({text: `${response.data.uuid} (UUID)`})
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
            .setTitle("Player Error")
            .setDescription("`You need to provide the agruments`");    


            interaction.reply({
                embeds: [embed],
            });  
        }
	}
};
