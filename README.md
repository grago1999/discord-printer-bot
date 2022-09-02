# discord-printer-bot
A bot that will print any discord messages (text and images) to a printer.

# setup

You need to install the relevant npm packages (`npm i`) and create a `config.json` file. The config file should have `PRINTER_INTERFACE` which is the name of the printer interface, and `TOKEN` which is the discord bot token.

Running `node testPrinter.js` will test that the printer is set up properly by printing text and an image. To run the main program, run `node index.js`.
