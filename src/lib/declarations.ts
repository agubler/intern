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
	export * from 'istanbul/lib/collector';
}

declare module 'dojo/node!istanbul/lib/report/cobertura' {
	export * from 'istanbul/lib/report/cobertura';
}

declare module 'dojo/node!istanbul/lib/report/json' {
	export * from 'istanbul/lib/report/json';
}

declare module 'dojo/node!istanbul/lib/report/html' {
	export * from 'istanbul/lib/report/html';
}

declare module 'dojo/node!istanbul/lib/report/text' {
	export * from 'istanbul/lib/report/text';
}

declare module 'dojo/node!istanbul/lib/report/lcovonly' {
	export * from 'istanbul/lib/report/lcovonly';
}

declare module 'dojo/has!host-node?dojo/node!istanbul/lib/collector' {
	export * from 'istanbul/lib/collector';
}

declare module 'dojo/has!host-node?dojo/node!istanbul/lib/report/text' {
	export * from 'istanbul/lib/report/text';
}
