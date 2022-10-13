const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, image, callback) => {
        callback(null, 'images');

    },
    filename: (req, image, callback) => {

        const name = image.originalname.split(' ').join('_');

        const extension = MIME_TYPES[image.mimetype];
        callback(null, name + Date.now() + '.' + extension);

    }

});

module.exports = multer({ storage: storage }).single('image');