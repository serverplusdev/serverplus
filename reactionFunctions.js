const Discord = require("discord.js")
const mongoose = require("mongoose")
const errorHandler = require('./embeds/error.js')
const embeds = require('./embeds/general.js')

//------
const reactionModels = require('./models/guild.js')
//------

const config = require('./config.js')
const guild = require("./models/guild.js")

var sp_plus = "<:sp_plus:734926228615593984>"
var sp_cross = "<:sp_cross:734926228431306793>"
var sp_minus = "<:sp_minus:734926228913651852>"

var sp_plus_id = "734926228615593984"
var sp_cross_id = "734926228431306793"
var sp_minus_id = "734926228913651852"

module.exports = {
    init(client, message, args) {

        reactionModels.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) return console.log(err)



            const base = new Discord.MessageEmbed()
                .setColor(config.colors.blue)
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription(`**Reaction Roles =>**\n\n> React with ${sp_plus} to create a new message.\n> \n> React with ${sp_minus} to use an existing message.`)
                .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
                .setFooter(`Requested By: ${message.author.username}#${message.author.discriminator}`)
                .setTimestamp()

            message.channel.send(base).then(msg => {
                msg.react(sp_plus_id).then(() => {
                    msg.react(sp_minus_id)
                })

                const createFilter = async (reaction, user) => {
                    if (reaction.emoji.id === sp_plus_id && user.id === message.author.id && !user.bot) {
                        msg.delete()

                        base.setDescription(`Please type the channel in which the message will be sent.`)
                        message.channel.send(base)

                        //CHECK FOR MESSAGES
                        // message.guild.channels.cache.each(c => {
                        //     console.log(c.name)
                        // })
                        //CHECK FOR MESSAGES

                        const filter = m => m.author.id === message.author.id && !m.author.bot && m.author.id === user.id

                        const createCol = message.channel.createMessageCollector(filter)
                        createCol.on('collect', async (m) => {
                            var channel;
                            if (m.content.includes("<")) {
                                let realChannel = m.content.trim().split("#").join("")
                                let real = realChannel.trim().split(">").join("")
                                let final = real.trim().split("<").join("")

                                channel = final
                            } else {
                                channel = m.content
                            }
                            var sendChannel = message.guild.channels.cache.find(c => c.id === channel);

                            if (!sendChannel) {
                                m.delete()
                                return errorHandler.errorEmbedThenDelete(message.author, message, "That's not a valid channel.", 5000)
                            }

                            guild.sessionStorage = sendChannel.id
                            guild.save()


                            createCol.stop("valid")
                        })
                        createCol.on('end', async (collected, reason) => {
                            if (reason === 'valid') {
                                var sendChannel = message.guild.channels.cache.find(c => c.id === guild.sessionStorage);

                                base.setDescription(`Now, please type the message to be used with this reactionrole menu.`)
                                message.channel.send(base)

                                const createMsgCol = message.channel.createMessageCollector(filter)
                                createMsgCol.on('collect', async (m) => {
                                    if (!m.length > 1900) {
                                        m.delete()
                                        return errorHandler.errorEmbedThenDelete(message.author, message, "That message is too long, please shorten it and try again.", 5000)
                                    }

                                    sendChannel.send(`***Reaction Role Menu =>***\n\n\n${m.content}`).then(async mes => {

                                        const uploadData = {
                                            messageID: mes.id,
                                            roles: []
                                        }

                                        await reactionModels.findOneAndUpdate({
                                            guildID: message.guild.id
                                        }, {
                                            $push: {
                                                "reactionRoles": uploadData
                                            }
                                        }, {
                                            useFindAndModify: false
                                        })

                                        base.setDescription(`Successfully created a reaction role menu with an ID of \`${mes.id}\` in ${mes.channel}\n\n \`${guild.settings.prefix}reactionrole set [messageID] [@role] [emoji]\` to complete setup for that message.`)
                                        message.channel.send(base)

                                        guild.sessionStorage = null
                                        guild.save()
                                    })

                                    // await reactionModels.findOneAndUpdate({ guildID: message.guild.id }, { $push: { "reactionRoles": '' } }, { useFindOneAndModify: false })

                                    createMsgCol.stop("valid")
                                })

                            }
                        })
                    }
                }

                // const createFilter = async (reaction, user) => {
                //     if (reaction.emoji.id === sp_plus_id && user.id === message.author.id && !user.bot) {
                //         msg.delete()

                //         base.setDescription(`Please type the channel in which the message will be sent.`)
                //         message.channel.send(base)

                //         //CHECK FOR MESSAGES
                //         // message.guild.channels.cache.each(c => {
                //         //     console.log(c.name)
                //         // })
                //         //CHECK FOR MESSAGES

                //         const filter = m => m.author.id === message.author.id && !m.author.bot && m.author.id === user.id

                //         const createCol = message.channel.createMessageCollector(filter)
                //         createCol.on('collect', async (m) => {
                //             var channel;
                //             if (m.content.includes("<")) {
                //                 let realChannel = m.content.trim().split("#").join("")
                //                 let real = realChannel.trim().split(">").join("")
                //                 let final = real.trim().split("<").join("")

                //                 channel = final
                //             } else {
                //                 channel = m.content
                //             }
                //             var sendChannel = message.guild.channels.cache.find(c => c.id === channel);

                //             if (!sendChannel) {
                //                 m.delete()
                //                 return errorHandler.errorEmbedThenDelete(message.author, message, "That's not a valid channel.", 5000)
                //             }

                //             guild.sessionStorage = sendChannel.id
                //             guild.save()


                //             createCol.stop("valid")
                //         })
                //         createCol.on('end', async (collected, reason) => {
                //             if (reason === 'valid') {
                //                 var sendChannel = message.guild.channels.cache.find(c => c.id === guild.sessionStorage);

                //                 base.setDescription(`Now, please type the message to be used with this reactionrole menu.`)
                //                 message.channel.send(base)

                //                 const createMsgCol = message.channel.createMessageCollector(filter)
                //                 createMsgCol.on('collect', async (m) => {
                //                     if (!m.length > 1900) {
                //                         m.delete()
                //                         return errorHandler.errorEmbedThenDelete(message.author, message, "That message is too long, please shorten it and try again.", 5000)
                //                     }

                //                     sendChannel.send(`***Reaction Role Menu =>***\n\n\n${m.content}`).then(async mes => {

                //                         const uploadData = {
                //                             messageID: mes.id,
                //                             roles: []
                //                         }

                //                         await reactionModels.findOneAndUpdate({
                //                             guildID: message.guild.id
                //                         }, {
                //                             $push: {
                //                                 "reactionRoles": uploadData
                //                             }
                //                         }, {
                //                             useFindAndModify: false
                //                         })

                //                         base.setDescription(`You're all done, type \`${guild.settings.prefix}reactionrole set [messageID] [@role] [emoji]\` to complete setup for that message.`)
                //                         message.channel.send(base)

                //                         guild.sessionStorage = null
                //                         guild.save()
                //                     })

                //                     // await reactionModels.findOneAndUpdate({ guildID: message.guild.id }, { $push: { "reactionRoles": '' } }, { useFindOneAndModify: false })

                //                     createMsgCol.stop("valid")
                //                 })

                //             }
                //         })
                //     }
                // }



                msg.createReactionCollector(createFilter)

            })
        })
    },
    addRoleToMsg(client, message, args) {

    }
}