// const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Guilds = require('../../models/guild.js')
require("mongoose")
require("discord.js")

module.exports = {
    name: "setprefix",
    aliases: ["set-prefix", "prefix", "prefix-change"],
    description: "Change the prefix for your server.",
    async execute(client, message, args){
        message.delete()
        if (!message.member.permissions.has("MANAGE_GUILD")) return errorHandler.errorEmbed(message.author, message, "You don't have permission to do that. You need at least `MANAGE_GUILD` permissions.")

        let newPrefix = args[0]
        if(!newPrefix) return errorHandler.errorEmbed(message.author, message, "You need to provide a new prefix to use.")
        if(message.mentions.members.first()) return errorHandler.errorEmbed(message.author, message, "Your prefix cannot be a mention.")

        await Guilds.findOneAndUpdate({
            guildID: message.guild.id
        }, {
            $set: {
                "settings.prefix": newPrefix
            }
        }, {
            useFindAndModify: false
        }).exec()

        embeds.embedBase(message.author, message, `Successfully set the guild prefix to: \`${newPrefix}\``, [])
    },
}