var deviceId;
var message = 'null';
var enabled = false;

var positionVector = new KalmanFilterVector(1);
var locations = {};
var featurePositionVector = null;

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
            signal: result.rssi,
            message: message,
            time: new Date()
        });
    }
}

function scanError(error) {
    console.error('Scanning error: ', error);
}

function submitReading(reading) {

    if(window.enabled) {
      window.featurePositionVector.add(reading.mac, reading.signal);

      var txt = "<ul><li>" + window.featurePositionVector.count + "</li>";

      var covs = window.featurePositionVector.covariance;
      for (var k in covs) {
        txt += "<li>" + covs[k] + "</li>";
      }

      txt += "</ul>";

      $(".count").html(txt);
    }

    window.positionVector.add(reading.mac, reading.signal);

    showVectors();
}

app.initialize();


$( ".state" ).click(function() {
  if($(this).val() == 'on') {
    featurePositionVector = new KalmanFilterVector(1);
    enabled = true;
    console.log('on');
    $('.enabled').text('Enabled');
  } else if ($(this).val() == 'off') {
    $('.enabled').text('Disabled');
    enabled = false;
    console.log('off');
    createLocation(window.message);
  } else if ($(this).val() == "clear") {
    window.positionVector = new KalmanFilterVector(1);
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


function showVectors() {
  var vectorhtml = $('.vectors');
  var status = $('.current-status');
  vectorhtml.html('');
  for (var key in window.locations) {
    vectorhtml.append(key + ' - ' + calculateDistance(window.locations[key], window.positionVector.value) + '<br />');
  }
}

function calculateDistance(a, b) {
  var result = 0;

  var keys = Object.keys(a).concat(Object.keys(b));

  for (var index in keys) {

    var key = keys[index];

    var va = a.hasOwnProperty(key) ? a[key] : -100;
    var vb = b.hasOwnProperty(key) ? b[key] : -100;

    result += Math.pow(va - vb, 2);
  }

  return Math.sqrt(result);
}

function createLocation(message) {
  window.locations[message] = window.featurePositionVector.value;
  window.enabled = false;
}


var dist = 0;

function handleMotionEvent(event) {

  var dt = event.interval / 1000;

  var dx = event.acceleration.x * dt;
  var dy = event.acceleration.y * dt;
  var dz = event.acceleration.z * dt;

  var speed  = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2), Math.pow(dz, 2));
  if (speed < 0.01) {
    speed = 0;
  }
  window.dist += speed;

  if(window.dist > 0.5) {
    window.dist = 0;
    window.positionVector = new KalmanFilterVector(1);
  }
  $('.distance').text('Distance: ' + window.dist);
}

window.addEventListener("devicemotion", handleMotionEvent, true);
