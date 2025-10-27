import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Autocomplete,
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

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddTagsPop(props: any) {
  const { open, close, title, handleChange, inputs, handleSubmit } = props;

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
        className="web-story-pop"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ bgcolor: "#fe6a49", color: "#fff" }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <Box pt={2}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Tag Name *"
                    variant="outlined"
                    type="text"
                    name="tag_name"
                    size="small"
                    value={inputs?.tag_name}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="State *"
                    variant="outlined"
                    type="text"
                    name="state"
                    size="small"
                    value={inputs?.state}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Redirect URL "
                    variant="outlined"
                    type="text"
                    name="url"
                    size="small"
                    value={inputs?.url}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            {/* <FormControlLabel
              control={<Checkbox />}
              // onChange={handleCheck}
              // checked={inputs?.status === 1}
              label="Status"
            /> */}
          </Box>
          <Box>
            <Button
              color="primary"
              variant="outlined"
              //   disabled={imageLoader}
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              //   disabled={imageLoader}
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
