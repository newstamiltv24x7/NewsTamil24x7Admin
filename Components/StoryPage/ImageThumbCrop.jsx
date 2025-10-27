import { Box, Button, Dialog, Typography } from "@mui/material";
import "./css/ImageCropper.css";
// import CloseIcon from "@mui/icons-material/Close";
import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
// import { useEffect } from "react";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
}

function ImageThumbCrop(props) {
  const {
    imageCropper,
    setImageCropper,
    imageURL,
    croppedImage,
    setCroppedImage,
    setConvertedFile,
    setProfilePreview,
    setImgLoader,
  } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [rotation, setRotation] = useState(0);

  const handleDialogClose = () => {
    setImageCropper(false);
    // setCroppedImage(null);
    //   setConvertedFile(null);
    //   setProfilePreview({
    //     file: "",
    //     imagePreviewUrl: "",
    //   });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    setImgLoader(true);
    try {
      const croppedImage = await getCroppedImg(
        imageURL,
        croppedAreaPixels,
        rotation
      );
      let blob = await fetch(croppedImage).then((r) => r.blob());
      setImgLoader(false);
      setCroppedImage(croppedImage);
      setImageCropper(false);
      handleDialogClose();
    } catch (e) {
      setImgLoader(false);
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, imageURL]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  return (
    <>
      <Dialog
        open={imageCropper}
        className="imagecropper-container"
        onClose={handleDialogClose}
      >
        <div style={{ height: "100%" }}>
          <Box
            className="imagecropper"
            sx={{ height: "90%", overflow: "hidden" }}
          >
            <Cropper
              image={imageURL}
              crop={crop}
              zoom={zoom}
              // rotation={rotation}
              // aspect={4 / 2}
              aspect={1200 / 630}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              className="react-crop"
              classes="ssssss"
              // width="100%"
            />
          </Box>
          {/* {croppedImage && (
            <img
              className="cropped-image"
              src={croppedImage}
              alt="cropped"
              width={"200px"}
              height="150px"
            />
          )} */}
          <Box className="crop-btns">
            <Button
              variant="contained"
              className="crop-save"
              onClick={showCroppedImage}
            >
              Save
            </Button>
            <Button
              variant="contained"
              className="crop-cancel"
              onClick={handleDialogClose}
            >
              cancel
            </Button>
          </Box>
        </div>
      </Dialog>
    </>
  );
}

export default ImageThumbCrop;
