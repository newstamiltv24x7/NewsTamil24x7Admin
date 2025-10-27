import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import {
  Avatar,
  Box,
  Checkbox,
  DialogContent,
  FilledInput,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Slide,
  TextField,
} from "@mui/material";
import { FaUpload } from "react-icons/fa6";
import { Spinner } from "reactstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { MdVisibilityOff } from "react-icons/md";

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

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ManageUserPop(props: any) {
  const [view, setView] = React.useState(false);
  const {
    open,
    close,
    title,
    handleUpload,
    handleSubmit,
    imageLoader,
    image,
    inputs,
    handleDelete,
    menuList,
    handleInputChange,
    setInputs,
    handleCheck,
    errors
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
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    type="text"
                    name="first_name"
                    size="small"
                    value={inputs?.first_name}
                    onChange={handleInputChange}
                    error={errors?.includes("first_name")}
                    helperText={errors?.includes("first_name") && "Please enter first name"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  ></TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    name="last_name"
                    size="small"
                    value={inputs?.last_name}
                    onChange={handleInputChange}
                    error={errors?.includes("last_name")}
                    helperText={errors?.includes("last_name") && "Please enter last name"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  ></TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    type="text"
                    name="mail"
                    size="small"
                    value={inputs?.mail}
                    onChange={handleInputChange}
                    error={errors?.includes("mail")}
                    helperText={errors?.includes("mail") && "Please enter email"}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  ></TextField>
                </Grid>

                {/* <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Date of Birth"
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        ".MuiFormLabel-root": {
                          color: "rgba(0, 0, 0, 0.6)",
                        },
                        width: "100%",
                      }}
                      value={dayjs(inputs?.dob)}
                      maxDate={dayjs(new Date())}
                      onChange={(newvalue) =>
                        setInputs({
                          ...inputs,
                          dob: dayjs(newvalue).format("YYYY-MM-DD"),
                        })
                      }
                    />
                  </LocalizationProvider>
                </Grid> */}

                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Role"
                    variant="outlined"
                    type="text"
                    name="role_id"
                    size="small"
                    select
                    value={inputs?.role_id}
                    onChange={handleInputChange}
                    error={errors?.includes("role_id")}
                    helperText={errors?.includes("role_id") && "Please select role"}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    {menuList?.map((list: any) => (
                      <MenuItem value={list?.c_role_id} key={list?._id}>
                        {list?.c_role_name?.toUpperCase()}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    type={view ? 'text' : 'password'}
                    name="password"
                    size="small"
                    value={inputs?.password}
                    onChange={handleInputChange}
                    // error={errors?.includes("password")}
                    // helperText={errors?.includes("password") && "Please enter password"}
                    
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end"  sx={{ cursor: "pointer" }}>
                          {view ? <IoMdEyeOff onClick={() => setView(false)} /> : <IoMdEye onClick={() => setView(true)} />}
                        </InputAdornment>
                      ),
                    }}

                   
                    
                  ></TextField>

                 
                 
                </Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    fullWidth
                    id="outlined-basic"
                    label="About User"
                    variant="outlined"
                    type="text"
                    name="c_about_user"
                    size="medium"
                    multiline
                    rows={1.5}
                    value={inputs?.c_about_user}
                    onChange={handleInputChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  ></TextField>
                </Grid>

                <Grid item xs={6}>
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
                        {inputs?.profile}
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
                      Profile Image
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleUpload}
                        accept="image/*"
                      />
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
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
