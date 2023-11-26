import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuOptionBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
} from "discord.js";

const tacoChannel = "tacos";

const getTacosList = async (user) => {
  console.log("User's tacos: ", user);

  const num = 5; //replace with fetch function to backend
  const choices = Array.from({ length: num });
  const result = choices.map((_, i) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${"🌮".repeat(i + 1)}`)
      .setValue(`${i + 1}`)
      .setDescription(`Send ${i + 1} tacos`);
  });
  return result;
};

const giveTaco = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give another user a taco")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to give a taco to")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("Attach a message"),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const message = interaction.options.getString("message") || "";
    const tacoList = await getTacosList(interaction.user);
    const numAvailableTacos = tacoList.length;

    const tacos = new StringSelectMenuBuilder()
      .setCustomId("numTacos")
      .setPlaceholder("Number of Tacos")
      .addOptions(...tacoList);
    const tacosRow = new ActionRowBuilder().addComponents(tacos);
    const response = await interaction.reply({
      content: `How many tacos would you like to send to ${target}?
               \nYou have ${numAvailableTacos} left to give today.`,
      components: [tacosRow],
      ephemeral: true,
    });

    try {
      const confirmation = await response.awaitMessageComponent({
        time: 60000,
      });
      console.log(confirmation.values[0]);
      const sentTacos = confirmation.values[0];
      const targetChannel = interaction.guild.channels.cache.find(
        (channel) => channel.name === tacoChannel,
      );

      if (targetChannel) {
        targetChannel.send(
          `${target} was sent ${sentTacos} taco${
            sentTacos === 1 ? "" : "s"
          } by ${interaction.user}`,
        );
      } else {
        interaction.reply("Could not find the target channel.");
      }

      await confirmation.reply({
        content: "Sent Tacos",
        components: [],
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
    }
  },
};

export default giveTaco;
