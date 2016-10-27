declare module 'istanbul' {
	export interface Config {
		loadFile: (file: string, overrides: { [key: string]: any }) => Configuration;
	}

	export interface ContentWriter {
	}

	export interface FileWriter {
	}

	export interface Hook {
		hookRequire: (matcher: Function, transformer: Function, options?: any) => void;
		unhookRequire: () => void;
		hookCreateScript: (matcher: Function, transformer: Function, options?: any) => void;
		unhookCreateScript: () => void;
		hookRunInThisContext: (matcher: Function, transformer: Function, options?: any) => void;
		unhookRunInThisContext: () => void;
		unloadRequireCache: (matcher: Function) => void;
	}

	export interface Report {
	}

	export interface Store {
	}

	export interface ObjectUtils {
	}

	export interface Writer {
	}

	export interface Watermarks {
		statements: number[];
		lines: number[];
		functions: number[];
		branches: number[];
	}

	// TODO: better define these types
	export interface FileCoverage {
		l: any;
		f: any;
		fnMap: any;
		s: any;
		statementMap: any;
		b: any;
		branchMap: any;
		code: string;
		path: string;
	}

	export class Collector {
		constructor(options?: any);
		add(coverage: any, testName?: string): void;
	}

	export class Configuration {
		file?: string;
		watermarks?: Watermarks;
		dir?: string;
	}

	export class Instrumenter {
		constructor(options?: any);
		instrumentSync(code: string, filename: string): string;
	}

	export class Reporter {
		constructor(cfg?: Configuration, dir?: string);
		add(fmt: string): void;
		addAll(fmts: Array<string>): void;
		write(collector: Collector, sync: boolean, callback: Function): void;
	}

	export const hook: Hook;

	export const utils: any;

	export const matcherFor: Promise<Function>;

	export const VERSION: string;
}

declare module 'istanbul/lib/util/writer' {
	import { EventEmitter } from 'events';

	export abstract class ContentWriter {
		abstract write(str: string): void;
		println(str: string): void;
	}

	export abstract class Writer extends EventEmitter {
		abstract writeFile(file: string, callback: Function): void;
		abstract copyFile(source: string, dest: string): void;
		abstract done(): void;
	}
}

declare module 'istanbul/lib/util/file-writer' {
	import { Writer } from 'istanbul/lib/util/writer';

	export default class FileWriter extends Writer {
		copyFile(source: string, dest: string): void;
		writeFile(file: string, callback: Function): void;
		done(): void;
	}
}

declare module 'istanbul/lib/collector' {
	export interface CollectorOptions {
		store: any; // MemoryStore
	}

	export class Collector {
		new (options?: CollectorOptions): Collector;
		add(coverage: Object): void;
		files(): string[];
		fileCoverageFor(fileName: string): Object;
		getFinalCoverage(): Object;
		dispose(): void;
	}
}

declare module 'istanbul/lib/report' {
	import { EventEmitter } from 'events';
	import { Collector, Configuration } from 'istanbul';
	export default class Report extends EventEmitter {
		static TYPE: string;
		static mix(cons: Object, proto: Object): void;
		static register(ctor: Function): void;
		static create(t: string, opts: Object): void;
		static loadAll(dir: string): void;
		synopsis(): void;
		getDefaultConfig(): Configuration;
		writeReport(collector: Collector, sync?: boolean): void;
	}
}

declare module 'istanbul/lib/report/common/defaults' {
	export const watermarks: () => { statements: number[], lines: number[], functions: number[], branches: number[] };
	export const classFor: (type: string, metrics: { [key: string]: any }, watermarks: { [key: string]: any }) => string;
	export const colorize: (str: string, clazz: string) => string;
	export const defaultReporterConfig: () => { [key: string]: string };
}

declare module 'istanbul/lib/report/cobertura' {
	import Report from 'istanbul/lib/report';
	import { Configuration, Collector } from 'istanbul';
	export class CoberturaReport extends Report {
		constructor(config?: any);
		projectRoot: string;
		dir?: string;
		file?: string;
		opts?: Configuration;
		writeReport(collector: Collector, sync?: boolean): void;
	}
}

declare module 'istanbul/lib/report/text' {
	// static TYPE: string;
	import Report from 'istanbul/lib/report';
	import { Watermarks } from 'istanbul';
	export class TextReport extends Report {
		constructor(opts?: any);
		dir: string;
		opts?: string;
		summary: any;
		maxCols: number;
		watermarks: Watermarks;
	}
}

declare module 'istanbul/lib/report/json' {
	import Report from 'istanbul/lib/report';

	export class JsonReport extends Report {
	}
}

declare module 'istanbul/lib/report/html' {
	import Report from 'istanbul/lib/report';
	import FileWriter from 'istanbul/lib/util/file-writer';
	import { Collector, FileCoverage } from 'istanbul';

	// LinkMapper API taken from the stnardLinkMapper in
	// istanbul/lib/report/html.js
	export interface LinkMapper {
		fromParent(node: Node): string;
		ancestorHref(node: Node, num: number): string;
		ancestor(node: Node, num: number): string;
		asset(node: Node, name: string): string;
	}

	export interface TemplateData {
		entity: string;
		metrics: any;
		reportClass: string;
		pathToHtml: any;
		prettify: { js: any, css: any };
	}

	export class HtmlReport extends Report {
		constructor(opts?: any);
		getPathHtml(node: Node, linkMapper: LinkMapper): string;
		fillTemplate(node: Node, templateData: TemplateData): void;
		writeDetailPage(writer: FileWriter, node: Node, fileCoverage: FileCoverage): void;
		writeIndexPage(writer: FileWriter, node: Node): void;
		writeFiles(writer: FileWriter, node: Node, dir: string, collector: Collector): void;
		standardLinkMapper(): LinkMapper;
	}
}

declare module 'istanbul/lib/report/lcovonly' {
	import Report from 'istanbul/lib/report';
	import FileWriter from 'istanbul/lib/util/file-writer';
	import { FileCoverage } from 'istanbul';

	export class LcovOnlyReport extends Report {
		constructor(opts?: any);
		writeFileCoverage(writer: FileWriter, fc: FileCoverage): void;
	}
}
