import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Spinner } from "reactstrap";
import { FaUpload } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AddMainCategoryPop(props: any) {
  const {
    open,
    close,
    title,
    handleUpload,
    handleDelete,
    handleInputChange,
    inputs,
    handleBlur,
    handleAddCategory,
    handleCheck,
    handleSplCheck,
    image,
    imageLoader,
    comCategory,
    errors,
  } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const uploadRef = React.useRef<any>(null);

 

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        keepMounted
        className="web-story-pop"
        aria-labelledby="responsive-dialog-title"
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
          <>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="filled-select-currency"
                    name="web_comp"
                    select
                    label="Select web Components"
                    defaultValue=""
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={inputs?.web_comp}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.includes("web_comp")}
                    helperText={
                      errors?.includes("web_comp") &&
                      "Please select web component"
                    }
                  >
                    {comCategory?.map((option: any) => (
                      <MenuItem
                        key={option?.c_web_component_category_id}
                        value={option?.c_web_component_category_id}
                      >
                        {option?.c_web_component_category_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Tamil Name"
                    variant="outlined"
                    type="text"
                    name="name"
                    size="small"
                    multiline
                    rows={2}
                    onBlur={handleBlur}
                    value={inputs?.name}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.includes("name")}
                    helperText={
                      errors?.includes("name") && "Please enter valid name"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="English Name"
                    variant="outlined"
                    name="eng_name"
                    size="small"
                    multiline
                    rows={2}
                    value={inputs?.eng_name}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.includes("eng_name")}
                    helperText={
                      errors?.includes("eng_name") && "Please enter valid name"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Meta Title"
                    variant="outlined"
                    type="text"
                    name="meta_name"
                    size="small"
                    multiline
                    rows={3}
                    value={inputs?.meta_name}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.includes("meta_name")}
                    helperText={
                      errors?.includes("meta_name") &&
                      "Please enter valid meta name"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Meta Description"
                    variant="outlined"
                    name="meta_desc"
                    size="small"
                    multiline
                    rows={3}
                    value={inputs?.meta_desc}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.includes("meta_desc")}
                    helperText={
                      errors?.includes("meta_desc") &&
                      "Please enter valid meta description"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Meta Keyword"
                    variant="outlined"
                    name="meta_keyword"
                    size="small"
                    multiline
                    rows={3}
                    value={inputs?.meta_keyword}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                    error={errors?.includes("meta_keyword")}
                    helperText={
                      errors?.includes("meta_keyword") &&
                      "Please enter valid meta keyword"
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box mt={"3%"}>
                    {image ? (
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Avatar
                          alt=""
                          src={image}
                          sx={{ width: "60px", height: "60px" }}
                        />
                        <p
                          style={{
                            marginBottom: 0,
                            width: "75%",
                            height: "24px",
                            overflow: "auto",
                            textOverflow: "ellipsis",
                            textAlign: "center",
                          }}
                        >
                          {inputs?.cover_image}
                        </p>
                        {imageLoader ? (
                          <Spinner size={"sm"} />
                        ) : (
                          <RiDeleteBin5Line
                            style={{
                              color: "red",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                            onClick={handleDelete}
                          />
                        )}
                      </Box>
                    ) : (
                      <Button
                        component="label"
                        variant="outlined"
                        fullWidth
                        sx={{ py: 2.5 }}
                        startIcon={<FaUpload />}
                        endIcon={imageLoader && <Spinner size={"sm"} />}
                        disabled={imageLoader}
                      >
                        Category Icon
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleUpload}
                          accept="image/*"
                        />
                      </Button>
                    )}

                    {/* {errors?.includes("image") && (
                      <p style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
                        please upload Image with less than 1mb
                      </p>
                    )} */}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            <FormControlLabel
              control={<Checkbox />}
              onChange={handleCheck}
              checked={inputs?.status === 1}
              label="Status"
            />
          </Box>
          <Box pl={2}>
          
            <FormControlLabel
              control={<Checkbox />}
              onChange={handleSplCheck}
              checked={inputs?.spl_cat === 1}
              label="Special Category"
            />
          </Box>
          <Box>
            <Button color="primary" variant="outlined" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              autoFocus
              color="primary"
              variant="contained"
              sx={{ color: "#fff", ml: 2 }}
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
