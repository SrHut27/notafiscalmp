const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir =path.join(__dirname, "../../client/public/uploads/notascrip")

fs.mkdirSync(path.dirname(uploadsDir), { recursive: true });

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
}

const upload = multer({
    dest: uploadsDir
})

module.exports = upload;