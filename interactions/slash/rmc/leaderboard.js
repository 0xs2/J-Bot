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
const {
	table
} = require('table');


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
			.setRequired(true)
		),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		let name = interaction.options.getString("category");
		let m = ["money", "playerDeaths", "trustScore", "playersKilled", "joinCount", "metersTraveled", "blocksPlaced", "playTime", "itemsDropped", "trustLevel", "creaturesKilled", "blocksDestroyed", "memberCount", "assistantsCount", "claims", "mostChatMessages"];

		/**
		 * @type {EmbedBuilder}
		 * @description Help command's embed
		 */

		const embed = new EmbedBuilder().setColor("Random");
		if (name) {
			axios.get(`https://j-stats.xyz/api/v2/leaderboard?category=${name}`)
				.then(function (response) {

					if (response.status == 503 || response.status == 500 || response.status == 400) {

						embed
							.setTitle("Error :(")
                            .setDescription("Could not fetch from API")
                            .setColor("#FF0000")
					} else if (response.data.code == 4) {
						embed
							.setTitle("Invalid Leaderboard Option")
							.setDescription(`**Available categories**: \`${m.join("`, `")}\``)
                            .setColor("#FF0000")
					} else {

						let ke = [];
						let key = [];
						let value = [];

						response.data.data.forEach((element, k) => {
							ke.push(k + 1);
							key.push(element.key);
							value.push(element.value);
						});

						embed
							.setTitle(`${response.data.category_name} Leaderboard`)
							.setURL(`https://j-stats.xyz/leaderboard`)
							.addFields({
								name: '#',
								value: ke.join('\n'),
								inline: true
							}, {
								name: response.data.type,
								value: key.join('\n'),
								inline: true
							}, {
								name: response.data.category_name,
								value: value.join('\n'),
								inline: true
							});
					}
					interaction.reply({
						embeds: [embed],
					});
				});
		}
	}
};