(function() {
  "use strict";

  class FilterParameters {
    constructor(stdDev) {
      this.R = stdDev;
    }
  }

  window.FilterParameters = FilterParameters;

  class FilterState {
    constructor(initialEstimate) {

      this.Estimate = initialEstimate;
      this.Gain = 1.0;
      this.Covariance = 1.0;
    }

    measurementUpdate(parameters, measurement) {
      var k = this.Covariance / (this.Covariance + parameters.R);

      this.Gain = k;
      this.Estimate = this.Estimate + k * (measurement - this.Estimate);
      this.Covariance = (1.0 - k) * this.Covariance;

      return this;
    }
  }

  window.FilterState = FilterState;
})();
