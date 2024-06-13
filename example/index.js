// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createApp } from 'vue';
import App from './App.vue';
// import LowCodePreview from '../dist/lib/index.js'
import LowCodePreview from '../src/index.js';
import axios from 'axios';
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
});
app.mount('#app');
