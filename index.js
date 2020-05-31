const Discord = require("discord.js");
const config = require("dotenv");
const client = new Discord.Client({
  disableEveryone: true,
});
// dotenv directory for retrieving token 
config.config({
  path: __dirname + "/.env",
});
// ready statement, logs to console that bot is online
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
// ping command
client.on("message", (msg) => {
  if (msg.content === "cafe ping") {
    msg.reply("Pong!");
  }
});
// detects when someone types "bad" and reacts with B A D
client.on("message", (msg) => {
    if (msg.content === "bad") {
      msg.react('🇧').then(msg.react('🇦')).then(msg.react('🇩'));
    }
  });
// detects when someone types "i-" and adds to database
// client.on("message", (msg) => {
//   if (msg.content.includes("i-") || msg.content.includes("I-") ) {
//     msg.reply("oh");
//   }
// });
// detects when someone says "oop" and adds to database

// 8ball
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe 8ball") ) {
    var result = Math.random();
    if (result > 0.5) {
      msg.reply("yeaaaa boiii");
    } else {
      msg.reply("haha nope lol get rekt")
    }
  }
});
// hug
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe hug")) {
    let huggedUser = msg.mentions.users.first();
    let author = msg.author;
    if (!huggedUser) {
      return;
    } else if (huggedUser.id == author.id) {
      msg.reply("You can't hug yourself you ding dong");
      return;
    } else {
      msg.channel.send(huggedUser.username + ", You got a hug from " + author.username + "! https://tenor.com/view/anime-cuddle-cute-love-gif-12669038");
    }
  }
});
// high five
client.on("message", (msg) => {
  if (msg.content.startsWith("cafe highfive")) {
    let highfiveduser = msg.mentions.users.first();
    let author = msg.author;
    if (!highfiveduser) {
      return;
    } else if (highfiveduser.id == author.id) {
      msg.reply("You can't hug yourself you ding dong");
      return;
    } else {
      msg.channel.send(highfiveduser.username + ", You got a high five from " + author.username + "! https://tenor.com/view/pokemon-pikachu-piplup-high-five-cute-gif-16832624");
    }
  }
});
//Start of the "reporting" system
client.on("message", (msg) =>{
  if(msg.content == "=report"){
    msg.reply("EHHHHHK");
  }
});


  
// bot login
client.login(process.env.TOKEN);

// to start bot, run "node index.js"