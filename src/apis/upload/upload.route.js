const express = require('express');
const uploadController = require('./upload.controller');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // if (!fs.existsSync('uploads')) {
        //     fs.mkdirSync(`uploads`, { recursive: true });
        // }
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const fileSplit = file.originalname
            .replace(new RegExp('&', 'g'), '')
            .split('.');
        const fileName =
            fileSplit.splice(0, fileSplit.length - 1) +
            '-' +
            Date.now() +
            '.' +
            fileSplit[fileSplit.length - 1];
        cb(null, fileName);
    },
});
const upload = multer({ storage }).single('image');
const uploadRouter = express.Router();
uploadRouter.use('/images', express.static(path.join('uploads')));
uploadRouter.post('/image', upload, uploadController.uploadImage);
uploadRouter.delete('/image', uploadController.deleteImage);

module.exports = uploadRouter;