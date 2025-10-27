import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

// import { getOrientation } from "get-orientation/browser";
import ImgDialog from "./ImgDialog";
import { getCroppedImg } from "./canvasUtils";
import { Box, Button } from "@mui/material";
import { setCroppedImageSource } from "@/Redux/Reducers/CroppedImageSlice";
import { useDispatch } from "react-redux";

const InlineStyles = {
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 400,
    background: "#333",
  },
  controls: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  sliderContainer: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
};

const StyledDemo = ({
  imageSource,
  width,
  height,
  closeFunction,
  setImageFlag,
  fileName,
  setRealCrop,
}) => {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const dispatch = useDispatch();

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      
    } catch (e) {
      console.error(e);
    }
  };

  const onClose = () => {
    setCroppedImage(null);
  };

  useEffect(() => {
    setImageSrc(imageSource);
  }, [imageSource]);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      const file = new File([croppedImage], fileName, { type: "image/jpeg" });
      setRealCrop(croppedImage)
      // dispatch(setCroppedImageSource(file));
      setImageFlag(true);
      closeFunction();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* {imageSrc ? ( */}
      <React.Fragment>
        <div style={InlineStyles.cropContainer}>
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={Number(width) / Number(height)}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <Box my={2} textAlign={"center"}>
          <Button onClick={showCroppedImage} variant="outlined" color="primary">
            Show Result
          </Button>
          <Button
            variant="contained"
            sx={{ color: "#fff", ml: 5 }}
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
        <ImgDialog img={croppedImage} onClose={onClose} />
      </React.Fragment>
    </div>
  );
};

export default StyledDemo;
