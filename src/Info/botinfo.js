const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Discord = require("discord.js")

module.exports = {
    name: 'info',
    aliases: ['bi', 'botinfo', 'botinformation', 'information', 'invite', 'botsupport'],
    description: 'Information about the Server+ bot.',
    async execute(client, message, args) {
        message.delete()

        embeds.embedBase(message.author, message, `Information about ${client.user.username} (${client.user.id})`, [{title: "Prefix", content: `\`+\``, inline: true}, {title: "\u200b", content: "\u200b", inline: true}, {title: "Server Count", content: client.guilds.cache.size, inline: true}, {title: "Vote for Server+ on `top.gg`", content: "[Click to vote](https://www.youtube.com/watch?v=dQw4w9WgXcQ)", inline: true}, {title: "\u200b", content: "\u200b", inline: true}, {title: "Official Server", content: "[Join here](https://discord.gg/WsHFP5x)", inline: true}])
        // message.channel.send(embeds.base)
    }
}