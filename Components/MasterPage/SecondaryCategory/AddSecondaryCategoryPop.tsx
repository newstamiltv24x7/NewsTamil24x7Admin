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

export default function AddSecondaryCategoryPop(props: any) {
  const {
    open,
    close,
    title,
    imageHeader,
    handleUpload,
    imageArr,
    handleDelete,
    handleInputChange,
    inputs,
    handleBlur,
    mainCategory,
    handleAdd,
    handleSelect,
    errors,
    handleCheck
    // image,
    // imageLoader,
  } = props;



  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const uploadRef = React.useRef<any>(null);

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ bgcolor: "#fe6a49", color: "#fff" }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="filled-select-currency"
                    select
                    label="Select Main Category"
                    defaultValue=""
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={inputs?.cat_id}
                    onChange={handleSelect}
                    error={errors?.includes("cat_id")}
                    helperText={
                      errors?.includes("cat_id") &&
                      "Please select main category"
                    }
                  >
                    {mainCategory?.map((option: any) => (
                      <MenuItem
                        key={option?.c_category_id}
                        value={option?.c_category_id}
                      >
                        {option?.c_category_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    type="text"
                    name="name"
                    size="small"
                    multiline
                    rows={2}
                    onBlur={handleBlur}
                    value={inputs?.name}
                    onChange={handleInputChange}
                    error={errors?.includes("name")}
                    helperText={
                      errors?.includes("name") && "Please enter sub category"
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
                  />
                </Grid>

                {/* <Grid item xs={6}>
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
                  </Box>
                </Grid> */}
              </Grid>
            </Box>
          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              onChange={handleCheck}
              checked={inputs?.status === 1}
              label="Status"
            />
          </Box>
          <Box>
            <Button color="primary" variant="outlined" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
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
