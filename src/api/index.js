import axios from 'axios';

const getSchemaByVersion = async (params) => {
	const res = await fetch(
		'http://10.13.4.153:3001/api/lowcode/page/schema?' +
			new URLSearchParams(params)
	).then((res) => res.json());

	return Promise.resolve(res?.data);
};

export { getSchemaByVersion };
