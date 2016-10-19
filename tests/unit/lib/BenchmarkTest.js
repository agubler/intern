define([
	'intern!object',
	'intern/chai!assert',
	'../../../lib/BenchmarkTest',
	'dojo/Promise'
], function (registerSuite, assert, BenchmarkTest, Promise) {
	function createTest(options) {
		if (!options.parent) {
			options.parent = {
				reporterManager: {
					emit: function () {
						options.reporterManagerEmit && options.reporterManagerEmit.apply(this, arguments);
						return Promise.resolve();
					}
				}
			};
		}
		return new BenchmarkTest(options);
	}

	registerSuite({
		name: 'intern/lib/BenchmarkTest',

		'BenchmarkTest#test': function () {
			this.timeout = 5000;

			var executionCount = 0;

			var test = new BenchmarkTest({
				name: 'BenchmarkTest#test',
				test: function () {
					executionCount++;
				}
			});

			// Ensure the test runner's timeout gets reset on each cycle
			test.benchmark.on('cycle', function () {
				this.restartTimeout();
			}.bind(this));

			return test.run().then(function () {
				assert.isAbove(executionCount, 1,
					'Test function should have been called multiple times when run is called');
			});
		},

		'BenchmarkTest#test (async)': function () {
			this.timeout = 5000;

			var executionCount = 0;

			var test = new BenchmarkTest({
				name: 'BenchmarkTest#test (async)',
				test: BenchmarkTest.async(function (dfd) {
					setTimeout(dfd.callback(function () {
						executionCount++;
					}), 200);
				})
			});

			// Ensure the test runner's timeout gets reset on each cycle
			test.benchmark.on('cycle', function () {
				this.restartTimeout();
			}.bind(this));

			return test.run().then(function () {
				assert.isAbove(executionCount, 1,
					'Test function should have been called multiple times when run is called');
			});
		},

		'BenchmarkTest#test (async, error)': function () {
			this.timeout = 5000;

			var executionCount = 0;

			var test = new BenchmarkTest({
				name: 'BenchmarkTest#test (async, error)',
				test: BenchmarkTest.async(function (dfd) {
					setTimeout(dfd.callback(function () {
						executionCount++;
						throw new Error('error');
					}), 200);
				})
			});

			// Ensure the test runner's timeout gets reset on each cycle
			test.benchmark.on('cycle', function () {
				this.restartTimeout();
			}.bind(this));

			return test.run().then(
				function () {
					throw new Error('test should not have passed');
				},
				function () {
					assert.isAbove(executionCount, 0,
						'Test function should have been called at least once when run is called');
				}
			);
		},

		'BenchmarkTest#constructor topic': function () {
			var topicFired = false;
			var actualTest;
			var expectedTest = createTest({
				reporterManagerEmit: function (topic, test) {
					if (topic === 'newTest') {
						topicFired = true;
						actualTest = test;
					}
				}
			});
			expectedTest.name = 'BenchmarkTest#constructor topic';
			assert.isTrue(topicFired, 'newTest topic should fire after a test is created');
			assert.strictEqual(actualTest, expectedTest,
				'newTest topic should be passed the test that was just created');
		},

		'BenchmarkTest#constructor with benchmark options': function () {
			this.timeout = 5000;

			var runCount = 0;
			var onStartCalled = false;

			var test = new BenchmarkTest({
				name: 'BenchmarkTest#constructor with benchmark options',
				test: (function () {
					function testFunction() {
						runCount++;
					}
					testFunction.options = {
						onStart: function () {
							onStartCalled = true;
						}
					};
					return testFunction;
				})()
			});

			// Ensure the test runner's timeout gets reset on each cycle
			test.benchmark.on('cycle', function () {
				this.restartTimeout();
			}.bind(this));

			return test.run().then(function () {
				assert.isAbove(runCount, 1, 'test should have run more than once');
				assert.isTrue(onStartCalled, 'Benchmark#onStart should have been called');
			});
		},

		'BenchmarkTest#skip': function () {
			var test1 = new BenchmarkTest({
				name: 'skip 1',
				test: BenchmarkTest.skip('foo', function () {})
			});
			var test2 = new BenchmarkTest({
				name: 'skip 2',
				test: BenchmarkTest.skip(function () {})
			});

			assert.strictEqual(test1.skipped, 'foo', 'skipped should be set to "foo" on test1');
			assert.strictEqual(test1.benchmark, undefined, 'benchmark should be set to undefined on test1');
			assert.strictEqual(test2.skipped, 'skipped', 'skipped should be set to "skipped" on test2');
			assert.strictEqual(test2.benchmark, undefined, 'benchmark should be set to undefined on test2');
		},

		'BenchmarkTest#toJSON': {
			'no error': function () {
				var test = new BenchmarkTest({
					name: 'no error',
					parent: {
						id: 'parent id',
						name: 'parent id',
						sessionId: 'abcd',
						timeout: 30000
					},
					test: function () {}
				});
				var expected = {
					error: null,
					id: 'parent id - no error',
					parentId: 'parent id',
					name: 'no error',
					sessionId: 'abcd',
					timeout: 30000,
					hasPassed: true,
					skipped: null
				};

				return test.run().then(function () {
					var testJson = test.toJSON();

					// Elapsed time is non-deterministic, so just force it to a value we can test
					assert.isAbove(testJson.timeElapsed, 0);

					// Check that a benchmark property exists and has values
					assert.property(test, 'benchmark');
					assert.isAbove(test.benchmark.hz, 0);

					// Delete the values we don't want deepEqual with the expected values
					delete testJson.timeElapsed;
					delete testJson.benchmark;

					assert.deepEqual(testJson, expected,
						'Test#toJSON should return expected JSON structure for test with no error');
				});
			},

			error: function () {
				var test = new BenchmarkTest({
					name: 'error',
					parent: {
						id: 'parent id',
						name: 'parent id',
						sessionId: 'abcd',
						timeout: 30000
					},
					test: function () {
						var error = new Error('fail');
						error.stack = 'stack';
						throw error;
					}
				});

				return test.run().then(
					function () {
						throw new Error('test should not have passed');
					},
					function () {
						var testJson = test.toJSON();

						// Check that a benchmark property exists and has values
						assert.deepEqual(testJson.error, { name: 'Error', message: 'fail', stack: 'stack' });
					}
				);
			}
		}
	});
});
