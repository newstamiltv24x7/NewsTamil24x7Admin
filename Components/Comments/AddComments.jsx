import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { IoMdCloseCircle } from "react-icons/io";
import {
  Box,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import JoditEditor from "jodit-react";


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

export default function AddComments(props) {
  const {
    open,
    close,
    title,
    handleSubmit,
    handleChange,
    inputs,
    imageLoader,
    handleCancel,
    handleChangeJodit
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));


  const editor = React.useRef(null);
  const config = React.useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
      },
    }),
    []
  );

  React.useEffect(() => {
    // Ensure Twitter widgets script runs to render tweets
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => window.twttr.widgets.load();
      document.body.appendChild(script);
    }
  }, [inputs?.card_embed_code]);


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
                    label="Card Title *"
                    variant="outlined"
                    type="text"
                    name="card_title"
                    size="small"
                    rows={1}
                    value={inputs?.card_title}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  {/* <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Card Embed Code *"
                    variant="outlined"
                    type="text"
                    name="card_embed_code"
                    size="small"
                    multiline
                    rows={4}
                    value={inputs?.card_embed_code}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  /> */}

            <JoditEditor
            ref={editor}
            value={inputs?.card_embed_code}
            config={config}
            // tabIndex={2} // tabIndex of textarea
            onBlur={(newContent) => handleChangeJodit(newContent)} // preferred to use only this option to update the content for performance reasons
            // onChange={(newContent) => {}}
          />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Card Url *"
                    variant="outlined"
                    type="text"
                    name="card_url"
                    size="small"
                    rows={1}
                    value={inputs?.card_url}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Box>
              </Grid>


              <Grid item xs={12}>
                <Box>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Card Type *"
                    variant="outlined"
                    type="text"
                    name="card_type"
                    size="small"
                    select
                    value={inputs?.card_type}
                    onChange={handleChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                     <MenuItem value="youtube">Youtube</MenuItem>
                      <MenuItem value="facebook">Facebook</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                      
                  </TextField>
                </Box>
              </Grid>





             
              
            </Grid>
           
          
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            <FormControlLabel
              control={<Checkbox />}
              // onChange={handleCheck}
              // checked={inputs?.status === 1}
              label="Status"
              
            />
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
