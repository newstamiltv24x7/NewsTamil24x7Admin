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

export default function AddSeoCategoryPop(props: any) {
  const {
    open,
    close,
    title,
    handleUpload,
    handleDelete,
    handleSeoInputChange,
    input,
    handleBlur,
    handleSeoAddCategory,
    handleCheck,
    image,
    imageLoader,
    comCategory
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
        className="web-story-pop1"
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
                    fullWidth
                    id="outlined-   "
                    label="seo Page title"
                    variant="outlined"
                    type="text"
                    name="c_seo_category_title"
                    size="small"
                    multiline
                    rows={2}
                    onBlur={handleBlur}
                    value={input?.c_seo_category_title}
                    onChange={handleSeoInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
         
          <Box >
            <Button color="primary" variant="outlined" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={handleSeoAddCategory}
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
