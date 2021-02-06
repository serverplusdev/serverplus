const embeds = require('../../embeds/general.js')
const Guilds = require("../../models/guild.js")
require("discord.js")

module.exports = {
    name: 'botinfo',
    aliases: ['bi', 'botinformation', 'information', 'invite', 'botsupport'],
    description: 'Information about the Server+ bot.',
    category: "Info",
    async execute(client, message, args) {
        message.delete()

        Guilds.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if(err) return console.log(err)

            embeds.embedBase(message.author, message, `Information about ${client.user.username} (${client.user.id})`, [{title: "Prefix", content: `\`${guild.settings.prefix}\``, inline: true}, {title: "\u200b", content: "\u200b", inline: true}, {title: "Server Count", content: client.guilds.cache.size, inline: true}, {title: "Vote for Server+ on `top.gg`", content: "[Click to vote](https://www.youtube.com/watch?v=dQw4w9WgXcQ)", inline: true}, {title: "\u200b", content: "\u200b", inline: true}, {title: "Official Server", content: "[Join here](https://discord.gg/WsHFP5x)", inline: true}])
        })
    }
}