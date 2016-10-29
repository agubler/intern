declare module 'dojo/node!path' {
	export * from 'path';
}

declare module 'dojo/node!url' {
	export * from 'url';
}

declare module 'dojo/node!fs' {
	export * from 'fs';
}

declare module 'dojo/node!http' {
	export * from 'http';
}

declare module 'dojo/node!net' {
	export * from 'net';
}

declare module 'dojo/node!mimetype' {
	export function lookup(input: string): (string|false);
}

declare module 'dojo/node!util' {
	export * from 'util';
}

declare module 'dojo/node!charm' {
	import * as charm from 'charm';
	export = charm;
}

declare module 'dojo/node!charm/lib/encode' {
	import * as encode from 'charm/lib/encode';
	export = encode;
}

declare module 'dojo/node!istanbul' {
	export * from 'istanbul';
}

declare module 'dojo/node!istanbul/lib/collector' {
	import Collector = require('istanbul/lib/collector');
	export = Collector;
}

declare module 'dojo/node!istanbul/lib/report' {
	import Report = require('istanbul/lib/report');
	export = Report;
}

declare module 'dojo/node!istanbul/lib/report/cobertura' {
	import CoberturaReport = require('istanbul/lib/report/cobertura');
	export = CoberturaReport;
}

declare module 'dojo/node!istanbul/lib/report/json' {
	import JsonReport = require('istanbul/lib/report/json');
	export = JsonReport;
}

declare module 'dojo/node!istanbul/lib/report/html' {
	import HtmlReport = require('istanbul/lib/report/html');
	export = HtmlReport;
}

declare module 'dojo/node!istanbul/lib/report/text' {
	import TextReport = require('istanbul/lib/report/text');
	export = TextReport;
}

declare module 'dojo/node!istanbul/lib/report/text-summary' {
	import TextSummaryReport = require('istanbul/lib/report/text-summary');
	export = TextSummaryReport;
}

declare module 'dojo/node!istanbul/lib/report/lcovonly' {
	import LcovOnlyReport from 'istanbul/lib/report/lcovonly';
	export = LcovOnlyReport;
}

declare module 'dojo/has!host-node?dojo/node!istanbul/lib/collector' {
	import Collector = require('istanbul/lib/collector');
	export = Collector;
}

declare module 'dojo/has!host-node?dojo/node!istanbul/lib/report/text' {
	import TextReport = require('istanbul/lib/report/text');
	export = TextReport;
}

declare module 'dojo/has!host-node?dojo/node!istanbul/lib/report/text-summary' {
	import TextSummaryReport = require('istanbul/lib/report/text-summary');
	export = TextSummaryReport;
}
