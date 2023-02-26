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

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"List all commands and information about bot."
		)
		.addStringOption((option) =>
			option
			.setName("command")
			.setDescription("The specific command to see the info of.")
		),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		let name = interaction.options.getString("command");

		/**
		 * @type {EmbedBuilder}
		 * @description Help command's embed
		 */
		const helpEmbed = new EmbedBuilder().setColor("Random");

		if (name) {
			name = name.toLowerCase();

			// If a single command has been asked for, send only this command's help.

			helpEmbed.setTitle(`Help for \`${name}\` command`);

			if (interaction.client.slashCommands.has(name)) {
				const command = interaction.client.slashCommands.get(name);

				if (command.data.description)
					helpEmbed.setDescription(
						command.data.description
					);
			} else {
				helpEmbed
					.setDescription(`No command with the name \`${name}\` found.`)
					.setColor("Red");
			}
		} else {
			// Give a list of all the commands

			helpEmbed
				.setTitle("List of all the commands")
				.addFields({name: "Credit", value: "sui, JohnyMuffin", inline: true}, 
				{name: "Powered By", value: "j-stats.xyz", inline: true}, 
				{name: "Commands", value: "`" + interaction.client.slashCommands.map((command) => command.data.name).join("`, `") + "`"}, 
				)
				.setDescription(
					"A bot that provides information and statistics about RetroMC and it's players"
				)
				.setFooter({
					text: "https://github.com/0xs2/retromc-stats",
					iconURL: "https://avatars.githubusercontent.com/u/116229905?v=4"
				});
		}

		// Replies to the interaction!

		await interaction.reply({
			embeds: [helpEmbed],
		});
	},
};