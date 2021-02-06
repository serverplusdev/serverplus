const Discord = require("discord.js")
const config = require('../config.js')

module.exports = {
    errorEmbed(user, msg, description) {
        if (!user.user) {
            const error = new Discord.MessageEmbed()
                .setColor(config.colors.red)
                .setThumbnail(user.displayAvatarURL())
                .setTitle(`Server+ | An error occurred.`)
                .setFooter(`${msg.author.username}#${msg.author.discriminator}`, user.displayAvatarURL())
            if (description) {
                error.setDescription(description)
            }

            msg.channel.send(error)

            return;
        }

        //--------------------------------------------------------------------------------------------------------
        
        else {
            const error = new Discord.MessageEmbed()
                .setColor(config.colors.red)
                .setThumbnail(user.user.displayAvatarURL())
                .setTitle(`Server+ | An error occurred.`)
                .setFooter(`${msg.author.username}#${msg.author.discriminator}`, user.user.displayAvatarURL())
            if (description) {
                error.setDescription(description)
            }

            msg.channel.send(error)
        }
    },

    errorEmbedThenDelete(user, msg, description, time) {
        if (!user.user) {
            const error = new Discord.MessageEmbed()
                .setColor(config.colors.red)
                .setThumbnail(user.displayAvatarURL())
                .setTitle(`Server+ | An error occurred.`)
                .setFooter(`${msg.author.username}#${msg.author.discriminator}`, user.displayAvatarURL())
            if (description) {
                error.setDescription(description)
            }

            msg.channel.send(error).then(msg => msg.delete({timeout: time}))

            return;
        }

        //--------------------------------------------------------------------------------------------------------
        
        else {
            const error = new Discord.MessageEmbed()
                .setColor(config.colors.red)
                .setThumbnail(user.user.displayAvatarURL())
                .setTitle(`Server+ | An error occurred.`)
                .setFooter(`${msg.author.username}#${msg.author.discriminator}`, user.user.displayAvatarURL())
            if (description) {
                error.setDescription(description)
            }

            msg.channel.send(error).then(msg => msg.delete({timeout: time}))
        }
    }
}