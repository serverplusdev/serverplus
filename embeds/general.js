const Discord = require("discord.js")
const config = require('../config.js')

module.exports = {
    embedBase(user, msg, description, fields) {
        if (!user.user) {
            const base = new Discord.MessageEmbed()
                .setColor(config.colors.blue)
                .setThumbnail(user.displayAvatarURL())
                .setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL())
                .setFooter(`Requested By: ${user.username}#${user.discriminator}`)
                .setTimestamp()
            if (description) {
                base.setDescription(description)
            }
            if(fields){
                for(var i = 0; i < fields.length; i+= 1){
                    base.addField(fields[i].title, fields[i].content, fields[i].inline)
                }
            }

            msg.channel.send(base)

            return;
        }

        //--------------------------------------------------------------------------------------------------------
        else {
            const base = new Discord.MessageEmbed()
                .setColor(config.colors.blue)
                .setThumbnail(user.user.displayAvatarURL())
                .setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL())
                .setFooter(`Requested By: ${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
                .setTimestamp()
            if (description) {
                base.setDescription(description)
            }
            if(fields){
                for(var i = 0; i < fields.length; i+= 1){
                    base.addField(fields[i].title, fields[i].content, fields[i].inline)
                }
            }

            msg.channel.send(base)
        }
    },

    embedBaseThenDelete(user, msg, description, fields, time) {
        if (!user.user) {
            const base = new Discord.MessageEmbed()
                .setColor(config.colors.blue)
                .setThumbnail(user.displayAvatarURL())
                .setAuthor(`${user.username}#${user.discriminator}`, msg.author.displayAvatarURL())
                .setFooter(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
                .setTimestamp()
            if (description) {
                base.setDescription(description)
            }
            if(fields){
                for(var i = 0; i < fields.length; i+= 1){
                    base.addField(fields[i].title, fields[i].content, fields[i].inline)
                }
            }

            msg.channel.send(base).then(msg => msg.delete({timeout: time}))

            return;
        }

        //--------------------------------------------------------------------------------------------------------
        else {
            const base = new Discord.MessageEmbed()
                .setColor(config.colors.blue)
                .setThumbnail(user.user.displayAvatarURL())
                .setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.displayAvatarURL())
                .setFooter(`Requested By: ${user.user.username}#${user.user.discriminator}`)
                .setTimestamp()
            if (description) {
                base.setDescription(description)
            }
            if(fields){
                for(var i = 0; i < fields.length; i+= 1){
                    base.addField(fields[i].title, fields[i].content, fields[i].inline)
                }
            }

            msg.channel.send(base).then(msg => msg.delete({timeout: time}))
        }
    }
}