import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send a message as the bot")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel to send the message to")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("message");

    if (!channel.isTextBased()) {
      return interaction.reply({
        content: "❌ That channel is not a text channel.",
        ephemeral: true,
      });
    }

    try {
      await channel.send(message);

      await interaction.reply({
        content: "✅ Message sent.",
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: "❌ I don't have permission to send messages there.",
        ephemeral: true,
      });
    }
  },
};
