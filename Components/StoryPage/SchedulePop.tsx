import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { Box, Grid } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SchedulePop(props: any) {
  const { open, close, scheduleTime, handleAddStory, setScheduleTime } = props;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={close}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ pl: 4 }}>Select Schedule Time</DialogTitle>
        <Box p={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Start Date"
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
                  value={dayjs(scheduleTime?.date)}
                  minDate={dayjs(new Date())}
                  onChange={(newvalue) =>
                    setScheduleTime({
                      ...scheduleTime,
                      date: dayjs(newvalue).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  defaultValue={dayjs(new Date())}
                  label="Start Time"
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
                  value={dayjs(scheduleTime?.time)}
                  onAccept={(newValue) =>
                    setScheduleTime({
                      ...scheduleTime,
                      time: dayjs(newValue).format("h:mm:ss A"),
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
        <DialogActions>
          <Button onClick={close} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddStory}
            variant="contained"
            sx={{ color: "#fff" }}
            disabled={scheduleTime?.date === "" || scheduleTime?.time === ""}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
