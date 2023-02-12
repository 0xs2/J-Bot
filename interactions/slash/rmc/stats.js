/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder, Attachment } = require("discord.js");
const axios = require('axios');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Basic statistics"),


	async execute(interaction) {

        axios.get(`https://j-stats.xyz/api/stats`)
            .then(function(response) {

                const embed = new EmbedBuilder().setColor("Random")


                if(response.status == 503 || response.status == 500 || response.status == 400)
                {
                    embed
                    .setTitle("Basic Statistics Error")
                    .setDescription("`Error getting statistic information`");    
                }
                else {

                embed
                .setTitle(`Basic Statistics`)
                .setDescription(`**Total Users**: ${response.data.total_users}\n**Staff Users**: ${response.data.staff_users}\n**Cape Users**: ${response.data.cape_users}\n**Total Villages**: ${response.data.total_villages}`)
                }

                interaction.reply({
                    embeds: [embed]
                });
            });
          
	}
    
};
