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
client.on("message", (msg) => {
  if (msg.content.includes("i-") || msg.content.includes("I-") ) {
    msg.reply("oh");
  }
});
// 8ball
client.on("message", (msg) => {
  if (msg.content.includes("cafe 8ball") ) {
    var result = Math.random();
    if (result > 0.5) {
      msg.reply("yeaaaa boiii");
    } else {
      msg.reply("haha nope lol get rekt")
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