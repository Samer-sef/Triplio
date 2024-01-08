const uploadHelper = require('../util/uploadHelper')
const s3util = require('../util/s3util')
const multer = require('multer');


function imageUploadHandler(req, res, next) {
    const upload = multer(
        {
            storage: s3util.s3Storage,
            fileFilter: (req, file, callback) => {
                uploadHelper.sanitizeFile(file, callback)
            },
            limits: {
                fileSize: 1024 * 1024 * 10 // 10mb max file size
            }
        }
    ).array('image', 6);

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('err', err)
            return res.status(400).json({ message: 'Upload error: ' + err.message })
        } else if (err) {
            console.log('err', err)
            return res.status(400).json({ message: 'Upload error: file type is not allowed' })
        }
        next()
    })
}


module.exports = imageUploadHandler