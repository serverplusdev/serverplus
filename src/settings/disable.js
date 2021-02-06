const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Guilds = require('../../models/guild.js')
require("mongoose")
require("discord.js")

module.exports = {
    name: "disable",
    description: "Disable the specified module for your server.",
    usage: "[module(s)]",
    aliases: ['off', 'deactivate', "disable-module"],
    async execute(client, message, args) {
        message.delete()
        if (!message.member.permissions.has("MANAGE_GUILD")) return errorHandler.errorEmbed(message.author, message, "You don't have permission to do that. You need at least `MANAGE_GUILD` permissions.")
        var modules = args[0]

        if (!modules) return errorHandler.errorEmbed(message.author, message, "Please provide a module to disable.")
        if (!modules.length || modules.length <= 0) return errorHandler.errorEmbed(message.author, message, "Please provide a module to disable.")
        const guild = await Guilds.findOne({
            guildID: message.guild.id
        })
        if (!guild) return errorHandler(message.author, message, "I can't find your server, please contact us [Here](https://discord.gg/WsHFP5x).");

        // if (modules.toLowerCase() === "all") {
        //     if (!guild.blacklist.moduleBlacklist.length || guild.blacklist.moduleBlacklist.length === 0) return errorHandler.errorEmbed(message.author, message, "Every module is already enabled.")

        //     guild.blacklist.moduleBlacklist.forEach(async m => {
        //         await Guilds.findOneAndUpdate({
        //             guildID: message.guild.id
        //         }, {
        //             $pull: {
        //                 "blacklist.moduleBlacklist": m
        //             }
        //         }, {
        //             useFindAndModify: false
        //         }).exec()
        //     })

        //     return;
        // }

        const mod = guild.modules.find(m => m === modules.toLowerCase())
        if (!mod) return errorHandler.errorEmbed(message.author, message, "That's not a valid module!")


        if (guild.blacklist.moduleBlacklist.includes(mod)) return errorHandler.errorEmbed(message.author, message, "That module is already disabled.")
        let notDisabled = ["info", "settings"]
        if(notDisabled.includes(mod.toLowerCase())) return errorHandler.errorEmbed(message.author, message, `That module cannot be disabled.\n\n**Experiencing prefix issues?**\nType \`${guild.settings.prefix}setprefix [prefix]\` to change ${client.user.username}'s prefix for this server.`)

        console.log(mod)

        await Guilds.findOneAndUpdate({
            guildID: message.guild.id
        }, {
            $push: {
                "blacklist.moduleBlacklist": mod
            }
        }, {
            useFindAndModify: false
        }).exec()


        embeds.embedBase(message.author, message, `Successfully disabled \`${mod}\` module.`, [])
    },
}