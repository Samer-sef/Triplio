const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');


const config = {
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SERCRET_ACCESS_KEY
    }
}

const s3Storage = multerS3({
    s3: new S3Client(config),
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});


module.exports = {
    s3Storage,
}