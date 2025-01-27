const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require("@discordjs/voice");

const zerexConfig = {
    Tokens: [
        {
            Token: "YOUR_FIRST_TOKEN_HERE",
            Guild: "YOUR_FIRST_GUILD_ID",
            Channel: "YOUR_FIRST_CHANNEL_ID"
        },
        {
            Token: "YOUR_SECOND_TOKEN_HERE",
            Guild: "YOUR_SECOND_GUILD_ID",
            Channel: "YOUR_SECOND_CHANNEL_ID"
        }
    ],
    Branding: "Zerex Bot",
    DefaultMute: true
};

function createZerexClient(token, guildId, channelId) {
    const client = new Client({ checkUpdate: false });

    client.on('ready', async () => {
        console.log(`${zerexConfig.Branding} logged in as ${client.user.tag}!`);
        await joinVC(client, guildId, channelId);
    });

    client.on('voiceStateUpdate', async (oldState, newState) => {
        const oldVoice = oldState.channelId;
        const newVoice = newState.channelId;

        if (oldVoice !== newVoice) {
            if (!oldVoice) {
            } else if (!newVoice) {
                if (oldState.member.id !== client.user.id) return;
                await joinVC(client, guildId, channelId);
            } else {
                if (oldState.member.id !== client.user.id) return;
                if (newVoice !== channelId) {
                    await joinVC(client, guildId, channelId);
                }
            }
        }
    });

    client.login(token);
    return client;
}

async function joinVC(client, guildId, channelId) {
    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild.channels.cache.get(channelId);
    if (!voiceChannel) {
        console.error(`[${zerexConfig.Branding} Error] Voice channel with ID ${channelId} not found.`);
        return;
    }
    joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: zerexConfig.DefaultMute
    });
}

zerexConfig.Tokens.forEach(tokenConfig => {
    const { Token, Guild, Channel } = tokenConfig;
    createZerexClient(Token, Guild, Channel);
});
