const cssFiles = [
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/variables.css',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/next.var.min.css',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/engine-core.css',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/engine-ext.css',
];

const jsFiles = [
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/react.production.min.js',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/react-dom.production.min.js',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/prop-types.js',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/lodash.min.js',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/moment.min.js',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/next.min.js',
	'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/engine-core.js',
	'http://10.13.4.153:9000/castle-www/lowcode-engine-ext/test/latest/js/engine-ext.js',
  'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/index.umd.min.js',
];

const isDev = process.env.IS_DEV === 'true';
const editorCss = [isDev ? 'http://localhost:5558/css/editor.css' : 'http://10.13.4.153:1108/css/editor.css']
const editorJs = [isDev ? 'http://localhost:5558/js/editor.js' : 'http://10.13.4.153:1108/js/editor.js']

const css = cssFiles.concat(editorCss)
const js = jsFiles.concat(editorJs)
export { css, js };