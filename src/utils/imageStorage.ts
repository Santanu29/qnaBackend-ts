import { v4 as uuidv4 } from 'uuid';
import multer, { memoryStorage } from 'multer';
import { extname } from 'path';

export const storage = memoryStorage({
  destination: function (req, file, cb) {
    cb(null, '');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${uuidv4()}${extname(file.originalname.toLowerCase())}`);
  },
});

export const upload = multer({ storage: storage }).array('images');
