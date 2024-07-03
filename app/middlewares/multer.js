const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed'), false)
        } else {
            cb(null, true)
        }
    }
})

module.exports = upload