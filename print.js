const fs = require("fs");
const path = require("path");
//var printer = require('printer'); //(Disable)
var edge = require("edge-js");

const pathNum = path.resolve("../NumPrint.txt");

try {
  var num = fs.readFileSync(pathNum, "utf8");
} catch (err) {
  console.log(err);
}

const pathLabel = path.resolve("../print/Entry-Label/" + num + ".zpl");

try {
  var zpl = fs.readFileSync(pathLabel, "utf8");
} catch (err) {
  console.log(err);
}

//(Disable)

/*
function printZebra(){
	printer.printDirect({
        data: zpl,
        printer: "TSC MB240T", // "\\DESKTOP\IP00"
        type: "RAW", //EMF/RAW/TEXT
        success:function(){
			console.log("Sending file to printer");
		},
        error:function(err){console.log(err);}
	});
}

printZebra();
*/

var openport;
var sendcommand;
var clearbuffer;
var closeport;
var printer_status;

try {
  openport = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_ethernet",
    methodName: "openport",
  });
} catch (error) {
  console.log(error);
}

try {
  sendcommand = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_ethernet",
    methodName: "sendcommand",
  });
} catch (error) {
  console.log(error);
}

try {
  clearbuffer = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_ethernet",
    methodName: "clearbuffer",
  });
} catch (error) {
  console.log(error);
}

try {
  closeport = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_ethernet",
    methodName: "closeport",
  });
} catch (error) {
  console.log(error);
}

try {
  printer_status = edge.func({
    assemblyFile: "tsclibnet.dll",
    typeName: "TSCSDK.node_ethernet",
    methodName: "printerstatus_string",
  });
} catch (error) {
  console.log(error);
}

async function printfile() {
  var address = { ipaddress: "192.168.0.80", port: "9100", delay: "500" };

  if (await openport(address, true)) {
    var status = await printer_status(300, true); //(Disable)

    await clearbuffer("", true);
    await sendcommand(zpl, true);

    await closeport(2000, true);
  }
}

printfile();
