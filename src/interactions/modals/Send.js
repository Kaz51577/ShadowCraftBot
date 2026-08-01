import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { logger } from '../../utils/logger.js';

export default {
  name: 'send_modal',

  async execute(interaction, client, args) {
    const [channelId] = args;
    const message = interaction.fields.getTextInputValue('message');

    const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);

    if (!channel) {
      return interaction.reply({
        content: "❌ Couldn't find that channel anymore.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const wantsEveryonePing = /@everyone|@here/.test(message);
    const botMember = interaction.guild.members.me;

    if (wantsEveryonePing && !channel.permissionsFor(botMember).has(PermissionFlagsBits.MentionEveryone)) {
      return interaction.reply({
        content: "❌ I don't have permission to ping @everyone/@here in that channel.",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await channel.send({
        content: message,
        allowedMentions: { parse: ['users', 'roles', 'everyone'] },
      });
      await interaction.reply({
        content: '✅ Message sent.',
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      logger.error('send_modal: failed to send message', {
        error: error.message,
        guildId: interaction.guildId,
        channelId,
      });
      await interaction.reply({
        content: '❌ Something went wrong sending that message.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
