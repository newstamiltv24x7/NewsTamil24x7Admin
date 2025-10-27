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
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import { FaUpload } from "react-icons/fa6";
import { Label, Spinner } from "reactstrap";
import Image from "next/image";
import { IoTrash } from "react-icons/io5";
import JoditTextEditer from "../StoryPage/JoditTextEditer";

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddStaticPagePop(props: any) {
  const {
    open,
    close,
    title,
    inputs,
    handleChange,
    handleSubmit,
    handleChangeJodit,
    joditContent,
    menuList
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
                    disabled ={title ==="Edit Static Page" ? true :false}
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    // label="Page Name"
                    variant="outlined"
                    type="text"
                    name="page_id"
                    size="small"
                    select
                    value={inputs?.page_id}
                    onChange={handleChange}
                    SelectProps={{
                      native: true,
                    }}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    <option value={""} >
                  Select Page
                </option>
                {menuList?.map((list: any) => {
                  return (
                    <option key={list._id} value={list?.c_static_menu_page_id}>
                      {list?.c_static_menu_page_name}
                    </option>
                  );
                })}


                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="Page Meta Title"
                    variant="outlined"
                    type="text"
                    name="title"
                    size="small"
                    value={inputs?.title}
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
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="Page Meta Description"
                    variant="outlined"
                    type="text"
                    name="description"
                    size="small"
                    multiline
                    rows={3}
                    value={inputs?.description}
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
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="Page Meta Keywords"
                    variant="outlined"
                    type="text"
                    name="keywords"
                    size="small"
                    multiline
                    rows={3}
                    value={inputs?.keywords}
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

                <Grid item xs={12}>
                  <JoditTextEditer
                    handleChangeJodit={handleChangeJodit}
                    content={joditContent}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
         
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
