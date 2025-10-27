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

export default function AddPolls(props) {
  const {
    open,
    close,
    title,
    handleSubmit,
    handleChange,
    inputs,
    imageLoader,
    handleCancel,
    pollsArr,
    subErrors,
    addPollAnswer,
    handlePolls,
    handleDelete,
    handleCheck
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
      const script = document.createElement("script");
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
                    label="Poll Question *"
                    variant="outlined"
                    type="text"
                    name="c_poll_question"
                    size="small"
                    rows={1}
                    value={inputs?.c_poll_question}
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
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {pollsArr?.map((item, index) => (
                  <Box my={6}>
                    {/* <p style={{ color: "#fe6a49", fontWeight: "bold" }}>
                          Poll answer {index + 1}
                        </p> */}
                    <Grid spacing={2}>
                      <Grid item xs={12}>
                        <Box>
                          <TextField
                            id="outlined-basic"
                            label={`Answer`}
                            variant="outlined"
                            size="small"
                            multiline
                            rows={1}
                            fullWidth
                            name="poll_answer"
                            value={item?.poll_answer}
                            onChange={(e) => handlePolls(e, index)}
                            error={subErrors?.poll_answer}
                            helperText={
                              subErrors?.poll_answer &&
                              "Polls answer should contain more then 3 letters"
                            }
                            sx={{
                              ".MuiFormHelperText-root": {
                                ml: 0,
                              },
                            }}
                          />
                        </Box>

                        <Box
                          mt={1}
                          display={"flex"}
                          gap={2}
                          justifyContent={"space-between"}
                        >
                          <Box>
                            <Button
                              sx={{
                                color: "red",
                                fontSize: 12,
                                fontWeight: 550,
                                fontFamily: `"Montserrat", sans-serif`,
                              }}
                              onClick={() => handleDelete(index)}
                              disabled={pollsArr?.length === 1}
                            >
                              Remove Poll answer
                            </Button>
                          </Box>
                          <Box
                            sx={{
                              display:
                                pollsArr?.length === index + 1
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <Button variant="outlined" onClick={addPollAnswer}>
                              Add Poll answer
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            <FormControlLabel
              control={<Checkbox />}
              onChange={handleCheck}
              checked={inputs?.n_status === 1}
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
