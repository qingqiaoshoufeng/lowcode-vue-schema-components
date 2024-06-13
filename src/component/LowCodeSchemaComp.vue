<template>
	<div class="lowcode-wrap">
		<Suspense>
			<template #default>
				<div :class="{'vue-renderer-wrap': isDev }">
					<spin :spinning="loading">
						<VueRenderer
							class="lowcode-plugin-sample-preview-content"
							:schema="data.schema"
							:components="data.components"
							:appHelper="mergedAppHelper"
							:requestHandlersMap="requestHandlersMap"
              v-bind="othersProps"
						/>
					</spin>
					<button
						v-if="isDev"
						class="edit-page ant-btn ant-btn-primary"
						@click="openEdit"
					>
						编辑页面
					</button>
					<modal
						v-model:visible="visible"
						title="编辑页面"
						width="100%"
						wrap-class-name="full-modal"
						:footer="null"
						:destroyOnClose="true"
					>
						<div id="lce-container">
							<div style="margin-top: 40vh; text-align: center;"><spin /></div>
						</div>
					</modal>
				</div>
			</template>

			<template #fallback>
				<div class="lowcode-plugin-sample-preview-loading">
					<spin />
				</div>
			</template>
		</Suspense>
	</div>
</template>

<script setup>
import VueRenderer from '@knxcloud/lowcode-vue-renderer';
import { buildComponents, AssetLoader, noop } from '@knxcloud/lowcode-utils';
import { toRaw, Suspense, reactive, ref, watch, inject, computed } from 'vue';
import { getSchemaByVersion } from '../api';
import { Spin, Modal } from '@castle/ant-design-vue';
import { loadScript, unloadScript, loadStyle } from '../utils/load-script.js';
import { createAxiosFetchHandler } from '../utils/request';
import { merge } from 'lodash-es'
import './style.css';

window['__VUE_HMR_RUNTIME__'] = {
	reload: noop,
	rerender: noop,
	createRecord: noop,
};

const { isDev, appHelper, fetchHandler, ...othersProps } = inject('$options');

const props = defineProps({
	// 公网外部参数
	packages: [],
	projectSchema: {},
	pageSchema: {},
	appHelper: undefined,
	fetchHandler: undefined,

	// Castle内部参数
	pageName: '',
	version: '',
	pageId: '',
});

const mergedAppHelper = computed(() => merge((appHelper || {}), (props.appHelper || {})));

// 处理自定义请求
let requestHandlersMap;
if (props.fetchHandler) {
  requestHandlersMap = { fetch: createAxiosFetchHandler(props.fetchHandler) };
}
if (fetchHandler) requestHandlersMap = { fetch: createAxiosFetchHandler(fetchHandler) };

const data = reactive({
	schema: {},
	components: {},
});

const loading = ref(false);
const init = async () => {
	loading.value = true;
	let packages, pageSchema;
	if (props.pageId && props.version) {
		const res = await getSchemaByVersion({
			pageId: props.pageId,
			version: props.version,
		});
		packages = res.packages;
		pageSchema = res.pageSchema;
	} else {
		packages = props.packages;
		pageSchema = props.pageSchema;
	}

	const { componentsMap: componentsMapArray = [], componentsTree = [] } = pageSchema;

	const componentsMap = {};
	componentsMapArray.forEach((component) => {
		componentsMap[component.componentName] = component;
	});

	const libraryMap = {};
	const libraryAsset = [];
	packages.forEach(({ package: _package, library, urls, renderUrls }) => {
		libraryMap[_package] = library;
		if (renderUrls) {
			libraryAsset.push(renderUrls);
		} else if (urls) {
			libraryAsset.push(urls);
		}
	});

	await new AssetLoader().load(libraryAsset);
	const components = await buildComponents(libraryMap, componentsMap);
	loading.value = false;
	return { schema: componentsTree[0], components };
};

const handleRenderData = async () => {
	const { schema, components } = await init();
	data.schema = toRaw(schema);
	data.components = toRaw(components);
};

handleRenderData();

const visible = ref(false);
watch(
	() => visible.value,
	(val) => {
		if (val === false) {
			handleRenderData();
		}
	}
);
const openEdit = async () => {
	visible.value = true;
	await loadStyle('http://10.13.4.153:1108/css/editor.css');
	await loadStyle(
		'https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light@0.2.1/variables.css'
	);
	await loadStyle(
		'https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light@0.2.1/dist/next.var.min.css'
	);
	await loadStyle(
		'https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.1.7/dist/css/engine-core.css'
	);
	await loadStyle(
		'https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@1.0.5/dist/css/engine-ext.css'
	);

	await loadScript(
		'https://g.alicdn.com/code/lib/react/16.13.1/umd/react.production.min.js'
	);
	await loadScript(
		'https://g.alicdn.com/code/lib/react-dom/16.13.1/umd/react-dom.production.min.js'
	);
	await loadScript('https://g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js');
	await loadScript('https://g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js');
	await loadScript('https://g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js');
	await loadScript('https://g.alicdn.com/code/lib/alifd__next/1.26.19/next.min.js');
	await loadScript(
		'https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.1.7/dist/js/engine-core.js'
	);
	await loadScript(
		'http://10.13.4.153:9000/castle-www/lowcode-engine-ext/test/latest/js/engine-ext.js'
	);
	await loadScript('http://10.13.4.153:1108/js/editor.js');

	// 触发editorInit插件
	const editorInitPlugins = window.AliLowCodeEngine.plugins.get('editorInit');
	editorInitPlugins[Object.getOwnPropertySymbols(editorInitPlugins)[0]].config.init({
		pageId: props.pageId,
	});

	// 触发editorInit插件
	const savePagePlugins = window.AliLowCodeEngine.plugins.get('saveSample');
	savePagePlugins[Object.getOwnPropertySymbols(savePagePlugins)[0]].config.init({
		pageId: props.pageId,
	});

	window.$lowCode.init({ appHelper, fetchHandler });
};
</script>

<script>
export default {
	name: 'LowCodePreview',
	components: {
		Suspense,
		VueRenderer,
	},
};
</script>

<style scoped>
.lowcode-wrap {
	position: relative;
}
.lowcode-wrap .lowcode-plugin-sample-preview-loading {
	text-align: center;
	padding: 100px 0;
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
}
</style>
