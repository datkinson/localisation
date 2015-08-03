var deviceId;

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        deviceId = device.uuid;
        initialiseBluetooth();
    }
};

function initialiseBluetooth() {
    bluetoothle.initialize(
        function(success){
            console.log(success);
            startScan();
        },
        function(success){
            console.error('initialisation error: ', error);
        },
        {
            "request": true,
            "statusReceiver": true
        }
    );
}

function startScan() {
    bluetoothle.startScan(scanResult, scanError, {});
}

function scanResult(result) {
    if(result.status == "scanResult") {
        console.log('scanning result: ', result);
        submitReading({
            mac: result.address,
            client: deviceId,
            signal: ""+result.rssi+""
        });        
    }

}

function scanError(error) {
    console.error('Scanning error: ', error);
}


var socket = io('http://experimental.noprobe.uk/');

socket.on('connect', function(){
    alert('Socket connected');
});

function submitReading(reading) {
    console.log('Reading: ', reading);
    socket.emit('submitLog', reading);
}

app.initialize();
