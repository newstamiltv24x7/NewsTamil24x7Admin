import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";
import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  Slide,
  TextField,
} from "@mui/material";
import { FaUpload } from "react-icons/fa6";
import { Label, Spinner } from "reactstrap";
import Image from "next/image";
import { IoTrash } from "react-icons/io5";
import ImageWebCropContainer from "./ImageWebCropContainer";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddWebStory(props) {
  const {
    open,
    close,
    title,
    handleUpload,
    imgArr,
    handleDescription,
    handleSubmit,
    handleDeleteImg,
    handleChange,
    inputs,
    imageLoader,
    setImageLoader,
    handleCancel,
    imgDesc,
    image,
    setImage,
    handleCheck,
    errors,
    handleBlur,
    setInputs,
  } = props;

  const uploadRef = React.useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [mainArr, setMainArr] = React.useState([]);

  const mergedArr = () => {
    const updatedPayload = imgArr?.map((list, index) => {
      imgDesc.forEach((item, subIndex) => {
        if (index === subIndex) {
          list.c_web_story_content = item.img_desc;
          list.image_url = list?.c_file_url;
        }
      });
      return list;
    });

    setMainArr(updatedPayload);
  };

  React.useEffect(() => {
    mergedArr();
  }, [imgDesc, imgArr]);

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="responsive-dialog-title"
        className="web-story-pop"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ bgcolor: "#fe6a49", color: "#fff" }}
        >
          {title}
          <IoMdCloseCircle
            style={{
              position: "absolute",
              right: "5%",
              top: "5%",
              fontSize: 30,
              cursor: "pointer",
            }}
            onClick={close}
          />
        </DialogTitle>
        <DialogContent>
          <Box pt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Title *"
                    variant="outlined"
                    type="text"
                    name="title"
                    size="small"
                    multiline
                    rows={2}
                    value={inputs?.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.title}
                    helperText={
                      errors?.title &&
                      "Title should contain more then 3 letters"
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Slug Title *"
                    variant="outlined"
                    type="text"
                    name="slug_name"
                    size="small"
                    multiline
                    value={inputs?.slug_name}
                    onChange={handleChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.slug_name}
                    helperText={
                      errors?.slug_name &&
                      "Title should contain more then 3 letters"
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <ImageWebCropContainer
                  imageLoader={imageLoader}
                  setImageLoader={setImageLoader}
                  inputs={inputs}
                  setInputs={setInputs}
                  image={image}
                  setImage={setImage}
                />
              </Grid>
            </Grid>
            <Box
              sx={
                imageLoader
                  ? {
                      placeItems: "center",
                      opacity: 0.3,
                      pointerEvents: "none",
                    }
                  : { placeItems: "center", cursor: "pointer" }
              }
              p={2}
              border={"2px dashed #000"}
              borderRadius={3}
              my={2}
              display={"grid"}
              onClick={() => uploadRef?.current?.click()}
            >
              <Box width={100} height={100}>
                <img
                  src={`https://img.freepik.com/free-vector/people-with-selected-folder-icon_53876-28556.jpg?t=st=1710582521~exp=1710586121~hmac=d87a0ab964ba70429fa4e4791f6ec0123cb47a6da3cbe4a0bd4f97319bb0ba09&w=826`}
                  alt=""
                  height={"100%"}
                  width={"100%"}
                />
              </Box>
              <Label>Click Here to Upload Images</Label>
              <input
                type="file"
                ref={uploadRef}
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "Arr")}
              />
            </Box>
            <Box>
              {mainArr &&
                mainArr?.map((list, index) => (
                  <Box
                    key={index}
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                    my={1}
                  >
                    <Image
                      src={list?.c_file_url}
                      alt=""
                      width={90}
                      height={90}
                      style={{ borderRadius: "8px" }}
                    />
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label={`Description ${index + 1} *`}
                      variant="outlined"
                      type="text"
                      name="img_desc"
                      size="small"
                      multiline
                      rows={3}
                      onChange={(e) => handleDescription(e, index)}
                      value={list?.c_web_story_content}
                      // error={errors?.includes("title")}
                      // helperText={
                      //   errors?.includes("title") && "Please enter title"
                      // }
                      sx={{
                        ".MuiFormHelperText-root": {
                          ml: 0,
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => handleDeleteImg(list, index)}
                      disabled={imageLoader}
                    >
                      <RiDeleteBin5Line
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </IconButton>
                  </Box>
                ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            {title === "Edit Web Story" && (
              <FormControlLabel
                control={<Checkbox />}
                onChange={handleCheck}
                checked={inputs?.n_status === 1}
                label="Status"
              />
            )}
          </Box>

          <Box>
            <Button
              color="primary"
              variant="outlined"
              disabled={imageLoader}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={imageLoader}
              color="primary"
              variant="contained"
              sx={{ color: "#fff", ml: 2 }}
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
