const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Discord = require("discord.js")
const moment = require("moment")

module.exports = {
    name: 'whois',
    aliases: ["userinfo", "user-info", "ui", "uinfo", "useri", "profile", "user"],
    description: 'Get information about a user.',
    usage: "(@user)",
    async execute(client, message, args) {
        message.delete()

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!target) target = message.member
        console.log(target)

        embeds.embedBase(target, message, ``, [{title: "Account Creation", content: `${moment(target.user.createdAt).format("M/D/YYYY")} (${moment(target.user.createdAt).fromNow()})`, inline: true}, {title: "\u200b", content: "\u200b", inline: true}, {title: "Join Date", content: `${moment(target.joinedAt).format("M/D/YYYY")} (${moment(target.joinedAt).fromNow()})`, inline: true}, {title: `Roles [${target.roles.cache.size - 1}]`, content: `${target.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id}>`).join(" ") || "No Roles."}`, inline: true}])

        // {title: "\u200b", content: "\u200b", inline: true}
    }
}