define({
	proxyPort: 9000,
	proxyUrl: 'http://localhost:9000/',

	capabilities: {
		'selenium-version': '2.43.0',
		'idle-timeout': 30
	},
	environments: [
		{ browserName: 'internet explorer', version: '11.0', platform: 'Windows 10', fixSessionCapabilities: false },
		{ browserName: 'internet explorer', version: '10.0', platform: 'Windows 8', fixSessionCapabilities: false },
		{ browserName: 'internet explorer', version: '9.0', platform: 'Windows 7', fixSessionCapabilities: false },
		{ browserName: 'firefox', version: '33.0', platform: [ 'Windows 7', 'OS X 10.11' ], fixSessionCapabilities: false },
		{ browserName: 'chrome', version: '38.0', platform: [ 'Windows 7', 'OS X 10.11' ], fixSessionCapabilities: false },
		{ browserName: 'safari', version: '9.0', platform: 'OS X 10.11', fixSessionCapabilities: false }
	],

	maxConcurrency: 2,
	tunnel: 'SauceLabsTunnel',

	loaderOptions: {
		// Packages that should be registered with the loader in each testing environment
		packages: [
			{ name: 'intern-selftest', location: 'dist/' },
			{ name: 'tests', location: 'tests' },
			{ name: 'nm', location: 'node_modules' }
		],
		map: {
			'intern-selftest': {
				dojo: 'nm/dojo',
				chai: 'nm/chai/chai',
				diff: 'nm/diff/diff'
			},
			'tests': {
				dojo: 'nm/dojo',
				chai: 'nm/chai/chai',
				diff: 'nm/diff/diff'
			}
		}
	},

	suites: [
		'tests/unit/all'
	],
	functionalSuites: [
		'tests/functional/lib/ProxiedSession'
	],

	excludeInstrumentation: true, // /(?:tests|node_modules)\//,

	isSelfTestConfig: true
});
