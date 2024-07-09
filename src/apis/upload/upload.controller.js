const UploadService = require('./upload.service');

class UploadController {
  constructor() {
    this.uploadService = new UploadService();
    this.uploadImage = this.uploadImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async uploadImage(req, res) {
    try {
      const image = req.file;
      const uploadResult = await this.uploadService.uploadImage(image);
      res.json(uploadResult);
    } catch (error) {
      res.status(error.status).json({ status: error.status, message: error.message });
    }
  }
  async deleteImage(req, res) {
    try {
      const { image } = req.query;
      const deleteResult = await this.uploadService.deleteImage(image);
      res.json(deleteResult);
    } catch (error) {
      res.status(error.status).json({ status: error.status, message: error.message });
    }
  }
}

module.exports = new UploadController();
