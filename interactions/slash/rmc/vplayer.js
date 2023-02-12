/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
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
                    .setTitle("Village Player Error")
                    .setDescription("`Error getting user`");    

                    interaction.reply({
                        embeds: [embed],
                    });  
                }
				else if(response.data.error) {
					embed
                    .setTitle("Village Player Error")
                    .setDescription(`No record in jstats db`);  
                    
                    
                    interaction.reply({
                        embeds: [embed],
                    });  

				}
                else {

                    // step 2 send activity request
                        axios.post(`https://j-stats.xyz/ajax/getUserVillage`, `uuid=${response.data.uuid}`)
                        .then(function(response2) {
               
                            if(response2.status == 503 || response2.status == 500 || response2.status == 400)
                            {
                                
                                embed
                                .setTitle("Village Player Error")
                                .setDescription("`Error getting user`");    
                            }
                            else if(response2.data.error) {
                                embed
                                .setTitle("Village Player Error")
                                .setDescription(`error`);   
                            }
                            else {
                            // handle this shit

                            let final = '';
                            if(typeof response2.data.owner != 'undefined' && response2.data.owner.length != 0) {
                                let o = [];
                                response2.data.owner.forEach(l => {
                                o.push(l[1]);
                                });
                                final = o.join(', ');
                            }
                            else {
                                final = 'None';
                            }

                                let final1 = '';
                                if(typeof response2.data.assistant != 'undefined' && response2.data.assistant.length != 0) {
                                let a = [];
                                response2.data.assistant.forEach(k => {
                                a.push(k[1]);
                                });
                               final1 = a.join(", ");
                                }
                                else {
                                    final1 = "None";
                                }

                            
                                let final2 = '';
                                if(typeof response2.data.member != 'undefined' && response2.data.member.length != 0) {
                                let a = [];
                                response2.data.member.forEach(k => {
                                a.push(k[1]);
                                });
                                final2 = a.join(", ");
                                }
                                else {
                                    final2 = "None";
                                }



                              embed
                              .setTitle("Village Player Info")
                              .setDescription(`**${response.data.username}**'s Villages\n\nOwns: **${final}**\nMember Of: **${final2}**\nAsst In: **${final1}**`)
                              .setThumbnail(`https://crafatar.com/avatars/${response.data.uuid}?size=128&overlay`)
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
            .setTitle("Village Player")
            .setDescription("**Usage**: `/vplayer [username]`");    


            interaction.reply({
                embeds: [embed],
            });  
        }
	}
};
