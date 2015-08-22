(function() {
    "use strict";

  class KalmanFilterVector {
    constructor(stdDev) {
      this.filters = {};
      this.parameters = new FilterParameters(stdDev);
    }

    add(mac, rssi) {
      this.filters[mac] = this.filters.hasOwnProperty(mac)
        ? this.filters[mac].measurementUpdate(this.parameters, rssi)
        : new FilterState(rssi);
    }

    get count() {
      return Object.keys(this.filters).length;
    }

    get value() {
      var v = {};

      for (var mac in this.filters) {
        v[mac] = this.filters[mac].Estimate;
      }

      return v;
    }

    get covariance() {
      var v = {};

      for (var mac in this.filters) {
        v[mac] = this.filters[mac].Covariance;
      }

      return v;
    }
  }

  window.KalmanFilterVector = KalmanFilterVector;
})();
