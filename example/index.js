// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createApp } from 'vue';
import App from './App.vue';
// import LowCodePreview from '../dist/lib/index.js'
import LowCodePreview from '../src/index.js';
import axios from 'axios';
import test from './components/textComponent.vue'
axios.defaults.headers.common['Authorization'] = 'Bearer YOUR_TOKEN_HERE';

axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    const { code, data: resData, message, msg } = data;
    return resData;
  },
  (error) => {
    return Promise.reject(error);
  },
)



const app = createApp(App);

app.component('ProCard', test)

app.use(LowCodePreview, {
	isDev: true,
	appHelper: {
		utils: {
			test: () => {
				console.log('test');
			},
		},
	},
	fetchHandler: axios,
  localComponents: [
    {
      group: '本地组件',
      title: 'ProCard',
      componentName: 'ProCard',
      docUrl: '',
      npm: {
        package: 'CASTLE_LowCode_LocalComponents',
        version: '1.0.0',
        destructuring: true,
        componentName: 'ProCard',
      },
      props: [
        {
          name: 'title',
          propType: 'string',
          description: '标题',
          defaultValue: '卡片标题',
        },
      ],
      snippets: [
        {
          title: 'ProCard',
          screenshot: 'https://alifd.alicdn.com/fusion-cool/icons/icon-antd/affix-1.jpg',
          schema: {
            componentName: 'ProCard',
          },
        },
      ],
    },
  ],
});
app.mount('#app');

console.log(app._context.components)

window.CASTLE_LowCode_LocalComponents = app._context.components