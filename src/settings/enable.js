const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Guilds = require('../../models/guild.js')
require("mongoose")
require("discord.js")

module.exports = {
    name: "enable",
    description: "Enable the specified module for use in your server.",
    usage: "[module(s)]",
    aliases: ['on', 'activate', "enable-module"],
    async execute(client, message, args) {
        message.delete()
        if (!message.member.permissions.has("MANAGE_GUILD")) return errorHandler.errorEmbed(message.author, message, "You don't have permission to do that. You need at least `MANAGE_GUILD` permissions.")
        var modules = args[0]
        if (!modules) return errorHandler.errorEmbed(message.author, message, "Please provide a module to enable.")
        if (modules.length <= 0) return errorHandler.errorEmbed(message.author, message, "Please provide a module to enable.")

        const guild = await Guilds.findOne({
            guildID: message.guild.id
        })
        if (!guild) return errorHandler(message.author, message, "I can't find your server, please contact us [Here](https://discord.gg/WsHFP5x).");

        if (modules.toLowerCase() === "all") {
            if (!guild.blacklist.moduleBlacklist.length || guild.blacklist.moduleBlacklist.length === 0) return errorHandler.errorEmbed(message.author, message, "Every module is already enabled.")

            guild.blacklist.moduleBlacklist.forEach(async m => {
                await Guilds.findOneAndUpdate({
                    guildID: message.guild.id
                }, {
                    $pull: {
                        "blacklist.moduleBlacklist": m
                    }
                }, {
                    useFindAndModify: false
                }).exec()
            })

            embeds.embedBase(message.author, message, `Successfully enabled \`all\` modules.`, [])
            return;
        }

        const mod = guild.modules.find(m => m === modules.toLowerCase())
        if (!mod) return errorHandler.errorEmbed(message.author, message, "That's not a valid module!")


        if (!guild.blacklist.moduleBlacklist.includes(mod)) return errorHandler.errorEmbed(message.author, message, "That module is already enabled.")

        console.log(mod)

        await Guilds.findOneAndUpdate({
            guildID: message.guild.id
        }, {
            $pull: {
                "blacklist.moduleBlacklist": mod
            }
        }, {
            useFindAndModify: false
        }).exec()
        embeds.embedBase(message.author, message, `Successfully enabled \`${mod}\` module.`, [])
    },
}