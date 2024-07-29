const getSchemaByVersion = async (params, baseUrl = '/') => {
  const isProd = process.env.NODE_ENV === 'production';
  const url = isProd ? `${baseUrl}lowcode/${params.pageId}.json` : `http://10.13.4.153:3001/api/lowcode/page/schema?${new URLSearchParams(params)}`;
	const res = await fetch(url).then((res) => res.json());

	return Promise.resolve(isProd ? res : res?.data);
};

export { getSchemaByVersion };
