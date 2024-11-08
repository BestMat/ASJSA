const a = function(e){e.preventDefault();}
function getRandomInt(max) {return Math.floor(Math.random() * Math.floor(max));}
function print(x){console.log(x)}function type(s){return typeof s}
class Matrix {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    } 
    copy() {
      let m = new Matrix(this.rows, this.cols);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          m.data[i][j] = this.data[i][j];
        }
      }
      return m;
    }
  
    static fromArray(arr) {
      return new Matrix(arr.length, 1).map((e, i) => arr[i]);
    }
  
    static subtract(a, b) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        console.log('Columns and Rows of A must match Columns and Rows of B.');
        return;
      }
  
      // Return a new Matrix a-b
      return new Matrix(a.rows, a.cols)
        .map((_, i, j) => a.data[i][j] - b.data[i][j]);
    }
  
    toArray() {
      let arr = [];
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          arr.push(this.data[i][j]);
        }
      }
      return arr;
    }
  
    randomize() {
      return this.map(e => Math.random() * 2 - 1);
    }
  
    add(n) {
      if (n instanceof Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          console.log('Columns and Rows of A must match Columns and Rows of B.');
          return;
        }
        return this.map((e, i, j) => e + n.data[i][j]);
      } else {
        return this.map(e => e + n);
      }
    }
  
    static transpose(matrix) {
      return new Matrix(matrix.cols, matrix.rows)
        .map((_, i, j) => matrix.data[j][i]);
    }
  
    static multiply(a, b) {
      // Matrix product
      if (a.cols !== b.rows) {
        console.log('Columns of A must match rows of B.')
        return;
      }
  
      return new Matrix(a.rows, b.cols)
        .map((e, i, j) => {
          // Dot product of values in col
          let sum = 0;
          for (let k = 0; k < a.cols; k++) {
            sum += a.data[i][k] * b.data[k][j];
          }
          return sum;
        });
    }
  
    multiply(n) {
      if (n instanceof Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          console.log('Columns and Rows of A must match Columns and Rows of B.');
          return;
        }
  
        // hadamard product
        return this.map((e, i, j) => e * n.data[i][j]);
      } else {
        // Scalar product
        return this.map(e => e * n);
      }
    }
  
    map(func) {
      // Apply a function to every element of matrix
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          let val = this.data[i][j];
          this.data[i][j] = func(val, i, j);
        }
      }
      return this;
    }
  
    static map(matrix, func) {
      // Apply a function to every element of matrix
      return new Matrix(matrix.rows, matrix.cols)
        .map((e, i, j) => func(matrix.data[i][j], i, j));
    }
  
    print() {
      console.table(this.data);
      return this;
    }
  
    serialize() {
      return JSON.stringify(this);
    }
  
    static deserialize(data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      let matrix = new Matrix(data.rows, data.cols);
      matrix.data = data.data;
      return matrix;
    }
  }
  
  if (typeof module !== 'undefined') {
    module.exports = Matrix;
  }
  function restGet(url){
    $.get(url, function(d){
        return d
    })
}
function restPost(url){
    $.post(url, function(d){
        return d
    })
}
function detectAgeAndGender(i){
 return restGet(`https://nodeagapi.herokuapp.com/detectAge?image=${i}`)
}

class ActivationFunction {
    constructor(func, dfunc) {
      this.func = func;
      this.dfunc = dfunc;
    }
  }
  
  let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
  );
  
  let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
  );
  
  
  class NeuralNetwork {
    constructor(a, b, c) {
      if (a instanceof NeuralNetwork) {
        this.input_nodes = a.input_nodes;
        this.hidden_nodes = a.hidden_nodes;
        this.output_nodes = a.output_nodes;
  
        this.weights_ih = a.weights_ih.copy();
        this.weights_ho = a.weights_ho.copy();
  
        this.bias_h = a.bias_h.copy();
        this.bias_o = a.bias_o.copy();
      } else {
        this.input_nodes = a;
        this.hidden_nodes = b;
        this.output_nodes = c;
  
        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();
  
        this.bias_h = new Matrix(this.hidden_nodes, 1);
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();
      }
  
      // TODO: copy these as well
      this.setLearningRate();
      this.setActivationFunction();
  
  
    }
  
    predict(input_array) {
  
      // Generating the Hidden Outputs
      let inputs = Matrix.fromArray(input_array);
      let hidden = Matrix.multiply(this.weights_ih, inputs);
      hidden.add(this.bias_h);
      // activation function!
      hidden.map(this.activation_function.func);
  
      // Generating the output's output!
      let output = Matrix.multiply(this.weights_ho, hidden);
      output.add(this.bias_o);
      output.map(this.activation_function.func);
  
      // Sending back to the caller!
      return output.toArray();
    }
  
    setLearningRate(learning_rate = 0.1) {
      this.learning_rate = learning_rate;
    }
  
    setActivationFunction(func = sigmoid) {
      this.activation_function = func;
    }
  
    train(input_array, target_array) {
      // Generating the Hidden Outputs
      let inputs = Matrix.fromArray(input_array);
      let hidden = Matrix.multiply(this.weights_ih, inputs);
      hidden.add(this.bias_h);
      // activation function!
      hidden.map(this.activation_function.func);
  
      // Generating the output's output!
      let outputs = Matrix.multiply(this.weights_ho, hidden);
      outputs.add(this.bias_o);
      outputs.map(this.activation_function.func);
  
      // Convert array to matrix object
      let targets = Matrix.fromArray(target_array);
  
      // Calculate the error
      // ERROR = TARGETS - OUTPUTS
      let output_errors = Matrix.subtract(targets, outputs);
  
      // let gradient = outputs * (1 - outputs);
      // Calculate gradient
      let gradients = Matrix.map(outputs, this.activation_function.dfunc);
      gradients.multiply(output_errors);
      gradients.multiply(this.learning_rate);
  
  
      // Calculate deltas
      let hidden_T = Matrix.transpose(hidden);
      let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
  
      // Adjust the weights by deltas
      this.weights_ho.add(weight_ho_deltas);
      // Adjust the bias by its deltas (which is just the gradients)
      this.bias_o.add(gradients);
  
      // Calculate the hidden layer errors
      let who_t = Matrix.transpose(this.weights_ho);
      let hidden_errors = Matrix.multiply(who_t, output_errors);
  
      // Calculate hidden gradient
      let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
      hidden_gradient.multiply(hidden_errors);
      hidden_gradient.multiply(this.learning_rate);
  
      // Calcuate input->hidden deltas
      let inputs_T = Matrix.transpose(inputs);
      let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
  
      this.weights_ih.add(weight_ih_deltas);
      // Adjust the bias by its deltas (which is just the gradients)
      this.bias_h.add(hidden_gradient);
  
      // outputs.print();
      // targets.print();
      // error.print();
    }
  
    serialize() {
      return JSON.stringify(this);
    }
  
    static deserialize(data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
      nn.weights_ih = Matrix.deserialize(data.weights_ih);
      nn.weights_ho = Matrix.deserialize(data.weights_ho);
      nn.bias_h = Matrix.deserialize(data.bias_h);
      nn.bias_o = Matrix.deserialize(data.bias_o);
      nn.learning_rate = data.learning_rate;
      return nn;
    }
  
  
    // Adding function for neuro-evolution
    copy() {
      return new NeuralNetwork(this);
    }
  
    mutate(rate) {
      function mutate(val) {
        if (Math.random() < rate) {
          return Math.random() * 1000 - 1;
        } else {
          return val;
        }
      }
      this.weights_ih.map(mutate);
      this.weights_ho.map(mutate);
      this.bias_h.map(mutate);
      this.bias_o.map(mutate);
    }
  }

//console.log(chunk([1, 2, 3, 4, 5], 2));
// [[1,2],[3,4],[5]]












 (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.brain = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.testPartition = testPartition;
  exports.shuffleArray = shuffleArray;
  exports.default = crossValidate;
  /**
   *
   * @param {NeuralNetwork|constructor} Classifier
   * @param {object} opts
   * @param {object} trainOpts
   * @param {object} trainSet
   * @param {object} testSet
   * @returns {void|*}
   */
  function testPartition(Classifier, opts, trainOpts, trainSet, testSet) {
    var classifier = new Classifier(opts);
    var beginTrain = Date.now();
    var trainingStats = classifier.train(trainSet, trainOpts);
    var beginTest = Date.now();
    var testStats = classifier.test(testSet);
    var endTest = Date.now();
    var stats = Object.assign({}, testStats, {
      trainTime: beginTest - beginTrain,
      testTime: endTest - beginTest,
      iterations: trainingStats.iterations,
      trainError: trainingStats.error,
      learningRate: trainOpts.learningRate,
      hidden: classifier.hiddenSizes,
      network: classifier.toJSON()
    });
  
    return stats;
  }
  

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  
  /**
   *
   * @param {NeuralNetwork|constructor} Classifier
   * @param {object} data
   * @param {object} opts
   * @param {object} trainOpts
   * @param {number} k
   * @returns {
   *  {
   *    avgs: {
   *      error: number,
   *      trainTime: number,
   *      testTime: number,
   *      iterations: number,
   *      trainError: number
   *    },
   *    stats: {
   *      truePos: number,
   *      trueNeg: number,
   *      falsePos: number,
   *      falseNeg: number,
   *      total: number
   *    },
   *    sets: Array,
   *    misclasses: Array
   *  }
   * }
   */
  function crossValidate(Classifier, data, opts, trainOpts, k) {
    k = k || 4;
    var size = data.length / k;
  
    if (data.constructor === Array) {
      shuffleArray(data);
    } else {
      var newData = {};
      shuffleArray(Object.keys(data)).forEach(function (key) {
        newData[key] = data[key];
      });
      data = newData;
    }
  
    var avgs = {
      error: 0,
      trainTime: 0,
      testTime: 0,
      iterations: 0,
      trainError: 0
    };
  
    var stats = {
      truePos: 0,
      trueNeg: 0,
      falsePos: 0,
      falseNeg: 0,
      total: 0
    };
  
    var misclasses = [];
    var results = [];
    var stat = void 0;
    var sum = void 0;
  
    for (var i = 0; i < k; i++) {
      var dclone = data.slice(0);
      var testSet = dclone.splice(i * size, size);
      var trainSet = dclone;
      var result = testPartition(Classifier, opts, trainOpts, trainSet, testSet);
      for (stat in avgs) {
        if (stat in avgs) {
          sum = avgs[stat];
          avgs[stat] = sum + result[stat];
        }
      }
  
      for (stat in stats) {
        if (stat in stats) {
          sum = stats[stat];
          stats[stat] = sum + result[stat];
        }
      }
  
      misclasses.concat(results.misclasses);
  
      results.push(result);
    }
  
    for (stat in avgs) {
      if (stat in avgs) {
        sum = avgs[stat];
        avgs[stat] = sum / k;
      }
    }
  
    stats.precision = stats.truePos / (stats.truePos + stats.falsePos);
    stats.recall = stats.truePos / (stats.truePos + stats.falseNeg);
    stats.accuracy = (stats.trueNeg + stats.truePos) / stats.total;
  
    stats.testSize = size;
    stats.trainSize = data.length - size;
  
    return {
      avgs: avgs,
      stats: stats,
      sets: results,
      misclasses: misclasses
    };
  }
  
  },{}],2:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = likely;
  /**
   *
   * @param {*} input
   * @param {NeuralNetwork} net
   * @returns {*}
   */
  function likely(input, net) {
    var output = net.run(input);
    var maxProp = null;
    var maxValue = -1;
    for (var prop in output) {
      var value = output[prop];
      if (value > maxValue) {
        maxProp = prop;
        maxValue = value;
      }
    }
    return maxProp;
  }
  
  },{}],3:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  /* Functions for turning sparse hashes into arrays and vice versa */
  var lookup = function () {
    function lookup() {
      _classCallCheck(this, lookup);
    }
  
    _createClass(lookup, null, [{
      key: "buildLookup",
  
      /**
       * Performs `[{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}`
       * @param {Object} hashes
       * @returns {Object}
       */
      value: function buildLookup(hashes) {
        var hash = hashes.reduce(function (memo, hash) {
          return Object.assign(memo, hash);
        }, {});
  
        return lookup.lookupFromHash(hash);
      }
  
      /**
       * performs `{a: 6, b: 7} -> {a: 0, b: 1}`
       * @param {Object} hash
       * @returns {Object}
       */
  
    }, {
      key: "lookupFromHash",
      value: function lookupFromHash(hash) {
        var lookup = {};
        var index = 0;
        for (var i in hash) {
          lookup[i] = index++;
        }
        return lookup;
      }
  
      /**
       * performs `{a: 0, b: 1}, {a: 6} -> [6, 0]`
       * @param {*} lookup
       * @param {*} hash
       * @returns {Array}
       */
  
    }, {
      key: "toArray",
      value: function toArray(lookup, hash) {
        var array = [];
        for (var i in lookup) {
          array[lookup[i]] = hash[i] || 0;
        }
        return array;
      }
  
      /**
       * performs `{a: 0, b: 1}, [6, 7] -> {a: 6, b: 7}`
       * @param {Object} lookup
       * @param {Array} array
       * @returns {Object}
       */
  
    }, {
      key: "toHash",
      value: function toHash(lookup, array) {
        var hash = {};
        for (var i in lookup) {
          hash[i] = array[lookup[i]];
        }
        return hash;
      }
  
      /**
       *
       * @param {Array} array
       * @returns {*}
       */
  
    }, {
      key: "lookupFromArray",
      value: function lookupFromArray(array) {
        var lookup = {};
        var z = 0;
        var i = array.length;
        while (i-- > 0) {
          lookup[array[i]] = z++;
        }
        return lookup;
      }
    }]);
  
    return lookup;
  }();
  
  exports.default = lookup;
  
  },{}],4:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
  
  var _neuralNetwork = require('./neural-network');
  
  var _neuralNetwork2 = _interopRequireDefault(_neuralNetwork);
  
  var _lookup = require('./lookup');
  
  var _lookup2 = _interopRequireDefault(_lookup);
  
  var _gpu = require('gpu.js');
  
  var _gpu2 = _interopRequireDefault(_gpu);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  /**
   *
   * @param {object} options
   * @constructor
   */
  var NeuralNetworkGPU = function (_NeuralNetwork) {
    _inherits(NeuralNetworkGPU, _NeuralNetwork);
  
    function NeuralNetworkGPU() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
      _classCallCheck(this, NeuralNetworkGPU);
  
      var _this = _possibleConstructorReturn(this, (NeuralNetworkGPU.__proto__ || Object.getPrototypeOf(NeuralNetworkGPU)).call(this, options));
  
      _this.forwardPropagate = [];
      _this.backwardPropagate = [];
      _this.changesPropagate = [];
      _this.biasesPropagate = [];
      _this.biasCopies = [];
      _this.copyBias = [];
      _this.changesCopies = [];
      _this.copyChanges = [];
      _this.weightsCopies = [];
      _this.copyWeights = [];
      _this.errorCheckInterval = 100;
      _this.gpu = new _gpu2.default({ mode: options.mode });
      return _this;
    }
  
    /**
     *
     */
  
  
    _createClass(NeuralNetworkGPU, [{
      key: '_initialize',
      value: function _initialize() {
        _get(NeuralNetworkGPU.prototype.__proto__ || Object.getPrototypeOf(NeuralNetworkGPU.prototype), '_initialize', this).call(this);
        this.buildRunInput();
        this.buildCalculateDeltas();
        this.buildGetChanges();
        this.buildChangeBiases();
        this.buildGetMSE();
      }
    }, {
      key: 'setActivation',
      value: function setActivation() {}
  
      /**
       *
       * @param input
       * @param target
       * @param logErrorRate
       */
  
    }, {
      key: '_trainPattern',
      value: function _trainPattern(input, target, logErrorRate) {
        // forward propagate
        this.runInput(input);
  
        // backward propagate
        this.calculateDeltas(target);
        this.getChanges();
        this.changeBiases();
  
        if (logErrorRate) {
          return this.getMSE(this.errors[this.outputLayer])[0];
        } else {
          return null;
        }
      }
    }, {
      key: 'buildRunInput',
      value: function buildRunInput() {
        var weightedSum = null;
  
        switch (this.activation) {
          case 'sigmoid':
            weightedSum = weightedSumSigmoid;
            break;
          case 'relu':
            weightedSum = weightedSumRelu;
            break;
          case 'leaky-relu':
            weightedSum = weightedSumLeakyRelu;
            break;
          case 'tanh':
            weightedSum = weightedSumTanh;
            break;
          default:
            throw new Error('unknown activation ' + this.activation);
        }
  
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          this.forwardPropagate[layer] = this.gpu.createKernel(weightedSum, {
            output: [this.sizes[layer]],
            outputToTexture: true,
            hardcodeConstants: true,
            constants: {
              size: this.sizes[layer - 1]
            }
          });
        }
  
        this._texturizeInputData = this.gpu.createKernel(function (value) {
          return value[this.thread.x];
        }, {
          output: [this.sizes[1]],
          outputToTexture: true,
          hardcodeConstants: true,
          outputImmutable: true
        });
      }
  
      /**
       *
       * @param input
       * @returns {*}
       */
  
    }, {
      key: 'runInput',
      value: function runInput(input) {
        var output = void 0;
        this.outputs[0] = input;
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          this.outputs[layer] = this.forwardPropagate[layer](this.weights[layer], this.biases[layer], input);
          output = input = this.outputs[layer];
        }
        return output;
      }
    }, {
      key: 'buildCalculateDeltas',
      value: function buildCalculateDeltas() {
        var calcDeltas = null;
  
        switch (this.activation) {
          case 'sigmoid':
            calcDeltas = calcDeltasSigmoid;
            break;
          case 'relu':
            calcDeltas = calcDeltasRelu;
            break;
          case 'leaky-relu':
            calcDeltas = calcDeltasLeakyRelu;
            break;
          case 'tanh':
            calcDeltas = calcDeltasTanh;
            break;
          default:
            throw new Error('unknown activation ' + this.activation);
        }
  
        for (var layer = this.outputLayer; layer > 0; layer--) {
          if (layer === this.outputLayer) {
            this.backwardPropagate[layer] = this.gpu.createKernelMap({
              error: _gpu2.default.alias('calcErrorOutput', calcErrorOutput),
              deltas: _gpu2.default.alias('calcDeltas', calcDeltas)
            }, function (outputs, targets) {
              var output = outputs[this.thread.x];
              return calcDeltas(calcErrorOutput(output, targets), output);
            }, {
              output: [this.sizes[layer]],
              outputToTexture: true,
              hardcodeConstants: true
            });
          } else {
            this.backwardPropagate[layer] = this.gpu.createKernelMap({
              error: _gpu2.default.alias('calcError', calcError),
              deltas: _gpu2.default.alias('calcDeltas', calcDeltas)
            }, function (nextWeights, outputs, nextDeltas) {
              var output = outputs[this.thread.x];
              return calcDeltas(calcError(nextWeights, nextDeltas), output);
            }, {
              output: [this.sizes[layer]],
              outputToTexture: true,
              hardcodeConstants: true,
              constants: {
                size: this.deltas[layer + 1].length
              }
            });
          }
        }
      }
    }, {
      key: 'calculateDeltas',
      value: function calculateDeltas(target) {
        for (var layer = this.outputLayer; layer > 0; layer--) {
          var output = void 0;
  
          if (layer === this.outputLayer) {
            output = this.backwardPropagate[layer](this.outputs[layer], target);
          } else {
            output = this.backwardPropagate[layer](this.weights[layer + 1], this.outputs[layer], this.deltas[layer + 1]);
          }
  
          this.deltas[layer] = output.deltas;
          this.errors[layer] = output.error;
        }
      }
    }, {
      key: 'buildGetChanges',
      value: function buildGetChanges() {
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          this.changesPropagate[layer] = this.gpu.createKernelMap({
            weights: _gpu2.default.alias('addWeights', addWeights),
            changes: _gpu2.default.alias('calcChanges', calcChanges)
          }, function (previousOutputs, deltas, weights, changes) {
            var change = calcChanges(changes, deltas, previousOutputs);
  
            return addWeights(change, weights);
          }, {
            output: [this.sizes[layer - 1], this.sizes[layer]],
            outputToTexture: true,
            hardcodeConstants: true,
            constants: {
              size: this.outputs[layer - 1].length,
              learningRate: this.trainOpts.learningRate,
              momentum: this.trainOpts.momentum
            }
          });
  
          this.copyChanges[layer] = this.gpu.createKernel(function (value) {
            return value[this.thread.y][this.thread.x];
          }, {
            output: this.changesPropagate[layer].output,
            outputToTexture: true,
            hardCodeConstants: true
          });
  
          this.copyWeights[layer] = this.gpu.createKernel(function (value) {
            return value[this.thread.y][this.thread.x];
          }, {
            output: this.changesPropagate[layer].output,
            outputToTexture: true,
            hardCodeConstants: true
          });
        }
      }
    }, {
      key: 'getChanges',
      value: function getChanges() {
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          var output = this.changesPropagate[layer](this.outputs[layer - 1], this.deltas[layer], this.weightsCopies[layer] || this.weights[layer], this.changesCopies[layer] || this.changes[layer]);
          this.changes[layer] = output.changes;
          this.weights[layer] = output.weights;
  
          this.changesCopies[layer] = this.copyChanges[layer](output.changes);
          this.weightsCopies[layer] = this.copyWeights[layer](output.weights);
        }
      }
    }, {
      key: 'buildChangeBiases',
      value: function buildChangeBiases() {
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          this.biasesPropagate[layer] = this.gpu.createKernel(addBiases, {
            output: [this.sizes[layer]],
            outputToTexture: true,
            hardcodeConstants: true,
            constants: {
              learningRate: this.trainOpts.learningRate
            }
          });
          this.copyBias[layer] = this.gpu.createKernel(function (value) {
            return value[this.thread.x];
          }, {
            output: this.biasesPropagate[layer].output,
            outputToTexture: true,
            hardCodeConstants: true
          });
        }
      }
    }, {
      key: 'changeBiases',
      value: function changeBiases() {
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          this.biases[layer] = this.biasesPropagate[layer](this.biasCopies[layer] || this.biases[layer], this.deltas[layer]);
          this.biasCopies[layer] = this.copyBias[layer](this.biases[layer]);
        }
      }
    }, {
      key: 'buildGetMSE',
      value: function buildGetMSE() {
        this.getMSE = this.gpu.createKernel(mse, {
          output: [1],
          hardcodeConstants: true,
          constants: {
            size: this.sizes[this.outputLayer]
          }
        });
      }
  
      /**
       *
       * @param input
       * @returns {*}
       */
  
    }, {
      key: 'run',
      value: function run(input) {
        if (!this.isRunnable) return null;
        if (this.inputLookup) {
          input = _lookup2.default.toArray(this.inputLookup, input);
        }
        var inputTexture = this._texturizeInputData(input);
        var outputTextures = this.runInput(inputTexture);
        var output = outputTextures.toArray(this.gpu);
  
        if (this.outputLookup) {
          output = _lookup2.default.toHash(this.outputLookup, output);
        }
        return output;
      }
  
      /**
       *
       * @param data
       * Verifies network sizes are initilaized
       * If they are not it will initialize them based off the data set.
       */
  
    }, {
      key: '_verifyIsInitialized',
      value: function _verifyIsInitialized(data) {
        var _this2 = this;
  
        if (this.sizes) return;
  
        this.sizes = [];
        if (!data[0].size) {
          data[0].size = { input: data[0].input.length, output: data[0].output.length };
        }
  
        this.sizes.push(data[0].size.input);
        if (!this.hiddenSizes) {
          this.sizes.push(Math.max(3, Math.floor(data[0].size.input / 2)));
        } else {
          this.hiddenSizes.forEach(function (size) {
            _this2.sizes.push(size);
          });
        }
        this.sizes.push(data[0].size.output);
  
        this._initialize();
      }
  
      /**
       *
       * @param data
       * @param options
       * @protected
       * @return { data, status, endTime }
       */
  
    }, {
      key: '_prepTraining',
      value: function _prepTraining(data, options) {
        var _this3 = this;
  
        this._updateTrainingOptions(options);
        data = this._formatData(data);
        var endTime = Date.now() + this.trainOpts.timeout;
  
        var status = {
          error: 1,
          iterations: 0
        };
  
        this._verifyIsInitialized(data);
  
        var texturizeOutputData = this.gpu.createKernel(function (value) {
          return value[this.thread.x];
        }, {
          output: [data[0].output.length],
          outputToTexture: true,
          hardcodeConstants: true,
          outputImmutable: true
        });
  
        return {
          data: data.map(function (set) {
            return {
              size: set.size,
              input: _this3._texturizeInputData(set.input),
              output: texturizeOutputData(set.output)
            };
          }),
          status: status,
          endTime: endTime
        };
      }
    }, {
      key: 'toFunction',
      value: function toFunction() {
        throw new Error('not implemented on NeuralNetworkGPU');
      }
    }]);
  
    return NeuralNetworkGPU;
  }(_neuralNetwork2.default);
  
  exports.default = NeuralNetworkGPU;
  
  
  function weightedSumSigmoid(weights, biases, inputs) {
    var sum = biases[this.thread.x];
    for (var k = 0; k < this.constants.size; k++) {
      sum += weights[this.thread.x][k] * inputs[k];
    }
    //sigmoid
    return 1 / (1 + Math.exp(-sum));
  }
  
  function weightedSumRelu(weights, biases, inputs) {
    var sum = biases[this.thread.x];
    for (var k = 0; k < this.constants.size; k++) {
      sum += weights[this.thread.x][k] * inputs[k];
    }
    //relu
    return sum < 0 ? 0 : sum;
  }
  
  function weightedSumLeakyRelu(weights, biases, inputs) {
    var sum = biases[this.thread.x];
    for (var k = 0; k < this.constants.size; k++) {
      sum += weights[this.thread.x][k] * inputs[k];
    }
    //leaky relu
    return sum < 0 ? 0 : 0.01 * sum;
  }
  
  function weightedSumTanh(weights, biases, inputs) {
    var sum = biases[this.thread.x];
    for (var k = 0; k < this.constants.size; k++) {
      sum += weights[this.thread.x][k] * inputs[k];
    }
    //tanh
    return Math.tanh(sum);
  }
  
  function calcErrorOutput(output, targets) {
    return targets[this.thread.x] - output;
  }
  
  function calcDeltasSigmoid(error, output) {
    //sigmoid derivative
    return error * output * (1 - output);
  }
  
  function calcDeltasRelu(error, output) {
    //relu derivative
    return output > 0 ? error : 0;
  }
  
  function calcDeltasLeakyRelu(error, output) {
    //leaky relu derivative
    return output > 0 ? error : 0.01 * error;
  }
  
  function calcDeltasTanh(error, output) {
    //tanh derivative
    return (1 - output * output) * error;
  }
  
  function calcError(nextWeights, nextDeltas) {
    var error = 0;
    for (var k = 0; k < this.constants.size; k++) {
      error += nextDeltas[k] * nextWeights[k][this.thread.x];
    }
    return error;
  }
  
  function calcChanges(previousChanges, deltas, previousOutputs) {
    return this.constants.learningRate * deltas[this.thread.y] * previousOutputs[this.thread.x] + this.constants.momentum * previousChanges[this.thread.y][this.thread.x];
  }
  
  function addWeights(change, weights) {
    return change + weights[this.thread.y][this.thread.x];
  }
  
  function addBiases(biases, deltas) {
    return biases[this.thread.x] + deltas[this.thread.x] * this.constants.learningRate;
  }
  
  // mean squared error, reimplemented for GPU
  function mse(errors) {
    var sum = 0;
    for (var i = 0; i < this.constants.size; i++) {
      sum += Math.pow(errors[i], 2);
    }
    return sum / this.constants.size;
  }
  
  },{"./lookup":3,"./neural-network":5,"gpu.js":87}],5:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _lookup = require('./lookup');
  
  var _lookup2 = _interopRequireDefault(_lookup);
  
  var _trainStream = require('./train-stream');
  
  var _trainStream2 = _interopRequireDefault(_trainStream);
  
  var _max = require('./utilities/max');
  
  var _max2 = _interopRequireDefault(_max);
  
  var _mse = require('./utilities/mse');
  
  var _mse2 = _interopRequireDefault(_mse);
  
  var _randos = require('./utilities/randos');
  
  var _randos2 = _interopRequireDefault(_randos);
  
  var _range = require('./utilities/range');
  
  var _range2 = _interopRequireDefault(_range);
  
  var _toArray = require('./utilities/to-array');
  
  var _toArray2 = _interopRequireDefault(_toArray);
  
  var _zeros = require('./utilities/zeros');
  
  var _zeros2 = _interopRequireDefault(_zeros);
  
  var _thaw = require('thaw.js');
  
  var _thaw2 = _interopRequireDefault(_thaw);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  /**
   * @param {object} options
   * @constructor
   */
  var NeuralNetwork = function () {
    _createClass(NeuralNetwork, null, [{
      key: '_validateTrainingOptions',
  
  
      /**
       *
       * @param options
       * @private
       */
      value: function _validateTrainingOptions(options) {
        var validations = {
          iterations: function iterations(val) {
            return typeof val === 'number' && val > 0;
          },
          errorThresh: function errorThresh(val) {
            return typeof val === 'number' && val > 0 && val < 1;
          },
          log: function log(val) {
            return typeof val === 'function' || typeof val === 'boolean';
          },
          logPeriod: function logPeriod(val) {
            return typeof val === 'number' && val > 0;
          },
          learningRate: function learningRate(val) {
            return typeof val === 'number' && val > 0 && val < 1;
          },
          momentum: function momentum(val) {
            return typeof val === 'number' && val > 0 && val < 1;
          },
          callback: function callback(val) {
            return typeof val === 'function' || val === null;
          },
          callbackPeriod: function callbackPeriod(val) {
            return typeof val === 'number' && val > 0;
          },
          timeout: function timeout(val) {
            return typeof val === 'number' && val > 0;
          }
        };
        Object.keys(NeuralNetwork.trainDefaults).forEach(function (key) {
          if (validations.hasOwnProperty(key) && !validations[key](options[key])) {
            throw new Error('[' + key + ', ' + options[key] + '] is out of normal training range, your network will probably not train.');
          }
        });
      }
    }, {
      key: 'trainDefaults',
      get: function get() {
        return {
          iterations: 20000, // the maximum times to iterate the training data
          errorThresh: 0.005, // the acceptable error percentage from training data
          log: false, // true to use console.log, when a function is supplied it is used
          logPeriod: 10, // iterations between logging out
          learningRate: 0.3, // multiply's against the input and the delta then adds to momentum
          momentum: 0.1, // multiply's against the specified "change" then adds to learning rate for change
          callback: null, // a periodic call back that can be triggered while training
          callbackPeriod: 10, // the number of iterations through the training data between callback calls
          timeout: Infinity // the max number of milliseconds to train for
        };
      }
    }, {
      key: 'defaults',
      get: function get() {
        return {
          binaryThresh: 0.5, // ¯\_(ツ)_/¯
          hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
          activation: 'sigmoid' // Supported activation types ['sigmoid', 'relu', 'leaky-relu', 'tanh']
        };
      }
    }]);
  
    function NeuralNetwork() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
      _classCallCheck(this, NeuralNetwork);
  
      Object.assign(this, this.constructor.defaults, options);
      this.hiddenSizes = options.hiddenLayers;
      this.trainOpts = {};
      this._updateTrainingOptions(Object.assign({}, this.constructor.trainDefaults, options));
  
      this.sizes = null;
      this.outputLayer = null;
      this.biases = null; // weights for bias nodes
      this.weights = null;
      this.outputs = null;
  
      // state for training
      this.deltas = null;
      this.changes = null; // for momentum
      this.errors = null;
      this.errorCheckInterval = 1;
      if (!this.constructor.prototype.hasOwnProperty('runInput')) {
        this.runInput = null;
      }
      if (!this.constructor.prototype.hasOwnProperty('calculateDeltas')) {
        this.calculateDeltas = null;
      }
    }
  
    /**
     *
     * Expects this.sizes to have been set
     */
  
  
    _createClass(NeuralNetwork, [{
      key: '_initialize',
      value: function _initialize() {
        if (!this.sizes) throw new Error('Sizes must be set before initializing');
  
        this.outputLayer = this.sizes.length - 1;
        this.biases = []; // weights for bias nodes
        this.weights = [];
        this.outputs = [];
  
        // state for training
        this.deltas = [];
        this.changes = []; // for momentum
        this.errors = [];
  
        for (var layer = 0; layer <= this.outputLayer; layer++) {
          var size = this.sizes[layer];
          this.deltas[layer] = (0, _zeros2.default)(size);
          this.errors[layer] = (0, _zeros2.default)(size);
          this.outputs[layer] = (0, _zeros2.default)(size);
  
          if (layer > 0) {
            this.biases[layer] = (0, _randos2.default)(size);
            this.weights[layer] = new Array(size);
            this.changes[layer] = new Array(size);
  
            for (var node = 0; node < size; node++) {
              var prevSize = this.sizes[layer - 1];
              this.weights[layer][node] = (0, _randos2.default)(prevSize);
              this.changes[layer][node] = (0, _zeros2.default)(prevSize);
            }
          }
        }
  
        this.setActivation();
      }
  
      /**
       *
       * @param activation supported inputs: 'sigmoid', 'relu', 'leaky-relu', 'tanh'
       */
  
    }, {
      key: 'setActivation',
      value: function setActivation(activation) {
        this.activation = activation ? activation : this.activation;
        switch (this.activation) {
          case 'sigmoid':
            this.runInput = this.runInput || this._runInputSigmoid;
            this.calculateDeltas = this.calculateDeltas || this._calculateDeltasSigmoid;
            break;
          case 'relu':
            this.runInput = this.runInput || this._runInputRelu;
            this.calculateDeltas = this.calculateDeltas || this._calculateDeltasRelu;
            break;
          case 'leaky-relu':
            this.runInput = this.runInput || this._runInputLeakyRelu;
            this.calculateDeltas = this.calculateDeltas || this._calculateDeltasLeakyRelu;
            break;
          case 'tanh':
            this.runInput = this.runInput || this._runInputTanh;
            this.calculateDeltas = this.calculateDeltas || this._calculateDeltasTanh;
            break;
          default:
            throw new Error('unknown activation ' + this.activation + ', The activation should be one of [\'sigmoid\', \'relu\', \'leaky-relu\', \'tanh\']');
        }
      }
  
      /**
       *
       * @returns boolean
       */
  
    }, {
      key: 'run',
  
  
      /**
       *
       * @param input
       * @returns {*}
       */
      value: function run(input) {
        if (!this.isRunnable) return null;
        if (this.inputLookup) {
          input = _lookup2.default.toArray(this.inputLookup, input);
        }
  
        var output = [].concat(_toConsumableArray(this.runInput(input)));
  
        if (this.outputLookup) {
          output = _lookup2.default.toHash(this.outputLookup, output);
        }
        return output;
      }
  
      /**
       * trains via sigmoid
       * @param input
       * @returns {*}
       */
  
    }, {
      key: '_runInputSigmoid',
      value: function _runInputSigmoid(input) {
        this.outputs[0] = input; // set output state of input layer
  
        var output = null;
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var weights = this.weights[layer][node];
  
            var sum = this.biases[layer][node];
            for (var k = 0; k < weights.length; k++) {
              sum += weights[k] * input[k];
            }
            //sigmoid
            this.outputs[layer][node] = 1 / (1 + Math.exp(-sum));
          }
          output = input = this.outputs[layer];
        }
        return output;
      }
    }, {
      key: '_runInputRelu',
      value: function _runInputRelu(input) {
        this.outputs[0] = input; // set output state of input layer
  
        var output = null;
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var weights = this.weights[layer][node];
  
            var sum = this.biases[layer][node];
            for (var k = 0; k < weights.length; k++) {
              sum += weights[k] * input[k];
            }
            //relu
            this.outputs[layer][node] = sum < 0 ? 0 : sum;
          }
          output = input = this.outputs[layer];
        }
        return output;
      }
    }, {
      key: '_runInputLeakyRelu',
      value: function _runInputLeakyRelu(input) {
        this.outputs[0] = input; // set output state of input layer
  
        var output = null;
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var weights = this.weights[layer][node];
  
            var sum = this.biases[layer][node];
            for (var k = 0; k < weights.length; k++) {
              sum += weights[k] * input[k];
            }
            //leaky relu
            this.outputs[layer][node] = sum < 0 ? 0 : 0.01 * sum;
          }
          output = input = this.outputs[layer];
        }
        return output;
      }
    }, {
      key: '_runInputTanh',
      value: function _runInputTanh(input) {
        this.outputs[0] = input; // set output state of input layer
  
        var output = null;
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var weights = this.weights[layer][node];
  
            var sum = this.biases[layer][node];
            for (var k = 0; k < weights.length; k++) {
              sum += weights[k] * input[k];
            }
            //tanh
            this.outputs[layer][node] = Math.tanh(sum);
          }
          output = input = this.outputs[layer];
        }
        return output;
      }
  
      /**
       *
       * @param data
       * Verifies network sizes are initilaized
       * If they are not it will initialize them based off the data set.
       */
  
    }, {
      key: '_verifyIsInitialized',
      value: function _verifyIsInitialized(data) {
        var _this = this;
  
        if (this.sizes) return;
  
        this.sizes = [];
        this.sizes.push(data[0].input.length);
        if (!this.hiddenSizes) {
          this.sizes.push(Math.max(3, Math.floor(data[0].input.length / 2)));
        } else {
          this.hiddenSizes.forEach(function (size) {
            _this.sizes.push(size);
          });
        }
        this.sizes.push(data[0].output.length);
  
        this._initialize();
      }
  
      /**
       *
       * @param opts
       *    Supports all `trainDefaults` properties
       *    also supports:
       *       learningRate: (number),
       *       momentum: (number),
       *       activation: 'sigmoid', 'relu', 'leaky-relu', 'tanh'
       */
  
    }, {
      key: '_updateTrainingOptions',
      value: function _updateTrainingOptions(opts) {
        var _this2 = this;
  
        Object.keys(NeuralNetwork.trainDefaults).forEach(function (opt) {
          return _this2.trainOpts[opt] = opts.hasOwnProperty(opt) ? opts[opt] : _this2.trainOpts[opt];
        });
        NeuralNetwork._validateTrainingOptions(this.trainOpts);
        this._setLogMethod(opts.log || this.trainOpts.log);
        this.activation = opts.activation || this.activation;
      }
  
      /**
       *
       *  Gets JSON of trainOpts object
       *    NOTE: Activation is stored directly on JSON object and not in the training options
       */
  
    }, {
      key: '_getTrainOptsJSON',
      value: function _getTrainOptsJSON() {
        var _this3 = this;
  
        return Object.keys(NeuralNetwork.trainDefaults).reduce(function (opts, opt) {
          if (opt === 'timeout' && _this3.trainOpts[opt] === Infinity) return opts;
          if (_this3.trainOpts[opt]) opts[opt] = _this3.trainOpts[opt];
          if (opt === 'log') opts.log = typeof opts.log === 'function';
          return opts;
        }, {});
      }
  
      /**
       *
       * @param log
       * if a method is passed in method is used
       * if false passed in nothing is logged
       * @returns error
       */
  
    }, {
      key: '_setLogMethod',
      value: function _setLogMethod(log) {
        if (typeof log === 'function') {
          this.trainOpts.log = log;
        } else if (log) {
          this.trainOpts.log = console.log;
        } else {
          this.trainOpts.log = false;
        }
      }
  
      /**
       *
       * @param data
       * @returns {Number} error
       */
  
    }, {
      key: '_calculateTrainingError',
      value: function _calculateTrainingError(data) {
        var sum = 0;
        for (var i = 0; i < data.length; ++i) {
          sum += this._trainPattern(data[i].input, data[i].output, true);
        }
        return sum / data.length;
      }
  
      /**
       * @param data
       * @private
       */
  
    }, {
      key: '_trainPatterns',
      value: function _trainPatterns(data) {
        for (var i = 0; i < data.length; ++i) {
          this._trainPattern(data[i].input, data[i].output, false);
        }
      }
  
      /**
       *
       * @param {object} data
       * @param {object} status { iterations: number, error: number }
       * @param endTime
       */
  
    }, {
      key: '_trainingTick',
      value: function _trainingTick(data, status, endTime) {
        if (status.iterations >= this.trainOpts.iterations || status.error <= this.trainOpts.errorThresh || Date.now() >= endTime) {
          return false;
        }
  
        status.iterations++;
  
        if (this.trainOpts.log && status.iterations % this.trainOpts.logPeriod === 0) {
          status.error = this._calculateTrainingError(data);
          this.trainOpts.log('iterations: ' + status.iterations + ', training error: ' + status.error);
        } else {
          if (status.iterations % this.errorCheckInterval === 0) {
            status.error = this._calculateTrainingError(data);
          } else {
            this._trainPatterns(data);
          }
        }
  
        if (this.trainOpts.callback && status.iterations % this.trainOpts.callbackPeriod === 0) {
          this.trainOpts.callback(Object.assign(status));
        }
        return true;
      }
  
      /**
       *
       * @param data
       * @param options
       * @protected
       * @return { data, status, endTime }
       */
  
    }, {
      key: '_prepTraining',
      value: function _prepTraining(data, options) {
        this._updateTrainingOptions(options);
        data = this._formatData(data);
        var endTime = Date.now() + this.trainOpts.timeout;
  
        var status = {
          error: 1,
          iterations: 0
        };
  
        this._verifyIsInitialized(data);
  
        return {
          data: data,
          status: status,
          endTime: endTime
        };
      }
  
      /**
       *
       * @param data
       * @param options
       * @returns {{error: number, iterations: number}}
       */
  
    }, {
      key: 'train',
      value: function train(data) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  
        var status = void 0,
            endTime = void 0;
  
        var _prepTraining2 = this._prepTraining(data, options);
  
        data = _prepTraining2.data;
        status = _prepTraining2.status;
        endTime = _prepTraining2.endTime;
  
  
        while (this._trainingTick(data, status, endTime)) {}
        return status;
      }
  
      /**
       *
       * @param data
       * @param options
       * @returns {Promise}
       * @resolves {{error: number, iterations: number}}
       * @rejects {{trainError: string, status: {error: number, iterations: number}}
       */
  
    }, {
      key: 'trainAsync',
      value: function trainAsync(data) {
        var _this4 = this;
  
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  
        var status = void 0,
            endTime = void 0;
  
        var _prepTraining3 = this._prepTraining(data, options);
  
        data = _prepTraining3.data;
        status = _prepTraining3.status;
        endTime = _prepTraining3.endTime;
  
  
        return new Promise(function (resolve, reject) {
          try {
            var thawedTrain = new _thaw2.default(new Array(_this4.trainOpts.iterations), {
              delay: true,
              each: function each() {
                return _this4._trainingTick(data, status, endTime) || thawedTrain.stop();
              },
              done: function done() {
                return resolve(status);
              }
            });
            thawedTrain.tick();
          } catch (trainError) {
            reject({ trainError: trainError, status: status });
          }
        });
      }
  
      /**
       *
       * @param input
       * @param target
       */
  
    }, {
      key: '_trainPattern',
      value: function _trainPattern(input, target, logErrorRate) {
  
        // forward propagate
        this.runInput(input);
  
        // back propagate
        this.calculateDeltas(target);
        this._adjustWeights();
  
        if (logErrorRate) {
          return (0, _mse2.default)(this.errors[this.outputLayer]);
        } else {
          return null;
        }
      }
  
      /**
       *
       * @param target
       */
  
    }, {
      key: '_calculateDeltasSigmoid',
      value: function _calculateDeltasSigmoid(target) {
        for (var layer = this.outputLayer; layer >= 0; layer--) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var output = this.outputs[layer][node];
  
            var error = 0;
            if (layer === this.outputLayer) {
              error = target[node] - output;
            } else {
              var deltas = this.deltas[layer + 1];
              for (var k = 0; k < deltas.length; k++) {
                error += deltas[k] * this.weights[layer + 1][k][node];
              }
            }
            this.errors[layer][node] = error;
            this.deltas[layer][node] = error * output * (1 - output);
          }
        }
      }
  
      /**
       *
       * @param target
       */
  
    }, {
      key: '_calculateDeltasRelu',
      value: function _calculateDeltasRelu(target) {
        for (var layer = this.outputLayer; layer >= 0; layer--) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var output = this.outputs[layer][node];
  
            var error = 0;
            if (layer === this.outputLayer) {
              error = target[node] - output;
            } else {
              var deltas = this.deltas[layer + 1];
              for (var k = 0; k < deltas.length; k++) {
                error += deltas[k] * this.weights[layer + 1][k][node];
              }
            }
            this.errors[layer][node] = error;
            this.deltas[layer][node] = output > 0 ? error : 0;
          }
        }
      }
  
      /**
       *
       * @param target
       */
  
    }, {
      key: '_calculateDeltasLeakyRelu',
      value: function _calculateDeltasLeakyRelu(target) {
        for (var layer = this.outputLayer; layer >= 0; layer--) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var output = this.outputs[layer][node];
  
            var error = 0;
            if (layer === this.outputLayer) {
              error = target[node] - output;
            } else {
              var deltas = this.deltas[layer + 1];
              for (var k = 0; k < deltas.length; k++) {
                error += deltas[k] * this.weights[layer + 1][k][node];
              }
            }
            this.errors[layer][node] = error;
            this.deltas[layer][node] = output > 0 ? error : 0.01 * error;
          }
        }
      }
  
      /**
       *
       * @param target
       */
  
    }, {
      key: '_calculateDeltasTanh',
      value: function _calculateDeltasTanh(target) {
        for (var layer = this.outputLayer; layer >= 0; layer--) {
          for (var node = 0; node < this.sizes[layer]; node++) {
            var output = this.outputs[layer][node];
  
            var error = 0;
            if (layer === this.outputLayer) {
              error = target[node] - output;
            } else {
              var deltas = this.deltas[layer + 1];
              for (var k = 0; k < deltas.length; k++) {
                error += deltas[k] * this.weights[layer + 1][k][node];
              }
            }
            this.errors[layer][node] = error;
            this.deltas[layer][node] = (1 - output * output) * error;
          }
        }
      }
  
      /**
       *
       * Changes weights of networks
       */
  
    }, {
      key: '_adjustWeights',
      value: function _adjustWeights() {
        for (var layer = 1; layer <= this.outputLayer; layer++) {
          var incoming = this.outputs[layer - 1];
  
          for (var node = 0; node < this.sizes[layer]; node++) {
            var delta = this.deltas[layer][node];
  
            for (var k = 0; k < incoming.length; k++) {
              var change = this.changes[layer][node][k];
  
              change = this.trainOpts.learningRate * delta * incoming[k] + this.trainOpts.momentum * change;
  
              this.changes[layer][node][k] = change;
              this.weights[layer][node][k] += change;
            }
            this.biases[layer][node] += this.trainOpts.learningRate * delta;
          }
        }
      }
  
      /**
       *
       * @param data
       * @returns {*}
       */
  
    }, {
      key: '_formatData',
      value: function _formatData(data) {
        var _this5 = this;
  
        if (!Array.isArray(data)) {
          // turn stream datum into array
          var tmp = [];
          tmp.push(data);
          data = tmp;
        }
        // turn sparse hash input into arrays with 0s as filler
        var datum = data[0].input;
        if (!Array.isArray(datum) && !(datum instanceof Float32Array)) {
          if (!this.inputLookup) {
            this.inputLookup = _lookup2.default.buildLookup(data.map(function (value) {
              return value['input'];
            }));
          }
          data = data.map(function (datum) {
            var array = _lookup2.default.toArray(_this5.inputLookup, datum.input);
            return Object.assign({}, datum, { input: array });
          }, this);
        }
  
        if (!Array.isArray(data[0].output)) {
          if (!this.outputLookup) {
            this.outputLookup = _lookup2.default.buildLookup(data.map(function (value) {
              return value['output'];
            }));
          }
          data = data.map(function (datum) {
            var array = _lookup2.default.toArray(_this5.outputLookup, datum.output);
            return Object.assign({}, datum, { output: array });
          }, this);
        }
        return data;
      }
  
      /**
       *
       * @param data
       * @returns {
       *  {
       *    error: number,
       *    misclasses: Array
       *  }
       * }
       */
  
    }, {
      key: 'test',
      value: function test(data) {
        var _this6 = this;
  
        data = this._formatData(data);
  
        // for binary classification problems with one output node
        var isBinary = data[0].output.length === 1;
        var falsePos = 0;
        var falseNeg = 0;
        var truePos = 0;
        var trueNeg = 0;
  
        // for classification problems
        var misclasses = [];
  
        // run each pattern through the trained network and collect
        // error and misclassification statistics
        var sum = 0;
  
        var _loop = function _loop(i) {
          var output = _this6.runInput(data[i].input);
          var target = data[i].output;
  
          var actual = void 0,
              expected = void 0;
          if (isBinary) {
            actual = output[0] > _this6.binaryThresh ? 1 : 0;
            expected = target[0];
          } else {
            actual = output.indexOf((0, _max2.default)(output));
            expected = target.indexOf((0, _max2.default)(target));
          }
  
          if (actual !== expected) {
            var misclass = data[i];
            Object.assign(misclass, {
              actual: actual,
              expected: expected
            });
            misclasses.push(misclass);
          }
  
          if (isBinary) {
            if (actual === 0 && expected === 0) {
              trueNeg++;
            } else if (actual === 1 && expected === 1) {
              truePos++;
            } else if (actual === 0 && expected === 1) {
              falseNeg++;
            } else if (actual === 1 && expected === 0) {
              falsePos++;
            }
          }
  
          var errors = output.map(function (value, i) {
            return target[i] - value;
          });
          sum += (0, _mse2.default)(errors);
        };
  
        for (var i = 0; i < data.length; i++) {
          _loop(i);
        }
        var error = sum / data.length;
  
        var stats = {
          error: error,
          misclasses: misclasses
        };
  
        if (isBinary) {
          Object.assign(stats, {
            trueNeg: trueNeg,
            truePos: truePos,
            falseNeg: falseNeg,
            falsePos: falsePos,
            total: data.length,
            precision: truePos / (truePos + falsePos),
            recall: truePos / (truePos + falseNeg),
            accuracy: (trueNeg + truePos) / data.length
          });
        }
        return stats;
      }
  
      /**
       *
       * @returns
       *  {
       *    layers: [
       *      {
       *        x: {},
       *        y: {}
       *      },
       *      {
       *        '0': {
       *          bias: -0.98771313,
       *          weights: {
       *            x: 0.8374838,
       *            y: 1.245858
       *          },
       *        '1': {
       *          bias: 3.48192004,
       *          weights: {
       *            x: 1.7825821,
       *            y: -2.67899
       *          }
       *        }
       *      },
       *      {
       *        f: {
       *          bias: 0.27205739,
       *          weights: {
       *            '0': 1.3161821,
       *            '1': 2.00436
       *          }
       *        }
       *      }
       *    ]
       *  }
       */
  
    }, {
      key: 'toJSON',
      value: function toJSON() {
        var layers = [];
        for (var layer = 0; layer <= this.outputLayer; layer++) {
          layers[layer] = {};
  
          var nodes = void 0;
          // turn any internal arrays back into hashes for readable json
          if (layer === 0 && this.inputLookup) {
            nodes = Object.keys(this.inputLookup);
          } else if (layer === this.outputLayer && this.outputLookup) {
            nodes = Object.keys(this.outputLookup);
          } else {
            nodes = (0, _range2.default)(0, this.sizes[layer]);
          }
  
          for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            layers[layer][node] = {};
  
            if (layer > 0) {
              layers[layer][node].bias = this.biases[layer][j];
              layers[layer][node].weights = {};
              for (var k in layers[layer - 1]) {
                var index = k;
                if (layer === 1 && this.inputLookup) {
                  index = this.inputLookup[k];
                }
                layers[layer][node].weights[k] = this.weights[layer][j][index];
              }
            }
          }
        }
        return {
          sizes: this.sizes,
          layers: layers,
          outputLookup: !!this.outputLookup,
          inputLookup: !!this.inputLookup,
          activation: this.activation,
          trainOpts: this._getTrainOptsJSON()
        };
      }
  
      /**
       *
       * @param json
       * @returns {NeuralNetwork}
       */
  
    }, {
      key: 'fromJSON',
      value: function fromJSON(json) {
        this.sizes = json.sizes;
        this._initialize();
  
        for (var i = 0; i <= this.outputLayer; i++) {
          var layer = json.layers[i];
          if (i === 0 && (!layer[0] || json.inputLookup)) {
            this.inputLookup = _lookup2.default.lookupFromHash(layer);
          } else if (i === this.outputLayer && (!layer[0] || json.outputLookup)) {
            this.outputLookup = _lookup2.default.lookupFromHash(layer);
          }
          if (i > 0) {
            var nodes = Object.keys(layer);
            this.sizes[i] = nodes.length;
            for (var j in nodes) {
              var node = nodes[j];
              this.biases[i][j] = layer[node].bias;
              this.weights[i][j] = (0, _toArray2.default)(layer[node].weights);
            }
          }
        }
        if (json.hasOwnProperty('trainOpts')) {
          this._updateTrainingOptions(json.trainOpts);
        }
        this.setActivation(this.activation || 'sigmoid');
        return this;
      }
  
      /**
       *
       * @returns {Function}
       */
  
    }, {
      key: 'toFunction',
      value: function toFunction() {
        var activation = this.activation;
        function nodeHandle(layers, layerNumber, nodeKey) {
          if (layerNumber === 0) {
            return typeof nodeKey === 'string' ? 'input[\'' + nodeKey + '\']' : 'input[' + nodeKey + ']';
          }
  
          var layer = layers[layerNumber];
          var node = layer[nodeKey];
          var result = [node.bias];
          for (var w in node.weights) {
            if (node.weights[w] < 0) {
              result.push(node.weights[w] + '*(' + nodeHandle(layers, layerNumber - 1, w) + ')');
            } else {
              result.push('+' + node.weights[w] + '*(' + nodeHandle(layers, layerNumber - 1, w) + ')');
            }
          }
  
          switch (activation) {
            case 'sigmoid':
              return '1/(1+1/Math.exp(' + result.join('') + '))';
            case 'relu':
              return 'var sum = ' + result.join('') + ';(sum < 0 ? 0 : sum);';
            case 'leaky-relu':
              return 'var sum = ' + result.join('') + ';(sum < 0 ? 0 : 0.01 * sum);';
            case 'tanh':
              return 'Math.tanh(' + result.join('') + ');';
            default:
              throw new Error('unknown activation type ' + activation);
          }
        }
  
        var layers = this.toJSON().layers;
        var layersAsMath = [];
        var result = void 0;
        for (var i in layers[layers.length - 1]) {
          layersAsMath.push(nodeHandle(layers, layers.length - 1, i));
        }
        if (this.outputLookup) {
          result = '{' + Object.keys(this.outputLookup).map(function (key, i) {
            return '\'' + key + '\':' + layersAsMath[i];
          }) + '}';
        } else {
          result = '[' + layersAsMath.join(',') + ']';
        }
        return new Function('input', 'return ' + result);
      }
  
      /**
       * This will create a TrainStream (WriteStream) for us to send the training data to.
       * @param opts training options
       * @returns {TrainStream|*}
       */
  
    }, {
      key: 'createTrainStream',
      value: function createTrainStream(opts) {
        opts = opts || {};
        opts.neuralNetwork = this;
        this.setActivation();
        this.trainStream = new _trainStream2.default(opts);
        return this.trainStream;
      }
    }, {
      key: 'isRunnable',
      get: function get() {
        var _this7 = this;
  
        if (!this.runInput) {
          console.error('Activation function has not been initialized, did you run train()?');
          return false;
        }
  
        var checkFns = ['sizes', 'outputLayer', 'biases', 'weights', 'outputs', 'deltas', 'changes', 'errors'].filter(function (c) {
          return _this7[c] === null;
        });
  
        if (checkFns.length > 0) {
          console.error('Some settings have not been initialized correctly, did you run train()? Found issues with: ' + checkFns.join(', '));
          return false;
        }
        return true;
      }
    }]);
  
    return NeuralNetwork;
  }();
  
  exports.default = NeuralNetwork;
  
  },{"./lookup":3,"./train-stream":36,"./utilities/max":38,"./utilities/mse":39,"./utilities/randos":43,"./utilities/range":44,"./utilities/to-array":45,"./utilities/zeros":46,"thaw.js":111}],6:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _matrix = require('./matrix');
  
  var _matrix2 = _interopRequireDefault(_matrix);
  
  var _gru = require('./gru');
  
  var _gru2 = _interopRequireDefault(_gru);
  
  var _rnnTimeStep = require('./rnn-time-step');
  
  var _rnnTimeStep2 = _interopRequireDefault(_rnnTimeStep);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var GRUTimeStep = function (_RNNTimeStep) {
    _inherits(GRUTimeStep, _RNNTimeStep);
  
    function GRUTimeStep() {
      _classCallCheck(this, GRUTimeStep);
  
      return _possibleConstructorReturn(this, (GRUTimeStep.__proto__ || Object.getPrototypeOf(GRUTimeStep)).apply(this, arguments));
    }
  
    _createClass(GRUTimeStep, [{
      key: 'getModel',
      value: function getModel(hiddenSize, prevSize) {
        return _gru2.default.prototype.getModel(hiddenSize, prevSize);
      }
  
      /**
       *
       * @param {Equation} equation
       * @param {Matrix} inputMatrix
       * @param {Matrix} previousResult
       * @param {Object} hiddenLayer
       * @returns {Matrix}
       */
  
    }, {
      key: 'getEquation',
      value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        return _gru2.default.prototype.getEquation(equation, inputMatrix, previousResult, hiddenLayer);
      }
    }]);
  
    return GRUTimeStep;
  }(_rnnTimeStep2.default);
  
  exports.default = GRUTimeStep;
  
  },{"./gru":7,"./matrix":16,"./rnn-time-step":34}],7:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _matrix = require('./matrix');
  
  var _matrix2 = _interopRequireDefault(_matrix);
  
  var _randomMatrix = require('./matrix/random-matrix');
  
  var _randomMatrix2 = _interopRequireDefault(_randomMatrix);
  
  var _rnn = require('./rnn');
  
  var _rnn2 = _interopRequireDefault(_rnn);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var GRU = function (_RNN) {
    _inherits(GRU, _RNN);
  
    function GRU() {
      _classCallCheck(this, GRU);
  
      return _possibleConstructorReturn(this, (GRU.__proto__ || Object.getPrototypeOf(GRU)).apply(this, arguments));
    }
  
    _createClass(GRU, [{
      key: 'getModel',
      value: function getModel(hiddenSize, prevSize) {
        return {
          // update Gate
          //wzxh
          updateGateInputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //wzhh
          updateGateHiddenMatrix: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bz
          updateGateBias: new _matrix2.default(hiddenSize, 1),
  
          // reset Gate
          //wrxh
          resetGateInputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //wrhh
          resetGateHiddenMatrix: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //br
          resetGateBias: new _matrix2.default(hiddenSize, 1),
  
          // cell write parameters
          //wcxh
          cellWriteInputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //wchh
          cellWriteHiddenMatrix: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bc
          cellWriteBias: new _matrix2.default(hiddenSize, 1)
        };
      }
  
      /**
       *
       * @param {Equation} equation
       * @param {Matrix} inputMatrix
       * @param {Matrix} previousResult
       * @param {Object} hiddenLayer
       * @returns {Matrix}
       */
  
    }, {
      key: 'getEquation',
      value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        var sigmoid = equation.sigmoid.bind(equation);
        var add = equation.add.bind(equation);
        var multiply = equation.multiply.bind(equation);
        var multiplyElement = equation.multiplyElement.bind(equation);
        var tanh = equation.tanh.bind(equation);
        var allOnes = equation.allOnes.bind(equation);
        var cloneNegative = equation.cloneNegative.bind(equation);
  
        // update gate
        var updateGate = sigmoid(add(add(multiply(hiddenLayer.updateGateInputMatrix, inputMatrix), multiply(hiddenLayer.updateGateHiddenMatrix, previousResult)), hiddenLayer.updateGateBias));
  
        // reset gate
        var resetGate = sigmoid(add(add(multiply(hiddenLayer.resetGateInputMatrix, inputMatrix), multiply(hiddenLayer.resetGateHiddenMatrix, previousResult)), hiddenLayer.resetGateBias));
  
        // cell
        var cell = tanh(add(add(multiply(hiddenLayer.cellWriteInputMatrix, inputMatrix), multiply(hiddenLayer.cellWriteHiddenMatrix, multiplyElement(resetGate, previousResult))), hiddenLayer.cellWriteBias));
  
        // compute hidden state as gated, saturated cell activations
        // negate updateGate
        return add(multiplyElement(add(allOnes(updateGate.rows, updateGate.columns), cloneNegative(updateGate)), cell), multiplyElement(previousResult, updateGate));
      }
    }]);
  
    return GRU;
  }(_rnn2.default);
  
  exports.default = GRU;
  
  },{"./matrix":16,"./matrix/random-matrix":23,"./rnn":35}],8:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _matrix = require('./matrix');
  
  var _matrix2 = _interopRequireDefault(_matrix);
  
  var _lstm = require('./lstm');
  
  var _lstm2 = _interopRequireDefault(_lstm);
  
  var _rnnTimeStep = require('./rnn-time-step');
  
  var _rnnTimeStep2 = _interopRequireDefault(_rnnTimeStep);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var LSTMTimeStep = function (_RNNTimeStep) {
    _inherits(LSTMTimeStep, _RNNTimeStep);
  
    function LSTMTimeStep() {
      _classCallCheck(this, LSTMTimeStep);
  
      return _possibleConstructorReturn(this, (LSTMTimeStep.__proto__ || Object.getPrototypeOf(LSTMTimeStep)).apply(this, arguments));
    }
  
    _createClass(LSTMTimeStep, [{
      key: 'getModel',
      value: function getModel(hiddenSize, prevSize) {
        return _lstm2.default.prototype.getModel.call(this, hiddenSize, prevSize);
      }
  
      /**
       *
       * @param {Equation} equation
       * @param {Matrix} inputMatrix
       * @param {Matrix} previousResult
       * @param {Object} hiddenLayer
       * @returns {Matrix}
       */
  
    }, {
      key: 'getEquation',
      value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        return _lstm2.default.prototype.getEquation.call(this, equation, inputMatrix, previousResult, hiddenLayer);
      }
    }]);
  
    return LSTMTimeStep;
  }(_rnnTimeStep2.default);
  
  exports.default = LSTMTimeStep;
  
  },{"./lstm":9,"./matrix":16,"./rnn-time-step":34}],9:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _matrix = require('./matrix');
  
  var _matrix2 = _interopRequireDefault(_matrix);
  
  var _randomMatrix = require('./matrix/random-matrix');
  
  var _randomMatrix2 = _interopRequireDefault(_randomMatrix);
  
  var _rnn = require('./rnn');
  
  var _rnn2 = _interopRequireDefault(_rnn);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var LSTM = function (_RNN) {
    _inherits(LSTM, _RNN);
  
    function LSTM() {
      _classCallCheck(this, LSTM);
  
      return _possibleConstructorReturn(this, (LSTM.__proto__ || Object.getPrototypeOf(LSTM)).apply(this, arguments));
    }
  
    _createClass(LSTM, [{
      key: 'getModel',
      value: function getModel(hiddenSize, prevSize) {
        return {
          // gates parameters
          //wix
          inputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //wih
          inputHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bi
          inputBias: new _matrix2.default(hiddenSize, 1),
  
          //wfx
          forgetMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //wfh
          forgetHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bf
          forgetBias: new _matrix2.default(hiddenSize, 1),
  
          //wox
          outputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //woh
          outputHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bo
          outputBias: new _matrix2.default(hiddenSize, 1),
  
          // cell write params
          //wcx
          cellActivationMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //wch
          cellActivationHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bc
          cellActivationBias: new _matrix2.default(hiddenSize, 1)
        };
      }
  
      /**
       *
       * @param {Equation} equation
       * @param {Matrix} inputMatrix
       * @param {Matrix} previousResult
       * @param {Object} hiddenLayer
       * @returns {Matrix}
       */
  
    }, {
      key: 'getEquation',
      value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        var sigmoid = equation.sigmoid.bind(equation);
        var add = equation.add.bind(equation);
        var multiply = equation.multiply.bind(equation);
        var multiplyElement = equation.multiplyElement.bind(equation);
        var tanh = equation.tanh.bind(equation);
  
        var inputGate = sigmoid(add(add(multiply(hiddenLayer.inputMatrix, inputMatrix), multiply(hiddenLayer.inputHidden, previousResult)), hiddenLayer.inputBias));
  
        var forgetGate = sigmoid(add(add(multiply(hiddenLayer.forgetMatrix, inputMatrix), multiply(hiddenLayer.forgetHidden, previousResult)), hiddenLayer.forgetBias));
  
        // output gate
        var outputGate = sigmoid(add(add(multiply(hiddenLayer.outputMatrix, inputMatrix), multiply(hiddenLayer.outputHidden, previousResult)), hiddenLayer.outputBias));
  
        // write operation on cells
        var cellWrite = tanh(add(add(multiply(hiddenLayer.cellActivationMatrix, inputMatrix), multiply(hiddenLayer.cellActivationHidden, previousResult)), hiddenLayer.cellActivationBias));
  
        // compute new cell activation
        var retainCell = multiplyElement(forgetGate, previousResult); // what do we keep from cell
        var writeCell = multiplyElement(inputGate, cellWrite); // what do we write to cell
        var cell = add(retainCell, writeCell); // new cell contents
  
        // compute hidden state as gated, saturated cell activations
        return multiplyElement(outputGate, tanh(cell));
      }
    }]);
  
    return LSTM;
  }(_rnn2.default);
  
  exports.default = LSTM;
  
  },{"./matrix":16,"./matrix/random-matrix":23,"./rnn":35}],10:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = addB;
  /**
   * adds {from} deltas to {left} and {right} deltas
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Matrix} right
   */
  function addB(product, left, right) {
    for (var i = 0; i < product.deltas.length; i++) {
      left.deltas[i] = product.deltas[i];
      right.deltas[i] = product.deltas[i];
    }
  }
  
  },{}],11:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = add;
  /**
   * add {left} and {right} matrix weights into {into}
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Matrix} right
   */
  function add(product, left, right) {
    for (var i = 0; i < left.weights.length; i++) {
      product.weights[i] = left.weights[i] + right.weights[i];
      product.deltas[i] = 0;
    }
  }
  
  },{}],12:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = allOnes;
  /**
   * makes matrix weights and deltas all ones
   * @param {Matrix} product
   */
  function allOnes(product) {
    for (var i = 0; i < product.weights.length; i++) {
      product.weights[i] = 1;
      product.deltas[i] = 0;
    }
  }
  
  },{}],13:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = cloneNegative;
  /**
   *
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function cloneNegative(product, left) {
    product.rows = parseInt(left.rows);
    product.columns = parseInt(left.columns);
    product.weights = left.weights.slice(0);
    product.deltas = left.deltas.slice(0);
    for (var i = 0; i < left.weights.length; i++) {
      product.weights[i] = -left.weights[i];
      product.deltas[i] = 0;
    }
  }
  
  },{}],14:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = copy;
  /*
   *
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function copy(product, left) {
    product.rows = parseInt(left.rows);
    product.columns = parseInt(left.columns);
    product.weights = left.weights.slice(0);
    product.deltas = left.deltas.slice(0);
  }
  
  },{}],15:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _ = require('./');
  
  var _2 = _interopRequireDefault(_);
  
  var _onesMatrix = require('./ones-matrix');
  
  var _onesMatrix2 = _interopRequireDefault(_onesMatrix);
  
  var _copy = require('./copy');
  
  var _copy2 = _interopRequireDefault(_copy);
  
  var _cloneNegative2 = require('./clone-negative');
  
  var _cloneNegative3 = _interopRequireDefault(_cloneNegative2);
  
  var _add2 = require('./add');
  
  var _add3 = _interopRequireDefault(_add2);
  
  var _addB = require('./add-b');
  
  var _addB2 = _interopRequireDefault(_addB);
  
  var _allOnes2 = require('./all-ones');
  
  var _allOnes3 = _interopRequireDefault(_allOnes2);
  
  var _multiply2 = require('./multiply');
  
  var _multiply3 = _interopRequireDefault(_multiply2);
  
  var _multiplyB = require('./multiply-b');
  
  var _multiplyB2 = _interopRequireDefault(_multiplyB);
  
  var _multiplyElement2 = require('./multiply-element');
  
  var _multiplyElement3 = _interopRequireDefault(_multiplyElement2);
  
  var _multiplyElementB = require('./multiply-element-b');
  
  var _multiplyElementB2 = _interopRequireDefault(_multiplyElementB);
  
  var _relu2 = require('./relu');
  
  var _relu3 = _interopRequireDefault(_relu2);
  
  var _reluB = require('./relu-b');
  
  var _reluB2 = _interopRequireDefault(_reluB);
  
  var _rowPluck = require('./row-pluck');
  
  var _rowPluck2 = _interopRequireDefault(_rowPluck);
  
  var _rowPluckB = require('./row-pluck-b');
  
  var _rowPluckB2 = _interopRequireDefault(_rowPluckB);
  
  var _sigmoid2 = require('./sigmoid');
  
  var _sigmoid3 = _interopRequireDefault(_sigmoid2);
  
  var _sigmoidB = require('./sigmoid-b');
  
  var _sigmoidB2 = _interopRequireDefault(_sigmoidB);
  
  var _tanh2 = require('./tanh');
  
  var _tanh3 = _interopRequireDefault(_tanh2);
  
  var _tanhB = require('./tanh-b');
  
  var _tanhB2 = _interopRequireDefault(_tanhB);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var Equation = function () {
    function Equation() {
      _classCallCheck(this, Equation);
  
      this.inputRow = 0;
      this.inputValue = null;
      this.states = [];
    }
  
    /**
     * connects two matrices together by add
     * @param {Matrix} left
     * @param {Matrix} right
     * @returns {Matrix}
     */
  
  
    _createClass(Equation, [{
      key: 'add',
      value: function add(left, right) {
        if (left.weights.length !== right.weights.length) {
          throw new Error('misaligned matrices');
        }
        var product = new _2.default(left.rows, left.columns);
        this.states.push({
          left: left,
          right: right,
          product: product,
          forwardFn: _add3.default,
          backpropagationFn: _addB2.default
        });
        return product;
      }
  
      /**
       *
       * @param {Number} rows
       * @param {Number} columns
       * @returns {Matrix}
       */
  
    }, {
      key: 'allOnes',
      value: function allOnes(rows, columns) {
        var product = new _2.default(rows, columns);
        this.states.push({
          left: product,
          product: product,
          forwardFn: _allOnes3.default
        });
        return product;
      }
  
      /**
       *
       * @param {Matrix} m
       * @returns {Matrix}
       */
  
    }, {
      key: 'cloneNegative',
      value: function cloneNegative(m) {
        var product = new _2.default(m.rows, m.columns);
        this.states.push({
          left: m,
          product: product,
          forwardFn: _cloneNegative3.default
        });
        return product;
      }
  
      /**
       * connects two matrices together by subtract
       * @param {Matrix} left
       * @param {Matrix} right
       * @returns {Matrix}
       */
  
    }, {
      key: 'subtract',
      value: function subtract(left, right) {
        if (left.weights.length !== right.weights.length) {
          throw new Error('misaligned matrices');
        }
        return this.add(this.add(this.allOnes(left.rows, left.columns), this.cloneNegative(left)), right);
      }
  
      /**
       * connects two matrices together by multiply
       * @param {Matrix} left
       * @param {Matrix} right
       * @returns {Matrix}
       */
  
    }, {
      key: 'multiply',
      value: function multiply(left, right) {
        if (left.columns !== right.rows) {
          throw new Error('misaligned matrices');
        }
        var product = new _2.default(left.rows, right.columns);
        this.states.push({
          left: left,
          right: right,
          product: product,
          forwardFn: _multiply3.default,
          backpropagationFn: _multiplyB2.default
        });
        return product;
      }
  
      /**
       * connects two matrices together by multiplyElement
       * @param {Matrix} left
       * @param {Matrix} right
       * @returns {Matrix}
       */
  
    }, {
      key: 'multiplyElement',
      value: function multiplyElement(left, right) {
        if (left.weights.length !== right.weights.length) {
          throw new Error('misaligned matrices');
        }
        var product = new _2.default(left.rows, left.columns);
        this.states.push({
          left: left,
          right: right,
          product: product,
          forwardFn: _multiplyElement3.default,
          backpropagationFn: _multiplyElementB2.default
        });
        return product;
      }
  
      /**
       * connects a matrix to relu
       * @param {Matrix} m
       * @returns {Matrix}
       */
  
    }, {
      key: 'relu',
      value: function relu(m) {
        var product = new _2.default(m.rows, m.columns);
        this.states.push({
          left: m,
          product: product,
          forwardFn: _relu3.default,
          backpropagationFn: _reluB2.default
        });
        return product;
      }
  
      /**
       * copy a matrix
       * @param {Matrix} input
       * @returns {Matrix}
       */
  
    }, {
      key: 'input',
      value: function input(_input) {
        var self = this;
        this.states.push({
          product: _input,
          forwardFn: function forwardFn() {
            _input.weights = self.inputValue;
          }
        });
        return _input;
      }
  
      /**
       * connects a matrix via a row
       * @param {Matrix} m
       * @returns {Matrix}
       */
  
    }, {
      key: 'inputMatrixToRow',
      value: function inputMatrixToRow(m) {
        var self = this;
        var product = new _2.default(m.columns, 1);
        this.states.push({
          left: m,
          get right() {
            return self.inputRow;
          },
          product: product,
          forwardFn: _rowPluck2.default,
          backpropagationFn: _rowPluckB2.default
        });
        return product;
      }
  
      /**
       * connects a matrix to sigmoid
       * @param {Matrix} m
       * @returns {Matrix}
       */
  
    }, {
      key: 'sigmoid',
      value: function sigmoid(m) {
        var product = new _2.default(m.rows, m.columns);
        this.states.push({
          left: m,
          product: product,
          forwardFn: _sigmoid3.default,
          backpropagationFn: _sigmoidB2.default
        });
        return product;
      }
  
      /**
       * connects a matrix to tanh
       * @param {Matrix} m
       * @returns {Matrix}
       */
  
    }, {
      key: 'tanh',
      value: function tanh(m) {
        var product = new _2.default(m.rows, m.columns);
        this.states.push({
          left: m,
          product: product,
          forwardFn: _tanh3.default,
          backpropagationFn: _tanhB2.default
        });
        return product;
      }
  
      /**
       *
       * @param m
       * @returns {Matrix}
       */
  
    }, {
      key: 'observe',
      value: function observe(m) {
        var iForward = 0;
        var iBackpropagate = 0;
        this.states.push({
          forwardFn: function forwardFn() {
            iForward++;
          },
          backpropagationFn: function backpropagationFn() {
            iBackpropagate++;
          }
        });
        return m;
      }
  
      /**
       * @patam {Number} [rowIndex]
       * @output {Matrix}
       */
  
    }, {
      key: 'run',
      value: function run() {
        var rowIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  
        this.inputRow = rowIndex;
        var state = void 0;
        for (var i = 0, max = this.states.length; i < max; i++) {
          state = this.states[i];
          if (!state.hasOwnProperty('forwardFn')) {
            continue;
          }
          state.forwardFn(state.product, state.left, state.right);
        }
  
        return state.product;
      }
  
      /**
       * @patam {Number} [rowIndex]
       * @output {Matrix}
       */
  
    }, {
      key: 'runInput',
      value: function runInput(inputValue) {
        this.inputValue = inputValue;
        var state = void 0;
        for (var i = 0, max = this.states.length; i < max; i++) {
          state = this.states[i];
          if (!state.hasOwnProperty('forwardFn')) {
            continue;
          }
          state.forwardFn(state.product, state.left, state.right);
        }
  
        return state.product;
      }
  
      /**
       * @patam {Number} [rowIndex]
       * @output {Matrix}
       */
  
    }, {
      key: 'runBackpropagate',
      value: function runBackpropagate() {
        var rowIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  
        this.inputRow = rowIndex;
  
        var i = this.states.length;
        var state = void 0;
        while (i-- > 0) {
          state = this.states[i];
          if (!state.hasOwnProperty('backpropagationFn')) {
            continue;
          }
          state.backpropagationFn(state.product, state.left, state.right);
        }
  
        return state.product;
      }
    }]);
  
    return Equation;
  }();
  
  exports.default = Equation;
  
  },{"./":16,"./add":11,"./add-b":10,"./all-ones":12,"./clone-negative":13,"./copy":14,"./multiply":21,"./multiply-b":18,"./multiply-element":20,"./multiply-element-b":19,"./ones-matrix":22,"./relu":25,"./relu-b":24,"./row-pluck":27,"./row-pluck-b":26,"./sigmoid":30,"./sigmoid-b":29,"./tanh":33,"./tanh-b":32}],16:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _zeros = require('../../utilities/zeros');
  
  var _zeros2 = _interopRequireDefault(_zeros);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  /**
   * A matrix
   * @param {Number} [rows]
   * @param {Number} [columns]
   * @constructor
   */
  var Matrix = function () {
    function Matrix(rows, columns) {
      _classCallCheck(this, Matrix);
  
      if (rows === undefined) return;
      if (columns === undefined) return;
  
      this.rows = rows;
      this.columns = columns;
      this.weights = (0, _zeros2.default)(rows * columns);
      this.deltas = (0, _zeros2.default)(rows * columns);
    }
  
    /**
     *
     * @param {Number} row
     * @param {Number} col
     * @returns {Float32Array|Array}
     */
  
  
    _createClass(Matrix, [{
      key: 'getWeights',
      value: function getWeights(row, col) {
        // slow but careful accessor function
        // we want row-major order
        var ix = this.columns * row + col;
        if (ix < 0 && ix >= this.weights.length) throw new Error('get accessor is skewed');
        return this.weights[ix];
      }
  
      /**
       *
       * @param {Number} row
       * @param {Number} col
       * @param v
       * @returns {Matrix}
       */
  
    }, {
      key: 'setWeight',
      value: function setWeight(row, col, v) {
        // slow but careful accessor function
        var ix = this.columns * row + col;
        if (ix < 0 && ix >= this.weights.length) throw new Error('set accessor is skewed');
        this.weights[ix] = v;
      }
  
      /**
       *
       * @param {Number} row
       * @param {Number} col
       * @param v
       * @returns {Matrix}
       */
  
    }, {
      key: 'setDeltas',
      value: function setDeltas(row, col, v) {
        // slow but careful accessor function
        var ix = this.columns * row + col;
        if (ix < 0 && ix >= this.weights.length) throw new Error('set accessor is skewed');
        this.deltas[ix] = v;
      }
  
      /**
       *
       * @returns {{rows: *, columns: *, weights: Array}}
       */
  
    }, {
      key: 'toJSON',
      value: function toJSON() {
        return {
          rows: this.rows,
          columns: this.columns,
          weights: this.weights.slice(0)
        };
      }
    }, {
      key: 'weightsToArray',
      value: function weightsToArray() {
        var deltas = [];
        var row = 0;
        var column = 0;
        for (var i = 0; i < this.weights.length; i++) {
          if (column === 0) {
            deltas.push([]);
          }
          deltas[row].push(this.weights[i]);
          column++;
          if (column >= this.columns) {
            column = 0;
            row++;
          }
        }
        return deltas;
      }
    }, {
      key: 'deltasToArray',
      value: function deltasToArray() {
        var deltas = [];
        var row = 0;
        var column = 0;
        for (var i = 0; i < this.deltas.length; i++) {
          if (column === 0) {
            deltas.push([]);
          }
          deltas[row].push(this.deltas[i]);
          column++;
          if (column >= this.columns) {
            column = 0;
            row++;
          }
        }
        return deltas;
      }
    }], [{
      key: 'fromJSON',
      value: function fromJSON(json) {
        var matrix = new Matrix(json.rows, json.columns);
        for (var i = 0, max = json.rows * json.columns; i < max; i++) {
          matrix.weights[i] = json.weights[i]; // copy over weights
        }
        return matrix;
      }
  
      /**
       *
       * @param weightRows
       * @param [deltasRows]
       * @returns {Matrix}
       */
  
    }, {
      key: 'fromArray',
      value: function fromArray(weightRows, deltasRows) {
        var rows = weightRows.length;
        var columns = weightRows[0].length;
        var m = new Matrix(rows, columns);
  
        deltasRows = deltasRows || weightRows;
  
        for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
          var weightValues = weightRows[rowIndex];
          var deltasValues = deltasRows[rowIndex];
          for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
            m.setWeight(rowIndex, columnIndex, weightValues[columnIndex]);
            m.setDeltas(rowIndex, columnIndex, deltasValues[columnIndex]);
          }
        }
  
        return m;
      }
    }]);
  
    return Matrix;
  }();
  
  exports.default = Matrix;
  
  },{"../../utilities/zeros":46}],17:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = maxI;
  /**
   *
   * @param {Matrix} m
   * @returns {number}
   */
  function maxI(m) {
    // argmax of array w
    var weights = m.weights;
  
    var maxv = weights[0];
    var maxix = 0;
    for (var i = 1; i < weights.length; i++) {
      var v = weights[i];
      if (v < maxv) continue;
  
      maxix = i;
      maxv = v;
    }
    return maxix;
  };
  
  },{}],18:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = multiplyB;
  /**
   * multiplies {from} deltas to {left} and {right}
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Matrix} right
   */
  function multiplyB(product, left, right) {
    var leftRows = left.rows;
    var leftColumns = left.columns;
    var rightColumns = right.columns;
  
    // loop over rows of left
    for (var leftRow = 0; leftRow < leftRows; leftRow++) {
      var leftRowBase = leftColumns * leftRow;
      var rightRowBase = rightColumns * leftRow;
      // loop over cols of right
      for (var rightColumn = 0; rightColumn < rightColumns; rightColumn++) {
  
        //loop over columns of left
        for (var leftColumn = 0; leftColumn < leftColumns; leftColumn++) {
          var rightColumnBase = rightColumns * leftColumn;
          var _leftRow = leftRowBase + leftColumn;
          var rightRow = rightColumnBase + rightColumn;
          var backPropagateValue = product.deltas[rightRowBase + rightColumn];
          left.deltas[_leftRow] += right.weights[rightRow] * backPropagateValue;
          right.deltas[rightRow] += left.weights[_leftRow] * backPropagateValue;
        }
      }
    }
  }
  
  },{}],19:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = multiplyElementB;
  /**
   * multiplies {left} and {right} weight by {from} deltas into {left} and {right} deltas
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Matrix} right
   */
  function multiplyElementB(product, left, right) {
    for (var i = 0; i < left.weights.length; i++) {
      left.deltas[i] = right.weights[i] * product.deltas[i];
      right.deltas[i] = left.weights[i] * product.deltas[i];
    }
  }
  
  },{}],20:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = multiplyElement;
  /**
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Matrix} right
   */
  function multiplyElement(product, left, right) {
    var weights = left.weights;
  
    for (var i = 0; i < weights.length; i++) {
      product.weights[i] = left.weights[i] * right.weights[i];
      product.deltas[i] = 0;
    }
  }
  
  },{}],21:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = multiply;
  /**
   * multiply {left} and {right} matrix weights to {into}
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Matrix} right
   */
  function multiply(product, left, right) {
    var leftRows = left.rows;
    var leftColumns = left.columns;
    var rightColumns = right.columns;
  
    // loop over rows of left
    for (var leftRow = 0; leftRow < leftRows; leftRow++) {
      var leftRowBase = leftColumns * leftRow;
      var rightRowBase = rightColumns * leftRow;
      // loop over cols of right
      for (var rightColumn = 0; rightColumn < rightColumns; rightColumn++) {
  
        // dot product loop
        var dot = 0;
        //loop over columns of left
        for (var leftColumn = 0; leftColumn < leftColumns; leftColumn++) {
          var rightColumnBase = rightColumns * leftColumn;
          var leftIndex = leftRowBase + leftColumn;
          var rightIndex = rightColumnBase + rightColumn;
          dot += left.weights[leftIndex] * right.weights[rightIndex];
          left.deltas[leftIndex] = 0;
          right.deltas[rightIndex] = 0;
        }
        product.weights[rightRowBase + rightColumn] = dot;
      }
    }
  }
  
  },{}],22:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _ = require('./');
  
  var _2 = _interopRequireDefault(_);
  
  var _ones = require('../../utilities/ones');
  
  var _ones2 = _interopRequireDefault(_ones);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  /** return Matrix but filled with random numbers from gaussian
   * @param {Number} [rows]
   * @param {Number} [columns]
   * @constructor
   */
  var OnesMatrix = function (_Matrix) {
    _inherits(OnesMatrix, _Matrix);
  
    function OnesMatrix(rows, columns) {
      _classCallCheck(this, OnesMatrix);
  
      var _this = _possibleConstructorReturn(this, (OnesMatrix.__proto__ || Object.getPrototypeOf(OnesMatrix)).call(this, rows, columns));
  
      _this.rows = rows;
      _this.columns = columns;
      _this.weights = (0, _ones2.default)(rows * columns);
      _this.deltas = (0, _ones2.default)(rows * columns);
      return _this;
    }
  
    return OnesMatrix;
  }(_2.default);
  
  exports.default = OnesMatrix;
  
  },{"../../utilities/ones":40,"./":16}],23:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _ = require('./');
  
  var _2 = _interopRequireDefault(_);
  
  var _random = require('../../utilities/random');
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  /** return Matrix but filled with random numbers from gaussian
   * @param {Number} [rows]
   * @param {Number} [columns]
   * @param std
   * @constructor
   */
  var RandomMatrix = function (_Matrix) {
    _inherits(RandomMatrix, _Matrix);
  
    function RandomMatrix(rows, columns, std) {
      _classCallCheck(this, RandomMatrix);
  
      var _this = _possibleConstructorReturn(this, (RandomMatrix.__proto__ || Object.getPrototypeOf(RandomMatrix)).call(this, rows, columns));
  
      _this.rows = rows;
      _this.columns = columns;
      _this.std = std;
      for (var i = 0, max = _this.weights.length; i < max; i++) {
        _this.weights[i] = (0, _random.randomF)(-std, std);
      }
      return _this;
    }
  
    return RandomMatrix;
  }(_2.default);
  
  exports.default = RandomMatrix;
  
  },{"../../utilities/random":42,"./":16}],24:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = reluB;
  /**
   * adds {from} deltas to {m} deltas when {m} weights are above other a threshold of 0
   * @param {Matrix} product
   * @param {Matrix} m
   */
  function reluB(product, left) {
    for (var i = 0; i < product.deltas.length; i++) {
      left.deltas[i] = left.weights[i] > 0 ? product.deltas[i] : 0;
    }
  }
  
  },{}],25:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = relu;
  /**
   *
   * relu {m} weights to {into} weights
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function relu(product, left) {
    for (var i = 0; i < left.weights.length; i++) {
      product.weights[i] = Math.max(0, left.weights[i]); // relu
      product.deltas[i] = 0;
    }
  }
  
  },{}],26:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = rowPluckB;
  /**
   * adds {from} deltas into {m} deltas
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Number} rowIndex
   */
  function rowPluckB(product, left, rowIndex) {
    var columns = left.columns;
    var rowBase = columns * rowIndex;
    for (var column = 0; column < columns; column++) {
      left.deltas[rowBase + column] = product.deltas[column];
    }
  }
  
  },{}],27:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = rowPluck;
  /**
   * @param {Matrix} product
   * @param {Matrix} left
   * @param {Number} rowPluckIndex
   */
  function rowPluck(product, left, rowPluckIndex) {
    var columns = left.columns;
    var rowBase = columns * rowPluckIndex;
    for (var column = 0; column < columns; column++) {
      product.weights[column] = left.weights[rowBase + column];
      product.deltas[column] = 0;
    }
  }
  
  },{}],28:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = sampleI;
  
  var _random = require('../../utilities/random');
  
  //prevent parser from renaming when calling toString() method later
  var randomF = _random.randomF;
  /**
   *
   * @param {Matrix} m
   * @returns {number}
   */
  function sampleI(m) {
    // sample argmax from w, assuming w are
    // probabilities that sum to one
    var r = randomF(0, 1);
    var x = 0;
    var i = 0;
    var w = m.weights;
  
    while (true) {
      x += w[i];
      if (x > r) {
        return i;
      }
      i++;
    }
  }
  
  },{"../../utilities/random":42}],29:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = sigmoidB;
  /**
   *
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function sigmoidB(product, left) {
    for (var i = 0; i < product.deltas.length; i++) {
      var mwi = product.weights[i];
      left.deltas[i] = mwi * (1 - mwi) * product.deltas[i];
    }
  }
  
  },{}],30:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = sigmoid;
  /**
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function sigmoid(product, left) {
    // sigmoid nonlinearity
    for (var i = 0; i < left.weights.length; i++) {
      product.weights[i] = 1 / (1 + Math.exp(-left.weights[i]));
      product.deltas[i] = 0;
    }
  }
  
  function sig(x) {
    // helper function for computing sigmoid
    return 1 / (1 + Math.exp(-x));
  }
  
  },{}],31:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = softmax;
  
  var _ = require('./');
  
  var _2 = _interopRequireDefault(_);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  /**
   *
   * @param {Matrix} m
   * @returns {Matrix}
   */
  function softmax(m) {
    var result = new _2.default(m.rows, m.columns); // probability volume
    var maxVal = -999999;
    for (var i = 0; i < m.weights.length; i++) {
      if (m.weights[i] > maxVal) {
        maxVal = m.weights[i];
      }
    }
  
    var s = 0;
    for (var _i = 0; _i < m.weights.length; _i++) {
      result.weights[_i] = Math.exp(m.weights[_i] - maxVal);
      s += result.weights[_i];
    }
  
    for (var _i2 = 0; _i2 < m.weights.length; _i2++) {
      result.weights[_i2] /= s;
    }
  
    // no backward pass here needed
    // since we will use the computed probabilities outside
    // to set gradients directly on m
    return result;
  }
  
  },{"./":16}],32:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = tanhB;
  /**
   *
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function tanhB(product, left) {
    for (var i = 0; i < product.deltas.length; i++) {
      // grad for z = tanh(x) is (1 - z^2)
      var mwi = product.weights[i];
      left.deltas[i] = (1 - mwi * mwi) * product.deltas[i];
    }
  }
  
  },{}],33:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = tanh;
  /**
   * @param {Matrix} product
   * @param {Matrix} left
   */
  function tanh(product, left) {
    // tanh nonlinearity
    for (var i = 0; i < left.weights.length; i++) {
      product.weights[i] = Math.tanh(left.weights[i]);
      product.deltas[i] = 0;
    }
  }
  
  },{}],34:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _matrix = require('./matrix');
  
  var _matrix2 = _interopRequireDefault(_matrix);
  
  var _randomMatrix = require('./matrix/random-matrix');
  
  var _randomMatrix2 = _interopRequireDefault(_randomMatrix);
  
  var _equation = require('./matrix/equation');
  
  var _equation2 = _interopRequireDefault(_equation);
  
  var _rnn = require('./rnn');
  
  var _rnn2 = _interopRequireDefault(_rnn);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var RNNTimeStep = function (_RNN) {
    _inherits(RNNTimeStep, _RNN);
  
    function RNNTimeStep(options) {
      _classCallCheck(this, RNNTimeStep);
  
      return _possibleConstructorReturn(this, (RNNTimeStep.__proto__ || Object.getPrototypeOf(RNNTimeStep)).call(this, options));
    }
  
    _createClass(RNNTimeStep, [{
      key: 'createInputMatrix',
      value: function createInputMatrix() {
        this.model.input = new _randomMatrix2.default(this.inputSize, 1, 0.08);
      }
    }, {
      key: 'createOutputMatrix',
      value: function createOutputMatrix() {
        var model = this.model;
        var outputSize = this.outputSize;
        var lastHiddenSize = this.hiddenSizes[this.hiddenSizes.length - 1];
  
        //whd
        model.outputConnector = new _randomMatrix2.default(outputSize, lastHiddenSize, 0.08);
        //bd
        model.output = new _matrix2.default(outputSize, 1);
      }
    }, {
      key: 'bindEquation',
      value: function bindEquation() {
        var model = this.model;
        var hiddenSizes = this.hiddenSizes;
        var hiddenLayers = model.hiddenLayers;
        var equation = new _equation2.default();
        var outputs = [];
        var equationConnection = model.equationConnections.length > 0 ? model.equationConnections[model.equationConnections.length - 1] : this.initialLayerInputs;
  
        // 0 index
        var output = this.getEquation(equation, equation.input(model.input), equationConnection[0], hiddenLayers[0]);
        outputs.push(output);
        // 1+ indices
        for (var i = 1, max = hiddenSizes.length; i < max; i++) {
          output = this.getEquation(equation, output, equationConnection[i], hiddenLayers[i]);
          outputs.push(output);
        }
  
        model.equationConnections.push(outputs);
        equation.add(equation.multiply(model.outputConnector, output), model.output);
        model.equations.push(equation);
      }
  
      /**
       *
       * @param {Number[]} input
       * @returns {number}
       */
  
    }, {
      key: 'runInput',
      value: function runInput(input) {
        this.runs++;
        var model = this.model;
        var errorSum = 0;
        var equation = void 0;
        while (model.equations.length < input.length - 1) {
          this.bindEquation();
        }
        var outputs = [];
  
        if (this.inputSize === 1) {
          for (var inputIndex = 0, max = input.length - 1; inputIndex < max; inputIndex++) {
            // start and end tokens are zeros
            equation = model.equations[inputIndex];
  
            var current = input[inputIndex];
            var next = input[inputIndex + 1];
            var output = equation.runInput([current]);
            for (var i = 0; i < output.weights.length; i++) {
              var error = output.weights[i] - next;
              // set gradients into log probabilities
              errorSum += Math.abs(error);
  
              // write gradients into log probabilities
              output.deltas[i] = error;
              outputs.push(output.weights);
            }
          }
        } else {
          for (var _inputIndex = 0, _max = input.length - 1; _inputIndex < _max; _inputIndex++) {
            // start and end tokens are zeros
            equation = model.equations[_inputIndex];
  
            var _current = input[_inputIndex];
            var _next = input[_inputIndex + 1];
            var _output = equation.runInput(_current);
            for (var _i = 0; _i < _output.weights.length; _i++) {
              var _error = _output.weights[_i] - _next[_i];
              // set gradients into log probabilities
              errorSum += Math.abs(_error);
  
              // write gradients into log probabilities
              _output.deltas[_i] = _error;
              outputs.push(_output.weights);
            }
          }
        }
        //this.model.equations.length - 1;
        this.totalCost = errorSum;
        return errorSum;
      }
    }, {
      key: 'runBackpropagate',
      value: function runBackpropagate() {
        for (var i = this.model.equations.length - 1; i > -1; i--) {
          this.model.equations[i].runBackpropagate();
        }
      }
  
      /**
       *
       * @param {Number[]|Number} [input]
       * @param {Number} [maxPredictionLength]
       * @param {Boolean} [isSampleI]
       * @param {Number} temperature
       * @returns {Number[]|Number}
       */
  
    }, {
      key: 'run',
      value: function run() {
        var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var maxPredictionLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var isSampleI = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var temperature = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  
        if (!this.isRunnable) return null;
        var model = this.model;
        while (model.equations.length < maxPredictionLength) {
          this.bindEquation();
        }
        var lastOutput = void 0;
        if (this.inputSize === 1) {
          for (var i = 0; i < input.length; i++) {
            var outputMatrix = model.equations[i].runInput([input[i]]);
            lastOutput = outputMatrix.weights;
          }
        } else {
          for (var _i2 = 0; _i2 < input.length; _i2++) {
            var _outputMatrix = model.equations[_i2].runInput(input[_i2]);
            lastOutput = _outputMatrix.weights;
          }
        }
        if (this.outputSize === 1) {
          return lastOutput[0];
        }
        return lastOutput;
      }
  
      /**
       *
       * @returns {Function}
       */
  
    }, {
      key: 'toFunction',
      value: function toFunction() {
        throw new Error('not implemented');
      }
    }]);
  
    return RNNTimeStep;
  }(_rnn2.default);
  
  exports.default = RNNTimeStep;
  
  
  RNNTimeStep.defaults = {
    inputSize: 1,
    hiddenSizes: [20],
    outputSize: 1,
    learningRate: 0.01,
    decayRate: 0.999,
    smoothEps: 1e-8,
    regc: 0.000001,
    clipval: 5,
    json: null,
    dataFormatter: null
  };
  
  RNNTimeStep.trainDefaults = _rnn2.default.trainDefaults;
  
  },{"./matrix":16,"./matrix/equation":15,"./matrix/random-matrix":23,"./rnn":35}],35:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _matrix = require('./matrix');
  
  var _matrix2 = _interopRequireDefault(_matrix);
  
  var _randomMatrix = require('./matrix/random-matrix');
  
  var _randomMatrix2 = _interopRequireDefault(_randomMatrix);
  
  var _equation = require('./matrix/equation');
  
  var _equation2 = _interopRequireDefault(_equation);
  
  var _sampleI = require('./matrix/sample-i');
  
  var _sampleI2 = _interopRequireDefault(_sampleI);
  
  var _maxI = require('./matrix/max-i');
  
  var _maxI2 = _interopRequireDefault(_maxI);
  
  var _softmax = require('./matrix/softmax');
  
  var _softmax2 = _interopRequireDefault(_softmax);
  
  var _copy = require('./matrix/copy');
  
  var _copy2 = _interopRequireDefault(_copy);
  
  var _random = require('../utilities/random');
  
  var _zeros = require('../utilities/zeros');
  
  var _zeros2 = _interopRequireDefault(_zeros);
  
  var _dataFormatter = require('../utilities/data-formatter');
  
  var _dataFormatter2 = _interopRequireDefault(_dataFormatter);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var RNN = function () {
    function RNN() {
      var _this = this;
  
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
      _classCallCheck(this, RNN);
  
      var defaults = this.constructor.defaults;
  
      Object.assign(this, defaults, options);
  
      this.stepCache = {};
      this.runs = 0;
      this.totalCost = null;
      this.ratioClipped = null;
      this.model = null;
  
      this.initialLayerInputs = this.hiddenSizes.map(function (size) {
        return new _matrix2.default(_this.hiddenSizes[0], 1);
      });
      this.inputLookup = null;
      this.outputLookup = null;
      this.initialize();
    }
  
    _createClass(RNN, [{
      key: 'initialize',
      value: function initialize() {
        this.model = {
          input: null,
          hiddenLayers: [],
          output: null,
          equations: [],
          allMatrices: [],
          equationConnections: []
        };
  
        if (this.dataFormatter !== null) {
          this.inputSize = this.inputRange = this.outputSize = this.dataFormatter.characters.length;
        }
  
        if (this.json) {
          this.fromJSON(this.json);
        } else {
          this.mapModel();
        }
      }
    }, {
      key: 'createHiddenLayers',
      value: function createHiddenLayers() {
        var hiddenSizes = this.hiddenSizes;
        var model = this.model;
        var hiddenLayers = model.hiddenLayers;
        //0 is end, so add 1 to offset
        hiddenLayers.push(this.getModel(hiddenSizes[0], this.inputSize));
        var prevSize = hiddenSizes[0];
  
        for (var d = 1; d < hiddenSizes.length; d++) {
          // loop over depths
          var hiddenSize = hiddenSizes[d];
          hiddenLayers.push(this.getModel(hiddenSize, prevSize));
          prevSize = hiddenSize;
        }
      }
  
      /**
       *
       * @param {Number} hiddenSize
       * @param {Number} prevSize
       * @returns {object}
       */
  
    }, {
      key: 'getModel',
      value: function getModel(hiddenSize, prevSize) {
        return {
          //wxh
          weight: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
          //whh
          transition: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
          //bhh
          bias: new _matrix2.default(hiddenSize, 1)
        };
      }
  
      /**
       *
       * @param {Equation} equation
       * @param {Matrix} inputMatrix
       * @param {Matrix} previousResult
       * @param {Object} hiddenLayer
       * @returns {Matrix}
       */
  
    }, {
      key: 'getEquation',
      value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
        var relu = equation.relu.bind(equation);
        var add = equation.add.bind(equation);
        var multiply = equation.multiply.bind(equation);
  
        return relu(add(add(multiply(hiddenLayer.weight, inputMatrix), multiply(hiddenLayer.transition, previousResult)), hiddenLayer.bias));
      }
    }, {
      key: 'createInputMatrix',
      value: function createInputMatrix() {
        //0 is end, so add 1 to offset
        this.model.input = new _randomMatrix2.default(this.inputRange + 1, this.inputSize, 0.08);
      }
    }, {
      key: 'createOutputMatrix',
      value: function createOutputMatrix() {
        var model = this.model;
        var outputSize = this.outputSize;
        var lastHiddenSize = this.hiddenSizes[this.hiddenSizes.length - 1];
  
        //0 is end, so add 1 to offset
        //whd
        model.outputConnector = new _randomMatrix2.default(outputSize + 1, lastHiddenSize, 0.08);
        //0 is end, so add 1 to offset
        //bd
        model.output = new _matrix2.default(outputSize + 1, 1);
      }
    }, {
      key: 'bindEquation',
      value: function bindEquation() {
        var model = this.model;
        var hiddenSizes = this.hiddenSizes;
        var hiddenLayers = model.hiddenLayers;
        var equation = new _equation2.default();
        var outputs = [];
        var equationConnection = model.equationConnections.length > 0 ? model.equationConnections[model.equationConnections.length - 1] : this.initialLayerInputs;
  
        // 0 index
        var output = this.getEquation(equation, equation.inputMatrixToRow(model.input), equationConnection[0], hiddenLayers[0]);
        outputs.push(output);
        // 1+ indices
        for (var i = 1, max = hiddenSizes.length; i < max; i++) {
          output = this.getEquation(equation, output, equationConnection[i], hiddenLayers[i]);
          outputs.push(output);
        }
  
        model.equationConnections.push(outputs);
        equation.add(equation.multiply(model.outputConnector, output), model.output);
        model.equations.push(equation);
      }
    }, {
      key: 'mapModel',
      value: function mapModel() {
        var model = this.model;
        var hiddenLayers = model.hiddenLayers;
        var allMatrices = model.allMatrices;
  
        this.createInputMatrix();
        if (!model.input) throw new Error('net.model.input not set');
        allMatrices.push(model.input);
  
        this.createHiddenLayers();
        if (!model.hiddenLayers.length) throw new Error('net.hiddenLayers not set');
        for (var i = 0, max = hiddenLayers.length; i < max; i++) {
          var hiddenMatrix = hiddenLayers[i];
          for (var property in hiddenMatrix) {
            if (!hiddenMatrix.hasOwnProperty(property)) continue;
            allMatrices.push(hiddenMatrix[property]);
          }
        }
  
        this.createOutputMatrix();
        if (!model.outputConnector) throw new Error('net.model.outputConnector not set');
        if (!model.output) throw new Error('net.model.output not set');
  
        allMatrices.push(model.outputConnector);
        allMatrices.push(model.output);
      }
  
      /**
       *
       * @param {Number[]} input
       * @param {Number} [learningRate]
       * @returns {number}
       */
  
    }, {
      key: 'trainPattern',
      value: function trainPattern(input) {
        var learningRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  
        var error = this.runInput(input);
        this.runBackpropagate(input);
        this.step(learningRate);
        return error;
      }
  
      /**
       *
       * @param {Number[]} input
       * @returns {number}
       */
  
    }, {
      key: 'runInput',
      value: function runInput(input) {
        this.runs++;
        var model = this.model;
        var max = input.length;
        var log2ppl = 0;
        var cost = 0;
        var equation = void 0;
        while (model.equations.length <= input.length + 1) {
          //last is zero
          this.bindEquation();
        }
        for (var inputIndex = -1, inputMax = input.length; inputIndex < inputMax; inputIndex++) {
          // start and end tokens are zeros
          var equationIndex = inputIndex + 1;
          equation = model.equations[equationIndex];
  
          var source = inputIndex === -1 ? 0 : input[inputIndex] + 1; // first step: start with START token
          var target = inputIndex === max - 1 ? 0 : input[inputIndex + 1] + 1; // last step: end with END token
          var output = equation.run(source);
          // set gradients into log probabilities
          var logProbabilities = output; // interpret output as log probabilities
          var probabilities = (0, _softmax2.default)(output); // compute the softmax probabilities
  
          log2ppl += -Math.log2(probabilities.weights[target]); // accumulate base 2 log prob and do smoothing
          cost += -Math.log(probabilities.weights[target]);
          // write gradients into log probabilities
          logProbabilities.deltas = probabilities.weights.slice(0);
          logProbabilities.deltas[target] -= 1;
        }
  
        this.totalCost = cost;
        return Math.pow(2, log2ppl / (max - 1));
      }
  
      /**
       * @param {Number[]} input
       */
  
    }, {
      key: 'runBackpropagate',
      value: function runBackpropagate(input) {
        var i = input.length;
        var model = this.model;
        var equations = model.equations;
        while (i > 0) {
          equations[i].runBackpropagate(input[i - 1] + 1);
          i--;
        }
        equations[0].runBackpropagate(0);
      }
  
      /**
       *
       * @param {Number} [learningRate]
       */
  
    }, {
      key: 'step',
      value: function step() {
        var learningRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  
        // perform parameter update
        //TODO: still not sure if this is ready for learningRate
        var stepSize = this.learningRate;
        var regc = this.regc;
        var clipval = this.clipval;
        var model = this.model;
        var numClipped = 0;
        var numTot = 0;
        var allMatrices = model.allMatrices;
        for (var matrixIndex = 0; matrixIndex < allMatrices.length; matrixIndex++) {
          var matrix = allMatrices[matrixIndex];
          var weights = matrix.weights,
              deltas = matrix.deltas;
  
          if (!(matrixIndex in this.stepCache)) {
            this.stepCache[matrixIndex] = (0, _zeros2.default)(matrix.rows * matrix.columns);
          }
          var cache = this.stepCache[matrixIndex];
          for (var i = 0; i < weights.length; i++) {
            var r = deltas[i];
            var w = weights[i];
            // rmsprop adaptive learning rate
            cache[i] = cache[i] * this.decayRate + (1 - this.decayRate) * r * r;
            // gradient clip
            if (r > clipval) {
              r = clipval;
              numClipped++;
            }
            if (r < -clipval) {
              r = -clipval;
              numClipped++;
            }
            numTot++;
            // update (and regularize)
            weights[i] = w + -stepSize * r / Math.sqrt(cache[i] + this.smoothEps) - regc * w;
          }
        }
        this.ratioClipped = numClipped / numTot;
      }
  
      /**
       *
       * @returns boolean
       */
  
    }, {
      key: 'run',
  
  
      /**
       *
       * @param {Number[]|*} [rawInput]
       * @param {Number} [maxPredictionLength]
       * @param {Boolean} [isSampleI]
       * @param {Number} temperature
       * @returns {*}
       */
      value: function run() {
        var rawInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var maxPredictionLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
        var isSampleI = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var temperature = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  
        if (!this.isRunnable) return null;
        var input = this.formatDataIn(rawInput);
        var model = this.model;
        var output = [];
        var i = 0;
        while (model.equations.length < maxPredictionLength) {
          this.bindEquation();
        }
        while (true) {
          var previousIndex = i === 0 ? 0 : i < input.length ? input[i - 1] + 1 : output[i - 1];
          var equation = model.equations[i];
          // sample predicted letter
          var outputMatrix = equation.run(previousIndex);
          var logProbabilities = new _matrix2.default(model.output.rows, model.output.columns);
          (0, _copy2.default)(logProbabilities, outputMatrix);
          if (temperature !== 1 && isSampleI) {
            /**
             * scale log probabilities by temperature and re-normalize
             * if temperature is high, logProbabilities will go towards zero
             * and the softmax outputs will be more diffuse. if temperature is
             * very low, the softmax outputs will be more peaky
             */
            for (var j = 0, max = logProbabilities.weights.length; j < max; j++) {
              logProbabilities.weights[j] /= temperature;
            }
          }
  
          var probs = (0, _softmax2.default)(logProbabilities);
          var nextIndex = isSampleI ? (0, _sampleI2.default)(probs) : (0, _maxI2.default)(probs);
  
          i++;
          if (nextIndex === 0) {
            // END token predicted, break out
            break;
          }
          if (i >= maxPredictionLength) {
            // something is wrong
            break;
          }
  
          output.push(nextIndex);
        }
  
        /**
         * we slice the input length here, not because output contains it, but it will be erroneous as we are sending the
         * network what is contained in input, so the data is essentially guessed by the network what could be next, till it
         * locks in on a value.
         * Kind of like this, values are from input:
         * 0 -> 4 (or in English: "beginning on input" -> "I have no idea? I'll guess what they want next!")
         * 2 -> 2 (oh how interesting, I've narrowed down values...)
         * 1 -> 9 (oh how interesting, I've now know what the values are...)
         * then the output looks like: [4, 2, 9,...]
         * so we then remove the erroneous data to get our true output
         */
        return this.formatDataOut(input, output.slice(input.length).map(function (value) {
          return value - 1;
        }));
      }
  
      /**
       *
       * @param {Object[]|String[]} data an array of objects: `{input: 'string', output: 'string'}` or an array of strings
       * @param {Object} [options]
       * @returns {{error: number, iterations: number}}
       */
  
    }, {
      key: 'train',
      value: function train(data) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  
        options = Object.assign({}, this.constructor.trainDefaults, options);
        var iterations = options.iterations;
        var errorThresh = options.errorThresh;
        var log = options.log === true ? console.log : options.log;
        var logPeriod = options.logPeriod;
        var learningRate = options.learningRate || this.learningRate;
        var callback = options.callback;
        var callbackPeriod = options.callbackPeriod;
        var error = Infinity;
        var i = void 0;
  
        if (this.hasOwnProperty('setupData')) {
          data = this.setupData(data);
        }
  
        if (!options.keepNetworkIntact) {
          this.initialize();
        }
  
        for (i = 0; i < iterations && error > errorThresh; i++) {
          var sum = 0;
          for (var j = 0; j < data.length; j++) {
            var err = this.trainPattern(data[j], learningRate);
            sum += err;
          }
          error = sum / data.length;
  
          if (isNaN(error)) throw new Error('network error rate is unexpected NaN, check network configurations and try again');
          if (log && i % logPeriod == 0) {
            log('iterations:', i, 'training error:', error);
          }
          if (callback && i % callbackPeriod == 0) {
            callback({ error: error, iterations: i });
          }
        }
  
        return {
          error: error,
          iterations: i
        };
      }
  
      /**
       *
       * @param data
       * @returns {
       *  {
       *    error: number,
       *    misclasses: Array
       *  }
       * }
       */
  
    }, {
      key: 'test',
      value: function test(data) {
        throw new Error('not yet implemented');
      }
  
      /**
       *
       * @returns {Object}
       */
  
    }, {
      key: 'toJSON',
      value: function toJSON() {
        var defaults = this.constructor.defaults;
        var model = this.model;
        var options = {};
        for (var p in defaults) {
          options[p] = this[p];
        }
  
        return {
          type: this.constructor.name,
          options: options,
          input: model.input.toJSON(),
          hiddenLayers: model.hiddenLayers.map(function (hiddenLayer) {
            var layers = {};
            for (var _p in hiddenLayer) {
              layers[_p] = hiddenLayer[_p].toJSON();
            }
            return layers;
          }),
          outputConnector: this.model.outputConnector.toJSON(),
          output: this.model.output.toJSON()
        };
      }
    }, {
      key: 'toJSONString',
      value: function toJSONString() {
        return JSON.stringify(this.toJSON());
      }
    }, {
      key: 'fromJSON',
      value: function fromJSON(json) {
        this.json = json;
        var defaults = this.constructor.defaults;
        var model = this.model;
        var options = json.options;
        var allMatrices = model.allMatrices;
        model.input = _matrix2.default.fromJSON(json.input);
        allMatrices.push(model.input);
        model.hiddenLayers = json.hiddenLayers.map(function (hiddenLayer) {
          var layers = {};
          for (var p in hiddenLayer) {
            layers[p] = _matrix2.default.fromJSON(hiddenLayer[p]);
            allMatrices.push(layers[p]);
          }
          return layers;
        });
        model.outputConnector = _matrix2.default.fromJSON(json.outputConnector);
        model.output = _matrix2.default.fromJSON(json.output);
        allMatrices.push(model.outputConnector);
        allMatrices.push(model.output);
  
        for (var p in defaults) {
          if (!defaults.hasOwnProperty(p)) continue;
          this[p] = options.hasOwnProperty(p) ? options[p] : defaults[p];
        }
  
        if (options.hasOwnProperty('dataFormatter') && options.dataFormatter !== null) {
          this.dataFormatter = _dataFormatter2.default.fromJSON(options.dataFormatter);
          delete options.dataFormatter;
        }
  
        this.bindEquation();
      }
    }, {
      key: 'fromJSONString',
      value: function fromJSONString(json) {
        return this.fromJSON(JSON.parse(json));
      }
  
      /**
       *
       * @returns {Function}
       */
  
    }, {
      key: 'toFunction',
      value: function toFunction() {
        var model = this.model;
        var equations = this.model.equations;
        var equation = equations[1];
        var states = equation.states;
        var jsonString = JSON.stringify(this.toJSON());
  
        function matrixOrigin(m, stateIndex) {
          for (var i = 0, max = states.length; i < max; i++) {
            var state = states[i];
  
            if (i === stateIndex) {
              var j = previousConnectionIndex(m);
              switch (m) {
                case state.left:
                  if (j > -1) {
                    return 'typeof prevStates[' + j + '] === \'object\' ? prevStates[' + j + '].product : new Matrix(' + m.rows + ', ' + m.columns + ')';
                  }
                case state.right:
                  if (j > -1) {
                    return 'typeof prevStates[' + j + '] === \'object\' ? prevStates[' + j + '].product : new Matrix(' + m.rows + ', ' + m.columns + ')';
                  }
                case state.product:
                  return 'new Matrix(' + m.rows + ', ' + m.columns + ')';
                default:
                  throw Error('unknown state');
              }
            }
  
            if (m === state.product) return 'states[' + i + '].product';
            if (m === state.right) return 'states[' + i + '].right';
            if (m === state.left) return 'states[' + i + '].left';
          }
        }
  
        function previousConnectionIndex(m) {
          var connection = model.equationConnections[0];
          var states = equations[0].states;
          for (var i = 0, max = states.length; i < max; i++) {
            if (states[i].product === m) {
              return i;
            }
          }
          return connection.indexOf(m);
        }
  
        function matrixToString(m, stateIndex) {
          if (!m || !m.rows || !m.columns) return 'null';
  
          if (m === model.input) return 'json.input';
          if (m === model.outputConnector) return 'json.outputConnector';
          if (m === model.output) return 'json.output';
  
          for (var i = 0, max = model.hiddenLayers.length; i < max; i++) {
            var hiddenLayer = model.hiddenLayers[i];
            for (var p in hiddenLayer) {
              if (!hiddenLayer.hasOwnProperty(p)) continue;
              if (hiddenLayer[p] !== m) continue;
              return 'json.hiddenLayers[' + i + '].' + p;
            }
          }
  
          return matrixOrigin(m, stateIndex);
        }
  
        function toInner(fnString) {
          // crude, but should be sufficient for now
          // function() { body }
          fnString = fnString.toString().split('{');
          fnString.shift();
          // body }
          fnString = fnString.join('{');
          fnString = fnString.split('}');
          fnString.pop();
          // body
          return fnString.join('}').split('\n').join('\n        ').replace('product.deltas[i] = 0;', '').replace('product.deltas[column] = 0;', '').replace('left.deltas[leftIndex] = 0;', '').replace('right.deltas[rightIndex] = 0;', '').replace('product.deltas = left.deltas.slice(0);', '');
        }
  
        function fileName(fnName) {
          return 'src/recurrent/matrix/' + fnName.replace(/[A-Z]/g, function (value) {
            return '-' + value.toLowerCase();
          }) + '.js';
        }
  
        var statesRaw = [];
        var usedFunctionNames = {};
        var innerFunctionsSwitch = [];
        for (var i = 0, max = states.length; i < max; i++) {
          var state = states[i];
          statesRaw.push('states[' + i + '] = {\n      name: \'' + state.forwardFn.name + '\',\n      left: ' + matrixToString(state.left, i) + ',\n      right: ' + matrixToString(state.right, i) + ',\n      product: ' + matrixToString(state.product, i) + '\n    }');
  
          var fnName = state.forwardFn.name;
          if (!usedFunctionNames[fnName]) {
            usedFunctionNames[fnName] = true;
            innerFunctionsSwitch.push('        case \'' + fnName + '\': //compiled from ' + fileName(fnName) + '\n          ' + toInner(state.forwardFn.toString()) + '\n          break;');
          }
        }
  
        var src = '\n  if (typeof rawInput === \'undefined\') rawInput = [];\n  if (typeof maxPredictionLength === \'undefined\') maxPredictionLength = 100;\n  if (typeof isSampleI === \'undefined\') isSampleI = false;\n  if (typeof temperature === \'undefined\') temperature = 1;\n  ' + (this.dataFormatter !== null ? this.dataFormatter.toFunctionString() : '') + '\n  \n  var input = ' + (this.dataFormatter !== null && typeof this.formatDataIn === 'function' ? 'formatDataIn(rawInput)' : 'rawInput') + ';\n  var json = ' + jsonString + ';\n  var _i = 0;\n  var output = [];\n  var states = [];\n  var prevStates;\n  while (true) {\n    var previousIndex = (_i === 0\n        ? 0\n        : _i < input.length\n          ? input[_i - 1] + 1\n          : output[_i - 1])\n          ;\n    var rowPluckIndex = previousIndex;\n    prevStates = states;\n    states = [];\n    ' + statesRaw.join(';\n    ') + ';\n    for (var stateIndex = 0, stateMax = ' + statesRaw.length + '; stateIndex < stateMax; stateIndex++) {\n      var state = states[stateIndex];\n      var product = state.product;\n      var left = state.left;\n      var right = state.right;\n      \n      switch (state.name) {\n' + innerFunctionsSwitch.join('\n') + '\n      }\n    }\n    \n    var logProbabilities = state.product;\n    if (temperature !== 1 && isSampleI) {\n      for (var q = 0, nq = logProbabilities.weights.length; q < nq; q++) {\n        logProbabilities.weights[q] /= temperature;\n      }\n    }\n\n    var probs = softmax(logProbabilities);\n    var nextIndex = isSampleI ? sampleI(probs) : maxI(probs);\n    \n    _i++;\n    if (nextIndex === 0) {\n      break;\n    }\n    if (_i >= maxPredictionLength) {\n      break;\n    }\n\n    output.push(nextIndex);\n  }\n  ' + (this.dataFormatter !== null && typeof this.formatDataOut === 'function' ? 'return formatDataOut(input, output.slice(input.length).map(function(value) { return value - 1; }))' : 'return output.slice(input.length).map(function(value) { return value - 1; })') + ';\n  function Matrix(rows, columns) {\n    this.rows = rows;\n    this.columns = columns;\n    this.weights = zeros(rows * columns);\n  }\n  ' + (this.dataFormatter !== null && typeof this.formatDataIn === 'function' ? 'function formatDataIn(input, output) { ' + toInner(this.formatDataIn.toString()).replace(/this[.]dataFormatter[\n\s]+[.]/g, '').replace(/this[.]dataFormatter[.]/g, '').replace(/this[.]dataFormatter/g, 'true') + ' }' : '') + '\n  ' + (this.dataFormatter !== null && typeof this.formatDataOut === 'function' ? 'function formatDataOut(input, output) { ' + toInner(this.formatDataOut.toString()).replace(/this[.]dataFormatter[\n\s]+[.]/g, '').replace(/this[.]dataFormatter[.]/g, '').replace(/this[.]dataFormatter/g, 'true') + ' }' : '') + '\n  ' + _zeros2.default.toString() + '\n  ' + _softmax2.default.toString().replace('_2.default', 'Matrix') + '\n  ' + _random.randomF.toString() + '\n  ' + _sampleI2.default.toString() + '\n  ' + _maxI2.default.toString();
        return new Function('rawInput', 'maxPredictionLength', 'isSampleI', 'temperature', src);
      }
    }, {
      key: 'isRunnable',
      get: function get() {
        if (this.model.equations.length === 0) {
          console.error('No equations bound, did you run train()?');
          return false;
        }
  
        return true;
      }
    }]);
  
    return RNN;
  }();
  
  exports.default = RNN;
  
  
  RNN.defaults = {
    inputSize: 20,
    inputRange: 20,
    hiddenSizes: [20, 20],
    outputSize: 20,
    learningRate: 0.01,
    decayRate: 0.999,
    smoothEps: 1e-8,
    regc: 0.000001,
    clipval: 5,
    json: null,
    /**
     *
     * @param {*[]} data
     * @returns {Number[]}
     */
    setupData: function setupData(data) {
      if (typeof data[0] !== 'string' && !Array.isArray(data[0]) && (!data[0].hasOwnProperty('input') || !data[0].hasOwnProperty('output'))) {
        return data;
      }
      var values = [];
      var result = [];
      if (typeof data[0] === 'string' || Array.isArray(data[0])) {
        if (this.dataFormatter === null) {
          for (var i = 0; i < data.length; i++) {
            values.push(data[i]);
          }
          this.dataFormatter = new _dataFormatter2.default(values);
        }
        for (var _i = 0, max = data.length; _i < max; _i++) {
          result.push(this.formatDataIn(data[_i]));
        }
      } else {
        if (this.dataFormatter === null) {
          for (var _i2 = 0; _i2 < data.length; _i2++) {
            values.push(data[_i2].input);
            values.push(data[_i2].output);
          }
          this.dataFormatter = _dataFormatter2.default.fromArrayInputOutput(values);
        }
        for (var _i3 = 0, _max = data.length; _i3 < _max; _i3++) {
          result.push(this.formatDataIn(data[_i3].input, data[_i3].output));
        }
      }
      return result;
    },
    /**
     *
     * @param {*[]} input
     * @param {*[]} output
     * @returns {Number[]}
     */
    formatDataIn: function formatDataIn(input) {
      var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  
      if (this.dataFormatter !== null) {
        if (this.dataFormatter.indexTable.hasOwnProperty('stop-input')) {
          return this.dataFormatter.toIndexesInputOutput(input, output);
        } else {
          return this.dataFormatter.toIndexes(input);
        }
      }
      return input;
    },
    /**
     *
     * @param {Number[]} input
     * @param {Number[]} output
     * @returns {*}
     */
    formatDataOut: function formatDataOut(input, output) {
      if (this.dataFormatter !== null) {
        return this.dataFormatter.toCharacters(output).join('');
      }
      return output;
    },
    dataFormatter: null
  };
  
  RNN.trainDefaults = {
    iterations: 20000,
    errorThresh: 0.005,
    log: false,
    logPeriod: 10,
    learningRate: 0.3,
    callback: null,
    callbackPeriod: 10,
    keepNetworkIntact: false
  };
  
  },{"../utilities/data-formatter":37,"../utilities/random":42,"../utilities/zeros":46,"./matrix":16,"./matrix/copy":14,"./matrix/equation":15,"./matrix/max-i":17,"./matrix/random-matrix":23,"./matrix/sample-i":28,"./matrix/softmax":31}],36:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _stream = require('stream');
  
  var _lookup = require('./lookup');
  
  var _lookup2 = _interopRequireDefault(_lookup);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  /**
   *
   * @param opts
   * @returns {TrainStream}
   * @constructor
   */
  var TrainStream = function (_Writable) {
    _inherits(TrainStream, _Writable);
  
    function TrainStream(opts) {
      var _ret;
  
      _classCallCheck(this, TrainStream);
  
      var _this = _possibleConstructorReturn(this, (TrainStream.__proto__ || Object.getPrototypeOf(TrainStream)).call(this, {
        objectMode: true
      }));
  
      opts = opts || {};
  
      // require the neuralNetwork
      if (!opts.neuralNetwork) {
        throw new Error('no neural network specified');
      }
  
      _this.neuralNetwork = opts.neuralNetwork;
      _this.dataFormatDetermined = false;
  
      _this.inputKeys = [];
      _this.outputKeys = []; // keeps track of keys seen
      _this.i = 0; // keep track of the for loop i variable that we got rid of
      _this.iterations = opts.iterations || 20000;
      _this.errorThresh = opts.errorThresh || 0.005;
      _this.log = opts.log ? typeof opts.log === 'function' ? opts.log : console.log : false;
      _this.logPeriod = opts.logPeriod || 10;
      _this.callback = opts.callback;
      _this.callbackPeriod = opts.callbackPeriod || 10;
      _this.floodCallback = opts.floodCallback;
      _this.doneTrainingCallback = opts.doneTrainingCallback;
  
      _this.size = 0;
      _this.count = 0;
  
      _this.sum = 0;
  
      _this.on('finish', _this.finishStreamIteration.bind(_this));
  
      return _ret = _this, _possibleConstructorReturn(_this, _ret);
    }
  
    /**
     * _write expects data to be in the form of a datum. ie. {input: {a: 1 b: 0}, output: {z: 0}}
     * @param chunk
     * @param enc
     * @param next
     * @returns {*}
     * @private
     */
  
  
    _createClass(TrainStream, [{
      key: '_write',
      value: function _write(chunk, enc, next) {
        if (!chunk) {
          // check for the end of one iteration of the stream
          this.emit('finish');
          return next();
        }
  
        if (!this.dataFormatDetermined) {
          this.size++;
          this.inputKeys = uniques(this.inputKeys.slice(0).concat(Object.keys(chunk.input)));
          this.outputKeys = uniques(this.outputKeys.slice(0).concat(Object.keys(chunk.output)));
          this.firstDatum = this.firstDatum || chunk;
          return next();
        }
  
        this.count++;
  
        var data = this.neuralNetwork.formatData(chunk);
        this.trainDatum(data[0]);
  
        // tell the Readable Stream that we are ready for more data
        next();
      }
  
      /**
       *
       * @param datum
       */
  
    }, {
      key: 'trainDatum',
      value: function trainDatum(datum) {
        var err = this.neuralNetwork.trainPattern(datum.input, datum.output);
        this.sum += err;
      }
  
      /**
       *
       * @returns {*}
       */
  
    }, {
      key: 'finishStreamIteration',
      value: function finishStreamIteration() {
        if (this.dataFormatDetermined && this.size !== this.count) {
          this.log('This iteration\'s data length was different from the first.');
        }
  
        if (!this.dataFormatDetermined) {
          // create the lookup
          this.neuralNetwork.inputLookup = _lookup2.default.lookupFromArray(this.inputKeys);
          if (!Array.isArray(this.firstDatum.output)) {
            this.neuralNetwork.outputLookup = _lookup2.default.lookupFromArray(this.outputKeys);
          }
  
          var data = this.neuralNetwork.formatData(this.firstDatum);
          var sizes = [];
          var inputSize = data[0].input.length;
          var outputSize = data[0].output.length;
          var hiddenSizes = this.hiddenSizes;
          if (!hiddenSizes) {
            sizes.push(Math.max(3, Math.floor(inputSize / 2)));
          } else {
            hiddenSizes.forEach(function (size) {
              sizes.push(size);
            });
          }
  
          sizes.unshift(inputSize);
          sizes.push(outputSize);
  
          this.dataFormatDetermined = true;
          this.neuralNetwork.initialize(sizes);
  
          if (typeof this.floodCallback === 'function') {
            this.floodCallback();
          }
          return;
        }
  
        var error = this.sum / this.size;
  
        if (this.log && this.i % this.logPeriod == 0) {
          this.log('iterations:', this.i, 'training error:', error);
        }
        if (this.callback && this.i % this.callbackPeriod == 0) {
          this.callback({
            error: error,
            iterations: this.i
          });
        }
  
        this.sum = 0;
        this.count = 0;
        // update the iterations
        this.i++;
  
        // do a check here to see if we need the stream again
        if (this.i < this.iterations && error > this.errorThresh) {
          if (typeof this.floodCallback === 'function') {
            return this.floodCallback();
          }
        } else {
          // done training
          if (typeof this.doneTrainingCallback === 'function') {
            return this.doneTrainingCallback({
              error: error,
              iterations: this.i
            });
          }
        }
      }
    }]);
  
    return TrainStream;
  }(_stream.Writable);
  
  /**
   *
   * https://gist.github.com/telekosmos/3b62a31a5c43f40849bb
   * @param arr
   * @returns {Array}
   */
  
  
  exports.default = TrainStream;
  function uniques(arr) {
    // Sets cannot contain duplicate elements, which is what we want
    return [].concat(_toConsumableArray(new Set(arr)));
  }
  
  },{"./lookup":3,"stream":109}],37:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  /**
   *
   * @param {String[]|Number[]} values
   * @param maxThreshold
   * @constructor
   */
  var DataFormatter = function () {
    function DataFormatter(values) {
      var maxThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  
      _classCallCheck(this, DataFormatter);
  
      if (values === undefined) return;
  
      this.values = values;
      // go over all characters and keep track of all unique ones seen
      // count up all characters
      this.indexTable = {};
      this.characterTable = {};
      this.characters = [];
      this.buildCharactersFromIterable(values);
      this.buildTables(maxThreshold);
    }
  
    _createClass(DataFormatter, [{
      key: 'buildCharactersFromIterable',
      value: function buildCharactersFromIterable(values) {
        var tempCharactersTable = {};
        for (var dataFormatterIndex = 0, dataFormatterLength = values.length; dataFormatterIndex < dataFormatterLength; dataFormatterIndex++) {
          var characters = values[dataFormatterIndex];
  
          if (characters.hasOwnProperty('length')) {
            for (var characterIndex = 0, charactersLength = characters.length; characterIndex < charactersLength; characterIndex++) {
              var character = characters[characterIndex];
              if (tempCharactersTable.hasOwnProperty(character)) continue;
              tempCharactersTable[character] = true;
              this.characters.push(character);
            }
          } else {
            var _character = values[dataFormatterIndex];
            if (tempCharactersTable.hasOwnProperty(_character)) continue;
            tempCharactersTable[dataFormatterIndex] = true;
            this.characters.push(_character);
          }
        }
      }
    }, {
      key: 'buildTables',
      value: function buildTables(maxThreshold) {
        // filter by count threshold and create pointers
        var charactersLength = this.characters.length;
        for (var characterIndex = 0; characterIndex < charactersLength; characterIndex++) {
          var character = this.characters[characterIndex];
          if (characterIndex >= maxThreshold) {
            // add character to dataFormatter
            this.indexTable[character] = characterIndex;
            this.characterTable[characterIndex] = character;
          }
        }
      }
    }, {
      key: 'toIndexes',
      value: function toIndexes(value) {
        var maxThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  
        var result = [];
        var indexTable = this.indexTable;
  
        for (var i = 0, max = value.length; i < max; i++) {
          var character = value[i];
          var index = indexTable[character];
          if (index === undefined) {
            throw new Error('unrecognized character "' + character + '"');
          }
          if (index < maxThreshold) continue;
          result.push(index);
        }
  
        return result;
      }
    }, {
      key: 'toIndexesInputOutput',
      value: function toIndexesInputOutput(value1) {
        var value2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var maxThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  
        var result = void 0;
        if (typeof value1 === 'string') {
          result = this.toIndexes(value1.split('').concat(['stop-input', 'start-output']), maxThreshold);
        } else {
          result = this.toIndexes(value1.concat(['stop-input', 'start-output']), maxThreshold);
        }
  
        if (value2 === null) return result;
  
        if (typeof value2 === 'string') {
          return result.concat(this.toIndexes(value2.split(''), maxThreshold));
        } else {
          return result.concat(this.toIndexes(value2, maxThreshold));
        }
      }
    }, {
      key: 'toCharacters',
      value: function toCharacters(indices) {
        var maxThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  
        var result = [];
        var characterTable = this.characterTable;
  
        for (var i = 0, max = indices.length; i < max; i++) {
          var index = indices[i];
          if (index < maxThreshold) continue;
          var character = characterTable[index];
          if (character === undefined) {
            throw new Error('unrecognized index "' + index + '"');
          }
          result.push(character);
        }
  
        return result;
      }
    }, {
      key: 'toString',
      value: function toString(indices, maxThreshold) {
        return this.toCharacters(indices, maxThreshold).join('');
      }
    }, {
      key: 'addInputOutput',
      value: function addInputOutput() {
        this.addSpecial('stop-input');
        this.addSpecial('start-output');
      }
    }, {
      key: 'addSpecial',
      value: function addSpecial() {
        for (var i = 0; i < arguments.length; i++) {
          var special = arguments[i];
          var specialIndex = this.indexTable[special] = this.characters.length;
          this.characterTable[specialIndex] = special;
          this.characters.push(special);
        }
      }
    }, {
      key: 'toFunctionString',
      value: function toFunctionString() {
        return '\nvar characterTable = ' + JSON.stringify(this.characterTable) + ';\nvar indexTable = ' + JSON.stringify(this.indexTable) + ';\nvar characters = ' + JSON.stringify(this.characters) + ';\n' + this.toIndexes.toString().replace(/(let|var) indexTable = this[.]indexTable;\n/, '').replace(/this[.]/g, '') + '\n' + this.toIndexesInputOutput.toString().replace(/this[.]/g, '') + '\n' + this.toCharacters.toString().replace(/(let|var) characterTable = this[.]characterTable;\n/g, '').replace(/this[.]/, '') + '\n';
      }
    }], [{
      key: 'fromAllPrintable',
      value: function fromAllPrintable(maxThreshold) {
        var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['\n'];
  
        for (var i = 32; i <= 126; i++) {
          values.push(String.fromCharCode(i));
        }
        return new DataFormatter(values, maxThreshold);
      }
    }, {
      key: 'fromAllPrintableInputOutput',
      value: function fromAllPrintableInputOutput(maxThreshold) {
        var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['\n'];
  
        var dataFormatter = DataFormatter.fromAllPrintable(maxThreshold, values);
        dataFormatter.addInputOutput();
        return dataFormatter;
      }
    }, {
      key: 'fromStringInputOutput',
      value: function fromStringInputOutput(string, maxThreshold) {
        var _String$prototype;
  
        var values = (_String$prototype = String.prototype).concat.apply(_String$prototype, _toConsumableArray(new Set(string)));
        var dataFormatter = new DataFormatter(values, maxThreshold);
        dataFormatter.addInputOutput();
        return dataFormatter;
      }
    }, {
      key: 'fromArrayInputOutput',
      value: function fromArrayInputOutput(array, maxThreshold) {
        var dataFormatter = new DataFormatter(array.filter(function (v, i, a) {
          return a.indexOf(v) === i;
        }).sort(), maxThreshold);
        dataFormatter.addInputOutput();
        return dataFormatter;
      }
    }, {
      key: 'fromString',
      value: function fromString(string, maxThreshold) {
        var _String$prototype2;
  
        var values = (_String$prototype2 = String.prototype).concat.apply(_String$prototype2, _toConsumableArray(new Set(string)));
        return new DataFormatter(values, maxThreshold);
      }
    }, {
      key: 'fromJSON',
      value: function fromJSON(json) {
        var dataFormatter = new DataFormatter();
        dataFormatter.indexTable = json.indexTable;
        dataFormatter.characterTable = json.characterTable;
        dataFormatter.values = json.values;
        dataFormatter.characters = json.characters;
        return dataFormatter;
      }
    }]);
  
    return DataFormatter;
  }();
  
  exports.default = DataFormatter;
  
  },{}],38:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = max;
  
  var _toArray = require('./to-array');
  
  var _toArray2 = _interopRequireDefault(_toArray);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  /**
   *
   * @param values
   * @returns {number}
   */
  function max(values) {
    return Math.max.apply(Math, (0, _toArray2.default)(values));
  }
  
  },{"./to-array":45}],39:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = mse;
  function mse(errors) {
    // mean squared error
    var sum = 0;
    for (var i = 0; i < errors.length; i++) {
      sum += Math.pow(errors[i], 2);
    }
    return sum / errors.length;
  }
  
  },{}],40:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ones;
  function ones(size) {
    if (typeof Float32Array !== 'undefined') return new Float32Array(size).fill(1);
    var array = new Array(size);
    for (var i = 0; i < size; i++) {
      array[i] = 1;
    }
    return array;
  }
  
  },{}],41:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = randomWeight;
  function randomWeight() {
    return Math.random() * 0.4 - 0.2;
  }
  
  },{}],42:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.randomF = randomF;
  exports.randomI = randomI;
  exports.randomN = randomN;
  function randomF(a, b) {
    return Math.random() * (b - a) + a;
  }
  
  function randomI(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
  }
  
  function randomN(mu, std) {
    return mu + gaussRandom() * std;
  }
  
  // Random numbers utils
  function gaussRandom() {
    if (gaussRandom.returnV) {
      gaussRandom.returnV = false;
      return gaussRandom.vVal;
    }
    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u * u + v * v;
    if (r == 0 || r > 1) {
      return gaussRandom();
    }
    var c = Math.sqrt(-2 * Math.log(r) / r);
    gaussRandom.vVal = v * c; // cache this
    gaussRandom.returnV = true;
    return u * c;
  }
  gaussRandom.returnV = false;
  gaussRandom.vVal = 0;
  
  },{}],43:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = randos;
  
  var _randomWeight = require('./random-weight');
  
  var _randomWeight2 = _interopRequireDefault(_randomWeight);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function randos(size) {
    var array = new Float32Array(size);
    for (var i = 0; i < size; i++) {
      array[i] = (0, _randomWeight2.default)();
    }
    return array;
  }
  
  },{"./random-weight":41}],44:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = range;
  /**
   *
   * @param start
   * @param end
   * @returns {Array}
   */
  function range(start, end) {
    var result = [];
    for (; start < end; start++) {
      result.push(start);
    }
    return result;
  }
  
  },{}],45:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toArray;
  /**
   *
   * @param values
   * @returns {*}
   */
  function toArray(values) {
    if (Array.isArray(values)) {
      return values;
    } else {
      var keys = Object.keys(values);
      var result = new Float32Array(keys.length);
      for (var i in keys) {
        result[i] = values[keys[i]];
      }
      return result;
    }
  }
  
  },{}],46:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = zeros;
  function zeros(size) {
    return new Float32Array(size);
  }
  
  },{}],47:[function(require,module,exports){
  var crossValidate = require('./dist/cross-validate').default;
  var likely = require('./dist/likely').default;
  var lookup = require('./dist/lookup').default;
  var NeuralNetwork = require('./dist/neural-network').default;
  var NeuralNetworkGPU = require('./dist/neural-network-gpu').default;
  var TrainStream = require('./dist/train-stream').default;
  var RNNTimeStep = require('./dist/recurrent/rnn-time-step').default;
  var LSTMTimeStep = require('./dist/recurrent/lstm-time-step').default;
  var GRUTimeStep = require('./dist/recurrent/gru-time-step').default;
  var RNN = require('./dist/recurrent/rnn').default;
  var LSTM = require('./dist/recurrent/lstm').default;
  var GRU = require('./dist/recurrent/gru').default;
  var utilities = {
    max: require('./dist/utilities/max').default,
    mse: require('./dist/utilities/mse').default,
    ones: require('./dist/utilities/ones').default,
    random: require('./dist/utilities/random').default,
    randomWeight: require('./dist/utilities/random-weight').default,
    randos: require('./dist/utilities/randos').default,
    range: require('./dist/utilities/range').default,
    toArray: require('./dist/utilities/to-array').default,
    DataFormatter: require('./dist/utilities/data-formatter').default,
    zeros: require('./dist/utilities/zeros').default
  };
  
  var brain = {
    crossValidate: crossValidate,
    likely: likely,
    lookup: lookup,
    NeuralNetwork: NeuralNetwork,
    NeuralNetworkGPU: NeuralNetworkGPU,
    TrainStream: TrainStream,
    recurrent: {
      RNNTimeStep: RNNTimeStep,
      LSTMTimeStep: LSTMTimeStep,
      GRUTimeStep: GRUTimeStep,
      RNN: RNN,
      LSTM: LSTM,
      GRU: GRU,
    },
    utilities: utilities
  };
  
  if (typeof window !== 'undefined') {
    window.brain = brain;
  }
  if (typeof self !== 'undefined') {
    self.brain = brain;
  }
  if (typeof module !== 'undefined') {
    module.exports = brain;
  }
  
  },{"./dist/cross-validate":1,"./dist/likely":2,"./dist/lookup":3,"./dist/neural-network":5,"./dist/neural-network-gpu":4,"./dist/recurrent/gru":7,"./dist/recurrent/gru-time-step":6,"./dist/recurrent/lstm":9,"./dist/recurrent/lstm-time-step":8,"./dist/recurrent/rnn":35,"./dist/recurrent/rnn-time-step":34,"./dist/train-stream":36,"./dist/utilities/data-formatter":37,"./dist/utilities/max":38,"./dist/utilities/mse":39,"./dist/utilities/ones":40,"./dist/utilities/random":42,"./dist/utilities/random-weight":41,"./dist/utilities/randos":43,"./dist/utilities/range":44,"./dist/utilities/to-array":45,"./dist/utilities/zeros":46}],48:[function(require,module,exports){
  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.acorn = {})));
  }(this, (function (exports) { 'use strict';
  
  // Reserved word lists for various dialects of the language
  
  var reservedWords = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments"
  };
  
  // And the keywords
  
  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
  
  var keywords = {
    5: ecma5AndLessKeywords,
    6: ecma5AndLessKeywords + " const class extends export import super"
  };
  
  var keywordRelationalOperator = /^in(stanceof)?$/;
  
  // ## Character categories
  
  // Big ugly regular expressions that match characters in the
  // whitespace, identifier, and identifier-start categories. These
  // are only applied when a character is found to actually have a
  // code point above 128.
  // Generated by `bin/generate-identifier-regex.js`.
  
  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u08a0-\u08b4\u08b6-\u08bd\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312e\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fea\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ae\ua7b0-\ua7b7\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab65\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
  var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08d4-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1cf7-\u1cf9\u1dc0-\u1df9\u1dfb-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
  
  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
  
  nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
  
  // These are a run-length and offset encoded representation of the
  // >0xffff code points that are a valid part of identifiers. The
  // offset starts at 0x10000, and each pair of numbers represents an
  // offset to the next range, and then a size of the range. They were
  // generated by bin/generate-identifier-regex.js
  
  // eslint-disable-next-line comma-spacing
  var astralIdentifierStartCodes = [0,11,2,25,2,18,2,1,2,14,3,13,35,122,70,52,268,28,4,48,48,31,14,29,6,37,11,29,3,35,5,7,2,4,43,157,19,35,5,35,5,39,9,51,157,310,10,21,11,7,153,5,3,0,2,43,2,1,4,0,3,22,11,22,10,30,66,18,2,1,11,21,11,25,71,55,7,1,65,0,16,3,2,2,2,26,45,28,4,28,36,7,2,27,28,53,11,21,11,18,14,17,111,72,56,50,14,50,785,52,76,44,33,24,27,35,42,34,4,0,13,47,15,3,22,0,2,0,36,17,2,24,85,6,2,0,2,3,2,14,2,9,8,46,39,7,3,1,3,21,2,6,2,1,2,4,4,0,19,0,13,4,159,52,19,3,54,47,21,1,2,0,185,46,42,3,37,47,21,0,60,42,86,25,391,63,32,0,257,0,11,39,8,0,22,0,12,39,3,3,55,56,264,8,2,36,18,0,50,29,113,6,2,1,2,37,22,0,698,921,103,110,18,195,2749,1070,4050,582,8634,568,8,30,114,29,19,47,17,3,32,20,6,18,881,68,12,0,67,12,65,1,31,6124,20,754,9486,286,82,395,2309,106,6,12,4,8,8,9,5991,84,2,70,2,1,3,0,3,1,3,3,2,11,2,0,2,6,2,64,2,3,3,7,2,6,2,27,2,3,2,4,2,0,4,6,2,339,3,24,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,30,2,24,2,7,4149,196,60,67,1213,3,2,26,2,1,2,0,3,0,2,9,2,3,2,0,2,0,7,0,5,0,2,0,2,0,2,2,2,1,2,0,3,0,2,0,2,0,2,0,2,0,2,1,2,0,3,3,2,6,2,3,2,3,2,0,2,9,2,16,6,2,2,4,2,16,4421,42710,42,4148,12,221,3,5761,15,7472,3104,541];
  
  // eslint-disable-next-line comma-spacing
  var astralIdentifierCodes = [509,0,227,0,150,4,294,9,1368,2,2,1,6,3,41,2,5,0,166,1,1306,2,54,14,32,9,16,3,46,10,54,9,7,2,37,13,2,9,52,0,13,2,49,13,10,2,4,9,83,11,7,0,161,11,6,9,7,3,57,0,2,6,3,1,3,2,10,0,11,1,3,6,4,4,193,17,10,9,87,19,13,9,214,6,3,8,28,1,83,16,16,9,82,12,9,9,84,14,5,9,423,9,280,9,41,6,2,3,9,0,10,10,47,15,406,7,2,7,17,9,57,21,2,13,123,5,4,0,2,1,2,6,2,0,9,9,19719,9,135,4,60,6,26,9,1016,45,17,3,19723,1,5319,4,4,5,9,7,3,6,31,3,149,2,1418,49,513,54,5,49,9,0,15,0,23,4,2,14,1361,6,2,16,3,6,2,1,2,4,2214,6,110,6,6,9,792487,239];
  
  // This has a complexity linear to the value of the code. The
  // assumption is that looking up astral identifier characters is
  // rare.
  function isInAstralSet(code, set) {
    var pos = 0x10000;
    for (var i = 0; i < set.length; i += 2) {
      pos += set[i];
      if (pos > code) { return false }
      pos += set[i + 1];
      if (pos >= code) { return true }
    }
  }
  
  // Test whether a given character code starts an identifier.
  
  function isIdentifierStart(code, astral) {
    if (code < 65) { return code === 36 }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes)
  }
  
  // Test whether a given character is part of an identifier.
  
  function isIdentifierChar(code, astral) {
    if (code < 48) { return code === 36 }
    if (code < 58) { return true }
    if (code < 65) { return false }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
  }
  
  var TokenType = function TokenType(label, conf) {
    if ( conf === void 0 ) conf = {};
  
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  };
  
  function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
  }
  var beforeExpr = {beforeExpr: true};
  var startsExpr = {startsExpr: true};
  
  
  var keywords$1 = {};

  function kw(name, options) {
    if ( options === void 0 ) options = {};
  
    options.keyword = name;
    return keywords$1[name] = new TokenType(name, options)
  }
  
  var types = {
    num: new TokenType("num", startsExpr),
    regexp: new TokenType("regexp", startsExpr),
    string: new TokenType("string", startsExpr),
    name: new TokenType("name", startsExpr),
    eof: new TokenType("eof"),
  
    // Punctuation token types.
    bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
    bracketR: new TokenType("]"),
    braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
    braceR: new TokenType("}"),
    parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
    parenR: new TokenType(")"),
    comma: new TokenType(",", beforeExpr),
    semi: new TokenType(";", beforeExpr),
    colon: new TokenType(":", beforeExpr),
    dot: new TokenType("."),
    question: new TokenType("?", beforeExpr),
    arrow: new TokenType("=>", beforeExpr),
    template: new TokenType("template"),
    invalidTemplate: new TokenType("invalidTemplate"),
    ellipsis: new TokenType("...", beforeExpr),
    backQuote: new TokenType("`", startsExpr),
    dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),
  
  
    eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
    assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
    incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
    prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
    logicalOR: binop("||", 1),
    logicalAND: binop("&&", 2),
    bitwiseOR: binop("|", 3),
    bitwiseXOR: binop("^", 4),
    bitwiseAND: binop("&", 5),
    equality: binop("==/!=/===/!==", 6),
    relational: binop("</>/<=/>=", 7),
    bitShift: binop("<</>>/>>>", 8),
    plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
    modulo: binop("%", 10),
    star: binop("*", 10),
    slash: binop("/", 10),
    starstar: new TokenType("**", {beforeExpr: true}),
  
    // Keyword token types.
    _break: kw("break"),
    _case: kw("case", beforeExpr),
    _catch: kw("catch"),
    _continue: kw("continue"),
    _debugger: kw("debugger"),
    _default: kw("default", beforeExpr),
    _do: kw("do", {isLoop: true, beforeExpr: true}),
    _else: kw("else", beforeExpr),
    _finally: kw("finally"),
    _for: kw("for", {isLoop: true}),
    _function: kw("function", startsExpr),
    _if: kw("if"),
    _return: kw("return", beforeExpr),
    _switch: kw("switch"),
    _throw: kw("throw", beforeExpr),
    _try: kw("try"),
    _var: kw("var"),
    _const: kw("const"),
    _while: kw("while", {isLoop: true}),
    _with: kw("with"),
    _new: kw("new", {beforeExpr: true, startsExpr: true}),
    _this: kw("this", startsExpr),
    _super: kw("super", startsExpr),
    _class: kw("class", startsExpr),
    _extends: kw("extends", beforeExpr),
    _export: kw("export"),
    _import: kw("import"),
    _null: kw("null", startsExpr),
    _true: kw("true", startsExpr),
    _false: kw("false", startsExpr),
    _in: kw("in", {beforeExpr: true, binop: 7}),
    _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
    _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
    _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
    _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
  };
  
  // Matches a whole line break (where CRLF is considered a single
  // line break). Used to count lines.
  
  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");
  
  function isNewLine(code) {
    return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
  }
  
  var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
  
  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
  
  var ref = Object.prototype;
  var hasOwnProperty = ref.hasOwnProperty;
  var toString = ref.toString;
  
  // Checks if an object has a property.
  
  function has(obj, propName) {
    return hasOwnProperty.call(obj, propName)
  }
  
  var isArray = Array.isArray || (function (obj) { return (
    toString.call(obj) === "[object Array]"
  ); });
  
  // These are used when `options.locations` is on, for the
  // `startLoc` and `endLoc` properties.
  
  var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
  };
  
  Position.prototype.offset = function offset (n) {
    return new Position(this.line, this.column + n)
  };
  
  var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) { this.source = p.sourceFile; }
  };
  
  // The `getLineInfo` function is mostly useful when the
  // `locations` option is off (for performance reasons) and you
  // want to find the line/column position for a given character
  // offset. `input` should be the code string that the offset refers
  // into.
  
  function getLineInfo(input, offset) {
    for (var line = 1, cur = 0;;) {
      lineBreakG.lastIndex = cur;
      var match = lineBreakG.exec(input);
      if (match && match.index < offset) {
        ++line;
        cur = match.index + match[0].length;
      } else {
        return new Position(line, offset - cur)
      }
    }
  }
  
  // A second optional argument can be given to further configure
  // the parser process. These options are recognized:
  
  var defaultOptions = {
    // `ecmaVersion` indicates the ECMAScript version to parse. Must
    // be either 3, 5, 6 (2015), 7 (2016), or 8 (2017). This influences support
    // for strict mode, the set of reserved words, and support for
    // new syntax features. The default is 7.
    ecmaVersion: 7,
    // `sourceType` indicates the mode the code should be parsed in.
    // Can be either `"script"` or `"module"`. This influences global
    // strict mode and parsing of `import` and `export` declarations.
    sourceType: "script",
    // `onInsertedSemicolon` can be a callback that will be called
    // when a semicolon is automatically inserted. It will be passed
    // th position of the comma as an offset, and if `locations` is
    // enabled, it is given the location as a `{line, column}` object
    // as second argument.
    onInsertedSemicolon: null,
    // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
    // trailing commas.
    onTrailingComma: null,
    // By default, reserved words are only enforced if ecmaVersion >= 5.
    // Set `allowReserved` to a boolean value to explicitly turn this on
    // an off. When this option has the value "never", reserved words
    // and keywords can also not be used as property names.
    allowReserved: null,
    // When enabled, a return at the top level is not considered an
    // error.
    allowReturnOutsideFunction: false,
    // When enabled, import/export statements are not constrained to
    // appearing at the top of the program.
    allowImportExportEverywhere: false,
    // When enabled, hashbang directive in the beginning of file
    // is allowed and treated as a line comment.
    allowHashBang: false,
    // When `locations` is on, `loc` properties holding objects with
    // `start` and `end` properties in `{line, column}` form (with
    // line being 1-based and column 0-based) will be attached to the
    // nodes.
    locations: false,
    // A function can be passed as `onToken` option, which will
    // cause Acorn to call that function with object in the same
    // format as tokens returned from `tokenizer().getToken()`. Note
    // that you are not allowed to call the parser from the
    // callback—that will corrupt its internal state.
    onToken: null,
    // A function can be passed as `onComment` option, which will
    // cause Acorn to call that function with `(block, text, start,
    // end)` parameters whenever a comment is skipped. `block` is a
    // boolean indicating whether this is a block (`/* */`) comment,
    // `text` is the content of the comment, and `start` and `end` are
    // character offsets that denote the start and end of the comment.
    // When the `locations` option is on, two more parameters are
    // passed, the full `{line, column}` locations of the start and
    // end of the comments. Note that you are not allowed to call the
    // parser from the callback—that will corrupt its internal state.
    onComment: null,
    // Nodes have their start and end characters offsets recorded in
    // `start` and `end` properties (directly on the node, rather than
    // the `loc` object, which holds line/column data. To also add a
    // [semi-standardized][range] `range` property holding a `[start,
    // end]` array with the same numbers, set the `ranges` option to
    // `true`.
    //
    // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
    ranges: false,
    // It is possible to parse multiple files into a single AST by
    // passing the tree produced by parsing the first file as
    // `program` option in subsequent parses. This will add the
    // toplevel forms of the parsed file to the `Program` (top) node
    // of an existing parse tree.
    program: null,
    // When `locations` is on, you can pass this to record the source
    // file in every node's `loc` object.
    sourceFile: null,
    // This value, if given, is stored in every node, whether
    // `locations` is on or off.
    directSourceFile: null,
    // When enabled, parenthesized expressions are represented by
    // (non-standard) ParenthesizedExpression nodes
    preserveParens: false,
    plugins: {}
  };
  
  // Interpret and default an options object
  
  function getOptions(opts) {
    var options = {};
  
    for (var opt in defaultOptions)
      { options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt]; }
  
    if (options.ecmaVersion >= 2015)
      { options.ecmaVersion -= 2009; }
  
    if (options.allowReserved == null)
      { options.allowReserved = options.ecmaVersion < 5; }
  
    if (isArray(options.onToken)) {
      var tokens = options.onToken;
      options.onToken = function (token) { return tokens.push(token); };
    }
    if (isArray(options.onComment))
      { options.onComment = pushComment(options, options.onComment); }
  
    return options
  }
  
  function pushComment(options, array) {
    return function(block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? "Block" : "Line",
        value: text,
        start: start,
        end: end
      };
      if (options.locations)
        { comment.loc = new SourceLocation(this, startLoc, endLoc); }
      if (options.ranges)
        { comment.range = [start, end]; }
      array.push(comment);
    }
  }
  
  // Registered plugins
  var plugins = {};
  
  function keywordRegexp(words) {
    return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
  }
  
  var Parser = function Parser(options, input, startPos) {
    this.options = options = getOptions(options);
    this.sourceFile = options.sourceFile;
    this.keywords = keywordRegexp(keywords[options.ecmaVersion >= 6 ? 6 : 5]);
    var reserved = "";
    if (!options.allowReserved) {
      for (var v = options.ecmaVersion;; v--)
        { if (reserved = reservedWords[v]) { break } }
      if (options.sourceType == "module") { reserved += " await"; }
    }
    this.reservedWords = keywordRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
    this.reservedWordsStrict = keywordRegexp(reservedStrict);
    this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + reservedWords.strictBind);
    this.input = String(input);
  
    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.
    this.containsEsc = false;
  
    // Load plugins
    this.loadPlugins(options.plugins);
  
    // Set up token state
  
    // The current position of the tokenizer in the input.
    if (startPos) {
      this.pos = startPos;
      this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }
  
    // Properties of the current token:
    // Its type
    this.type = types.eof;
    // For tokens that include more information than their type, the value
    this.value = null;
    // Its start and end offset
    this.start = this.end = this.pos;
    // And, if locations are used, the {line, column} object
    // corresponding to those offsets
    this.startLoc = this.endLoc = this.curPosition();
  
    // Position information for the previous token
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;
  
    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = this.initialContext();
    this.exprAllowed = true;
  
    // Figure out if it's a module code.
    this.inModule = options.sourceType === "module";
    this.strict = this.inModule || this.strictDirective(this.pos);
  
    // Used to signify the start of a potential arrow function
    this.potentialArrowAt = -1;
  
    // Flags to track whether we are in a function, a generator, an async function.
    this.inFunction = this.inGenerator = this.inAsync = false;
    // Positions to delayed-check that yield/await does not exist in default parameters.
    this.yieldPos = this.awaitPos = 0;
    // Labels in scope.
    this.labels = [];
  
    // If enabled, skip leading hashbang line.
    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
      { this.skipLineComment(2); }
  
    // Scope tracking for duplicate variable names (see scope.js)
    this.scopeStack = [];
    this.enterFunctionScope();
  
    // For RegExp validation
    this.regexpState = null;
  };
  
  // DEPRECATED Kept for backwards compatibility until 3.0 in case a plugin uses them
  Parser.prototype.isKeyword = function isKeyword (word) { return this.keywords.test(word) };
  Parser.prototype.isReservedWord = function isReservedWord (word) { return this.reservedWords.test(word) };
  
  Parser.prototype.extend = function extend (name, f) {
    this[name] = f(this[name]);
  };
  
  Parser.prototype.loadPlugins = function loadPlugins (pluginConfigs) {
      var this$1 = this;
  
    for (var name in pluginConfigs) {
      var plugin = plugins[name];
      if (!plugin) { throw new Error("Plugin '" + name + "' not found") }
      plugin(this$1, pluginConfigs[name]);
    }
  };
  
  Parser.prototype.parse = function parse () {
    var node = this.options.program || this.startNode();
    this.nextToken();
    return this.parseTopLevel(node)
  };
  
  var pp = Parser.prototype;
  
  // ## Parser utilities
  
  var literal = /^(?:'((?:\\.|[^'])*?)'|"((?:\\.|[^"])*?)"|;)/;
  pp.strictDirective = function(start) {
    var this$1 = this;
  
    for (;;) {
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this$1.input)[0].length;
      var match = literal.exec(this$1.input.slice(start));
      if (!match) { return false }
      if ((match[1] || match[2]) == "use strict") { return true }
      start += match[0].length;
    }
  };
  
  // Predicate that tests whether the next token is of the given
  // type, and if yes, consumes it as a side effect.
  
  pp.eat = function(type) {
    if (this.type === type) {
      this.next();
      return true
    } else {
      return false
    }
  };
  
  // Tests whether parsed token is a contextual keyword.
  
  pp.isContextual = function(name) {
    return this.type === types.name && this.value === name && !this.containsEsc
  };
  
  // Consumes contextual keyword if possible.
  
  pp.eatContextual = function(name) {
    if (!this.isContextual(name)) { return false }
    this.next();
    return true
  };
  
  // Asserts that following token is given contextual keyword.
  
  pp.expectContextual = function(name) {
    if (!this.eatContextual(name)) { this.unexpected(); }
  };
  
  // Test whether a semicolon can be inserted at the current position.
  
  pp.canInsertSemicolon = function() {
    return this.type === types.eof ||
      this.type === types.braceR ||
      lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };
  
  pp.insertSemicolon = function() {
    if (this.canInsertSemicolon()) {
      if (this.options.onInsertedSemicolon)
        { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
      return true
    }
  };
  
  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.
  
  pp.semicolon = function() {
    if (!this.eat(types.semi) && !this.insertSemicolon()) { this.unexpected(); }
  };
  
  pp.afterTrailingComma = function(tokType, notNext) {
    if (this.type == tokType) {
      if (this.options.onTrailingComma)
        { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
      if (!notNext)
        { this.next(); }
      return true
    }
  };
  
  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error.
  
  pp.expect = function(type) {
    this.eat(type) || this.unexpected();
  };
  
  // Raise an unexpected token error.
  
  pp.unexpected = function(pos) {
    this.raise(pos != null ? pos : this.start, "Unexpected token");
  };
  
  function DestructuringErrors() {
    this.shorthandAssign =
    this.trailingComma =
    this.parenthesizedAssign =
    this.parenthesizedBind =
    this.doubleProto =
      -1;
  }
  
  pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
    if (!refDestructuringErrors) { return }
    if (refDestructuringErrors.trailingComma > -1)
      { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
    var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
    if (parens > -1) { this.raiseRecoverable(parens, "Parenthesized pattern"); }
  };
  
  pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
    if (!refDestructuringErrors) { return false }
    var shorthandAssign = refDestructuringErrors.shorthandAssign;
    var doubleProto = refDestructuringErrors.doubleProto;
    if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
    if (shorthandAssign >= 0)
      { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
    if (doubleProto >= 0)
      { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
  };
  
  pp.checkYieldAwaitInDefaultParams = function() {
    if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
      { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
    if (this.awaitPos)
      { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
  };
  
  pp.isSimpleAssignTarget = function(expr) {
    if (expr.type === "ParenthesizedExpression")
      { return this.isSimpleAssignTarget(expr.expression) }
    return expr.type === "Identifier" || expr.type === "MemberExpression"
  };
  
  var pp$1 = Parser.prototype;
  
  // ### Statement parsing
  
  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.
  
  pp$1.parseTopLevel = function(node) {
    var this$1 = this;
  
    var exports = {};
    if (!node.body) { node.body = []; }
    while (this.type !== types.eof) {
      var stmt = this$1.parseStatement(true, true, exports);
      node.body.push(stmt);
    }
    this.adaptDirectivePrologue(node.body);
    this.next();
    if (this.options.ecmaVersion >= 6) {
      node.sourceType = this.options.sourceType;
    }
    return this.finishNode(node, "Program")
  };
  
  var loopLabel = {kind: "loop"};
  var switchLabel = {kind: "switch"};
  
  pp$1.isLet = function() {
    if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
    if (nextCh === 91 || nextCh == 123) { return true } // '{' and '['
    if (isIdentifierStart(nextCh, true)) {
      var pos = next + 1;
      while (isIdentifierChar(this.input.charCodeAt(pos), true)) { ++pos; }
      var ident = this.input.slice(next, pos);
      if (!keywordRelationalOperator.test(ident)) { return true }
    }
    return false
  };
  
  // check 'async [no LineTerminator here] function'
  // - 'async /*foo*/ function' is OK.
  // - 'async /*\n*/ function' is invalid.
  pp$1.isAsyncFunction = function() {
    if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
      { return false }
  
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length;
    return !lineBreak.test(this.input.slice(this.pos, next)) &&
      this.input.slice(next, next + 8) === "function" &&
      (next + 8 == this.input.length || !isIdentifierChar(this.input.charAt(next + 8)))
  };
  
  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo)`, where looking at the previous token
  // does not help.
  
  pp$1.parseStatement = function(declaration, topLevel, exports) {
    var starttype = this.type, node = this.startNode(), kind;
  
    if (this.isLet()) {
      starttype = types._var;
      kind = "let";
    }
  
    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.
  
    switch (starttype) {
    case types._break: case types._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
    case types._debugger: return this.parseDebuggerStatement(node)
    case types._do: return this.parseDoStatement(node)
    case types._for: return this.parseForStatement(node)
    case types._function:
      if (!declaration && this.options.ecmaVersion >= 6) { this.unexpected(); }
      return this.parseFunctionStatement(node, false)
    case types._class:
      if (!declaration) { this.unexpected(); }
      return this.parseClass(node, true)
    case types._if: return this.parseIfStatement(node)
    case types._return: return this.parseReturnStatement(node)
    case types._switch: return this.parseSwitchStatement(node)
    case types._throw: return this.parseThrowStatement(node)
    case types._try: return this.parseTryStatement(node)
    case types._const: case types._var:
      kind = kind || this.value;
      if (!declaration && kind != "var") { this.unexpected(); }
      return this.parseVarStatement(node, kind)
    case types._while: return this.parseWhileStatement(node)
    case types._with: return this.parseWithStatement(node)
    case types.braceL: return this.parseBlock()
    case types.semi: return this.parseEmptyStatement(node)
    case types._export:
    case types._import:
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel)
          { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
        if (!this.inModule)
          { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
      }
      return starttype === types._import ? this.parseImport(node) : this.parseExport(node, exports)
  
      // If the statement does not start with a statement keyword or a
      // brace, it's an ExpressionStatement or LabeledStatement. We
      // simply start parsing an expression, and afterwards, if the
      // next token is a colon and the expression was a simple
      // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction()) {
        if (!declaration) { this.unexpected(); }
        this.next();
        return this.parseFunctionStatement(node, true)
      }
  
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon))
        { return this.parseLabeledStatement(node, maybeName, expr) }
      else { return this.parseExpressionStatement(node, expr) }
    }
  };
  
  pp$1.parseBreakContinueStatement = function(node, keyword) {
    var this$1 = this;
  
    var isBreak = keyword == "break";
    this.next();
    if (this.eat(types.semi) || this.insertSemicolon()) { node.label = null; }
    else if (this.type !== types.name) { this.unexpected(); }
    else {
      node.label = this.parseIdent();
      this.semicolon();
    }
  
    // Verify that there is an actual destination to break or
    // continue to.
    var i = 0;
    for (; i < this.labels.length; ++i) {
      var lab = this$1.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
        if (node.label && isBreak) { break }
      }
    }
    if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
  };
  
  pp$1.parseDebuggerStatement = function(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement")
  };
  
  pp$1.parseDoStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    node.body = this.parseStatement(false);
    this.labels.pop();
    this.expect(types._while);
    node.test = this.parseParenExpression();
    if (this.options.ecmaVersion >= 6)
      { this.eat(types.semi); }
    else
      { this.semicolon(); }
    return this.finishNode(node, "DoWhileStatement")
  };
  
  // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
  // loop is non-trivial. Basically, we have to parse the init `var`
  // statement or expression, disallowing the `in` operator (see
  // the second parameter to `parseExpression`), and then check
  // whether the next token is `in` or `of`. When there is no init
  // part (semicolon immediately after the opening parenthesis), it
  // is a regular `for` loop.
  
  pp$1.parseForStatement = function(node) {
    this.next();
    var awaitAt = (this.options.ecmaVersion >= 9 && this.inAsync && this.eatContextual("await")) ? this.lastTokStart : -1;
    this.labels.push(loopLabel);
    this.enterLexicalScope();
    this.expect(types.parenL);
    if (this.type === types.semi) {
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, null)
    }
    var isLet = this.isLet();
    if (this.type === types._var || this.type === types._const || isLet) {
      var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
      this.next();
      this.parseVar(init$1, true, kind);
      this.finishNode(init$1, "VariableDeclaration");
      if ((this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1 &&
          !(kind !== "var" && init$1.declarations[0].init)) {
        if (this.options.ecmaVersion >= 9) {
          if (this.type === types._in) {
            if (awaitAt > -1) { this.unexpected(awaitAt); }
          } else { node.await = awaitAt > -1; }
        }
        return this.parseForIn(node, init$1)
      }
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, init$1)
    }
    var refDestructuringErrors = new DestructuringErrors;
    var init = this.parseExpression(true, refDestructuringErrors);
    if (this.type === types._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      this.toAssignable(init, false, refDestructuringErrors);
      this.checkLVal(init);
      return this.parseForIn(node, init)
    } else {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init)
  };
  
  pp$1.parseFunctionStatement = function(node, isAsync) {
    this.next();
    return this.parseFunction(node, true, false, isAsync)
  };
  
  pp$1.parseIfStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    // allow function declarations in branches, but only in non-strict mode
    node.consequent = this.parseStatement(!this.strict && this.type == types._function);
    node.alternate = this.eat(types._else) ? this.parseStatement(!this.strict && this.type == types._function) : null;
    return this.finishNode(node, "IfStatement")
  };
  
  pp$1.parseReturnStatement = function(node) {
    if (!this.inFunction && !this.options.allowReturnOutsideFunction)
      { this.raise(this.start, "'return' outside of function"); }
    this.next();
  
    // In `return` (and `break`/`continue`), the keywords with
    // optional arguments, we eagerly look for a semicolon or the
    // possibility to insert one.
  
    if (this.eat(types.semi) || this.insertSemicolon()) { node.argument = null; }
    else { node.argument = this.parseExpression(); this.semicolon(); }
    return this.finishNode(node, "ReturnStatement")
  };
  
  pp$1.parseSwitchStatement = function(node) {
    var this$1 = this;
  
    this.next();
    node.discriminant = this.parseParenExpression();
    node.cases = [];
    this.expect(types.braceL);
    this.labels.push(switchLabel);
    this.enterLexicalScope();
  
    // Statements under must be grouped (by label) in SwitchCase
    // nodes. `cur` is used to keep the node that we are currently
    // adding statements to.
  
    var cur;
    for (var sawDefault = false; this.type != types.braceR;) {
      if (this$1.type === types._case || this$1.type === types._default) {
        var isCase = this$1.type === types._case;
        if (cur) { this$1.finishNode(cur, "SwitchCase"); }
        node.cases.push(cur = this$1.startNode());
        cur.consequent = [];
        this$1.next();
        if (isCase) {
          cur.test = this$1.parseExpression();
        } else {
          if (sawDefault) { this$1.raiseRecoverable(this$1.lastTokStart, "Multiple default clauses"); }
          sawDefault = true;
          cur.test = null;
        }
        this$1.expect(types.colon);
      } else {
        if (!cur) { this$1.unexpected(); }
        cur.consequent.push(this$1.parseStatement(true));
      }
    }
    this.exitLexicalScope();
    if (cur) { this.finishNode(cur, "SwitchCase"); }
    this.next(); // Closing brace
    this.labels.pop();
    return this.finishNode(node, "SwitchStatement")
  };
  
  pp$1.parseThrowStatement = function(node) {
    this.next();
    if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
      { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement")
  };
  
  // Reused empty array added for node fields that are always empty.
  
  var empty = [];
  
  pp$1.parseTryStatement = function(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.type === types._catch) {
      var clause = this.startNode();
      this.next();
      this.expect(types.parenL);
      clause.param = this.parseBindingAtom();
      this.enterLexicalScope();
      this.checkLVal(clause.param, "let");
      this.expect(types.parenR);
      clause.body = this.parseBlock(false);
      this.exitLexicalScope();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(types._finally) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer)
      { this.raise(node.start, "Missing catch or finally clause"); }
    return this.finishNode(node, "TryStatement")
  };
  
  pp$1.parseVarStatement = function(node, kind) {
    this.next();
    this.parseVar(node, false, kind);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration")
  };
  
  pp$1.parseWhileStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    this.labels.push(loopLabel);
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, "WhileStatement")
  };
  
  pp$1.parseWithStatement = function(node) {
    if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
    this.next();
    node.object = this.parseParenExpression();
    node.body = this.parseStatement(false);
    return this.finishNode(node, "WithStatement")
  };
  
  pp$1.parseEmptyStatement = function(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement")
  };
  
  pp$1.parseLabeledStatement = function(node, maybeName, expr) {
    var this$1 = this;
  
    for (var i$1 = 0, list = this$1.labels; i$1 < list.length; i$1 += 1)
      {
      var label = list[i$1];
  
      if (label.name === maybeName)
        { this$1.raise(expr.start, "Label '" + maybeName + "' is already declared");
    } }
    var kind = this.type.isLoop ? "loop" : this.type === types._switch ? "switch" : null;
    for (var i = this.labels.length - 1; i >= 0; i--) {
      var label$1 = this$1.labels[i];
      if (label$1.statementStart == node.start) {
        // Update information about previous labels on this node
        label$1.statementStart = this$1.start;
        label$1.kind = kind;
      } else { break }
    }
    this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
    node.body = this.parseStatement(true);
    if (node.body.type == "ClassDeclaration" ||
        node.body.type == "VariableDeclaration" && node.body.kind != "var" ||
        node.body.type == "FunctionDeclaration" && (this.strict || node.body.generator))
      { this.raiseRecoverable(node.body.start, "Invalid labeled declaration"); }
    this.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement")
  };
  
  pp$1.parseExpressionStatement = function(node, expr) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement")
  };
  
  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).
  
  pp$1.parseBlock = function(createNewLexicalScope) {
    var this$1 = this;
    if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
  
    var node = this.startNode();
    node.body = [];
    this.expect(types.braceL);
    if (createNewLexicalScope) {
      this.enterLexicalScope();
    }
    while (!this.eat(types.braceR)) {
      var stmt = this$1.parseStatement(true);
      node.body.push(stmt);
    }
    if (createNewLexicalScope) {
      this.exitLexicalScope();
    }
    return this.finishNode(node, "BlockStatement")
  };
  
  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.
  
  pp$1.parseFor = function(node, init) {
    node.init = init;
    this.expect(types.semi);
    node.test = this.type === types.semi ? null : this.parseExpression();
    this.expect(types.semi);
    node.update = this.type === types.parenR ? null : this.parseExpression();
    this.expect(types.parenR);
    this.exitLexicalScope();
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, "ForStatement")
  };
  
  // Parse a `for`/`in` and `for`/`of` loop, which are almost
  // same from parser's perspective.
  
  pp$1.parseForIn = function(node, init) {
    var type = this.type === types._in ? "ForInStatement" : "ForOfStatement";
    this.next();
    if (type == "ForInStatement") {
      if (init.type === "AssignmentPattern" ||
        (init.type === "VariableDeclaration" && init.declarations[0].init != null &&
         (this.strict || init.declarations[0].id.type !== "Identifier")))
        { this.raise(init.start, "Invalid assignment in for-in loop head"); }
    }
    node.left = init;
    node.right = type == "ForInStatement" ? this.parseExpression() : this.parseMaybeAssign();
    this.expect(types.parenR);
    this.exitLexicalScope();
    node.body = this.parseStatement(false);
    this.labels.pop();
    return this.finishNode(node, type)
  };
  
  // Parse a list of variable declarations.
  
  pp$1.parseVar = function(node, isFor, kind) {
    var this$1 = this;
  
    node.declarations = [];
    node.kind = kind;
    for (;;) {
      var decl = this$1.startNode();
      this$1.parseVarId(decl, kind);
      if (this$1.eat(types.eq)) {
        decl.init = this$1.parseMaybeAssign(isFor);
      } else if (kind === "const" && !(this$1.type === types._in || (this$1.options.ecmaVersion >= 6 && this$1.isContextual("of")))) {
        this$1.unexpected();
      } else if (decl.id.type != "Identifier" && !(isFor && (this$1.type === types._in || this$1.isContextual("of")))) {
        this$1.raise(this$1.lastTokEnd, "Complex binding patterns require an initialization value");
      } else {
        decl.init = null;
      }
      node.declarations.push(this$1.finishNode(decl, "VariableDeclarator"));
      if (!this$1.eat(types.comma)) { break }
    }
    return node
  };
  
  pp$1.parseVarId = function(decl, kind) {
    decl.id = this.parseBindingAtom(kind);
    this.checkLVal(decl.id, kind, false);
  };
  
  // Parse a function declaration or literal (depending on the
  // `isStatement` parameter).
  
  pp$1.parseFunction = function(node, isStatement, allowExpressionBody, isAsync) {
    this.initFunction(node);
    if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync)
      { node.generator = this.eat(types.star); }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }
  
    if (isStatement) {
      node.id = isStatement === "nullableID" && this.type != types.name ? null : this.parseIdent();
      if (node.id) {
        this.checkLVal(node.id, "var");
      }
    }
  
    var oldInGen = this.inGenerator, oldInAsync = this.inAsync,
        oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldInFunc = this.inFunction;
    this.inGenerator = node.generator;
    this.inAsync = node.async;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.inFunction = true;
    this.enterFunctionScope();
  
    if (!isStatement)
      { node.id = this.type == types.name ? this.parseIdent() : null; }
  
    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody);
  
    this.inGenerator = oldInGen;
    this.inAsync = oldInAsync;
    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.inFunction = oldInFunc;
    return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression")
  };
  
  pp$1.parseFunctionParams = function(node) {
    this.expect(types.parenL);
    node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
  };
  
  // Parse a class declaration or literal (depending on the
  // `isStatement` parameter).
  
  pp$1.parseClass = function(node, isStatement) {
    var this$1 = this;
  
    this.next();
  
    this.parseClassId(node, isStatement);
    this.parseClassSuper(node);
    var classBody = this.startNode();
    var hadConstructor = false;
    classBody.body = [];
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      var member = this$1.parseClassMember(classBody);
      if (member && member.type === "MethodDefinition" && member.kind === "constructor") {
        if (hadConstructor) { this$1.raise(member.start, "Duplicate constructor in the same class"); }
        hadConstructor = true;
      }
    }
    node.body = this.finishNode(classBody, "ClassBody");
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
  };
  
  pp$1.parseClassMember = function(classBody) {
    var this$1 = this;
  
    if (this.eat(types.semi)) { return null }
  
    var method = this.startNode();
    var tryContextual = function (k, noLineBreak) {
      if ( noLineBreak === void 0 ) noLineBreak = false;
  
      var start = this$1.start, startLoc = this$1.startLoc;
      if (!this$1.eatContextual(k)) { return false }
      if (this$1.type !== types.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) { return true }
      if (method.key) { this$1.unexpected(); }
      method.computed = false;
      method.key = this$1.startNodeAt(start, startLoc);
      method.key.name = k;
      this$1.finishNode(method.key, "Identifier");
      return false
    };
  
    method.kind = "method";
    method.static = tryContextual("static");
    var isGenerator = this.eat(types.star);
    var isAsync = false;
    if (!isGenerator) {
      if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
        isAsync = true;
        isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
      } else if (tryContextual("get")) {
        method.kind = "get";
      } else if (tryContextual("set")) {
        method.kind = "set";
      }
    }
    if (!method.key) { this.parsePropertyName(method); }
    var key = method.key;
    if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" ||
        key.type === "Literal" && key.value === "constructor")) {
      if (method.kind !== "method") { this.raise(key.start, "Constructor can't have get/set modifier"); }
      if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
      if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
      method.kind = "constructor";
    } else if (method.static && key.type === "Identifier" && key.name === "prototype") {
      this.raise(key.start, "Classes may not have a static property named prototype");
    }
    this.parseClassMethod(classBody, method, isGenerator, isAsync);
    if (method.kind === "get" && method.value.params.length !== 0)
      { this.raiseRecoverable(method.value.start, "getter should have no params"); }
    if (method.kind === "set" && method.value.params.length !== 1)
      { this.raiseRecoverable(method.value.start, "setter should have exactly one param"); }
    if (method.kind === "set" && method.value.params[0].type === "RestElement")
      { this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params"); }
    return method
  };
  
  pp$1.parseClassMethod = function(classBody, method, isGenerator, isAsync) {
    method.value = this.parseMethod(isGenerator, isAsync);
    classBody.body.push(this.finishNode(method, "MethodDefinition"));
  };
  
  pp$1.parseClassId = function(node, isStatement) {
    node.id = this.type === types.name ? this.parseIdent() : isStatement === true ? this.unexpected() : null;
  };
  
  pp$1.parseClassSuper = function(node) {
    node.superClass = this.eat(types._extends) ? this.parseExprSubscripts() : null;
  };
  
  // Parses module export declaration.
  
  pp$1.parseExport = function(node, exports) {
    var this$1 = this;
  
    this.next();
    // export * from '...'
    if (this.eat(types.star)) {
      this.expectContextual("from");
      if (this.type !== types.string) { this.unexpected(); }
      node.source = this.parseExprAtom();
      this.semicolon();
      return this.finishNode(node, "ExportAllDeclaration")
    }
    if (this.eat(types._default)) { // export default ...
      this.checkExport(exports, "default", this.lastTokStart);
      var isAsync;
      if (this.type === types._function || (isAsync = this.isAsyncFunction())) {
        var fNode = this.startNode();
        this.next();
        if (isAsync) { this.next(); }
        node.declaration = this.parseFunction(fNode, "nullableID", false, isAsync);
      } else if (this.type === types._class) {
        var cNode = this.startNode();
        node.declaration = this.parseClass(cNode, "nullableID");
      } else {
        node.declaration = this.parseMaybeAssign();
        this.semicolon();
      }
      return this.finishNode(node, "ExportDefaultDeclaration")
    }
    // export var|const|let|function|class ...
    if (this.shouldParseExportStatement()) {
      node.declaration = this.parseStatement(true);
      if (node.declaration.type === "VariableDeclaration")
        { this.checkVariableExport(exports, node.declaration.declarations); }
      else
        { this.checkExport(exports, node.declaration.id.name, node.declaration.id.start); }
      node.specifiers = [];
      node.source = null;
    } else { // export { x, y as z } [from '...']
      node.declaration = null;
      node.specifiers = this.parseExportSpecifiers(exports);
      if (this.eatContextual("from")) {
        if (this.type !== types.string) { this.unexpected(); }
        node.source = this.parseExprAtom();
      } else {
        // check for keywords used as local names
        for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
          var spec = list[i];
  
          this$1.checkUnreserved(spec.local);
        }
  
        node.source = null;
      }
      this.semicolon();
    }
    return this.finishNode(node, "ExportNamedDeclaration")
  };
  
  pp$1.checkExport = function(exports, name, pos) {
    if (!exports) { return }
    if (has(exports, name))
      { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
    exports[name] = true;
  };
  
  pp$1.checkPatternExport = function(exports, pat) {
    var this$1 = this;
  
    var type = pat.type;
    if (type == "Identifier")
      { this.checkExport(exports, pat.name, pat.start); }
    else if (type == "ObjectPattern")
      { for (var i = 0, list = pat.properties; i < list.length; i += 1)
        {
          var prop = list[i];
  
          this$1.checkPatternExport(exports, prop);
        } }
    else if (type == "ArrayPattern")
      { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
        var elt = list$1[i$1];
  
          if (elt) { this$1.checkPatternExport(exports, elt); }
      } }
    else if (type == "Property")
      { this.checkPatternExport(exports, pat.value); }
    else if (type == "AssignmentPattern")
      { this.checkPatternExport(exports, pat.left); }
    else if (type == "RestElement")
      { this.checkPatternExport(exports, pat.argument); }
    else if (type == "ParenthesizedExpression")
      { this.checkPatternExport(exports, pat.expression); }
  };
  
  pp$1.checkVariableExport = function(exports, decls) {
    var this$1 = this;
  
    if (!exports) { return }
    for (var i = 0, list = decls; i < list.length; i += 1)
      {
      var decl = list[i];
  
      this$1.checkPatternExport(exports, decl.id);
    }
  };
  
  pp$1.shouldParseExportStatement = function() {
    return this.type.keyword === "var" ||
      this.type.keyword === "const" ||
      this.type.keyword === "class" ||
      this.type.keyword === "function" ||
      this.isLet() ||
      this.isAsyncFunction()
  };
  
  // Parses a comma-separated list of module exports.
  
  pp$1.parseExportSpecifiers = function(exports) {
    var this$1 = this;
  
    var nodes = [], first = true;
    // export { x, y as z } [from '...']
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      if (!first) {
        this$1.expect(types.comma);
        if (this$1.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }
  
      var node = this$1.startNode();
      node.local = this$1.parseIdent(true);
      node.exported = this$1.eatContextual("as") ? this$1.parseIdent(true) : node.local;
      this$1.checkExport(exports, node.exported.name, node.exported.start);
      nodes.push(this$1.finishNode(node, "ExportSpecifier"));
    }
    return nodes
  };
  
  // Parses import declaration.
  
  pp$1.parseImport = function(node) {
    this.next();
    // import '...'
    if (this.type === types.string) {
      node.specifiers = empty;
      node.source = this.parseExprAtom();
    } else {
      node.specifiers = this.parseImportSpecifiers();
      this.expectContextual("from");
      node.source = this.type === types.string ? this.parseExprAtom() : this.unexpected();
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration")
  };
  
  // Parses a comma-separated list of module imports.
  
  pp$1.parseImportSpecifiers = function() {
    var this$1 = this;
  
    var nodes = [], first = true;
    if (this.type === types.name) {
      // import defaultObj, { x, y as z } from '...'
      var node = this.startNode();
      node.local = this.parseIdent();
      this.checkLVal(node.local, "let");
      nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
      if (!this.eat(types.comma)) { return nodes }
    }
    if (this.type === types.star) {
      var node$1 = this.startNode();
      this.next();
      this.expectContextual("as");
      node$1.local = this.parseIdent();
      this.checkLVal(node$1.local, "let");
      nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
      return nodes
    }
    this.expect(types.braceL);
    while (!this.eat(types.braceR)) {
      if (!first) {
        this$1.expect(types.comma);
        if (this$1.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }
  
      var node$2 = this$1.startNode();
      node$2.imported = this$1.parseIdent(true);
      if (this$1.eatContextual("as")) {
        node$2.local = this$1.parseIdent();
      } else {
        this$1.checkUnreserved(node$2.imported);
        node$2.local = node$2.imported;
      }
      this$1.checkLVal(node$2.local, "let");
      nodes.push(this$1.finishNode(node$2, "ImportSpecifier"));
    }
    return nodes
  };
  
  // Set `ExpressionStatement#directive` property for directive prologues.
  pp$1.adaptDirectivePrologue = function(statements) {
    for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
      statements[i].directive = statements[i].expression.raw.slice(1, -1);
    }
  };
  pp$1.isDirectiveCandidate = function(statement) {
    return (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "Literal" &&
      typeof statement.expression.value === "string" &&
      // Reject parenthesized strings.
      (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
    )
  };
  
  var pp$2 = Parser.prototype;
  
  // Convert existing expression atom to assignable pattern
  // if possible.
  
  pp$2.toAssignable = function(node, isBinding, refDestructuringErrors) {
    var this$1 = this;
  
    if (this.options.ecmaVersion >= 6 && node) {
      switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await")
          { this.raise(node.start, "Can not use 'await' as identifier inside an async function"); }
        break
  
      case "ObjectPattern":
      case "ArrayPattern":
      case "RestElement":
        break
  
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];
  
        this$1.toAssignable(prop, isBinding);
          // Early error:
          //   AssignmentRestProperty[Yield, Await] :
          //     `...` DestructuringAssignmentTarget[Yield, Await]
          //
          //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
          if (
            prop.type === "RestElement" &&
            (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
          ) {
            this$1.raise(prop.argument.start, "Unexpected token");
          }
        }
        break
  
      case "Property":
        // AssignmentProperty has type == "Property"
        if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
        this.toAssignable(node.value, isBinding);
        break
  
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        this.toAssignableList(node.elements, isBinding);
        break
  
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern")
          { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
        break
  
      case "AssignmentExpression":
        if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        // falls through to AssignmentPattern
  
      case "AssignmentPattern":
        break
  
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding);
        break
  
      case "MemberExpression":
        if (!isBinding) { break }
  
      default:
        this.raise(node.start, "Assigning to rvalue");
      }
    } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
    return node
  };
  
  // Convert list of expression atoms to binding list.
  
  pp$2.toAssignableList = function(exprList, isBinding) {
    var this$1 = this;
  
    var end = exprList.length;
    for (var i = 0; i < end; i++) {
      var elt = exprList[i];
      if (elt) { this$1.toAssignable(elt, isBinding); }
    }
    if (end) {
      var last = exprList[end - 1];
      if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
        { this.unexpected(last.argument.start); }
    }
    return exprList
  };
  
  // Parses spread element.
  
  pp$2.parseSpread = function(refDestructuringErrors) {
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    return this.finishNode(node, "SpreadElement")
  };
  
  pp$2.parseRestBinding = function() {
    var node = this.startNode();
    this.next();
  
    // RestElement inside of a function parameter must be an identifier
    if (this.options.ecmaVersion === 6 && this.type !== types.name)
      { this.unexpected(); }
  
    node.argument = this.parseBindingAtom();
  
    return this.finishNode(node, "RestElement")
  };
  
  // Parses lvalue (assignable) atom.
  
  pp$2.parseBindingAtom = function() {
    if (this.options.ecmaVersion >= 6) {
      switch (this.type) {
      case types.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern")
  
      case types.braceL:
        return this.parseObj(true)
      }
    }
    return this.parseIdent()
  };
  
  pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
    var this$1 = this;
  
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (first) { first = false; }
      else { this$1.expect(types.comma); }
      if (allowEmpty && this$1.type === types.comma) {
        elts.push(null);
      } else if (allowTrailingComma && this$1.afterTrailingComma(close)) {
        break
      } else if (this$1.type === types.ellipsis) {
        var rest = this$1.parseRestBinding();
        this$1.parseBindingListItem(rest);
        elts.push(rest);
        if (this$1.type === types.comma) { this$1.raise(this$1.start, "Comma is not permitted after the rest element"); }
        this$1.expect(close);
        break
      } else {
        var elem = this$1.parseMaybeDefault(this$1.start, this$1.startLoc);
        this$1.parseBindingListItem(elem);
        elts.push(elem);
      }
    }
    return elts
  };
  
  pp$2.parseBindingListItem = function(param) {
    return param
  };
  
  // Parses assignment pattern around given atom if possible.
  
  pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
    left = left || this.parseBindingAtom();
    if (this.options.ecmaVersion < 6 || !this.eat(types.eq)) { return left }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssign();
    return this.finishNode(node, "AssignmentPattern")
  };
  
  // Verify that a node is an lval — something that can be assigned
  // to.
  // bindingType can be either:
  // 'var' indicating that the lval creates a 'var' binding
  // 'let' indicating that the lval creates a lexical ('let' or 'const') binding
  // 'none' indicating that the binding should be checked for illegal identifiers, but not for duplicate references
  
  pp$2.checkLVal = function(expr, bindingType, checkClashes) {
    var this$1 = this;
  
    switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name))
        { this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
      if (checkClashes) {
        if (has(checkClashes, expr.name))
          { this.raiseRecoverable(expr.start, "Argument name clash"); }
        checkClashes[expr.name] = true;
      }
      if (bindingType && bindingType !== "none") {
        if (
          bindingType === "var" && !this.canDeclareVarName(expr.name) ||
          bindingType !== "var" && !this.canDeclareLexicalName(expr.name)
        ) {
          this.raiseRecoverable(expr.start, ("Identifier '" + (expr.name) + "' has already been declared"));
        }
        if (bindingType === "var") {
          this.declareVarName(expr.name);
        } else {
          this.declareLexicalName(expr.name);
        }
      }
      break
  
    case "MemberExpression":
      if (bindingType) { this.raiseRecoverable(expr.start, "Binding member expression"); }
      break
  
    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1)
        {
      var prop = list[i];
  
      this$1.checkLVal(prop, bindingType, checkClashes);
    }
      break
  
    case "Property":
      // AssignmentProperty has type == "Property"
      this.checkLVal(expr.value, bindingType, checkClashes);
      break
  
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
  
      if (elem) { this$1.checkLVal(elem, bindingType, checkClashes); }
      }
      break
  
    case "AssignmentPattern":
      this.checkLVal(expr.left, bindingType, checkClashes);
      break
  
    case "RestElement":
      this.checkLVal(expr.argument, bindingType, checkClashes);
      break
  
    case "ParenthesizedExpression":
      this.checkLVal(expr.expression, bindingType, checkClashes);
      break
  
    default:
      this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
    }
  };
  
  // A recursive descent parser operates by defining functions for all
  // syntactic elements, and recursively calling those, each function
  // advancing the input stream and returning an AST node. Precedence
  // of constructs (for example, the fact that `!x[1]` means `!(x[1])`
  // instead of `(!x)[1]` is handled by the fact that the parser
  // function that parses unary prefix operators is called first, and
  // in turn calls the function that parses `[]` subscripts — that
  // way, it'll receive the node for `x[1]` already parsed, and wraps
  // *that* in the unary operator node.
  //
  // Acorn uses an [operator precedence parser][opp] to handle binary
  // operator precedence, because it is much more compact than using
  // the technique outlined above, which uses different, nesting
  // functions to specify precedence, for all of the ten binary
  // precedence levels that JavaScript defines.
  //
  // [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser
  
  var pp$3 = Parser.prototype;
  
  // Check if property name clashes with already added.
  // Object/class getters and setters are not allowed to clash —
  // either with each other or with an init property — and in
  // strict mode, init properties are also not allowed to be repeated.
  
  pp$3.checkPropClash = function(prop, propHash, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
      { return }
    if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
      { return }
    var key = prop.key;
    var name;
    switch (key.type) {
    case "Identifier": name = key.name; break
    case "Literal": name = String(key.value); break
    default: return
    }
    var kind = prop.kind;
    if (this.options.ecmaVersion >= 6) {
      if (name === "__proto__" && kind === "init") {
        if (propHash.proto) {
          if (refDestructuringErrors && refDestructuringErrors.doubleProto < 0) { refDestructuringErrors.doubleProto = key.start; }
          // Backwards-compat kludge. Can be removed in version 6.0
          else { this.raiseRecoverable(key.start, "Redefinition of __proto__ property"); }
        }
        propHash.proto = true;
      }
      return
    }
    name = "$" + name;
    var other = propHash[name];
    if (other) {
      var redefinition;
      if (kind === "init") {
        redefinition = this.strict && other.init || other.get || other.set;
      } else {
        redefinition = other.init || other[kind];
      }
      if (redefinition)
        { this.raiseRecoverable(key.start, "Redefinition of property"); }
    } else {
      other = propHash[name] = {
        init: false,
        get: false,
        set: false
      };
    }
    other[kind] = true;
  };
  
  // ### Expression parsing
  
  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function(s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.
  
  // Parse a full expression. The optional arguments are used to
  // forbid the `in` operator (in for loops initalization expressions)
  // and provide reference for storing '=' operator inside shorthand
  // property assignment in contexts where both object expression
  // and object pattern might appear (so it's possible to raise
  // delayed syntax error at correct position).
  
  pp$3.parseExpression = function(noIn, refDestructuringErrors) {
    var this$1 = this;
  
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
    if (this.type === types.comma) {
      var node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this.eat(types.comma)) { node.expressions.push(this$1.parseMaybeAssign(noIn, refDestructuringErrors)); }
      return this.finishNode(node, "SequenceExpression")
    }
    return expr
  };
  
  // Parse an assignment expression. This includes applications of
  // operators like `+=`.
  
  pp$3.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
    if (this.inGenerator && this.isContextual("yield")) { return this.parseYield() }
  
    var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1;
    if (refDestructuringErrors) {
      oldParenAssign = refDestructuringErrors.parenthesizedAssign;
      oldTrailingComma = refDestructuringErrors.trailingComma;
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
    } else {
      refDestructuringErrors = new DestructuringErrors;
      ownDestructuringErrors = true;
    }
  
    var startPos = this.start, startLoc = this.startLoc;
    if (this.type == types.parenL || this.type == types.name)
      { this.potentialArrowAt = this.start; }
    var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
    if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
    if (this.type.isAssign) {
      var node = this.startNodeAt(startPos, startLoc);
      node.operator = this.value;
      node.left = this.type === types.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
      if (!ownDestructuringErrors) { DestructuringErrors.call(refDestructuringErrors); }
      refDestructuringErrors.shorthandAssign = -1; // reset because shorthand default was used correctly
      this.checkLVal(left);
      this.next();
      node.right = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "AssignmentExpression")
    } else {
      if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
    }
    if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
    if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
    return left
  };
  
  // Parse a ternary conditional (`?:`) operator.
  
  pp$3.parseMaybeConditional = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprOps(noIn, refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    if (this.eat(types.question)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssign();
      this.expect(types.colon);
      node.alternate = this.parseMaybeAssign(noIn);
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  };
  
  // Start the precedence parser.
  
  pp$3.parseExprOps = function(noIn, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeUnary(refDestructuringErrors, false);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    return expr.start == startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn)
  };
  
  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.
  
  pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
    var prec = this.type.binop;
    if (prec != null && (!noIn || this.type !== types._in)) {
      if (prec > minPrec) {
        var logical = this.type === types.logicalOR || this.type === types.logicalAND;
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc;
        var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
        var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical);
        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn)
      }
    }
    return left
  };
  
  pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.operator = op;
    node.right = right;
    return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
  };
  
  // Parse unary operators, both prefix and postfix.
  
  pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
    var this$1 = this;
  
    var startPos = this.start, startLoc = this.startLoc, expr;
    if (this.inAsync && this.isContextual("await")) {
      expr = this.parseAwait();
      sawUnary = true;
    } else if (this.type.prefix) {
      var node = this.startNode(), update = this.type === types.incDec;
      node.operator = this.value;
      node.prefix = true;
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refDestructuringErrors, true);
      if (update) { this.checkLVal(node.argument); }
      else if (this.strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
      else { sawUnary = true; }
      expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    } else {
      expr = this.parseExprSubscripts(refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
      while (this.type.postfix && !this.canInsertSemicolon()) {
        var node$1 = this$1.startNodeAt(startPos, startLoc);
        node$1.operator = this$1.value;
        node$1.prefix = false;
        node$1.argument = expr;
        this$1.checkLVal(expr);
        this$1.next();
        expr = this$1.finishNode(node$1, "UpdateExpression");
      }
    }
  
    if (!sawUnary && this.eat(types.starstar))
      { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false) }
    else
      { return expr }
  };
  
  // Parse call, dot, and `[]`-subscript expressions.
  
  pp$3.parseExprSubscripts = function(refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprAtom(refDestructuringErrors);
    var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
    if (this.checkExpressionErrors(refDestructuringErrors) || skipArrowSubscripts) { return expr }
    var result = this.parseSubscripts(expr, startPos, startLoc);
    if (refDestructuringErrors && result.type === "MemberExpression") {
      if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
      if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
    }
    return result
  };
  
  pp$3.parseSubscripts = function(base, startPos, startLoc, noCalls) {
    var this$1 = this;
  
    var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
        this.lastTokEnd == base.end && !this.canInsertSemicolon() && this.input.slice(base.start, base.end) === "async";
    for (var computed = (void 0);;) {
      if ((computed = this$1.eat(types.bracketL)) || this$1.eat(types.dot)) {
        var node = this$1.startNodeAt(startPos, startLoc);
        node.object = base;
        node.property = computed ? this$1.parseExpression() : this$1.parseIdent(true);
        node.computed = !!computed;
        if (computed) { this$1.expect(types.bracketR); }
        base = this$1.finishNode(node, "MemberExpression");
      } else if (!noCalls && this$1.eat(types.parenL)) {
        var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this$1.yieldPos, oldAwaitPos = this$1.awaitPos;
        this$1.yieldPos = 0;
        this$1.awaitPos = 0;
        var exprList = this$1.parseExprList(types.parenR, this$1.options.ecmaVersion >= 8, false, refDestructuringErrors);
        if (maybeAsyncArrow && !this$1.canInsertSemicolon() && this$1.eat(types.arrow)) {
          this$1.checkPatternErrors(refDestructuringErrors, false);
          this$1.checkYieldAwaitInDefaultParams();
          this$1.yieldPos = oldYieldPos;
          this$1.awaitPos = oldAwaitPos;
          return this$1.parseArrowExpression(this$1.startNodeAt(startPos, startLoc), exprList, true)
        }
        this$1.checkExpressionErrors(refDestructuringErrors, true);
        this$1.yieldPos = oldYieldPos || this$1.yieldPos;
        this$1.awaitPos = oldAwaitPos || this$1.awaitPos;
        var node$1 = this$1.startNodeAt(startPos, startLoc);
        node$1.callee = base;
        node$1.arguments = exprList;
        base = this$1.finishNode(node$1, "CallExpression");
      } else if (this$1.type === types.backQuote) {
        var node$2 = this$1.startNodeAt(startPos, startLoc);
        node$2.tag = base;
        node$2.quasi = this$1.parseTemplate({isTagged: true});
        base = this$1.finishNode(node$2, "TaggedTemplateExpression");
      } else {
        return base
      }
    }
  };
  
  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.
  
  pp$3.parseExprAtom = function(refDestructuringErrors) {
    var node, canBeArrow = this.potentialArrowAt == this.start;
    switch (this.type) {
    case types._super:
      if (!this.inFunction)
        { this.raise(this.start, "'super' outside of function or class"); }
      node = this.startNode();
      this.next();
      // The `super` keyword can appear at below:
      // SuperProperty:
      //     super [ Expression ]
      //     super . IdentifierName
      // SuperCall:
      //     super Arguments
      if (this.type !== types.dot && this.type !== types.bracketL && this.type !== types.parenL)
        { this.unexpected(); }
      return this.finishNode(node, "Super")
  
    case types._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression")
  
    case types.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(this.type !== types.name);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types._function))
        { return this.parseFunction(this.startNodeAt(startPos, startLoc), false, false, true) }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types.arrow))
          { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false) }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types.name && !containsEsc) {
          id = this.parseIdent();
          if (this.canInsertSemicolon() || !this.eat(types.arrow))
            { this.unexpected(); }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true)
        }
      }
      return id
  
    case types.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {pattern: value.pattern, flags: value.flags};
      return node
  
    case types.num: case types.string:
      return this.parseLiteral(this.value)
  
    case types._null: case types._true: case types._false:
      node = this.startNode();
      node.value = this.type === types._null ? null : this.type === types._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal")
  
    case types.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
          { refDestructuringErrors.parenthesizedAssign = start; }
        if (refDestructuringErrors.parenthesizedBind < 0)
          { refDestructuringErrors.parenthesizedBind = start; }
      }
      return expr
  
    case types.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression")
  
    case types.braceL:
      return this.parseObj(false, refDestructuringErrors)
  
    case types._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, false)
  
    case types._class:
      return this.parseClass(this.startNode(), false)
  
    case types._new:
      return this.parseNew()
  
    case types.backQuote:
      return this.parseTemplate()
  
    default:
      this.unexpected();
    }
  };
  
  pp$3.parseLiteral = function(value) {
    var node = this.startNode();
    node.value = value;
    node.raw = this.input.slice(this.start, this.end);
    this.next();
    return this.finishNode(node, "Literal")
  };
  
  pp$3.parseParenExpression = function() {
    this.expect(types.parenL);
    var val = this.parseExpression();
    this.expect(types.parenR);
    return val
  };
  
  pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
    var this$1 = this;
  
    var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
    if (this.options.ecmaVersion >= 6) {
      this.next();
  
      var innerStartPos = this.start, innerStartLoc = this.startLoc;
      var exprList = [], first = true, lastIsComma = false;
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
      this.yieldPos = 0;
      this.awaitPos = 0;
      while (this.type !== types.parenR) {
        first ? first = false : this$1.expect(types.comma);
        if (allowTrailingComma && this$1.afterTrailingComma(types.parenR, true)) {
          lastIsComma = true;
          break
        } else if (this$1.type === types.ellipsis) {
          spreadStart = this$1.start;
          exprList.push(this$1.parseParenItem(this$1.parseRestBinding()));
          if (this$1.type === types.comma) { this$1.raise(this$1.start, "Comma is not permitted after the rest element"); }
          break
        } else {
          exprList.push(this$1.parseMaybeAssign(false, refDestructuringErrors, this$1.parseParenItem));
        }
      }
      var innerEndPos = this.start, innerEndLoc = this.startLoc;
      this.expect(types.parenR);
  
      if (canBeArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        return this.parseParenArrowList(startPos, startLoc, exprList)
      }
  
      if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
      if (spreadStart) { this.unexpected(spreadStart); }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;
  
      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }
    } else {
      val = this.parseParenExpression();
    }
  
    if (this.options.preserveParens) {
      var par = this.startNodeAt(startPos, startLoc);
      par.expression = val;
      return this.finishNode(par, "ParenthesizedExpression")
    } else {
      return val
    }
  };
  
  pp$3.parseParenItem = function(item) {
    return item
  };
  
  pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList)
  };
  
  // New's precedence is slightly tricky. It must allow its argument to
  // be a `[]` or dot subscript expression, but not a call — at least,
  // not without wrapping it in parentheses. Thus, it uses the noCalls
  // argument to parseSubscripts to prevent it from consuming the
  // argument list.
  
  var empty$1 = [];
  
  pp$3.parseNew = function() {
    var node = this.startNode();
    var meta = this.parseIdent(true);
    if (this.options.ecmaVersion >= 6 && this.eat(types.dot)) {
      node.meta = meta;
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "target" || containsEsc)
        { this.raiseRecoverable(node.property.start, "The only valid meta property for new is new.target"); }
      if (!this.inFunction)
        { this.raiseRecoverable(node.start, "new.target can only be used in functions"); }
      return this.finishNode(node, "MetaProperty")
    }
    var startPos = this.start, startLoc = this.startLoc;
    node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
    if (this.eat(types.parenL)) { node.arguments = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false); }
    else { node.arguments = empty$1; }
    return this.finishNode(node, "NewExpression")
  };
  
  // Parse template expression.
  
  pp$3.parseTemplateElement = function(ref) {
    var isTagged = ref.isTagged;
  
    var elem = this.startNode();
    if (this.type === types.invalidTemplate) {
      if (!isTagged) {
        this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
      }
      elem.value = {
        raw: this.value,
        cooked: null
      };
    } else {
      elem.value = {
        raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
        cooked: this.value
      };
    }
    this.next();
    elem.tail = this.type === types.backQuote;
    return this.finishNode(elem, "TemplateElement")
  };
  
  pp$3.parseTemplate = function(ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;
  
    var node = this.startNode();
    this.next();
    node.expressions = [];
    var curElt = this.parseTemplateElement({isTagged: isTagged});
    node.quasis = [curElt];
    while (!curElt.tail) {
      this$1.expect(types.dollarBraceL);
      node.expressions.push(this$1.parseExpression());
      this$1.expect(types.braceR);
      node.quasis.push(curElt = this$1.parseTemplateElement({isTagged: isTagged}));
    }
    this.next();
    return this.finishNode(node, "TemplateLiteral")
  };
  
  pp$3.isAsyncProp = function(prop) {
    return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
      (this.type === types.name || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types.star)) &&
      !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };
  
  // Parse an object literal or binding pattern.
  
  pp$3.parseObj = function(isPattern, refDestructuringErrors) {
    var this$1 = this;
  
    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this.eat(types.braceR)) {
      if (!first) {
        this$1.expect(types.comma);
        if (this$1.afterTrailingComma(types.braceR)) { break }
      } else { first = false; }
  
      var prop = this$1.parseProperty(isPattern, refDestructuringErrors);
      if (!isPattern) { this$1.checkPropClash(prop, propHash, refDestructuringErrors); }
      node.properties.push(prop);
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  };
  
  pp$3.parseProperty = function(isPattern, refDestructuringErrors) {
    var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
    if (this.options.ecmaVersion >= 9 && this.eat(types.ellipsis)) {
      if (isPattern) {
        prop.argument = this.parseIdent(false);
        if (this.type === types.comma) {
          this.raise(this.start, "Comma is not permitted after the rest element");
        }
        return this.finishNode(prop, "RestElement")
      }
      // To disallow parenthesized identifier via `this.toAssignable()`.
      if (this.type === types.parenL && refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0) {
          refDestructuringErrors.parenthesizedAssign = this.start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = this.start;
        }
      }
      // Parse argument.
      prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      // To disallow trailing comma via `this.toAssignable()`.
      if (this.type === types.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
      // Finish
      return this.finishNode(prop, "SpreadElement")
    }
    if (this.options.ecmaVersion >= 6) {
      prop.method = false;
      prop.shorthand = false;
      if (isPattern || refDestructuringErrors) {
        startPos = this.start;
        startLoc = this.startLoc;
      }
      if (!isPattern)
        { isGenerator = this.eat(types.star); }
    }
    var containsEsc = this.containsEsc;
    this.parsePropertyName(prop);
    if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
      this.parsePropertyName(prop, refDestructuringErrors);
    } else {
      isAsync = false;
    }
    this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
    return this.finishNode(prop, "Property")
  };
  
  pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
    if ((isGenerator || isAsync) && this.type === types.colon)
      { this.unexpected(); }
  
    if (this.eat(types.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
      prop.kind = "init";
    } else if (this.options.ecmaVersion >= 6 && this.type === types.parenL) {
      if (isPattern) { this.unexpected(); }
      prop.kind = "init";
      prop.method = true;
      prop.value = this.parseMethod(isGenerator, isAsync);
    } else if (!isPattern && !containsEsc &&
               this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
               (prop.key.name === "get" || prop.key.name === "set") &&
               (this.type != types.comma && this.type != types.braceR)) {
      if (isGenerator || isAsync) { this.unexpected(); }
      prop.kind = prop.key.name;
      this.parsePropertyName(prop);
      prop.value = this.parseMethod(false);
      var paramCount = prop.kind === "get" ? 0 : 1;
      if (prop.value.params.length !== paramCount) {
        var start = prop.value.start;
        if (prop.kind === "get")
          { this.raiseRecoverable(start, "getter should have no params"); }
        else
          { this.raiseRecoverable(start, "setter should have exactly one param"); }
      } else {
        if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
          { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
      }
    } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
      this.checkUnreserved(prop.key);
      prop.kind = "init";
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else if (this.type === types.eq && refDestructuringErrors) {
        if (refDestructuringErrors.shorthandAssign < 0)
          { refDestructuringErrors.shorthandAssign = this.start; }
        prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
      } else {
        prop.value = prop.key;
      }
      prop.shorthand = true;
    } else { this.unexpected(); }
  };
  
  pp$3.parsePropertyName = function(prop) {
    if (this.options.ecmaVersion >= 6) {
      if (this.eat(types.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssign();
        this.expect(types.bracketR);
        return prop.key
      } else {
        prop.computed = false;
      }
    }
    return prop.key = this.type === types.num || this.type === types.string ? this.parseExprAtom() : this.parseIdent(true)
  };
  
  // Initialize empty function node.
  
  pp$3.initFunction = function(node) {
    node.id = null;
    if (this.options.ecmaVersion >= 6) {
      node.generator = false;
      node.expression = false;
    }
    if (this.options.ecmaVersion >= 8)
      { node.async = false; }
  };
  
  // Parse object or class method.
  
  pp$3.parseMethod = function(isGenerator, isAsync) {
    var node = this.startNode(), oldInGen = this.inGenerator, oldInAsync = this.inAsync,
        oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldInFunc = this.inFunction;
  
    this.initFunction(node);
    if (this.options.ecmaVersion >= 6)
      { node.generator = isGenerator; }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }
  
    this.inGenerator = node.generator;
    this.inAsync = node.async;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.inFunction = true;
    this.enterFunctionScope();
  
    this.expect(types.parenL);
    node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
    this.parseFunctionBody(node, false);
  
    this.inGenerator = oldInGen;
    this.inAsync = oldInAsync;
    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.inFunction = oldInFunc;
    return this.finishNode(node, "FunctionExpression")
  };
  
  // Parse arrow function expression with given parameters.
  
  pp$3.parseArrowExpression = function(node, params, isAsync) {
    var oldInGen = this.inGenerator, oldInAsync = this.inAsync,
        oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldInFunc = this.inFunction;
  
    this.enterFunctionScope();
    this.initFunction(node);
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }
  
    this.inGenerator = false;
    this.inAsync = node.async;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.inFunction = true;
  
    node.params = this.toAssignableList(params, true);
    this.parseFunctionBody(node, true);
  
    this.inGenerator = oldInGen;
    this.inAsync = oldInAsync;
    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.inFunction = oldInFunc;
    return this.finishNode(node, "ArrowFunctionExpression")
  };
  
  // Parse function body and check parameters.
  
  pp$3.parseFunctionBody = function(node, isArrowFunction) {
    var isExpression = isArrowFunction && this.type !== types.braceL;
    var oldStrict = this.strict, useStrict = false;
  
    if (isExpression) {
      node.body = this.parseMaybeAssign();
      node.expression = true;
      this.checkParams(node, false);
    } else {
      var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
      if (!oldStrict || nonSimple) {
        useStrict = this.strictDirective(this.end);
        // If this is a strict mode function, verify that argument names
        // are not repeated, and it does not try to bind the words `eval`
        // or `arguments`.
        if (useStrict && nonSimple)
          { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
      }
      // Start a new scope with regard to labels and the `inFunction`
      // flag (restore them to their old value afterwards).
      var oldLabels = this.labels;
      this.labels = [];
      if (useStrict) { this.strict = true; }
  
      // Add the params to varDeclaredNames to ensure that an error is thrown
      // if a let/const declaration in the function clashes with one of the params.
      this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && this.isSimpleParamList(node.params));
      node.body = this.parseBlock(false);
      node.expression = false;
      this.adaptDirectivePrologue(node.body.body);
      this.labels = oldLabels;
    }
    this.exitFunctionScope();
  
    if (this.strict && node.id) {
      // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
      this.checkLVal(node.id, "none");
    }
    this.strict = oldStrict;
  };
  
  pp$3.isSimpleParamList = function(params) {
    for (var i = 0, list = params; i < list.length; i += 1)
      {
      var param = list[i];
  
      if (param.type !== "Identifier") { return false
    } }
    return true
  };
  
  // Checks function params for various disallowed patterns such as using "eval"
  // or "arguments" and duplicate parameters.
  
  pp$3.checkParams = function(node, allowDuplicates) {
    var this$1 = this;
  
    var nameHash = {};
    for (var i = 0, list = node.params; i < list.length; i += 1)
      {
      var param = list[i];
  
      this$1.checkLVal(param, "var", allowDuplicates ? null : nameHash);
    }
  };
  
  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).
  
  pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
    var this$1 = this;
  
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (!first) {
        this$1.expect(types.comma);
        if (allowTrailingComma && this$1.afterTrailingComma(close)) { break }
      } else { first = false; }
  
      var elt = (void 0);
      if (allowEmpty && this$1.type === types.comma)
        { elt = null; }
      else if (this$1.type === types.ellipsis) {
        elt = this$1.parseSpread(refDestructuringErrors);
        if (refDestructuringErrors && this$1.type === types.comma && refDestructuringErrors.trailingComma < 0)
          { refDestructuringErrors.trailingComma = this$1.start; }
      } else {
        elt = this$1.parseMaybeAssign(false, refDestructuringErrors);
      }
      elts.push(elt);
    }
    return elts
  };
  
  pp$3.checkUnreserved = function(ref) {
    var start = ref.start;
    var end = ref.end;
    var name = ref.name;
  
    if (this.inGenerator && name === "yield")
      { this.raiseRecoverable(start, "Can not use 'yield' as identifier inside a generator"); }
    if (this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Can not use 'await' as identifier inside an async function"); }
    if (this.isKeyword(name))
      { this.raise(start, ("Unexpected keyword '" + name + "'")); }
    if (this.options.ecmaVersion < 6 &&
      this.input.slice(start, end).indexOf("\\") != -1) { return }
    var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
    if (re.test(name)) {
      if (!this.inAsync && name === "await")
        { this.raiseRecoverable(start, "Can not use keyword 'await' outside an async function"); }
      this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
    }
  };
  
  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.
  
  pp$3.parseIdent = function(liberal, isBinding) {
    var node = this.startNode();
    if (liberal && this.options.allowReserved == "never") { liberal = false; }
    if (this.type === types.name) {
      node.name = this.value;
    } else if (this.type.keyword) {
      node.name = this.type.keyword;
  
      // To fix https://github.com/acornjs/acorn/issues/575
      // `class` and `function` keywords push new context into this.context.
      // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
      // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
      if ((node.name === "class" || node.name === "function") &&
          (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
        this.context.pop();
      }
    } else {
      this.unexpected();
    }
    this.next();
    this.finishNode(node, "Identifier");
    if (!liberal) { this.checkUnreserved(node); }
    return node
  };
  
  // Parses yield expression inside generator.
  
  pp$3.parseYield = function() {
    if (!this.yieldPos) { this.yieldPos = this.start; }
  
    var node = this.startNode();
    this.next();
    if (this.type == types.semi || this.canInsertSemicolon() || (this.type != types.star && !this.type.startsExpr)) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(types.star);
      node.argument = this.parseMaybeAssign();
    }
    return this.finishNode(node, "YieldExpression")
  };
  
  pp$3.parseAwait = function() {
    if (!this.awaitPos) { this.awaitPos = this.start; }
  
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeUnary(null, true);
    return this.finishNode(node, "AwaitExpression")
  };
  
  var pp$4 = Parser.prototype;
  
  // This function is used to raise exceptions on parse errors. It
  // takes an offset integer (into the current `input`) to indicate
  // the location of the error, attaches the position to the end
  // of the error message, and then raises a `SyntaxError` with that
  // message.
  
  pp$4.raise = function(pos, message) {
    var loc = getLineInfo(this.input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    throw err
  };
  
  pp$4.raiseRecoverable = pp$4.raise;
  
  pp$4.curPosition = function() {
    if (this.options.locations) {
      return new Position(this.curLine, this.pos - this.lineStart)
    }
  };
  
  var pp$5 = Parser.prototype;
  
  // Object.assign polyfill
  var assign = Object.assign || function(target) {
    var sources = [], len = arguments.length - 1;
    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];
  
    for (var i = 0, list = sources; i < list.length; i += 1) {
      var source = list[i];
  
      for (var key in source) {
        if (has(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target
  };
  
  // The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.
  
  pp$5.enterFunctionScope = function() {
    // var: a hash of var-declared names in the current lexical scope
    // lexical: a hash of lexically-declared names in the current lexical scope
    // childVar: a hash of var-declared names in all child lexical scopes of the current lexical scope (within the current function scope)
    // parentLexical: a hash of lexically-declared names in all parent lexical scopes of the current lexical scope (within the current function scope)
    this.scopeStack.push({var: {}, lexical: {}, childVar: {}, parentLexical: {}});
  };
  
  pp$5.exitFunctionScope = function() {
    this.scopeStack.pop();
  };
  
  pp$5.enterLexicalScope = function() {
    var parentScope = this.scopeStack[this.scopeStack.length - 1];
    var childScope = {var: {}, lexical: {}, childVar: {}, parentLexical: {}};
  
    this.scopeStack.push(childScope);
    assign(childScope.parentLexical, parentScope.lexical, parentScope.parentLexical);
  };
  
  pp$5.exitLexicalScope = function() {
    var childScope = this.scopeStack.pop();
    var parentScope = this.scopeStack[this.scopeStack.length - 1];
  
    assign(parentScope.childVar, childScope.var, childScope.childVar);
  };
  
  /**
   * A name can be declared with `var` if there are no variables with the same name declared with `let`/`const`
   * in the current lexical scope or any of the parent lexical scopes in this function.
   */
  pp$5.canDeclareVarName = function(name) {
    var currentScope = this.scopeStack[this.scopeStack.length - 1];
  
    return !has(currentScope.lexical, name) && !has(currentScope.parentLexical, name)
  };
  
  /**
   * A name can be declared with `let`/`const` if there are no variables with the same name declared with `let`/`const`
   * in the current scope, and there are no variables with the same name declared with `var` in the current scope or in
   * any child lexical scopes in this function.
   */
  pp$5.canDeclareLexicalName = function(name) {
    var currentScope = this.scopeStack[this.scopeStack.length - 1];
  
    return !has(currentScope.lexical, name) && !has(currentScope.var, name) && !has(currentScope.childVar, name)
  };
  
  pp$5.declareVarName = function(name) {
    this.scopeStack[this.scopeStack.length - 1].var[name] = true;
  };
  
  pp$5.declareLexicalName = function(name) {
    this.scopeStack[this.scopeStack.length - 1].lexical[name] = true;
  };
  
  var Node = function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    if (parser.options.locations)
      { this.loc = new SourceLocation(parser, loc); }
    if (parser.options.directSourceFile)
      { this.sourceFile = parser.options.directSourceFile; }
    if (parser.options.ranges)
      { this.range = [pos, 0]; }
  };
  
  // Start an AST node, attaching a start offset.
  
  var pp$6 = Parser.prototype;
  
  pp$6.startNode = function() {
    return new Node(this, this.start, this.startLoc)
  };
  
  pp$6.startNodeAt = function(pos, loc) {
    return new Node(this, pos, loc)
  };
  
  // Finish an AST node, adding `type` and `end` properties.
  
  function finishNodeAt(node, type, pos, loc) {
    node.type = type;
    node.end = pos;
    if (this.options.locations)
      { node.loc.end = loc; }
    if (this.options.ranges)
      { node.range[1] = pos; }
    return node
  }
  
  pp$6.finishNode = function(node, type) {
    return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
  };
  
  // Finish node at given position
  
  pp$6.finishNodeAt = function(node, type, pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
  };
  
  // The algorithm used to determine whether a regexp can appear at a
  // given point in the program is loosely based on sweet.js' approach.
  // See https://github.com/mozilla/sweet.js/wiki/design
  
  var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
    this.override = override;
    this.generator = !!generator;
  };
  
  var types$1 = {
    b_stat: new TokContext("{", false),
    b_expr: new TokContext("{", true),
    b_tmpl: new TokContext("${", false),
    p_stat: new TokContext("(", false),
    p_expr: new TokContext("(", true),
    q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
    f_stat: new TokContext("function", false),
    f_expr: new TokContext("function", true),
    f_expr_gen: new TokContext("function", true, false, null, true),
    f_gen: new TokContext("function", false, false, null, true)
  };
  
  var pp$7 = Parser.prototype;
  
  pp$7.initialContext = function() {
    return [types$1.b_stat]
  };
  
  pp$7.braceIsBlock = function(prevType) {
    var parent = this.curContext();
    if (parent === types$1.f_expr || parent === types$1.f_stat)
      { return true }
    if (prevType === types.colon && (parent === types$1.b_stat || parent === types$1.b_expr))
      { return !parent.isExpr }
  
    // The check for `tt.name && exprAllowed` detects whether we are
    // after a `yield` or `of` construct. See the `updateContext` for
    // `tt.name`.
    if (prevType === types._return || prevType == types.name && this.exprAllowed)
      { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
    if (prevType === types._else || prevType === types.semi || prevType === types.eof || prevType === types.parenR || prevType == types.arrow)
      { return true }
    if (prevType == types.braceL)
      { return parent === types$1.b_stat }
    if (prevType == types._var || prevType == types.name)
      { return false }
    return !this.exprAllowed
  };
  
  pp$7.inGeneratorContext = function() {
    var this$1 = this;
  
    for (var i = this.context.length - 1; i >= 1; i--) {
      var context = this$1.context[i];
      if (context.token === "function")
        { return context.generator }
    }
    return false
  };
  
  pp$7.updateContext = function(prevType) {
    var update, type = this.type;
    if (type.keyword && prevType == types.dot)
      { this.exprAllowed = false; }
    else if (update = type.updateContext)
      { update.call(this, prevType); }
    else
      { this.exprAllowed = type.beforeExpr; }
  };
  
  // Token-specific context update code
  
  types.parenR.updateContext = types.braceR.updateContext = function() {
    if (this.context.length == 1) {
      this.exprAllowed = true;
      return
    }
    var out = this.context.pop();
    if (out === types$1.b_stat && this.curContext().token === "function") {
      out = this.context.pop();
    }
    this.exprAllowed = !out.isExpr;
  };
  
  types.braceL.updateContext = function(prevType) {
    this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
    this.exprAllowed = true;
  };
  
  types.dollarBraceL.updateContext = function() {
    this.context.push(types$1.b_tmpl);
    this.exprAllowed = true;
  };
  
  types.parenL.updateContext = function(prevType) {
    var statementParens = prevType === types._if || prevType === types._for || prevType === types._with || prevType === types._while;
    this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
    this.exprAllowed = true;
  };
  
  types.incDec.updateContext = function() {
    // tokExprAllowed stays unchanged
  };
  
  types._function.updateContext = types._class.updateContext = function(prevType) {
    if (prevType.beforeExpr && prevType !== types.semi && prevType !== types._else &&
        !((prevType === types.colon || prevType === types.braceL) && this.curContext() === types$1.b_stat))
      { this.context.push(types$1.f_expr); }
    else
      { this.context.push(types$1.f_stat); }
    this.exprAllowed = false;
  };
  
  types.backQuote.updateContext = function() {
    if (this.curContext() === types$1.q_tmpl)
      { this.context.pop(); }
    else
      { this.context.push(types$1.q_tmpl); }
    this.exprAllowed = false;
  };
  
  types.star.updateContext = function(prevType) {
    if (prevType == types._function) {
      var index = this.context.length - 1;
      if (this.context[index] === types$1.f_expr)
        { this.context[index] = types$1.f_expr_gen; }
      else
        { this.context[index] = types$1.f_gen; }
    }
    this.exprAllowed = true;
  };
  
  types.name.updateContext = function(prevType) {
    var allowed = false;
    if (this.options.ecmaVersion >= 6) {
      if (this.value == "of" && !this.exprAllowed ||
          this.value == "yield" && this.inGeneratorContext())
        { allowed = true; }
    }
    this.exprAllowed = allowed;
  };
  
  var data = {
    "$LONE": [
      "ASCII",
      "ASCII_Hex_Digit",
      "AHex",
      "Alphabetic",
      "Alpha",
      "Any",
      "Assigned",
      "Bidi_Control",
      "Bidi_C",
      "Bidi_Mirrored",
      "Bidi_M",
      "Case_Ignorable",
      "CI",
      "Cased",
      "Changes_When_Casefolded",
      "CWCF",
      "Changes_When_Casemapped",
      "CWCM",
      "Changes_When_Lowercased",
      "CWL",
      "Changes_When_NFKC_Casefolded",
      "CWKCF",
      "Changes_When_Titlecased",
      "CWT",
      "Changes_When_Uppercased",
      "CWU",
      "Dash",
      "Default_Ignorable_Code_Point",
      "DI",
      "Deprecated",
      "Dep",
      "Diacritic",
      "Dia",
      "Emoji",
      "Emoji_Component",
      "Emoji_Modifier",
      "Emoji_Modifier_Base",
      "Emoji_Presentation",
      "Extender",
      "Ext",
      "Grapheme_Base",
      "Gr_Base",
      "Grapheme_Extend",
      "Gr_Ext",
      "Hex_Digit",
      "Hex",
      "IDS_Binary_Operator",
      "IDSB",
      "IDS_Trinary_Operator",
      "IDST",
      "ID_Continue",
      "IDC",
      "ID_Start",
      "IDS",
      "Ideographic",
      "Ideo",
      "Join_Control",
      "Join_C",
      "Logical_Order_Exception",
      "LOE",
      "Lowercase",
      "Lower",
      "Math",
      "Noncharacter_Code_Point",
      "NChar",
      "Pattern_Syntax",
      "Pat_Syn",
      "Pattern_White_Space",
      "Pat_WS",
      "Quotation_Mark",
      "QMark",
      "Radical",
      "Regional_Indicator",
      "RI",
      "Sentence_Terminal",
      "STerm",
      "Soft_Dotted",
      "SD",
      "Terminal_Punctuation",
      "Term",
      "Unified_Ideograph",
      "UIdeo",
      "Uppercase",
      "Upper",
      "Variation_Selector",
      "VS",
      "White_Space",
      "space",
      "XID_Continue",
      "XIDC",
      "XID_Start",
      "XIDS"
    ],
    "General_Category": [
      "Cased_Letter",
      "LC",
      "Close_Punctuation",
      "Pe",
      "Connector_Punctuation",
      "Pc",
      "Control",
      "Cc",
      "cntrl",
      "Currency_Symbol",
      "Sc",
      "Dash_Punctuation",
      "Pd",
      "Decimal_Number",
      "Nd",
      "digit",
      "Enclosing_Mark",
      "Me",
      "Final_Punctuation",
      "Pf",
      "Format",
      "Cf",
      "Initial_Punctuation",
      "Pi",
      "Letter",
      "L",
      "Letter_Number",
      "Nl",
      "Line_Separator",
      "Zl",
      "Lowercase_Letter",
      "Ll",
      "Mark",
      "M",
      "Combining_Mark",
      "Math_Symbol",
      "Sm",
      "Modifier_Letter",
      "Lm",
      "Modifier_Symbol",
      "Sk",
      "Nonspacing_Mark",
      "Mn",
      "Number",
      "N",
      "Open_Punctuation",
      "Ps",
      "Other",
      "C",
      "Other_Letter",
      "Lo",
      "Other_Number",
      "No",
      "Other_Punctuation",
      "Po",
      "Other_Symbol",
      "So",
      "Paragraph_Separator",
      "Zp",
      "Private_Use",
      "Co",
      "Punctuation",
      "P",
      "punct",
      "Separator",
      "Z",
      "Space_Separator",
      "Zs",
      "Spacing_Mark",
      "Mc",
      "Surrogate",
      "Cs",
      "Symbol",
      "S",
      "Titlecase_Letter",
      "Lt",
      "Unassigned",
      "Cn",
      "Uppercase_Letter",
      "Lu"
    ],
    "Script": [
      "Adlam",
      "Adlm",
      "Ahom",
      "Anatolian_Hieroglyphs",
      "Hluw",
      "Arabic",
      "Arab",
      "Armenian",
      "Armn",
      "Avestan",
      "Avst",
      "Balinese",
      "Bali",
      "Bamum",
      "Bamu",
      "Bassa_Vah",
      "Bass",
      "Batak",
      "Batk",
      "Bengali",
      "Beng",
      "Bhaiksuki",
      "Bhks",
      "Bopomofo",
      "Bopo",
      "Brahmi",
      "Brah",
      "Braille",
      "Brai",
      "Buginese",
      "Bugi",
      "Buhid",
      "Buhd",
      "Canadian_Aboriginal",
      "Cans",
      "Carian",
      "Cari",
      "Caucasian_Albanian",
      "Aghb",
      "Chakma",
      "Cakm",
      "Cham",
      "Cherokee",
      "Cher",
      "Common",
      "Zyyy",
      "Coptic",
      "Copt",
      "Qaac",
      "Cuneiform",
      "Xsux",
      "Cypriot",
      "Cprt",
      "Cyrillic",
      "Cyrl",
      "Deseret",
      "Dsrt",
      "Devanagari",
      "Deva",
      "Duployan",
      "Dupl",
      "Egyptian_Hieroglyphs",
      "Egyp",
      "Elbasan",
      "Elba",
      "Ethiopic",
      "Ethi",
      "Georgian",
      "Geor",
      "Glagolitic",
      "Glag",
      "Gothic",
      "Goth",
      "Grantha",
      "Gran",
      "Greek",
      "Grek",
      "Gujarati",
      "Gujr",
      "Gurmukhi",
      "Guru",
      "Han",
      "Hani",
      "Hangul",
      "Hang",
      "Hanunoo",
      "Hano",
      "Hatran",
      "Hatr",
      "Hebrew",
      "Hebr",
      "Hiragana",
      "Hira",
      "Imperial_Aramaic",
      "Armi",
      "Inherited",
      "Zinh",
      "Qaai",
      "Inscriptional_Pahlavi",
      "Phli",
      "Inscriptional_Parthian",
      "Prti",
      "Javanese",
      "Java",
      "Kaithi",
      "Kthi",
      "Kannada",
      "Knda",
      "Katakana",
      "Kana",
      "Kayah_Li",
      "Kali",
      "Kharoshthi",
      "Khar",
      "Khmer",
      "Khmr",
      "Khojki",
      "Khoj",
      "Khudawadi",
      "Sind",
      "Lao",
      "Laoo",
      "Latin",
      "Latn",
      "Lepcha",
      "Lepc",
      "Limbu",
      "Limb",
      "Linear_A",
      "Lina",
      "Linear_B",
      "Linb",
      "Lisu",
      "Lycian",
      "Lyci",
      "Lydian",
      "Lydi",
      "Mahajani",
      "Mahj",
      "Malayalam",
      "Mlym",
      "Mandaic",
      "Mand",
      "Manichaean",
      "Mani",
      "Marchen",
      "Marc",
      "Masaram_Gondi",
      "Gonm",
      "Meetei_Mayek",
      "Mtei",
      "Mende_Kikakui",
      "Mend",
      "Meroitic_Cursive",
      "Merc",
      "Meroitic_Hieroglyphs",
      "Mero",
      "Miao",
      "Plrd",
      "Modi",
      "Mongolian",
      "Mong",
      "Mro",
      "Mroo",
      "Multani",
      "Mult",
      "Myanmar",
      "Mymr",
      "Nabataean",
      "Nbat",
      "New_Tai_Lue",
      "Talu",
      "Newa",
      "Nko",
      "Nkoo",
      "Nushu",
      "Nshu",
      "Ogham",
      "Ogam",
      "Ol_Chiki",
      "Olck",
      "Old_Hungarian",
      "Hung",
      "Old_Italic",
      "Ital",
      "Old_North_Arabian",
      "Narb",
      "Old_Permic",
      "Perm",
      "Old_Persian",
      "Xpeo",
      "Old_South_Arabian",
      "Sarb",
      "Old_Turkic",
      "Orkh",
      "Oriya",
      "Orya",
      "Osage",
      "Osge",
      "Osmanya",
      "Osma",
      "Pahawh_Hmong",
      "Hmng",
      "Palmyrene",
      "Palm",
      "Pau_Cin_Hau",
      "Pauc",
      "Phags_Pa",
      "Phag",
      "Phoenician",
      "Phnx",
      "Psalter_Pahlavi",
      "Phlp",
      "Rejang",
      "Rjng",
      "Runic",
      "Runr",
      "Samaritan",
      "Samr",
      "Saurashtra",
      "Saur",
      "Sharada",
      "Shrd",
      "Shavian",
      "Shaw",
      "Siddham",
      "Sidd",
      "SignWriting",
      "Sgnw",
      "Sinhala",
      "Sinh",
      "Sora_Sompeng",
      "Sora",
      "Soyombo",
      "Soyo",
      "Sundanese",
      "Sund",
      "Syloti_Nagri",
      "Sylo",
      "Syriac",
      "Syrc",
      "Tagalog",
      "Tglg",
      "Tagbanwa",
      "Tagb",
      "Tai_Le",
      "Tale",
      "Tai_Tham",
      "Lana",
      "Tai_Viet",
      "Tavt",
      "Takri",
      "Takr",
      "Tamil",
      "Taml",
      "Tangut",
      "Tang",
      "Telugu",
      "Telu",
      "Thaana",
      "Thaa",
      "Thai",
      "Tibetan",
      "Tibt",
      "Tifinagh",
      "Tfng",
      "Tirhuta",
      "Tirh",
      "Ugaritic",
      "Ugar",
      "Vai",
      "Vaii",
      "Warang_Citi",
      "Wara",
      "Yi",
      "Yiii",
      "Zanabazar_Square",
      "Zanb"
    ]
  };
  Array.prototype.push.apply(data.$LONE, data.General_Category);
  data.gc = data.General_Category;
  data.sc = data.Script_Extensions = data.scx = data.Script;
  
  var pp$9 = Parser.prototype;
  
  var RegExpValidationState = function RegExpValidationState(parser) {
    this.parser = parser;
    this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "");
    this.source = "";
    this.flags = "";
    this.start = 0;
    this.switchU = false;
    this.switchN = false;
    this.pos = 0;
    this.lastIntValue = 0;
    this.lastStringValue = "";
    this.lastAssertionIsQuantifiable = false;
    this.numCapturingParens = 0;
    this.maxBackReference = 0;
    this.groupNames = [];
    this.backReferenceNames = [];
  };
  
  RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
    var unicode = flags.indexOf("u") !== -1;
    this.start = start | 0;
    this.source = pattern + "";
    this.flags = flags;
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  };
  
  RegExpValidationState.prototype.raise = function raise (message) {
    this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
  };
  
  // If u flag is given, this returns the code point at the index (it combines a surrogate pair).
  // Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
  RegExpValidationState.prototype.at = function at (i) {
    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return -1
    }
    var c = s.charCodeAt(i);
    if (!this.switchU || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return c
    }
    return (c << 10) + s.charCodeAt(i + 1) - 0x35FDC00
  };
  
  RegExpValidationState.prototype.nextIndex = function nextIndex (i) {
    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return l
    }
    var c = s.charCodeAt(i);
    if (!this.switchU || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return i + 1
    }
    return i + 2
  };
  
  RegExpValidationState.prototype.current = function current () {
    return this.at(this.pos)
  };
  
  RegExpValidationState.prototype.lookahead = function lookahead () {
    return this.at(this.nextIndex(this.pos))
  };
  
  RegExpValidationState.prototype.advance = function advance () {
    this.pos = this.nextIndex(this.pos);
  };
  
  RegExpValidationState.prototype.eat = function eat (ch) {
    if (this.current() === ch) {
      this.advance();
      return true
    }
    return false
  };
  
  function codePointToString$1(ch) {
    if (ch <= 0xFFFF) { return String.fromCharCode(ch) }
    ch -= 0x10000;
    return String.fromCharCode((ch >> 10) + 0xD800, (ch & 0x03FF) + 0xDC00)
  }
  
  /**
   * Validate the flags part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */
  pp$9.validateRegExpFlags = function(state) {
    var this$1 = this;
  
    var validFlags = state.validFlags;
    var flags = state.flags;
  
    for (var i = 0; i < flags.length; i++) {
      var flag = flags.charAt(i);
      if (validFlags.indexOf(flag) == -1) {
        this$1.raise(state.start, "Invalid regular expression flag");
      }
      if (flags.indexOf(flag, i + 1) > -1) {
        this$1.raise(state.start, "Duplicate regular expression flag");
      }
    }
  };
  
  /**
   * Validate the pattern part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */
  pp$9.validateRegExpPattern = function(state) {
    this.regexp_pattern(state);
  
    // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
    // parsing contains a |GroupName|, reparse with the goal symbol
    // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
    // exception if _P_ did not conform to the grammar, if any elements of _P_
    // were not matched by the parse, or if any Early Error conditions exist.
    if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
      state.switchN = true;
      this.regexp_pattern(state);
    }
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
  pp$9.regexp_pattern = function(state) {
    state.pos = 0;
    state.lastIntValue = 0;
    state.lastStringValue = "";
    state.lastAssertionIsQuantifiable = false;
    state.numCapturingParens = 0;
    state.maxBackReference = 0;
    state.groupNames.length = 0;
    state.backReferenceNames.length = 0;
  
    this.regexp_disjunction(state);
  
    if (state.pos !== state.source.length) {
      // Make the same messages as V8.
      if (state.eat(0x29 /* ) */)) {
        state.raise("Unmatched ')'");
      }
      if (state.eat(0x5D /* [ */) || state.eat(0x7D /* } */)) {
        state.raise("Lone quantifier brackets");
      }
    }
    if (state.maxBackReference > state.numCapturingParens) {
      state.raise("Invalid escape");
    }
    for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
      var name = list[i];
  
      if (state.groupNames.indexOf(name) === -1) {
        state.raise("Invalid named capture referenced");
      }
    }
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
  pp$9.regexp_disjunction = function(state) {
    var this$1 = this;
  
    this.regexp_alternative(state);
    while (state.eat(0x7C /* | */)) {
      this$1.regexp_alternative(state);
    }
  
    // Make the same message as V8.
    if (this.regexp_eatQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    if (state.eat(0x7B /* { */)) {
      state.raise("Lone quantifier brackets");
    }
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
  pp$9.regexp_alternative = function(state) {
    while (state.pos < state.source.length && this.regexp_eatTerm(state))
      {  }
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
  pp$9.regexp_eatTerm = function(state) {
    if (this.regexp_eatAssertion(state)) {
      // Handle `QuantifiableAssertion Quantifier` alternative.
      // `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
      // is a QuantifiableAssertion.
      if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
        // Make the same message as V8.
        if (state.switchU) {
          state.raise("Invalid quantifier");
        }
      }
      return true
    }
  
    if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
      this.regexp_eatQuantifier(state);
      return true
    }
  
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
  pp$9.regexp_eatAssertion = function(state) {
    var start = state.pos;
    state.lastAssertionIsQuantifiable = false;
  
    // ^, $
    if (state.eat(0x5E /* ^ */) || state.eat(0x24 /* $ */)) {
      return true
    }
  
    // \b \B
    if (state.eat(0x5C /* \ */)) {
      if (state.eat(0x42 /* B */) || state.eat(0x62 /* b */)) {
        return true
      }
      state.pos = start;
    }
  
    // Lookahead / Lookbehind
    if (state.eat(0x28 /* ( */) && state.eat(0x3F /* ? */)) {
      var lookbehind = false;
      if (this.options.ecmaVersion >= 9) {
        lookbehind = state.eat(0x3C /* < */);
      }
      if (state.eat(0x3D /* = */) || state.eat(0x21 /* ! */)) {
        this.regexp_disjunction(state);
        if (!state.eat(0x29 /* ) */)) {
          state.raise("Unterminated group");
        }
        state.lastAssertionIsQuantifiable = !lookbehind;
        return true
      }
    }
  
    state.pos = start;
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
  pp$9.regexp_eatQuantifier = function(state, noError) {
    if ( noError === void 0 ) noError = false;
  
    if (this.regexp_eatQuantifierPrefix(state, noError)) {
      state.eat(0x3F /* ? */);
      return true
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
  pp$9.regexp_eatQuantifierPrefix = function(state, noError) {
    return (
      state.eat(0x2A /* * */) ||
      state.eat(0x2B /* + */) ||
      state.eat(0x3F /* ? */) ||
      this.regexp_eatBracedQuantifier(state, noError)
    )
  };
  pp$9.regexp_eatBracedQuantifier = function(state, noError) {
    var start = state.pos;
    if (state.eat(0x7B /* { */)) {
      var min = 0, max = -1;
      if (this.regexp_eatDecimalDigits(state)) {
        min = state.lastIntValue;
        if (state.eat(0x2C /* , */) && this.regexp_eatDecimalDigits(state)) {
          max = state.lastIntValue;
        }
        if (state.eat(0x7D /* } */)) {
          // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
          if (max !== -1 && max < min && !noError) {
            state.raise("numbers out of order in {} quantifier");
          }
          return true
        }
      }
      if (state.switchU && !noError) {
        state.raise("Incomplete quantifier");
      }
      state.pos = start;
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
  pp$9.regexp_eatAtom = function(state) {
    return (
      this.regexp_eatPatternCharacters(state) ||
      state.eat(0x2E /* . */) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state)
    )
  };
  pp$9.regexp_eatReverseSolidusAtomEscape = function(state) {
    var start = state.pos;
    if (state.eat(0x5C /* \ */)) {
      if (this.regexp_eatAtomEscape(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatUncapturingGroup = function(state) {
    var start = state.pos;
    if (state.eat(0x28 /* ( */)) {
      if (state.eat(0x3F /* ? */) && state.eat(0x3A /* : */)) {
        this.regexp_disjunction(state);
        if (state.eat(0x29 /* ) */)) {
          return true
        }
        state.raise("Unterminated group");
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatCapturingGroup = function(state) {
    if (state.eat(0x28 /* ( */)) {
      if (this.options.ecmaVersion >= 9) {
        this.regexp_groupSpecifier(state);
      } else if (state.current() === 0x3F /* ? */) {
        state.raise("Invalid group");
      }
      this.regexp_disjunction(state);
      if (state.eat(0x29 /* ) */)) {
        state.numCapturingParens += 1;
        return true
      }
      state.raise("Unterminated group");
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
  pp$9.regexp_eatExtendedAtom = function(state) {
    return (
      state.eat(0x2E /* . */) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state) ||
      this.regexp_eatInvalidBracedQuantifier(state) ||
      this.regexp_eatExtendedPatternCharacter(state)
    )
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
  pp$9.regexp_eatInvalidBracedQuantifier = function(state) {
    if (this.regexp_eatBracedQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
  pp$9.regexp_eatSyntaxCharacter = function(state) {
    var ch = state.current();
    if (isSyntaxCharacter(ch)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
    return false
  };
  function isSyntaxCharacter(ch) {
    return (
      ch === 0x24 /* $ */ ||
      ch >= 0x28 /* ( */ && ch <= 0x2B /* + */ ||
      ch === 0x2E /* . */ ||
      ch === 0x3F /* ? */ ||
      ch >= 0x5B /* [ */ && ch <= 0x5E /* ^ */ ||
      ch >= 0x7B /* { */ && ch <= 0x7D /* } */
    )
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
  // But eat eager.
  pp$9.regexp_eatPatternCharacters = function(state) {
    var start = state.pos;
    var ch = 0;
    while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
      state.advance();
    }
    return state.pos !== start
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
  pp$9.regexp_eatExtendedPatternCharacter = function(state) {
    var ch = state.current();
    if (
      ch !== -1 &&
      ch !== 0x24 /* $ */ &&
      !(ch >= 0x28 /* ( */ && ch <= 0x2B /* + */) &&
      ch !== 0x2E /* . */ &&
      ch !== 0x3F /* ? */ &&
      ch !== 0x5B /* [ */ &&
      ch !== 0x5E /* ^ */ &&
      ch !== 0x7C /* | */
    ) {
      state.advance();
      return true
    }
    return false
  };
  
  // GroupSpecifier[U] ::
  //   [empty]
  //   `?` GroupName[?U]
  pp$9.regexp_groupSpecifier = function(state) {
    if (state.eat(0x3F /* ? */)) {
      if (this.regexp_eatGroupName(state)) {
        if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
          state.raise("Duplicate capture group name");
        }
        state.groupNames.push(state.lastStringValue);
        return
      }
      state.raise("Invalid group");
    }
  };
  
  // GroupName[U] ::
  //   `<` RegExpIdentifierName[?U] `>`
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$9.regexp_eatGroupName = function(state) {
    state.lastStringValue = "";
    if (state.eat(0x3C /* < */)) {
      if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */)) {
        return true
      }
      state.raise("Invalid capture group name");
    }
    return false
  };
  
  // RegExpIdentifierName[U] ::
  //   RegExpIdentifierStart[?U]
  //   RegExpIdentifierName[?U] RegExpIdentifierPart[?U]
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$9.regexp_eatRegExpIdentifierName = function(state) {
    state.lastStringValue = "";
    if (this.regexp_eatRegExpIdentifierStart(state)) {
      state.lastStringValue += codePointToString$1(state.lastIntValue);
      while (this.regexp_eatRegExpIdentifierPart(state)) {
        state.lastStringValue += codePointToString$1(state.lastIntValue);
      }
      return true
    }
    return false
  };
  
  // RegExpIdentifierStart[U] ::
  //   UnicodeIDStart
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[?U]
  pp$9.regexp_eatRegExpIdentifierStart = function(state) {
    var start = state.pos;
    var ch = state.current();
    state.advance();
  
    if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierStart(ch)) {
      state.lastIntValue = ch;
      return true
    }
  
    state.pos = start;
    return false
  };
  function isRegExpIdentifierStart(ch) {
    return isIdentifierStart(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */
  }
  
  // RegExpIdentifierPart[U] ::
  //   UnicodeIDContinue
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[?U]
  //   <ZWNJ>
  //   <ZWJ>
  pp$9.regexp_eatRegExpIdentifierPart = function(state) {
    var start = state.pos;
    var ch = state.current();
    state.advance();
  
    if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierPart(ch)) {
      state.lastIntValue = ch;
      return true
    }
  
    state.pos = start;
    return false
  };
  function isRegExpIdentifierPart(ch) {
    return isIdentifierChar(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */ || ch === 0x200C /* <ZWNJ> */ || ch === 0x200D /* <ZWJ> */
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
  pp$9.regexp_eatAtomEscape = function(state) {
    if (
      this.regexp_eatBackReference(state) ||
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state) ||
      (state.switchN && this.regexp_eatKGroupName(state))
    ) {
      return true
    }
    if (state.switchU) {
      // Make the same message as V8.
      if (state.current() === 0x63 /* c */) {
        state.raise("Invalid unicode escape");
      }
      state.raise("Invalid escape");
    }
    return false
  };
  pp$9.regexp_eatBackReference = function(state) {
    var start = state.pos;
    if (this.regexp_eatDecimalEscape(state)) {
      var n = state.lastIntValue;
      if (state.switchU) {
        // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
        if (n > state.maxBackReference) {
          state.maxBackReference = n;
        }
        return true
      }
      if (n <= state.numCapturingParens) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatKGroupName = function(state) {
    if (state.eat(0x6B /* k */)) {
      if (this.regexp_eatGroupName(state)) {
        state.backReferenceNames.push(state.lastStringValue);
        return true
      }
      state.raise("Invalid named reference");
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
  pp$9.regexp_eatCharacterEscape = function(state) {
    return (
      this.regexp_eatControlEscape(state) ||
      this.regexp_eatCControlLetter(state) ||
      this.regexp_eatZero(state) ||
      this.regexp_eatHexEscapeSequence(state) ||
      this.regexp_eatRegExpUnicodeEscapeSequence(state) ||
      (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
      this.regexp_eatIdentityEscape(state)
    )
  };
  pp$9.regexp_eatCControlLetter = function(state) {
    var start = state.pos;
    if (state.eat(0x63 /* c */)) {
      if (this.regexp_eatControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$9.regexp_eatZero = function(state) {
    if (state.current() === 0x30 /* 0 */ && !isDecimalDigit(state.lookahead())) {
      state.lastIntValue = 0;
      state.advance();
      return true
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
  pp$9.regexp_eatControlEscape = function(state) {
    var ch = state.current();
    if (ch === 0x74 /* t */) {
      state.lastIntValue = 0x09; /* \t */
      state.advance();
      return true
    }
    if (ch === 0x6E /* n */) {
      state.lastIntValue = 0x0A; /* \n */
      state.advance();
      return true
    }
    if (ch === 0x76 /* v */) {
      state.lastIntValue = 0x0B; /* \v */
      state.advance();
      return true
    }
    if (ch === 0x66 /* f */) {
      state.lastIntValue = 0x0C; /* \f */
      state.advance();
      return true
    }
    if (ch === 0x72 /* r */) {
      state.lastIntValue = 0x0D; /* \r */
      state.advance();
      return true
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
  pp$9.regexp_eatControlLetter = function(state) {
    var ch = state.current();
    if (isControlLetter(ch)) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  function isControlLetter(ch) {
    return (
      (ch >= 0x41 /* A */ && ch <= 0x5A /* Z */) ||
      (ch >= 0x61 /* a */ && ch <= 0x7A /* z */)
    )
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
  pp$9.regexp_eatRegExpUnicodeEscapeSequence = function(state) {
    var start = state.pos;
  
    if (state.eat(0x75 /* u */)) {
      if (this.regexp_eatFixedHexDigits(state, 4)) {
        var lead = state.lastIntValue;
        if (state.switchU && lead >= 0xD800 && lead <= 0xDBFF) {
          var leadSurrogateEnd = state.pos;
          if (state.eat(0x5C /* \ */) && state.eat(0x75 /* u */) && this.regexp_eatFixedHexDigits(state, 4)) {
            var trail = state.lastIntValue;
            if (trail >= 0xDC00 && trail <= 0xDFFF) {
              state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
              return true
            }
          }
          state.pos = leadSurrogateEnd;
          state.lastIntValue = lead;
        }
        return true
      }
      if (
        state.switchU &&
        state.eat(0x7B /* { */) &&
        this.regexp_eatHexDigits(state) &&
        state.eat(0x7D /* } */) &&
        isValidUnicode(state.lastIntValue)
      ) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid unicode escape");
      }
      state.pos = start;
    }
  
    return false
  };
  function isValidUnicode(ch) {
    return ch >= 0 && ch <= 0x10FFFF
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
  pp$9.regexp_eatIdentityEscape = function(state) {
    if (state.switchU) {
      if (this.regexp_eatSyntaxCharacter(state)) {
        return true
      }
      if (state.eat(0x2F /* / */)) {
        state.lastIntValue = 0x2F; /* / */
        return true
      }
      return false
    }
  
    var ch = state.current();
    if (ch !== 0x63 /* c */ && (!state.switchN || ch !== 0x6B /* k */)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
  
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
  pp$9.regexp_eatDecimalEscape = function(state) {
    state.lastIntValue = 0;
    var ch = state.current();
    if (ch >= 0x31 /* 1 */ && ch <= 0x39 /* 9 */) {
      do {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
        state.advance();
      } while ((ch = state.current()) >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */)
      return true
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
  pp$9.regexp_eatCharacterClassEscape = function(state) {
    var ch = state.current();
  
    if (isCharacterClassEscape(ch)) {
      state.lastIntValue = -1;
      state.advance();
      return true
    }
  
    if (
      state.switchU &&
      this.options.ecmaVersion >= 9 &&
      (ch === 0x50 /* P */ || ch === 0x70 /* p */)
    ) {
      state.lastIntValue = -1;
      state.advance();
      if (
        state.eat(0x7B /* { */) &&
        this.regexp_eatUnicodePropertyValueExpression(state) &&
        state.eat(0x7D /* } */)
      ) {
        return true
      }
      state.raise("Invalid property name");
    }
  
    return false
  };
  function isCharacterClassEscape(ch) {
    return (
      ch === 0x64 /* d */ ||
      ch === 0x44 /* D */ ||
      ch === 0x73 /* s */ ||
      ch === 0x53 /* S */ ||
      ch === 0x77 /* w */ ||
      ch === 0x57 /* W */
    )
  }
  
  // UnicodePropertyValueExpression ::
  //   UnicodePropertyName `=` UnicodePropertyValue
  //   LoneUnicodePropertyNameOrValue
  pp$9.regexp_eatUnicodePropertyValueExpression = function(state) {
    var start = state.pos;
  
    // UnicodePropertyName `=` UnicodePropertyValue
    if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */)) {
      var name = state.lastStringValue;
      if (this.regexp_eatUnicodePropertyValue(state)) {
        var value = state.lastStringValue;
        this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
        return true
      }
    }
    state.pos = start;
  
    // LoneUnicodePropertyNameOrValue
    if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
      var nameOrValue = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
      return true
    }
    return false
  };
  pp$9.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
    if (!data.hasOwnProperty(name) || data[name].indexOf(value) === -1) {
      state.raise("Invalid property name");
    }
  };
  pp$9.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
    if (data.$LONE.indexOf(nameOrValue) === -1) {
      state.raise("Invalid property name");
    }
  };
  
  // UnicodePropertyName ::
  //   UnicodePropertyNameCharacters
  pp$9.regexp_eatUnicodePropertyName = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyNameCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString$1(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyNameCharacter(ch) {
    return isControlLetter(ch) || ch === 0x5F /* _ */
  }
  
  // UnicodePropertyValue ::
  //   UnicodePropertyValueCharacters
  pp$9.regexp_eatUnicodePropertyValue = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyValueCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString$1(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyValueCharacter(ch) {
    return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
  }
  
  // LoneUnicodePropertyNameOrValue ::
  //   UnicodePropertyValueCharacters
  pp$9.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
    return this.regexp_eatUnicodePropertyValue(state)
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
  pp$9.regexp_eatCharacterClass = function(state) {
    if (state.eat(0x5B /* [ */)) {
      state.eat(0x5E /* ^ */);
      this.regexp_classRanges(state);
      if (state.eat(0x5D /* [ */)) {
        return true
      }
      // Unreachable since it threw "unterminated regular expression" error before.
      state.raise("Unterminated character class");
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
  pp$9.regexp_classRanges = function(state) {
    var this$1 = this;
  
    while (this.regexp_eatClassAtom(state)) {
      var left = state.lastIntValue;
      if (state.eat(0x2D /* - */) && this$1.regexp_eatClassAtom(state)) {
        var right = state.lastIntValue;
        if (state.switchU && (left === -1 || right === -1)) {
          state.raise("Invalid character class");
        }
        if (left !== -1 && right !== -1 && left > right) {
          state.raise("Range out of order in character class");
        }
      }
    }
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
  pp$9.regexp_eatClassAtom = function(state) {
    var start = state.pos;
  
    if (state.eat(0x5C /* \ */)) {
      if (this.regexp_eatClassEscape(state)) {
        return true
      }
      if (state.switchU) {
        // Make the same message as V8.
        var ch$1 = state.current();
        if (ch$1 === 0x63 /* c */ || isOctalDigit(ch$1)) {
          state.raise("Invalid class escape");
        }
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
  
    var ch = state.current();
    if (ch !== 0x5D /* [ */) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
  
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
  pp$9.regexp_eatClassEscape = function(state) {
    var start = state.pos;
  
    if (state.eat(0x62 /* b */)) {
      state.lastIntValue = 0x08; /* <BS> */
      return true
    }
  
    if (state.switchU && state.eat(0x2D /* - */)) {
      state.lastIntValue = 0x2D; /* - */
      return true
    }
  
    if (!state.switchU && state.eat(0x63 /* c */)) {
      if (this.regexp_eatClassControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
  
    return (
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state)
    )
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
  pp$9.regexp_eatClassControlLetter = function(state) {
    var ch = state.current();
    if (isDecimalDigit(ch) || ch === 0x5F /* _ */) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$9.regexp_eatHexEscapeSequence = function(state) {
    var start = state.pos;
    if (state.eat(0x78 /* x */)) {
      if (this.regexp_eatFixedHexDigits(state, 2)) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
  pp$9.regexp_eatDecimalDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isDecimalDigit(ch = state.current())) {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
      state.advance();
    }
    return state.pos !== start
  };
  function isDecimalDigit(ch) {
    return ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
  pp$9.regexp_eatHexDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isHexDigit(ch = state.current())) {
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return state.pos !== start
  };
  function isHexDigit(ch) {
    return (
      (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */) ||
      (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) ||
      (ch >= 0x61 /* a */ && ch <= 0x66 /* f */)
    )
  }
  function hexToInt(ch) {
    if (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) {
      return 10 + (ch - 0x41 /* A */)
    }
    if (ch >= 0x61 /* a */ && ch <= 0x66 /* f */) {
      return 10 + (ch - 0x61 /* a */)
    }
    return ch - 0x30 /* 0 */
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
  // Allows only 0-377(octal) i.e. 0-255(decimal).
  pp$9.regexp_eatLegacyOctalEscapeSequence = function(state) {
    if (this.regexp_eatOctalDigit(state)) {
      var n1 = state.lastIntValue;
      if (this.regexp_eatOctalDigit(state)) {
        var n2 = state.lastIntValue;
        if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
          state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
        } else {
          state.lastIntValue = n1 * 8 + n2;
        }
      } else {
        state.lastIntValue = n1;
      }
      return true
    }
    return false
  };
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
  pp$9.regexp_eatOctalDigit = function(state) {
    var ch = state.current();
    if (isOctalDigit(ch)) {
      state.lastIntValue = ch - 0x30; /* 0 */
      state.advance();
      return true
    }
    state.lastIntValue = 0;
    return false
  };
  function isOctalDigit(ch) {
    return ch >= 0x30 /* 0 */ && ch <= 0x37 /* 7 */
  }
  
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
  // And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$9.regexp_eatFixedHexDigits = function(state, length) {
    var start = state.pos;
    state.lastIntValue = 0;
    for (var i = 0; i < length; ++i) {
      var ch = state.current();
      if (!isHexDigit(ch)) {
        state.pos = start;
        return false
      }
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return true
  };
  
  // Object type used to represent tokens. Note that normally, tokens
  // simply exist as properties on the parser object. This is only
  // used for the onToken callback and the external tokenizer.
  
  var Token = function Token(p) {
    this.type = p.type;
    this.value = p.value;
    this.start = p.start;
    this.end = p.end;
    if (p.options.locations)
      { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
    if (p.options.ranges)
      { this.range = [p.start, p.end]; }
  };
  
  // ## Tokenizer
  
  var pp$8 = Parser.prototype;
  
  // Move to the next token
  
  pp$8.next = function() {
    if (this.options.onToken)
      { this.options.onToken(new Token(this)); }
  
    this.lastTokEnd = this.end;
    this.lastTokStart = this.start;
    this.lastTokEndLoc = this.endLoc;
    this.lastTokStartLoc = this.startLoc;
    this.nextToken();
  };
  
  pp$8.getToken = function() {
    this.next();
    return new Token(this)
  };
  
  // If we're in an ES6 environment, make parsers iterable
  if (typeof Symbol !== "undefined")
    { pp$8[Symbol.iterator] = function() {
      var this$1 = this;
  
      return {
        next: function () {
          var token = this$1.getToken();
          return {
            done: token.type === types.eof,
            value: token
          }
        }
      }
    }; }
  
  // Toggle strict mode. Re-reads the next number or string to please
  // pedantic tests (`"use strict"; 010;` should fail).
  
  pp$8.curContext = function() {
    return this.context[this.context.length - 1]
  };
  
  // Read a single token, updating the parser object's token-related
  // properties.
  
  pp$8.nextToken = function() {
    var curContext = this.curContext();
    if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }
  
    this.start = this.pos;
    if (this.options.locations) { this.startLoc = this.curPosition(); }
    if (this.pos >= this.input.length) { return this.finishToken(types.eof) }
  
    if (curContext.override) { return curContext.override(this) }
    else { this.readToken(this.fullCharCodeAtPos()); }
  };
  
  pp$8.readToken = function(code) {
    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
      { return this.readWord() }
  
    return this.getTokenFromCode(code)
  };
  
  pp$8.fullCharCodeAtPos = function() {
    var code = this.input.charCodeAt(this.pos);
    if (code <= 0xd7ff || code >= 0xe000) { return code }
    var next = this.input.charCodeAt(this.pos + 1);
    return (code << 10) + next - 0x35fdc00
  };
  
  pp$8.skipBlockComment = function() {
    var this$1 = this;
  
    var startLoc = this.options.onComment && this.curPosition();
    var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
    if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
    this.pos = end + 2;
    if (this.options.locations) {
      lineBreakG.lastIndex = start;
      var match;
      while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
        ++this$1.curLine;
        this$1.lineStart = match.index + match[0].length;
      }
    }
    if (this.options.onComment)
      { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition()); }
  };
  
  pp$8.skipLineComment = function(startSkip) {
    var this$1 = this;
  
    var start = this.pos;
    var startLoc = this.options.onComment && this.curPosition();
    var ch = this.input.charCodeAt(this.pos += startSkip);
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this$1.input.charCodeAt(++this$1.pos);
    }
    if (this.options.onComment)
      { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                             startLoc, this.curPosition()); }
  };
  
  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.
  
  pp$8.skipSpace = function() {
    var this$1 = this;
  
    loop: while (this.pos < this.input.length) {
      var ch = this$1.input.charCodeAt(this$1.pos);
      switch (ch) {
      case 32: case 160: // ' '
        ++this$1.pos;
        break
      case 13:
        if (this$1.input.charCodeAt(this$1.pos + 1) === 10) {
          ++this$1.pos;
        }
      case 10: case 8232: case 8233:
        ++this$1.pos;
        if (this$1.options.locations) {
          ++this$1.curLine;
          this$1.lineStart = this$1.pos;
        }
        break
      case 47: // '/'
        switch (this$1.input.charCodeAt(this$1.pos + 1)) {
        case 42: // '*'
          this$1.skipBlockComment();
          break
        case 47:
          this$1.skipLineComment(2);
          break
        default:
          break loop
        }
        break
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this$1.pos;
        } else {
          break loop
        }
      }
    }
  };
  
  // Called at the end of every token. Sets `end`, `val`, and
  // maintains `context` and `exprAllowed`, and skips the space after
  // the token, so that the next one's `start` will point at the
  // right position.
  
  pp$8.finishToken = function(type, val) {
    this.end = this.pos;
    if (this.options.locations) { this.endLoc = this.curPosition(); }
    var prevType = this.type;
    this.type = type;
    this.value = val;
  
    this.updateContext(prevType);
  };
  
  // ### Token reading
  
  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.
  //
  pp$8.readToken_dot = function() {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) { return this.readNumber(true) }
    var next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
      this.pos += 3;
      return this.finishToken(types.ellipsis)
    } else {
      ++this.pos;
      return this.finishToken(types.dot)
    }
  };
  
  pp$8.readToken_slash = function() { // '/'
    var next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.slash, 1)
  };
  
  pp$8.readToken_mult_modulo_exp = function(code) { // '%*'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    var tokentype = code === 42 ? types.star : types.modulo;
  
    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && code == 42 && next === 42) {
      ++size;
      tokentype = types.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }
  
    if (next === 61) { return this.finishOp(types.assign, size + 1) }
    return this.finishOp(tokentype, size)
  };
  
  pp$8.readToken_pipe_amp = function(code) { // '|&'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) { return this.finishOp(code === 124 ? types.logicalOR : types.logicalAND, 2) }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(code === 124 ? types.bitwiseOR : types.bitwiseAND, 1)
  };
  
  pp$8.readToken_caret = function() { // '^'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.bitwiseXOR, 1)
  };
  
  pp$8.readToken_plus_min = function(code) { // '+-'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next == 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) == 62 &&
          (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
        // A `-->` line comment
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken()
      }
      return this.finishOp(types.incDec, 2)
    }
    if (next === 61) { return this.finishOp(types.assign, 2) }
    return this.finishOp(types.plusMin, 1)
  };
  
  pp$8.readToken_lt_gt = function(code) { // '<>'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types.assign, size + 1) }
      return this.finishOp(types.bitShift, size)
    }
    if (next == 33 && code == 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) == 45 &&
        this.input.charCodeAt(this.pos + 3) == 45) {
      // `<!--`, an XML-style comment that should be interpreted as a line comment
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken()
    }
    if (next === 61) { size = 2; }
    return this.finishOp(types.relational, size)
  };
  
  pp$8.readToken_eq_excl = function(code) { // '=!'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(types.arrow)
    }
    return this.finishOp(code === 61 ? types.eq : types.prefix, 1)
  };
  
  pp$8.getTokenFromCode = function(code) {
    switch (code) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46: // '.'
      return this.readToken_dot()
  
    // Punctuation tokens.
    case 40: ++this.pos; return this.finishToken(types.parenL)
    case 41: ++this.pos; return this.finishToken(types.parenR)
    case 59: ++this.pos; return this.finishToken(types.semi)
    case 44: ++this.pos; return this.finishToken(types.comma)
    case 91: ++this.pos; return this.finishToken(types.bracketL)
    case 93: ++this.pos; return this.finishToken(types.bracketR)
    case 123: ++this.pos; return this.finishToken(types.braceL)
    case 125: ++this.pos; return this.finishToken(types.braceR)
    case 58: ++this.pos; return this.finishToken(types.colon)
    case 63: ++this.pos; return this.finishToken(types.question)
  
    case 96: // '`'
      if (this.options.ecmaVersion < 6) { break }
      ++this.pos;
      return this.finishToken(types.backQuote)
  
    case 48: // '0'
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) { return this.readRadixNumber(16) } // '0x', '0X' - hex number
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) { return this.readRadixNumber(8) } // '0o', '0O' - octal number
        if (next === 98 || next === 66) { return this.readRadixNumber(2) } // '0b', '0B' - binary number
      }
  
    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
      return this.readNumber(false)
  
    // Quotes produce strings.
    case 34: case 39: // '"', "'"
      return this.readString(code)
  
    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
  
    case 47: // '/'
      return this.readToken_slash()
  
    case 37: case 42: // '%*'
      return this.readToken_mult_modulo_exp(code)
  
    case 124: case 38: // '|&'
      return this.readToken_pipe_amp(code)
  
    case 94: // '^'
      return this.readToken_caret()
  
    case 43: case 45: // '+-'
      return this.readToken_plus_min(code)
  
    case 60: case 62: // '<>'
      return this.readToken_lt_gt(code)
  
    case 61: case 33: // '=!'
      return this.readToken_eq_excl(code)
  
    case 126: // '~'
      return this.finishOp(types.prefix, 1)
    }
  
    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };
  
  pp$8.finishOp = function(type, size) {
    var str = this.input.slice(this.pos, this.pos + size);
    this.pos += size;
    return this.finishToken(type, str)
  };
  
  pp$8.readRegexp = function() {
    var this$1 = this;
  
    var escaped, inClass, start = this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) { this$1.raise(start, "Unterminated regular expression"); }
      var ch = this$1.input.charAt(this$1.pos);
      if (lineBreak.test(ch)) { this$1.raise(start, "Unterminated regular expression"); }
      if (!escaped) {
        if (ch === "[") { inClass = true; }
        else if (ch === "]" && inClass) { inClass = false; }
        else if (ch === "/" && !inClass) { break }
        escaped = ch === "\\";
      } else { escaped = false; }
      ++this$1.pos;
    }
    var pattern = this.input.slice(start, this.pos);
    ++this.pos;
    var flagsStart = this.pos;
    var flags = this.readWord1();
    if (this.containsEsc) { this.unexpected(flagsStart); }
  
    // Validate pattern
    var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
    state.reset(start, pattern, flags);
    this.validateRegExpFlags(state);
    this.validateRegExpPattern(state);
  
    // Create Literal#value property value.
    var value = null;
    try {
      value = new RegExp(pattern, flags);
    } catch (e) {
      // ESTree requires null if it failed to instantiate RegExp object.
      // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
    }
  
    return this.finishToken(types.regexp, {pattern: pattern, flags: flags, value: value})
  };
  
  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.
  
  pp$8.readInt = function(radix, len) {
    var this$1 = this;
  
    var start = this.pos, total = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
      var code = this$1.input.charCodeAt(this$1.pos), val = (void 0);
      if (code >= 97) { val = code - 97 + 10; } // a
      else if (code >= 65) { val = code - 65 + 10; } // A
      else if (code >= 48 && code <= 57) { val = code - 48; } // 0-9
      else { val = Infinity; }
      if (val >= radix) { break }
      ++this$1.pos;
      total = total * radix + val;
    }
    if (this.pos === start || len != null && this.pos - start !== len) { return null }
  
    return total
  };
  
  pp$8.readRadixNumber = function(radix) {
    this.pos += 2; // 0x
    var val = this.readInt(radix);
    if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types.num, val)
  };
  
  // Read an integer, octal integer, or floating-point number.
  
  pp$8.readNumber = function(startsWithDot) {
    var start = this.pos;
    if (!startsWithDot && this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (octal && this.strict) { this.raise(start, "Invalid number"); }
    if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
    var next = this.input.charCodeAt(this.pos);
    if (next === 46 && !octal) { // '.'
      ++this.pos;
      this.readInt(10);
      next = this.input.charCodeAt(this.pos);
    }
    if ((next === 69 || next === 101) && !octal) { // 'eE'
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next === 45) { ++this.pos; } // '+-'
      if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
  
    var str = this.input.slice(start, this.pos);
    var val = octal ? parseInt(str, 8) : parseFloat(str);
    return this.finishToken(types.num, val)
  };
  
  // Read a string value, interpreting backslash-escapes.
  
  pp$8.readCodePoint = function() {
    var ch = this.input.charCodeAt(this.pos), code;
  
    if (ch === 123) { // '{'
      if (this.options.ecmaVersion < 6) { this.unexpected(); }
      var codePos = ++this.pos;
      code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
      ++this.pos;
      if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
    } else {
      code = this.readHexChar(4);
    }
    return code
  };
  
  function codePointToString(code) {
    // UTF-16 Decoding
    if (code <= 0xFFFF) { return String.fromCharCode(code) }
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
  }
  
  pp$8.readString = function(quote) {
    var this$1 = this;
  
    var out = "", chunkStart = ++this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) { this$1.raise(this$1.start, "Unterminated string constant"); }
      var ch = this$1.input.charCodeAt(this$1.pos);
      if (ch === quote) { break }
      if (ch === 92) { // '\'
        out += this$1.input.slice(chunkStart, this$1.pos);
        out += this$1.readEscapedChar(false);
        chunkStart = this$1.pos;
      } else {
        if (isNewLine(ch)) { this$1.raise(this$1.start, "Unterminated string constant"); }
        ++this$1.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(types.string, out)
  };
  
  // Reads template string tokens.
  
  var INVALID_TEMPLATE_ESCAPE_ERROR = {};
  
  pp$8.tryReadTemplateToken = function() {
    this.inTemplateElement = true;
    try {
      this.readTmplToken();
    } catch (err) {
      if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
        this.readInvalidTemplateToken();
      } else {
        throw err
      }
    }
  
    this.inTemplateElement = false;
  };
  
  pp$8.invalidStringToken = function(position, message) {
    if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
      throw INVALID_TEMPLATE_ESCAPE_ERROR
    } else {
      this.raise(position, message);
    }
  };
  
  pp$8.readTmplToken = function() {
    var this$1 = this;
  
    var out = "", chunkStart = this.pos;
    for (;;) {
      if (this$1.pos >= this$1.input.length) { this$1.raise(this$1.start, "Unterminated template"); }
      var ch = this$1.input.charCodeAt(this$1.pos);
      if (ch === 96 || ch === 36 && this$1.input.charCodeAt(this$1.pos + 1) === 123) { // '`', '${'
        if (this$1.pos === this$1.start && (this$1.type === types.template || this$1.type === types.invalidTemplate)) {
          if (ch === 36) {
            this$1.pos += 2;
            return this$1.finishToken(types.dollarBraceL)
          } else {
            ++this$1.pos;
            return this$1.finishToken(types.backQuote)
          }
        }
        out += this$1.input.slice(chunkStart, this$1.pos);
        return this$1.finishToken(types.template, out)
      }
      if (ch === 92) { // '\'
        out += this$1.input.slice(chunkStart, this$1.pos);
        out += this$1.readEscapedChar(true);
        chunkStart = this$1.pos;
      } else if (isNewLine(ch)) {
        out += this$1.input.slice(chunkStart, this$1.pos);
        ++this$1.pos;
        switch (ch) {
        case 13:
          if (this$1.input.charCodeAt(this$1.pos) === 10) { ++this$1.pos; }
        case 10:
          out += "\n";
          break
        default:
          out += String.fromCharCode(ch);
          break
        }
        if (this$1.options.locations) {
          ++this$1.curLine;
          this$1.lineStart = this$1.pos;
        }
        chunkStart = this$1.pos;
      } else {
        ++this$1.pos;
      }
    }
  };
  
  // Reads a template token to search for the end, without validating any escape sequences
  pp$8.readInvalidTemplateToken = function() {
    var this$1 = this;
  
    for (; this.pos < this.input.length; this.pos++) {
      switch (this$1.input[this$1.pos]) {
      case "\\":
        ++this$1.pos;
        break
  
      case "$":
        if (this$1.input[this$1.pos + 1] !== "{") {
          break
        }
      // falls through
  
      case "`":
        return this$1.finishToken(types.invalidTemplate, this$1.input.slice(this$1.start, this$1.pos))
  
      // no default
      }
    }
    this.raise(this.start, "Unterminated template");
  };
  
  // Used to read escaped characters
  
  pp$8.readEscapedChar = function(inTemplate) {
    var ch = this.input.charCodeAt(++this.pos);
    ++this.pos;
    switch (ch) {
    case 110: return "\n" // 'n' -> '\n'
    case 114: return "\r" // 'r' -> '\r'
    case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
    case 117: return codePointToString(this.readCodePoint()) // 'u'
    case 116: return "\t" // 't' -> '\t'
    case 98: return "\b" // 'b' -> '\b'
    case 118: return "\u000b" // 'v' -> '\u000b'
    case 102: return "\f" // 'f' -> '\f'
    case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } // '\r\n'
    case 10: // ' \n'
      if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
      return ""
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch == 56 || ch == 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate
              ? "Octal literal in template string"
              : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal)
      }
      return String.fromCharCode(ch)
    }
  };
  
  // Used to read character escape sequences ('\x', '\u', '\U').
  
  pp$8.readHexChar = function(len) {
    var codePos = this.pos;
    var n = this.readInt(16, len);
    if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
    return n
  };
  
  // Read an identifier, and return it as a string. Sets `this.containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Incrementally adds only escaped chars, adding other chunks as-is
  // as a micro-optimization.
  
  pp$8.readWord1 = function() {
    var this$1 = this;
  
    this.containsEsc = false;
    var word = "", first = true, chunkStart = this.pos;
    var astral = this.options.ecmaVersion >= 6;
    while (this.pos < this.input.length) {
      var ch = this$1.fullCharCodeAtPos();
      if (isIdentifierChar(ch, astral)) {
        this$1.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) { // "\"
        this$1.containsEsc = true;
        word += this$1.input.slice(chunkStart, this$1.pos);
        var escStart = this$1.pos;
        if (this$1.input.charCodeAt(++this$1.pos) != 117) // "u"
          { this$1.invalidStringToken(this$1.pos, "Expecting Unicode escape sequence \\uXXXX"); }
        ++this$1.pos;
        var esc = this$1.readCodePoint();
        if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
          { this$1.invalidStringToken(escStart, "Invalid Unicode escape"); }
        word += codePointToString(esc);
        chunkStart = this$1.pos;
      } else {
        break
      }
      first = false;
    }
    return word + this.input.slice(chunkStart, this.pos)
  };
  
  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.
  
  pp$8.readWord = function() {
    var word = this.readWord1();
    var type = types.name;
    if (this.keywords.test(word)) {
      if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword " + word); }
      type = keywords$1[word];
    }
    return this.finishToken(type, word)
  };
  
  // Acorn is a tiny, fast JavaScript parser written in JavaScript.
  //
  // Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
  // various contributors and released under an MIT license.
  //
  // Git repositories for Acorn are available at
  //
  //     http://marijnhaverbeke.nl/git/acorn
  //     https://github.com/acornjs/acorn.git
  //
  // Please use the [github bug tracker][ghbt] to report issues.
  //
  // [ghbt]: https://github.com/acornjs/acorn/issues
  //
  // This file defines the main parser interface. The library also comes
  // with a [error-tolerant parser][dammit] and an
  // [abstract syntax tree walker][walk], defined in other files.
  //
  // [dammit]: acorn_loose.js
  // [walk]: util/walk.js
  
  var version = "5.5.3";
  
  // The main exported interface (under `self.acorn` when in the
  // browser) is a `parse` function that takes a code string and
  // returns an abstract syntax tree as specified by [Mozilla parser
  // API][api].
  //
  // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
  
  function parse(input, options) {
    return new Parser(options, input).parse()
  }
  
  // This function tries to parse a single expression at a given
  // offset in a string. Useful for parsing mixed-language formats
  // that embed JavaScript expressions.
  
  function parseExpressionAt(input, pos, options) {
    var p = new Parser(options, input, pos);
    p.nextToken();
    return p.parseExpression()
  }
  
  // Acorn is organized as a tokenizer and a recursive-descent parser.
  // The `tokenizer` export provides an interface to the tokenizer.
  
  function tokenizer(input, options) {
    return new Parser(options, input)
  }
  
  // This is a terrible kludge to support the existing, pre-ES6
  // interface where the loose parser module retroactively adds exports
  // to this module.
   // eslint-disable-line camelcase
  function addLooseExports(parse, Parser$$1, plugins$$1) {
    exports.parse_dammit = parse; // eslint-disable-line camelcase
    exports.LooseParser = Parser$$1;
    exports.pluginsLoose = plugins$$1;
  }
  
  exports.version = version;
  exports.parse = parse;
  exports.parseExpressionAt = parseExpressionAt;
  exports.tokenizer = tokenizer;
  exports.addLooseExports = addLooseExports;
  exports.Parser = Parser;
  exports.plugins = plugins;
  exports.defaultOptions = defaultOptions;
  exports.Position = Position;
  exports.SourceLocation = SourceLocation;
  exports.getLineInfo = getLineInfo;
  exports.Node = Node;
  exports.TokenType = TokenType;
  exports.tokTypes = types;
  exports.keywordTypes = keywords$1;
  exports.TokContext = TokContext;
  exports.tokContexts = types$1;
  exports.isIdentifierChar = isIdentifierChar;
  exports.isIdentifierStart = isIdentifierStart;
  exports.Token = Token;
  exports.isNewLine = isNewLine;
  exports.lineBreak = lineBreak;
  exports.lineBreakG = lineBreakG;
  exports.nonASCIIwhitespace = nonASCIIwhitespace;
  
  Object.defineProperty(exports, '__esModule', { value: true });
  
  })));
  
  },{}],49:[function(require,module,exports){
  'use strict'
  
  exports.byteLength = byteLength
  exports.toByteArray = toByteArray
  exports.fromByteArray = fromByteArray
  
  var lookup = []
  var revLookup = []
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
  
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }
  
  // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications
  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
  
  function placeHoldersCount (b64) {
    var len = b64.length
    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }
  
    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
    return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
  }
  
  function byteLength (b64) {
    // base64 is 4/3 + up to two characters of the original data
    return (b64.length * 3 / 4) - placeHoldersCount(b64)
  }
  
  function toByteArray (b64) {
    var i, l, tmp, placeHolders, arr
    var len = b64.length
    placeHolders = placeHoldersCount(b64)
  
    arr = new Arr((len * 3 / 4) - placeHolders)
  
    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? len - 4 : len
  
    var L = 0
  
    for (i = 0; i < l; i += 4) {
      tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
      arr[L++] = (tmp >> 16) & 0xFF
      arr[L++] = (tmp >> 8) & 0xFF
      arr[L++] = tmp & 0xFF
    }
  
    if (placeHolders === 2) {
      tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
      arr[L++] = tmp & 0xFF
    } else if (placeHolders === 1) {
      tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
      arr[L++] = (tmp >> 8) & 0xFF
      arr[L++] = tmp & 0xFF
    }
  
    return arr
  }
  
  function tripletToBase64 (num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
  }
  
  function encodeChunk (uint8, start, end) {
    var tmp
    var output = []
    for (var i = start; i < end; i += 3) {
      tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
      output.push(tripletToBase64(tmp))
    }
    return output.join('')
  }
  
  function fromByteArray (uint8) {
    var tmp
    var len = uint8.length
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    var output = ''
    var parts = []
    var maxChunkLength = 16383 // must be multiple of 3
  
    // go through the array every three bytes, we'll deal with trailing stuff later
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
    }
  
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1]
      output += lookup[tmp >> 2]
      output += lookup[(tmp << 4) & 0x3F]
      output += '=='
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
      output += lookup[tmp >> 10]
      output += lookup[(tmp >> 4) & 0x3F]
      output += lookup[(tmp << 2) & 0x3F]
      output += '='
    }
  
    parts.push(output)
  
    return parts.join('')
  }
  
  },{}],50:[function(require,module,exports){
  
  },{}],51:[function(require,module,exports){
  (function (global){
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */
  
  'use strict'
  
  var base64 = require('base64-js')
  var ieee754 = require('ieee754')
  var isArray = require('isarray')
  
  exports.Buffer = Buffer
  exports.SlowBuffer = SlowBuffer
  exports.INSPECT_MAX_BYTES = 50
  
  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Use Object implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * Due to various browser bugs, sometimes the Object implementation will be used even
   * when the browser supports typed arrays.
   *
   * Note:
   *
   *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
   *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
   *
   *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
   *
   *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
   *     incorrect length in some situations.
  
   * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
   * get the Object implementation, which is slower but behaves correctly.
   */
  Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
    ? global.TYPED_ARRAY_SUPPORT
    : typedArraySupport()
  
  /*
   * Export kMaxLength after typed array support is determined.
   */
  exports.kMaxLength = kMaxLength()
  
  function typedArraySupport () {
    try {
      var arr = new Uint8Array(1)
      arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
      return arr.foo() === 42 && // typed array instances can be augmented
          typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
          arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
    } catch (e) {
      return false
    }
  }
  
  function kMaxLength () {
    return Buffer.TYPED_ARRAY_SUPPORT
      ? 0x7fffffff
      : 0x3fffffff
  }
  
  function createBuffer (that, length) {
    if (kMaxLength() < length) {
      throw new RangeError('Invalid typed array length')
    }
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = new Uint8Array(length)
      that.__proto__ = Buffer.prototype
    } else {
      // Fallback: Return an object instance of the Buffer class
      if (that === null) {
        that = new Buffer(length)
      }
      that.length = length
    }
  
    return that
  }
  
  /**
   * The Buffer constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */
  
  function Buffer (arg, encodingOrOffset, length) {
    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
      return new Buffer(arg, encodingOrOffset, length)
    }
  
    // Common case.
    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new Error(
          'If encoding is specified then the first argument must be a string'
        )
      }
      return allocUnsafe(this, arg)
    }
    return from(this, arg, encodingOrOffset, length)
  }
  
  Buffer.poolSize = 8192 // not used by this implementation
  
  // TODO: Legacy, not needed anymore. Remove in next major version.
  Buffer._augment = function (arr) {
    arr.__proto__ = Buffer.prototype
    return arr
  }
  
  function from (that, value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('"value" argument must not be a number')
    }
  
    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
      return fromArrayBuffer(that, value, encodingOrOffset, length)
    }
  
    if (typeof value === 'string') {
      return fromString(that, value, encodingOrOffset)
    }
  
    return fromObject(that, value)
  }
  
  /**
   * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
   * if value is a number.
   * Buffer.from(str[, encoding])
   * Buffer.from(array)
   * Buffer.from(buffer)
   * Buffer.from(arrayBuffer[, byteOffset[, length]])
   **/
  Buffer.from = function (value, encodingOrOffset, length) {
    return from(null, value, encodingOrOffset, length)
  }
  
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype
    Buffer.__proto__ = Uint8Array
    if (typeof Symbol !== 'undefined' && Symbol.species &&
        Buffer[Symbol.species] === Buffer) {
      // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
      Object.defineProperty(Buffer, Symbol.species, {
        value: null,
        configurable: true
      })
    }
  }
  
  function assertSize (size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be a number')
    } else if (size < 0) {
      throw new RangeError('"size" argument must not be negative')
    }
  }
  
  function alloc (that, size, fill, encoding) {
    assertSize(size)
    if (size <= 0) {
      return createBuffer(that, size)
    }
    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpretted as a start offset.
      return typeof encoding === 'string'
        ? createBuffer(that, size).fill(fill, encoding)
        : createBuffer(that, size).fill(fill)
    }
    return createBuffer(that, size)
  }
  
  /**
   * Creates a new filled Buffer instance.
   * alloc(size[, fill[, encoding]])
   **/
  Buffer.alloc = function (size, fill, encoding) {
    return alloc(null, size, fill, encoding)
  }
  
  function allocUnsafe (that, size) {
    assertSize(size)
    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      for (var i = 0; i < size; ++i) {
        that[i] = 0
      }
    }
    return that
  }
  
  /**
   * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
   * */
  Buffer.allocUnsafe = function (size) {
    return allocUnsafe(null, size)
  }
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
   */
  Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(null, size)
  }
  
  function fromString (that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8'
    }
  
    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('"encoding" must be a valid string encoding')
    }
  
    var length = byteLength(string, encoding) | 0
    that = createBuffer(that, length)
  
    var actual = that.write(string, encoding)
  
    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      that = that.slice(0, actual)
    }
  
    return that
  }
  
  function fromArrayLike (that, array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0
    that = createBuffer(that, length)
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255
    }
    return that
  }
  
  function fromArrayBuffer (that, array, byteOffset, length) {
    array.byteLength // this throws if `array` is not a valid ArrayBuffer
  
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('\'offset\' is out of bounds')
    }
  
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('\'length\' is out of bounds')
    }
  
    if (byteOffset === undefined && length === undefined) {
      array = new Uint8Array(array)
    } else if (length === undefined) {
      array = new Uint8Array(array, byteOffset)
    } else {
      array = new Uint8Array(array, byteOffset, length)
    }
  
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = array
      that.__proto__ = Buffer.prototype
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromArrayLike(that, array)
    }
    return that
  }
  
  function fromObject (that, obj) {
    if (Buffer.isBuffer(obj)) {
      var len = checked(obj.length) | 0
      that = createBuffer(that, len)
  
      if (that.length === 0) {
        return that
      }
  
      obj.copy(that, 0, 0, len)
      return that
    }
  
    if (obj) {
      if ((typeof ArrayBuffer !== 'undefined' &&
          obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
        if (typeof obj.length !== 'number' || isnan(obj.length)) {
          return createBuffer(that, 0)
        }
        return fromArrayLike(that, obj)
      }
  
      if (obj.type === 'Buffer' && isArray(obj.data)) {
        return fromArrayLike(that, obj.data)
      }
    }
  
    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
  }
  
  function checked (length) {
    // Note: cannot use `length < kMaxLength()` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                           'size: 0x' + kMaxLength().toString(16) + ' bytes')
    }
    return length | 0
  }
  
  function SlowBuffer (length) {
    if (+length != length) { // eslint-disable-line eqeqeq
      length = 0
    }
    return Buffer.alloc(+length)
  }
  
  Buffer.isBuffer = function isBuffer (b) {
    return !!(b != null && b._isBuffer)
  }
  
  Buffer.compare = function compare (a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError('Arguments must be Buffers')
    }
  
    if (a === b) return 0
  
    var x = a.length
    var y = b.length
  
    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i]
        y = b[i]
        break
      }
    }
  
    if (x < y) return -1
    if (y < x) return 1
    return 0
  }
  
  Buffer.isEncoding = function isEncoding (encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true
      default:
        return false
    }
  }
  
  Buffer.concat = function concat (list, length) {
    if (!isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
  
    if (list.length === 0) {
      return Buffer.alloc(0)
    }
  
    var i
    if (length === undefined) {
      length = 0
      for (i = 0; i < list.length; ++i) {
        length += list[i].length
      }
    }
  
    var buffer = Buffer.allocUnsafe(length)
    var pos = 0
    for (i = 0; i < list.length; ++i) {
      var buf = list[i]
      if (!Buffer.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }
      buf.copy(buffer, pos)
      pos += buf.length
    }
    return buffer
  }
  
  function byteLength (string, encoding) {
    if (Buffer.isBuffer(string)) {
      return string.length
    }
    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
        (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
      return string.byteLength
    }
    if (typeof string !== 'string') {
      string = '' + string
    }
  
    var len = string.length
    if (len === 0) return 0
  
    // Use a for loop to avoid recursion
    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len
        case 'utf8':
        case 'utf-8':
        case undefined:
          return utf8ToBytes(string).length
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2
        case 'hex':
          return len >>> 1
        case 'base64':
          return base64ToBytes(string).length
        default:
          if (loweredCase) return utf8ToBytes(string).length // assume utf8
          encoding = ('' + encoding).toLowerCase()
          loweredCase = true
      }
    }
  }
  Buffer.byteLength = byteLength
  
  function slowToString (encoding, start, end) {
    var loweredCase = false
  
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
  
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) {
      start = 0
    }
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) {
      return ''
    }
  
    if (end === undefined || end > this.length) {
      end = this.length
    }
  
    if (end <= 0) {
      return ''
    }
  
    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0
    start >>>= 0
  
    if (end <= start) {
      return ''
    }
  
    if (!encoding) encoding = 'utf8'
  
    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end)
  
        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end)
  
        case 'ascii':
          return asciiSlice(this, start, end)
  
        case 'latin1':
        case 'binary':
          return latin1Slice(this, start, end)
  
        case 'base64':
          return base64Slice(this, start, end)
  
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end)
  
        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = (encoding + '').toLowerCase()
          loweredCase = true
      }
    }
  }
  
  // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
  // Buffer instances.
  Buffer.prototype._isBuffer = true
  
  function swap (b, n, m) {
    var i = b[n]
    b[n] = b[m]
    b[m] = i
  }
  
  Buffer.prototype.swap16 = function swap16 () {
    var len = this.length
    if (len % 2 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 16-bits')
    }
    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1)
    }
    return this
  }
  
  Buffer.prototype.swap32 = function swap32 () {
    var len = this.length
    if (len % 4 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 32-bits')
    }
    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3)
      swap(this, i + 1, i + 2)
    }
    return this
  }
  
  Buffer.prototype.swap64 = function swap64 () {
    var len = this.length
    if (len % 8 !== 0) {
      throw new RangeError('Buffer size must be a multiple of 64-bits')
    }
    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7)
      swap(this, i + 1, i + 6)
      swap(this, i + 2, i + 5)
      swap(this, i + 3, i + 4)
    }
    return this
  }
  
  Buffer.prototype.toString = function toString () {
    var length = this.length | 0
    if (length === 0) return ''
    if (arguments.length === 0) return utf8Slice(this, 0, length)
    return slowToString.apply(this, arguments)
  }
  
  Buffer.prototype.equals = function equals (b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
    if (this === b) return true
    return Buffer.compare(this, b) === 0
  }
  
  Buffer.prototype.inspect = function inspect () {
    var str = ''
    var max = exports.INSPECT_MAX_BYTES
    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
      if (this.length > max) str += ' ... '
    }
    return '<Buffer ' + str + '>'
  }
  
  Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
    if (!Buffer.isBuffer(target)) {
      throw new TypeError('Argument must be a Buffer')
    }
  
    if (start === undefined) {
      start = 0
    }
    if (end === undefined) {
      end = target ? target.length : 0
    }
    if (thisStart === undefined) {
      thisStart = 0
    }
    if (thisEnd === undefined) {
      thisEnd = this.length
    }
  
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError('out of range index')
    }
  
    if (thisStart >= thisEnd && start >= end) {
      return 0
    }
    if (thisStart >= thisEnd) {
      return -1
    }
    if (start >= end) {
      return 1
    }
  
    start >>>= 0
    end >>>= 0
    thisStart >>>= 0
    thisEnd >>>= 0
  
    if (this === target) return 0
  
    var x = thisEnd - thisStart
    var y = end - start
    var len = Math.min(x, y)
  
    var thisCopy = this.slice(thisStart, thisEnd)
    var targetCopy = target.slice(start, end)
  
    for (var i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i]
        y = targetCopy[i]
        break
      }
    }
  
    if (x < y) return -1
    if (y < x) return 1
    return 0
  }
  
  // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Buffer to search
  // - val - a string, Buffer, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf
  function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1
  
    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
      encoding = byteOffset
      byteOffset = 0
    } else if (byteOffset > 0x7fffffff) {
      byteOffset = 0x7fffffff
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000
    }
    byteOffset = +byteOffset  // Coerce to Number.
    if (isNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : (buffer.length - 1)
    }
  
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset
    if (byteOffset >= buffer.length) {
      if (dir) return -1
      else byteOffset = buffer.length - 1
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0
      else return -1
    }
  
    // Normalize val
    if (typeof val === 'string') {
      val = Buffer.from(val, encoding)
    }
  
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
    } else if (typeof val === 'number') {
      val = val & 0xFF // Search for a byte value [0-255]
      if (Buffer.TYPED_ARRAY_SUPPORT &&
          typeof Uint8Array.prototype.indexOf === 'function') {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
        }
      }
      return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
    }
  
    throw new TypeError('val must be string, number or Buffer')
  }
  
  function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
    var indexSize = 1
    var arrLength = arr.length
    var valLength = val.length
  
    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase()
      if (encoding === 'ucs2' || encoding === 'ucs-2' ||
          encoding === 'utf16le' || encoding === 'utf-16le') {
        if (arr.length < 2 || val.length < 2) {
          return -1
        }
        indexSize = 2
        arrLength /= 2
        valLength /= 2
        byteOffset /= 2
      }
    }
  
    function read (buf, i) {
      if (indexSize === 1) {
        return buf[i]
      } else {
        return buf.readUInt16BE(i * indexSize)
      }
    }
  
    var i
    if (dir) {
      var foundIndex = -1
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
        } else {
          if (foundIndex !== -1) i -= i - foundIndex
          foundIndex = -1
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
      for (i = byteOffset; i >= 0; i--) {
        var found = true
        for (var j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false
            break
          }
        }
        if (found) return i
      }
    }
  
    return -1
  }
  
  Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1
  }
  
  Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
  }
  
  Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
  }
  
  function hexWrite (buf, string, offset, length) {
    offset = Number(offset) || 0
    var remaining = buf.length - offset
    if (!length) {
      length = remaining
    } else {
      length = Number(length)
      if (length > remaining) {
        length = remaining
      }
    }
  
    // must be an even number of digits
    var strLen = string.length
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
  
    if (length > strLen / 2) {
      length = strLen / 2
    }
    for (var i = 0; i < length; ++i) {
      var parsed = parseInt(string.substr(i * 2, 2), 16)
      if (isNaN(parsed)) return i
      buf[offset + i] = parsed
    }
    return i
  }
  
  function utf8Write (buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  }
  
  function asciiWrite (buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length)
  }
  
  function latin1Write (buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length)
  }
  
  function base64Write (buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length)
  }
  
  function ucs2Write (buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  }
  
  Buffer.prototype.write = function write (string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8'
      length = this.length
      offset = 0
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset
      length = this.length
      offset = 0
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset | 0
      if (isFinite(length)) {
        length = length | 0
        if (encoding === undefined) encoding = 'utf8'
      } else {
        encoding = length
        length = undefined
      }
    // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      throw new Error(
        'Buffer.write(string, encoding, offset[, length]) is no longer supported'
      )
    }
  
    var remaining = this.length - offset
    if (length === undefined || length > remaining) length = remaining
  
    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
      throw new RangeError('Attempt to write outside buffer bounds')
    }
  
    if (!encoding) encoding = 'utf8'
  
    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length)
  
        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length)
  
        case 'ascii':
          return asciiWrite(this, string, offset, length)
  
        case 'latin1':
        case 'binary':
          return latin1Write(this, string, offset, length)
  
        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length)
  
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length)
  
        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = ('' + encoding).toLowerCase()
          loweredCase = true
      }
    }
  }
  
  Buffer.prototype.toJSON = function toJSON () {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  }
  
  function base64Slice (buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf)
    } else {
      return base64.fromByteArray(buf.slice(start, end))
    }
  }
  
  function utf8Slice (buf, start, end) {
    end = Math.min(buf.length, end)
    var res = []
  
    var i = start
    while (i < end) {
      var firstByte = buf[i]
      var codePoint = null
      var bytesPerSequence = (firstByte > 0xEF) ? 4
        : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
        : 1
  
      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint
  
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte
            }
            break
          case 2:
            secondByte = buf[i + 1]
            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint
              }
            }
            break
          case 3:
            secondByte = buf[i + 1]
            thirdByte = buf[i + 2]
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint
              }
            }
            break
          case 4:
            secondByte = buf[i + 1]
            thirdByte = buf[i + 2]
            fourthByte = buf[i + 3]
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint
              }
            }
        }
      }
  
      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD
        bytesPerSequence = 1
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000
        res.push(codePoint >>> 10 & 0x3FF | 0xD800)
        codePoint = 0xDC00 | codePoint & 0x3FF
      }
  
      res.push(codePoint)
      i += bytesPerSequence
    }
  
    return decodeCodePointsArray(res)
  }
  
  // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety
  var MAX_ARGUMENTS_LENGTH = 0x1000
  
  function decodeCodePointsArray (codePoints) {
    var len = codePoints.length
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    }
  
    // Decode in chunks to avoid "call stack size exceeded".
    var res = ''
    var i = 0
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      )
    }
    return res
  }
  
  function asciiSlice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)
  
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7F)
    }
    return ret
  }
  
  function latin1Slice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)
  
    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i])
    }
    return ret
  }
  
  function hexSlice (buf, start, end) {
    var len = buf.length
  
    if (!start || start < 0) start = 0
    if (!end || end < 0 || end > len) end = len
  
    var out = ''
    for (var i = start; i < end; ++i) {
      out += toHex(buf[i])
    }
    return out
  }
  
  function utf16leSlice (buf, start, end) {
    var bytes = buf.slice(start, end)
    var res = ''
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
    }
    return res
  }
  
  Buffer.prototype.slice = function slice (start, end) {
    var len = this.length
    start = ~~start
    end = end === undefined ? len : ~~end
  
    if (start < 0) {
      start += len
      if (start < 0) start = 0
    } else if (start > len) {
      start = len
    }
  
    if (end < 0) {
      end += len
      if (end < 0) end = 0
    } else if (end > len) {
      end = len
    }
  
    if (end < start) end = start
  
    var newBuf
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      newBuf = this.subarray(start, end)
      newBuf.__proto__ = Buffer.prototype
    } else {
      var sliceLen = end - start
      newBuf = new Buffer(sliceLen, undefined)
      for (var i = 0; i < sliceLen; ++i) {
        newBuf[i] = this[i + start]
      }
    }
  
    return newBuf
  }
  
  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  function checkOffset (offset, ext, length) {
    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
  }
  
  Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)
  
    var val = this[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul
    }
  
    return val
  }
  
  Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) {
      checkOffset(offset, byteLength, this.length)
    }
  
    var val = this[offset + --byteLength]
    var mul = 1
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul
    }
  
    return val
  }
  
  Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length)
    return this[offset]
  }
  
  Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    return this[offset] | (this[offset + 1] << 8)
  }
  
  Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    return (this[offset] << 8) | this[offset + 1]
  }
  
  Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return ((this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16)) +
        (this[offset + 3] * 0x1000000)
  }
  
  Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
  }
  
  Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)
  
    var val = this[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul
    }
    mul *= 0x80
  
    if (val >= mul) val -= Math.pow(2, 8 * byteLength)
  
    return val
  }
  
  Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)
  
    var i = byteLength
    var mul = 1
    var val = this[offset + --i]
    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul
    }
    mul *= 0x80
  
    if (val >= mul) val -= Math.pow(2, 8 * byteLength)
  
    return val
  }
  
  Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length)
    if (!(this[offset] & 0x80)) return (this[offset])
    return ((0xff - this[offset] + 1) * -1)
  }
  
  Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset] | (this[offset + 1] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }
  
  Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset + 1] | (this[offset] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }
  
  Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
  }
  
  Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
  
    return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
  }
  
  Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, true, 23, 4)
  }
  
  Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, false, 23, 4)
  }
  
  Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, true, 52, 8)
  }
  
  Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, false, 52, 8)
  }
  
  function checkInt (buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
  }
  
  Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      checkInt(this, value, offset, byteLength, maxBytes, 0)
    }
  
    var mul = 1
    var i = 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      checkInt(this, value, offset, byteLength, maxBytes, 0)
    }
  
    var i = byteLength - 1
    var mul = 1
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
    this[offset] = (value & 0xff)
    return offset + 1
  }
  
  function objectWriteUInt16 (buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffff + value + 1
    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
      buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
        (littleEndian ? i : 1 - i) * 8
    }
  }
  
  Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
    } else {
      objectWriteUInt16(this, value, offset, true)
    }
    return offset + 2
  }
  
  Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 8)
      this[offset + 1] = (value & 0xff)
    } else {
      objectWriteUInt16(this, value, offset, false)
    }
    return offset + 2
  }
  
  function objectWriteUInt32 (buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffffffff + value + 1
    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
      buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
    }
  }
  
  Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = (value >>> 24)
      this[offset + 2] = (value >>> 16)
      this[offset + 1] = (value >>> 8)
      this[offset] = (value & 0xff)
    } else {
      objectWriteUInt32(this, value, offset, true)
    }
    return offset + 4
  }
  
  Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 24)
      this[offset + 1] = (value >>> 16)
      this[offset + 2] = (value >>> 8)
      this[offset + 3] = (value & 0xff)
    } else {
      objectWriteUInt32(this, value, offset, false)
    }
    return offset + 4
  }
  
  Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1)
  
      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }
  
    var i = 0
    var mul = 1
    var sub = 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1)
  
      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }
  
    var i = byteLength - 1
    var mul = 1
    var sub = 0
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }
  
    return offset + byteLength
  }
  
  Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
    if (value < 0) value = 0xff + value + 1
    this[offset] = (value & 0xff)
    return offset + 1
  }
  
  Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
    } else {
      objectWriteUInt16(this, value, offset, true)
    }
    return offset + 2
  }
  
  Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 8)
      this[offset + 1] = (value & 0xff)
    } else {
      objectWriteUInt16(this, value, offset, false)
    }
    return offset + 2
  }
  
  Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
      this[offset + 2] = (value >>> 16)
      this[offset + 3] = (value >>> 24)
    } else {
      objectWriteUInt32(this, value, offset, true)
    }
    return offset + 4
  }
  
  Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    if (value < 0) value = 0xffffffff + value + 1
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 24)
      this[offset + 1] = (value >>> 16)
      this[offset + 2] = (value >>> 8)
      this[offset + 3] = (value & 0xff)
    } else {
      objectWriteUInt32(this, value, offset, false)
    }
    return offset + 4
  }
  
  function checkIEEE754 (buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
    if (offset < 0) throw new RangeError('Index out of range')
  }
  
  function writeFloat (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4)
    return offset + 4
  }
  
  Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert)
  }
  
  Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert)
  }
  
  function writeDouble (buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8)
    return offset + 8
  }
  
  Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert)
  }
  
  Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert)
  }
  
  // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Buffer.prototype.copy = function copy (target, targetStart, start, end) {
    if (!start) start = 0
    if (!end && end !== 0) end = this.length
    if (targetStart >= target.length) targetStart = target.length
    if (!targetStart) targetStart = 0
    if (end > 0 && end < start) end = start
  
    // Copy 0 bytes; we're done
    if (end === start) return 0
    if (target.length === 0 || this.length === 0) return 0
  
    // Fatal error conditions
    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
    if (end < 0) throw new RangeError('sourceEnd out of bounds')
  
    // Are we oob?
    if (end > this.length) end = this.length
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start
    }
  
    var len = end - start
    var i
  
    if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start]
      }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; ++i) {
        target[i + targetStart] = this[i + start]
      }
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, start + len),
        targetStart
      )
    }
  
    return len
  }
  
  // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])
  Buffer.prototype.fill = function fill (val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start
        start = 0
        end = this.length
      } else if (typeof end === 'string') {
        encoding = end
        end = this.length
      }
      if (val.length === 1) {
        var code = val.charCodeAt(0)
        if (code < 256) {
          val = code
        }
      }
      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string')
      }
      if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
      }
    } else if (typeof val === 'number') {
      val = val & 255
    }
  
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index')
    }
  
    if (end <= start) {
      return this
    }
  
    start = start >>> 0
    end = end === undefined ? this.length : end >>> 0
  
    if (!val) val = 0
  
    var i
    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val
      }
    } else {
      var bytes = Buffer.isBuffer(val)
        ? val
        : utf8ToBytes(new Buffer(val, encoding).toString())
      var len = bytes.length
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len]
      }
    }
  
    return this
  }
  
  // HELPER FUNCTIONS
  // ================
  
  var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
  
  function base64clean (str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, '')
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return ''
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '='
    }
    return str
  }
  
  function stringtrim (str) {
    if (str.trim) return str.trim()
    return str.replace(/^\s+|\s+$/g, '')
  }
  
  function toHex (n) {
    if (n < 16) return '0' + n.toString(16)
    return n.toString(16)
  }
  
  function utf8ToBytes (string, units) {
    units = units || Infinity
    var codePoint
    var length = string.length
    var leadSurrogate = null
    var bytes = []
  
    for (var i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i)
  
      // is surrogate component
      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            continue
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            continue
          }
  
          // valid lead
          leadSurrogate = codePoint
  
          continue
        }
  
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        }
  
        // valid surrogate pair
        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      }
  
      leadSurrogate = null
  
      // encode utf8
      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break
        bytes.push(codePoint)
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break
        bytes.push(
          codePoint >> 0x6 | 0xC0,
          codePoint & 0x3F | 0x80
        )
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break
        bytes.push(
          codePoint >> 0xC | 0xE0,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        )
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break
        bytes.push(
          codePoint >> 0x12 | 0xF0,
          codePoint >> 0xC & 0x3F | 0x80,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        )
      } else {
        throw new Error('Invalid code point')
      }
    }
  
    return bytes
  }
  
  function asciiToBytes (str) {
    var byteArray = []
    for (var i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF)
    }
    return byteArray
  }
  
  function utf16leToBytes (str, units) {
    var c, hi, lo
    var byteArray = []
    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break
  
      c = str.charCodeAt(i)
      hi = c >> 8
      lo = c % 256
      byteArray.push(lo)
      byteArray.push(hi)
    }
  
    return byteArray
  }
  
  function base64ToBytes (str) {
    return base64.toByteArray(base64clean(str))
  }
  
  function blitBuffer (src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if ((i + offset >= dst.length) || (i >= src.length)) break
      dst[i + offset] = src[i]
    }
    return i
  }
  
  function isnan (val) {
    return val !== val // eslint-disable-line no-self-compare
  }
  
  }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"base64-js":49,"ieee754":88,"isarray":52}],52:[function(require,module,exports){
  var toString = {}.toString;
  
  module.exports = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };
  
  },{}],53:[function(require,module,exports){
  (function (Buffer){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // NOTE: These type checking functions intentionally don't use `instanceof`
  // because it is fragile and can be easily faked with `Object.create()`.
  
  function isArray(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
  }
  exports.isArray = isArray;
  
  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }
  exports.isBoolean = isBoolean;
  
  function isNull(arg) {
    return arg === null;
  }
  exports.isNull = isNull;
  
  function isNullOrUndefined(arg) {
    return arg == null;
  }
  exports.isNullOrUndefined = isNullOrUndefined;
  
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  exports.isNumber = isNumber;
  
  function isString(arg) {
    return typeof arg === 'string';
  }
  exports.isString = isString;
  
  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }
  exports.isSymbol = isSymbol;
  
  function isUndefined(arg) {
    return arg === void 0;
  }
  exports.isUndefined = isUndefined;
  
  function isRegExp(re) {
    return objectToString(re) === '[object RegExp]';
  }
  exports.isRegExp = isRegExp;
  
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  exports.isObject = isObject;
  
  function isDate(d) {
    return objectToString(d) === '[object Date]';
  }
  exports.isDate = isDate;
  
  function isError(e) {
    return (objectToString(e) === '[object Error]' || e instanceof Error);
  }
  exports.isError = isError;
  
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  exports.isFunction = isFunction;
  
  function isPrimitive(arg) {
    return arg === null ||
           typeof arg === 'boolean' ||
           typeof arg === 'number' ||
           typeof arg === 'string' ||
           typeof arg === 'symbol' ||  // ES6 symbol
           typeof arg === 'undefined';
  }
  exports.isPrimitive = isPrimitive;
  
  exports.isBuffer = Buffer.isBuffer;
  
  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }
  
  }).call(this,{"isBuffer":require("../../is-buffer/index.js")})
  },{"../../is-buffer/index.js":90}],54:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  function EventEmitter() {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  }
  module.exports = EventEmitter;
  
  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;
  
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;
  
  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;
  
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function(n) {
    if (!isNumber(n) || n < 0 || isNaN(n))
      throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };
  
  EventEmitter.prototype.emit = function(type) {
    var er, handler, len, args, i, listeners;
  
    if (!this._events)
      this._events = {};
  
    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events.error ||
          (isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          // At least give some kind of context to the user
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
      }
    }
  
    handler = this._events[type];
  
    if (isUndefined(handler))
      return false;
  
    if (isFunction(handler)) {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
    } else if (isObject(handler)) {
      args = Array.prototype.slice.call(arguments, 1);
      listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++)
        listeners[i].apply(this, args);
    }
  
    return true;
  };
  
  EventEmitter.prototype.addListener = function(type, listener) {
    var m;
  
    if (!isFunction(listener))
      throw TypeError('listener must be a function');
  
    if (!this._events)
      this._events = {};
  
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener)
      this.emit('newListener', type,
                isFunction(listener.listener) ?
                listener.listener : listener);
  
    if (!this._events[type])
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    else if (isObject(this._events[type]))
      // If we've already got an array, just append.
      this._events[type].push(listener);
    else
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
  
    // Check for listener leak
    if (isObject(this._events[type]) && !this._events[type].warned) {
      if (!isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }
  
      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        if (typeof console.trace === 'function') {
          // not supported in IE 10
          console.trace();
        }
      }
    }
  
    return this;
  };
  
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  
  EventEmitter.prototype.once = function(type, listener) {
    if (!isFunction(listener))
      throw TypeError('listener must be a function');
  
    var fired = false;
  
    function g() {
      this.removeListener(type, g);
  
      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }
  
    g.listener = listener;
    this.on(type, g);
  
    return this;
  };
  
  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener = function(type, listener) {
    var list, position, length, i;
  
    if (!isFunction(listener))
      throw TypeError('listener must be a function');
  
    if (!this._events || !this._events[type])
      return this;
  
    list = this._events[type];
    length = list.length;
    position = -1;
  
    if (list === listener ||
        (isFunction(list.listener) && list.listener === listener)) {
      delete this._events[type];
      if (this._events.removeListener)
        this.emit('removeListener', type, listener);
  
    } else if (isObject(list)) {
      for (i = length; i-- > 0;) {
        if (list[i] === listener ||
            (list[i].listener && list[i].listener === listener)) {
          position = i;
          break;
        }
      }
  
      if (position < 0)
        return this;
  
      if (list.length === 1) {
        list.length = 0;
        delete this._events[type];
      } else {
        list.splice(position, 1);
      }
  
      if (this._events.removeListener)
        this.emit('removeListener', type, listener);
    }
  
    return this;
  };
  
  EventEmitter.prototype.removeAllListeners = function(type) {
    var key, listeners;
  
    if (!this._events)
      return this;
  
    // not listening for removeListener, no need to emit
    if (!this._events.removeListener) {
      if (arguments.length === 0)
        this._events = {};
      else if (this._events[type])
        delete this._events[type];
      return this;
    }
  
    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      for (key in this._events) {
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      return this;
    }
  
    listeners = this._events[type];
  
    if (isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      while (listeners.length)
        this.removeListener(type, listeners[listeners.length - 1]);
    }
    delete this._events[type];
  
    return this;
  };
  
  EventEmitter.prototype.listeners = function(type) {
    var ret;
    if (!this._events || !this._events[type])
      ret = [];
    else if (isFunction(this._events[type]))
      ret = [this._events[type]];
    else
      ret = this._events[type].slice();
    return ret;
  };
  
  EventEmitter.prototype.listenerCount = function(type) {
    if (this._events) {
      var evlistener = this._events[type];
  
      if (isFunction(evlistener))
        return 1;
      else if (evlistener)
        return evlistener.length;
    }
    return 0;
  };
  
  EventEmitter.listenerCount = function(emitter, type) {
    return emitter.listenerCount(type);
  };
  
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  
  function isUndefined(arg) {
    return arg === void 0;
  }
  
  },{}],55:[function(require,module,exports){
  'use strict';
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var FunctionBuilderBase = require('../function-builder-base');
  var CPUFunctionNode = require('./function-node');
  
  /**
   * @class CPUFunctionBuilder
   *
   * @extends FunctionBuilderBase
   *
   * @desc Builds functions to execute on CPU from JavaScript function Strings
   *
   */
  module.exports = function (_FunctionBuilderBase) {
    _inherits(CPUFunctionBuilder, _FunctionBuilderBase);
  
    function CPUFunctionBuilder() {
      _classCallCheck(this, CPUFunctionBuilder);
  
      var _this = _possibleConstructorReturn(this, (CPUFunctionBuilder.__proto__ || Object.getPrototypeOf(CPUFunctionBuilder)).call(this));
  
      _this.Node = CPUFunctionNode;
      return _this;
    }
  
    return CPUFunctionBuilder;
  }(FunctionBuilderBase);
  },{"../function-builder-base":60,"./function-node":56}],56:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var BaseFunctionNode = require('../function-node-base');
  var utils = require('../../core/utils');
  
  /**
   * @class CPUFunctionNode
   * 
   * @extends BaseFunctionNode
   *
   * @desc [INTERNAL] Represents a single function, inside JS
   *
   * <p>This handles all the raw state, converted state, etc. Of a single function.</p>
   *
   * @prop functionName         - {String}        Name of the function
   * @prop jsFunction           - {Function}   The JS Function the node represents
   * @prop jsFunctionString     - {String}        jsFunction.toString()
   * @prop paramNames           - {String[]}  Parameter names of the function
   * @prop paramTypes           - {String[]}  Shader land parameters type assumption
   * @prop isRootKernel         - {Boolean}       Special indicator, for kernel function
   * @prop webglFunctionString  - {String}        webgl converted function string
   * @prop openglFunctionString - {String}        opengl converted function string
   * @prop calledFunctions      - {String[]}  List of all the functions called
   * @prop initVariables        - {String[]}  List of variables initialized in the function
   * @prop readVariables        - {String[]}  List of variables read operations occur
   * @prop writeVariables       - {String[]}  List of variables write operations occur
   *
   */
  module.exports = function (_BaseFunctionNode) {
    _inherits(CPUFunctionNode, _BaseFunctionNode);
  
    function CPUFunctionNode() {
      _classCallCheck(this, CPUFunctionNode);
  
      return _possibleConstructorReturn(this, (CPUFunctionNode.__proto__ || Object.getPrototypeOf(CPUFunctionNode)).apply(this, arguments));
    }
  
    _createClass(CPUFunctionNode, [{
      key: 'generate',
      value: function generate() {
        if (this.debug) {
          console.log(this);
        }
        this.functionStringArray = this.astGeneric(this.getJsAST(), [], this);
        this.functionString = this.functionStringArray.join('').trim();
        return this.functionString;
      }
  
      /**
     * @memberOf CPUFunctionNode#
     * @function
     * @name getFunctionPrototypeString
     *
     * @desc Returns the converted JS function
     *
     * @returns {String} function string, result is cached under this.getFunctionPrototypeString
     *
     */
  
    }, {
      key: 'getFunctionPrototypeString',
      value: function getFunctionPrototypeString() {
        if (this.webGlFunctionPrototypeString) {
          return this.webGlFunctionPrototypeString;
        }
        return this.webGlFunctionPrototypeString = this.generate();
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astGeneric
     *
     * @desc Parses the abstract syntax tree for generically to its respective function
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the parsed cpu string array
     */
  
    }, {
      key: 'astGeneric',
      value: function astGeneric(ast, retArr, funcParam) {
        if (ast === null) {
          throw this.astErrorOutput('NULL ast', ast, funcParam);
        } else {
          if (Array.isArray(ast)) {
            for (var i = 0; i < ast.length; i++) {
              this.astGeneric(ast[i], retArr, funcParam);
            }
            return retArr;
          }
  
          switch (ast.type) {
            case 'FunctionDeclaration':
              return this.astFunctionDeclaration(ast, retArr, funcParam);
            case 'FunctionExpression':
              return this.astFunctionExpression(ast, retArr, funcParam);
            case 'ReturnStatement':
              return this.astReturnStatement(ast, retArr, funcParam);
            case 'Literal':
              return this.astLiteral(ast, retArr, funcParam);
            case 'BinaryExpression':
              return this.astBinaryExpression(ast, retArr, funcParam);
            case 'Identifier':
              return this.astIdentifierExpression(ast, retArr, funcParam);
            case 'AssignmentExpression':
              return this.astAssignmentExpression(ast, retArr, funcParam);
            case 'ExpressionStatement':
              return this.astExpressionStatement(ast, retArr, funcParam);
            case 'EmptyStatement':
              return this.astEmptyStatement(ast, retArr, funcParam);
            case 'BlockStatement':
              return this.astBlockStatement(ast, retArr, funcParam);
            case 'IfStatement':
              return this.astIfStatement(ast, retArr, funcParam);
            case 'BreakStatement':
              return this.astBreakStatement(ast, retArr, funcParam);
            case 'ContinueStatement':
              return this.astContinueStatement(ast, retArr, funcParam);
            case 'ForStatement':
              return this.astForStatement(ast, retArr, funcParam);
            case 'WhileStatement':
              return this.astWhileStatement(ast, retArr, funcParam);
            case 'VariableDeclaration':
              return this.astVariableDeclaration(ast, retArr, funcParam);
            case 'VariableDeclarator':
              return this.astVariableDeclarator(ast, retArr, funcParam);
            case 'ThisExpression':
              return this.astThisExpression(ast, retArr, funcParam);
            case 'SequenceExpression':
              return this.astSequenceExpression(ast, retArr, funcParam);
            case 'UnaryExpression':
              return this.astUnaryExpression(ast, retArr, funcParam);
            case 'UpdateExpression':
              return this.astUpdateExpression(ast, retArr, funcParam);
            case 'LogicalExpression':
              return this.astLogicalExpression(ast, retArr, funcParam);
            case 'MemberExpression':
              return this.astMemberExpression(ast, retArr, funcParam);
            case 'CallExpression':
              return this.astCallExpression(ast, retArr, funcParam);
            case 'ArrayExpression':
              return this.astArrayExpression(ast, retArr, funcParam);
            case 'DebuggerStatement':
              return this.astDebuggerStatement(ast, retArr, funcParam);
          }
  
          throw this.astErrorOutput('Unknown ast type : ' + ast.type, ast, funcParam);
        }
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astFunctionDeclaration
     *
     * @desc Parses the abstract syntax tree for to its *named function declaration*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astFunctionDeclaration',
      value: function astFunctionDeclaration(ast, retArr, funcParam) {
        if (this.addFunction) {
          this.addFunction(null, utils.getAstString(this.jsFunctionString, ast));
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astFunctionPrototype
     * @static
     *
     * @desc Parses the abstract syntax tree for to its *named function prototype*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astFunctionExpression',
  
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astFunctionExpression
     *
     * @desc Parses the abstract syntax tree for to its *named function*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
      value: function astFunctionExpression(ast, retArr, funcParam) {
  
        // Setup function return type and name
        if (!funcParam.isRootKernel) {
          retArr.push('function');
          funcParam.kernalAst = ast;
          retArr.push(' ');
          retArr.push(funcParam.functionName);
          retArr.push('(');
  
          // Arguments handling
          for (var i = 0; i < funcParam.paramNames.length; ++i) {
            var paramName = funcParam.paramNames[i];
  
            if (i > 0) {
              retArr.push(', ');
            }
  
            retArr.push(' ');
            retArr.push('user_');
            retArr.push(paramName);
          }
  
          // Function opening
          retArr.push(') {\n');
        }
  
        // Body statement iteration
        for (var _i = 0; _i < ast.body.body.length; ++_i) {
          this.astGeneric(ast.body.body[_i], retArr, funcParam);
          retArr.push('\n');
        }
  
        if (!funcParam.isRootKernel) {
          // Function closing
          retArr.push('}\n');
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astReturnStatement
     *
     * @desc Parses the abstract syntax tree for to *return* statement
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Object} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astReturnStatement',
      value: function astReturnStatement(ast, retArr, funcParam) {
        if (funcParam.isRootKernel) {
          retArr.push('kernelResult = ');
          this.astGeneric(ast.argument, retArr, funcParam);
          retArr.push(';');
        } else if (funcParam.isSubKernel) {
          retArr.push(funcParam.functionName + 'Result = ');
          this.astGeneric(ast.argument, retArr, funcParam);
          retArr.push(';');
          retArr.push('return ' + funcParam.functionName + 'Result;');
        } else {
          retArr.push('return ');
          this.astGeneric(ast.argument, retArr, funcParam);
          retArr.push(';');
        }
  
        //throw this.astErrorOutput(
        //	'Non main function return, is not supported : '+funcParam.currentFunctionNamespace,
        //	ast, funcParam
        //);
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astLiteral
     *
     * @desc Parses the abstract syntax tree for *literal value*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astLiteral',
      value: function astLiteral(ast, retArr, funcParam) {
  
        // Reject non numeric literals
        if (isNaN(ast.value)) {
          throw this.astErrorOutput('Non-numeric literal not supported : ' + ast.value, ast, funcParam);
        }
  
        retArr.push(ast.value);
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astBinaryExpression
     *
     * @desc Parses the abstract syntax tree for *binary* expression
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astBinaryExpression',
      value: function astBinaryExpression(ast, retArr, funcParam) {
        retArr.push('(');
        this.astGeneric(ast.left, retArr, funcParam);
        retArr.push(ast.operator);
        this.astGeneric(ast.right, retArr, funcParam);
        retArr.push(')');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astIdentifierExpression
     *
     * @desc Parses the abstract syntax tree for *identifier* expression
     *
     * @param {Object} idtNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astIdentifierExpression',
      value: function astIdentifierExpression(idtNode, retArr, funcParam) {
        if (idtNode.type !== 'Identifier') {
          throw this.astErrorOutput('IdentifierExpression - not an Identifier', idtNode, funcParam);
        }
  
        switch (idtNode.name) {
          case 'gpu_threadX':
            retArr.push('threadId.x');
            break;
          case 'gpu_threadY':
            retArr.push('threadId.y');
            break;
          case 'gpu_threadZ':
            retArr.push('threadId.z');
            break;
          case 'gpu_outputX':
            retArr.push('uOutputDim.x');
            break;
          case 'gpu_outputY':
            retArr.push('uOutputDim.y');
            break;
          case 'gpu_outputZ':
            retArr.push('uOutputDim.z');
            break;
          default:
            if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
              retArr.push('constants_' + idtNode.name);
            } else {
              var userParamName = funcParam.getUserParamName(idtNode.name);
              if (userParamName !== null) {
                retArr.push('user_' + userParamName);
              } else {
                retArr.push('user_' + idtNode.name);
              }
            }
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astForStatement
     *
     * @desc Parses the abstract syntax tree forfor *for-loop* expression
     *
     * @param {Object} forNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the parsed cpu string
     */
  
    }, {
      key: 'astForStatement',
      value: function astForStatement(forNode, retArr, funcParam) {
        if (forNode.type !== 'ForStatement') {
          throw this.astErrorOutput('Invalid for statment', forNode, funcParam);
        }
  
        if (forNode.test && forNode.test.type === 'BinaryExpression') {
          if ((forNode.test.right.type === 'Identifier' || forNode.test.right.type === 'Literal') && forNode.test.operator === '<' && this.isIdentifierConstant(forNode.test.right.name) === false) {
  
            if (!this.loopMaxIterations) {
              console.warn('Warning: loopMaxIterations is not set! Using default of 1000 which may result in unintended behavior.');
              console.warn('Set loopMaxIterations or use a for loop of fixed length to silence this message.');
            }
  
            retArr.push('for (');
            this.astGeneric(forNode.init, retArr, funcParam);
            if (retArr[retArr.length - 1] !== ';') {
              retArr.push(';');
            }
            this.astGeneric(forNode.test.left, retArr, funcParam);
            retArr.push(forNode.test.operator);
            retArr.push('LOOP_MAX');
            retArr.push(';');
            this.astGeneric(forNode.update, retArr, funcParam);
            retArr.push(')');
  
            retArr.push('{\n');
            retArr.push('if (');
            this.astGeneric(forNode.test.left, retArr, funcParam);
            retArr.push(forNode.test.operator);
            this.astGeneric(forNode.test.right, retArr, funcParam);
            retArr.push(') {\n');
            if (forNode.body.type === 'BlockStatement') {
              for (var i = 0; i < forNode.body.body.length; i++) {
                this.astGeneric(forNode.body.body[i], retArr, funcParam);
              }
            } else {
              this.astGeneric(forNode.body, retArr, funcParam);
            }
            retArr.push('} else {\n');
            retArr.push('break;\n');
            retArr.push('}\n');
            retArr.push('}\n');
  
            return retArr;
          } else if (forNode.init.declarations) {
            var declarations = JSON.parse(JSON.stringify(forNode.init.declarations));
            var updateArgument = forNode.update.argument;
            if (!Array.isArray(declarations) || declarations.length < 1) {
              console.log(this.jsFunctionString);
              throw new Error('Error: Incompatible for loop declaration');
            }
  
            if (declarations.length > 1) {
              var initArgument = null;
              for (var _i2 = 0; _i2 < declarations.length; _i2++) {
                var declaration = declarations[_i2];
                if (declaration.id.name === updateArgument.name) {
                  initArgument = declaration;
                  declarations.splice(_i2, 1);
                } else {
                  retArr.push('var ');
                  this.astGeneric(declaration, retArr, funcParam);
                  retArr.push(';');
                }
              }
  
              retArr.push('for (let ');
              this.astGeneric(initArgument, retArr, funcParam);
              retArr.push(';');
            } else {
              retArr.push('for (');
              this.astGeneric(forNode.init, retArr, funcParam);
            }
  
            this.astGeneric(forNode.test, retArr, funcParam);
            retArr.push(';');
            this.astGeneric(forNode.update, retArr, funcParam);
            retArr.push(')');
            this.astGeneric(forNode.body, retArr, funcParam);
            return retArr;
          }
        }
  
        throw this.astErrorOutput('Invalid for statement', forNode, funcParam);
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astWhileStatement
     *
     * @desc Parses the abstract syntax tree for *while* loop
     *
     *
     * @param {Object} whileNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the parsed openclgl string
     */
  
    }, {
      key: 'astWhileStatement',
      value: function astWhileStatement(whileNode, retArr, funcParam) {
        if (whileNode.type !== 'WhileStatement') {
          throw this.astErrorOutput('Invalid while statment', whileNode, funcParam);
        }
  
        retArr.push('for (let i = 0; i < LOOP_MAX; i++) {');
        retArr.push('if (');
        this.astGeneric(whileNode.test, retArr, funcParam);
        retArr.push(') {\n');
        this.astGeneric(whileNode.body, retArr, funcParam);
        retArr.push('} else {\n');
        retArr.push('break;\n');
        retArr.push('}\n');
        retArr.push('}\n');
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astAssignmentExpression
     *
     * @desc Parses the abstract syntax tree for *Assignment* Expression
     *
     * @param {Object} assNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astAssignmentExpression',
      value: function astAssignmentExpression(assNode, retArr, funcParam) {
        this.astGeneric(assNode.left, retArr, funcParam);
        retArr.push(assNode.operator);
        this.astGeneric(assNode.right, retArr, funcParam);
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astEmptyStatement
     *
     * @desc Parses the abstract syntax tree for an *Empty* Statement
     *
     * @param {Object} eNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astEmptyStatement',
      value: function astEmptyStatement(eNode, retArr, funcParam) {
        //retArr.push(';\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astBlockStatement
     *
     * @desc Parses the abstract syntax tree for *Block* statement
     *
     * @param {Object} bNode - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astBlockStatement',
      value: function astBlockStatement(bNode, retArr, funcParam) {
        retArr.push('{\n');
        for (var i = 0; i < bNode.body.length; i++) {
          this.astGeneric(bNode.body[i], retArr, funcParam);
        }
        retArr.push('}\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astExpressionStatement
     *
     * @desc Parses the abstract syntax tree for *generic expression* statement
     *
     * @param {Object} esNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astExpressionStatement',
      value: function astExpressionStatement(esNode, retArr, funcParam) {
        this.astGeneric(esNode.expression, retArr, funcParam);
        retArr.push(';\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astVariableDeclaration
     *
     * @desc Parses the abstract syntax tree for *Variable Declaration*
     *
     * @param {Object} vardecNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astVariableDeclaration',
      value: function astVariableDeclaration(vardecNode, retArr, funcParam) {
        retArr.push('var ');
        for (var i = 0; i < vardecNode.declarations.length; i++) {
          if (i > 0) {
            retArr.push(',');
          }
          this.astGeneric(vardecNode.declarations[i], retArr, funcParam);
        }
        retArr.push(';');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astVariableDeclarator
     *
     * @desc Parses the abstract syntax tree for *Variable Declarator*
     *
     * @param {Object} ivardecNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astVariableDeclarator',
      value: function astVariableDeclarator(ivardecNode, retArr, funcParam) {
        this.astGeneric(ivardecNode.id, retArr, funcParam);
        if (ivardecNode.init !== null) {
          retArr.push('=');
          this.astGeneric(ivardecNode.init, retArr, funcParam);
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astIfStatement
     *
     * @desc Parses the abstract syntax tree for *If* Statement
     *
     * @param {Object} ifNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astIfStatement',
      value: function astIfStatement(ifNode, retArr, funcParam) {
        retArr.push('if (');
        this.astGeneric(ifNode.test, retArr, funcParam);
        retArr.push(')');
        if (ifNode.consequent.type === 'BlockStatement') {
          this.astGeneric(ifNode.consequent, retArr, funcParam);
        } else {
          retArr.push(' {\n');
          this.astGeneric(ifNode.consequent, retArr, funcParam);
          retArr.push('\n}\n');
        }
  
        if (ifNode.alternate) {
          retArr.push('else ');
          if (ifNode.alternate.type === 'BlockStatement') {
            this.astGeneric(ifNode.alternate, retArr, funcParam);
          } else {
            retArr.push(' {\n');
            this.astGeneric(ifNode.alternate, retArr, funcParam);
            retArr.push('\n}\n');
          }
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astBreakStatement
     *
     * @desc Parses the abstract syntax tree for *Break* Statement
     *
     * @param {Object} brNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astBreakStatement',
      value: function astBreakStatement(brNode, retArr, funcParam) {
        retArr.push('break;\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astContinueStatement
     *
     * @desc Parses the abstract syntax tree for *Continue* Statement
     *
     * @param {Object} crNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astContinueStatement',
      value: function astContinueStatement(crNode, retArr, funcParam) {
        retArr.push('continue;\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astLogicalExpression
     *
     * @desc Parses the abstract syntax tree for *Logical* Expression
     *
     * @param {Object} logNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astLogicalExpression',
      value: function astLogicalExpression(logNode, retArr, funcParam) {
        retArr.push('(');
        this.astGeneric(logNode.left, retArr, funcParam);
        retArr.push(logNode.operator);
        this.astGeneric(logNode.right, retArr, funcParam);
        retArr.push(')');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astUpdateExpression
     *
     * @desc Parses the abstract syntax tree for *Update* Expression
     *
     * @param {Object} uNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astUpdateExpression',
      value: function astUpdateExpression(uNode, retArr, funcParam) {
        if (uNode.prefix) {
          retArr.push(uNode.operator);
          this.astGeneric(uNode.argument, retArr, funcParam);
        } else {
          this.astGeneric(uNode.argument, retArr, funcParam);
          retArr.push(uNode.operator);
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astUnaryExpression
     *
     * @desc Parses the abstract syntax tree for *Unary* Expression
     *
     * @param {Object} uNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astUnaryExpression',
      value: function astUnaryExpression(uNode, retArr, funcParam) {
        if (uNode.prefix) {
          retArr.push(uNode.operator);
          this.astGeneric(uNode.argument, retArr, funcParam);
        } else {
          this.astGeneric(uNode.argument, retArr, funcParam);
          retArr.push(uNode.operator);
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astThisExpression
     *
     * @desc Parses the abstract syntax tree for *This* expression
     *
     * @param {Object} tNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astThisExpression',
      value: function astThisExpression(tNode, retArr, funcParam) {
        retArr.push('_this');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astMemberExpression
     *
     * @desc Parses the abstract syntax tree for *Member* Expression
     *
     * @param {Object} mNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astMemberExpression',
      value: function astMemberExpression(mNode, retArr, funcParam) {
        if (mNode.computed) {
          if (mNode.object.type === 'Identifier') {
            this.astGeneric(mNode.object, retArr, funcParam);
            retArr.push('[');
            this.astGeneric(mNode.property, retArr, funcParam);
            retArr.push(']');
          } else {
            this.astGeneric(mNode.object, retArr, funcParam);
            var last = retArr.pop();
            retArr.push('][');
            this.astGeneric(mNode.property, retArr, funcParam);
            retArr.push(last);
          }
        } else {
          var unrolled = this.astMemberExpressionUnroll(mNode);
          if (mNode.property.type === 'Identifier' && mNode.computed) {
            unrolled = 'user_' + unrolled;
          }
  
          // Its a reference to `this`, add '_' before
          if (unrolled.indexOf('this') === 0) {
            unrolled = '_' + unrolled;
          }
  
          switch (unrolled) {
            case '_this.output.x':
              retArr.push(this.output[0]);
              break;
            case '_this.output.y':
              retArr.push(this.output[1]);
              break;
            case '_this.output.z':
              retArr.push(this.output[2]);
              break;
            default:
              retArr.push(unrolled);
          }
        }
        return retArr;
      }
    }, {
      key: 'astSequenceExpression',
      value: function astSequenceExpression(sNode, retArr, funcParam) {
        for (var i = 0; i < sNode.expressions.length; i++) {
          if (i > 0) {
            retArr.push(',');
          }
          this.astGeneric(sNode.expressions, retArr, funcParam);
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astCallExpression
     *
     * @desc Parses the abstract syntax tree for *call* expression
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns  {Array} the append retArr
     */
  
    }, {
      key: 'astCallExpression',
      value: function astCallExpression(ast, retArr, funcParam) {
        if (ast.callee) {
          // Get the full function call, unrolled
          var funcName = this.astMemberExpressionUnroll(ast.callee);
  
          // Register the function into the called registry
          if (funcParam.calledFunctions.indexOf(funcName) < 0) {
            funcParam.calledFunctions.push(funcName);
          }
          if (!funcParam.hasOwnProperty('funcName')) {
            funcParam.calledFunctionsArguments[funcName] = [];
          }
  
          var functionArguments = [];
          funcParam.calledFunctionsArguments[funcName].push(functionArguments);
  
          // Call the function
          retArr.push(funcName);
  
          // Open arguments space
          retArr.push('(');
  
          // Add the vars
          for (var i = 0; i < ast.arguments.length; ++i) {
            var argument = ast.arguments[i];
            if (i > 0) {
              retArr.push(', ');
            }
            this.astGeneric(argument, retArr, funcParam);
            if (argument.type === 'Identifier') {
              var paramIndex = funcParam.paramNames.indexOf(argument.name);
              if (paramIndex === -1) {
                functionArguments.push(null);
              } else {
                functionArguments.push({
                  name: argument.name,
                  type: funcParam.paramTypes[paramIndex]
                });
              }
            } else {
              functionArguments.push(null);
            }
          }
  
          // Close arguments space
          retArr.push(')');
  
          return retArr;
        }
  
        // Failure, unknown expression
        throw this.astErrorOutput('Unknown CallExpression', ast, funcParam);
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astArrayExpression
     *
     * @desc Parses the abstract syntax tree for *Array* Expression
     *
     * @param {Object} arrNode - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astArrayExpression',
      value: function astArrayExpression(arrNode, retArr, funcParam) {
        var arrLen = arrNode.elements.length;
  
        retArr.push('new Float32Array(');
        for (var i = 0; i < arrLen; ++i) {
          if (i > 0) {
            retArr.push(', ');
          }
          var subNode = arrNode.elements[i];
          this.astGeneric(subNode, retArr, funcParam);
        }
        retArr.push(')');
  
        return retArr;
  
        // // Failure, unknown expression
        // throw this.astErrorOutput(
        // 	'Unknown  ArrayExpression',
        // 	arrNode, funcParam
        //);
      }
    }, {
      key: 'astDebuggerStatement',
      value: function astDebuggerStatement(arrNode, retArr, funcParam) {
        retArr.push('debugger;');
        return retArr;
      }
    }], [{
      key: 'astFunctionPrototype',
      value: function astFunctionPrototype(ast, retArr, funcParam) {
        // Setup function return type and name
        if (funcParam.isRootKernel || funcParam.isSubKernel) {
          return retArr;
        }
  
        retArr.push(funcParam.returnType);
        retArr.push(' ');
        retArr.push(funcParam.functionName);
        retArr.push('(');
  
        // Arguments handling
        for (var i = 0; i < funcParam.paramNames.length; ++i) {
          if (i > 0) {
            retArr.push(', ');
          }
  
          retArr.push(funcParam.paramTypes[i]);
          retArr.push(' ');
          retArr.push('user_');
          retArr.push(funcParam.paramNames[i]);
        }
  
        retArr.push(');\n');
  
        return retArr;
      }
    }]);
  
    return CPUFunctionNode;
  }(BaseFunctionNode);
  },{"../../core/utils":86,"../function-node-base":61}],57:[function(require,module,exports){
  'use strict';
  
  var utils = require('../../core/utils');
  var kernelRunShortcut = require('../kernel-run-shortcut');
  
  function removeFnNoise(fn) {
    if (/^function /.test(fn)) {
      fn = fn.substring(9);
    }
    return fn.replace(/[_]typeof/g, 'typeof');
  }
  
  function removeNoise(str) {
    return str.replace(/[_]typeof/g, 'typeof');
  }
  
  module.exports = function (cpuKernel, name) {
    return '() => {\n    ' + kernelRunShortcut.toString() + ';\n    const utils = {\n      allPropertiesOf: ' + removeNoise(utils.allPropertiesOf.toString()) + ',\n      clone: ' + removeNoise(utils.clone.toString()) + '\n    };\n    const Utils = utils;\n    class ' + (name || 'Kernel') + ' {\n      constructor() {        \n        this.argumentsLength = 0;\n        this._canvas = null;\n        this._webGl = null;\n        this.built = false;\n        this.program = null;\n        this.paramNames = ' + JSON.stringify(cpuKernel.paramNames) + ';\n        this.paramTypes = ' + JSON.stringify(cpuKernel.paramTypes) + ';\n        this.texSize = ' + JSON.stringify(cpuKernel.texSize) + ';\n        this.output = ' + JSON.stringify(cpuKernel.output) + ';\n        this._kernelString = `' + cpuKernel._kernelString + '`;\n        this.output = ' + JSON.stringify(cpuKernel.output) + ';\n\t\t    this.run = function() {\n          this.run = null;\n          this.build();\n          return this.run.apply(this, arguments);\n        }.bind(this);\n        this.thread = {\n          x: 0,\n          y: 0,\n          z: 0\n        };\n      }\n      setCanvas(canvas) { this._canvas = canvas; return this; }\n      setWebGl(webGl) { this._webGl = webGl; return this; }\n      ' + removeFnNoise(cpuKernel.build.toString()) + '\n      ' + removeFnNoise(cpuKernel.setupParams.toString()) + '\n      run () { ' + cpuKernel.kernelString + ' }\n      getKernelString() { return this._kernelString; }\n    };\n    return kernelRunShortcut(new Kernel());\n  };';
  };
  },{"../../core/utils":86,"../kernel-run-shortcut":63}],58:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var KernelBase = require('../kernel-base');
  var utils = require('../../core/utils');
  var kernelString = require('./kernel-string');
  
  module.exports = function (_KernelBase) {
    _inherits(CPUKernel, _KernelBase);
  
    /**
    * @constructor CPUKernel
    *
    * @desc Kernel Implementation for CPU.
    * 
    * <p>Instantiates properties to the CPU Kernel.</p>
    *
    * @extends KernelBase
    *
    * @prop {Object} thread - The thread dimensions, x, y and z
    * @prop {Object} output - The canvas dimensions
    * @prop {Object} functionBuilder - Function Builder instance bound to this Kernel
    * @prop {Function} run - Method to run the kernel
    *
    */
    function CPUKernel(fnString, settings) {
      _classCallCheck(this, CPUKernel);
  
      var _this = _possibleConstructorReturn(this, (CPUKernel.__proto__ || Object.getPrototypeOf(CPUKernel)).call(this, fnString, settings));
  
      _this._fnBody = utils.getFunctionBodyFromString(fnString);
      _this._fn = null;
      _this.run = null;
      _this._canvasCtx = null;
      _this._imageData = null;
      _this._colorData = null;
      _this._kernelString = null;
      _this.thread = {
        x: 0,
        y: 0,
        z: 0
      };
  
      _this.run = function () {
        this.run = null;
        this.build.apply(this, arguments);
        return this.run.apply(this, arguments);
      }.bind(_this);
      return _this;
    }
  
    /**
    * @memberOf CPUKernel#
    * @function
    * @name validateOptions
    *
    * @desc Validate options related to CPU Kernel, such as 
    * dimensions size, and auto dimension support.
    *
    */
  
  
    _createClass(CPUKernel, [{
      key: 'validateOptions',
      value: function validateOptions() {
        if (!this.output || this.output.length === 0) {
          if (arguments.length !== 1) {
            throw 'Auto dimensions only supported for kernels with only one input';
          }
  
          var argType = utils.getArgumentType(arguments[0]);
          if (argType === 'Array') {
            this.output = utils.getDimensions(argType);
          } else if (argType === 'Texture') {
            this.output = arguments[0].output;
          } else {
            throw 'Auto dimensions not supported for input type: ' + argType;
          }
        }
      }
  
      /**
     * @memberOf CPUKernel#
     * @function
     * @name build
     *
     * @desc Builds the Kernel, by generating the kernel 
     * string using thread dimensions, and arguments 
     * supplied to the kernel.
     *
     * <p>If the graphical flag is enabled, canvas is used.</p>
     *
     */
  
    }, {
      key: 'build',
      value: function build() {
        this.setupParams(arguments);
        var threadDim = this.threadDim = utils.clone(this.output);
  
        while (threadDim.length < 3) {
          threadDim.push(1);
        }
  
        if (this.graphical) {
          var canvas = this.getCanvas();
          canvas.width = threadDim[0];
          canvas.height = threadDim[1];
          this._canvasCtx = canvas.getContext('2d');
          this._imageData = this._canvasCtx.createImageData(threadDim[0], threadDim[1]);
          this._colorData = new Uint8ClampedArray(threadDim[0] * threadDim[1] * 4);
        }
  
        var kernelString = this.getKernelString();
  
        if (this.debug) {
          console.log('Options:');
          console.dir(this);
          console.log('Function output:');
          console.log(kernelString);
        }
  
        this.kernelString = kernelString;
        this.run = new Function([], kernelString).bind(this)();
      }
    }, {
      key: 'color',
      value: function color(r, g, b, a) {
        if (typeof a === 'undefined') {
          a = 1;
        }
  
        r = Math.floor(r * 255);
        g = Math.floor(g * 255);
        b = Math.floor(b * 255);
        a = Math.floor(a * 255);
  
        var width = this.output[0];
        var height = this.output[1];
  
        var x = this.thread.x;
        var y = height - this.thread.y - 1;
  
        var index = x + y * width;
  
        this._colorData[index * 4 + 0] = r;
        this._colorData[index * 4 + 1] = g;
        this._colorData[index * 4 + 2] = b;
        this._colorData[index * 4 + 3] = a;
      }
  
      /**
     * @memberOf CPUKernel#
     * @function
     * @name getKernelString
     *
     * @desc Generates kernel string for this kernel program.
     * 
     * <p>If sub-kernels are supplied, they are also factored in.
     * This string can be saved by calling the `toString` method
     * and then can be reused later.</p>
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: 'getKernelString',
      value: function getKernelString() {
        var _this2 = this;
  
        if (this._kernelString !== null) return this._kernelString;
  
        var builder = this.functionBuilder;
  
        // Thread dim fix (to make compilable)
        var threadDim = this.threadDim || (this.threadDim = utils.clone(this.output));
        while (threadDim.length < 3) {
          threadDim.push(1);
        }
  
        builder.addKernel(this.fnString, {
          prototypeOnly: false,
          constants: this.constants,
          output: this.output,
          debug: this.debug,
          loopMaxIterations: this.loopMaxIterations
        }, this.paramNames, this.paramTypes);
  
        builder.addFunctions(this.functions, {
          constants: this.constants,
          output: this.output
        });
  
        if (this.subKernels !== null) {
          this.subKernelOutputTextures = [];
          this.subKernelOutputVariableNames = [];
          for (var i = 0; i < this.subKernels.length; i++) {
            var subKernel = this.subKernels[i];
            builder.addSubKernel(subKernel, {
              prototypeOnly: false,
              constants: this.constants,
              output: this.output,
              debug: this.debug,
              loopMaxIterations: this.loopMaxIterations
            });
            this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
          }
        } else if (this.subKernelProperties !== null) {
          this.subKernelOutputVariableNames = [];
          var _i = 0;
          for (var p in this.subKernelProperties) {
            if (!this.subKernelProperties.hasOwnProperty(p)) continue;
            var _subKernel = this.subKernelProperties[p];
            builder.addSubKernel(_subKernel);
            this.subKernelOutputVariableNames.push(_subKernel.name + 'Result');
            _i++;
          }
        }
  
        var prototypes = builder.getPrototypes();
        var kernel = null;
        if (prototypes.length > 1) {
          prototypes = prototypes.filter(function (fn) {
            if (/^function/.test(fn)) return fn;
            kernel = fn;
            return false;
          });
        } else {
          kernel = prototypes.shift();
        }
        var kernelString = this._kernelString = '\n\t\tvar LOOP_MAX = ' + this._getLoopMaxString() + ';\n\t\tvar _this = this;\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '  var ' + name + ' = null;\n';
        }).join('')) + '\n    return function (' + this.paramNames.map(function (paramName) {
          return 'user_' + paramName;
        }).join(', ') + ') {\n    var ret = new Array(' + threadDim[2] + ');\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '  ' + name + 'Z = new Array(' + threadDim[2] + ');\n';
        }).join('')) + '\n    for (this.thread.z = 0; this.thread.z < ' + threadDim[2] + '; this.thread.z++) {\n      ret[this.thread.z] = new Array(' + threadDim[1] + ');\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '    ' + name + 'Z[this.thread.z] = new Array(' + threadDim[1] + ');\n';
        }).join('')) + '\n      for (this.thread.y = 0; this.thread.y < ' + threadDim[1] + '; this.thread.y++) {\n        ret[this.thread.z][this.thread.y] = new Array(' + threadDim[0] + ');\n  ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '      ' + name + 'Z[this.thread.z][this.thread.y] = new Array(' + threadDim[0] + ');\n';
        }).join('')) + '\n        for (this.thread.x = 0; this.thread.x < ' + threadDim[0] + '; this.thread.x++) {\n          var kernelResult;\n          ' + kernel + '\n          ret[this.thread.z][this.thread.y][this.thread.x] = kernelResult;\n' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '        ' + name + 'Z[this.thread.z][this.thread.y][this.thread.x] = ' + name + ';\n';
        }).join('')) + '\n          }\n        }\n      }\n      \n      if (this.graphical) {\n        this._imageData.data.set(this._colorData);\n        this._canvasCtx.putImageData(this._imageData, 0, 0);\n        return;\n      }\n      \n      if (this.output.length === 1) {\n        ret = ret[0][0];\n' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '    ' + name + ' = ' + name + 'Z[0][0];\n';
        }).join('')) + '\n      \n    } else if (this.output.length === 2) {\n      ret = ret[0];\n      ' + (this.subKernelOutputVariableNames === null ? '' : this.subKernelOutputVariableNames.map(function (name) {
          return '    ' + name + ' = ' + name + 'Z[0];\n';
        }).join('')) + '\n    }\n    \n    ' + (this.subKernelOutputVariableNames === null ? 'return ret;\n' : this.subKernels !== null ? 'var result = [\n        ' + this.subKernelOutputVariableNames.map(function (name) {
          return '' + name;
        }).join(',\n') + '\n      ];\n      result.result = ret;\n      return result;\n' : 'return {\n        result: ret,\n        ' + Object.keys(this.subKernelProperties).map(function (name, i) {
          return name + ': ' + _this2.subKernelOutputVariableNames[i];
        }).join(',\n') + '\n      };') + '\n    ' + (prototypes.length > 0 ? prototypes.join('\n') : '') + '\n    }.bind(this);';
        return kernelString;
      }
  
      /**
     * @memberOf CPUKernel#
     * @function
     * @name toString
     *
     * @desc Returns the *pre-compiled* Kernel as a JS Object String, that can be reused.
     *
     */
  
    }, {
      key: 'toString',
      value: function toString() {
        return kernelString(this);
      }
  
      /**
     * @memberOf CPUKernel#
     * @function
     * @name precompileKernelObj
     *
     * @desc Precompile the kernel into a single object, 
     * that can be used for building the execution kernel subsequently.
     *
     * @param {Array} argTypes - Array of argument types
     *     
     * Return:
     *     Compiled kernel {Object}
     *
     */
  
    }, {
      key: 'precompileKernelObj',
      value: function precompileKernelObj(argTypes) {
  
        var threadDim = this.threadDim || (this.threadDim = utils.clone(this.output));
  
        return {
          threadDim: threadDim
        };
      }
  
      /**
     * @memberOf CPUKernel
     * @function
     * @name compileKernel
     * @static
     *
     * @desc Takes a previously precompiled kernel object,
     * and complete compilation into a full kernel
     * 
     * @returns {Function} Compiled kernel
     *
     */
  
    }, {
      key: '_getLoopMaxString',
  
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getLoopMaxString
     *
     * @desc Get the maximum loop size String.
     *
     * @returns {String} result
     *
     */
      value: function _getLoopMaxString() {
        return this.loopMaxIterations ? ' ' + parseInt(this.loopMaxIterations) + ';\n' : ' 1000;\n';
      }
    }], [{
      key: 'compileKernel',
      value: function compileKernel(precompileObj) {
  
        // Extract values from precompiled obj
        var threadDim = precompileObj.threadDim;
  
        // Normalize certain values : For actual build
        while (threadDim.length < 3) {
          threadDim.push(1);
        }
      }
    }]);
  
    return CPUKernel;
  }(KernelBase);
  },{"../../core/utils":86,"../kernel-base":62,"./kernel-string":57}],59:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var utils = require('../../core/utils');
  var RunnerBase = require('../runner-base');
  var CPUKernel = require('./kernel');
  var CPUFunctionBuilder = require('./function-builder');
  
  module.exports = function (_RunnerBase) {
    _inherits(CPURunner, _RunnerBase);
  
    /**
    * @constructor CPURunner
    *
    * @desc Instantiates a Runner instance for the kernel.
    * 
    * @extends RunnerBase
    *
    * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
    *
    */
  
    function CPURunner(settings) {
      _classCallCheck(this, CPURunner);
  
      var _this = _possibleConstructorReturn(this, (CPURunner.__proto__ || Object.getPrototypeOf(CPURunner)).call(this, new CPUFunctionBuilder(), settings));
  
      _this.Kernel = CPUKernel;
      _this.kernel = null;
      return _this;
    }
  
    /**
    * @memberOf CPURunner#
    * @function
    * @name getMode()
    *
    * Return the current mode in which gpu.js is executing.
    * 
    * @returns {String} The current mode; "cpu".
    *
    */
  
  
    _createClass(CPURunner, [{
      key: 'getMode',
      value: function getMode() {
        return 'cpu';
      }
    }]);
  
    return CPURunner;
  }(RunnerBase);
  },{"../../core/utils":86,"../runner-base":64,"./function-builder":55,"./kernel":58}],60:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  module.exports = function () {
  
    /**
    * @constructor FunctionBuilderBase
    *
    * @desc This handles all the raw state, converted state, etc. of a single function.
    * [INTERNAL] A collection of functionNodes.
    * 
    * @prop {Object} nodeMap - Object map, where nodeMap[function] = new FunctionNode;
    * @prop {Object} gpu - The current gpu instance bound to this builder
    * @prop {Object} rootKernel - The root kernel object, contains the paramNames, dimensions etc.
    * 
    */
    function FunctionBuilderBase(gpu) {
      _classCallCheck(this, FunctionBuilderBase);
  
      this.nodeMap = {};
      this.nativeFunctions = {};
      this.gpu = gpu;
      this.rootKernel = null;
      this.Node = null;
    }
  
    _createClass(FunctionBuilderBase, [{
      key: 'addNativeFunction',
      value: function addNativeFunction(functionName, glslFunctionString) {
        this.nativeFunctions[functionName] = glslFunctionString;
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name addFunction
     *
     * @desc Instantiates a FunctionNode, and add it to the nodeMap
     *
     * @param {String} functionName - Function name to assume, if its null, it attempts to extract from the function
     * @param {Function} jsFunction - JS Function to do conversion
     * @param {Object} [options]
     * @param {String[]|Object} [paramTypes] - Parameter type array, assumes all parameters are 'float' if falsey
     * @param {String} [returnType] - The return type, assumes 'float' if falsey
     *
     */
  
    }, {
      key: 'addFunction',
      value: function addFunction(functionName, jsFunction, options, paramTypes, returnType) {
        this.addFunctionNode(new this.Node(functionName, jsFunction, options, paramTypes, returnType).setAddFunction(this.addFunction.bind(this)));
      }
    }, {
      key: 'addFunctions',
      value: function addFunctions(functions, options) {
        if (functions) {
          if (Array.isArray(functions)) {
            for (var i = 0; i < functions.length; i++) {
              this.addFunction(null, functions[i], options);
            }
          } else {
            for (var p in functions) {
              this.addFunction(p, functions[p], options);
            }
          }
        }
      }
    }, {
      key: 'addNativeFunctions',
      value: function addNativeFunctions(nativeFunctions) {
        for (var functionName in nativeFunctions) {
          if (!nativeFunctions.hasOwnProperty(functionName)) continue;
          this.addNativeFunction(functionName, nativeFunctions[functionName]);
        }
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name addFunctionNode
     *
     * @desc Add the function node directly
     *
     * @param {functionNode} inNode - functionNode to add
     *
     */
  
    }, {
      key: 'addFunctionNode',
      value: function addFunctionNode(inNode) {
        this.nodeMap[inNode.functionName] = inNode;
        if (inNode.isRootKernel) {
          this.rootKernel = inNode;
        }
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name traceFunctionCalls
     *
     * @desc Trace all the depending functions being called, from a single function
     *
     * This allow for 'unneeded' functions to be automatically optimized out.
     * Note that the 0-index, is the starting function trace.
     *
     * @param {String} functionName - Function name to trace from, default to 'kernel'
     * @param {String[]} retList - Returning list of function names that is traced. Including itself.
     * @param {Object} [parent] - Parent node
     *
     * @returns {String[]}  Returning list of function names that is traced. Including itself.
     */
  
    }, {
      key: 'traceFunctionCalls',
      value: function traceFunctionCalls(functionName, retList, parent) {
        functionName = functionName || 'kernel';
        retList = retList || [];
  
        var fNode = this.nodeMap[functionName];
        if (fNode) {
          // Check if function already exists
          var functionIndex = retList.indexOf(functionName);
          if (functionIndex === -1) {
            retList.push(functionName);
            if (parent) {
              fNode.parent = parent;
            }
            fNode.getFunctionString(); //ensure JS trace is done
            for (var i = 0; i < fNode.calledFunctions.length; ++i) {
              this.traceFunctionCalls(fNode.calledFunctions[i], retList, fNode);
            }
          } else {
            /**
        * https://github.com/gpujs/gpu.js/issues/207
        * if dependent function is already in the list, because a function depends on it, and because it has
        * already been traced, we know that we must move the dependent function to the end of the the retList.
        * */
            var dependantFunctionName = retList.splice(functionIndex, 1)[0];
            retList.push(dependantFunctionName);
          }
        }
  
        if (this.nativeFunctions[functionName]) {
          if (retList.indexOf(functionName) >= 0) {
            // Does nothing if already traced
          } else {
            retList.push(functionName);
          }
        }
  
        return retList;
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name addKernel
     *
     * @desc Add a new kernel to this instance
     *
     * @param {String} fnString - Kernel function as a String
     * @param {Object} options - Settings object to set constants, debug mode, etc.
     * @param {Array} paramNames - Parameters of the kernel
     * @param {Array} paramTypes - Types of the parameters
     *
     *
     * @returns {Object} The inserted kernel as a Kernel Node
     *
     */
  
    }, {
      key: 'addKernel',
      value: function addKernel(fnString, options, paramNames, paramTypes) {
        var kernelNode = new this.Node('kernel', fnString, options, paramTypes);
        kernelNode.setAddFunction(this.addFunction.bind(this));
        kernelNode.paramNames = paramNames;
        kernelNode.paramTypes = paramTypes;
        kernelNode.isRootKernel = true;
        this.addFunctionNode(kernelNode);
        return kernelNode;
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name addSubKernel
     *
     * @desc Add a new sub-kernel to the current kernel instance
     *
     * @param {Function} jsFunction - Sub-kernel function (JavaScript)
     * @param {Object} options - Settings object to set constants, debug mode, etc.
     * @param {Array} paramNames - Parameters of the sub-kernel
     * @param {Array} returnType - Return type of the subKernel
     *
     * @returns {Object} The inserted sub-kernel as a Kernel Node
     *
     */
  
    }, {
      key: 'addSubKernel',
      value: function addSubKernel(jsFunction, options, paramTypes, returnType) {
        var kernelNode = new this.Node(null, jsFunction, options, paramTypes, returnType);
        kernelNode.setAddFunction(this.addFunction.bind(this));
        kernelNode.isSubKernel = true;
        this.addFunctionNode(kernelNode);
        return kernelNode;
      }
  
      /**
     * @memberOf CPUFunctionBuilder#
     * @name getPrototypeString
     * @function
     *
     * @desc Return the string for a function
     *
     * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
     *
     * @returns {String} The full string, of all the various functions. Trace optimized if functionName given
     *
     */
  
    }, {
      key: 'getPrototypeString',
      value: function getPrototypeString(functionName) {
        return this.getPrototypes(functionName).join('\n');
      }
  
      /**
     * @memberOf CPUFunctionBuilder#
     * @name getPrototypeString
     * @function
     *
     * @desc Return the string for a function
     *
     * @param {String} [functionName] - Function name to trace from. If null, it returns the WHOLE builder stack
     *
     * @returns {Array} The full string, of all the various functions. Trace optimized if functionName given
     *
     */
  
    }, {
      key: 'getPrototypes',
      value: function getPrototypes(functionName) {
        this.rootKernel.generate();
        if (functionName) {
          return this.getPrototypesFromFunctionNames(this.traceFunctionCalls(functionName, []).reverse());
        }
        return this.getPrototypesFromFunctionNames(Object.keys(this.nodeMap));
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name getStringFromFunctionNames
     *
     * @desc Get string from function names
     *
     * @param {String[]} functionList - List of function to build string
     *
     * @returns {String} The string, of all the various functions. Trace optimized if functionName given
     *
     */
  
    }, {
      key: 'getStringFromFunctionNames',
      value: function getStringFromFunctionNames(functionList) {
        var ret = [];
        for (var i = 0; i < functionList.length; ++i) {
          var node = this.nodeMap[functionList[i]];
          if (node) {
            ret.push(this.nodeMap[functionList[i]].getFunctionString());
          }
        }
        return ret.join('\n');
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name getPrototypeStringFromFunctionNames
     *
     * @desc Return string of all functions converted
     *
     * @param {String[]} functionList - List of function names to build the string.
     * @param {Object} [opt - Settings object passed to functionNode. See functionNode for more details.
     *
     * @returns {Array} Prototypes of all functions converted
     *
     */
  
    }, {
      key: 'getPrototypesFromFunctionNames',
      value: function getPrototypesFromFunctionNames(functionList, opt) {
        var ret = [];
        for (var i = 0; i < functionList.length; ++i) {
          var functionName = functionList[i];
          var node = this.nodeMap[functionName];
          if (node) {
            ret.push(node.getFunctionPrototypeString(opt));
          } else if (this.nativeFunctions[functionName]) {
            ret.push(this.nativeFunctions[functionName]);
          }
        }
        return ret;
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name getPrototypeStringFromFunctionNames
     *
     * @desc Return string of all functions converted
     *
     * @param {String[]} functionList - List of function names to build the string.
     * @param {Object} opt - Settings object passed to functionNode. See functionNode for more details.
     *
     * @returns {String} Prototype string of all functions converted
     *
     */
  
    }, {
      key: 'getPrototypeStringFromFunctionNames',
      value: function getPrototypeStringFromFunctionNames(functionList, opt) {
        return this.getPrototypesFromFunctionNames(functionList, opt).toString();
      }
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name getString
     *
     * Get string for a particular function name
     *
     * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
     *
     * @returns {String} The string, of all the various functions. Trace optimized if functionName given
     *
     */
  
    }, {
      key: 'getString',
      value: function getString(functionName, opt) {
        if (opt === undefined) {
          opt = {};
        }
  
        if (functionName) {
          return this.getStringFromFunctionNames(this.traceFunctionCalls(functionName, [], opt).reverse(), opt);
        }
        return this.getStringFromFunctionNames(Object.keys(this.nodeMap), opt);
      }
    }]);
  
    return FunctionBuilderBase;
  }();
  },{}],61:[function(require,module,exports){
  'use strict';
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var utils = require('../core/utils');
  var acorn = require('acorn');
  
  module.exports = function () {
  
    /**
    * @constructor FunctionNodeBase
    * 
    * @desc Represents a single function, inside JS, webGL, or openGL.
    * 
    * <p>This handles all the raw state, converted state, etc. Of a single function.</p>
    * 
    * @prop {String} functionName - Name of the function
    * @prop {Function} jsFunction - The JS Function the node represents
    * @prop {String} jsFunctionString - jsFunction.toString()
    * @prop {String[]} paramNames - Parameter names of the function
    * @prop {String[]} paramTypes - Shader land parameters type assumption
    * @prop {Boolean} isRootKernel - Special indicator, for kernel function
    * @prop {String} webglFunctionString - webgl converted function string
    * @prop {String} openglFunctionString - opengl converted function string
    * @prop {String[]} calledFunctions - List of all the functions called
    * @prop {String[]} initVariables - List of variables initialized in the function
    * @prop {String[]} readVariables - List of variables read operations occur
    * @prop {String[]} writeVariables - List of variables write operations occur
    * 
    * @param {GPU} gpu - The GPU instance
    * @param {String} functionName - Function name to assume, if its null, it attempts to extract from the function
    * @param {Function|String} jsFunction - JS Function to do conversion
    * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
    * @param {String} returnType - The return type, assumes 'float' if null
    *
    */
    function BaseFunctionNode(functionName, jsFunction, options, paramTypes, returnType) {
      _classCallCheck(this, BaseFunctionNode);
  
      //
      // Internal vars setup
      //
      this.calledFunctions = [];
      this.calledFunctionsArguments = {};
      this.initVariables = [];
      this.readVariables = [];
      this.writeVariables = [];
      this.addFunction = null;
      this.isRootKernel = false;
      this.isSubKernel = false;
      this.parent = null;
      this.debug = null;
      this.prototypeOnly = null;
      this.constants = null;
      this.output = null;
  
      if (options) {
        if (options.hasOwnProperty('debug')) {
          this.debug = options.debug;
        }
        if (options.hasOwnProperty('prototypeOnly')) {
          this.prototypeOnly = options.prototypeOnly;
        }
        if (options.hasOwnProperty('constants')) {
          this.constants = options.constants;
        }
        if (options.hasOwnProperty('output')) {
          this.output = options.output;
        }
        if (options.hasOwnProperty('loopMaxIterations')) {
          this.loopMaxIterations = options.loopMaxIterations;
        }
      }
  
      //
      // Missing jsFunction object exception
      //
      if (!jsFunction) {
        throw 'jsFunction, parameter is missing';
      }
  
      //
      // Setup jsFunction and its string property + validate them
      //
      this.jsFunctionString = jsFunction.toString();
      if (!utils.isFunctionString(this.jsFunctionString)) {
        console.error('jsFunction, to string conversion check failed: not a function?', this.jsFunctionString);
        throw 'jsFunction, to string conversion check failed: not a function?';
      }
  
      if (!utils.isFunction(jsFunction)) {
        //throw 'jsFunction, is not a valid JS Function';
        this.jsFunction = null;
      } else {
        this.jsFunction = jsFunction;
      }
  
      //
      // Setup the function name property
      //
      this.functionName = functionName || jsFunction && jsFunction.name || utils.getFunctionNameFromString(this.jsFunctionString);
  
      if (!this.functionName) {
        throw 'jsFunction, missing name argument or value';
      }
  
      //
      // Extract parameter name, and its argument types
      //
      this.paramNames = utils.getParamNamesFromString(this.jsFunctionString);
      if (paramTypes) {
        if (Array.isArray(paramTypes)) {
          if (paramTypes.length !== this.paramNames.length) {
            throw 'Invalid argument type array length, against function length -> (' + paramTypes.length + ',' + this.paramNames.length + ')';
          }
          this.paramTypes = paramTypes;
        } else if ((typeof paramTypes === 'undefined' ? 'undefined' : _typeof(paramTypes)) === 'object') {
          var paramVariableNames = Object.keys(paramTypes);
          if (paramTypes.hasOwnProperty('returns')) {
            this.returnType = paramTypes.returns;
            paramVariableNames.splice(paramVariableNames.indexOf('returns'), 1);
          }
          if (paramVariableNames.length > 0 && paramVariableNames.length !== this.paramNames.length) {
            throw 'Invalid argument type array length, against function length -> (' + paramVariableNames.length + ',' + this.paramNames.length + ')';
          } else {
            this.paramTypes = this.paramNames.map(function (key) {
              if (paramTypes.hasOwnProperty(key)) {
                return paramTypes[key];
              } else {
                return 'float';
              }
            });
          }
        }
      } else {
        this.paramTypes = [];
        //TODO: Remove when we have proper type detection
        // for (let a = 0; a < this.paramNames.length; ++a) {
        // 	this.paramTypes.push();
        // }
      }
  
      //
      // Return type handling
      //
      if (!this.returnType) {
        this.returnType = returnType || 'float';
      }
    }
  
    _createClass(BaseFunctionNode, [{
      key: 'isIdentifierConstant',
      value: function isIdentifierConstant(paramName) {
        if (!this.constants) return false;
        return this.constants.hasOwnProperty(paramName);
      }
    }, {
      key: 'setAddFunction',
      value: function setAddFunction(fn) {
        this.addFunction = fn;
        return this;
      }
      /**
     * 
     * Core Functions
     * 
     */
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name getJSFunction
     *
     * @desc Gets and return the stored JS Function.
     * Note: that this internally eval the function, if only the string was provided on construction
     *
     * @returns {Function} The function object
     *
     */
  
    }, {
      key: 'getJsFunction',
      value: function getJsFunction() {
        if (this.jsFunction) {
          return this.jsFunction;
        }
  
        if (this.jsFunctionString) {
          this.jsFunction = eval(this.jsFunctionString);
          return this.jsFunction;
        }
  
        throw 'Missing jsFunction, and jsFunctionString parameter';
      }
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name astMemberExpressionUnroll
     * @desc Parses the abstract syntax tree for binary expression.
     *
     * <p>Utility function for astCallExpression.</p>
     *
     * @param {Object} ast - the AST object to parse
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {String} the function namespace call, unrolled
     */
  
    }, {
      key: 'astMemberExpressionUnroll',
      value: function astMemberExpressionUnroll(ast, funcParam) {
        if (ast.type === 'Identifier') {
          return ast.name;
        } else if (ast.type === 'ThisExpression') {
          return 'this';
        }
  
        if (ast.type === 'MemberExpression') {
          if (ast.object && ast.property) {
            //babel sniffing
            if (ast.object.hasOwnProperty('name') && ast.object.name[0] === '_') {
              return this.astMemberExpressionUnroll(ast.property, funcParam);
            }
  
            return this.astMemberExpressionUnroll(ast.object, funcParam) + '.' + this.astMemberExpressionUnroll(ast.property, funcParam);
          }
        }
  
        //babel sniffing
        if (ast.hasOwnProperty('expressions')) {
          var firstExpression = ast.expressions[0];
          if (firstExpression.type === 'Literal' && firstExpression.value === 0 && ast.expressions.length === 2) {
            return this.astMemberExpressionUnroll(ast.expressions[1]);
          }
        }
  
        // Failure, unknown expression
        throw this.astErrorOutput('Unknown CallExpression_unroll', ast, funcParam);
      }
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name getJsAST
     *
     * @desc Parses the class function JS, and returns its Abstract Syntax Tree object.
     *
     * This is used internally to convert to shader code
     *
     * @param {JISONParser} inParser - Parser to use, assumes in scope 'parser' if null
     *
     * @returns {ASTObject} The function AST Object, note that result is cached under this.jsFunctionAST;
     *
     */
  
    }, {
      key: 'getJsAST',
      value: function getJsAST(inParser) {
        if (this.jsFunctionAST) {
          return this.jsFunctionAST;
        }
  
        inParser = inParser || acorn;
        if (inParser === null) {
          throw 'Missing JS to AST parser';
        }
  
        var ast = inParser.parse('var ' + this.functionName + ' = ' + this.jsFunctionString + ';', {
          locations: true
        });
        if (ast === null) {
          throw 'Failed to parse JS code';
        }
  
        // take out the function object, outside the var declarations
        var funcAST = ast.body[0].declarations[0].init;
        this.jsFunctionAST = funcAST;
  
        return funcAST;
      }
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name getFunctionString
     *
     * @desc Returns the converted webgl shader function equivalent of the JS function
     *
     * @returns {String} webgl function string, result is cached under this.webGlFunctionString
     *
     */
  
    }, {
      key: 'getFunctionString',
      value: function getFunctionString() {
        this.generate();
        return this.functionString;
      }
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name setFunctionString
     *
     * @desc Set the functionString value, overwriting it
     *
     * @param {String} functionString - Shader code string, representing the function
     *
     */
  
    }, {
      key: 'setFunctionString',
      value: function setFunctionString(functionString) {
        this.functionString = functionString;
      }
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name getParamType
     *
     * @desc Return the type of parameter sent to subKernel/Kernel.
     *
     * @param {String} paramName - Name of the parameter
     *
     * @returns {String} Type of the parameter
     *
     */
  
    }, {
      key: 'getParamType',
      value: function getParamType(paramName) {
        var paramIndex = this.paramNames.indexOf(paramName);
        if (paramIndex === -1) return null;
        if (!this.parent) return null;
        if (this.paramTypes[paramIndex]) return this.paramTypes[paramIndex];
        var calledFunctionArguments = this.parent.calledFunctionsArguments[this.functionName];
        for (var i = 0; i < calledFunctionArguments.length; i++) {
          var calledFunctionArgument = calledFunctionArguments[i];
          if (calledFunctionArgument[paramIndex] !== null) {
            return this.paramTypes[paramIndex] = calledFunctionArgument[paramIndex].type;
          }
        }
        return null;
      }
  
      /**
     * @memberOf FunctionNodeBase#
     * @function
     * @name getUserParamName
     *
     * @desc Return the name of the *user parameter*(subKernel parameter) corresponding 
     * to the parameter supplied to the kernel
     *
     * @param {String} paramName - Name of the parameter
     *
     * @returns {String} Name of the parameter
     *
     */
  
    }, {
      key: 'getUserParamName',
      value: function getUserParamName(paramName) {
        var paramIndex = this.paramNames.indexOf(paramName);
        if (paramIndex === -1) return null;
        if (!this.parent) return null;
        var calledFunctionArguments = this.parent.calledFunctionsArguments[this.functionName];
        for (var i = 0; i < calledFunctionArguments.length; i++) {
          var calledFunctionArgument = calledFunctionArguments[i];
          if (calledFunctionArgument[paramIndex] !== null) {
            return calledFunctionArgument[paramIndex].name;
          }
        }
        return null;
      }
    }, {
      key: 'generate',
      value: function generate(options) {
        throw new Error('generate not defined on BaseFunctionNode');
      }
  
      /**
     * @function
     * @name astErrorOutput
     * @ignore
     * @desc To throw the AST error, with its location.
     *
     * @todo add location support fpr the AST error
     *
     * @param {Object} error - the error message output
     * @param {Object} ast - the AST object where the error is
     * @param {Object} funcParam - FunctionNode, that tracks compilation state
     */
  
    }, {
      key: 'astErrorOutput',
      value: function astErrorOutput(error, ast, funcParam) {
        console.error(utils.getAstString(this.jsFunctionString, ast));
        console.error(error, ast, funcParam);
        return error;
      }
    }, {
      key: 'astDebuggerStatement',
      value: function astDebuggerStatement(arrNode, retArr, funcParam) {
        return retArr;
      }
    }]);
  
    return BaseFunctionNode;
  }();
  },{"../core/utils":86,"acorn":48}],62:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var utils = require('../core/utils');
  
  module.exports = function () {
  
    /**
    * @constructor BaseKernel
    * 
    * @desc Implements the base class for Kernels, and is used as a 
    * parent class for all Kernel implementations.
    *
    * This contains the basic methods needed by all Kernel implementations, 
    * like setDimensions, addSubKernel, etc.
    * 
    * @prop {Array} paramNames - Name of the parameters of the kernel function
    * @prop {String} fnString - Kernel function as a String
    * @prop {Array} dimensions - Dimensions of the kernel function, this.thread.x, etc.
    * @prop {Boolean} debug - Toggle debug mode
    * @prop {String} graphical - Toggle graphical mode
    * @prop {number} loopMaxIterations - Maximum number of loop iterations
    * @prop {Object} constants - Global constants
    * @prop {Array} subKernels - Sub kernels bound to this kernel instance
    * @prop {Object} subKernelProperties - Sub kernels bound to this kernel instance as key/value pairs
    * @prop {Array} subKernelOutputVariableNames - Names of the variables outputted by the subkerls
    *
    */
    function BaseKernel(fnString, settings) {
      _classCallCheck(this, BaseKernel);
  
      this.paramNames = utils.getParamNamesFromString(fnString);
      this.fnString = fnString;
      this.output = null;
      this.debug = false;
      this.graphical = false;
      this.loopMaxIterations = 0;
      this.constants = null;
      this.wraparound = null;
      this.hardcodeConstants = null;
      this.outputToTexture = null;
      this.outputImmutable = null;
      this.texSize = null;
      this._canvas = null;
      this._webGl = null;
      this.threadDim = null;
      this.floatTextures = null;
      this.floatOutput = null;
      this.floatOutputForce = null;
      this.addFunction = null;
      this.functions = null;
      this.nativeFunctions = null;
      this.subKernels = null;
      this.subKernelProperties = null;
      this.subKernelNames = null;
      this.subKernelOutputVariableNames = null;
      this.functionBuilder = null;
      this.paramTypes = null;
  
      for (var p in settings) {
        if (!settings.hasOwnProperty(p) || !this.hasOwnProperty(p)) continue;
        this[p] = settings[p];
      }
      if (settings.hasOwnProperty('canvas')) {
        this._canvas = settings.canvas;
      }
      if (settings.hasOwnProperty('output')) {
        this.setOutput(settings.output); // Flatten output object
      }
  
      if (!this._canvas) this._canvas = utils.initCanvas();
    }
  
    _createClass(BaseKernel, [{
      key: 'build',
      value: function build() {
        throw new Error('"build" not defined on Base');
      }
  
      /**
     * @memberOf KernelBase#
     * @function
     * @name setupParams
     *
     * @desc Setup the parameter types for the parameters
     * supplied to the Kernel function
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     */
  
    }, {
      key: 'setupParams',
      value: function setupParams(args) {
        var paramTypes = this.paramTypes = [];
        for (var i = 0; i < args.length; i++) {
          var param = args[i];
          var paramType = utils.getArgumentType(param);
          paramTypes.push(paramType);
        }
      }
    }, {
      key: 'setAddFunction',
      value: function setAddFunction(cb) {
        this.addFunction = cb;
        return this;
      }
    }, {
      key: 'setFunctions',
      value: function setFunctions(functions) {
        this.functions = functions;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setOutput
     *
     * @desc Set dimensions of the kernel function
     *
     * @param {Array|Object} output - The output array to set the kernel output size to
     *
     */
  
    }, {
      key: 'setOutput',
      value: function setOutput(output) {
        if (output.hasOwnProperty('x')) {
          if (output.hasOwnProperty('y')) {
            if (output.hasOwnProperty('z')) {
              this.output = [output.x, output.y, output.z];
            } else {
              this.output = [output.x, output.y];
            }
          } else {
            this.output = [output.x];
          }
        } else {
          this.output = output;
        }
        return this;
      }
  
      /**
     * @memberOf BaseKernel# 
     * @function
     * @name setDebug
     *
     * @desc Toggle debug mode
     *
     * @param {Boolean} flag - true to enable debug
     *
     */
  
    }, {
      key: 'setDebug',
      value: function setDebug(flag) {
        this.debug = flag;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setGraphical
     *
     * @desc Toggle graphical output mode
     *
     * @param {Boolean} flag - true to enable graphical output
     *
     */
  
    }, {
      key: 'setGraphical',
      value: function setGraphical(flag) {
        this.graphical = flag;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setLoopMaxIterations
     *
     * @desc Set the maximum number of loop iterations
     *
     * @param {number} max - iterations count
     *
     */
  
    }, {
      key: 'setLoopMaxIterations',
      value: function setLoopMaxIterations(max) {
        this.loopMaxIterations = max;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setConstants
     * @desc Set Constants
     */
  
    }, {
      key: 'setConstants',
      value: function setConstants(constants) {
        this.constants = constants;
        return this;
      }
    }, {
      key: 'setWraparound',
      value: function setWraparound(flag) {
        console.warn('Wraparound mode is not supported and undocumented.');
        this.wraparound = flag;
        return this;
      }
    }, {
      key: 'setHardcodeConstants',
      value: function setHardcodeConstants(flag) {
        this.hardcodeConstants = flag;
        return this;
      }
    }, {
      key: 'setOutputToTexture',
      value: function setOutputToTexture(flag) {
        this.outputToTexture = flag;
        return this;
      }
    }, {
      key: 'setOutputImmutable',
      value: function setOutputImmutable(flag) {
        this.outputImmutable = flag;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setFloatTextures
     *
     * @desc Toggle texture output mode
     *
     * @param {Boolean} flag - true to enable floatTextures
     *
     */
  
    }, {
      key: 'setFloatTextures',
      value: function setFloatTextures(flag) {
        this.floatTextures = flag;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setFloatOutput
     *
     * @desc Toggle output mode
     *
     * @param {Boolean} flag - true to enable float
     *
     */
  
    }, {
      key: 'setFloatOutput',
      value: function setFloatOutput(flag) {
        this.floatOutput = flag;
        return this;
      }
    }, {
      key: 'setFloatOutputForce',
      value: function setFloatOutputForce(flag) {
        this.floatOutputForce = flag;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setCanvas
     *
     * @desc Bind the canvas to kernel
     * 
     * @param {Canvas} canvas - Canvas to bind
     *
     */
  
    }, {
      key: 'setCanvas',
      value: function setCanvas(canvas) {
        this._canvas = canvas;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name setCanvas
     *
     * @desc Bind the webGL instance to kernel
     * 
     * @param {Canvas} webGL - webGL instance to bind
     *
     */
  
    }, {
      key: 'setWebGl',
      value: function setWebGl(webGl) {
        this._webGl = webGl;
        return this;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name getCanvas()
     *
     * @desc Returns the current canvas instance bound to the kernel
     *
     */
  
    }, {
      key: 'getCanvas',
      value: function getCanvas() {
        return this._canvas;
      }
  
      /**
     * @memberOf BaseKernel#
     * @function
     * @name getWebGl()
     *
     * @desc Returns the current webGl instance bound to the kernel
     *
     */
  
    }, {
      key: 'getWebGl',
      value: function getWebGl() {
        return this._webGl;
      }
    }, {
      key: 'validateOptions',
      value: function validateOptions() {
        throw new Error('validateOptions not defined');
      }
    }, {
      key: 'exec',
      value: function exec() {
        return this.execute.apply(this, arguments);
      }
    }, {
      key: 'execute',
      value: function execute() {
        var _this = this;
  
        //
        // Prepare the required objects
        //
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
  
        //
        // Setup and return the promise, and execute the function, in synchronous mode
        //
        return utils.newPromise(function (accept, reject) {
          try {
            accept(_this.run.apply(_this, args));
          } catch (e) {
            //
            // Error : throw rejection
            //
            reject(e);
          }
        });
      }
  
      /** 
     * @memberOf BaseKernel#
     * @function
     * @name addSubKernel
     *
     * @desc Add a sub kernel to the root kernel instance.
     * This is what `createKernelMap` uses.
     *
     * @param {String} fnString - function (as a String) of the subKernel to add
     *
     */
  
    }, {
      key: 'addSubKernel',
      value: function addSubKernel(fnString) {
        if (this.subKernels === null) {
          this.subKernels = [];
          this.subKernelNames = [];
        }
        this.subKernels.push(fnString);
        this.subKernelNames.push(utils.getFunctionNameFromString(fnString));
        return this;
      }
  
      /** 
     * @memberOf BaseKernel#
     * @function
     * @name addSubKernelProperty
     *
     * @desc Add a sub kernel to the root kernel instance, indexed by a property name
     * This is what `createKernelMap` uses.
     *
     * @param {String} property - property key for the subKernel
     * @param {String} fnString - function (as a String) of the subKernel to add
     *
     */
  
    }, {
      key: 'addSubKernelProperty',
      value: function addSubKernelProperty(property, fnString) {
        if (this.subKernelProperties === null) {
          this.subKernelProperties = {};
          this.subKernelNames = [];
        }
        if (this.subKernelProperties.hasOwnProperty(property)) {
          throw new Error('cannot add sub kernel ' + property + ', already defined');
        }
        this.subKernelProperties[property] = fnString;
        this.subKernelNames.push(utils.getFunctionNameFromString(fnString));
        return this;
      }
    }, {
      key: 'addNativeFunction',
      value: function addNativeFunction(name, source) {
        this.functionBuilder.addNativeFunction(name, source);
      }
    }]);
  
    return BaseKernel;
  }();
  },{"../core/utils":86}],63:[function(require,module,exports){
  'use strict';
  
  var utils = require('../core/utils');
  
  module.exports = function kernelRunShortcut(kernel) {
    var shortcut = function shortcut() {
      return kernel.run.apply(kernel, arguments);
    };
  
    utils.allPropertiesOf(kernel).forEach(function (key) {
      if (key[0] === '_' && key[1] === '_') return;
      if (typeof kernel[key] === 'function') {
        if (key.substring(0, 3) === 'add' || key.substring(0, 3) === 'set') {
          shortcut[key] = function () {
            kernel[key].apply(kernel, arguments);
            return shortcut;
          };
        } else {
          shortcut[key] = kernel[key].bind(kernel);
        }
      } else {
        shortcut.__defineGetter__(key, function () {
          return kernel[key];
        });
        shortcut.__defineSetter__(key, function (value) {
          kernel[key] = value;
        });
      }
    });
  
    shortcut.kernel = kernel;
  
    return shortcut;
  };
  },{"../core/utils":86}],64:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var utils = require('../core/utils');
  var kernelRunShortcut = require('./kernel-run-shortcut');
  
  module.exports = function () {
  
    /**
    * @constructor BaseRunner
    *
    * @desc Represents the 'private/protected' namespace of the GPU class
    *
    * <p>I know @private makes more sense, but since the documentation engine state is undetirmined.
    * (See https://github.com/gpujs/gpu.js/issues/19 regarding documentation engine issue)
    * File isolation is currently the best way to go. </p>
    *
    * *base.js* internal functions namespace <br>
    * *gpu.js* PUBLIC function namespace <br>
    *
    * @prop {Object} settings - Settings object used to set Dimensions, etc.
    * @prop {String} kernel - Current kernel instance
    * @prop {Object} canvas - Canvas instance attached to the kernel
    * @prop {Object} webGl - WebGl instance attached to the kernel
    * @prop {Function} fn - Kernel function to run
    * @prop {Object} functionBuilder - FunctionBuilder instance
    * @prop {String} fnString - Kernel function (as a String)
    * @prop {String} endianness - endian information like Little-endian, Big-endian.
    *
    */
  
    function BaseRunner(functionBuilder, settings) {
      _classCallCheck(this, BaseRunner);
  
      settings = settings || {};
      this.kernel = settings.kernel;
      this.canvas = settings.canvas;
      this.webGl = settings.webGl;
      this.fn = null;
      this.functionBuilder = functionBuilder;
      this.fnString = null;
      this.endianness = utils.systemEndianness();
    }
  
    /**
    * @memberOf BaseRunner#
    * @function
    * @name textureToArray
    *
    * @desc Converts the provided Texture instance to a JavaScript Array
    *
    * @param {Object} texture - Texture Object
    *
    */
  
  
    _createClass(BaseRunner, [{
      key: 'textureToArray',
      value: function textureToArray(texture) {
        var copy = this.createKernel(function (x) {
          return x[this.thread.z][this.thread.y][this.thread.x];
        });
  
        return copy(texture);
      }
  
      /**
     * @memberOf BaseRunner#
     * @function
     *
     * @name deleteTexture
     *
     * @desc Deletes the provided Texture instance
     *
     * @param {Object} texture - Texture Object
     */
  
    }, {
      key: 'deleteTexture',
      value: function deleteTexture(texture) {
        this.webGl.deleteTexture(texture.texture);
      }
  
      /**
     * @memberOf BaseRunner#
     * @function
     * @name buildPromiseKernel
     *
     * @desc Get and returns the ASYNCHRONOUS executor, of a class and kernel
     * This returns a Promise object from an argument set.
     *
     * Note that there is no current implementation.
     *
     */
  
    }, {
      key: 'buildPromiseKernel',
      value: function buildPromiseKernel() {
        throw new Error('not yet implemented');
      }
    }, {
      key: 'getMode',
      value: function getMode() {
        throw new Error('"mode" not implemented on BaseRunner');
      }
  
      /**
     * @memberOf BaseRunner#
     * @function
     *
     * @name buildKernel
     *
     * @desc Get and returns the Synchronous executor, of a class and kernel
     * Which returns the result directly after passing the arguments.
     *
     */
  
    }, {
      key: 'buildKernel',
      value: function buildKernel(fn, settings) {
        settings = Object.assign({}, settings || {});
        var fnString = fn.toString();
        if (!settings.functionBuilder) {
          settings.functionBuilder = this.functionBuilder;
        }
  
        if (!settings.canvas) {
          settings.canvas = this.canvas;
        }
  
        if (!settings.webGl) {
          settings.webGl = this.webgl;
        }
  
        return kernelRunShortcut(new this.Kernel(fnString, settings));
      }
    }]);
  
    return BaseRunner;
  }();
  },{"../core/utils":86,"./kernel-run-shortcut":63}],65:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var FunctionBuilderBase = require('../function-builder-base');
  var WebGLFunctionNode = require('./function-node');
  
  /**
   * @class WebGLFunctionBuilder
   *
   * @extends FunctionBuilderBase
   *
   * @desc Builds webGl functions (shaders) from JavaScript function Strings
   *
   */
  module.exports = function (_FunctionBuilderBase) {
    _inherits(WebGLFunctionBuilder, _FunctionBuilderBase);
  
    function WebGLFunctionBuilder() {
      _classCallCheck(this, WebGLFunctionBuilder);
  
      var _this = _possibleConstructorReturn(this, (WebGLFunctionBuilder.__proto__ || Object.getPrototypeOf(WebGLFunctionBuilder)).call(this));
  
      _this.Node = WebGLFunctionNode;
      return _this;
    }
  
    //---------------------------------------------------------
    //
    //  Polyfill stuff
    //
    //---------------------------------------------------------
  
    // Round function used in polyfill
  
  
    _createClass(WebGLFunctionBuilder, [{
      key: 'polyfillStandardFunctions',
  
  
      /**
     * @memberOf FunctionBuilderBase#
     * @function
     * @name polyfillStandardFunctions
     *
     * @desc Polyfill in the missing Math functions (round)
     *
     */
      value: function polyfillStandardFunctions() {
        this.addFunction('round', _round);
      }
    }], [{
      key: 'round',
      value: function round(a) {
        return _round(a);
      }
    }]);
  
    return WebGLFunctionBuilder;
  }(FunctionBuilderBase);
  
  function _round(a) {
    return Math.floor(a + 0.5);
  }
  },{"../function-builder-base":60,"./function-node":66}],66:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var FunctionNodeBase = require('../function-node-base');
  var utils = require('../../core/utils');
  // Closure capture for the ast function, prevent collision with existing AST functions
  // The prefixes to use
  var jsMathPrefix = 'Math.';
  var localPrefix = 'this.';
  var constantsPrefix = 'this.constants.';
  
  var DECODE32_ENCODE32 = /decode32\(\s+encode32\(/g;
  var ENCODE32_DECODE32 = /encode32\(\s+decode32\(/g;
  
  /** 
   * @class WebGLFunctionNode
   *
   * @desc [INTERNAL] Takes in a function node, and does all the AST voodoo required to generate its respective webGL code.
   *
   * @extends FunctionNodeBase
   *
   * @param {functionNode} inNode - The function node object
   *
   * @returns the converted webGL function string
   *
   */
  module.exports = function (_FunctionNodeBase) {
    _inherits(WebGLFunctionNode, _FunctionNodeBase);
  
    function WebGLFunctionNode() {
      _classCallCheck(this, WebGLFunctionNode);
  
      return _possibleConstructorReturn(this, (WebGLFunctionNode.__proto__ || Object.getPrototypeOf(WebGLFunctionNode)).apply(this, arguments));
    }
  
    _createClass(WebGLFunctionNode, [{
      key: 'generate',
      value: function generate() {
        if (this.debug) {
          console.log(this);
        }
        if (this.prototypeOnly) {
          return WebGLFunctionNode.astFunctionPrototype(this.getJsAST(), [], this).join('').trim();
        } else {
          this.functionStringArray = this.astGeneric(this.getJsAST(), [], this);
        }
        this.functionString = webGlRegexOptimize(this.functionStringArray.join('').trim());
        return this.functionString;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astGeneric
     *
     * @desc Parses the abstract syntax tree for generically to its respective function
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the parsed webgl string array
     */
  
    }, {
      key: 'astGeneric',
      value: function astGeneric(ast, retArr, funcParam) {
        if (ast === null) {
          throw this.astErrorOutput('NULL ast', ast, funcParam);
        } else {
          if (Array.isArray(ast)) {
            for (var i = 0; i < ast.length; i++) {
              this.astGeneric(ast[i], retArr, funcParam);
            }
            return retArr;
          }
  
          switch (ast.type) {
            case 'FunctionDeclaration':
              return this.astFunctionDeclaration(ast, retArr, funcParam);
            case 'FunctionExpression':
              return this.astFunctionExpression(ast, retArr, funcParam);
            case 'ReturnStatement':
              return this.astReturnStatement(ast, retArr, funcParam);
            case 'Literal':
              return this.astLiteral(ast, retArr, funcParam);
            case 'BinaryExpression':
              return this.astBinaryExpression(ast, retArr, funcParam);
            case 'Identifier':
              return this.astIdentifierExpression(ast, retArr, funcParam);
            case 'AssignmentExpression':
              return this.astAssignmentExpression(ast, retArr, funcParam);
            case 'ExpressionStatement':
              return this.astExpressionStatement(ast, retArr, funcParam);
            case 'EmptyStatement':
              return this.astEmptyStatement(ast, retArr, funcParam);
            case 'BlockStatement':
              return this.astBlockStatement(ast, retArr, funcParam);
            case 'IfStatement':
              return this.astIfStatement(ast, retArr, funcParam);
            case 'BreakStatement':
              return this.astBreakStatement(ast, retArr, funcParam);
            case 'ContinueStatement':
              return this.astContinueStatement(ast, retArr, funcParam);
            case 'ForStatement':
              return this.astForStatement(ast, retArr, funcParam);
            case 'WhileStatement':
              return this.astWhileStatement(ast, retArr, funcParam);
            case 'VariableDeclaration':
              return this.astVariableDeclaration(ast, retArr, funcParam);
            case 'VariableDeclarator':
              return this.astVariableDeclarator(ast, retArr, funcParam);
            case 'ThisExpression':
              return this.astThisExpression(ast, retArr, funcParam);
            case 'SequenceExpression':
              return this.astSequenceExpression(ast, retArr, funcParam);
            case 'UnaryExpression':
              return this.astUnaryExpression(ast, retArr, funcParam);
            case 'UpdateExpression':
              return this.astUpdateExpression(ast, retArr, funcParam);
            case 'LogicalExpression':
              return this.astLogicalExpression(ast, retArr, funcParam);
            case 'MemberExpression':
              return this.astMemberExpression(ast, retArr, funcParam);
            case 'CallExpression':
              return this.astCallExpression(ast, retArr, funcParam);
            case 'ArrayExpression':
              return this.astArrayExpression(ast, retArr, funcParam);
            case 'DebuggerStatement':
              return this.astDebuggerStatement(ast, retArr, funcParam);
          }
  
          throw this.astErrorOutput('Unknown ast type : ' + ast.type, ast, funcParam);
        }
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astFunctionDeclaration
     *
     * @desc Parses the abstract syntax tree for to its *named function declaration*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astFunctionDeclaration',
      value: function astFunctionDeclaration(ast, retArr, funcParam) {
        if (this.addFunction) {
          this.addFunction(null, utils.getAstString(this.jsFunctionString, ast));
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astFunctionPrototype
     * @static
     *
     * @desc Parses the abstract syntax tree for to its *named function prototype*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astFunctionExpression',
  
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astFunctionExpression
     *
     * @desc Parses the abstract syntax tree for to its *named function*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
      value: function astFunctionExpression(ast, retArr, funcParam) {
  
        // Setup function return type and name
        if (funcParam.isRootKernel) {
          retArr.push('void');
          funcParam.kernalAst = ast;
        } else {
          retArr.push(funcParam.returnType);
        }
        retArr.push(' ');
        retArr.push(funcParam.functionName);
        retArr.push('(');
  
        if (!funcParam.isRootKernel) {
          // Arguments handling
          for (var i = 0; i < funcParam.paramNames.length; ++i) {
            var paramName = funcParam.paramNames[i];
  
            if (i > 0) {
              retArr.push(', ');
            }
            var type = funcParam.getParamType(paramName);
            switch (type) {
              case 'Texture':
              case 'Input':
              case 'Array':
                retArr.push('sampler2D');
                break;
              default:
                retArr.push('float');
            }
  
            retArr.push(' ');
            retArr.push('user_');
            retArr.push(paramName);
          }
        }
  
        // Function opening
        retArr.push(') {\n');
  
        // Body statement iteration
        for (var _i = 0; _i < ast.body.body.length; ++_i) {
          this.astGeneric(ast.body.body[_i], retArr, funcParam);
          retArr.push('\n');
        }
  
        // Function closing
        retArr.push('}\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astReturnStatement
     *
     * @desc Parses the abstract syntax tree for to *return* statement
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Object} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astReturnStatement',
      value: function astReturnStatement(ast, retArr, funcParam) {
        if (funcParam.isRootKernel) {
          retArr.push('kernelResult = ');
          this.astGeneric(ast.argument, retArr, funcParam);
          retArr.push(';');
          retArr.push('return;');
        } else if (funcParam.isSubKernel) {
          retArr.push(funcParam.functionName + 'Result = ');
          this.astGeneric(ast.argument, retArr, funcParam);
          retArr.push(';');
          retArr.push('return ' + funcParam.functionName + 'Result;');
        } else {
          retArr.push('return ');
          this.astGeneric(ast.argument, retArr, funcParam);
          retArr.push(';');
        }
  
        //throw this.astErrorOutput(
        //	'Non main function return, is not supported : '+funcParam.currentFunctionNamespace,
        //	ast, funcParam
        //);
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astLiteral
     *
     * @desc Parses the abstract syntax tree for *literal value*
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astLiteral',
      value: function astLiteral(ast, retArr, funcParam) {
  
        // Reject non numeric literals
        if (isNaN(ast.value)) {
          throw this.astErrorOutput('Non-numeric literal not supported : ' + ast.value, ast, funcParam);
        }
  
        // Push the literal value as a float/int
        retArr.push(ast.value);
  
        // If it was an int, node made a float
        if (Number.isInteger(ast.value)) {
          retArr.push('.0');
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astBinaryExpression
     *
     * @desc Parses the abstract syntax tree for *binary* expression
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astBinaryExpression',
      value: function astBinaryExpression(ast, retArr, funcParam) {
        retArr.push('(');
  
        if (ast.operator === '%') {
          retArr.push('mod(');
          this.astGeneric(ast.left, retArr, funcParam);
          retArr.push(',');
          this.astGeneric(ast.right, retArr, funcParam);
          retArr.push(')');
        } else if (ast.operator === '===') {
          this.astGeneric(ast.left, retArr, funcParam);
          retArr.push('==');
          this.astGeneric(ast.right, retArr, funcParam);
        } else if (ast.operator === '!==') {
          this.astGeneric(ast.left, retArr, funcParam);
          retArr.push('!=');
          this.astGeneric(ast.right, retArr, funcParam);
        } else {
          this.astGeneric(ast.left, retArr, funcParam);
          retArr.push(ast.operator);
          this.astGeneric(ast.right, retArr, funcParam);
        }
  
        retArr.push(')');
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astIdentifierExpression
     *
     * @desc Parses the abstract syntax tree for *identifier* expression
     *
     * @param {Object} idtNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astIdentifierExpression',
      value: function astIdentifierExpression(idtNode, retArr, funcParam) {
        if (idtNode.type !== 'Identifier') {
          throw this.astErrorOutput('IdentifierExpression - not an Identifier', idtNode, funcParam);
        }
  
        switch (idtNode.name) {
          case 'gpu_threadX':
            retArr.push('threadId.x');
            break;
          case 'gpu_threadY':
            retArr.push('threadId.y');
            break;
          case 'gpu_threadZ':
            retArr.push('threadId.z');
            break;
          case 'gpu_outputX':
            retArr.push('uOutputDim.x');
            break;
          case 'gpu_outputY':
            retArr.push('uOutputDim.y');
            break;
          case 'gpu_outputZ':
            retArr.push('uOutputDim.z');
            break;
          default:
            if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
              retArr.push('constants_' + idtNode.name);
            } else {
              var userParamName = funcParam.getUserParamName(idtNode.name);
              if (userParamName !== null) {
                retArr.push('user_' + userParamName);
              } else {
                retArr.push('user_' + idtNode.name);
              }
            }
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astForStatement
     *
     * @desc Parses the abstract syntax tree forfor *for-loop* expression
     *
     * @param {Object} forNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the parsed webgl string
     */
  
    }, {
      key: 'astForStatement',
      value: function astForStatement(forNode, retArr, funcParam) {
        if (forNode.type !== 'ForStatement') {
          throw this.astErrorOutput('Invalid for statment', forNode, funcParam);
        }
  
        if (forNode.test && forNode.test.type === 'BinaryExpression') {
          if (forNode.test.right.type === 'Identifier' && forNode.test.operator === '<' && this.isIdentifierConstant(forNode.test.right.name) === false) {
  
            if (!this.loopMaxIterations) {
              console.warn('Warning: loopMaxIterations is not set! Using default of 1000 which may result in unintended behavior.');
              console.warn('Set loopMaxIterations or use a for loop of fixed length to silence this message.');
            }
  
            retArr.push('for (');
            this.astGeneric(forNode.init, retArr, funcParam);
            this.astGeneric(forNode.test.left, retArr, funcParam);
            retArr.push(forNode.test.operator);
            retArr.push('LOOP_MAX');
            retArr.push(';');
            this.astGeneric(forNode.update, retArr, funcParam);
            retArr.push(')');
  
            retArr.push('{\n');
            retArr.push('if (');
            this.astGeneric(forNode.test.left, retArr, funcParam);
            retArr.push(forNode.test.operator);
            this.astGeneric(forNode.test.right, retArr, funcParam);
            retArr.push(') {\n');
            if (forNode.body.type === 'BlockStatement') {
              for (var i = 0; i < forNode.body.body.length; i++) {
                this.astGeneric(forNode.body.body[i], retArr, funcParam);
              }
            } else {
              this.astGeneric(forNode.body, retArr, funcParam);
            }
            retArr.push('} else {\n');
            retArr.push('break;\n');
            retArr.push('}\n');
            retArr.push('}\n');
  
            return retArr;
          } else {
            var declarations = JSON.parse(JSON.stringify(forNode.init.declarations));
            var updateArgument = forNode.update.argument;
            if (!Array.isArray(declarations) || declarations.length < 1) {
              console.log(this.jsFunctionString);
              throw new Error('Error: Incompatible for loop declaration');
            }
  
            if (declarations.length > 1) {
              var initArgument = null;
              for (var _i2 = 0; _i2 < declarations.length; _i2++) {
                var declaration = declarations[_i2];
                if (declaration.id.name === updateArgument.name) {
                  initArgument = declaration;
                  declarations.splice(_i2, 1);
                } else {
                  retArr.push('float ');
                  this.astGeneric(declaration, retArr, funcParam);
                  retArr.push(';');
                }
              }
  
              retArr.push('for (float ');
              this.astGeneric(initArgument, retArr, funcParam);
              retArr.push(';');
            } else {
              retArr.push('for (');
              this.astGeneric(forNode.init, retArr, funcParam);
            }
  
            this.astGeneric(forNode.test, retArr, funcParam);
            retArr.push(';');
            this.astGeneric(forNode.update, retArr, funcParam);
            retArr.push(')');
            this.astGeneric(forNode.body, retArr, funcParam);
            return retArr;
          }
        }
  
        throw this.astErrorOutput('Invalid for statement', forNode, funcParam);
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astWhileStatement
     *
     * @desc Parses the abstract syntax tree for *while* loop
     *
     *
     * @param {Object} whileNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the parsed webgl string
     */
  
    }, {
      key: 'astWhileStatement',
      value: function astWhileStatement(whileNode, retArr, funcParam) {
        if (whileNode.type !== 'WhileStatement') {
          throw this.astErrorOutput('Invalid while statment', whileNode, funcParam);
        }
  
        retArr.push('for (float i = 0.0; i < LOOP_MAX; i++) {');
        retArr.push('if (');
        this.astGeneric(whileNode.test, retArr, funcParam);
        retArr.push(') {\n');
        this.astGeneric(whileNode.body, retArr, funcParam);
        retArr.push('} else {\n');
        retArr.push('break;\n');
        retArr.push('}\n');
        retArr.push('}\n');
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astAssignmentExpression
     *
     * @desc Parses the abstract syntax tree for *Assignment* Expression
     *
     * @param {Object} assNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astAssignmentExpression',
      value: function astAssignmentExpression(assNode, retArr, funcParam) {
        if (assNode.operator === '%=') {
          this.astGeneric(assNode.left, retArr, funcParam);
          retArr.push('=');
          retArr.push('mod(');
          this.astGeneric(assNode.left, retArr, funcParam);
          retArr.push(',');
          this.astGeneric(assNode.right, retArr, funcParam);
          retArr.push(')');
        } else {
          this.astGeneric(assNode.left, retArr, funcParam);
          retArr.push(assNode.operator);
          this.astGeneric(assNode.right, retArr, funcParam);
          return retArr;
        }
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astEmptyStatement
     *
     * @desc Parses the abstract syntax tree for an *Empty* Statement
     *
     * @param {Object} eNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astEmptyStatement',
      value: function astEmptyStatement(eNode, retArr, funcParam) {
        //retArr.push(';\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astBlockStatement
     *
     * @desc Parses the abstract syntax tree for *Block* statement
     *
     * @param {Object} bnode - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astBlockStatement',
      value: function astBlockStatement(bNode, retArr, funcParam) {
        retArr.push('{\n');
        for (var i = 0; i < bNode.body.length; i++) {
          this.astGeneric(bNode.body[i], retArr, funcParam);
        }
        retArr.push('}\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astExpressionStatement
     *
     * @desc Parses the abstract syntax tree for *generic expression* statement
     *
     * @param {Object} esNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astExpressionStatement',
      value: function astExpressionStatement(esNode, retArr, funcParam) {
        this.astGeneric(esNode.expression, retArr, funcParam);
        retArr.push(';\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astVariableDeclaration
     *
     * @desc Parses the abstract syntax tree for *Variable Declaration*
     *
     * @param {Object} vardecNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astVariableDeclaration',
      value: function astVariableDeclaration(vardecNode, retArr, funcParam) {
        retArr.push('float ');
        for (var i = 0; i < vardecNode.declarations.length; i++) {
          if (i > 0) {
            retArr.push(',');
          }
          this.astGeneric(vardecNode.declarations[i], retArr, funcParam);
        }
        retArr.push(';');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astVariableDeclarator
     *
     * @desc Parses the abstract syntax tree for *Variable Declarator*
     *
     * @param {Object} ivardecNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astVariableDeclarator',
      value: function astVariableDeclarator(ivardecNode, retArr, funcParam) {
        this.astGeneric(ivardecNode.id, retArr, funcParam);
        if (ivardecNode.init !== null) {
          retArr.push('=');
          this.astGeneric(ivardecNode.init, retArr, funcParam);
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astIfStatement
     *
     * @desc Parses the abstract syntax tree for *If* Statement
     *
     * @param {Object} ifNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astIfStatement',
      value: function astIfStatement(ifNode, retArr, funcParam) {
        retArr.push('if (');
        this.astGeneric(ifNode.test, retArr, funcParam);
        retArr.push(')');
        if (ifNode.consequent.type === 'BlockStatement') {
          this.astGeneric(ifNode.consequent, retArr, funcParam);
        } else {
          retArr.push(' {\n');
          this.astGeneric(ifNode.consequent, retArr, funcParam);
          retArr.push('\n}\n');
        }
  
        if (ifNode.alternate) {
          retArr.push('else ');
          if (ifNode.alternate.type === 'BlockStatement') {
            this.astGeneric(ifNode.alternate, retArr, funcParam);
          } else {
            retArr.push(' {\n');
            this.astGeneric(ifNode.alternate, retArr, funcParam);
            retArr.push('\n}\n');
          }
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astBreakStatement
     *
     * @desc Parses the abstract syntax tree for *Break* Statement
     *
     * @param {Object} brNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astBreakStatement',
      value: function astBreakStatement(brNode, retArr, funcParam) {
        retArr.push('break;\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astContinueStatement
     *
     * @desc Parses the abstract syntax tree for *Continue* Statement
     *
     * @param {Object} crNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astContinueStatement',
      value: function astContinueStatement(crNode, retArr, funcParam) {
        retArr.push('continue;\n');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astLogicalExpression
     *
     * @desc Parses the abstract syntax tree for *Logical* Expression
     *
     * @param {Object} logNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astLogicalExpression',
      value: function astLogicalExpression(logNode, retArr, funcParam) {
        retArr.push('(');
        this.astGeneric(logNode.left, retArr, funcParam);
        retArr.push(logNode.operator);
        this.astGeneric(logNode.right, retArr, funcParam);
        retArr.push(')');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astUpdateExpression
     *
     * @desc Parses the abstract syntax tree for *Update* Expression
     *
     * @param {Object} uNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astUpdateExpression',
      value: function astUpdateExpression(uNode, retArr, funcParam) {
        if (uNode.prefix) {
          retArr.push(uNode.operator);
          this.astGeneric(uNode.argument, retArr, funcParam);
        } else {
          this.astGeneric(uNode.argument, retArr, funcParam);
          retArr.push(uNode.operator);
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astUnaryExpression
     *
     * @desc Parses the abstract syntax tree for *Unary* Expression
     *
     * @param {Object} uNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astUnaryExpression',
      value: function astUnaryExpression(uNode, retArr, funcParam) {
        if (uNode.prefix) {
          retArr.push(uNode.operator);
          this.astGeneric(uNode.argument, retArr, funcParam);
        } else {
          this.astGeneric(uNode.argument, retArr, funcParam);
          retArr.push(uNode.operator);
        }
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astThisExpression
     *
     * @desc Parses the abstract syntax tree for *This* expression
     *
     * @param {Object} tNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astThisExpression',
      value: function astThisExpression(tNode, retArr, funcParam) {
        retArr.push('this');
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astMemberExpression
     *
     * @desc Parses the abstract syntax tree for *Member* Expression
     *
     * @param {Object} mNode - An ast Node
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astMemberExpression',
      value: function astMemberExpression(mNode, retArr, funcParam) {
        if (mNode.computed) {
          if (mNode.object.type === 'Identifier') {
            // Working logger
            var reqName = mNode.object.name;
            var funcName = funcParam.functionName || 'kernel';
            var assumeNotTexture = false;
  
            // Possibly an array request - handle it as such
            if (funcParam.paramNames) {
              var idx = funcParam.paramNames.indexOf(reqName);
              if (idx >= 0 && funcParam.paramTypes[idx] === 'float') {
                assumeNotTexture = true;
              }
            }
  
            if (assumeNotTexture) {
              // Get from array
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push('[int(');
              this.astGeneric(mNode.property, retArr, funcParam);
              retArr.push(')]');
            } else {
              // Get from texture
              // This normally refers to the global read only input vars
              retArr.push('get(');
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push(', vec2(');
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push('Size[0],');
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push('Size[1]), vec3(');
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push('Dim[0],');
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push('Dim[1],');
              this.astGeneric(mNode.object, retArr, funcParam);
              retArr.push('Dim[2]');
              retArr.push('), ');
              this.astGeneric(mNode.property, retArr, funcParam);
              retArr.push(')');
            }
          } else {
            this.astGeneric(mNode.object, retArr, funcParam);
            var last = retArr.pop();
            retArr.push(',');
            this.astGeneric(mNode.property, retArr, funcParam);
            retArr.push(last);
          }
        } else {
  
          // Unroll the member expression
          var unrolled = this.astMemberExpressionUnroll(mNode);
          var unrolled_lc = unrolled.toLowerCase();
  
          // Its a constant, remove this.constants.
          if (unrolled.indexOf(constantsPrefix) === 0) {
            unrolled = 'constants_' + unrolled.slice(constantsPrefix.length);
          }
  
          switch (unrolled_lc) {
            case 'this.thread.x':
              retArr.push('threadId.x');
              break;
            case 'this.thread.y':
              retArr.push('threadId.y');
              break;
            case 'this.thread.z':
              retArr.push('threadId.z');
              break;
            case 'this.output.x':
              retArr.push(this.output[0] + '.0');
              break;
            case 'this.output.y':
              retArr.push(this.output[1] + '.0');
              break;
            case 'this.output.z':
              retArr.push(this.output[2] + '.0');
              break;
            default:
              retArr.push(unrolled);
          }
        }
        return retArr;
      }
    }, {
      key: 'astSequenceExpression',
      value: function astSequenceExpression(sNode, retArr, funcParam) {
        for (var i = 0; i < sNode.expressions.length; i++) {
          if (i > 0) {
            retArr.push(',');
          }
          this.astGeneric(sNode.expressions, retArr, funcParam);
        }
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astCallExpression
     *
     * @desc Parses the abstract syntax tree for *call* expression
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns  {Array} the append retArr
     */
  
    }, {
      key: 'astCallExpression',
      value: function astCallExpression(ast, retArr, funcParam) {
        if (ast.callee) {
          // Get the full function call, unrolled
          var funcName = this.astMemberExpressionUnroll(ast.callee);
  
          // Its a math operator, remove the prefix
          if (funcName.indexOf(jsMathPrefix) === 0) {
            funcName = funcName.slice(jsMathPrefix.length);
          }
  
          // Its a local function, remove this
          if (funcName.indexOf(localPrefix) === 0) {
            funcName = funcName.slice(localPrefix.length);
          }
  
          // if this if grows to more than one, lets use a switch
          if (funcName === 'atan2') {
            funcName = 'atan';
          }
  
          // Register the function into the called registry
          if (funcParam.calledFunctions.indexOf(funcName) < 0) {
            funcParam.calledFunctions.push(funcName);
          }
          if (!funcParam.hasOwnProperty('funcName')) {
            funcParam.calledFunctionsArguments[funcName] = [];
          }
  
          var functionArguments = [];
          funcParam.calledFunctionsArguments[funcName].push(functionArguments);
  
          // Call the function
          retArr.push(funcName);
  
          // Open arguments space
          retArr.push('(');
  
          // Add the vars
          for (var i = 0; i < ast.arguments.length; ++i) {
            var argument = ast.arguments[i];
            if (i > 0) {
              retArr.push(', ');
            }
            this.astGeneric(argument, retArr, funcParam);
            if (argument.type === 'Identifier') {
              var paramIndex = funcParam.paramNames.indexOf(argument.name);
              if (paramIndex === -1) {
                functionArguments.push(null);
              } else {
                functionArguments.push({
                  name: argument.name,
                  type: funcParam.paramTypes[paramIndex]
                });
              }
            } else {
              functionArguments.push(null);
            }
          }
  
          // Close arguments space
          retArr.push(')');
  
          return retArr;
        }
  
        // Failure, unknown expression
        throw this.astErrorOutput('Unknown CallExpression', ast, funcParam);
  
        return retArr;
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name astArrayExpression
     *
     * @desc Parses the abstract syntax tree for *Array* Expression
     *
     * @param {Object} ast - the AST object to parse
     * @param {Array} retArr - return array string
     * @param {Function} funcParam - FunctionNode, that tracks compilation state
     *
     * @returns {Array} the append retArr
     */
  
    }, {
      key: 'astArrayExpression',
      value: function astArrayExpression(arrNode, retArr, funcParam) {
        var arrLen = arrNode.elements.length;
  
        retArr.push('float[' + arrLen + '](');
        for (var i = 0; i < arrLen; ++i) {
          if (i > 0) {
            retArr.push(', ');
          }
          var subNode = arrNode.elements[i];
          this.astGeneric(subNode, retArr, funcParam);
        }
        retArr.push(')');
  
        return retArr;
  
        // // Failure, unknown expression
        // throw this.astErrorOutput(
        // 	'Unknown  ArrayExpression',
        // 	arrNode, funcParam
        //);
      }
  
      /**
     * @memberOf WebGLFunctionNode#
     * @function
     * @name getFunctionPrototypeString
     *
     * @desc Returns the converted webgl shader function equivalent of the JS function
     *
     * @returns {String} webgl function string, result is cached under this.getFunctionPrototypeString
     *
     */
  
    }, {
      key: 'getFunctionPrototypeString',
      value: function getFunctionPrototypeString() {
        if (this.webGlFunctionPrototypeString) {
          return this.webGlFunctionPrototypeString;
        }
        return this.webGlFunctionPrototypeString = this.generate();
      }
    }, {
      key: 'build',
      value: function build() {
        return this.getFunctionPrototypeString().length > 0;
      }
    }], [{
      key: 'astFunctionPrototype',
      value: function astFunctionPrototype(ast, retArr, funcParam) {
        // Setup function return type and name
        if (funcParam.isRootKernel || funcParam.isSubKernel) {
          return retArr;
        }
  
        retArr.push(funcParam.returnType);
        retArr.push(' ');
        retArr.push(funcParam.functionName);
        retArr.push('(');
  
        // Arguments handling
        for (var i = 0; i < funcParam.paramNames.length; ++i) {
          if (i > 0) {
            retArr.push(', ');
          }
  
          retArr.push(funcParam.paramTypes[i]);
          retArr.push(' ');
          retArr.push('user_');
          retArr.push(funcParam.paramNames[i]);
        }
  
        retArr.push(');\n');
  
        return retArr;
      }
    }]);
  
    return WebGLFunctionNode;
  }(FunctionNodeBase);
  
  function isIdentifierKernelParam(paramName, ast, funcParam) {
    return funcParam.paramNames.indexOf(paramName) !== -1;
  }
  
  function ensureIndentifierType(paramName, expectedType, ast, funcParam) {
    var start = ast.loc.start;
  
    if (!isIdentifierKernelParam(paramName, funcParam) && expectedType !== 'float') {
      throw new Error('Error unexpected identifier ' + paramName + ' on line ' + start.line);
    } else {
      var actualType = funcParam.paramTypes[funcParam.paramNames.indexOf(paramName)];
      if (actualType !== expectedType) {
        throw new Error('Error unexpected identifier ' + paramName + ' on line ' + start.line);
      }
    }
  }
  
  /**
   * @ignore
   * @function
   * @name webgl_regex_optimize
   *
   * @desc [INTERNAL] Takes the near final webgl function string, and do regex search and replacments.
   * For voodoo optimize out the following: 
   *
   * - decode32(encode32( <br>
   * - encode32(decode32( <br>
   *
   * @param {String} inStr - The webGl function String
   *
   */
  function webGlRegexOptimize(inStr) {
    return inStr.replace(DECODE32_ENCODE32, '((').replace(ENCODE32_DECODE32, '((');
  }
  },{"../../core/utils":86,"../function-node-base":61}],67:[function(require,module,exports){
  'use strict';
  
  var utils = require('../../core/utils');
  var kernelRunShortcut = require('../kernel-run-shortcut');
  
  function removeFnNoise(fn) {
    if (/^function /.test(fn)) {
      fn = fn.substring(9);
    }
    return fn.replace(/[_]typeof/g, 'typeof');
  }
  
  function removeNoise(str) {
    return str.replace(/[_]typeof/g, 'typeof');
  }
  
  module.exports = function (gpuKernel, name) {
    return '() => {\n    ' + kernelRunShortcut.toString() + ';\n    const utils = {\n      allPropertiesOf: ' + removeNoise(utils.allPropertiesOf.toString()) + ',\n      clone: ' + removeNoise(utils.clone.toString()) + ',\n      splitArray: ' + removeNoise(utils.splitArray.toString()) + ',\n      getArgumentType: ' + removeNoise(utils.getArgumentType.toString()) + ',\n      getDimensions: ' + removeNoise(utils.getDimensions.toString()) + ',\n      dimToTexSize: ' + removeNoise(utils.dimToTexSize.toString()) + ',\n      flattenTo: ' + removeNoise(utils.flattenTo.toString()) + ',\n      flatten2dArrayTo: ' + removeNoise(utils.flatten2dArrayTo.toString()) + ',\n      flatten3dArrayTo: ' + removeNoise(utils.flatten3dArrayTo.toString()) + ',\n      systemEndianness: \'' + removeNoise(utils.systemEndianness()) + '\',\n      initWebGl: ' + removeNoise(utils.initWebGl.toString()) + ',\n      isArray: ' + removeNoise(utils.isArray.toString()) + '\n    };\n    const Utils = utils;\n    const canvases = [];\n    const maxTexSizes = {};\n    class ' + (name || 'Kernel') + ' {\n      constructor() {\n        this.maxTexSize = null;\n        this.argumentsLength = 0;\n        this._canvas = null;\n        this._webGl = null;\n        this.built = false;\n        this.program = null;\n        this.paramNames = ' + JSON.stringify(gpuKernel.paramNames) + ';\n        this.paramTypes = ' + JSON.stringify(gpuKernel.paramTypes) + ';\n        this.texSize = ' + JSON.stringify(gpuKernel.texSize) + ';\n        this.output = ' + JSON.stringify(gpuKernel.output) + ';\n        this.compiledFragShaderString = `' + gpuKernel.compiledFragShaderString + '`;\n\t\t    this.compiledVertShaderString = `' + gpuKernel.compiledVertShaderString + '`;\n\t\t    this.programUniformLocationCache = {};\n\t\t    this.textureCache = {};\n\t\t    this.subKernelOutputTextures = null;\n\t\t    this.subKernelOutputVariableNames = null;\n\t\t    this.uniform1fCache = {};\n\t\t    this.uniform1iCache = {};\n\t\t    this.uniform2fCache = {};\n\t\t    this.uniform2fvCache = {};\n\t\t    this.uniform3fvCache = {};\n      }\n      ' + removeFnNoise(gpuKernel._getFragShaderString.toString()) + '\n      ' + removeFnNoise(gpuKernel._getVertShaderString.toString()) + '\n      validateOptions() {}\n      setupParams() {}\n      setCanvas(canvas) { this._canvas = canvas; return this; }\n      setWebGl(webGl) { this._webGl = webGl; return this; }\n      ' + removeFnNoise(gpuKernel.getUniformLocation.toString()) + '\n      ' + removeFnNoise(gpuKernel.setupParams.toString()) + '\n      ' + removeFnNoise(gpuKernel.build.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.run.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel._addArgument.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.getArgumentTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.getTextureCache.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.getOutputTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.renderOutput.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.updateMaxTexSize.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel._setupOutputTexture.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.detachTextureCache.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.setUniform1f.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.setUniform1i.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.setUniform2f.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.setUniform2fv.toString()) + '\n\t\t  ' + removeFnNoise(gpuKernel.setUniform3fv.toString()) + ' \n    };\n    return kernelRunShortcut(new Kernel());\n  };';
  };
  },{"../../core/utils":86,"../kernel-run-shortcut":63}],68:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var KernelBase = require('../kernel-base');
  var utils = require('../../core/utils');
  var Texture = require('../../core/texture');
  var fragShaderString = require('./shader-frag');
  var vertShaderString = require('./shader-vert');
  var kernelString = require('./kernel-string');
  var canvases = [];
  var maxTexSizes = {};
  
  module.exports = function (_KernelBase) {
    _inherits(WebGLKernel, _KernelBase);
  
    /**
    * @constructor WebGLKernel
    *
    * @desc Kernel Implementation for WebGL.
    * <p>This builds the shaders and runs them on the GPU,
    * the outputs the result back as float(enabled by default) and Texture.</p>
    *
    * @extends KernelBase
    *
    * @prop {Object} textureCache - webGl Texture cache
    * @prop {Object} threadDim - The thread dimensions, x, y and z
    * @prop {Object} programUniformLocationCache - Location of program variables in memory
    * @prop {Object} framebuffer - Webgl frameBuffer
    * @prop {Object} buffer - WebGL buffer
    * @prop {Object} program - The webGl Program
    * @prop {Object} functionBuilder - Function Builder instance bound to this Kernel
    * @prop {Boolean} outputToTexture - Set output type to Texture, instead of float
    * @prop {String} endianness - Endian information like Little-endian, Big-endian.
    * @prop {Array} paramTypes - Types of parameters sent to the Kernel
    * @prop {number} argumentsLength - Number of parameters sent to the Kernel
    * @prop {String} compiledFragShaderString - Compiled fragment shader string
    * @prop {String} compiledVertShaderString - Compiled Vertical shader string
    */
    function WebGLKernel(fnString, settings) {
      _classCallCheck(this, WebGLKernel);
  
      var _this = _possibleConstructorReturn(this, (WebGLKernel.__proto__ || Object.getPrototypeOf(WebGLKernel)).call(this, fnString, settings));
  
      _this.textureCache = {};
      _this.threadDim = {};
      _this.programUniformLocationCache = {};
      _this.framebuffer = null;
  
      _this.buffer = null;
      _this.program = null;
      _this.outputToTexture = settings.outputToTexture;
      _this.endianness = utils.systemEndianness();
      _this.subKernelOutputTextures = null;
      _this.subKernelOutputVariableNames = null;
      _this.argumentsLength = 0;
      _this.compiledFragShaderString = null;
      _this.compiledVertShaderString = null;
      _this.drawBuffersMap = null;
      _this.outputTexture = null;
      _this.maxTexSize = null;
      _this.uniform1fCache = {};
      _this.uniform1iCache = {};
      _this.uniform2fCache = {};
      _this.uniform2fvCache = {};
      _this.uniform3fvCache = {};
      if (!_this._webGl) _this._webGl = _this.initWebGl();
      return _this;
    }
  
    _createClass(WebGLKernel, [{
      key: 'initWebGl',
      value: function initWebGl() {
        return utils.initWebGl(this.getCanvas());
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name validateOptions
     *
     * @desc Validate options related to Kernel, such as
     * floatOutputs and Textures, texSize, output,
     * graphical output.
     *
     */
  
    }, {
      key: 'validateOptions',
      value: function validateOptions() {
        var isFloatReadPixel = utils.isFloatReadPixelsSupported();
        if (this.floatTextures === true && !utils.OES_texture_float) {
          throw new Error('Float textures are not supported on this browser');
        } else if (this.floatOutput === true && this.floatOutputForce !== true && !isFloatReadPixel) {
          throw new Error('Float texture outputs are not supported on this browser');
        } else if (this.floatTextures === undefined && utils.OES_texture_float) {
          this.floatTextures = true;
          this.floatOutput = isFloatReadPixel;
        }
  
        if (!this.output || this.output.length === 0) {
          if (arguments.length !== 1) {
            throw new Error('Auto output only supported for kernels with only one input');
          }
  
          var argType = utils.getArgumentType(arguments[0]);
          if (argType === 'Array') {
            this.output = utils.getDimensions(argType);
          } else if (argType === 'Texture') {
            this.output = arguments[0].output;
          } else {
            throw new Error('Auto output not supported for input type: ' + argType);
          }
        }
  
        this.texSize = utils.dimToTexSize({
          floatTextures: this.floatTextures,
          floatOutput: this.floatOutput
        }, this.output, true);
  
        if (this.graphical) {
          if (this.output.length !== 2) {
            throw new Error('Output must have 2 dimensions on graphical mode');
          }
  
          if (this.floatOutput) {
            this.floatOutput = false;
            console.warn('Cannot use graphical mode and float output at the same time');
          }
  
          this.texSize = utils.clone(this.output);
        } else if (this.floatOutput === undefined && utils.OES_texture_float) {
          this.floatOutput = true;
        }
      }
    }, {
      key: 'updateMaxTexSize',
      value: function updateMaxTexSize() {
        var texSize = this.texSize;
        var canvas = this._canvas;
        if (this.maxTexSize === null) {
          var canvasIndex = canvases.indexOf(canvas);
          if (canvasIndex === -1) {
            canvasIndex = canvases.length;
            canvases.push(canvas);
            maxTexSizes[canvasIndex] = [texSize[0], texSize[1]];
          }
          this.maxTexSize = maxTexSizes[canvasIndex];
        }
        if (this.maxTexSize[0] < texSize[0]) {
          this.maxTexSize[0] = texSize[0];
        }
        if (this.maxTexSize[1] < texSize[1]) {
          this.maxTexSize[1] = texSize[1];
        }
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name build
     *
     * @desc Builds the Kernel, by compiling Fragment and Vertical Shaders,
     * and instantiates the program.
     *
     */
  
    }, {
      key: 'build',
      value: function build() {
        this.validateOptions();
        this.setupParams(arguments);
        this.updateMaxTexSize();
        var texSize = this.texSize;
        var gl = this._webGl;
        var canvas = this._canvas;
        gl.enable(gl.SCISSOR_TEST);
        gl.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]);
        canvas.width = this.maxTexSize[0];
        canvas.height = this.maxTexSize[1];
        var threadDim = this.threadDim = utils.clone(this.output);
        while (threadDim.length < 3) {
          threadDim.push(1);
        }
  
        if (this.functionBuilder) this._addKernels();
  
        var compiledVertShaderString = this._getVertShaderString(arguments);
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, compiledVertShaderString);
        gl.compileShader(vertShader);
  
        var compiledFragShaderString = this._getFragShaderString(arguments);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, compiledFragShaderString);
        gl.compileShader(fragShader);
  
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
          console.log(compiledVertShaderString);
          console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertShader));
          throw new Error('Error compiling vertex shader');
        }
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
          console.log(compiledFragShaderString);
          console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragShader));
          throw new Error('Error compiling fragment shader');
        }
  
        if (this.debug) {
          console.log('Options:');
          console.dir(this);
          console.log('GLSL Shader Output:');
          console.log(compiledFragShaderString);
        }
  
        var program = this.program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        this.framebuffer = gl.createFramebuffer();
        this.framebuffer.width = texSize[0];
        this.framebuffer.height = texSize[1];
  
        var vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        var texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  
        var texCoordOffset = vertices.byteLength;
  
        var buffer = this.buffer;
        if (!buffer) {
          buffer = this.buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + texCoords.byteLength, gl.STATIC_DRAW);
        } else {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        }
  
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, texCoordOffset, texCoords);
  
        var aPosLoc = gl.getAttribLocation(this.program, 'aPos');
        gl.enableVertexAttribArray(aPosLoc);
        gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, gl.FALSE, 0, 0);
        var aTexCoordLoc = gl.getAttribLocation(this.program, 'aTexCoord');
        gl.enableVertexAttribArray(aTexCoordLoc);
        gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, gl.FALSE, 0, texCoordOffset);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  
        if (!this.outputImmutable) {
          this._setupOutputTexture();
          if (this.subKernelOutputVariableNames !== null && this.subKernelOutputVariableNames.length > 0) {
            this._setupSubOutputTextures(this.subKernelOutputVariableNames.length);
          }
        }
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name run
     *
     * @desc Run the kernel program, and send the output to renderOutput
     *
     * <p> This method calls a helper method *renderOutput* to return the result. </p>
     *
     * @returns {Object|Undefined} Result The final output of the program, as float, and as Textures for reuse.
     *
     *
     */
  
    }, {
      key: 'run',
      value: function run() {
        if (this.program === null) {
          this.build.apply(this, arguments);
        }
        var paramNames = this.paramNames;
        var paramTypes = this.paramTypes;
        var texSize = this.texSize;
        var gl = this._webGl;
  
        gl.useProgram(this.program);
        gl.scissor(0, 0, texSize[0], texSize[1]);
  
        if (!this.hardcodeConstants) {
          this.setUniform3fv('uOutputDim', this.threadDim);
          this.setUniform2fv('uTexSize', texSize);
        }
  
        this.setUniform2f('ratio', texSize[0] / this.maxTexSize[0], texSize[1] / this.maxTexSize[1]);
  
        this.argumentsLength = 0;
        for (var texIndex = 0; texIndex < paramNames.length; texIndex++) {
          this._addArgument(arguments[texIndex], paramTypes[texIndex], paramNames[texIndex]);
        }
  
        if (this.graphical) {
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          return;
        }
  
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        if (this.outputImmutable) {
          this._setupOutputTexture();
        }
        var outputTexture = this.outputTexture;
  
        if (this.subKernelOutputVariableNames !== null) {
          if (this.outputImmutable) {
            this.subKernelOutputTextures = [];
            this._setupSubOutputTextures(this.subKernelOutputVariableNames.length);
          }
          this.drawBuffers.drawBuffersWEBGL(this.drawBuffersMap);
        }
  
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
        if (this.subKernelOutputTextures !== null) {
          if (this.subKernels !== null) {
            var output = [];
            output.result = this.renderOutput(outputTexture);
            for (var i = 0; i < this.subKernels.length; i++) {
              output.push(new Texture(this.subKernelOutputTextures[i], texSize, this.threadDim, this.output, this._webGl));
            }
            return output;
          } else if (this.subKernelProperties !== null) {
            var _output = {
              result: this.renderOutput(outputTexture)
            };
            var _i = 0;
            for (var p in this.subKernelProperties) {
              if (!this.subKernelProperties.hasOwnProperty(p)) continue;
              _output[p] = new Texture(this.subKernelOutputTextures[_i], texSize, this.threadDim, this.output, this._webGl);
              _i++;
            }
            return _output;
          }
        }
  
        return this.renderOutput(outputTexture);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name renderOutput
     *
     *
     * @desc Helper function to return webGl function's output.
     * Since the program runs on GPU, we need to get the
     * output of the program back to CPU and then return them.
     *
     * *Note*: This should not be called directly.
     *
     * @param {Object} outputTexture - Output Texture returned by webGl program
     *
     * @returns {Object|Array} result
     *
     *
     */
  
    }, {
      key: 'renderOutput',
      value: function renderOutput(outputTexture) {
        var texSize = this.texSize;
        var gl = this._webGl;
        var threadDim = this.threadDim;
        var output = this.output;
        if (this.outputToTexture) {
          return new Texture(outputTexture, texSize, this.threadDim, output, this._webGl);
        } else {
          var result = void 0;
          if (this.floatOutput) {
            result = new Float32Array(texSize[0] * texSize[1] * 4);
            gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.FLOAT, result);
          } else {
            var bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
            gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
            result = new Float32Array(bytes.buffer);
          }
  
          result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);
  
          if (output.length === 1) {
            return result;
          } else if (output.length === 2) {
            return utils.splitArray(result, output[0]);
          } else if (output.length === 3) {
            var cube = utils.splitArray(result, output[0] * output[1]);
            return cube.map(function (x) {
              return utils.splitArray(x, output[0]);
            });
          }
        }
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name getOutputTexture
     *
     * @desc This return defined outputTexture, which is setup in .build(), or if immutable, is defined in .run()
     *
     * @returns {Object} Output Texture Cache
     *
     */
  
    }, {
      key: 'getOutputTexture',
      value: function getOutputTexture() {
        return this.outputTexture;
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _setupOutputTexture
     * @private
     *
     * @desc Setup and replace output texture
     */
  
    }, {
      key: '_setupOutputTexture',
      value: function _setupOutputTexture() {
        var gl = this._webGl;
        var texSize = this.texSize;
        var texture = this.outputTexture = this._webGl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this.paramNames.length);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        if (this.floatOutput) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @param length
     * @private
     *
     * @desc Setup and replace sub-output textures
     */
  
    }, {
      key: '_setupSubOutputTextures',
      value: function _setupSubOutputTextures(length) {
        var gl = this._webGl;
        var texSize = this.texSize;
        var drawBuffersMap = this.drawBuffersMap = [gl.COLOR_ATTACHMENT0];
        var textures = this.subKernelOutputTextures = [];
        for (var i = 0; i < length; i++) {
          var texture = this._webGl.createTexture();
          textures.push(texture);
          drawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
          gl.activeTexture(gl.TEXTURE0 + this.paramNames.length + i);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          if (this.floatOutput) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
          } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
          }
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, texture, 0);
        }
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name getArgumentTexture
     *
     * @desc This uses *getTextureCache** to get the Texture Cache of the argument supplied
     *
     * @param {String} name - Name of the argument
     *
     * 	Texture cache for the supplied argument
     *
     */
  
    }, {
      key: 'getArgumentTexture',
      value: function getArgumentTexture(name) {
        return this.getTextureCache('ARGUMENT_' + name);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @name getTextureCache
     * @function
     *
     * @desc Returns the Texture Cache of the supplied parameter (can be kernel, sub-kernel or argument)
     *
     * @param {String} name - Name of the subkernel, argument, or kernel.
     *
     * @returns {Object} Texture cache
     *
     */
  
    }, {
      key: 'getTextureCache',
      value: function getTextureCache(name) {
        if (this.textureCache.hasOwnProperty(name)) {
          return this.textureCache[name];
        }
        return this.textureCache[name] = this._webGl.createTexture();
      }
  
      /**
     * @memberOf WebGLKernel#
     * @name detachTextureCache
     * @function
     * @desc removes a texture from the kernel's cache
     * @param {String} name - Name of texture
     */
  
    }, {
      key: 'detachTextureCache',
      value: function detachTextureCache(name) {
        delete this.textureCache[name];
      }
    }, {
      key: 'setUniform1f',
      value: function setUniform1f(name, value) {
        if (this.uniform1fCache.hasOwnProperty(name)) {
          var cache = this.uniform1fCache[name];
          if (value === cache) {
            return;
          }
        }
        this.uniform1fCache[name] = value;
        var loc = this.getUniformLocation(name);
        this._webGl.uniform1f(loc, value);
      }
    }, {
      key: 'setUniform1i',
      value: function setUniform1i(name, value) {
        if (this.uniform1iCache.hasOwnProperty(name)) {
          var cache = this.uniform1iCache[name];
          if (value === cache) {
            return;
          }
        }
        this.uniform1iCache[name] = value;
        var loc = this.getUniformLocation(name);
        this._webGl.uniform1i(loc, value);
      }
    }, {
      key: 'setUniform2f',
      value: function setUniform2f(name, value1, value2) {
        if (this.uniform2fCache.hasOwnProperty(name)) {
          var cache = this.uniform2fCache[name];
          if (value1 === cache[0] && value2 === cache[1]) {
            return;
          }
        }
        this.uniform2fCache[name] = [value1, value2];
        var loc = this.getUniformLocation(name);
        this._webGl.uniform2f(loc, value1, value2);
      }
    }, {
      key: 'setUniform2fv',
      value: function setUniform2fv(name, value) {
        if (this.uniform2fvCache.hasOwnProperty(name)) {
          var cache = this.uniform2fvCache[name];
          if (value[0] === cache[0] && value[1] === cache[1]) {
            return;
          }
        }
        this.uniform2fvCache[name] = value;
        var loc = this.getUniformLocation(name);
        this._webGl.uniform2fv(loc, value);
      }
    }, {
      key: 'setUniform3fv',
      value: function setUniform3fv(name, value) {
        if (this.uniform3fvCache.hasOwnProperty(name)) {
          var cache = this.uniform3fvCache[name];
          if (value[0] === cache[0] && value[1] === cache[1] && value[2] === cache[2]) {
            return;
          }
        }
        this.uniform3fvCache[name] = value;
        var loc = this.getUniformLocation(name);
        this._webGl.uniform3fv(loc, value);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name getUniformLocation
     *
     * @desc Return WebGlUniformLocation for various variables
     * related to webGl program, such as user-defiend variables,
     * as well as, dimension sizes, etc.
     *
     */
  
    }, {
      key: 'getUniformLocation',
      value: function getUniformLocation(name) {
        if (this.programUniformLocationCache.hasOwnProperty(name)) {
          return this.programUniformLocationCache[name];
        }
        return this.programUniformLocationCache[name] = this._webGl.getUniformLocation(this.program, name);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getFragShaderArtifactMap
     *
     * @desc Generate Shader artifacts for the kernel program.
     * The final object contains HEADER, KERNEL, MAIN_RESULT, and others.
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     * @returns {Object} An object containing the Shader Artifacts(CONSTANTS, HEADER, KERNEL, etc.)
     *
     */
  
    }, {
      key: '_getFragShaderArtifactMap',
      value: function _getFragShaderArtifactMap(args) {
        return {
          HEADER: this._getHeaderString(),
          LOOP_MAX: this._getLoopMaxString(),
          CONSTANTS: this._getConstantsString(),
          DECODE32_ENDIANNESS: this._getDecode32EndiannessString(),
          ENCODE32_ENDIANNESS: this._getEncode32EndiannessString(),
          GET_WRAPAROUND: this._getGetWraparoundString(),
          GET_TEXTURE_CHANNEL: this._getGetTextureChannelString(),
          GET_TEXTURE_INDEX: this._getGetTextureIndexString(),
          GET_RESULT: this._getGetResultString(),
          MAIN_PARAMS: this._getMainParamsString(args),
          MAIN_CONSTANTS: this._getMainConstantsString(),
          KERNEL: this._getKernelString(),
          MAIN_RESULT: this._getMainResultString()
        };
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _addArgument
     *
     * @desc Adds kernel parameters to the Argument Texture,
     * binding it to the webGl instance, etc.
     *
     * @param {Array|Texture|Number} value - The actual argument supplied to the kernel
     * @param {String} type - Type of the argument
     * @param {String} name - Name of the argument
     *
     */
  
    }, {
      key: '_addArgument',
      value: function _addArgument(value, type, name) {
        var gl = this._webGl;
        var argumentTexture = this.getArgumentTexture(name);
        if (value instanceof Texture) {
          type = 'Texture';
        }
        switch (type) {
          case 'Array':
            {
              var dim = utils.getDimensions(value, true);
              var size = utils.dimToTexSize({
                floatTextures: this.floatTextures,
                floatOutput: this.floatOutput
              }, dim);
              gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
              gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
              var length = size[0] * size[1];
              if (this.floatTextures) {
                length *= 4;
              }
  
              var valuesFlat = new Float32Array(length);
              utils.flattenTo(value, valuesFlat);
  
              var buffer = void 0;
              if (this.floatTextures) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
              } else {
                buffer = new Uint8Array(valuesFlat.buffer);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
              }
  
              if (!this.hardcodeConstants) {
                this.setUniform3fv('user_' + name + 'Dim', dim);
                this.setUniform2fv('user_' + name + 'Size', size);
              }
              this.setUniform1i('user_' + name, this.argumentsLength);
              break;
            }
          case 'Number':
            {
              this.setUniform1f('user_' + name, value);
              break;
            }
          case 'Input':
            {
              var input = value;
              var _dim = input.size;
              var _size = utils.dimToTexSize({
                floatTextures: this.floatTextures,
                floatOutput: this.floatOutput
              }, _dim);
              gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
              gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
              var _length = _size[0] * _size[1];
              var inputArray = void 0;
              if (this.floatTextures) {
                _length *= 4;
                inputArray = new Float32Array(_length);
                inputArray.set(input.value);
              } else {
                inputArray = input.value;
              }
  
              if (this.floatTextures) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _size[0], _size[1], 0, gl.RGBA, gl.FLOAT, inputArray);
              } else {
                var _buffer = new Uint8Array(inputArray.buffer);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _size[0], _size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, _buffer);
              }
  
              if (!this.hardcodeConstants) {
                this.setUniform3fv('user_' + name + 'Dim', _dim);
                this.setUniform2fv('user_' + name + 'Size', _size);
              }
              this.setUniform1i('user_' + name, this.argumentsLength);
              break;
            }
          case 'Texture':
            {
              var inputTexture = value;
              var _dim2 = inputTexture.dimensions;
              var _size2 = inputTexture.size;
  
              gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
              gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);
  
              this.setUniform3fv('user_' + name + 'Dim', _dim2);
              this.setUniform2fv('user_' + name + 'Size', _size2);
              this.setUniform1i('user_' + name, this.argumentsLength);
              break;
            }
          default:
            throw new Error('Input type not supported (WebGL): ' + value);
        }
        this.argumentsLength++;
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getHeaderString
     *
     * @desc Get the header string for the program.
     * This returns an empty string if no sub-kernels are defined.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getHeaderString',
      value: function _getHeaderString() {
        return this.subKernels !== null || this.subKernelProperties !== null ?
        //webgl2 '#version 300 es\n' :
        '#extension GL_EXT_draw_buffers : require\n' : '';
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getLoopMaxString
     *
     * @desc Get the maximum loop size String.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getLoopMaxString',
      value: function _getLoopMaxString() {
        return this.loopMaxIterations ? ' ' + parseInt(this.loopMaxIterations) + '.0;\n' : ' 1000.0;\n';
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getConstantsString
     *
     * @desc Generate transpiled glsl Strings for constant parameters sent to a kernel
     *
     * They can be defined by *hardcodeConstants*
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getConstantsString',
      value: function _getConstantsString() {
        var result = [];
        var threadDim = this.threadDim;
        var texSize = this.texSize;
        if (this.hardcodeConstants) {
          result.push('highp vec3 uOutputDim = vec3(' + threadDim[0] + ',' + threadDim[1] + ', ' + threadDim[2] + ')', 'highp vec2 uTexSize = vec2(' + texSize[0] + ', ' + texSize[1] + ')');
        } else {
          result.push('uniform highp vec3 uOutputDim', 'uniform highp vec2 uTexSize');
        }
  
        return this._linesToString(result);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getTextureCoordinate
     *
     * @desc Get texture coordinate string for the program
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getTextureCoordinate',
      value: function _getTextureCoordinate() {
        var names = this.subKernelOutputVariableNames;
        if (names === null || names.length < 1) {
          return 'varying highp vec2 vTexCoord;\n';
        } else {
          return 'out highp vec2 vTexCoord;\n';
        }
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getDecode32EndiannessString
     *
     * @desc Get Decode32 endianness string for little-endian and big-endian
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getDecode32EndiannessString',
      value: function _getDecode32EndiannessString() {
        return this.endianness === 'LE' ? '' : '  rgba.rgba = rgba.abgr;\n';
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getEncode32EndiannessString
     *
     * @desc Get Encode32 endianness string for little-endian and big-endian
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getEncode32EndiannessString',
      value: function _getEncode32EndiannessString() {
        return this.endianness === 'LE' ? '' : '  rgba.rgba = rgba.abgr;\n';
      }
  
      /**
     * @function
     * @memberOf WebGLKernel#
     * @name _getGetWraparoundString
     *
     * @returns {String} wraparound string
     */
  
    }, {
      key: '_getGetWraparoundString',
      value: function _getGetWraparoundString() {
        return this.wraparound ? '  xyz = mod(xyz, texDim);\n' : '';
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getGetTextureChannelString
     *
     */
  
    }, {
      key: '_getGetTextureChannelString',
      value: function _getGetTextureChannelString() {
        if (!this.floatTextures) return '';
  
        return this._linesToString(['  int channel = int(integerMod(index, 4.0))', '  index = float(int(index) / 4)']);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getGetTextureIndexString
     *
     * @desc Get generic texture index string, if floatTextures flag is true.
     *
     * @example
     * '  index = float(int(index)/4);\n'
     *
     */
  
    }, {
      key: '_getGetTextureIndexString',
      value: function _getGetTextureIndexString() {
        return this.floatTextures ? '  index = float(int(index)/4);\n' : '';
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getGetResultString
     *
     */
  
    }, {
      key: '_getGetResultString',
      value: function _getGetResultString() {
        if (!this.floatTextures) return '  return decode32(texel);\n';
        return this._linesToString(['  if (channel == 0) return texel.r', '  if (channel == 1) return texel.g', '  if (channel == 2) return texel.b', '  if (channel == 3) return texel.a']);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getMainParamsString
     *
     * @desc Generate transpiled glsl Strings for user-defined parameters sent to a kernel
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getMainParamsString',
      value: function _getMainParamsString(args) {
        var result = [];
        var paramTypes = this.paramTypes;
        var paramNames = this.paramNames;
        for (var i = 0; i < paramNames.length; i++) {
          var param = args[i];
          var paramName = paramNames[i];
          var paramType = paramTypes[i];
          if (this.hardcodeConstants) {
            if (paramType === 'Array' || paramType === 'Texture') {
              var paramDim = utils.getDimensions(param, true);
              var paramSize = utils.dimToTexSize({
                floatTextures: this.floatTextures,
                floatOutput: this.floatOutput
              }, paramDim);
  
              result.push('uniform highp sampler2D user_' + paramName, 'highp vec2 user_' + paramName + 'Size = vec2(' + paramSize[0] + '.0, ' + paramSize[1] + '.0)', 'highp vec3 user_' + paramName + 'Dim = vec3(' + paramDim[0] + '.0, ' + paramDim[1] + '.0, ' + paramDim[2] + '.0)');
            } else if (paramType === 'Number' && Number.isInteger(param)) {
              result.push('highp float user_' + paramName + ' = ' + param + '.0');
            } else if (paramType === 'Number') {
              result.push('highp float user_' + paramName + ' = ' + param);
            }
          } else {
            if (paramType === 'Array' || paramType === 'Texture' || paramType === 'Input') {
              result.push('uniform highp sampler2D user_' + paramName, 'uniform highp vec2 user_' + paramName + 'Size', 'uniform highp vec3 user_' + paramName + 'Dim');
            } else if (paramType === 'Number') {
              result.push('uniform highp float user_' + paramName);
            }
          }
        }
        return this._linesToString(result);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getMainConstantsString
     *
     */
  
    }, {
      key: '_getMainConstantsString',
      value: function _getMainConstantsString() {
        var result = [];
        if (this.constants) {
          for (var name in this.constants) {
            if (!this.constants.hasOwnProperty(name)) continue;
            var value = parseFloat(this.constants[name]);
  
            if (Number.isInteger(value)) {
              result.push('const float constants_' + name + ' = ' + parseInt(value) + '.0');
            } else {
              result.push('const float constants_' + name + ' = ' + parseFloat(value));
            }
          }
        }
        return this._linesToString(result);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getKernelString
     *
     * @desc Get Kernel program string (in *glsl*) for a kernel.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getKernelString',
      value: function _getKernelString() {
        var result = [];
        var names = this.subKernelOutputVariableNames;
        if (names !== null) {
          result.push('highp float kernelResult = 0.0');
          for (var i = 0; i < names.length; i++) {
            result.push('highp float ' + names[i] + ' = 0.0');
          }
  
          /* this is v2 prep
         result.push('highp float kernelResult = 0.0');
      result.push('layout(location = 0) out highp float fradData0 = 0.0');
      for (let i = 0; i < names.length; i++) {
        result.push(
             `highp float ${ names[i] } = 0.0`,
          `layout(location = ${ i + 1 }) out highp float fragData${ i + 1 } = 0.0`
           );
      }*/
        } else {
          result.push('highp float kernelResult = 0.0');
        }
  
        return this._linesToString(result) + this.functionBuilder.getPrototypeString('kernel');
      }
  
      /**
     *
     * @memberOf WebGLKernel#
     * @function
     * @name _getMainResultString
     *
     * @desc Get main result string with checks for floatOutput, graphical, subKernelsOutputs, etc.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getMainResultString',
      value: function _getMainResultString() {
        var names = this.subKernelOutputVariableNames;
        var result = [];
  
        if (this.floatOutput) {
          result.push('  index *= 4.0');
        }
  
        if (this.graphical) {
          result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor = actualColor');
        } else if (this.floatOutput) {
          var channels = ['r', 'g', 'b', 'a'];
  
          for (var i = 0; i < channels.length; ++i) {
            result.push('  threadId = indexTo3D(index, uOutputDim)');
            result.push('  kernel()');
  
            if (names) {
              result.push('  gl_FragData[0].' + channels[i] + ' = kernelResult');
  
              for (var j = 0; j < names.length; ++j) {
                result.push('  gl_FragData[' + (j + 1) + '].' + channels[i] + ' = ' + names[j]);
              }
            } else {
              result.push('  gl_FragColor.' + channels[i] + ' = kernelResult');
            }
  
            if (i < channels.length - 1) {
              result.push('  index += 1.0');
            }
          }
        } else if (names !== null) {
          result.push('  threadId = indexTo3D(index, uOutputDim)');
          result.push('  kernel()');
          result.push('  gl_FragData[0] = encode32(kernelResult)');
          for (var _i2 = 0; _i2 < names.length; _i2++) {
            result.push('  gl_FragData[' + (_i2 + 1) + '] = encode32(' + names[_i2] + ')');
          }
        } else {
          result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  gl_FragColor = encode32(kernelResult)');
        }
  
        return this._linesToString(result);
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _linesToString
     *
     * @param {Array} lines - An Array of strings
     *
     * @returns {String} Single combined String, seperated by *\n*
     *
     */
  
    }, {
      key: '_linesToString',
      value: function _linesToString(lines) {
        if (lines.length > 0) {
          return lines.join(';\n') + ';\n';
        } else {
          return '\n';
        }
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _replaceArtifacts
     *
     * @param {String} src - Shader string
     * @param {Array} map - Variables/Constants associated with shader
     *
     */
  
    }, {
      key: '_replaceArtifacts',
      value: function _replaceArtifacts(src, map) {
        return src.replace(/[ ]*__([A-Z]+[0-9]*([_]?[A-Z])*)__;\n/g, function (match, artifact) {
          if (map.hasOwnProperty(artifact)) {
            return map[artifact];
          }
          throw 'unhandled artifact ' + artifact;
        });
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _addKernels
     *
     * @desc Adds all the sub-kernels supplied with this Kernel instance.
     *
     */
  
    }, {
      key: '_addKernels',
      value: function _addKernels() {
        var _this2 = this;
  
        var builder = this.functionBuilder;
        var gl = this._webGl;
  
        builder.addFunctions(this.functions, {
          constants: this.constants,
          output: this.output
        });
        builder.addNativeFunctions(this.nativeFunctions);
  
        builder.addKernel(this.fnString, {
          prototypeOnly: false,
          constants: this.constants,
          output: this.output,
          debug: this.debug,
          loopMaxIterations: this.loopMaxIterations
        }, this.paramNames, this.paramTypes);
  
        if (this.subKernels !== null) {
          var drawBuffers = this.drawBuffers = gl.getExtension('WEBGL_draw_buffers');
          if (!drawBuffers) throw new Error('could not instantiate draw buffers extension');
          this.subKernelOutputVariableNames = [];
          this.subKernels.forEach(function (subKernel) {
            return _this2._addSubKernel(subKernel);
          });
        } else if (this.subKernelProperties !== null) {
          var _drawBuffers = this.drawBuffers = gl.getExtension('WEBGL_draw_buffers');
          if (!_drawBuffers) throw new Error('could not instantiate draw buffers extension');
          this.subKernelOutputVariableNames = [];
          Object.keys(this.subKernelProperties).forEach(function (property) {
            return _this2._addSubKernel(_this2.subKernelProperties[property]);
          });
        }
      }
    }, {
      key: '_addSubKernel',
      value: function _addSubKernel(subKernel) {
        this.functionBuilder.addSubKernel(subKernel, {
          prototypeOnly: false,
          constants: this.constants,
          output: this.output,
          debug: this.debug,
          loopMaxIterations: this.loopMaxIterations
        });
        this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getFragShaderString
     *
     * @desc Get the fragment shader String.
     * If the String hasn't been compiled yet,
     * then this method compiles it as well
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     * @returns {String} Fragment Shader string
     *
     */
  
    }, {
      key: '_getFragShaderString',
      value: function _getFragShaderString(args) {
        if (this.compiledFragShaderString !== null) {
          return this.compiledFragShaderString;
        }
        return this.compiledFragShaderString = this._replaceArtifacts(fragShaderString, this._getFragShaderArtifactMap(args));
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name _getVertShaderString
     *
     * @desc Get the vertical shader String
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     * @returns {String} Vertical Shader string
     *
     */
  
    }, {
      key: '_getVertShaderString',
      value: function _getVertShaderString(args) {
        if (this.compiledVertShaderString !== null) {
          return this.compiledVertShaderString;
        }
        //TODO: webgl2 compile like frag shader
        return this.compiledVertShaderString = vertShaderString;
      }
  
      /**
     * @memberOf WebGLKernel#
     * @function
     * @name toString
     *
     * @desc Returns the *pre-compiled* Kernel as a JS Object String, that can be reused.
     *
     */
  
    }, {
      key: 'toString',
      value: function toString() {
        return kernelString(this);
      }
    }, {
      key: 'addFunction',
      value: function addFunction(fn) {
        this.functionBuilder.addFunction(null, fn);
      }
    }]);
  
    return WebGLKernel;
  }(KernelBase);
  },{"../../core/texture":84,"../../core/utils":86,"../kernel-base":62,"./kernel-string":67,"./shader-frag":70,"./shader-vert":71}],69:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var RunnerBase = require('../runner-base');
  var WebGLKernel = require('./kernel');
  var utils = require('../../core/utils');
  var WebGLFunctionBuilder = require('./function-builder');
  
  module.exports = function (_RunnerBase) {
    _inherits(WebGLRunner, _RunnerBase);
  
    /**
    * @constructor WebGLRunner
    *
      * @extends RunnerBase
       * @desc Instantiates a Runner instance for the kernel.
    * 
    * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
    *
    */
    function WebGLRunner(settings) {
      _classCallCheck(this, WebGLRunner);
  
      var _this = _possibleConstructorReturn(this, (WebGLRunner.__proto__ || Object.getPrototypeOf(WebGLRunner)).call(this, new WebGLFunctionBuilder(), settings));
  
      _this.Kernel = WebGLKernel;
      _this.kernel = null;
      return _this;
    }
  
    /**
    * @memberOf WebGLRunner#
    * @function
    * @name getMode
    *
    * @desc Return the current mode in which gpu.js is executing.
    * 
    * @returns {String} The current mode; "cpu".
    *
    */
  
  
    _createClass(WebGLRunner, [{
      key: 'getMode',
      value: function getMode() {
        return 'gpu';
      }
    }]);
  
    return WebGLRunner;
  }(RunnerBase);
  },{"../../core/utils":86,"../runner-base":64,"./function-builder":65,"./kernel":68}],70:[function(require,module,exports){
  "use strict";
  
  module.exports = "__HEADER__;\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\nconst float LOOP_MAX = __LOOP_MAX__;\n#define EPSILON 0.0000001;\n\n__CONSTANTS__;\n\nvarying highp vec2 vTexCoord;\n\nvec4 round(vec4 x) {\n  return floor(x + 0.5);\n}\n\nhighp float round(highp float x) {\n  return floor(x + 0.5);\n}\n\nvec2 integerMod(vec2 x, float y) {\n  vec2 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nvec3 integerMod(vec3 x, float y) {\n  vec3 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nvec4 integerMod(vec4 x, vec4 y) {\n  vec4 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nhighp float integerMod(highp float x, highp float y) {\n  highp float res = floor(mod(x, y));\n  return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);\n}\n\nhighp int integerMod(highp int x, highp int y) {\n  return int(integerMod(float(x), float(y)));\n}\n\n// Here be dragons!\n// DO NOT OPTIMIZE THIS CODE\n// YOU WILL BREAK SOMETHING ON SOMEBODY'S MACHINE\n// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME\nconst vec2 MAGIC_VEC = vec2(1.0, -256.0);\nconst vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);\nconst vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536\nhighp float decode32(highp vec4 rgba) {\n  __DECODE32_ENDIANNESS__;\n  rgba *= 255.0;\n  vec2 gte128;\n  gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;\n  gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;\n  float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);\n  float res = exp2(round(exponent));\n  rgba.b = rgba.b - 128.0 * gte128.x;\n  res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;\n  res *= gte128.y * -2.0 + 1.0;\n  return res;\n}\n\nhighp vec4 encode32(highp float f) {\n  highp float F = abs(f);\n  highp float sign = f < 0.0 ? 1.0 : 0.0;\n  highp float exponent = floor(log2(F));\n  highp float mantissa = (exp2(-exponent) * F);\n  // exponent += floor(log2(mantissa));\n  vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;\n  rgba.rg = integerMod(rgba.rg, 256.0);\n  rgba.b = integerMod(rgba.b, 128.0);\n  rgba.a = exponent*0.5 + 63.5;\n  rgba.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;\n  rgba = floor(rgba);\n  rgba *= 0.003921569; // 1/255\n  __ENCODE32_ENDIANNESS__;\n  return rgba;\n}\n// Dragons end here\n\nhighp float index;\nhighp vec3 threadId;\n\nhighp vec3 indexTo3D(highp float idx, highp vec3 texDim) {\n  highp float z = floor(idx / (texDim.x * texDim.y));\n  idx -= z * texDim.x * texDim.y;\n  highp float y = floor(idx / texDim.x);\n  highp float x = integerMod(idx, texDim.x);\n  return vec3(x, y, z);\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float z, highp float y, highp float x) {\n  highp vec3 xyz = vec3(x, y, z);\n  xyz = floor(xyz + 0.5);\n  __GET_WRAPAROUND__;\n  highp float index = round(xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z));\n  __GET_TEXTURE_CHANNEL__;\n  highp float w = round(texSize.x);\n  vec2 st = vec2(integerMod(index, w), float(int(index) / int(w))) + 0.5;\n  __GET_TEXTURE_INDEX__;\n  highp vec4 texel = texture2D(tex, st / texSize);\n  __GET_RESULT__;\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float y, highp float x) {\n  return get(tex, texSize, texDim, 0.0, y, x);\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float x) {\n  return get(tex, texSize, texDim, 0.0, 0.0, x);\n}\n\nhighp vec4 actualColor;\nvoid color(float r, float g, float b, float a) {\n  actualColor = vec4(r,g,b,a);\n}\n\nvoid color(float r, float g, float b) {\n  color(r,g,b,1.0);\n}\n\n__MAIN_PARAMS__;\n__MAIN_CONSTANTS__;\n__KERNEL__;\n\nvoid main(void) {\n  index = floor(vTexCoord.s * float(uTexSize.x)) + floor(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;\n  __MAIN_RESULT__;\n}";
  },{}],71:[function(require,module,exports){
  "use strict";
  
  module.exports = "precision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\nattribute highp vec2 aPos;\nattribute highp vec2 aTexCoord;\n\nvarying highp vec2 vTexCoord;\nuniform vec2 ratio;\n\nvoid main(void) {\n  gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);\n  vTexCoord = aTexCoord;\n}";
  },{}],72:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var WebGLKernel = require('./kernel');
  var utils = require('../../core/utils');
  
  /**
   * @class WebGLValidatorKernel
   *
   * @desc Helper class for WebGLKernel to validate texture size and dimensions.
   *
   */
  module.exports = function (_WebGLKernel) {
    _inherits(WebGLValidatorKernel, _WebGLKernel);
  
    function WebGLValidatorKernel() {
      _classCallCheck(this, WebGLValidatorKernel);
  
      return _possibleConstructorReturn(this, (WebGLValidatorKernel.__proto__ || Object.getPrototypeOf(WebGLValidatorKernel)).apply(this, arguments));
    }
  
    _createClass(WebGLValidatorKernel, [{
      key: 'validateOptions',
  
  
      /** 
     * @memberOf WebGLValidatorKernel#
     * @function
     * @name validateOptions
     *
     */
      value: function validateOptions() {
        this.texSize = utils.dimToTexSize({
          floatTextures: this.floatTextures,
          floatOutput: this.floatOutput
        }, this.output, true);
      }
    }]);
  
    return WebGLValidatorKernel;
  }(WebGLKernel);
  },{"../../core/utils":86,"./kernel":68}],73:[function(require,module,exports){
  'use strict';
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var FunctionBuilderBase = require('../function-builder-base');
  var WebGLFunctionNode = require('./function-node');
  
  /**
   * @class WebGLFunctionBuilder
   *
   * @extends FunctionBuilderBase
   *
   * @desc Builds webGl functions (shaders) from JavaScript function Strings
   *
   */
  module.exports = function (_FunctionBuilderBase) {
    _inherits(WebGL2FunctionBuilder, _FunctionBuilderBase);
  
    function WebGL2FunctionBuilder() {
      _classCallCheck(this, WebGL2FunctionBuilder);
  
      var _this = _possibleConstructorReturn(this, (WebGL2FunctionBuilder.__proto__ || Object.getPrototypeOf(WebGL2FunctionBuilder)).call(this));
  
      _this.Node = WebGLFunctionNode;
      return _this;
    }
  
    return WebGL2FunctionBuilder;
  }(FunctionBuilderBase);
  },{"../function-builder-base":60,"./function-node":74}],74:[function(require,module,exports){
  arguments[4][66][0].apply(exports,arguments)
  },{"../../core/utils":86,"../function-node-base":61,"dup":66}],75:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var WebGLKernel = require('../web-gl/kernel');
  var utils = require('../../core/utils');
  var Texture = require('../../core/texture');
  var fragShaderString = require('./shader-frag');
  var vertShaderString = require('./shader-vert');
  
  module.exports = function (_WebGLKernel) {
    _inherits(WebGL2Kernel, _WebGLKernel);
  
    function WebGL2Kernel() {
      _classCallCheck(this, WebGL2Kernel);
  
      return _possibleConstructorReturn(this, (WebGL2Kernel.__proto__ || Object.getPrototypeOf(WebGL2Kernel)).apply(this, arguments));
    }
  
    _createClass(WebGL2Kernel, [{
      key: 'initWebGl',
      value: function initWebGl() {
        return utils.initWebGl2(this.getCanvas());
      }
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name validateOptions
     *
     * @desc Validate options related to Kernel, such as
     * floatOutputs and Textures, texSize, output,
     * graphical output.
     *
     */
  
    }, {
      key: 'validateOptions',
      value: function validateOptions() {
        var isFloatReadPixel = utils.isFloatReadPixelsSupportedWebGL2();
        if (this.floatOutput === true && this.floatOutputForce !== true && !isFloatReadPixel) {
          throw new Error('Float texture outputs are not supported on this browser');
        } else if (this.floatTextures === undefined) {
          this.floatTextures = true;
          this.floatOutput = isFloatReadPixel;
        }
  
        if (!this.output || this.output.length === 0) {
          if (arguments.length !== 1) {
            throw new Error('Auto output only supported for kernels with only one input');
          }
  
          var argType = utils.getArgumentType(arguments[0]);
          if (argType === 'Array') {
            this.output = utils.getDimensions(argType);
          } else if (argType === 'Texture') {
            this.output = arguments[0].output;
          } else {
            throw new Error('Auto output not supported for input type: ' + argType);
          }
        }
  
        this.texSize = utils.dimToTexSize({
          floatTextures: this.floatTextures,
          floatOutput: this.floatOutput
        }, this.output, true);
  
        if (this.graphical) {
          if (this.output.length !== 2) {
            throw new Error('Output must have 2 dimensions on graphical mode');
          }
  
          if (this.floatOutput) {
            this.floatOutput = false;
            console.warn('Cannot use graphical mode and float output at the same time');
          }
  
          this.texSize = utils.clone(this.output);
        } else if (this.floatOutput === undefined) {
          this.floatOutput = true;
        }
  
        if (this.floatOutput || this.floatOutputForce) {
          this._webGl.getExtension('EXT_color_buffer_float');
        }
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name run
     *
     * @desc Run the kernel program, and send the output to renderOutput
     *
     * <p> This method calls a helper method *renderOutput* to return the result. </p>
     *
     * @returns {Object|Undefined} Result The final output of the program, as float, and as Textures for reuse.
     *
     *
     */
  
    }, {
      key: 'run',
      value: function run() {
        if (this.program === null) {
          this.build.apply(this, arguments);
        }
        var paramNames = this.paramNames;
        var paramTypes = this.paramTypes;
        var texSize = this.texSize;
        var gl = this._webGl;
  
        gl.useProgram(this.program);
        gl.scissor(0, 0, texSize[0], texSize[1]);
  
        if (!this.hardcodeConstants) {
          this.setUniform3fv('uOutputDim', this.threadDim);
          this.setUniform2fv('uTexSize', texSize);
        }
  
        this.setUniform2f('ratio', texSize[0] / this.maxTexSize[0], texSize[1] / this.maxTexSize[1]);
  
        this.argumentsLength = 0;
        for (var texIndex = 0; texIndex < paramNames.length; texIndex++) {
          this._addArgument(arguments[texIndex], paramTypes[texIndex], paramNames[texIndex]);
        }
  
        if (this.graphical) {
          gl.bindRenderbuffer(gl.RENDERBUFFER, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          return;
        }
  
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        if (this.outputImmutable) {
          this._setupOutputTexture();
        }
        var outputTexture = this.outputTexture;
  
        if (this.subKernelOutputVariableNames !== null) {
          if (this.outputImmutable) {
            this.subKernelOutputTextures = [];
            this._setupSubOutputTextures(this.subKernelOutputVariableNames.length);
          }
          gl.drawBuffers(this.drawBuffersMap);
        }
  
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
        if (this.subKernelOutputTextures !== null) {
          if (this.subKernels !== null) {
            var output = [];
            output.result = this.renderOutput(outputTexture);
            for (var i = 0; i < this.subKernels.length; i++) {
              output.push(new Texture(this.subKernelOutputTextures[i], texSize, this.threadDim, this.output, this._webGl));
            }
            return output;
          } else if (this.subKernelProperties !== null) {
            var _output = {
              result: this.renderOutput(outputTexture)
            };
            var _i = 0;
            for (var p in this.subKernelProperties) {
              if (!this.subKernelProperties.hasOwnProperty(p)) continue;
              _output[p] = new Texture(this.subKernelOutputTextures[_i], texSize, this.threadDim, this.output, this._webGl);
              _i++;
            }
            return _output;
          }
        }
  
        return this.renderOutput(outputTexture);
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name getOutputTexture
     *
     * @desc This return defined outputTexture, which is setup in .build(), or if immutable, is defined in .run()
     *
     * @returns {Object} Output Texture Cache
     *
     */
  
    }, {
      key: 'getOutputTexture',
      value: function getOutputTexture() {
        return this.outputTexture;
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _setupOutputTexture
     * @private
     *
     * @desc Setup and replace output texture
     */
  
    }, {
      key: '_setupOutputTexture',
      value: function _setupOutputTexture() {
        var gl = this._webGl;
        var texSize = this.texSize;
        var texture = this.outputTexture = this._webGl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this.paramNames.length);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        if (this.floatOutput) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @param length
     * @private
     *
     * @desc Setup and replace sub-output textures
     */
  
    }, {
      key: '_setupSubOutputTextures',
      value: function _setupSubOutputTextures(length) {
        var gl = this._webGl;
        var texSize = this.texSize;
        var drawBuffersMap = this.drawBuffersMap = [gl.COLOR_ATTACHMENT0];
        var textures = this.subKernelOutputTextures = [];
        for (var i = 0; i < length; i++) {
          var texture = this._webGl.createTexture();
          textures.push(texture);
          drawBuffersMap.push(gl.COLOR_ATTACHMENT0 + i + 1);
          gl.activeTexture(gl.TEXTURE0 + this.paramNames.length + i);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          if (this.floatOutput) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
          } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
          }
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, texture, 0);
        }
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _addArgument
     *
     * @desc Adds kernel parameters to the Argument Texture,
     * binding it to the webGl instance, etc.
     *
     * @param {Array|Texture|Number} value - The actual argument supplied to the kernel
     * @param {String} type - Type of the argument
     * @param {String} name - Name of the argument
     *
     */
  
    }, {
      key: '_addArgument',
      value: function _addArgument(value, type, name) {
        var gl = this._webGl;
        var argumentTexture = this.getArgumentTexture(name);
        if (value instanceof Texture) {
          type = 'Texture';
        }
        switch (type) {
          case 'Array':
            {
              var dim = utils.getDimensions(value, true);
              var size = utils.dimToTexSize({
                floatTextures: this.floatTextures,
                floatOutput: this.floatOutput
              }, dim);
              gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
              gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
              var length = size[0] * size[1];
              if (this.floatTextures) {
                length *= 4;
              }
  
              var valuesFlat = new Float32Array(length);
              utils.flattenTo(value, valuesFlat);
  
              var buffer = void 0;
              if (this.floatTextures) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, size[0], size[1], 0, gl.RGBA, gl.FLOAT, valuesFlat);
              } else {
                buffer = new Uint8Array(valuesFlat.buffer);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
              }
  
              if (!this.hardcodeConstants) {
                this.setUniform3fv('user_' + name + 'Dim', dim);
                this.setUniform2fv('user_' + name + 'Size', size);
              }
              this.setUniform1i('user_' + name, this.argumentsLength);
              break;
            }
          case 'Number':
            {
              this.setUniform1f('user_' + name, value);
              break;
            }
          case 'Input':
            {
              var input = value;
              var _dim = input.size;
              var _size = utils.dimToTexSize({
                floatTextures: this.floatTextures,
                floatOutput: this.floatOutput
              }, _dim);
              gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
              gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
              var _length = _size[0] * _size[1];
              var inputArray = void 0;
              if (this.floatTextures) {
                _length *= 4;
                inputArray = new Float32Array(_length);
                inputArray.set(input.value);
              } else {
                inputArray = input.value;
              }
  
              if (this.floatTextures) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, _size[0], _size[1], 0, gl.RGBA, gl.FLOAT, inputArray);
              } else {
                var _buffer = new Uint8Array(inputArray.buffer);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _size[0], _size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, _buffer);
              }
  
              if (!this.hardcodeConstants) {
                this.setUniform3fv('user_' + name + 'Dim', _dim);
                this.setUniform2fv('user_' + name + 'Size', _size);
              }
              this.setUniform1i('user_' + name, this.argumentsLength);
              break;
            }
          case 'Texture':
            {
              var inputTexture = value;
              var _dim2 = inputTexture.dimensions;
              var _size2 = inputTexture.size;
  
              gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
              gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);
  
              this.setUniform3fv('user_' + name + 'Dim', _dim2);
              this.setUniform2fv('user_' + name + 'Size', _size2);
              this.setUniform1i('user_' + name, this.argumentsLength);
              break;
            }
          default:
            throw new Error('Input type not supported (WebGL): ' + value);
        }
        this.argumentsLength++;
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _getHeaderString
     *
     * @desc Get the header string for the program.
     * This returns an empty string if no sub-kernels are defined.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getHeaderString',
      value: function _getHeaderString() {
        return '';
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _getTextureCoordinate
     *
     * @desc Get texture coordinate string for the program
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getTextureCoordinate',
      value: function _getTextureCoordinate() {
        var names = this.subKernelOutputVariableNames;
        if (names === null || names.length < 1) {
          return 'in highp vec2 vTexCoord;\n';
        } else {
          return 'out highp vec2 vTexCoord;\n';
        }
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _getKernelString
     *
     * @desc Get Kernel program string (in *glsl*) for a kernel.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getKernelString',
      value: function _getKernelString() {
        var result = [];
        var names = this.subKernelOutputVariableNames;
        if (names !== null) {
          result.push('highp float kernelResult = 0.0');
          result.push('layout(location = 0) out highp vec4 data0');
          for (var i = 0; i < names.length; i++) {
            result.push('highp float ' + names[i] + ' = 0.0', 'layout(location = ' + (i + 1) + ') out highp vec4 data' + (i + 1));
          }
        } else {
          result.push('out highp vec4 data0');
          result.push('highp float kernelResult = 0.0');
        }
  
        return this._linesToString(result) + this.functionBuilder.getPrototypeString('kernel');
      }
  
      /**
     *
     * @memberOf WebGL2Kernel#
     * @function
     * @name _getMainResultString
     *
     * @desc Get main result string with checks for floatOutput, graphical, subKernelsOutputs, etc.
     *
     * @returns {String} result
     *
     */
  
    }, {
      key: '_getMainResultString',
      value: function _getMainResultString() {
        var names = this.subKernelOutputVariableNames;
        var result = [];
  
        if (this.floatOutput) {
          result.push('  index *= 4.0');
        }
  
        if (this.graphical) {
          result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  data0 = actualColor');
        } else if (this.floatOutput) {
          var channels = ['r', 'g', 'b', 'a'];
  
          for (var i = 0; i < channels.length; ++i) {
            result.push('  threadId = indexTo3D(index, uOutputDim)');
            result.push('  kernel()');
  
            if (names) {
              result.push('  data0.' + channels[i] + ' = kernelResult');
  
              for (var j = 0; j < names.length; ++j) {
                result.push('  data' + (j + 1) + '.' + channels[i] + ' = ' + names[j]);
              }
            } else {
              result.push('  data0.' + channels[i] + ' = kernelResult');
            }
  
            if (i < channels.length - 1) {
              result.push('  index += 1.0');
            }
          }
        } else if (names !== null) {
          result.push('  threadId = indexTo3D(index, uOutputDim)');
          result.push('  kernel()');
          result.push('  data0 = encode32(kernelResult)');
          for (var _i2 = 0; _i2 < names.length; _i2++) {
            result.push('  data' + (_i2 + 1) + ' = encode32(' + names[_i2] + ')');
          }
        } else {
          result.push('  threadId = indexTo3D(index, uOutputDim)', '  kernel()', '  data0 = encode32(kernelResult)');
        }
  
        return this._linesToString(result);
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _addKernels
     *
     * @desc Adds all the sub-kernels supplied with this Kernel instance.
     *
     */
  
    }, {
      key: '_addKernels',
      value: function _addKernels() {
        var _this2 = this;
  
        var builder = this.functionBuilder;
        var gl = this._webGl;
  
        builder.addFunctions(this.functions, {
          constants: this.constants,
          output: this.output
        });
        builder.addNativeFunctions(this.nativeFunctions);
  
        builder.addKernel(this.fnString, {
          prototypeOnly: false,
          constants: this.constants,
          output: this.output,
          debug: this.debug,
          loopMaxIterations: this.loopMaxIterations
        }, this.paramNames, this.paramTypes);
  
        if (this.subKernels !== null) {
          this.subKernelOutputTextures = [];
          this.subKernelOutputVariableNames = [];
          this.subKernels.forEach(function (subKernel) {
            return _this2._addSubKernel(subKernel);
          });
        } else if (this.subKernelProperties !== null) {
          this.subKernelOutputTextures = [];
          this.subKernelOutputVariableNames = [];
          Object.keys(this.subKernelProperties).forEach(function (property) {
            return _this2._addSubKernel(_this2.subKernelProperties[property]);
          });
        }
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _getFragShaderString
     *
     * @desc Get the fragment shader String.
     * If the String hasn't been compiled yet,
     * then this method compiles it as well
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     * @returns {String} Fragment Shader string
     *
     */
  
    }, {
      key: '_getFragShaderString',
      value: function _getFragShaderString(args) {
        if (this.compiledFragShaderString !== null) {
          return this.compiledFragShaderString;
        }
        return this.compiledFragShaderString = this._replaceArtifacts(fragShaderString, this._getFragShaderArtifactMap(args));
      }
  
      /**
     * @memberOf WebGL2Kernel#
     * @function
     * @name _getVertShaderString
     *
     * @desc Get the vertical shader String
     *
     * @param {Array} args - The actual parameters sent to the Kernel
     *
     * @returns {String} Vertical Shader string
     *
     */
  
    }, {
      key: '_getVertShaderString',
      value: function _getVertShaderString(args) {
        if (this.compiledVertShaderString !== null) {
          return this.compiledVertShaderString;
        }
        return this.compiledVertShaderString = vertShaderString;
      }
    }]);
  
    return WebGL2Kernel;
  }(WebGLKernel);
  },{"../../core/texture":84,"../../core/utils":86,"../web-gl/kernel":68,"./shader-frag":77,"./shader-vert":78}],76:[function(require,module,exports){
  'use strict';
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var WebGLRunner = require('../web-gl/runner');
  var WebGL2FunctionBuilder = require('./function-builder');
  var WebGL2Kernel = require('./kernel');
  
  module.exports = function (_WebGLRunner) {
    _inherits(WebGL2Runner, _WebGLRunner);
  
    /**
    * @constructor WebGLRunner
    *
    * @extends RunnerBase
      * @desc Instantiates a Runner instance for the kernel.
    *
    * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
    *
    */
    function WebGL2Runner(settings) {
      _classCallCheck(this, WebGL2Runner);
  
      var _this = _possibleConstructorReturn(this, (WebGL2Runner.__proto__ || Object.getPrototypeOf(WebGL2Runner)).call(this, new WebGL2FunctionBuilder(), settings));
  
      _this.Kernel = WebGL2Kernel;
      _this.kernel = null;
      return _this;
    }
  
    return WebGL2Runner;
  }(WebGLRunner);
  },{"../web-gl/runner":69,"./function-builder":73,"./kernel":75}],77:[function(require,module,exports){
  "use strict";
  
  module.exports = "#version 300 es\n__HEADER__;\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\nconst float LOOP_MAX = __LOOP_MAX__;\n#define EPSILON 0.0000001;\n\n__CONSTANTS__;\n\nin highp vec2 vTexCoord;\n\nvec2 integerMod(vec2 x, float y) {\n  vec2 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nvec3 integerMod(vec3 x, float y) {\n  vec3 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nvec4 integerMod(vec4 x, vec4 y) {\n  vec4 res = floor(mod(x, y));\n  return res * step(1.0 - floor(y), -res);\n}\n\nhighp float integerMod(highp float x, highp float y) {\n  highp float res = floor(mod(x, y));\n  return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);\n}\n\nhighp int integerMod(highp int x, highp int y) {\n  return int(integerMod(float(x), float(y)));\n}\n\n// Here be dragons!\n// DO NOT OPTIMIZE THIS CODE\n// YOU WILL BREAK SOMETHING ON SOMEBODY'S MACHINE\n// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME\nconst vec2 MAGIC_VEC = vec2(1.0, -256.0);\nconst vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);\nconst vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536\nhighp float decode32(highp vec4 rgba) {\n  __DECODE32_ENDIANNESS__;\n  rgba *= 255.0;\n  vec2 gte128;\n  gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;\n  gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;\n  float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);\n  float res = exp2(round(exponent));\n  rgba.b = rgba.b - 128.0 * gte128.x;\n  res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;\n  res *= gte128.y * -2.0 + 1.0;\n  return res;\n}\n\nhighp vec4 encode32(highp float f) {\n  highp float F = abs(f);\n  highp float sign = f < 0.0 ? 1.0 : 0.0;\n  highp float exponent = floor(log2(F));\n  highp float mantissa = (exp2(-exponent) * F);\n  // exponent += floor(log2(mantissa));\n  vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;\n  rgba.rg = integerMod(rgba.rg, 256.0);\n  rgba.b = integerMod(rgba.b, 128.0);\n  rgba.a = exponent*0.5 + 63.5;\n  rgba.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;\n  rgba = floor(rgba);\n  rgba *= 0.003921569; // 1/255\n  __ENCODE32_ENDIANNESS__;\n  return rgba;\n}\n// Dragons end here\n\nhighp float index;\nhighp vec3 threadId;\n\nhighp vec3 indexTo3D(highp float idx, highp vec3 texDim) {\n  highp float z = floor(idx / (texDim.x * texDim.y));\n  idx -= z * texDim.x * texDim.y;\n  highp float y = floor(idx / texDim.x);\n  highp float x = integerMod(idx, texDim.x);\n  return vec3(x, y, z);\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float z, highp float y, highp float x) {\n  highp vec3 xyz = vec3(x, y, z);\n  xyz = floor(xyz + 0.5);\n  __GET_WRAPAROUND__;\n  highp float index = round(xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z));\n  __GET_TEXTURE_CHANNEL__;\n  highp float w = round(texSize.x);\n  vec2 st = vec2(integerMod(index, w), float(int(index) / int(w))) + 0.5;\n  __GET_TEXTURE_INDEX__;\n  highp vec4 texel = texture(tex, st / texSize);\n  __GET_RESULT__;\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float y, highp float x) {\n  return get(tex, texSize, texDim, 0.0, y, x);\n}\n\nhighp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float x) {\n  return get(tex, texSize, texDim, 0.0, 0.0, x);\n}\n\nhighp vec4 actualColor;\nvoid color(float r, float g, float b, float a) {\n  actualColor = vec4(r,g,b,a);\n}\n\nvoid color(float r, float g, float b) {\n  color(r,g,b,1.0);\n}\n\n__MAIN_PARAMS__;\n__MAIN_CONSTANTS__;\n__KERNEL__;\n\nvoid main(void) {\n  index = floor(vTexCoord.s * float(uTexSize.x)) + floor(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;\n  __MAIN_RESULT__;\n}";
  },{}],78:[function(require,module,exports){
  "use strict";
  
  module.exports = "#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\n\nin highp vec2 aPos;\nin highp vec2 aTexCoord;\n\nout highp vec2 vTexCoord;\nuniform vec2 ratio;\n\nvoid main(void) {\n  gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);\n  vTexCoord = aTexCoord;\n}";
  },{}],79:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var WebGLKernel = require('./kernel');
  var utils = require('../../core/utils');
  
  /**
   * @class WebGLValidatorKernel
   *
   * @desc Helper class for WebGLKernel to validate texture size and dimensions.
   *
   */
  module.exports = function (_WebGLKernel) {
    _inherits(WebGL2ValidatorKernel, _WebGLKernel);
  
    function WebGL2ValidatorKernel() {
      _classCallCheck(this, WebGL2ValidatorKernel);
  
      return _possibleConstructorReturn(this, (WebGL2ValidatorKernel.__proto__ || Object.getPrototypeOf(WebGL2ValidatorKernel)).apply(this, arguments));
    }
  
    _createClass(WebGL2ValidatorKernel, [{
      key: 'validateOptions',
  
  
      /** 
     * @memberOf WebGLValidatorKernel#
     * @function
     * @name validateOptions
     *
     */
      value: function validateOptions() {
        this._webGl.getExtension('EXT_color_buffer_float');
        this.texSize = utils.dimToTexSize({
          floatTextures: this.floatTextures,
          floatOutput: this.floatOutput
        }, this.output, true);
      }
    }]);
  
    return WebGL2ValidatorKernel;
  }(WebGLKernel);
  },{"../../core/utils":86,"./kernel":75}],80:[function(require,module,exports){
  'use strict';
  
  var utils = require('./utils');
  module.exports = function alias(name, fn) {
    var fnString = fn.toString();
    return new Function('return function ' + name + ' (' + utils.getParamNamesFromString(fnString).join(', ') + ') {' + utils.getFunctionBodyFromString(fnString) + '}')();
  };
  },{"./utils":86}],81:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var UtilsCore = require("./utils-core");
  
  /**
   * This is a minimalistic version of GPU.js used 
   * to run precompiled GPU.JS code.
   *
   * This intentionally excludes the JS AST compiller : which is 400kb alone/
   *
   * @class GPUCore
   */
  module.exports = function () {
    function GPUCore() {
      _classCallCheck(this, GPUCore);
    }
  
    _createClass(GPUCore, null, [{
      key: "validateKernelObj",
  
  
      /**
     * @name validateKernelObj
     * @function
     * @static
     * @memberOf GPUCore
     *
     * @description Validates the KernelObj to comply with the defined format
     * Note that this does only a limited sanity check, and does not  
     * guarantee a full working validation.
     *
     * For the kernel object format see : <kernelObj-format>
     *
     * @param {Object|String} kernelObj - KernelObj used to validate
     *
     * @returns {Object} The validated kernel object, converted from JSON if needed
     *
     */
      value: function validateKernelObj(kernelObj) {
  
        // NULL validation
        if (kernelObj === null) {
          throw "KernelObj being validated is NULL";
        }
  
        // String JSON conversion
        if (typeof kernelObj === "string") {
          try {
            kernelObj = JSON.parse(kernelObj);
          } catch (e) {
            console.error(e);
            throw "Failed to convert KernelObj from JSON string";
          }
  
          // NULL validation
          if (kernelObj === null) {
            throw "Invalid (NULL) KernelObj JSON string representation";
          }
        }
  
        // Check for kernel obj flag
        if (kernelObj.isKernelObj !== true) {
          throw "Failed missing isKernelObj flag check";
        }
  
        // Return the validated kernelObj
        return kernelObj;
      }
  
      /**
     * @name loadKernelObj
     * @function
     * @static
     * @memberOf GPUCore
     *
     * @description Loads the precompiled kernel object. For GPUCore this is the ONLY way to create the kernel.
     * To generate the kernelObj use <Kernel.exportKernelObj>
     *
     * Note that this function calls <validateKernelObj> internally, and throws an exception if it fails.
     *
     * @see GPUCore.validateKernelObj
     * @see	Kernel.exportKernelObj
     *
     * @param {Object} kernelObj - The precompiled kernel object
     * @param {Object} inOpt - [Optional] the option overrides to use
     *
     * @returns {Function} The kernel function
     * 
     */
  
    }, {
      key: "loadKernelObj",
      value: function loadKernelObj(kernelObj, inOpt) {
  
        // Validates the kernelObj, throws an exception if it fails
        kernelObj = validateKernelObj(kernelObj);
      }
    }]);
  
    return GPUCore;
  }();
  },{"./utils-core":85}],82:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var utils = require('./utils');
  var WebGLRunner = require('../backend/web-gl/runner');
  var WebGL2Runner = require('../backend/web-gl2/runner');
  var CPURunner = require('../backend/cpu/runner');
  var WebGLValidatorKernel = require('../backend/web-gl/validator-kernel');
  var WebGL2ValidatorKernel = require('../backend/web-gl2/validator-kernel');
  var GPUCore = require("./gpu-core");
  
  /**
   * Initialises the GPU.js library class which manages the webGlContext for the created functions.
   * @class
   * @extends GPUCore
   */
  
  var GPU = function (_GPUCore) {
    _inherits(GPU, _GPUCore);
  
    /**
    * Creates an instance of GPU.
    * @param {any} settings - Settings to set mode, andother properties. See #GPUCore
    * @memberOf GPU#
    */
    function GPU(settings) {
      _classCallCheck(this, GPU);
  
      var _this = _possibleConstructorReturn(this, (GPU.__proto__ || Object.getPrototypeOf(GPU)).call(this, settings));
  
      settings = settings || {};
      _this._canvas = settings.canvas || null;
      _this._webGl = settings.webGl || null;
      var mode = settings.mode;
      var detectedMode = void 0;
      if (!utils.isWebGlSupported()) {
        if (mode && mode !== 'cpu') {
          throw new Error('A requested mode of "' + mode + '" and is not supported');
        } else {
          console.warn('Warning: gpu not supported, falling back to cpu support');
          detectedMode = 'cpu';
        }
      } else {
        detectedMode = mode || 'gpu';
      }
  
      _this.kernels = [];
  
      var runnerSettings = {
        canvas: _this._canvas,
        webGl: _this._webGl
      };
  
      switch (detectedMode) {
        // public options
        case 'cpu':
          _this._runner = new CPURunner(runnerSettings);
          break;
        case 'gpu':
          var Runner = _this.getGPURunner();
          _this._runner = new Runner(runnerSettings);
          break;
  
        // private explicit options for testing
        case 'webgl2':
          _this._runner = new WebGL2Runner(runnerSettings);
          break;
        case 'webgl':
          _this._runner = new WebGLRunner(runnerSettings);
          break;
  
        // private explicit options for internal
        case 'webgl2-validator':
          _this._runner = new WebGL2Runner(runnerSettings);
          _this._runner.Kernel = WebGL2ValidatorKernel;
          break;
        case 'webgl-validator':
          _this._runner = new WebGLRunner(runnerSettings);
          _this._runner.Kernel = WebGLValidatorKernel;
          break;
        default:
          throw new Error('"' + mode + '" mode is not defined');
      }
      return _this;
    }
    /**
    *
    * This creates a callable function object to call the kernel function with the argument parameter set
    *
    * @name createKernel
    * @function
    * @memberOf GPU##
    *
    * @param {Function} fn - The calling to perform the conversion
    * @param {Object} settings - The parameter configuration object
    * @property {String} settings.dimensions - Thread dimension array (Defeaults to [1024])
    * @property {String} settings.mode - CPU / GPU configuration mode (Defaults to null)
    *
    * The following modes are supported
    * *'falsey'* : Attempts to build GPU mode, else fallbacks
    * *'gpu'* : Attempts to build GPU mode, else fallbacks
    * *'cpu'* : Forces JS fallback mode only
    *
    *
    * @returns {Function} callable function to run
    *
    */
  
  
    _createClass(GPU, [{
      key: 'createKernel',
      value: function createKernel(fn, settings) {
        //
        // basic parameters safety checks
        //
        if (typeof fn === 'undefined') {
          throw 'Missing fn parameter';
        }
        if (!utils.isFunction(fn) && typeof fn !== 'string') {
          throw 'fn parameter not a function';
        }
  
        var kernel = this._runner.buildKernel(fn, settings || {});
  
        //if canvas didn't come from this, propagate from kernel
        if (!this._canvas) {
          this._canvas = kernel.getCanvas();
        }
        if (!this._runner.canvas) {
          this._runner.canvas = kernel.getCanvas();
        }
  
        this.kernels.push(kernel);
  
        return kernel;
      }
  
      /**
     *
     * Create a super kernel which executes sub kernels
     * and saves their output to be used with the next sub kernel.
     * This can be useful if we want to save the output on one kernel,
     * and then use it as an input to another kernel. *Machine Learning*
     *
     * @name createKernelMap
     * @function
     * @memberOf GPU#
     *
     * @param {Object|Array} subKernels - Sub kernels for this kernel
     * @param {Function} rootKernel - Root kernel
     *
     * @returns {Function} callable kernel function
     *
     * @example
     * const megaKernel = gpu.createKernelMap({
     *   addResult: function add(a, b) {
     *     return a[this.thread.x] + b[this.thread.x];
     *   },
     *   multiplyResult: function multiply(a, b) {
     *     return a[this.thread.x] * b[this.thread.x];
     *   },
     *  }, function(a, b, c) {
     *       return multiply(add(a, b), c);
     * });
     *
     * megaKernel(a, b, c);
     *
     * Note: You can also define subKernels as an array of functions.
     * > [add, multiply]
     *
     */
  
    }, {
      key: 'createKernelMap',
      value: function createKernelMap() {
        var fn = void 0;
        var settings = void 0;
        if (typeof arguments[arguments.length - 2] === 'function') {
          fn = arguments[arguments.length - 2];
          settings = arguments[arguments.length - 1];
        } else {
          fn = arguments[arguments.length - 1];
        }
  
        if (!utils.isWebGlDrawBuffersSupported()) {
          this._runner = new CPURunner(settings);
        }
  
        var kernel = this.createKernel(fn, settings);
        if (Array.isArray(arguments[0])) {
          var functions = arguments[0];
          for (var i = 0; i < functions.length; i++) {
            kernel.addSubKernel(functions[i]);
          }
        } else {
          var _functions = arguments[0];
          for (var p in _functions) {
            if (!_functions.hasOwnProperty(p)) continue;
            kernel.addSubKernelProperty(p, _functions[p]);
          }
        }
  
        return kernel;
      }
  
      /**
     *
     * Combine different kernels into one super Kernel,
     * useful to perform multiple operations inside one
     * kernel without the penalty of data transfer between
     * cpu and gpu.
     *
     * The number of kernel functions sent to this method can be variable.
     * You can send in one, two, etc.
     *
     * @name combineKernels
     * @function
     * @memberOf GPU#
     *
     * @param {Function} subKernels - Kernel function(s) to combine.
     * @param {Function} rootKernel - Root kernel to combine kernels into
     *
     * @example
     * 	combineKernels(add, multiply, function(a,b,c){
     *	 	return add(multiply(a,b), c)
     *	})
     *
     * @returns {Function} Callable kernel function
     *
     */
  
    }, {
      key: 'combineKernels',
      value: function combineKernels() {
        var lastKernel = arguments[arguments.length - 2];
        var combinedKernel = arguments[arguments.length - 1];
        if (this.getMode() === 'cpu') return combinedKernel;
  
        var canvas = arguments[0].getCanvas();
        var webGl = arguments[0].getWebGl();
  
        for (var i = 0; i < arguments.length - 1; i++) {
          arguments[i].setCanvas(canvas).setWebGl(webGl).setOutputToTexture(true);
        }
  
        return function () {
          combinedKernel.apply(null, arguments);
          var texSize = lastKernel.texSize;
          var gl = lastKernel.getWebGl();
          var threadDim = lastKernel.threadDim;
          var result = void 0;
          if (lastKernel.floatOutput) {
            result = new Float32Array(texSize[0] * texSize[1] * 4);
            gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.FLOAT, result);
          } else {
            var bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
            gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
            result = new Float32Array(bytes.buffer);
          }
  
          result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);
  
          if (lastKernel.output.length === 1) {
            return result;
          } else if (lastKernel.output.length === 2) {
            return utils.splitArray(result, lastKernel.output[0]);
          } else if (lastKernel.output.length === 3) {
            var cube = utils.splitArray(result, lastKernel.output[0] * lastKernel.output[1]);
            return cube.map(function (x) {
              return utils.splitArray(x, lastKernel.output[0]);
            });
          }
        };
      }
    }, {
      key: 'getGPURunner',
      value: function getGPURunner() {
        if (typeof WebGL2RenderingContext !== 'undefined') return WebGL2Runner;
        if (typeof WebGLRenderingContext !== 'undefined') return WebGLRunner;
      }
  
      /**
     *
     * Adds additional functions, that the kernel may call.
     *
     * @name addFunction
     * @function
     * @memberOf GPU#
     *
     * @param {Function|String} fn - JS Function to do conversion
     * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
     * @param {String} returnType - The return type, assumes 'float' if null
     *
     * @returns {GPU} returns itself
     *
     */
  
    }, {
      key: 'addFunction',
      value: function addFunction(fn, paramTypes, returnType) {
        this._runner.functionBuilder.addFunction(null, fn, paramTypes, returnType);
        return this;
      }
  
      /**
     *
     * Adds additional native functions, that the kernel may call.
     *
     * @name addNativeFunction
     * @function
     * @memberOf GPU#
     *
     * @param {String} name - native function name, used for reverse lookup
     * @param {String} nativeFunction - the native function implementation, as it would be defined in it's entirety
     *
     * @returns {GPU} returns itself
     *
     */
  
    }, {
      key: 'addNativeFunction',
      value: function addNativeFunction(name, nativeFunction) {
        this._runner.functionBuilder.addNativeFunction(name, nativeFunction);
        return this;
      }
  
      /**
     *
     * Return the current mode in which gpu.js is executing.
     * @name getMode
     * @function
     * @memberOf GPU#
     *
     * @returns {String} The current mode, "cpu", "webgl", etc.
     *
     */
  
    }, {
      key: 'getMode',
      value: function getMode() {
        return this._runner.getMode();
      }
  
      /**
     *
     * Return TRUE, if browser supports WebGl AND Canvas
     *
     * @name get isWebGlSupported
     * @function
     * @memberOf GPU#
     *
     * Note: This function can also be called directly `GPU.isWebGlSupported()`
     *
     * @returns {Boolean} TRUE if browser supports webGl
     *
     */
  
    }, {
      key: 'isWebGlSupported',
      value: function isWebGlSupported() {
        return utils.isWebGlSupported();
      }
  
      /**
     *
     * Return the canvas object bound to this gpu instance.
     *
     * @name getCanvas
     * @function
     * @memberOf GPU#
     *
     * @returns {Object} Canvas object if present
     *
     */
  
    }, {
      key: 'getCanvas',
      value: function getCanvas() {
        return this._canvas;
      }
  
      /**
     *
     * Return the webGl object bound to this gpu instance.
     *
     * @name getWebGl
     * @function
     * @memberOf GPU#
     *
     * @returns {Object} WebGl object if present
     *
     */
  
    }, {
      key: 'getWebGl',
      value: function getWebGl() {
        return this._webGl;
      }
    }]);
  
    return GPU;
  }(GPUCore);
  
  ;
  
  // This ensure static methods are "inherited"
  // See: https://stackoverflow.com/questions/5441508/how-to-inherit-static-methods-from-base-class-in-javascript
  Object.assign(GPU, GPUCore);
  
  module.exports = GPU;
  },{"../backend/cpu/runner":59,"../backend/web-gl/runner":69,"../backend/web-gl/validator-kernel":72,"../backend/web-gl2/runner":76,"../backend/web-gl2/validator-kernel":79,"./gpu-core":81,"./utils":86}],83:[function(require,module,exports){
  "use strict";
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  module.exports = function Input(value, size) {
    _classCallCheck(this, Input);
  
    this.value = value;
    if (Array.isArray(size)) {
      this.size = [];
      for (var i = 0; i < size.length; i++) {
        this.size[i] = size[i];
      }
      while (this.size.length < 3) {
        this.size.push(1);
      }
    } else {
      if (size.z) {
        this.size = [size.x, size.y, size.z];
      } else if (size.y) {
        this.size = [size.x, size.y, 1];
      } else {
        this.size = [size.x, 1, 1];
      }
    }
  };
  },{}],84:[function(require,module,exports){
  'use strict';
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var gpu = null;
  
  module.exports = function () {
  
    /**
    * @desc WebGl Texture implementation in JS
    * @constructor Texture
    * @param {Object} texture
    * @param {Array} size
    * @param dimensions
    * @param {Array} output
    * @param {Object} webGl
    */
    function Texture(texture, size, dimensions, output, webGl) {
      _classCallCheck(this, Texture);
  
      this.texture = texture;
      this.size = size;
      this.dimensions = dimensions;
      this.output = output;
      this.webGl = webGl;
      this.kernel = null;
    }
  
    /**
    * @name toArray
    * @function
    * @memberOf Texture#
    *
    * @desc Converts the Texture into a JavaScript Array.
    * 
    * @param {Object} The `gpu` Object
    *
    */
  
  
    _createClass(Texture, [{
      key: 'toArray',
      value: function toArray(gpu) {
        if (!gpu) throw new Error('You need to pass the GPU object for toArray to work.');
        if (this.kernel) return this.kernel(this);
  
        this.kernel = gpu.createKernel(function (x) {
          return x[this.thread.z][this.thread.y][this.thread.x];
        }).setOutput(this.output);
  
        return this.kernel(this);
      }
  
      /**
     * @name delete
     * @desc Deletes the Texture.
     * @function
     * @memberOf Texture#
     *
     *
     */
  
    }, {
      key: 'delete',
      value: function _delete() {
        return this.webGl.deleteTexture(this.texture);
      }
    }]);
  
    return Texture;
  }();
  },{}],85:[function(require,module,exports){
  'use strict';
  
  /**
   *
   * @desc Reduced subset of Utils, used exclusively in gpu-core.js
   * Various utility functions / snippets of code that GPU.JS uses internally.\
   * This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
   *
   * Note that all methods in this class is 'static' by nature `UtilsCore.functionName()`
   *
   * @class UtilsCore
   *
   */
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var UtilsCore = function () {
    function UtilsCore() {
      _classCallCheck(this, UtilsCore);
    }
  
    _createClass(UtilsCore, null, [{
      key: 'isCanvas',
  
  
      /**
     * @typedef {Object} webGlContext
     */
  
      /**
     * @typedef {Object} CanvasDOMObject
     */
  
      //-----------------------------------------------------------------------------
      //
      //  Canvas validation and support
      //
      //-----------------------------------------------------------------------------
  
      /**
     * @name isCanvas
     * @static
     * @function
     * @memberOf UtilsCore
     *
     *
     * @desc Return TRUE, on a valid DOM canvas object
     *
     * Note: This does just a VERY simply sanity check. And may give false positives.
     *
     * @param {CanvasDOMObject} canvasObj - Object to validate
     *
     * @returns {Boolean} TRUE if the object is a DOM canvas
     *
     */
      value: function isCanvas(canvasObj) {
        return canvasObj !== null && canvasObj.nodeName && canvasObj.getContext && canvasObj.nodeName.toUpperCase() === 'CANVAS';
      }
  
      /**
     * @name isCanvasSupported
     * @function
     * @static
     * @memberOf UtilsCore
     *
     * @desc Return TRUE, if browser supports canvas
     *
     * @returns {Boolean} TRUE if browser supports canvas
     *
     */
  
    }, {
      key: 'isCanvasSupported',
      value: function isCanvasSupported() {
        return _isCanvasSupported;
      }
  
      /**
     * @name initCanvas
     * @function
     * @static
     * @memberOf UtilsCore
     *
     * @desc Initiate and returns a canvas, for usage in init_webgl.
     * Returns only if canvas is supported by browser.
     *
     * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
     *
     */
  
    }, {
      key: 'initCanvas',
      value: function initCanvas() {
        // Fail fast if browser previously detected no support
        if (!_isCanvasSupported) {
          return null;
        }
  
        // Create a new canvas DOM
        var canvas = document.createElement('canvas');
  
        // Default width and height, to fix webgl issue in safari
        canvas.width = 2;
        canvas.height = 2;
  
        // Returns the canvas
        return canvas;
      }
  
      //-----------------------------------------------------------------------------
      //
      //  Webgl validation and support
      //
      //-----------------------------------------------------------------------------
  
  
      /**
     *
     * @name isWebGl
     * @function
     * @static
     * @memberOf UtilsCore
     *
     * @desc Return TRUE, on a valid webGlContext object
     *
     * Note: This does just a VERY simply sanity check. And may give false positives.
     *
     * @param {webGlContext} webGlObj - Object to validate
     *
     * @returns {Boolean} TRUE if the object is a webGlContext object
     *
     */
  
    }, {
      key: 'isWebGl',
      value: function isWebGl(webGlObj) {
        return webGlObj && typeof webGlObj.getExtension === 'function';
      }
  
      /**
     * @name isWebGlSupported
     * @function
     * @static
     * @memberOf UtilsCore
     *
     * @desc Return TRUE, if browser supports webgl
     *
     * @returns {Boolean} TRUE if browser supports webgl
     *
     */
  
    }, {
      key: 'isWebGlSupported',
      value: function isWebGlSupported() {
        return _isWebGlSupported;
      }
    }, {
      key: 'isWebGlDrawBuffersSupported',
      value: function isWebGlDrawBuffersSupported() {
        return _isWebGlDrawBuffersSupported;
      }
  
      // Default webgl options to use
  
    }, {
      key: 'initWebGlDefaultOptions',
      value: function initWebGlDefaultOptions() {
        return {
          alpha: false,
          depth: false,
          antialias: false
        };
      }
  
      /**
     * @name initWebGl
     * @function
     * @static
     * @memberOf UtilsCore
     *
     * @desc Initiate and returns a webGl, from a canvas object
     * Returns only if webGl is supported by browser.
     *
     * @param {CanvasDOMObject} canvasObj - Object to validate
     *
     * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
     *
     */
  
    }, {
      key: 'initWebGl',
      value: function initWebGl(canvasObj) {
  
        // First time setup, does the browser support check memorizer
        if (typeof _isCanvasSupported !== 'undefined' || canvasObj === null) {
          if (!_isCanvasSupported) {
            return null;
          }
        }
  
        // Fail fast for invalid canvas object
        if (!UtilsCore.isCanvas(canvasObj)) {
          throw new Error('Invalid canvas object - ' + canvasObj);
        }
  
        // Create a new canvas DOM
        var webGl = canvasObj.getContext('experimental-webgl', UtilsCore.initWebGlDefaultOptions()) || canvasObj.getContext('webgl', UtilsCore.initWebGlDefaultOptions());
  
        if (webGl) {
          // Get the extension that is needed
          webGl.OES_texture_float = webGl.getExtension('OES_texture_float');
          webGl.OES_texture_float_linear = webGl.getExtension('OES_texture_float_linear');
          webGl.OES_element_index_uint = webGl.getExtension('OES_element_index_uint');
        }
  
        // Returns the canvas
        return webGl;
      }
  
      /**
     * @name initWebGl2
     * @function
     * @static
     * @memberOf UtilsCore
     *
     * @desc Initiate and returns a webGl, from a canvas object
     * Returns only if webGl is supported by browser.
     *
     * @param {CanvasDOMObject} canvasObj - Object to validate
     *
     * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
     *
     */
  
    }, {
      key: 'initWebGl2',
      value: function initWebGl2(canvasObj) {
  
        // First time setup, does the browser support check memorizer
        if (typeof _isCanvasSupported !== 'undefined' || canvasObj === null) {
          if (!_isCanvasSupported) {
            return null;
          }
        }
  
        // Fail fast for invalid canvas object
        if (!UtilsCore.isCanvas(canvasObj)) {
          throw new Error('Invalid canvas object - ' + canvasObj);
        }
  
        // Create a new canvas DOM
        return canvasObj.getContext('webgl2', UtilsCore.initWebGlDefaultOptions());
      }
    }]);
  
    return UtilsCore;
  }();
  
  //-----------------------------------------------------------------------------
  //
  //  Canvas & Webgl validation and support constants
  //
  //-----------------------------------------------------------------------------
  
  var _isCanvasSupported = typeof document !== 'undefined' ? UtilsCore.isCanvas(document.createElement('canvas')) : false;
  var _testingWebGl = UtilsCore.initWebGl(UtilsCore.initCanvas());
  var _isWebGlSupported = UtilsCore.isWebGl(_testingWebGl);
  var _isWebGlDrawBuffersSupported = _isWebGlSupported && Boolean(_testingWebGl.getExtension('WEBGL_draw_buffers'));
  
  if (_isWebGlSupported) {
    UtilsCore.OES_texture_float = _testingWebGl.OES_texture_float;
    UtilsCore.OES_texture_float_linear = _testingWebGl.OES_texture_float_linear;
    UtilsCore.OES_element_index_uint = _testingWebGl.OES_element_index_uint;
  } else {
    UtilsCore.OES_texture_float = false;
    UtilsCore.OES_texture_float_linear = false;
    UtilsCore.OES_element_index_uint = false;
  }
  
  module.exports = UtilsCore;
  },{}],86:[function(require,module,exports){
  'use strict';
  
  /**
   * 
   * @classdesc Various utility functions / snippets of code that GPU.JS uses internally.\
   * This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
   *
   * Note that all methods in this class are *static* by nature `Utils.functionName()`
   * 
   * @class Utils
   * @extends UtilsCore
   *
   */
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var UtilsCore = require("./utils-core");
  var Input = require('./input');
  var Texture = require('./texture');
  // FUNCTION_NAME regex
  var FUNCTION_NAME = /function ([^(]*)/;
  
  // STRIP COMMENTS regex
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  
  // ARGUMENT NAMES regex
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  
  var _systemEndianness = function () {
    var b = new ArrayBuffer(4);
    var a = new Uint32Array(b);
    var c = new Uint8Array(b);
    a[0] = 0xdeadbeef;
    if (c[0] === 0xef) return 'LE';
    if (c[0] === 0xde) return 'BE';
    throw new Error('unknown endianness');
  }();
  
  var _isFloatReadPixelsSupported = null;
  var _isFloatReadPixelsSupportedWebGL2 = null;
  
  var _isMixedIdentifiersSupported = function () {
    try {
      new Function('let i = 1; const j = 1;')();
      return true;
    } catch (e) {
      return false;
    }
  }();
  
  var Utils = function (_UtilsCore) {
    _inherits(Utils, _UtilsCore);
  
    function Utils() {
      _classCallCheck(this, Utils);
  
      return _possibleConstructorReturn(this, (Utils.__proto__ || Object.getPrototypeOf(Utils)).apply(this, arguments));
    }
  
    _createClass(Utils, null, [{
      key: 'systemEndianness',
  
  
      //-----------------------------------------------------------------------------
      //
      //  System values support (currently only endianness)
      //
      //-----------------------------------------------------------------------------
  
      /**
     * @memberOf Utils
     * @name systemEndianness
     * @function
     * @static
     *
     * Gets the system endianness, and cache it
     *
     * @returns {String} 'LE' or 'BE' depending on system architecture
     *
     * Credit: https://gist.github.com/TooTallNate/4750953
     */
      value: function systemEndianness() {
        return _systemEndianness;
      }
  
      //-----------------------------------------------------------------------------
      //
      //  Function and function string validations
      //
      //-----------------------------------------------------------------------------
  
      /**
     * @memberOf Utils
     * @name isFunction
     * @function
     * @static
     *
     * Return TRUE, on a JS function
     *
     * @param {Function} funcObj - Object to validate if its a function
     *
     * @returns	{Boolean} TRUE if the object is a JS function
     *
     */
  
    }, {
      key: 'isFunction',
      value: function isFunction(funcObj) {
        return typeof funcObj === 'function';
      }
  
      /**
     * @memberOf Utils
     * @name isFunctionString
     * @function
     * @static
     *
     * Return TRUE, on a valid JS function string
     *
     * Note: This does just a VERY simply sanity check. And may give false positives.
     *
     * @param {String} funcStr - String of JS function to validate
     *
     * @returns {Boolean} TRUE if the string passes basic validation
     *
     */
  
    }, {
      key: 'isFunctionString',
      value: function isFunctionString(funcStr) {
        if (funcStr !== null) {
          return funcStr.toString().slice(0, 'function'.length).toLowerCase() === 'function';
        }
        return false;
      }
  
      /**
     * @memberOf Utils
     * @name getFunctionName_fromString
     * @function
     * @static
     *
     * Return the function name from a JS function string
     *
     * @param {String} funcStr - String of JS function to validate
     *
     * @returns {String} Function name string (if found)
     *
     */
  
    }, {
      key: 'getFunctionNameFromString',
      value: function getFunctionNameFromString(funcStr) {
        return FUNCTION_NAME.exec(funcStr)[1];
      }
    }, {
      key: 'getFunctionBodyFromString',
      value: function getFunctionBodyFromString(funcStr) {
        return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
      }
  
      /**
     * @memberOf Utils
     * @name getParamNames_fromString
     * @function
     * @static
     *
     * Return list of parameter names extracted from the JS function string
     *
     * @param {String} funcStr - String of JS function to validate
     *
     * @returns {String[]}  Array representing all the parameter names
     *
     */
  
    }, {
      key: 'getParamNamesFromString',
      value: function getParamNamesFromString(func) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null) result = [];
        return result;
      }
  
      //-----------------------------------------------------------------------------
      //
      //  Object / function cloning and manipulation
      //
      //-----------------------------------------------------------------------------
  
      /**
     * @memberOf Utils
     * @name clone
     * @function
     * @static
     *
     * Returns a clone
     *
     * @param {Object} obj - Object to clone
     *
     * @returns {Object}  Cloned object
     *
     */
  
    }, {
      key: 'clone',
      value: function clone(obj) {
        if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj.hasOwnProperty('isActiveClone')) return obj;
  
        var temp = obj.constructor(); // changed
  
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj.isActiveClone = null;
            temp[key] = Utils.clone(obj[key]);
            delete obj.isActiveClone;
          }
        }
  
        return temp;
      }
  
      /**
     * @memberOf Utils
     * @name newPromise
     * @function
     * @static
     *
     * Returns a `new Promise` object based on the underlying implmentation
     *
     * @param {Function} executor - Promise builder function
     *
     * @returns {Promise}  Promise object
     *
     */
  
    }, {
      key: 'newPromise',
      value: function newPromise(executor) {
        var simple = Promise || small_promise;
        if (simple === null) {
          throw TypeError('Browser is missing Promise implementation. Consider adding small_promise.js polyfill');
        }
        return new simple(executor);
      }
  
      /**
     * @memberOf Utils
     * @name functionBinder
     * @function
     * @static
     *
     * Limited implementation of Function.bind, with fallback
     *
     * @param {Function} inFunc - to setup bind on
     * @param {Object} thisObj - The this parameter to assume inside the binded function
     *
     * @returns {Function}  The binded function
     *
     */
  
    }, {
      key: 'functionBinder',
      value: function functionBinder(inFunc, thisObj) {
        if (inFunc.bind) {
          return inFunc.bind(thisObj);
        }
  
        return function () {
          var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          return inFunc.apply(thisObj, args);
        };
      }
  
      /**
     * @memberOf Utils
     * @name isArray
     * @function
     * @static
     *
     * * Checks if is an array or Array-like object
     *
     * @param {Object} arg - The argument object to check if is array
     *
     * @returns {Boolean}  true if is array or Array-like object
     *
     */
  
    }, {
      key: 'isArray',
      value: function isArray(array) {
        if (isNaN(array.length)) {
          return false;
        }
  
        return true;
      }
  
      /**
     * @memberOf Utils
     * @name getArgumentType
     * @function
     * @static
     *
     * Evaluate the argument type, to apply respective logic for it
     *
     * @param {Object} arg - The argument object to evaluate type
     *
     * @returns {String}  Argument type Array/Number/Texture/Unknown
     *
     */
  
    }, {
      key: 'getArgumentType',
      value: function getArgumentType(arg) {
        if (Utils.isArray(arg)) {
          return 'Array';
        } else if (typeof arg === 'number') {
          return 'Number';
        } else if (arg instanceof Texture) {
          return 'Texture';
        } else if (arg instanceof Input) {
          return 'Input';
        } else {
          return 'Unknown';
        }
      }
      /**
     * @typedef {Object} gpuJSObject
     */
  
      /**
     * @memberOf Utils
     * @name isFloatReadPixelsSupported
     * @function
     * @static
     *
     * Checks if the browser supports readPixels with float type
     *
     * @returns {Boolean} true if browser supports
     *
     */
  
    }, {
      key: 'isFloatReadPixelsSupported',
      value: function isFloatReadPixelsSupported() {
        if (_isFloatReadPixelsSupported !== null) {
          return _isFloatReadPixelsSupported;
        }
  
        var GPU = require('../index');
        var x = new GPU({
          mode: 'webgl-validator'
        }).createKernel(function () {
          return 1;
        }, {
          output: [2],
          floatTextures: true,
          floatOutput: true,
          floatOutputForce: true
        })();
  
        _isFloatReadPixelsSupported = x[0] === 1;
  
        return _isFloatReadPixelsSupported;
      }
  
      /**
     * @memberOf Utils
     * @name isFloatReadPixelsSupportedWebGL2
     * @function
     * @static
     *
     * Checks if the browser supports readPixels with float type
     *
     * @returns {Boolean} true if browser supports
     *
     */
  
    }, {
      key: 'isFloatReadPixelsSupportedWebGL2',
      value: function isFloatReadPixelsSupportedWebGL2() {
        if (_isFloatReadPixelsSupportedWebGL2 !== null) {
          return _isFloatReadPixelsSupportedWebGL2;
        }
  
        var GPU = require('../index');
        var x = new GPU({
          mode: 'webgl2-validator'
        }).createKernel(function () {
          return 1;
        }, {
          output: [2],
          floatTextures: true,
          floatOutput: true,
          floatOutputForce: true
        })();
  
        _isFloatReadPixelsSupportedWebGL2 = x[0] === 1;
  
        return _isFloatReadPixelsSupportedWebGL2;
      }
    }, {
      key: 'isMixedIdentifiersSupported',
      value: function isMixedIdentifiersSupported() {
        return _isMixedIdentifiersSupported;
      }
    }, {
      key: 'dimToTexSize',
      value: function dimToTexSize(opt, dimensions, output) {
        var numTexels = dimensions[0];
        for (var i = 1; i < dimensions.length; i++) {
          numTexels *= dimensions[i];
        }
  
        if (opt.floatTextures && (!output || opt.floatOutput)) {
          numTexels = Math.ceil(numTexels / 4);
        }
  
        var w = Math.ceil(Math.sqrt(numTexels));
        return [w, w];
      }
  
      /**
     * @memberOf Utils
     * @name getDimensions
     * @function
     * @static
     *
     * Return the dimension of an array.
     * 
     * @param {Array|String} x - The array
     * @param {number} [pad] - To include padding in the dimension calculation [Optional]
     *
     *
     *
     */
  
    }, {
      key: 'getDimensions',
      value: function getDimensions(x, pad) {
        var ret = void 0;
        if (Utils.isArray(x)) {
          var dim = [];
          var temp = x;
          while (Utils.isArray(temp)) {
            dim.push(temp.length);
            temp = temp[0];
          }
          ret = dim.reverse();
        } else if (x instanceof Texture) {
          ret = x.output;
        } else if (x instanceof Input) {
          ret = x.size;
        } else {
          throw 'Unknown dimensions of ' + x;
        }
  
        if (pad) {
          ret = Utils.clone(ret);
          while (ret.length < 3) {
            ret.push(1);
          }
        }
  
        return ret;
      }
  
      /**
     * @memberOf Utils
     * @name pad
     * @function
     * @static
     *
     * Pad an array AND its elements with leading and ending zeros
     *
     * @param {Array} arr - the array to pad zeros to
     * @param {number} padding - amount of padding
     *
     * @returns {Array} Array with leading and ending zeros, and all the elements padded by zeros.
     *
     */
  
    }, {
      key: 'pad',
      value: function pad(arr, padding) {
        function zeros(n) {
          return Array.apply(null, new Array(n)).map(Number.prototype.valueOf, 0);
        }
  
        var len = arr.length + padding * 2;
  
        var ret = arr.map(function (x) {
          return [].concat(zeros(padding), x, zeros(padding));
        });
  
        for (var i = 0; i < padding; i++) {
          ret = [].concat([zeros(len)], ret, [zeros(len)]);
        }
  
        return ret;
      }
  
      /**
     * @memberOf Utils
     * @name flatten2dArrayTo
     * @function
     * @static
     *
     * Puts a nested 2d array into a one-dimensional target array
     * @param {Array|*} array
     * @param {Float32Array|Float64Array} target
     */
  
    }, {
      key: 'flatten2dArrayTo',
      value: function flatten2dArrayTo(array, target) {
        var offset = 0;
        for (var y = 0; y < array.length; y++) {
          target.set(array[y], offset);
          offset += array[y].length;
        }
      }
  
      /**
     * @memberOf Utils
     * @name flatten3dArrayTo
     * @function
     * @static
     *
     * Puts a nested 3d array into a one-dimensional target array
     * @param {Array|*} array
     * @param {Float32Array|Float64Array} target
     */
  
    }, {
      key: 'flatten3dArrayTo',
      value: function flatten3dArrayTo(array, target) {
        var offset = 0;
        for (var z = 0; z < array.length; z++) {
          for (var y = 0; y < array[z].length; y++) {
            target.set(array[z][y], offset);
            offset += array[z][y].length;
          }
        }
      }
  
      /**
     * @memberOf Utils
     * @name flatten3dArrayTo
     * @function
     * @static
     *
     * Puts a nested 1d, 2d, or 3d array into a one-dimensional target array
     * @param {Array|*} array
     * @param {Float32Array|Float64Array} target
     */
  
    }, {
      key: 'flattenTo',
      value: function flattenTo(array, target) {
        if (Utils.isArray(array[0])) {
          if (Utils.isArray(array[0][0])) {
            Utils.flatten3dArrayTo(array, target);
          } else {
            Utils.flatten2dArrayTo(array, target);
          }
        } else {
          target.set(array);
        }
      }
  
      /**
     * @memberOf Utils
     * @name splitArray
     * @function
     * @static
     *
     * Splits an array into smaller arrays.
     * Number of elements in one small chunk is given by `part`
     *
     * @param {Array} array - The array to split into chunks
     * @param {Array} part - elements in one chunk
     *
       * @returns {Array} An array of smaller chunks
     *
     */
  
    }, {
      key: 'splitArray',
      value: function splitArray(array, part) {
        var result = [];
        for (var i = 0; i < array.length; i += part) {
          result.push(Array.prototype.slice.call(array, i, i + part));
        }
        return result;
      }
    }, {
      key: 'getAstString',
      value: function getAstString(source, ast) {
        var lines = Array.isArray(source) ? source : source.split(/\r?\n/g);
        var start = ast.loc.start;
        var end = ast.loc.end;
        var result = [];
        result.push(lines[start.line - 1].slice(start.column));
        for (var i = start.line; i < end.line - 1; i++) {
          result.push(lines[i]);
        }
        result.push(lines[end.line - 1].slice(0, end.column));
        return result.join('\n');
      }
    }, {
      key: 'allPropertiesOf',
      value: function allPropertiesOf(obj) {
        var props = [];
  
        do {
          props.push.apply(props, Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));
  
        return props;
      }
    }]);
  
    return Utils;
  }(UtilsCore);
  
  // This ensure static methods are "inherited"
  // See: https://stackoverflow.com/questions/5441508/how-to-inherit-static-methods-from-base-class-in-javascript
  
  
  Object.assign(Utils, UtilsCore);
  
  module.exports = Utils;
  },{"../index":87,"./input":83,"./texture":84,"./utils-core":85}],87:[function(require,module,exports){
  'use strict';
  
  var GPU = require('./core/gpu');
  var alias = require('./core/alias');
  var utils = require('./core/utils');
  var Input = require('./core/input');
  var Texture = require('./core/texture');
  
  var CPUFunctionBuilder = require('./backend/cpu/function-builder');
  var CPUFunctionNode = require('./backend/cpu/function-node');
  var CPUKernel = require('./backend/cpu/kernel');
  var CPURunner = require('./backend/cpu/runner');
  
  var WebGLFunctionBuilder = require('./backend/web-gl/function-builder');
  var WebGLFunctionNode = require('./backend/web-gl/function-node');
  var WebGLKernel = require('./backend/web-gl/kernel');
  var WebGLRunner = require('./backend/web-gl/runner');
  
  var WebGL2FunctionBuilder = require('./backend/web-gl2/function-builder');
  var WebGL2FunctionNode = require('./backend/web-gl2/function-node');
  var WebGL2Kernel = require('./backend/web-gl2/kernel');
  var WebGL2Runner = require('./backend/web-gl2/runner');
  
  GPU.alias = alias;
  GPU.utils = utils;
  GPU.Texture = Texture;
  GPU.Input = Input;
  GPU.input = function (value, size) {
    return new Input(value, size);
  };
  
  GPU.CPUFunctionBuilder = CPUFunctionBuilder;
  GPU.CPUFunctionNode = CPUFunctionNode;
  GPU.CPUKernel = CPUKernel;
  GPU.CPURunner = CPURunner;
  
  GPU.WebGLFunctionBuilder = WebGLFunctionBuilder;
  GPU.WebGLFunctionNode = WebGLFunctionNode;
  GPU.WebGLKernel = WebGLKernel;
  GPU.WebGLRunner = WebGLRunner;
  
  GPU.WebGL2FunctionBuilder = WebGL2FunctionBuilder;
  GPU.WebGL2FunctionNode = WebGL2FunctionNode;
  GPU.WebGL2Kernel = WebGL2Kernel;
  GPU.WebGL2Runner = WebGL2Runner;
  
  if (typeof module !== 'undefined') {
    module.exports = GPU;
  }
  if (typeof window !== 'undefined') {
    window.GPU = GPU;
  }
  },{"./backend/cpu/function-builder":55,"./backend/cpu/function-node":56,"./backend/cpu/kernel":58,"./backend/cpu/runner":59,"./backend/web-gl/function-builder":65,"./backend/web-gl/function-node":66,"./backend/web-gl/kernel":68,"./backend/web-gl/runner":69,"./backend/web-gl2/function-builder":73,"./backend/web-gl2/function-node":74,"./backend/web-gl2/kernel":75,"./backend/web-gl2/runner":76,"./core/alias":80,"./core/gpu":82,"./core/input":83,"./core/texture":84,"./core/utils":86}],88:[function(require,module,exports){
  exports.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m
    var eLen = nBytes * 8 - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var nBits = -7
    var i = isLE ? (nBytes - 1) : 0
    var d = isLE ? -1 : 1
    var s = buffer[offset + i]
  
    i += d
  
    e = s & ((1 << (-nBits)) - 1)
    s >>= (-nBits)
    nBits += eLen
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
  
    m = e & ((1 << (-nBits)) - 1)
    e >>= (-nBits)
    nBits += mLen
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
  
    if (e === 0) {
      e = 1 - eBias
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
      m = m + Math.pow(2, mLen)
      e = e - eBias
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
  }
  
  exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c
    var eLen = nBytes * 8 - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
    var i = isLE ? 0 : (nBytes - 1)
    var d = isLE ? 1 : -1
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
  
    value = Math.abs(value)
  
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0
      e = eMax
    } else {
      e = Math.floor(Math.log(value) / Math.LN2)
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--
        c *= 2
      }
      if (e + eBias >= 1) {
        value += rt / c
      } else {
        value += rt * Math.pow(2, 1 - eBias)
      }
      if (value * c >= 2) {
        e++
        c /= 2
      }
  
      if (e + eBias >= eMax) {
        m = 0
        e = eMax
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen)
        e = e + eBias
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
        e = 0
      }
    }
  
    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
  
    e = (e << mLen) | m
    eLen += mLen
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
  
    buffer[offset + i - d] |= s * 128
  }
  
  },{}],89:[function(require,module,exports){
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
  
  },{}],90:[function(require,module,exports){
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  
  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually
  module.exports = function (obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
  }
  
  function isBuffer (obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  }
  
  // For Node v0.10 support. Remove this eventually.
  function isSlowBuffer (obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
  }
  
  },{}],91:[function(require,module,exports){
  (function (process){
  'use strict';
  
  if (!process.version ||
      process.version.indexOf('v0.') === 0 ||
      process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
    module.exports = { nextTick: nextTick };
  } else {
    module.exports = process
  }
  
  function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== 'function') {
      throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch (len) {
    case 0:
    case 1:
      return process.nextTick(fn);
    case 2:
      return process.nextTick(function afterTickOne() {
        fn.call(null, arg1);
      });
    case 3:
      return process.nextTick(function afterTickTwo() {
        fn.call(null, arg1, arg2);
      });
    case 4:
      return process.nextTick(function afterTickThree() {
        fn.call(null, arg1, arg2, arg3);
      });
    default:
      args = new Array(len - 1);
      i = 0;
      while (i < args.length) {
        args[i++] = arguments[i];
      }
      return process.nextTick(function afterTick() {
        fn.apply(null, args);
      });
    }
  }
  
  
  }).call(this,require('_process'))
  },{"_process":92}],92:[function(require,module,exports){
  // shim for using process in browser
  var process = module.exports = {};
  
  // cached from whatever global is present so that test runners that stub it
  // don't break things.  But we need to wrap it in a try catch in case it is
  // wrapped in strict mode code which doesn't define any globals.  It's inside a
  // function because try/catches deoptimize in certain engines.
  
  var cachedSetTimeout;
  var cachedClearTimeout;
  
  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  (function () {
      try {
          if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
          } else {
              cachedSetTimeout = defaultSetTimout;
          }
      } catch (e) {
          cachedSetTimeout = defaultSetTimout;
      }
      try {
          if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
          } else {
              cachedClearTimeout = defaultClearTimeout;
          }
      } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
      }
  } ())
  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }
  
  
  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }
  
  
  
  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;
  
  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }
  
  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
  
      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  
  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  };
  
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};
  
  function noop() {}
  
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.prependListener = noop;
  process.prependOnceListener = noop;
  
  process.listeners = function (name) { return [] }
  
  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };
  
  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };
  
  },{}],93:[function(require,module,exports){
  module.exports = require('./lib/_stream_duplex.js');
  
  },{"./lib/_stream_duplex.js":94}],94:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // a duplex stream is just a stream that is both readable and writable.
  // Since JS doesn't have multiple prototypal inheritance, this class
  // prototypally inherits from Readable, and then parasitically from
  // Writable.
  
  'use strict';
  
  /*<replacement>*/
  
  var pna = require('process-nextick-args');
  /*</replacement>*/
  
  /*<replacement>*/
  var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
    }return keys;
  };
  /*</replacement>*/
  
  module.exports = Duplex;
  
  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/
  
  var Readable = require('./_stream_readable');
  var Writable = require('./_stream_writable');
  
  util.inherits(Duplex, Readable);
  
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
  
  function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options);
  
    Readable.call(this, options);
    Writable.call(this, options);
  
    if (options && options.readable === false) this.readable = false;
  
    if (options && options.writable === false) this.writable = false;
  
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
  
    this.once('end', onend);
  }
  
  // the no-half-open enforcer
  function onend() {
    // if we allow half-open state, or if the writable side ended,
    // then we're ok.
    if (this.allowHalfOpen || this._writableState.ended) return;
  
    // no more data can be written.
    // But allow more writes to happen in this tick.
    pna.nextTick(onEndNT, this);
  }
  
  function onEndNT(self) {
    self.end();
  }
  
  Object.defineProperty(Duplex.prototype, 'destroyed', {
    get: function () {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function (value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (this._readableState === undefined || this._writableState === undefined) {
        return;
      }
  
      // backward compatibility, the user is explicitly
      // managing destroyed
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  
  Duplex.prototype._destroy = function (err, cb) {
    this.push(null);
    this.end();
  
    pna.nextTick(cb, err);
  };
  
  function forEach(xs, f) {
    for (var i = 0, l = xs.length; i < l; i++) {
      f(xs[i], i);
    }
  }
  },{"./_stream_readable":96,"./_stream_writable":98,"core-util-is":53,"inherits":89,"process-nextick-args":91}],95:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // a passthrough stream.
  // basically just the most minimal sort of Transform stream.
  // Every written chunk gets output as-is.
  
  'use strict';
  
  module.exports = PassThrough;
  
  var Transform = require('./_stream_transform');
  
  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/
  
  util.inherits(PassThrough, Transform);
  
  function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options);
  
    Transform.call(this, options);
  }
  
  PassThrough.prototype._transform = function (chunk, encoding, cb) {
    cb(null, chunk);
  };
  },{"./_stream_transform":97,"core-util-is":53,"inherits":89}],96:[function(require,module,exports){
  (function (process,global){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  'use strict';
  
  /*<replacement>*/
  
  var pna = require('process-nextick-args');
  /*</replacement>*/
  
  module.exports = Readable;
  
  /*<replacement>*/
  var isArray = require('isarray');
  /*</replacement>*/
  
  /*<replacement>*/
  var Duplex;
  /*</replacement>*/
  
  Readable.ReadableState = ReadableState;
  
  /*<replacement>*/
  var EE = require('events').EventEmitter;
  
  var EElistenerCount = function (emitter, type) {
    return emitter.listeners(type).length;
  };
  /*</replacement>*/
  
  /*<replacement>*/
  var Stream = require('./internal/streams/stream');
  /*</replacement>*/
  
  /*<replacement>*/
  
  var Buffer = require('safe-buffer').Buffer;
  var OurUint8Array = global.Uint8Array || function () {};
  function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  
  /*</replacement>*/
  
  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/
  
  /*<replacement>*/
  var debugUtil = require('util');
  var debug = void 0;
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog('stream');
  } else {
    debug = function () {};
  }
  /*</replacement>*/
  
  var BufferList = require('./internal/streams/BufferList');
  var destroyImpl = require('./internal/streams/destroy');
  var StringDecoder;
  
  util.inherits(Readable, Stream);
  
  var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];
  
  function prependListener(emitter, event, fn) {
    // Sadly this is not cacheable as some libraries bundle their own
    // event emitter implementation with them.
    if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);
  
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
  
  function ReadableState(options, stream) {
    Duplex = Duplex || require('./_stream_duplex');
  
    options = options || {};
  
    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    var isDuplex = stream instanceof Duplex;
  
    // object stream flag. Used to make read(n) ignore n and to
    // make all the buffer merging and length checks go away
    this.objectMode = !!options.objectMode;
  
    if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
  
    // the point at which it stops calling _read() to fill the buffer
    // Note: 0 is a valid value, means "don't call _read preemptively ever"
    var hwm = options.highWaterMark;
    var readableHwm = options.readableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  
    if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;
  
    // cast to ints.
    this.highWaterMark = Math.floor(this.highWaterMark);
  
    // A linked list is used to store data chunks instead of an array because the
    // linked list can remove elements from the beginning faster than
    // array.shift()
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
  
    // a flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    this.sync = true;
  
    // whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
  
    // has it been destroyed
    this.destroyed = false;
  
    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = options.defaultEncoding || 'utf8';
  
    // the number of writers that are awaiting a drain event in .pipe()s
    this.awaitDrain = 0;
  
    // if true, a maybeReadMore has been scheduled
    this.readingMore = false;
  
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  
  function Readable(options) {
    Duplex = Duplex || require('./_stream_duplex');
  
    if (!(this instanceof Readable)) return new Readable(options);
  
    this._readableState = new ReadableState(options, this);
  
    // legacy
    this.readable = true;
  
    if (options) {
      if (typeof options.read === 'function') this._read = options.read;
  
      if (typeof options.destroy === 'function') this._destroy = options.destroy;
    }
  
    Stream.call(this);
  }
  
  Object.defineProperty(Readable.prototype, 'destroyed', {
    get: function () {
      if (this._readableState === undefined) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set: function (value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (!this._readableState) {
        return;
      }
  
      // backward compatibility, the user is explicitly
      // managing destroyed
      this._readableState.destroyed = value;
    }
  });
  
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function (err, cb) {
    this.push(null);
    cb(err);
  };
  
  // Manually shove something into the read() buffer.
  // This returns true if the highWaterMark has not been hit yet,
  // similar to how Writable.write() returns true if you should
  // write() some more.
  Readable.prototype.push = function (chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
  
    if (!state.objectMode) {
      if (typeof chunk === 'string') {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer.from(chunk, encoding);
          encoding = '';
        }
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
  
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  };
  
  // Unshift should *always* be something directly out of read()
  Readable.prototype.unshift = function (chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  
  function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
    var state = stream._readableState;
    if (chunk === null) {
      state.reading = false;
      onEofChunk(stream, state);
    } else {
      var er;
      if (!skipChunkCheck) er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit('error', er);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
  
        if (addToFront) {
          if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
        } else if (state.ended) {
          stream.emit('error', new Error('stream.push() after EOF'));
        } else {
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
          } else {
            addChunk(stream, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
      }
    }
  
    return needMoreData(state);
  }
  
  function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      stream.emit('data', chunk);
      stream.read(0);
    } else {
      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
  
      if (state.needReadable) emitReadable(stream);
    }
    maybeReadMore(stream, state);
  }
  
  function chunkInvalid(state, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
      er = new TypeError('Invalid non-string/buffer chunk');
    }
    return er;
  }
  
  // if it's past the high water mark, we can push in some more.
  // Also, if we have no data yet, we can stand some
  // more bytes.  This is to work around cases where hwm=0,
  // such as the repl.  Also, if the push() triggered a
  // readable event, and the user called read(largeNumber) such that
  // needReadable was set, then we ought to push more, so that another
  // 'readable' event will be triggered.
  function needMoreData(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
  }
  
  Readable.prototype.isPaused = function () {
    return this._readableState.flowing === false;
  };
  
  // backwards compatibility.
  Readable.prototype.setEncoding = function (enc) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
  };
  
  // Don't raise the hwm > 8MB
  var MAX_HWM = 0x800000;
  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      // Get the next highest power of 2 to prevent increasing hwm excessively in
      // tiny amounts
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  }
  
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended) return 0;
    if (state.objectMode) return 1;
    if (n !== n) {
      // Only flow one buffer at a time
      if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
    }
    // If we're asking for more than the current hwm, then raise the hwm.
    if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length) return n;
    // Don't have enough
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }
    return state.length;
  }
  
  // you can override either this method, or the async _read(n) below.
  Readable.prototype.read = function (n) {
    debug('read', n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
  
    if (n !== 0) state.emittedReadable = false;
  
    // if we're doing read(0) to trigger a readable event, but we
    // already have a bunch of data in the buffer, then just trigger
    // the 'readable' event and move on.
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
      debug('read: emitReadable', state.length, state.ended);
      if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
      return null;
    }
  
    n = howMuchToRead(n, state);
  
    // if we've ended, and we're now clear, then finish it up.
    if (n === 0 && state.ended) {
      if (state.length === 0) endReadable(this);
      return null;
    }
  
    // All the actual chunk generation logic needs to be
    // *below* the call to _read.  The reason is that in certain
    // synthetic stream cases, such as passthrough streams, _read
    // may be a completely synchronous operation which may change
    // the state of the read buffer, providing enough data when
    // before there was *not* enough.
    //
    // So, the steps are:
    // 1. Figure out what the state of things will be after we do
    // a read from the buffer.
    //
    // 2. If that resulting state will trigger a _read, then call _read.
    // Note that this may be asynchronous, or synchronous.  Yes, it is
    // deeply ugly to write APIs this way, but that still doesn't mean
    // that the Readable class should behave improperly, as streams are
    // designed to be sync/async agnostic.
    // Take note if the _read call is sync or async (ie, if the read call
    // has returned yet), so that we know whether or not it's safe to emit
    // 'readable' etc.
    //
    // 3. Actually pull the requested chunks out of the buffer and return.
  
    // if we need a readable event, then we need to do some reading.
    var doRead = state.needReadable;
    debug('need readable', doRead);
  
    // if we currently have less than the highWaterMark, then also read some
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug('length less than watermark', doRead);
    }
  
    // however, if we've ended, then there's no point, and if we're already
    // reading, then it's unnecessary.
    if (state.ended || state.reading) {
      doRead = false;
      debug('reading or ended', doRead);
    } else if (doRead) {
      debug('do read');
      state.reading = true;
      state.sync = true;
      // if the length is currently zero, then we *need* a readable event.
      if (state.length === 0) state.needReadable = true;
      // call internal read method
      this._read(state.highWaterMark);
      state.sync = false;
      // If _read pushed data synchronously, then `reading` will be false,
      // and we need to re-evaluate how much data we can return to the user.
      if (!state.reading) n = howMuchToRead(nOrig, state);
    }
  
    var ret;
    if (n > 0) ret = fromList(n, state);else ret = null;
  
    if (ret === null) {
      state.needReadable = true;
      n = 0;
    } else {
      state.length -= n;
    }
  
    if (state.length === 0) {
      // If we have nothing in the buffer, then we want to know
      // as soon as we *do* get something into the buffer.
      if (!state.ended) state.needReadable = true;
  
      // If we tried to read() past the EOF, then emit end on the next tick.
      if (nOrig !== n && state.ended) endReadable(this);
    }
  
    if (ret !== null) this.emit('data', ret);
  
    return ret;
  };
  
  function onEofChunk(stream, state) {
    if (state.ended) return;
    if (state.decoder) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
  
    // emit 'readable' now to make sure it gets picked up.
    emitReadable(stream);
  }
  
  // Don't emit readable right away in sync mode, because this can trigger
  // another read() call => stack overflow.  This way, it might trigger
  // a nextTick recursion warning, but that's not so bad.
  function emitReadable(stream) {
    var state = stream._readableState;
    state.needReadable = false;
    if (!state.emittedReadable) {
      debug('emitReadable', state.flowing);
      state.emittedReadable = true;
      if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
    }
  }
  
  function emitReadable_(stream) {
    debug('emit readable');
    stream.emit('readable');
    flow(stream);
  }
  
  // at this point, the user has presumably seen the 'readable' event,
  // and called read() to consume some data.  that may have triggered
  // in turn another _read(n) call, in which case reading = true if
  // it's in progress.
  // However, if we're not ended, or reading, and the length < hwm,
  // then go ahead and try to read some more preemptively.
  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      pna.nextTick(maybeReadMore_, stream, state);
    }
  }
  
  function maybeReadMore_(stream, state) {
    var len = state.length;
    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
      debug('maybeReadMore read 0');
      stream.read(0);
      if (len === state.length)
        // didn't get any data, stop spinning.
        break;else len = state.length;
    }
    state.readingMore = false;
  }
  
  // abstract method.  to be overridden in specific implementation classes.
  // call cb(er, data) where data is <= n in length.
  // for virtual (non-string, non-buffer) streams, "length" is somewhat
  // arbitrary, and perhaps not very meaningful.
  Readable.prototype._read = function (n) {
    this.emit('error', new Error('_read() is not implemented'));
  };
  
  Readable.prototype.pipe = function (dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
  
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [state.pipes, dest];
        break;
      default:
        state.pipes.push(dest);
        break;
    }
    state.pipesCount += 1;
    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);
  
    dest.on('unpipe', onunpipe);
    function onunpipe(readable, unpipeInfo) {
      debug('onunpipe');
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
  
    function onend() {
      debug('onend');
      dest.end();
    }
  
    // when the dest drains, it reduces the awaitDrain counter
    // on the source.  This would be more elegant with a .once()
    // handler in flow(), but adding and removing repeatedly is
    // too slow.
    var ondrain = pipeOnDrain(src);
    dest.on('drain', ondrain);
  
    var cleanedUp = false;
    function cleanup() {
      debug('cleanup');
      // cleanup event handlers once the pipe is broken
      dest.removeListener('close', onclose);
      dest.removeListener('finish', onfinish);
      dest.removeListener('drain', ondrain);
      dest.removeListener('error', onerror);
      dest.removeListener('unpipe', onunpipe);
      src.removeListener('end', onend);
      src.removeListener('end', unpipe);
      src.removeListener('data', ondata);
  
      cleanedUp = true;
  
      // if the reader is waiting for a drain event from this
      // specific writer, then it would cause it to never start
      // flowing again.
      // So, if this is awaiting a drain, then we just call it now.
      // If we don't know, then assume that we are waiting for one.
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
    }
  
    // If the user pushes more data while we're writing to dest then we'll end up
    // in ondata again. However, we only want to increase awaitDrain once because
    // dest will only emit one 'drain' event for the multiple writes.
    // => Introduce a guard on increasing awaitDrain.
    var increasedAwaitDrain = false;
    src.on('data', ondata);
    function ondata(chunk) {
      debug('ondata');
      increasedAwaitDrain = false;
      var ret = dest.write(chunk);
      if (false === ret && !increasedAwaitDrain) {
        // If the user unpiped during `dest.write()`, it is possible
        // to get stuck in a permanently paused state if that write
        // also returned false.
        // => Check whether `dest` is still a piping destination.
        if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
          debug('false write response, pause', src._readableState.awaitDrain);
          src._readableState.awaitDrain++;
          increasedAwaitDrain = true;
        }
        src.pause();
      }
    }
  
    // if the dest has an error, then stop piping into it.
    // however, don't suppress the throwing behavior for this.
    function onerror(er) {
      debug('onerror', er);
      unpipe();
      dest.removeListener('error', onerror);
      if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
    }
  
    // Make sure our error handler is attached before userland ones.
    prependListener(dest, 'error', onerror);
  
    // Both close and finish should trigger unpipe, but only once.
    function onclose() {
      dest.removeListener('finish', onfinish);
      unpipe();
    }
    dest.once('close', onclose);
    function onfinish() {
      debug('onfinish');
      dest.removeListener('close', onclose);
      unpipe();
    }
    dest.once('finish', onfinish);
  
    function unpipe() {
      debug('unpipe');
      src.unpipe(dest);
    }
  
    // tell the dest that it's being piped to
    dest.emit('pipe', src);
  
    // start the flow if it hasn't been started already.
    if (!state.flowing) {
      debug('pipe resume');
      src.resume();
    }
  
    return dest;
  };
  
  function pipeOnDrain(src) {
    return function () {
      var state = src._readableState;
      debug('pipeOnDrain', state.awaitDrain);
      if (state.awaitDrain) state.awaitDrain--;
      if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
        state.flowing = true;
        flow(src);
      }
    };
  }
  
  Readable.prototype.unpipe = function (dest) {
    var state = this._readableState;
    var unpipeInfo = { hasUnpiped: false };
  
    // if we're not piping anywhere, then do nothing.
    if (state.pipesCount === 0) return this;
  
    // just one destination.  most common case.
    if (state.pipesCount === 1) {
      // passed in one, but it's not the right one.
      if (dest && dest !== state.pipes) return this;
  
      if (!dest) dest = state.pipes;
  
      // got a match.
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest) dest.emit('unpipe', this, unpipeInfo);
      return this;
    }
  
    // slow case. multiple pipe destinations.
  
    if (!dest) {
      // remove all.
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
  
      for (var i = 0; i < len; i++) {
        dests[i].emit('unpipe', this, unpipeInfo);
      }return this;
    }
  
    // try to find the right one.
    var index = indexOf(state.pipes, dest);
    if (index === -1) return this;
  
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1) state.pipes = state.pipes[0];
  
    dest.emit('unpipe', this, unpipeInfo);
  
    return this;
  };
  
  // set up data events if they are asked for
  // Ensure readable listeners eventually get something
  Readable.prototype.on = function (ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
  
    if (ev === 'data') {
      // Start flowing on next tick if stream isn't explicitly paused
      if (this._readableState.flowing !== false) this.resume();
    } else if (ev === 'readable') {
      var state = this._readableState;
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.emittedReadable = false;
        if (!state.reading) {
          pna.nextTick(nReadingNextTick, this);
        } else if (state.length) {
          emitReadable(this);
        }
      }
    }
  
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  
  function nReadingNextTick(self) {
    debug('readable nexttick read 0');
    self.read(0);
  }
  
  // pause() and resume() are remnants of the legacy readable stream API
  // If the user uses them, then switch into old mode.
  Readable.prototype.resume = function () {
    var state = this._readableState;
    if (!state.flowing) {
      debug('resume');
      state.flowing = true;
      resume(this, state);
    }
    return this;
  };
  
  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      pna.nextTick(resume_, stream, state);
    }
  }
  
  function resume_(stream, state) {
    if (!state.reading) {
      debug('resume read 0');
      stream.read(0);
    }
  
    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream.emit('resume');
    flow(stream);
    if (state.flowing && !state.reading) stream.read(0);
  }
  
  Readable.prototype.pause = function () {
    debug('call pause flowing=%j', this._readableState.flowing);
    if (false !== this._readableState.flowing) {
      debug('pause');
      this._readableState.flowing = false;
      this.emit('pause');
    }
    return this;
  };
  
  function flow(stream) {
    var state = stream._readableState;
    debug('flow', state.flowing);
    while (state.flowing && stream.read() !== null) {}
  }
  
  // wrap an old-style stream as the async data source.
  // This is *not* part of the readable stream interface.
  // It is an ugly unfortunate mess of history.
  Readable.prototype.wrap = function (stream) {
    var _this = this;
  
    var state = this._readableState;
    var paused = false;
  
    stream.on('end', function () {
      debug('wrapped end');
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) _this.push(chunk);
      }
  
      _this.push(null);
    });
  
    stream.on('data', function (chunk) {
      debug('wrapped data');
      if (state.decoder) chunk = state.decoder.write(chunk);
  
      // don't skip over falsy values in objectMode
      if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
  
      var ret = _this.push(chunk);
      if (!ret) {
        paused = true;
        stream.pause();
      }
    });
  
    // proxy all the other methods.
    // important when wrapping filters and duplexes.
    for (var i in stream) {
      if (this[i] === undefined && typeof stream[i] === 'function') {
        this[i] = function (method) {
          return function () {
            return stream[method].apply(stream, arguments);
          };
        }(i);
      }
    }
  
    // proxy certain important events.
    for (var n = 0; n < kProxyEvents.length; n++) {
      stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
  
    // when we try to consume some more bytes, simply unpause the
    // underlying stream.
    this._read = function (n) {
      debug('wrapped _read', n);
      if (paused) {
        paused = false;
        stream.resume();
      }
    };
  
    return this;
  };
  
  // exposed for testing purposes only.
  Readable._fromList = fromList;
  
  // Pluck off n bytes from an array of buffers.
  // Length is the combined lengths of all the buffers in the list.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function fromList(n, state) {
    // nothing buffered
    if (state.length === 0) return null;
  
    var ret;
    if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
      // read it all, truncate the list
      if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      // read part of list
      ret = fromListPartial(n, state.buffer, state.decoder);
    }
  
    return ret;
  }
  
  // Extracts only enough buffered data to satisfy the amount requested.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function fromListPartial(n, list, hasStrings) {
    var ret;
    if (n < list.head.data.length) {
      // slice is the same for buffers and strings
      ret = list.head.data.slice(0, n);
      list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
      // first chunk is a perfect match
      ret = list.shift();
    } else {
      // result spans more than one buffer
      ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
    }
    return ret;
  }
  
  // Copies a specified amount of characters from the list of buffered data
  // chunks.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function copyFromBufferString(n, list) {
    var p = list.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;
    while (p = p.next) {
      var str = p.data;
      var nb = n > str.length ? str.length : n;
      if (nb === str.length) ret += str;else ret += str.slice(0, n);
      n -= nb;
      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next) list.head = p.next;else list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = str.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  }
  
  // Copies a specified amount of bytes from the list of buffered data chunks.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function copyFromBuffer(n, list) {
    var ret = Buffer.allocUnsafe(n);
    var p = list.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;
    while (p = p.next) {
      var buf = p.data;
      var nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;
      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next) list.head = p.next;else list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = buf.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  }
  
  function endReadable(stream) {
    var state = stream._readableState;
  
    // If we get here before consuming all the bytes, then that is a
    // bug in node.  Should never happen.
    if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
  
    if (!state.endEmitted) {
      state.ended = true;
      pna.nextTick(endReadableNT, state, stream);
    }
  }
  
  function endReadableNT(state, stream) {
    // Check that we didn't get one last unshift.
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream.readable = false;
      stream.emit('end');
    }
  }
  
  function forEach(xs, f) {
    for (var i = 0, l = xs.length; i < l; i++) {
      f(xs[i], i);
    }
  }
  
  function indexOf(xs, x) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) return i;
    }
    return -1;
  }
  }).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"./_stream_duplex":94,"./internal/streams/BufferList":99,"./internal/streams/destroy":100,"./internal/streams/stream":101,"_process":92,"core-util-is":53,"events":54,"inherits":89,"isarray":102,"process-nextick-args":91,"safe-buffer":108,"string_decoder/":103,"util":50}],97:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // a transform stream is a readable/writable stream where you do
  // something with the data.  Sometimes it's called a "filter",
  // but that's not a great name for it, since that implies a thing where
  // some bits pass through, and others are simply ignored.  (That would
  // be a valid example of a transform, of course.)
  //
  // While the output is causally related to the input, it's not a
  // necessarily symmetric or synchronous transformation.  For example,
  // a zlib stream might take multiple plain-text writes(), and then
  // emit a single compressed chunk some time in the future.
  //
  // Here's how this works:
  //
  // The Transform stream has all the aspects of the readable and writable
  // stream classes.  When you write(chunk), that calls _write(chunk,cb)
  // internally, and returns false if there's a lot of pending writes
  // buffered up.  When you call read(), that calls _read(n) until
  // there's enough pending readable data buffered up.
  //
  // In a transform stream, the written data is placed in a buffer.  When
  // _read(n) is called, it transforms the queued up data, calling the
  // buffered _write cb's as it consumes chunks.  If consuming a single
  // written chunk would result in multiple output chunks, then the first
  // outputted bit calls the readcb, and subsequent chunks just go into
  // the read buffer, and will cause it to emit 'readable' if necessary.
  //
  // This way, back-pressure is actually determined by the reading side,
  // since _read has to be called to start processing a new chunk.  However,
  // a pathological inflate type of transform can cause excessive buffering
  // here.  For example, imagine a stream where every byte of input is
  // interpreted as an integer from 0-255, and then results in that many
  // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
  // 1kb of data being output.  In this case, you could write a very small
  // amount of input, and end up with a very large amount of output.  In
  // such a pathological inflating mechanism, there'd be no way to tell
  // the system to stop doing the transform.  A single 4MB write could
  // cause the system to run out of memory.
  //
  // However, even in such a pathological case, only a single written chunk
  // would be consumed, and then the rest would wait (un-transformed) until
  // the results of the previous transformed chunk were consumed.
  
  'use strict';
  
  module.exports = Transform;
  
  var Duplex = require('./_stream_duplex');
  
  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/
  
  util.inherits(Transform, Duplex);
  
  function afterTransform(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
  
    var cb = ts.writecb;
  
    if (!cb) {
      return this.emit('error', new Error('write callback called multiple times'));
    }
  
    ts.writechunk = null;
    ts.writecb = null;
  
    if (data != null) // single equals check for both `null` and `undefined`
      this.push(data);
  
    cb(er);
  
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  }
  
  function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options);
  
    Duplex.call(this, options);
  
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    };
  
    // start out asking for a readable event once data is transformed.
    this._readableState.needReadable = true;
  
    // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.
    this._readableState.sync = false;
  
    if (options) {
      if (typeof options.transform === 'function') this._transform = options.transform;
  
      if (typeof options.flush === 'function') this._flush = options.flush;
    }
  
    // When the writable side finishes, then flush out anything remaining.
    this.on('prefinish', prefinish);
  }
  
  function prefinish() {
    var _this = this;
  
    if (typeof this._flush === 'function') {
      this._flush(function (er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  }
  
  Transform.prototype.push = function (chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };
  
  // This is the part where you do stuff!
  // override this function in implementation classes.
  // 'chunk' is an input chunk.
  //
  // Call `push(newChunk)` to pass along transformed output
  // to the readable side.  You may call 'push' zero or more times.
  //
  // Call `cb(err)` when you are done with this chunk.  If you pass
  // an error, then that'll put the hurt on the whole operation.  If you
  // never call cb(), then you'll never get another chunk.
  Transform.prototype._transform = function (chunk, encoding, cb) {
    throw new Error('_transform() is not implemented');
  };
  
  Transform.prototype._write = function (chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
    }
  };
  
  // Doesn't matter what the args are here.
  // _transform does all the work.
  // That we got here means that the readable side wants more data.
  Transform.prototype._read = function (n) {
    var ts = this._transformState;
  
    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      // mark that we need a transform, so that any data that comes in
      // will get processed, now that we've asked for it.
      ts.needTransform = true;
    }
  };
  
  Transform.prototype._destroy = function (err, cb) {
    var _this2 = this;
  
    Duplex.prototype._destroy.call(this, err, function (err2) {
      cb(err2);
      _this2.emit('close');
    });
  };
  
  function done(stream, er, data) {
    if (er) return stream.emit('error', er);
  
    if (data != null) // single equals check for both `null` and `undefined`
      stream.push(data);
  
    // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided
    if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');
  
    if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');
  
    return stream.push(null);
  }
  },{"./_stream_duplex":94,"core-util-is":53,"inherits":89}],98:[function(require,module,exports){
  (function (process,global){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  // A bit simpler than readable streams.
  // Implement an async ._write(chunk, encoding, cb), and it'll handle all
  // the drain event emission and buffering.
  
  'use strict';
  
  /*<replacement>*/
  
  var pna = require('process-nextick-args');
  /*</replacement>*/
  
  module.exports = Writable;
  
  /* <replacement> */
  function WriteReq(chunk, encoding, cb) {
    this.chunk = chunk;
    this.encoding = encoding;
    this.callback = cb;
    this.next = null;
  }
  
  // It seems a linked list but it is not
  // there will be only 2 of these for each stream
  function CorkedRequest(state) {
    var _this = this;
  
    this.next = null;
    this.entry = null;
    this.finish = function () {
      onCorkedFinish(_this, state);
    };
  }
  /* </replacement> */
  
  /*<replacement>*/
  var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
  /*</replacement>*/
  
  /*<replacement>*/
  var Duplex;
  /*</replacement>*/
  
  Writable.WritableState = WritableState;
  
  /*<replacement>*/
  var util = require('core-util-is');
  util.inherits = require('inherits');
  /*</replacement>*/
  
  /*<replacement>*/
  var internalUtil = {
    deprecate: require('util-deprecate')
  };
  /*</replacement>*/
  
  /*<replacement>*/
  var Stream = require('./internal/streams/stream');
  /*</replacement>*/
  
  /*<replacement>*/
  
  var Buffer = require('safe-buffer').Buffer;
  var OurUint8Array = global.Uint8Array || function () {};
  function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk);
  }
  function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
  }
  
  /*</replacement>*/
  
  var destroyImpl = require('./internal/streams/destroy');
  
  util.inherits(Writable, Stream);
  
  function nop() {}
  
  function WritableState(options, stream) {
    Duplex = Duplex || require('./_stream_duplex');
  
    options = options || {};
  
    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    var isDuplex = stream instanceof Duplex;
  
    // object stream flag to indicate whether or not this stream
    // contains buffers or objects.
    this.objectMode = !!options.objectMode;
  
    if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
  
    // the point at which write() starts returning false
    // Note: 0 is a valid value, means that we always return false if
    // the entire buffer is not flushed immediately on write()
    var hwm = options.highWaterMark;
    var writableHwm = options.writableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  
    if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;
  
    // cast to ints.
    this.highWaterMark = Math.floor(this.highWaterMark);
  
    // if _final has been called
    this.finalCalled = false;
  
    // drain event flag.
    this.needDrain = false;
    // at the start of calling end()
    this.ending = false;
    // when end() has been called, and returned
    this.ended = false;
    // when 'finish' is emitted
    this.finished = false;
  
    // has it been destroyed
    this.destroyed = false;
  
    // should we decode strings into buffers before passing to _write?
    // this is here so that some node-core streams can optimize string
    // handling at a lower level.
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
  
    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = options.defaultEncoding || 'utf8';
  
    // not an actual buffer we keep track of, but a measurement
    // of how much we're waiting to get pushed to some underlying
    // socket or file.
    this.length = 0;
  
    // a flag to see when we're in the middle of a write.
    this.writing = false;
  
    // when true all writes will be buffered until .uncork() call
    this.corked = 0;
  
    // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.
    this.sync = true;
  
    // a flag to know if we're processing previously buffered items, which
    // may call the _write() callback in the same tick, so that we don't
    // end up in an overlapped onwrite situation.
    this.bufferProcessing = false;
  
    // the callback that's passed to _write(chunk,cb)
    this.onwrite = function (er) {
      onwrite(stream, er);
    };
  
    // the callback that the user supplies to write(chunk,encoding,cb)
    this.writecb = null;
  
    // the amount that is being written when _write is called.
    this.writelen = 0;
  
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
  
    // number of pending user-supplied write callbacks
    // this must be 0 before 'finish' can be emitted
    this.pendingcb = 0;
  
    // emit prefinish if the only thing we're waiting for is _write cbs
    // This is relevant for synchronous Transform streams
    this.prefinished = false;
  
    // True if the error was already emitted and should not be thrown again
    this.errorEmitted = false;
  
    // count buffered requests
    this.bufferedRequestCount = 0;
  
    // allocate the first CorkedRequest, there is always
    // one allocated and free to use, and we maintain at most two
    this.corkedRequestsFree = new CorkedRequest(this);
  }
  
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while (current) {
      out.push(current);
      current = current.next;
    }
    return out;
  };
  
  (function () {
    try {
      Object.defineProperty(WritableState.prototype, 'buffer', {
        get: internalUtil.deprecate(function () {
          return this.getBuffer();
        }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
      });
    } catch (_) {}
  })();
  
  // Test _writableState for inheritance to account for Duplex streams,
  // whose prototype chain only points to Readable.
  var realHasInstance;
  if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function (object) {
        if (realHasInstance.call(this, object)) return true;
        if (this !== Writable) return false;
  
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function (object) {
      return object instanceof this;
    };
  }
  
  function Writable(options) {
    Duplex = Duplex || require('./_stream_duplex');
  
    // Writable ctor is applied to Duplexes, too.
    // `realHasInstance` is necessary because using plain `instanceof`
    // would return false, as no `_writableState` property is attached.
  
    // Trying to use the custom `instanceof` for Writable here will also break the
    // Node.js LazyTransform implementation, which has a non-trivial getter for
    // `_writableState` that would lead to infinite recursion.
    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
      return new Writable(options);
    }
  
    this._writableState = new WritableState(options, this);
  
    // legacy.
    this.writable = true;
  
    if (options) {
      if (typeof options.write === 'function') this._write = options.write;
  
      if (typeof options.writev === 'function') this._writev = options.writev;
  
      if (typeof options.destroy === 'function') this._destroy = options.destroy;
  
      if (typeof options.final === 'function') this._final = options.final;
    }
  
    Stream.call(this);
  }
  
  // Otherwise people can pipe Writable streams, which is just wrong.
  Writable.prototype.pipe = function () {
    this.emit('error', new Error('Cannot pipe, not readable'));
  };
  
  function writeAfterEnd(stream, cb) {
    var er = new Error('write after end');
    // TODO: defer error events consistently everywhere, not just the cb
    stream.emit('error', er);
    pna.nextTick(cb, er);
  }
  
  // Checks that a user-supplied chunk is valid, especially for the particular
  // mode the stream is in. Currently this means that `null` is never accepted
  // and undefined/non-string values are only allowed in object mode.
  function validChunk(stream, state, chunk, cb) {
    var valid = true;
    var er = false;
  
    if (chunk === null) {
      er = new TypeError('May not write null values to stream');
    } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
      er = new TypeError('Invalid non-string/buffer chunk');
    }
    if (er) {
      stream.emit('error', er);
      pna.nextTick(cb, er);
      valid = false;
    }
    return valid;
  }
  
  Writable.prototype.write = function (chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    var isBuf = !state.objectMode && _isUint8Array(chunk);
  
    if (isBuf && !Buffer.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
  
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
  
    if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  
    if (typeof cb !== 'function') cb = nop;
  
    if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
  
    return ret;
  };
  
  Writable.prototype.cork = function () {
    var state = this._writableState;
  
    state.corked++;
  };
  
  Writable.prototype.uncork = function () {
    var state = this._writableState;
  
    if (state.corked) {
      state.corked--;
  
      if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
    }
  };
  
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    // node::ParseEncoding() requires lower case.
    if (typeof encoding === 'string') encoding = encoding.toLowerCase();
    if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  
  function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, encoding);
    }
    return chunk;
  }
  
  // if we're already writing something, then just put this
  // in the queue, and wait our turn.  Otherwise, call _write
  // If we return false, then we need a drain event, so set that flag.
  function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding);
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = 'buffer';
        chunk = newChunk;
      }
    }
    var len = state.objectMode ? 1 : chunk.length;
  
    state.length += len;
  
    var ret = state.length < state.highWaterMark;
    // we must ensure that previous needDrain will not be reset to false.
    if (!ret) state.needDrain = true;
  
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest;
      state.lastBufferedRequest = {
        chunk: chunk,
        encoding: encoding,
        isBuf: isBuf,
        callback: cb,
        next: null
      };
      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }
      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream, state, false, len, chunk, encoding, cb);
    }
  
    return ret;
  }
  
  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  
  function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb;
  
    if (sync) {
      // defer the callback if we are being called synchronously
      // to avoid piling up things on the stack
      pna.nextTick(cb, er);
      // this can emit finish, and it will always happen
      // after error
      pna.nextTick(finishMaybe, stream, state);
      stream._writableState.errorEmitted = true;
      stream.emit('error', er);
    } else {
      // the caller expect this to happen before if
      // it is async
      cb(er);
      stream._writableState.errorEmitted = true;
      stream.emit('error', er);
      // this can emit finish, but finish must
      // always follow error
      finishMaybe(stream, state);
    }
  }
  
  function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  }
  
  function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
  
    onwriteStateUpdate(state);
  
    if (er) onwriteError(stream, state, sync, er, cb);else {
      // Check if we're actually ready to finish, but don't emit yet
      var finished = needFinish(state);
  
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream, state);
      }
  
      if (sync) {
        /*<replacement>*/
        asyncWrite(afterWrite, stream, state, finished, cb);
        /*</replacement>*/
      } else {
        afterWrite(stream, state, finished, cb);
      }
    }
  }
  
  function afterWrite(stream, state, finished, cb) {
    if (!finished) onwriteDrain(stream, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream, state);
  }
  
  // Must force callback to be called on nextTick, so that we don't
  // emit 'drain' before the write() consumer gets the 'false' return
  // value, and has a chance to attach a 'drain' listener.
  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream.emit('drain');
    }
  }
  
  // if there's something in the buffer waiting, then process it
  function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
  
    if (stream._writev && entry && entry.next) {
      // Fast case, write everything using _writev()
      var l = state.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state.corkedRequestsFree;
      holder.entry = entry;
  
      var count = 0;
      var allBuffers = true;
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf) allBuffers = false;
        entry = entry.next;
        count += 1;
      }
      buffer.allBuffers = allBuffers;
  
      doWrite(stream, state, true, state.length, buffer, '', holder.finish);
  
      // doWrite is almost always async, defer these to save a bit of time
      // as the hot path ends with doWrite
      state.pendingcb++;
      state.lastBufferedRequest = null;
      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
      state.bufferedRequestCount = 0;
    } else {
      // Slow case, write chunks one-by-one
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
  
        doWrite(stream, state, false, len, chunk, encoding, cb);
        entry = entry.next;
        state.bufferedRequestCount--;
        // if we didn't call the onwrite immediately, then
        // it means that we need to wait until it does.
        // also, that means that the chunk and cb are currently
        // being processed, so move the buffer counter past them.
        if (state.writing) {
          break;
        }
      }
  
      if (entry === null) state.lastBufferedRequest = null;
    }
  
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  }
  
  Writable.prototype._write = function (chunk, encoding, cb) {
    cb(new Error('_write() is not implemented'));
  };
  
  Writable.prototype._writev = null;
  
  Writable.prototype.end = function (chunk, encoding, cb) {
    var state = this._writableState;
  
    if (typeof chunk === 'function') {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
  
    if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);
  
    // .end() fully uncorks
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    }
  
    // ignore unnecessary end() calls.
    if (!state.ending && !state.finished) endWritable(this, state, cb);
  };
  
  function needFinish(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
  }
  function callFinal(stream, state) {
    stream._final(function (err) {
      state.pendingcb--;
      if (err) {
        stream.emit('error', err);
      }
      state.prefinished = true;
      stream.emit('prefinish');
      finishMaybe(stream, state);
    });
  }
  function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream._final === 'function') {
        state.pendingcb++;
        state.finalCalled = true;
        pna.nextTick(callFinal, stream, state);
      } else {
        state.prefinished = true;
        stream.emit('prefinish');
      }
    }
  }
  
  function finishMaybe(stream, state) {
    var need = needFinish(state);
    if (need) {
      prefinish(stream, state);
      if (state.pendingcb === 0) {
        state.finished = true;
        stream.emit('finish');
      }
    }
    return need;
  }
  
  function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);
    if (cb) {
      if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
    }
    state.ended = true;
    stream.writable = false;
  }
  
  function onCorkedFinish(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = corkReq;
    } else {
      state.corkedRequestsFree = corkReq;
    }
  }
  
  Object.defineProperty(Writable.prototype, 'destroyed', {
    get: function () {
      if (this._writableState === undefined) {
        return false;
      }
      return this._writableState.destroyed;
    },
    set: function (value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (!this._writableState) {
        return;
      }
  
      // backward compatibility, the user is explicitly
      // managing destroyed
      this._writableState.destroyed = value;
    }
  });
  
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function (err, cb) {
    this.end();
    cb(err);
  };
  }).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{"./_stream_duplex":94,"./internal/streams/destroy":100,"./internal/streams/stream":101,"_process":92,"core-util-is":53,"inherits":89,"process-nextick-args":91,"safe-buffer":108,"util-deprecate":113}],99:[function(require,module,exports){
  'use strict';
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var Buffer = require('safe-buffer').Buffer;
  var util = require('util');
  
  function copyBuffer(src, target, offset) {
    src.copy(target, offset);
  }
  
  module.exports = function () {
    function BufferList() {
      _classCallCheck(this, BufferList);
  
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
  
    BufferList.prototype.push = function push(v) {
      var entry = { data: v, next: null };
      if (this.length > 0) this.tail.next = entry;else this.head = entry;
      this.tail = entry;
      ++this.length;
    };
  
    BufferList.prototype.unshift = function unshift(v) {
      var entry = { data: v, next: this.head };
      if (this.length === 0) this.tail = entry;
      this.head = entry;
      ++this.length;
    };
  
    BufferList.prototype.shift = function shift() {
      if (this.length === 0) return;
      var ret = this.head.data;
      if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
      --this.length;
      return ret;
    };
  
    BufferList.prototype.clear = function clear() {
      this.head = this.tail = null;
      this.length = 0;
    };
  
    BufferList.prototype.join = function join(s) {
      if (this.length === 0) return '';
      var p = this.head;
      var ret = '' + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }return ret;
    };
  
    BufferList.prototype.concat = function concat(n) {
      if (this.length === 0) return Buffer.alloc(0);
      if (this.length === 1) return this.head.data;
      var ret = Buffer.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
  
    return BufferList;
  }();
  
  if (util && util.inspect && util.inspect.custom) {
    module.exports.prototype[util.inspect.custom] = function () {
      var obj = util.inspect({ length: this.length });
      return this.constructor.name + ' ' + obj;
    };
  }
  },{"safe-buffer":108,"util":50}],100:[function(require,module,exports){
  'use strict';
  
  /*<replacement>*/
  
  var pna = require('process-nextick-args');
  /*</replacement>*/
  
  // undocumented cb() API, needed for core, not for public API
  function destroy(err, cb) {
    var _this = this;
  
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
  
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
        pna.nextTick(emitErrorNT, this, err);
      }
      return this;
    }
  
    // we set destroyed to true before firing error callbacks in order
    // to make it re-entrance safe in case destroy() is called within callbacks
  
    if (this._readableState) {
      this._readableState.destroyed = true;
    }
  
    // if this is a duplex stream mark the writable part as destroyed as well
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
  
    this._destroy(err || null, function (err) {
      if (!cb && err) {
        pna.nextTick(emitErrorNT, _this, err);
        if (_this._writableState) {
          _this._writableState.errorEmitted = true;
        }
      } else if (cb) {
        cb(err);
      }
    });
  
    return this;
  }
  
  function undestroy() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
  
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  }
  
  function emitErrorNT(self, err) {
    self.emit('error', err);
  }
  
  module.exports = {
    destroy: destroy,
    undestroy: undestroy
  };
  },{"process-nextick-args":91}],101:[function(require,module,exports){
  module.exports = require('events').EventEmitter;
  
  },{"events":54}],102:[function(require,module,exports){
  arguments[4][52][0].apply(exports,arguments)
  },{"dup":52}],103:[function(require,module,exports){
  'use strict';
  
  var Buffer = require('safe-buffer').Buffer;
  
  var isEncoding = Buffer.isEncoding || function (encoding) {
    encoding = '' + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
        return true;
      default:
        return false;
    }
  };
  
  function _normalizeEncoding(enc) {
    if (!enc) return 'utf8';
    var retried;
    while (true) {
      switch (enc) {
        case 'utf8':
        case 'utf-8':
          return 'utf8';
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return 'utf16le';
        case 'latin1':
        case 'binary':
          return 'latin1';
        case 'base64':
        case 'ascii':
        case 'hex':
          return enc;
        default:
          if (retried) return; // undefined
          enc = ('' + enc).toLowerCase();
          retried = true;
      }
    }
  };
  
  // Do not cache `Buffer.isEncoding` when checking encoding names as some
  // modules monkey-patch it to support additional encodings
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
    return nenc || enc;
  }
  
  // StringDecoder provides an interface for efficiently splitting a series of
  // buffers into a series of JS strings without breaking apart multi-byte
  // characters.
  exports.StringDecoder = StringDecoder;
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case 'utf16le':
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case 'utf8':
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case 'base64':
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
  }
  
  StringDecoder.prototype.write = function (buf) {
    if (buf.length === 0) return '';
    var r;
    var i;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === undefined) return '';
      i = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || '';
  };
  
  StringDecoder.prototype.end = utf8End;
  
  // Returns only complete characters in a Buffer
  StringDecoder.prototype.text = utf8Text;
  
  // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
  StringDecoder.prototype.fillLast = function (buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  
  // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
  // continuation byte.
  function utf8CheckByte(byte) {
    if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
    return -1;
  }
  
  // Checks at most 3 bytes at the end of a Buffer in order to detect an
  // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
  // needed to complete the UTF-8 character (if applicable) are returned.
  function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) self.lastNeed = nb - 1;
      return nb;
    }
    if (--j < i) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) self.lastNeed = nb - 2;
      return nb;
    }
    if (--j < i) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  }
  
  // Validates as many continuation bytes for a multi-byte UTF-8 character as
  // needed or are available. If we see a non-continuation byte where we expect
  // one, we "replace" the validated continuation bytes we've seen so far with
  // UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
  // behavior. The continuation byte check is included three times in the case
  // where all of the continuation bytes for a character exist in the same buffer.
  // It is also done this way as a slight performance increase instead of using a
  // loop.
  function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xC0) !== 0x80) {
      self.lastNeed = 0;
      return '\ufffd'.repeat(p);
    }
    if (self.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 0xC0) !== 0x80) {
        self.lastNeed = 1;
        return '\ufffd'.repeat(p + 1);
      }
      if (self.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 0xC0) !== 0x80) {
          self.lastNeed = 2;
          return '\ufffd'.repeat(p + 2);
        }
      }
    }
  }
  
  // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  }
  
  // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
  // partial character, the character's bytes are buffered until the required
  // number of bytes are available.
  function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString('utf8', i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString('utf8', i, end);
  }
  
  // For UTF-8, a replacement character for each buffered byte of a (partial)
  // character needs to be added to the output.
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
    return r;
  }
  
  // UTF-16LE typically needs two bytes per character, but even if we have an even
  // number of bytes available, we need to check if we end on a leading/high
  // surrogate. In that case, we need to wait for the next two bytes in order to
  // decode the last character properly.
  function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString('utf16le', i);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 0xD800 && c <= 0xDBFF) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString('utf16le', i, buf.length - 1);
  }
  
  // For UTF-16LE we do not explicitly append special replacement characters if we
  // end on a partial character, we simply let v8 handle that.
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString('utf16le', 0, end);
    }
    return r;
  }
  
  function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString('base64', i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString('base64', i, buf.length - n);
  }
  
  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
    return r;
  }
  
  // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
  function simpleWrite(buf) {
    return buf.toString(this.encoding);
  }
  
  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : '';
  }
  },{"safe-buffer":108}],104:[function(require,module,exports){
  module.exports = require('./readable').PassThrough
  
  },{"./readable":105}],105:[function(require,module,exports){
  exports = module.exports = require('./lib/_stream_readable.js');
  exports.Stream = exports;
  exports.Readable = exports;
  exports.Writable = require('./lib/_stream_writable.js');
  exports.Duplex = require('./lib/_stream_duplex.js');
  exports.Transform = require('./lib/_stream_transform.js');
  exports.PassThrough = require('./lib/_stream_passthrough.js');
  
  },{"./lib/_stream_duplex.js":94,"./lib/_stream_passthrough.js":95,"./lib/_stream_readable.js":96,"./lib/_stream_transform.js":97,"./lib/_stream_writable.js":98}],106:[function(require,module,exports){
  module.exports = require('./readable').Transform
  
  },{"./readable":105}],107:[function(require,module,exports){
  module.exports = require('./lib/_stream_writable.js');
  
  },{"./lib/_stream_writable.js":98}],108:[function(require,module,exports){
  /* eslint-disable node/no-deprecated-api */
  var buffer = require('buffer')
  var Buffer = buffer.Buffer
  
  // alternative to using Object.keys for old browsers
  function copyProps (src, dst) {
    for (var key in src) {
      dst[key] = src[key]
    }
  }
  if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer
  } else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports)
    exports.Buffer = SafeBuffer
  }
  
  function SafeBuffer (arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length)
  }
  
  // Copy static methods from Buffer
  copyProps(Buffer, SafeBuffer)
  
  SafeBuffer.from = function (arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
      throw new TypeError('Argument must not be a number')
    }
    return Buffer(arg, encodingOrOffset, length)
  }
  
  SafeBuffer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    var buf = Buffer(size)
    if (fill !== undefined) {
      if (typeof encoding === 'string') {
        buf.fill(fill, encoding)
      } else {
        buf.fill(fill)
      }
    } else {
      buf.fill(0)
    }
    return buf
  }
  
  SafeBuffer.allocUnsafe = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    return Buffer(size)
  }
  
  SafeBuffer.allocUnsafeSlow = function (size) {
    if (typeof size !== 'number') {
      throw new TypeError('Argument must be a number')
    }
    return buffer.SlowBuffer(size)
  }
  
  },{"buffer":51}],109:[function(require,module,exports){
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  module.exports = Stream;
  
  var EE = require('events').EventEmitter;
  var inherits = require('inherits');
  
  inherits(Stream, EE);
  Stream.Readable = require('readable-stream/readable.js');
  Stream.Writable = require('readable-stream/writable.js');
  Stream.Duplex = require('readable-stream/duplex.js');
  Stream.Transform = require('readable-stream/transform.js');
  Stream.PassThrough = require('readable-stream/passthrough.js');
  
  // Backwards-compat with node 0.4.x
  Stream.Stream = Stream;
  
  
  
  // old-style streams.  Note that the pipe method (the only relevant
  // part of this class) is overridden in the Readable class.
  
  function Stream() {
    EE.call(this);
  }
  
  Stream.prototype.pipe = function(dest, options) {
    var source = this;
  
    function ondata(chunk) {
      if (dest.writable) {
        if (false === dest.write(chunk) && source.pause) {
          source.pause();
        }
      }
    }
  
    source.on('data', ondata);
  
    function ondrain() {
      if (source.readable && source.resume) {
        source.resume();
      }
    }
  
    dest.on('drain', ondrain);
  
    // If the 'end' option is not supplied, dest.end() will be called when
    // source gets the 'end' or 'close' events.  Only dest.end() once.
    if (!dest._isStdio && (!options || options.end !== false)) {
      source.on('end', onend);
      source.on('close', onclose);
    }
  
    var didOnEnd = false;
    function onend() {
      if (didOnEnd) return;
      didOnEnd = true;
  
      dest.end();
    }
  
  
    function onclose() {
      if (didOnEnd) return;
      didOnEnd = true;
  
      if (typeof dest.destroy === 'function') dest.destroy();
    }
  
    // don't leave dangling pipes when there are errors.
    function onerror(er) {
      cleanup();
      if (EE.listenerCount(this, 'error') === 0) {
        throw er; // Unhandled stream error in pipe.
      }
    }
  
    source.on('error', onerror);
    dest.on('error', onerror);
  
    // remove all the event listeners that were added.
    function cleanup() {
      source.removeListener('data', ondata);
      dest.removeListener('drain', ondrain);
  
      source.removeListener('end', onend);
      source.removeListener('close', onclose);
  
      source.removeListener('error', onerror);
      dest.removeListener('error', onerror);
  
      source.removeListener('end', cleanup);
      source.removeListener('close', cleanup);
  
      dest.removeListener('close', cleanup);
    }
  
    source.on('end', cleanup);
    source.on('close', cleanup);
  
    dest.on('close', cleanup);
  
    dest.emit('pipe', source);
  
    // Allow for unix-like usage: A.pipe(B).pipe(C)
    return dest;
  };
  
  },{"events":54,"inherits":89,"readable-stream/duplex.js":93,"readable-stream/passthrough.js":104,"readable-stream/readable.js":105,"readable-stream/transform.js":106,"readable-stream/writable.js":107}],110:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _ = require('./');
  
  var _2 = _interopRequireDefault(_);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  /**
   *
   * @param {Object} [options]
   * @param {Number} [count]
   * @constructor
   */
  var Block = function () {
    function Block(options, count) {
      _classCallCheck(this, Block);
  
      this.index = 0;
      this.thaws = [];
      this.count = count || 200;
      this.options = options;
    }
  
    /**
     * add an item to the end of items
     * @param item
     * @returns {Block}
     */
  
  
    _createClass(Block, [{
      key: 'add',
      value: function add(item) {
        var next = this._next();
        next.add(item);
  
        return this;
      }
  
      /**
       * add an Array to the end of items
       * @param items
       * @returns {Block}
       */
  
    }, {
      key: 'addArray',
      value: function addArray(items) {
        var next = this._next();
        next.addArray(items);
  
        return this;
      }
  
      /**
       * insert an item into items @ current position
       * @param item
       * @returns {Block}
       */
  
    }, {
      key: 'insert',
      value: function insert(item) {
        var next = this._next();
        next.insert(item);
  
        return this;
      }
  
      /**
       * insert and array into items @ current position
       * @param items
       * @returns {Block}
       */
  
    }, {
      key: 'insertArray',
      value: function insertArray(items) {
        var next = this._next();
        next.insertArray(items);
  
        return this;
      }
  
      /**
       * Stops all thaws in this block
       * @returns {Block}
       */
  
    }, {
      key: 'stop',
      value: function stop() {
        for (var i = 0; i < this.thaws.length; i++) {
          this.thaws[i].stop();
        }
        return this;
      }
  
      /**
       * Get next available in block
       * @returns {*}
       * @private
       */
  
    }, {
      key: '_next',
      value: function _next() {
        var thaw = null;
        var thaws = this.thaws;
  
        if (thaws.length < this.count) {
          thaws.push(thaw = new _2.default([], this.options));
        } else {
          thaw = thaws[this.index];
        }
        this.index++;
        if (this.index >= this.count) {
          this.index = 0;
        }
  
        return thaw;
      }
    }]);
  
    return Block;
  }();
  
  exports.default = Block;
  ;
  
  },{"./":111}],111:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Block = undefined;
  
  var _thaw = require('./thaw');
  
  var _thaw2 = _interopRequireDefault(_thaw);
  
  var _block = require('./block');
  
  var _block2 = _interopRequireDefault(_block);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  exports.default = _thaw2.default;
  exports.Block = _block2.default;
  
  
  if (typeof window !== 'undefined') {
    window.Thaw = _thaw2.default;
    window.Thaw.Block = _block2.default;
  }
  
  },{"./block":110,"./thaw":112}],112:[function(require,module,exports){
  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  exports.thaw = thaw;
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  //private variables
  var thawing = false;
  var thaws = [];
  
  /**
   * thaw an array of items
   * @param {Array} items
   * @param {Object} [options]
   * @constructor
   */
  
  var Thaw = function () {
    _createClass(Thaw, null, [{
      key: "stopAll",
  
  
      /**
       * Stops all Thaw instances
       */
      value: function stopAll() {
        for (var i = 0; i < thaws.length; i++) {
          thaws[i].stop();
        }
      }
    }, {
      key: "defaultSettings",
  
      /**
       *
       * @type {{each: null, done: null}}
       */
      get: function get() {
        return {
          each: null,
          done: null
        };
      }
  
      /**
       * returns if Thaw.js is thawing
       * @returns {boolean}
       */
  
    }, {
      key: "isThawing",
      get: function get() {
        return thawing;
      }
    }]);
  
    function Thaw(items) {
      var _this = this;
  
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  
      _classCallCheck(this, Thaw);
  
      var _constructor$defaultS = _extends({}, this.constructor.defaultSettings, options),
          each = _constructor$defaultS.each,
          done = _constructor$defaultS.done;
  
      this.items = items;
      this.i = 0;
      this.options = options;
      var tick = this.tick = function () {
        if (_this.i < 0) return;
  
        _this.timeout = setTimeout(tick, 0);
  
        if (thawing) return;
        var item = items[_this.i];
        if (_this.i >= items.length) {
          if (done !== null) {
            thawing = true;
            done(item, _this.i);
            thawing = false;
          }
  
          _this.i = -1;
          clearTimeout(_this.timeout);
          return;
        }
        if (each !== null) {
          thawing = true;
          each(item, _this.i);
          thawing = false;
        } else if (item !== undefined) {
          item();
        }
        _this.i++;
      };
  
      thaws.push(this);
      if (!options.delay) {
        tick();
      }
    }
  
    /**
     * readies thaw to continue
     * @returns {boolean} if had to get ready
     */
  
  
    _createClass(Thaw, [{
      key: "makeReady",
      value: function makeReady() {
        if (this.i < 0) {
          this.i = this.items.length;
          return true;
        }
        return false;
      }
  
      /**
       * Adds an item to the end of this instance of Thaw and readies Thaw to process it
       * @param item
       * @returns {Thaw}
       */
  
    }, {
      key: "add",
      value: function add(item) {
        var doTick = this.makeReady();
  
        this.items.push(item);
  
        if (doTick) {
          this.tick();
        }
        return this;
      }
  
      /**
       * Inserts an item just after the current item being processed in Thaw and readies Thaw to process it
       * @param item
       * @returns {Thaw}
       */
  
    }, {
      key: "insert",
      value: function insert(item) {
        var doTick = this.makeReady();
  
        this.items.splice(this.i, 0, item);
  
        if (doTick) {
          this.tick();
        }
  
        return this;
      }
  
      /**
       * Adds an Array to the end of this instance of Thaw and readies Thaw to process it
       * @param {Array} items
       * @returns {Thaw}
       */
  
    }, {
      key: "addArray",
      value: function addArray(items) {
        var doTick = this.makeReady();
  
        this.items = this.items.concat(items);
  
        if (doTick) {
          this.tick();
        }
  
        return this;
      }
  
      /**
       * Inserts an Array just after the current item being processed in Thaw and readies Thaw to process them
       * @param {Array} items
       * @returns {Thaw}
       */
  
    }, {
      key: "insertArray",
      value: function insertArray(items) {
        var doTick = this.makeReady();
        var left = this.items;
        var middle = items;
        var right = this.items.splice(this.i, this.items.length - this.i + 1);
  
        this.items = left.concat(middle, right);
  
        if (doTick) {
          this.tick();
        }
        return this;
      }
  
      /**
       * Stops this instance of Thaw
       * @returns {Thaw}
       */
  
    }, {
      key: "stop",
      value: function stop() {
        this.i = -1;
        clearTimeout(this.timeout);
        if (this.options.done) {
          this.options.done();
        }
        return this;
      }
    }]);
  
    return Thaw;
  }();
  
  /**
   * simple thaw
   * @param {Array} items
   * @param {Object} [options]
   * @returns Thaw
   */
  
  
  exports.default = Thaw;
  function thaw(items) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  
    return new Thaw(items, options);
  }
  
  },{}],113:[function(require,module,exports){
  (function (global){
  
  /**
   * Module exports.
   */
  
  module.exports = deprecate;
  
  /**
   * Mark that a method should not be used.
   * Returns a modified function which warns once by default.
   *
   * If `localStorage.noDeprecation = true` is set, then it is a no-op.
   *
   * If `localStorage.throwDeprecation = true` is set, then deprecated functions
   * will throw an Error when invoked.
   *
   * If `localStorage.traceDeprecation = true` is set, then deprecated functions
   * will invoke `console.trace()` instead of `console.error()`.
   *
   * @param {Function} fn - the function to deprecate
   * @param {String} msg - the string to print to the console when `fn` is invoked
   * @returns {Function} a new "deprecated" version of `fn`
   * @api public
   */
  
  function deprecate (fn, msg) {
    if (config('noDeprecation')) {
      return fn;
    }
  
    var warned = false;
    function deprecated() {
      if (!warned) {
        if (config('throwDeprecation')) {
          throw new Error(msg);
        } else if (config('traceDeprecation')) {
          console.trace(msg);
        } else {
          console.warn(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }
  
    return deprecated;
  }
  
  /**
   * Checks `localStorage` for boolean values for the given `name`.
   *
   * @param {String} name
   * @returns {Boolean}
   * @api private
   */
  
  function config (name) {
    // accessing global.localStorage can trigger a DOMException in sandboxed iframes
    try {
      if (!global.localStorage) return false;
    } catch (_) {
      return false;
    }
    var val = global.localStorage[name];
    if (null == val) return false;
    return String(val).toLowerCase() === 'true';
  }
  
  }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}]},{},[47])(47)
  });


  function arrayAddNumbersHorizontaly(array1,array2) {
  const reducer = (accumulator, currentValue, index, array) => {
      let val = currentValue + array2[index];
      accumulator.push(val);
      return accumulator;
  }
  return array1.reduce(reducer, []);
  }
/* 
 var array1 = [1,2,3,4];
 var array2 = [5,6,7,8]; 

 Output: [
  6,
  8,
  10,
  12
]
*/



function sumArray(a, b) {
  var c = [];
  for (var i = 0; i < Math.max(a.length, b.length); i++) {
    c.push((a[i] || 0) + (b[i] || 0));
  }
  return c;
}

//var ae4 = sumArray([1,2],[2,3])
//var be4 = a[0] + a[1]


const chunkArray = (arr, size) =>
Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
  arr.slice(i * size, i * size + size)
);
