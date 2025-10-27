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
import TextEditor from "../StoryPage/TextEditor";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddTemplate(props) {
  const {
    open,
    close,
    title,
    inputs,
    handleChange,
    handleSubmit,
    editorState,
    handleEditorChange,
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
        className="web-story-pop2"
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
                    label="Name"
                    variant="outlined"
                    type="text"
                    name="name"
                    size="small"
                    value={inputs?.name}
                    onChange={handleChange}
                    multiline
                    rows={2}
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
                    label="Subject"
                    variant="outlined"
                    type="text"
                    name="subject"
                    size="small"
                    value={inputs?.subject}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextEditor
                    editorState={editorState}
                    handleEditorChange={handleEditorChange}
                    page="Template"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Type"
                    variant="outlined"
                    type="text"
                    name="type"
                    size="small"
                    value={inputs?.type}
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
                    label="Block"
                    variant="outlined"
                    type="text"
                    name="block"
                    size="small"
                    value={inputs?.block}
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
                    label="Minimum News Count"
                    variant="outlined"
                    type="text"
                    name="min"
                    size="small"
                    value={inputs?.min}
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
                    label="Maximum News Count"
                    variant="outlined"
                    type="text"
                    name="max"
                    size="small"
                    value={inputs?.max}
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
