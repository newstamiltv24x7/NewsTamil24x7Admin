import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  withStyles,
} from "@mui/material";
import React from "react";
import { IoClose } from "react-icons/io5";

const styles = {
  appBar: {
    position: "relative",
  },
  flex: {
    flex: 1,
  },
  imgContainer: {
    position: "relative",
    flex: 1,
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ImgDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Dialog
        fullScreen
        open={!!this.props.img}
        onClose={this.props.onClose}
        TransitionComponent={Transition}
      >
        <div>
          <AppBar>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.props.onClose}
                aria-label="Close"
              >
                <IoClose />
              </IconButton>
              <Typography variant="title" color="inherit">
                Cropped image
              </Typography>
            </Toolbar>
          </AppBar>
          <div>
            <img src={this.props.img} alt="Cropped" />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ImgDialog;
