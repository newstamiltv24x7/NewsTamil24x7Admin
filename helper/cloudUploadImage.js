var cloudinary = require("cloudinary").v2;
// import { v2 as cloudinary } from "cloudinary";



cloudinary.config({
    cloud_name: "dqvry8qoa",
    api_key: "738899554512623",
    api_secret: "wdERhftLx1wYbnHJ_ZG9rX1PtLc", 
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

const uploadImage = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        
        return resolve(result.secure_url);
      }
      
      return reject({ message: error.message });
    });
  });
};
module.exports.singleImage = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        
        return resolve(result.secure_url);
      }
      
      return reject({ message: error.message });
    });
  });
};

module.exports.uploadMultipleImages = (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};
