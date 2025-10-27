"use client"
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Sample from "@/public/assets/images/avatar.png";
import Image from "next/image";
import { MdAddCircle } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";

export default function GalleryPop(props) {
  const { open, close, mediaImg, handleAddImage, DeleteImageGallery,lastElementRef,hasMore,mediaImgCount,setHasMore } = props;




  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  React.useEffect(() => {
    if(mediaImg.length === mediaImgCount){
      setHasMore(false);
    }
  }, [])
  

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="gallery-pop-images"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select Image From Gallery"}
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
          <DialogContentText id="alert-dialog-description">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="All Images" value="1" />
                  </TabList>
                </Box>
                <TabPanel value="1" sx={{ py: 3, px: 0 }}>
                  <Box display={"flex"} gap={2} flexWrap={"wrap"}>
                    {Array.isArray(mediaImg) &&
                      mediaImg.map((list, index) => (
                        <>
                          <Box
                            key={index}
                            width={250}
                            height={150}
                            className="gallery-images"
                            position={"relative"}
                          >
                            <Image
                              alt=""
                              src={list?.c_file_url}
                              width={100}
                              height={100}
                              unoptimized
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 10,
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            >
                              <Button
                                startIcon={
                                  <MdAddCircle
                                    color="black"
                                    style={{ fontSize: 25 }}
                                    onClick={() => handleAddImage(list)}
                                  />
                                }
                                endIcon={
                                  <RiDeleteBin2Fill
                                    color="red"
                                    style={{ fontSize: 25 }}
                                    onClick={() => DeleteImageGallery(list)}
                                  />
                                }
                              />
                            </Box>
                          </Box>
                        </>
                      ))}{" "}
                  </Box>
                </TabPanel>
              </TabContext>
              <div
        ref={lastElementRef}
        style={{ height: "20px", backgroundColor: "transparent" }}
      />
      {(mediaImg.length < mediaImgCount) ?   <p hasMore>Loading more data...</p> : <p></p>}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={close}>Disagree</Button>
          <Button onClick={close} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
