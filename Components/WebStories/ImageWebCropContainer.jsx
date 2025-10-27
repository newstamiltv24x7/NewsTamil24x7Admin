import { Box, Button, Dialog, Typography } from "@mui/material";
import * as React from "react";
import ImageWebCrop from "./ImageWebCrop";
import { Label, Spinner } from "reactstrap";
import { imageDeleteApi, imageUploadApi } from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import { IoTrash } from "react-icons/io5";


function ImageWebCropContainer(props) {
  const {imageLoader,setImageLoader,inputs,setInputs,image, setImage} = props;




// crop function start

const uploadCoverRef = React.useRef(null);
const [convertedFile, setConvertedFile] = React.useState(null);
const [croppedImage, setCroppedImage] = React.useState(null);
const [imageCropper, setImageCropper] = React.useState(false);
const [imageCrop, setImageCrop] = React.useState({
  loader: false,
  name: "",
  src: "",
  width: "",
  height: "",
  type: "",
});
const [imageFile, setImageFile] = React.useState(null);
const [profilePreview, setProfilePreview] = React.useState({
  file: "",
  imagePreviewUrl: "",
});
const [addMemberInputs, setAddMemberInputs] = React.useState({
    c_image_url: "",
  });

const getExtension = (type) => {
  if (
    type !== "png" &&
    type !== "jpg" &&
    type !== "jpeg" &&
    type !== "webp"
  ) {
    return true;
  } else return false;
};

const handleUpload = async (e) => {
  setImageLoader(true);
  if (convertedFile !== null) {
    const formData = new FormData();
    formData.append("c_file", convertedFile);
    formData.append("file_type", "image");
    // formData.append("c_image_caption_name", inputs.image_caption);

    // const headers = {
    //   "Content-Type": "multipart/form-data",
    //   accept: "application/json",
    // };
    const headers = {
      'Content-Type': 'application/json'
    };

    let results = await imageUploadApi(formData, headers);

    if (results?.appStatusCode !== 0) {
      setImageLoader(false);
      toast.error(results?.error);
    } else {
      setImageLoader(false);

      setImage(results?.payloadJson?.c_file_url);
      setImageCrop({ ...imageCrop, name: results?.payloadJson?.c_file });
      setInputs({ ...inputs, cover_image: results?.payloadJson?.c_file , image_file: results?.payloadJson?.c_file });
    }
  }
};

const handleDelete = async (img) => {
  setImageLoader(true);
  const results = await imageDeleteApi({
    c_file: img,
  });
  if (results?.appStatusCode !== 0) {
    toast.error(results?.error);
    setImageLoader(false);
  } else {
    toast.success(results?.message);
    setImageLoader(false);
    setImage("");
    setInputs({ ...inputs, cover_image: "",image_file:"", n_status:1 });
   
    
  }
};


const handleSelectImage = (event) => {

  var file = event.target.files[0];
  var fileSize = file.size;
  var extension = getExtension(file.type.split("/").at(-1).toLowerCase());
  if (fileSize > 5000000) {
  } else if (extension) {
  } else {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1400; // Set your desired max width
          const maxHeight = 600; // Set your desired max height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              setProfilePreview({
                file: blob,
                imagePreviewUrl: reader.result,
              });
            },
            "image/jpeg",
            0.7
          );
        };
      };

      reader.readAsDataURL(file);
    }
  }
  event.target.value = "";
};

React.useEffect(() => {
  if (profilePreview.imagePreviewUrl !== "") {
    if (addMemberInputs.c_image_url == "") {
      setImageCropper(true);
    }
  }
}, [profilePreview]);

React.useEffect(() => {
  if (convertedFile) {
    handleUpload(imageFile);
  }
}, [convertedFile]);



React.useEffect(() => {
  if (croppedImage !== null) {
    async function convertBlobToBlobURL(croppedImage) {
      const response = await fetch(croppedImage);
      const blobData = await response.blob();
      return blobData;
    }

    async function blobToFile(blob, filename) {
      const blobData = await convertBlobToBlobURL(blob);
      const file = new File([blobData], filename, { type: blobData.type });
      return file;
    }

    const outputFileName = "converted_file.png";

    blobToFile(croppedImage, outputFileName)
      .then((file) => {
        setConvertedFile(file);
      })
      .catch((error) => {
        console.error("Error converting blob to file:", error);
      });
  }
}, [croppedImage]);


// crop function end


  return (
    <>
       <Box>
            <Label>Cover Image</Label>

            {imageLoader ? (
              <Box>
                <Spinner>Loading...</Spinner>
              </Box>
            ) : image ? (
              <Box>
                <Box width={"200px"} height={"300px"} pr={0} pb={0}>
                  <img
                    src={image}
                    alt=""
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  <Box width={"100%"}>
                    <Label className="textWrapper">{inputs?.cover_image}</Label>
                  </Box>
                  <Box>
                    <IoTrash
                      onClick={()=>handleDelete(inputs?.cover_image)}
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "2px dashed #cbcbcb",
                  cursor: "pointer",
                }}
                textAlign={"center"}
                p={5}
                onClick={() => uploadCoverRef?.current?.click()}
              >
                <p>upload cover image</p>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={uploadCoverRef}
                  onChange={(e) => handleSelectImage(e)}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                />
              </Box>
            )}
          </Box>

          <ImageWebCrop
        imageCropper={imageCropper}
        setImageCropper={setImageCropper}
        imageURL={profilePreview.imagePreviewUrl}
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        setConvertedFile={setConvertedFile}
        setProfilePreview={setProfilePreview}
        setImageLoader={setImageLoader}
      />
    </>
  );
}

export default ImageWebCropContainer;
