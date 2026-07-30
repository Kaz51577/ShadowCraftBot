import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send a message as the bot")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel to send the message to")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("message");

    // Check bot has permission to send in that channel
    const botMember = interaction.guild.members.me;
    if (!channel.permissionsFor(botMember).has(PermissionFlagsBits.SendMessages)) {
      return interaction.reply({
        content: "❌ I don't have permission to send messages in that channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await channel.send(message);
      await interaction.reply({
        content: "✅ Message sent.",
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Something went wrong sending that message.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
