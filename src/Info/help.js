const config = require('../../config.js')
const errorHandler = require('../../embeds/error.js')
const embeds = require('../../embeds/general.js')
const Discord = require("discord.js")
const Guild = require("../../models/guild.js")

module.exports = {
    name: 'help',
    aliases: ['h', 'commands', 'modules', 'enabled'],
    description: 'Get a full list of enabled modules, and their commands.',
    usage: "(command name | modules)",
    async execute(client, message, args) {
        message.delete()

        Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) return console.log(err)

            const {settings} = guild;

            if (!args[0]) {
                let base = new Discord.MessageEmbed()
                .setColor(config.colors.blue)
                .setThumbnail(message.guild.iconURL())
                .setTitle(`Enabled Modules for \`${message.guild.name}\``)
                .setFooter(`Requested By: ${message.author.username}#${message.author.discriminator} | ${settings.prefix}help modules [module name]`)
                .setTimestamp()

                for(var i = 0; i < guild.modules.length; i+=1){
                    const filtered = guild.modules.filter(m => m.enabled === true).length

                    if((filtered % 2) !== 0){
                        if(guild.modules[i].enabled){
                            base.addField(`\u200b`, `${guild.modules[i].statusEmote} \`${guild.modules[i].name}\` `, true)
                        }
                    }else {
                        if(guild.modules[i].enabled){
                            base.addField(`\u200b`, `${guild.modules[i].statusEmote} \`${guild.modules[i].name}\` `, true)
                        }
                    }
                    
                }

                message.channel.send(base)

                return;
            }

            if (args[0].toLowerCase() === "modules" || args[0].toLowerCase() === "mods") {
                for (var i = 0; i < guild.modules.length; i += 1) {
                    var desc = `__**Modules**__ (\`${message.guild.name}\`)\n`;
                    client.modules.forEach(module => {
                        const mod = guild.modules.find(m => m.name === module)
                        desc += `${module} - ${mod.statusEmote}\n`
                    })
                }

                embeds.embedBase(message.author, message, `${desc}`)

                return;
            }

            if (args[0]) {
                let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]))
                if (!cmd) return errorHandler.errorEmbed(message.author, message, `That's not a valid command!`)

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
                    .setColor(config.colors.blue)
                    .setDescription(`\`${cmd.name}\``)
                    .setFooter(`Requested By: ${message.author.username}#${message.author.discriminator} | [] = Required () = Optional`, message.author.displayAvatarURL())

                if (cmd.category) {
                    embed.setDescription(`\`${cmd.name}\` (${cmd.category})`)
                }
                if (cmd.description) {
                    embed.addField("Description", cmd.description, true)
                }
                if (cmd.usage) {
                    embed.addField("Usage", `\`${settings.prefix}${cmd.name} ${cmd.usage}\``, true)
                }
                if (cmd.aliases) {
                    embed.addField("Aliases", cmd.aliases.map(x => `**${x}**`).join(", "))
                }

                message.channel.send(embed)
            }

        })

    }
}