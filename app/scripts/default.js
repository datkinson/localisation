var deviceId;
var message = 'null';
var enabled = false;
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
            signal: ""+result.rssi+"",
            message: message
        });
    }

}

function scanError(error) {
    console.error('Scanning error: ', error);
}


var socket = io('http://experimental.noprobe.co.uk/');

socket.on('connect', function(){
    console.debug('Socket connected');
});

function submitReading(reading) {
    if(enabled){
      console.log('Reading: ', reading);
      socket.emit('submitNewLog', reading);
    }
}

app.initialize();


$( ".state" ).click(function() {
  if($(this).val() == 'on') {
    enabled = true;
    $('.enabled').text('Enabled');
  } else if ($(this).val() == 'off') {
    $('.enabled').text('Disabled');
    enabled = false;
  }
});

$('.distance').click(function() {
  message = $(this).val();
  $('.message-status').text(message);
});

$('.submit').click(function() {
  message = $('.misc').val();
  $('.message-status').text(message);
});
