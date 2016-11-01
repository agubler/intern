define([ './selftest.intern' ], function (config) {
	config.tunnel = 'NullTunnel';
	config.environments = [ { browserName: 'chrome' } ];

	config.benchmarkConfig = {
		filename: 'tests/baselines.json',
		verbosity: 2
	};

	// Benchmark suites
	config.benchmarkSuites = [ 'tests/benchmark/all' ];

	return config;
});
