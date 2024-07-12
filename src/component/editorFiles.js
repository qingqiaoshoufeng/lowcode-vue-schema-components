const css = [
	'https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light@0.2.1/variables.css',
	'https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light@0.2.1/dist/next.var.min.css',
	'https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.1.7/dist/css/engine-core.css',
	'https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@1.0.5/dist/css/engine-ext.css',
];

const js = [
	'https://g.alicdn.com/code/lib/react/16.13.1/umd/react.production.min.js',
	'https://g.alicdn.com/code/lib/react-dom/16.13.1/umd/react-dom.production.min.js',
	'https://g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js',
	'https://g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js',
	'https://g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js',
	'https://g.alicdn.com/code/lib/alifd__next/1.26.19/next.min.js',
	'https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.1.7/dist/js/engine-core.js',
	'http://10.13.4.153:9000/castle-www/lowcode-engine-ext/test/latest/js/engine-ext.js',
  'http://g.alicdn.com/code/npm/@ali/ant-design-icons-cdn/4.5.0/index.umd.min.js',
];

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  css.push('http://localhost:5558/css/editor.css')
  js.push('http://localhost:5558/js/editor.js')
} else {
  css.push('http://10.13.4.153:1108/css/editor.css')
  js.push('http://10.13.4.153:1108/js/editor.js')
}

export { css, js };