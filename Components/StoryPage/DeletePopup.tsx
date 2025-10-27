import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeletePopup(props: any) {
  const { open, close, handleDeleteImage } = props;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={close}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ pl: 3 }}>Delete</DialogTitle>

        <DialogContent>
          <DialogContentText>
          Are You Sure? You Want To Delete This
          </DialogContentText>
        </DialogContent>




        <DialogActions>
          <Button onClick={close} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteImage}
            variant="contained"
            sx={{ color: "#fff" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
