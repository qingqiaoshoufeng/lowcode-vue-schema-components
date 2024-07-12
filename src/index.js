import LowCodeRender from './component/LowCodeSchemaComp.vue';
import * as vue from 'vue/dist/vue.cjs'
import VueRenderer from '@knxcloud/lowcode-vue-renderer';
import Icons from './component/icons'

const install = (App, options = {}) => {
  App.provide('$options', options)
	if (typeof window !== 'undefined' && !window.Vue) {
		window.Vue = vue
	}
	window.LCVueRenderer = VueRenderer;
	App.component(LowCodeRender.name, LowCodeRender);
  App.component('AIcon', Icons)
}

// let windowObj = window;
// /* 支持使用标签的方式引入 */
// if (typeof windowObj !== 'undefined' && windowObj.Vue) {
// 	const vm = windowObj.Vue.createApp({});
// 	install(vm);
// }

export default install;
