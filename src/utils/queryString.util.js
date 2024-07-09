class QueryString {
	// Phương thức parse nhận một chuỗi truy vấn và trả về đối tượng JavaScript đại diện cho các tham số của URL
	static parse(queryStr) {
		const params = {};
		if (!queryStr) return params;

		const keyValuePairs = queryStr.substring(1).split('&');
		for (const pair of keyValuePairs) {
			const [key, value] = pair.split('=');
			const decodedKey = decodeURIComponent(key);
			const decodedValue = decodeURIComponent(value);
			if (params?.[decodedKey]) {
				if (!Array.isArray(params[decodedKey])) {
					params[decodedKey] = [params[decodedKey]];
				}
				params[decodedKey].push(decodedValue);
			} else {
				params[decodedKey] = decodedValue;
			}
		}

		return params;
	}

	// Phương thức stringify nhận một đối tượng và trả về chuỗi truy vấn
	static stringify(paramsObj) {
		if (!paramsObj || Object.keys(paramsObj).length === 0) return '';

		const keyValuePairs = [];
		for (const key in paramsObj) {
			if (paramsObj?.[key]) {
				const value = paramsObj[key];
				if (Array.isArray(value)) {
					for (const val of value) {
						keyValuePairs.push(
							encodeURIComponent(key) +
								'=' +
								encodeURIComponent(val)
						);
					}
				} else {
					keyValuePairs.push(
						encodeURIComponent(key) +
							'=' +
							encodeURIComponent(value)
					);
				}
			}
		}

		return '?' + keyValuePairs.join('&');
	}
}

//   // Ví dụ sử dụng:
//   const queryStr = '?name=John&age=30&city=New%20York';
//   const paramsObj = queryString.parse(queryStr);

//   const newParams = { name: 'Jane', age: '25', hobbies: ['Reading', 'Painting'] };
//   const newQueryStr = queryString.stringify(newParams);
module.exports = QueryString;
