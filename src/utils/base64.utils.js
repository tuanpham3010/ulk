class Base64Utils {
	static base64Reverse = (encodedString) => {
		try {
			// Kiểm tra xem encodedString có phải là một chuỗi hợp lệ không
			if (typeof encodedString !== 'string') {
				throw new Error('Input must be a valid string');
			}

			// Sử dụng hàm built-in Buffer của Node.js để giải mã Base64
			const decodedString = Buffer.from(encodedString, 'base64').toString(
				'utf-8'
			);
			return JSON.parse(decodedString);
		} catch (error) {
			// Bắt các ngoại lệ xảy ra trong quá trình giải mã
			console.error('Error while decoding Base64:', error.message);
			return null;
		}
	};
}

module.exports = Base64Utils;
