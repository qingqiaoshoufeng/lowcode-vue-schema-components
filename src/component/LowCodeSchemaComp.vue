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
import { loadScript, unloadScript, loadStyle, unloadStyle, removeDuplicateScriptTags } from '../utils/load-script.js';
import { createAxiosFetchHandler } from '../utils/request';
import { merge } from 'lodash-es'
import './style.css';
import { css, js } from './editorFiles'

window['__VUE_HMR_RUNTIME__'] = {
	reload: noop,
	rerender: noop,
	createRecord: noop,
};

const { isDev, appHelper, fetchHandler, localComponents, ...othersProps } = inject('$options');

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
      closeEdit()
		}
	}
);

const closeEdit = async () => {
  await Promise.all(css.map(c => unloadStyle(c)))
  await Promise.all(js.map(j => unloadScript(j)))
  removeDuplicateScriptTags();
  handleRenderData();
}
const openEdit = async () => {
	visible.value = true;
  await Promise.all(css.map(c => loadStyle(c)))
  for (const j of js) {
    await loadScript(j)
  }

	// 触发editorInit插件
	const editorInitPlugins = window.AliLowCodeEngine.plugins.get('editorInit');
	editorInitPlugins[Object.getOwnPropertySymbols(editorInitPlugins)[0]].config.init({
		pageId: props.pageId,
    components: localComponents
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
