// declaratin
var opcua = require("node-opcua"); //node-opcua sdk is included

// server instantiation
var server = new opcua.OPCUAServer({
    port: 4334, // TCP port is 4334
    resourcePath: "UA/OPC-UAServer", // used for creating endpoint resource name
});

// server build info is specified additionally
buildInfo : {
    productName: "OPC-UAServer";
    buildNumber: "2321";
    buildDate: new Date(2016,3,14)
}

// server initialisation
server.initialize(post_initialize);

// server initialisation argument
function post_initialize() {
    var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log('endpoint Url is: ', endpointUrl);
    server.start();
    constructAddressSpace(server);
    console.log("server initialized");
}

// extending default namespace with a device and variables
function constructAddressSpace(server) {
    
    var addressSpace = server.engine.addressSpace;

    // creating a new folder in root folder for device
    var device = addressSpace.addFolder("ObjectsFolder", {browseName: "Device"});


    // adding variable in the created device
    var variable1 = 50.0;

    server.nodeVariable1 = addressSpace.addVariable({
        componentOf: device,
        browseName: "temperature",
        dataType: "Double",
        value: {
            get: function () {
                var t = Math.random() * 3.0;
                var value = variable1 + Math.exp(t);
                return new opcua.Variant({dataType: opcua.DataType.Double, value: value});
            }
        }
    });
    
    var variable2 = 110.0;

    server.nodeVariable2 = addressSpace.addVariable({
        componentOf: device,
        browseName: "Pressure",
        dataType: "Double",
        value: {
            get: function () {
                var p = new Date() / 10000.0;
                var value = variable2 + 10.0 * Math.sin(p);
                return new opcua.Variant({dataType: opcua.DataType.Double, value: value});
            }
        }
    });
}