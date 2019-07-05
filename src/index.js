const discord = require("discord.js");
const client = new discord.Client();
var ConnectedChannels = [
    // ChannelOBJ
];

function Broadcast(msg) {
    if (!ConnectedChannels.includes(msg.channel))
        return;
    const cid = msg.channel.id;
    ConnectedChannels.forEach(channel => {
        if (channel.id == cid) return;
        console.log(msg.author.avatarURL);
        channel.send({
            "embed": {
                "description": msg.content,
                "author": {
                    "name": msg.author.tag,
                    "icon_url": msg.author.avatarURL
                }
            }
        });
    });
}

function BroadcastE(msg) {
    ConnectedChannels.forEach(channel => {
        channel.send({
            "embed": {
                "description": msg,
                "footer": {
                    "text": "DiscordPhone system message"
                  }
            }
        });
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log("Doing what phones does. . .");
});


client.on('message', msg => {
    if (msg.member.id == client.user.id) return;
    if (msg.content == "$ start-call") {
        if (ConnectedChannels.includes(msg.channel.id))
            return msg.reply("Already on the list, do $ end-call to end the call");
        ConnectedChannels.push(msg.channel);
        BroadcastE("A channel joined the call, you are now " + ConnectedChannels.length)
        return;
    }
    if (msg.content == "$ end-call") {

        for (var i = ConnectedChannels.length - 1; i >= 0; i--) {
            if (ConnectedChannels[i] === msg.channel) {
                ConnectedChannels.splice(i, 1);
            }
        }
        BroadcastE("A channel disconnected the call, you are now " + ConnectedChannels.length)
        return;
    }
    Broadcast(msg);
});
client.login(process.env.DISCORD_TOKEN);