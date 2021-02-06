const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Guilds = require('../../models/guild.js')
const reactionFunctions = require('../../reactionFunctions.js')
require("mongoose")
require("discord.js")

module.exports = {
    name: 'reactionrole',
    aliases: ['rr', 'role-react', 'emoji-roles'],
    description: "Create new reaction role menus, or change existing ones. (Server+ must be in the same guild as the emoji chosen.)",
    usage: "[init | create | set | delete] {messageID} {@role} {emoji}",
    async execute(client, message, args) {
        if (!args[0]) return errorHandler.errorEmbed(message.author, message, "Please provide an option to continue. (`init` | `create` | `set` | `delete`)")

        if (args[0].toLowerCase() === "init") {
            if (!message.member.permissions.has("MANAGE_GUILD")) return errorHandler.errorEmbed(message.author, message, "You don't have permission to do that. You need at least `MANAGE_GUILD` permissions.")
            reactionFunctions.init(client, message, args)

            return;
        }
    }
}