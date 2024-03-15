import axios from "axios";

console.log('process.env', process.env);

const getSchemaByVersion = async (params) => {
	const res = await axios.get(`http://10.13.4.153:3001/api/lowcode/page/schema`, {
		params
	});
	return res.data.data
}

export {
	getSchemaByVersion,
}

