import DiscordJS, { Intents, Message, Role } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const clientId = '939236605351329872';
const guildId = '931181749545877524';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});




client.on('ready', async () => {
    console.log('The bot is ready');

    const guild = client.guilds.cache.get(guildId);
    let commands;
    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    }

    const message = await guild?.commands.fetch('939588303265628220');
    let permissions: DiscordJS.ApplicationCommandPermissionData[] = [
        {
            id: '241175971368140800',
            type: 'USER',
            permission: true,
        },
        {
            id: '939574781777440808',
            type: 'USER',
            permission: true,
        },
    ];

    await message?.permissions.add({permissions})

    commands?.create({
        name: 'ip',
        description: 'server ip',
    });

    commands?.create({
        name: 'message',
        description: 'send private messages',
        defaultPermission: false,
        options: [
            {
                name: 'role',
                description: 'target role',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.ROLE,
            },
            {
                name: 'content',
                description: 'message content',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            },
        ]
    })
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return;
    }

    const { commandName, options } = interaction;
    
    switch(commandName){
        case 'ip':
            interaction.reply({
                content: 'play.ariaziix.fr',
                ephemeral: true,
            });   
            break;
        case 'message':
            const targetRole = options.getRole('role')!;
            const content = options.getString('content')!;
            const role = interaction.guild?.roles.cache.find(role=> role.id == targetRole.id)
            role?.members.map(u => {
                if(u.id != clientId){
                    console.log('message sended to: '+u.id)
                    client.users.fetch(u.id).then((user) => {
                        user.send('>>> **[Ariaziix Info]**: '+content);
                    });
                }
            });
            interaction.reply({
                content: "message sended",
                ephemeral: true,

            });
        break;
    }
    
});


client.login(process.env.TOKEN);