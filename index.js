const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const { Client } = require("discord.js");
const https = require("https");
const Stream = require("stream").Transform;
const fs = require("fs");
const sharp = require("sharp");

const { TOKEN, PRINTER_INTERFACE } = require("./config.json");

const botClient = new Client();
const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: PRINTER_INTERFACE,
  removeSpecialCharacters: false,
  driver: require('printer'),
})

const downloadImage = url => new Promise(resolve => {
  const extension = url.split(".").pop();
  const fileName = `image.${extension}`;

  console.log(url)
  https.request(url, response => {
    let data = new Stream();
    response.on("data", chunk => {
      data.push(chunk);
    });
    response.on("end", () => {
      fs.writeFileSync(fileName, data.read());
      sharp(fileName).resize(400, null).toFile("image.png", (_1, _2) => {
        resolve("image.png");
      });
    });
  }).end();
});

const printImage = async (message) => {
  message.attachments.forEach(attachment => {
    downloadImage(attachment.url)
    .then(fileName => {  
      if (fileName.includes(".png")) {
        console.log(`printing: ${fileName}`);
        return printer.printImage(fileName);
      }
      return printer.newLine();
    })
    .then(() => printer.newLine())
    .then(() => printer.execute())
    .then(() => printer.clear());
  });
};

const printText = async (displayName, text) => {
  const formattedText = `@${displayName}: ${text}`;
  console.log(`printing: ${formattedText}`);
  await printer.println(formattedText);
  await printer.execute();
  await printer.newLine();
  await printer.clear();
};

botClient.once("ready", () => console.log("client ready"));
botClient.on("message", async message => {
  await printText(message.member.displayName, message.content);
  await printImage(message);
});

botClient.login(TOKEN);