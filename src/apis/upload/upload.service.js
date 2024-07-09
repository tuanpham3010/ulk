const UploadRepository = require('./upload.repository');

class UploadService {

    constructor() {
        this.uploadRepository = new UploadRepository();
    }

    async uploadImage(image) {
        const imageUrl = `images/${image.filename}`;
        return {
            success: true,
            image: image,
            imageUrl
        };
    }
    async deleteImage(image) {
        this.uploadRepository.deleteImage(image);
        return {
            success: true,
            image: image
        };
    }
}

module.exports = UploadService;