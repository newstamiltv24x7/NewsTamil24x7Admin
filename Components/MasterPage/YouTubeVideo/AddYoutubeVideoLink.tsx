import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Slide,
  TextField,
} from "@mui/material";
import { FaUpload } from "react-icons/fa6";
import { Spinner } from "reactstrap";
import Image from "next/image";
import { IoTrash } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
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

export default function AddYoutubeVideoLink(props: any) {
  const {
    open,
    close,
    title,
    inputs,
    handleChange,
    handleAddSubmit,
    errors,
    handleUpload,
    image,
    DeleteImage,
    handleChecked,
  } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="responsive-dialog-title"
        className="youtubePop"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ bgcolor: "#ed1c24", color: "#fff" }}
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
        <>
          <Box px={2}>
            <Box my={2}>
              <TextField
                autoComplete="off"
                fullWidth
                id="outlined-basic"
                label="Youtube Title *"
                variant="outlined"
                type="text"
                name="title"
                size="small"
                multiline
                rows={2}
                value={inputs?.title}
                onChange={handleChange}
                error={errors?.includes("title")}
                helperText={errors?.includes("title") && "Please enter title"}
                sx={{
                  ".MuiFormHelperText-root": {
                    ml: 0,
                  },
                }}
              />
            </Box>

            <Box my={2}>
              <TextField
                autoComplete="off"
                fullWidth
                id="outlined-basic"
                label="Youtube Subject *"
                variant="outlined"
                type="text"
                name="subject"
                size="small"
                rows={2}
                value={inputs?.subject}
                onChange={handleChange}
                error={errors?.includes("subject")}
                helperText={
                  errors?.includes("subject") && "Please enter Subject"
                }
                sx={{
                  ".MuiFormHelperText-root": {
                    ml: 0,
                  },
                }}
              />
            </Box>
            <Box my={2}>
              <TextField
                autoComplete="off"
                fullWidth
                id="outlined-basic"
                label="Youtube Content *"
                variant="outlined"
                type="text"
                name="content"
                size="small"
                multiline
                rows={3}
                value={inputs?.content}
                onChange={handleChange}
                error={errors?.includes("content")}
                helperText={
                  errors?.includes("content") && "Please enter content"
                }
                sx={{
                  ".MuiFormHelperText-root": {
                    ml: 0,
                  },
                }}
              />
            </Box>
            <Box my={2}>
              <TextField
                autoComplete="off"
                fullWidth
                id="outlined-basic"
                label="Youtube URL *"
                variant="outlined"
                type="text"
                name="url"
                size="small"
                multiline
                rows={2}
                value={inputs?.url}
                onChange={handleChange}
                error={errors?.includes("url")}
                helperText={errors?.includes("url") && "Please enter url"}
                sx={{
                  ".MuiFormHelperText-root": {
                    ml: 0,
                  },
                }}
              />
            </Box>
            <Box my={2}>
              <TextField
                autoComplete="off"
                fullWidth
                id="outlined-basic"
                label="Youtube embed URL *"
                variant="outlined"
                type="text"
                name="embed_url"
                size="small"
                multiline
                rows={2}
                value={inputs?.embed_url}
                onChange={handleChange}
                error={errors?.includes("embed_url")}
                helperText={
                  errors?.includes("embed_url") && "Please enter embed url"
                }
                sx={{
                  ".MuiFormHelperText-root": {
                    ml: 0,
                  },
                }}
              />
            </Box>
            <Box>
              {image?.src ? (
                <Box
                  textAlign={"center"}
                  className="d-flex justify-content-flex-start align-items-center"
                  gap={5}
                >
                  <Image
                    src={image && image?.src}
                    alt=""
                    width={100}
                    height={100}
                    style={{
                      borderRadius: "14px",
                      boxShadow: "0px 0px 13px 0px rgba(0,0,0,0.75)",
                    }}
                  />
                  <Box className="d-flex justify-content-flex-start align-items-center">
                    <Box>
                      <p
                        style={{
                          overflow: "auto",
                          paddingInline: "12px",
                          maxWidth: "300px",
                          maxHeight: "70x",
                          display: "grid",
                          placeItems: "center",
                          marginBottom: 0,
                          wordBreak: "break-all",
                        }}
                      >
                        {image.name}
                      </p>
                    </Box>
                    <Box>
                      {image.loader ? (
                        <Spinner size={"sm"} />
                      ) : (
                        <IoTrash
                          onClick={DeleteImage}
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 2.5,
                      fontSize: "13px",
                      fontFamily: `"Montserrat", sans-serif`,
                      textTransform: "capitalize",
                    }}
                    startIcon={<FaUpload />}
                    endIcon={image?.loader && <Spinner size={"sm"} />}
                    disabled={image?.loader}
                  >
                    Upload Thumbnail Image
                    <VisuallyHiddenInput type="file" onChange={handleUpload} />
                  </Button>
                  {errors?.includes("image") && (
                    <p style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
                      please upload Image with less than 5mb
                    </p>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            <FormControlLabel
              sx={{ display: title === "Edit Link" ? "block" : "none" }}
              control={
                <Checkbox
                  onChange={(e: any) => handleChecked(e)}
                  value={inputs?.status}
                  checked={inputs?.status}
                />
              }
              label="Status"
              name="status"
            />
          </Box>
          <Box>
            <Button color="primary" variant="outlined" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              autoFocus
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
