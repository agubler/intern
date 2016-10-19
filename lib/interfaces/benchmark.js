define([
	'./object',
	'../BenchmarkTest'
], function (registerSuite, BenchmarkTest) {
	function benchmark(mainDescriptor) {
		registerSuite(mainDescriptor, BenchmarkTest);
	}

	benchmark.async = BenchmarkTest.async;
	benchmark.skip = BenchmarkTest.skip;

	return benchmark;
});
