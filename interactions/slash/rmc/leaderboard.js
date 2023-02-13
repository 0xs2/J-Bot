/**
 * @file Sample help command with slash command.
 * @author Naman Vrati & Thomas Fournier
 * @since 3.0.0
 * @version 3.3.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
const { table } = require('table');


/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
	.setName("leaderboard")
	.setDescription(
			"Get the leaderboards on RetroMC."
		)
		.addStringOption((option) =>
			option
				.setName("category")
				.setDescription("The specific leaderboard category")
		),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		let name = interaction.options.getString("category");
		let m = ["money","playerDeaths","trustScore","playersKilled","joinCount","metersTraveled","blocksPlaced","playTime","itemsDropped","trustLevel","creaturesKilled","blocksDestroyed","memberCount","assistantsCount","claims","mostChatMessages"];

		/**
		 * @type {EmbedBuilder}
		 * @description Help command's embed
		 */

		const embed = new EmbedBuilder().setColor("Random");
		if (name) {

            axios.get(`https://j-stats.xyz/api/leaderboard?category=${name}`)
            .then(function(response) {
            
                if(response.status == 503 || response.status == 500 || response.status == 400)
                {
                    
                    embed
                    .setTitle("Leaderboard Error")
                    .setDescription("`Error getting leaderboard information`");    
                }
				else if(response.data.error) {
					embed
                    .setTitle("Leaderboard")
					.setDescription(`**Usage**: \`/leaderboard [category]\`\n**Available categories**: \`${m.join("`, `")}\``);   
				}
                else {


					const co = {
						columns: [
							{
							width: 2
							},
							{
							  width: 10
							},
							{
							  width: 25
							}
						  ],
						  drawHorizontalLine: (lineIndex, rowCount) => {
							return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
						  }
					};
					
					let builder = [];

					builder.push(["#", response.data.category_name, response.data.type]);

					response.data.data.forEach((element, k) => {
                        builder.push([k+1, element[response.data.category], element.username]);
                    });

					let e = table(builder,co);

                    embed
                    .setTitle(`${response.data.category_name} Leaderboard`)
                    .setDescription("```" + e + "```");
                }
			interaction.reply({
				embeds: [embed],
			});
		});

		}
		else {
			embed
			.setTitle("Leaderboard")
			.setDescription(`**Usage**: \`/leaderboard [category]\`\n**Available categories**: \`${m.join("`, `")}\``);   

			interaction.reply({
				embeds: [embed],
			});  
		}
	}
};
