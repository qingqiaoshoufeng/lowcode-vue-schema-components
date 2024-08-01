// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createApp } from 'vue';
import App from './App.vue';
// import LowCodeRender from '../dist/lib/index.js'
import LowCodeRender from '../src/index.js';
// import axios from 'axios';
import test from './components/textComponent.vue'
import Antd, { message, notification } from '@castle/ant-design-vue';
import '@castle/ant-design-vue/dist/antd.css';
import ComponentsTemplate from "@castle/business-components";
import "@castle/business-components/dist/style.css";
import * as Icons from "@ant-design/icons-vue";

const icons = Icons;



axios.defaults.headers.common['Authorization'] = 'Bearer YOUR_TOKEN_HERE';

axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    const { code, data: resData, message, msg } = data;
    return resData?.data || resData
  },
  (error) => {
    return Promise.reject(error);
  },
)



const app = createApp(App);
for (const i in icons) {
  app.component(i, icons[i]);
}
app.use(Antd)
app.component('Message', message)
app.component('Notification', notification)
app.use(ComponentsTemplate);
// app.component('ProCard', test)

app.use(LowCodeRender, {
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
      componentName: 'ProCard',
      props: [
        {
          name: 'title',
          propType: 'string',
          description: '标题',
          defaultValue: '卡片标题',
        },
        {
          name:'customTab',
          title:{label:'自定义tab',tip:'自定义 tabList tab 标签'},
          propType:'node',
          initialValue: {
            type: 'JSSlot',
            params: ['data'],
            value: [],
          },
        },
      ],
      configure:{
        component: { isContainer: true },
      },
      snippets: [
        {
          title: 'ProCard',
          screenshot: 'http://10.13.4.153:9000/lowcode-resource/lowcode-cdn/affix-1.jpg',
          schema: {
            componentName: 'ProCard',
          },
        },
      ],
    },
  ],
});
window.LowcodeMaterialAntVue = window.CASTLE_LowCode_LocalComponents = app._context.components

app.mount('#app');

console.log(app._context.components)

