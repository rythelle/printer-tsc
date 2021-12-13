const fs = require('fs'); //Biblioteca File System
const path = require('path'); //Biblioteca de caminhos de arquivos
//var printer = require('printer'); //(Desabilitado) Biblioteca de impressão NodeJS
var edge = require('edge-js'); //Biblioteca de integração de outras linguagens de programação no NodeJS

const numpecapath = path.resolve("../NumeroPecaPrint.txt"); //Monta caminho do número da etiqueta atual para impressão

try{
    var numpeca = fs.readFileSync(numpecapath, 'utf8') //Lê número da etiqueta atual para impressão
} catch (err) {
    console.log(err);
}

const caminho = path.resolve("../print/Etiqueta_Entrada/" + numpeca + ".zpl"); //Monta caminho da etiqueta atual para impressão

try{
    var zpl = fs.readFileSync(caminho, 'utf8'); //Lê o ZPL da etiqueta atual para impressão
} catch (err) {
    console.log(err);
}

//(Desabilitado)

/*
function printZebra(){
	printer.printDirect({
        data: zpl,
        printer: "TSC MB240T", // "\\DESKTOP-J5DJA17\IP80"
        type: "RAW", //EMF/RAW/TEXT
        success:function(){
			console.log("Arquivo enviado para impressão");
		},
        error:function(err){console.log(err);}
	});
}

printZebra();
*/

//Declaração das variáveis
var openport;
var sendcommand;
var clearbuffer;
var closeport;
var printer_status;

//Funções da impressora TSC

//Abre porta de conexão com a impressora
try {
    openport = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_ethernet',
        methodName: 'openport',
    });
}
catch (error) {
    console.log(error);
}

//Enviar comando para impressora(ZPL)
try {
    sendcommand = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_ethernet',
        methodName: 'sendcommand'
    });
}
catch (error) {
    console.log(error);
}

//Limpar buffer da impressora
try {
    clearbuffer = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_ethernet',
        methodName: 'clearbuffer'
    });
}
catch (error) {
    console.log(error);
}

//Fecha a fila de impressão da impressora no Windows
try {
    closeport = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_ethernet',
        methodName: 'closeport'
    });
}
catch (error) {
    console.log(error);
}

//Retorna status da impressora
try {
    printer_status = edge.func({
        assemblyFile: 'tsclibnet.dll',
        typeName: 'TSCSDK.node_ethernet',
        methodName: 'printerstatus_string'
    });
}
catch (error) {
    console.log(error);
}

async function printfile() { //Função de conexão e impressão assincrona

    var address = { ipaddress: '192.168.0.80', port: '9100', delay: '500' }; //Configuração do IP e porta da impressora

    if (await openport(address, true)) {

        var status = await printer_status(300, true); //(Não utilizado)Verificar status atual da impressora

        await clearbuffer('', true); //Limpar o buffer da impressora
        await sendcommand(zpl, true); //Envia o ZPL para impressora

        await closeport(2000, true); //Fecha porta de comunicação com a impressora
    }
}

printfile(); //Chama função que abre conexão com a impressora e imprimi (função acima)