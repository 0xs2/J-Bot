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
		.setName("village")
		.setDescription(
			"Get a Village's Information on RetroMC."
		)
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Enter a Village name")
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

            axios.get(`https://j-stats.xyz/api/village?q=${name.toLowerCase()}`)
            .then(function(response) {

                if(response.status == 503 || response.status == 500 || response.status == 400)
                {
                    
                    embed
                    .setTitle("Village Error")
                    .setDescription("`Error getting village`");    


                    interaction.reply({
                        embeds: [embed],
                    });  
                }
				else if(response.data.error) {
					embed
                    .setTitle("Village Error")
                    .setDescription(`No Village exists within your query`);  
                    
                    
                    interaction.reply({
                        embeds: [embed],
                    });  

				}
                else {
		let a = '';
		let m = '';

	if(response.data.assistants != 0) {
		a =  `${response.data.assistantsList.join("`, `")}`
	}
	else {
		a = 'none'
	}

        if(response.data.members != 0) {
		                m =  `${response.data.membersList.join("`, `")}`
		        }
			        else {
					                m = 'none'
					        }



                    embed
                    .setTitle(`Village ${response.data.name}`)
                    .setDescription(
                    `
                    Spawn: \`${response.data.spawn.x}\`, \`${response.data.spawn.y}\`, \`${response.data.spawn.z}\`
                    Claims: **${response.data.claims}**
                    Members (**${response.data.members}**): \`${m}\`
                    Assistants (**${response.data.assistants}**): \`${a}\`
                    `
                    )
                    .setFooter({text: `Owned By ${response.data.owner}`, iconURL: `https://crafatar.com/avatars/${response.data.owner_uuid}?size=128&overlay`})
                }

                interaction.reply({
                    embeds: [embed],
                });  
            });
        }
        else {
            embed
            .setTitle("Village")
            .setDescription("**Usage**: `/village [name]`");    


            interaction.reply({
                embeds: [embed],
            });  
        }
	}
};
