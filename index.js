const Discord = require("discord.js");
const editJsonFile = require("edit-json-file");
const client = new Discord.Client();
const id_add = require("./data/add/id.json");
var nodemailer = require("nodemailer");
const fs = require("fs");
const fetch = require("node-fetch")
const prefix = ">>";
client.on("ready", () => {
  client.user.setActivity(`${prefix}help`);
  console.log(`${client.user.username} ✅`);
});
client.on("message", async (message) => {
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  if (message.content.startsWith(">> ")) {
  } else {
    //HELP
    if (command === "help") {
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("HELP")
          .setColor("#20e3af")
          .setDescription("Need help ? No problem here are my command...")
          .addField(">>ping", "Ping the BOT and the API, most precisely")
          .addField(
            ">>info <name>",
            "Get information on a programming language"
          )
          .addField(
            ">>add <name>",
            "Contribute to the improvement of the bot ... Add programming languages"
          )
          .addField(
            ">>report <name>",
            "Contribute to the improvement of the bot ... Report errors in the information provided"
          )
      );
    }

    // PING
    if (command === "ping") {
      message.reply("Calculating ping...").then((resultMessage) => {
        const ping = resultMessage.createdTimestamp - message.createdTimestamp;
        const PingView = new Discord.MessageEmbed()
          .setColor("#2e2d2d")
          .setTitle("PING 🏓")
          .addFields(
            {
              name: "BOT LATENCY",
              value: ping,
            },
            {
              name: "API LATENCY",
              value: client.ws.ping,
            }
          );
        message.channel.send(PingView);
      });
    }

    //FIND LANGUAGE
    if (command === "info") {
      if (!args[0]) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("❌  Please indicate a programming language")
            .setColor("#e32047")
        );
      } else {
        const value = message.content.substr(">info ".length);
        const value_format1 = value.split(" ").join("");
        const value_format = value_format1.toLowerCase();
        fs.readFile(
          `./data/language/${value_format}.json`,
          "utf8",
          (err, data) => {
            if (err) {
              message.channel.send(
                new Discord.MessageEmbed()
                  .setTitle(
                    "❌  This programming language is not based on our database"
                  )
                  .addField(
                    "Contribute",
                    `To contribute and add this language, use the command\`\`\`>>add${value}\`\`\``
                  )
                  .setColor("#e32047")
              );
            } else {
              return;
            }
          }
        );
        const file = require(`./data/language/${value_format}.json`);

        const LanguageInfo = new Discord.MessageEmbed()
          .setColor("#20e3af")
          .setTitle(file.name)
          .addField("What's this ?", file.def)
          .setAuthor(file.author, file.img_author);
        message.channel.send(LanguageInfo);
      }
    }

    //ADD LANGUAGE
    if (command === "add") {
      if (!args[0]) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("❌  Please indicate a programming language")
            .setColor("#e32047")
        );
      } else {
        const value = message.content.substr(">add ".length);
        const value_format1 = value.split(" ").join("");
        const value_format = value_format1.toLowerCase();
        const file_name = value_format;
        const language_name = value;
        const id_name = Buffer.from(language_name).toString("base64");
        let file = editJsonFile(`${__dirname}/data/add/id.json`);
        file.set(`${id_name}.name`, `${language_name}`);
        file.save();
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle(`You will add ${language_name} to the database...`)
            .setColor("#20e3af")
            .setDescription(
              `To add a description and confirm the sending, use the command : \`\`\`>>confirm ${id_name} <description>\`\`\``
            )
        );
      }
    }

    //CONFIRM ADD
    if (command === "confirm") {
      if (!args[0]) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("❌ Please indicate ID")
            .setColor("#e32047")
        );
      } else {
        let file = editJsonFile(`${__dirname}/data/add/id.json`);
        const id = args[0];
        const name = file.get(`${id}.name`);
        if (Buffer.from(id, "base64").toString() === name) {
          const def = message.content.substr(`>confirm ${args[0]} `.length);
          if (!def) {
            message.channel.send(
              new Discord.MessageEmbed()
                .setTitle("❌ Please enter a description")
                .setColor("#e32047")
            );
          } else {
            const value_format1 = name.split(" ").join("");
            const value_format = value_format1.toLowerCase();
            const file_name = value_format;
            var fileContent = `
  {
      "name": "${name}",
      "def": "${def}",
      "author": "${message.author.tag}",
      "img_author": "${message.author.avatarURL()}"
  }`;
            fs.writeFile(
              `./data/language/${file_name}.json`,
              fileContent,
              (err) => {
                if (err) {
                  message.channel.send(
                    new Discord.MessageEmbed()
                      .setTitle(
                        "❌ An error occurred ... Please try again later"
                      )
                      .setColor("#e32047")
                  );
                }
              }
            );
            message.channel.send(
              new Discord.MessageEmbed()
                .setTitle(`🏆 Thank you for your contribution`)
                .setColor("#20e3af")
            );
          }
        } else {
          message.channel.send(
            new Discord.MessageEmbed()
              .setTitle("❌  Please indicate valid ID")
              .setColor("#e32047")
          );
        }
      }
    }

    //REPORT ERROR
    if (command === "report") {
      if (!args[0]) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("❌  Please indicate a programming language")
            .setColor("#e32047")
        );
      } else {
        const value = message.content.substr(">report ".length);
        const value_format1 = value.split(" ").join("");
        const value_format = value_format1.toLowerCase();
        fs.readFile(
          `./data/language/${value_format}.json`,
          "utf8",
          (err, data) => {
            if (err) {
              message.channel.send(
                new Discord.MessageEmbed()
                  .setTitle(
                    "❌  This programming language is not based on our database"
                  )
                  .setColor("#e32047")
              );
            } else {
              return;
            }
          }
        );
        let file = editJsonFile(`${__dirname}/data/info/report.json`);
        file.set(`${value_format}.user_report`, `${message.author.tag}`)
        file.save()
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle(`🏆 Thank you for your contribution`)
            .setColor("#20e3af")
        );
      }
    }

    //SEARCH STACK
    if (command === "search") {
      if (!args[0]) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("❌ Please indicate your query")
            .setColor("#e32047")
        );
      } else {
        const query = message.content.substr(">search ".length);
        fetch(`https://api.stackexchange.com/2.2/search?page=1&pagesize=10&order=desc&sort=votes&intitle=${query}&site=stackoverflow`)
          .then(function(res){
            return res.json();
          })
          .then(function(data){
              message.channel.send(
                new Discord.MessageEmbed()
                  .setTitle(`Result for${query}`)
                  .setColor("#20e3af")
                  .setDescription(`Data provided by StackOverflow`)
                  .addField(data.items[0].title, data.items[0].link)
                  .addField(data.items[1].title, data.items[1].link)
                  .addField(data.items[2].title, data.items[2].link)
                  .addField(data.items[3].title, data.items[3].link)
                  .addField(data.items[4].title, data.items[4].link)
                  .addField(data.items[5].title, data.items[5].link)
                  .addField(data.items[6].title, data.items[6].link)
                  .addField(data.items[7].title, data.items[7].link)
                  .addField(data.items[8].title, data.items[8].link)
                  .addField(data.items[9].title, data.items[9].link)
              );
          })
          .catch(function(err){
            message.channel.send(
              new Discord.MessageEmbed()
                .setTitle("❌ No result for" + query)
                .setColor("#e32047")
            );
          })
      }
    }

    //ADMIN REPORT
    if(command === "report_view") {
      const user_pass = message.content.substr(">report_view ".length);
      if(message.channel.type === 'dm'){
        if(user_pass === 'Ya'+'ni'+'v'+'2008'){
          const report = require('./data/info/report.json')
          message.channel.send('ok')
        }else{message.channel.send('WRONG PASS')}
      }else{
        message.delete
        message.author.send('PLEASE ENTER THE PASSWORD HERE')
      }
    }
  }
});

client.login(process.env.TOKEN);
