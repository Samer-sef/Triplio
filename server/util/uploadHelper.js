const path = require('path'); 


//TODO:: use a library to check for these things.
const sanitizeFile = (file, cb) => {
    const fileExts = [".png", ".jpg", ".jpeg", ".gif", ".heic"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    if (isAllowedExt) {
        return cb(null, true);
    } else {
        cb("Error: File type is not allowed!");
    }
}


module.exports = {
    sanitizeFile,
}