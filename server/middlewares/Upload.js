import fs from 'fs';
import path from 'path';
import multer from 'multer';
import slug from 'limax';
import configs from '../config';

const destRoomTypeUpload = path.resolve(__dirname, '../../' + configs.uploadPath + '/room_types');

const storageRoomTypePhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderRoomType = destRoomTypeUpload;
    if (!fs.existsSync(folderRoomType)) {
      // console.log('create folder');
      fs.mkdirSync(folderRoomType);
    }
    cb(null, folderRoomType);
  },
  filename: function (req, file, cb) {
    let lastDotIndex = file.originalname.lastIndexOf('.');
    const originalName = file.originalname.substring(0, lastDotIndex);
    const slugName = slug(originalName, {lowercase: true});
    const finalName = Date.now() + '-' + slugName + '.jpg';
    // console.log('file:', file);
    file.dataPath = `${configs.uploadPath}/room_types/${finalName}`;
    // path.extname(originalName)
    cb(null, finalName);
  }
});

export const uploadRoomTypePhoto = multer({storage: storageRoomTypePhoto});


const destRoomUpload = path.resolve(__dirname, '../../' + configs.uploadPath + '/rooms');

const storageRoomPhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(destRoomUpload)) {
      // console.log('create folder');
      fs.mkdirSync(destRoomUpload);
    }
    cb(null, destRoomUpload);
  },
  filename: function (req, file, cb) {
    let lastDotIndex = file.originalname.lastIndexOf('.');
    const originalName = file.originalname.substring(0, lastDotIndex);
    const slugName = slug(originalName, {lowercase: true});
    const finalName = Date.now() + '-' + slugName + '.jpg';
    // console.log('file:', file);
    file.dataPath = `${configs.uploadPath}/rooms/${finalName}`;
    // path.extname(originalName)
    cb(null, finalName);
  }
});

export const uploadRoomPhoto = multer({storage: storageRoomPhoto});
