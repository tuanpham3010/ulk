const fs = require('fs');
const path = require('path');

class UploadRepository {
	deleteImage(filename) {
		const imagePath = path.join('uploads', filename);
		// check file exist
		if (fs.existsSync(imagePath)) {
			// delete file
			fs.unlinkSync(imagePath);
		}
	}
}
module.exports = UploadRepository;
