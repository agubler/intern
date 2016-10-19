/**
 * A wrapper around a Benchmark.js Benchmark that maps its API to that used  by Test. Note that BenchmarkTest doesn't
 * actually inherit from Test.
 */
define([
	'./Test',
	'benchmark',
	'dojo/Promise',
	'dojo/lang'
], function (
	Test,
	Benchmark,
	Promise,
	lang
) {
	function BenchmarkTest(kwArgs) {
		// `options`, if present, will be a property on the test function
		this.test = (kwArgs && kwArgs.test) || /* istanbul ignore next */ function () {};
		var options = this.test.options || {};

		if ('skip' in options) {
			this.skipped = options.skip;
		}
		else {
			var self = this;
			this.benchmark = new Benchmark(kwArgs.name, function () {
				self.test.apply(self, arguments);
			}, options); 

			Object.defineProperty(this.benchmark, 'name', {
				get: function () {
					return self.name;
				},
				set: function (name) {
					self.name = name;
				}
			});
		}

		// Call the superclass constructor with the set of kwArgs not specific to BenchmarkTest
		var args = {};
		for (var key in kwArgs) {
			switch (key) {
			case 'test':
			case 'options':
				break;
			default:
				args[key] = kwArgs[key];
			}
		}
		Test.call(this, args);
	}

	BenchmarkTest.prototype = Object.create(Test.prototype, {
		constructor: { value: BenchmarkTest },

		error: {
			get: function () {
				return this.benchmark.error;
			}
		},

		timeElapsed: {
			get: function () {
				return this.benchmark.times.elapsed;
			}
		},

		async: {
			value: function () {
				throw new Error('Benchmark tests must be marked as asynchronous and use the deferred passed to them rather than call `this.async()`.');
			}
		},

		skip: {
			value: function () {
				throw new Error('Benchmark tests must be marked as skipped rather than call `this.skip()`.');
			}
		},

		run: {
			value: function () {
				function report(eventName) {
					if (reporterManager) {
						var args = [ eventName, self ].concat(Array.prototype.slice.call(arguments, 1));
						return reporterManager.emit.apply(reporterManager, args).catch(function () {});
					}
					else {
						return Promise.resolve();
					}
				}

				var reporterManager = this.reporterManager;

				this.hasPassed = false;

				var self = this;
				var benchmark = this.benchmark;

				return new Promise(function (resolve, reject, progress, setCanceler) {
					setCanceler(function (reason) {
						benchmark.error = reason;
						benchmark.abort();

						throw reason;
					});

					benchmark.on('abort', function () {
						reject(benchmark.error);
					});

					benchmark.on('error', function () {
						reject(benchmark.error);
					});

					benchmark.on('complete', function () {
						resolve();
					});

					report('testStart').then(function () {
						benchmark.run();
					});
				}).finally(function () {
					// Stop listening for benchmark events once the test is finished
					benchmark.off();
				}).then(function () {
					self.hasPassed = true;
					return report('testPass');
				}, function (error) {
					return report('testFail', error).then(function () {
						throw error;
					});
				}).finally(function () {
					return report('testEnd');
				});
			}
		},

		toJSON: {
			value: function () {
				var data = Test.prototype.toJSON.call(this);
				data.benchmark = {
					times: this.benchmark.times,
					hz: this.benchmark.hz,
					stats: this.benchmark.stats
				};
				return data;
			}
		}
	});

	/* istanbul ignore next */
	function noop() {}

	function createDeferred(benchmark, deferred, numCallsUntilResolution) {
		if (!numCallsUntilResolution) {
			numCallsUntilResolution = 1;
		}

		return {
			resolve: function () {
				--numCallsUntilResolution;
				if (numCallsUntilResolution === 0) {
					deferred.resolve();
				}
				else if (numCallsUntilResolution < 0) {
					throw new Error('resolve called too many times');
				}
			},

			reject: function (error) {
				benchmark.error = error;
				benchmark.abort();
				deferred.resolve();
			},

			progress: noop,

			rejectOnError: function (callback) {
				var self = this;
				return function () {
					try {
						return callback.apply(this, arguments);
					}
					catch (error) {
						self.reject(error);
					}
				};
			},

			callback: function (callback) {
				var self = this;
				return self.rejectOnError(function () {
					var returnValue = callback.apply(this, arguments);
					self.resolve();
					return returnValue;
				});
			}
		};
	}

	BenchmarkTest.async = function (testFunction, numCallsUntilResolution) {
		function asyncWrapper(deferred) {
			var dfd = createDeferred(this.benchmark, deferred, numCallsUntilResolution);
			testFunction.call(this, dfd);
		}

		asyncWrapper.options = lang.mixin({}, testFunction.options || {}, {
			defer: true,
			async: true
		});

		return asyncWrapper;
	};

	BenchmarkTest.skip = function (reason, testFunction) {
		if (typeof reason === 'function') {
			testFunction = reason;
			reason = 'skipped';
		}

		/* istanbul ignore next */
		function skip() {}

		skip.options = lang.mixin({}, testFunction.options || {}, {
			skip: reason
		});

		return skip;
	};

	return BenchmarkTest;
});
