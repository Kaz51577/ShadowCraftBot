import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
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
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    const botMember = interaction.guild.members.me;
    if (!channel.permissionsFor(botMember).has(PermissionFlagsBits.SendMessages)) {
      return interaction.reply({
        content: "❌ I don't have permission to send messages in that channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId(`send_modal:${channel.id}`)
      .setTitle("Compose message");

    const messageInput = new TextInputBuilder()
      .setCustomId("message")
      .setLabel("Message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(2000);

    modal.addComponents(new ActionRowBuilder().addComponents(messageInput));

    await interaction.showModal(modal);
  },
};
