import DiscordJS, { Intents, Message, Role } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const clientId = '939236605351329872';
const guildId = '939238401327136838';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log('The bot is ready');

    const guild = client.guilds.cache.get(guildId);
    let commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    }

    commands?.create({
        name: 'ip',
        description: 'server ip'
    });

    commands?.create({
        name: 'message',
        description: 'send private messages',
        options: [
            {
                name: 'role',
                description: 'target role',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.ROLE,
            }
        ]
    });
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return;
    }

    const { commandName, options } = interaction;

    if (commandName === 'ip') {
        interaction.reply({
            content: 'play.ariaziix.fr',
            ephemeral: true,
        });
    } else if (commandName === 'message') {
        const targetRole = options.getRole('role')!;
        const role = interaction.guild?.roles.cache.find(role=> role.id == targetRole.id)
        role?.members.map(u => {
            if(u.id != clientId){
                console.log(u.id)
                client.users.fetch(u.id).then((user) => {
                    user.send('hello world');
                });
            }
        });
        interaction.reply({
            content: "message sended",
            ephemeral: true,

        });
    }
});



client.login(process.env.TOKEN);