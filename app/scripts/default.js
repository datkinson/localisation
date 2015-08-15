var deviceId;
var message = 'null';
var enabled = false;

var positionVector = {};
var locations = {};

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
        // console.log('scanning result: ', result);
        submitReading({
            mac: result.address,
            client: deviceId,
            signal: ""+result.rssi+"",
            message: message,
            time: new Date()
        });
    }

}

function scanError(error) {
    console.error('Scanning error: ', error);
}

function submitReading(reading) {
    //console.debug(reading);

    window.positionVector[reading.mac] = reading;
    console.debug(window.positionVector);
    showVectors();
}

app.initialize();


$( ".state" ).click(function() {
  if($(this).val() == 'on') {
    enabled = true;
    console.log('on');
    $('.enabled').text('Enabled');
  } else if ($(this).val() == 'off') {
    $('.enabled').text('Disabled');
    enabled = false;
    console.log('off');
  }
});

$('.distance').click(function() {
  message = $(this).val();
  $('.message-status').text(message);
});

$('.submit').click(function() {
  message = $('.misc').val();
  $('.message-status').text(message);
  window.locations[message] = JSON.parse(JSON.stringify(window.positionVector));
  console.log(window.locations);
});


function showVectors() {
  var vectorhtml = $('.vectors');
  vectorhtml.html('');
  for (var key in window.locations) {
    vectorhtml.append(key + ' - ' + calculateDistance(window.locations[key], window.positionVector) + '<br />');
  }
}

function calculateDistance(a, b) {
  var result = 0;

  for (var key in a) {
    if(!b.hasOwnProperty(key)){
      continue;
    }
    result += Math.pow((a[key].signal - b[key].signal), 2);
  }
  return result;
}
