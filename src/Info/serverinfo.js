const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Discord = require("discord.js")
const moment = require("moment")

module.exports = {
    name: 'serverinfo',
    aliases: ["sinfo", "server-info", "si", "serveri", "server"],
    description: 'Get information about the server.',
    category: "Info",
    async execute(client, message, args) {
        message.delete()

        var region = "";
        if (message.guild.region.toString().includes("us-")) {
            region += "🇺🇸 ";
        }
        if (message.guild.region.toString().includes("eu")) {
            region += "🇪🇺 ";
        }
        if (message.guild.region.toString().includes("sydney")) {
            region += ":flag_au: ";
        }
        if (message.guild.region.toString().includes("hong")) {
            region += ":flag_hk: ";
        }
        if (message.guild.region.toString().includes("southafrica")) {
            region += ":flag_za: ";
        }
        if (message.guild.region.toString().includes("japan")) {
            region += ":flag_jp: ";
        }
        if (message.guild.region.toString().includes("brazil")) {
            region += ":flag_br: ";
        }
        if (message.guild.region.toString().includes("singapore")) {
            region += ":flag_sg: ";
        }
        if (message.guild.region.toString().includes("russia")) {
            region += ":flag_ru: ";
        }

        const fields = [{
                title: "Date Created",
                content: `${moment(message.guild.createdAt).format("M/D/YYYY")} (${moment(message.guild.createdAt).fromNow()})`,
                inline: true
            },
            {
                title: "\u200b",
                content: "\u200b",
                inline: true
            },
            {
                title: "Region",
                content: `${region} ${message.guild.region}`,
                inline: true
            },
            {
                title: "Server Owner",
                content: `${message.guild.owner}`,
                inline: true
            },
            {
                title: "Member Count",
                content: `${message.guild.members.cache.filter(u => !u.user.bot).size} (\`Bots: ${message.guild.members.cache.filter(u => u.user.bot).size}\`)`,
                inline: true
            },
            {
                title: "Channel Count",
                content: message.guild.channels.cache.size,
                inline: true
            }
        ]

        embeds.embedBase(message.member, message, `Information about \`${message.guild.name}\` (${message.guild.id})`, fields)

        // {title: "\u200b", content: "\u200b", inline: true}
    }
}