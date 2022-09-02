const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const sharp = require("sharp");

const { PRINTER_INTERFACE } = require("./config.json");

const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: PRINTER_INTERFACE,
    removeSpecialCharacters: false,
    driver: require('printer'),
})

const run = async () => {
    await printer.println("   ");
    await printer.println("   ");
    await printer.println("   ");
    await printer.println("   ");
    await printer.println("   ");
    await printer.println("test");
    await printer.printImage("./image.png");
    await printer.cut();
    await printer.execute();
}

sharp("./image.png").resize(400, null).toFile("./image.png", (_1, _2) => {
    run()
});