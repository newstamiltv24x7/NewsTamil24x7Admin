import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { Label, Spinner } from "reactstrap";
import { IoTrash } from "react-icons/io5";
import GalleryPop from "./mediaGallery/GalleryPop";

export function MediaDetails(props: any) {
  const {
    fileName,
    handleDelete,
    image,
    imageLoader,
    inputs,
    handleChange,
    handleSelectImage,
    errors,
    openOption,
    handleToggleOption,
    handleOpenGallery,
    openGallery,
    closeGallery,
    mediaImg,
    handleAddImage,
    DeleteImageGallery,
    thumbOption,
    handleThumbToggleOption,
    thumbLoader,
    thumbName,
    thumbImage,
    handleDeleteThumb,
    handleSelectThumbImage,
    lastElementRef,
    hasMore,
    setHasMore,
    mediaImgCount
  } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box>
            <Label>Cover Image</Label>

            {imageLoader ? (
              <Box>
                <Spinner>Loading...</Spinner>
              </Box>
            ) : fileName ? (
              <Box>
                <Box width={"300px"} height={"200px"} pr={3} pb={2}>
                  <img
                    src={image}
                    alt=""
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  <Box width={"100%"}>
                    <Label className="textWrapper">{fileName}</Label>
                  </Box>
                  <Box>
                    <IoTrash
                      onClick={handleDelete}
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "2px dashed #cbcbcb",
                  cursor: "pointer",
                }}
                textAlign={"center"}
                p={5}
                // onClick={() => uploadRef?.current?.click()}
                onClick={() => handleToggleOption()}
              >
                <p>click here to upload cover image</p>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={uploadRef}
                  onChange={(e) => handleSelectImage(e)}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </Box>
            )}
          </Box>
          {openOption && (
            <Box my={1}>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => handleOpenGallery()}
              >
                Select From Library
              </Button>
              <Button
                variant="contained"
                sx={{ color: "#fff" }}
                onClick={() => uploadRef?.current?.click()}
              >
                Upload From Gallery
              </Button>
            </Box>
          )}
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Label>Thumbnail Image</Label>

            {thumbLoader ? (
              <Box>
                <Spinner>Loading...</Spinner>
              </Box>
            ) : thumbName ? (
              <Box>
                <Box width={"300px"} height={"200px"} pr={3} pb={2}>
                  <img
                    src={thumbImage}
                    alt=""
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  <Box width={"100%"}>
                    <Label className="textWrapper">{thumbName}</Label>
                  </Box>
                  <Box>
                    <IoTrash
                      onClick={handleDeleteThumb}
                      style={{
                        fontSize: "20px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "2px dashed #cbcbcb",
                  cursor: "pointer",
                }}
                textAlign={"center"}
                p={5}
                // onClick={() => uploadRef?.current?.click()}
                onClick={() => handleThumbToggleOption()}
              >
                <p>click here to upload thumb image</p>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={thumbRef}
                  onChange={(e) => handleSelectThumbImage(e)}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </Box>
            )}
          </Box>
          {thumbOption && (
            <Box my={1}>
              <Button
                variant="contained"
                sx={{ color: "#fff" }}
                onClick={() => thumbRef?.current?.click()}
              >
                Upload From Gallery
              </Button>
            </Box>
          )}
        </Grid>

        {/* <Grid item xs={8} display={"none"}>
          <Grid container spacing={2}>
            <Grid item xs={5} pr={2} mt={3} display={"none"}>
              <TextField
                id="filled-select-currency-native"
                select
                fullWidth
                SelectProps={{
                  native: true,
                }}
                value={uploadBtn}
                variant="outlined"
                size="small"
                onChange={(e: any) => setUploadBtn(e.target.value)}
              >
                <option value={""}>Choose...</option>
                <option value={"youtube"}>Add From Youtube</option>
                <option value={"library"}>Select From Library</option>
              </TextField>
            </Grid>

            {uploadBtn === "youtube" && (
              <Grid item xs={7} mt={3}>
                <Box>
                  <TextField
                    multiline
                    rows={2}
                    name={"u_tube_link"}
                    value={inputs?.u_tube_link}
                    onChange={handleChange}
                    label="Enter Youtube Link"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px",
                        cursor: "pointer",
                      },
                    }}
                    fullWidth
                  />
                </Box>
              </Grid>
            )}

            {uploadBtn === "library" && (
              <Grid item xs={7} mt={3}>
                {videoLoader ? (
                  <Spinner>Loading...</Spinner>
                ) : (
                  videoSrc && (
                    <Box>
                      <video width="100%" height="200" controls preload="none">
                        <source src={videoSrc} type="video/mp4" />
                      </video>
                      <Box display={"flex"} gap={2} alignItems={"center"}>
                        <Box>
                          <Label className="textWrapper">{videoName}</Label>
                        </Box>
                        <Box>
                          <IoTrash
                            onClick={handleDeleteVideo}
                            style={{
                              fontSize: "20px",
                              color: "red",
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )
                )}
                {!videoLoader && !videoSrc && uploadBtn === "library" && (
                  <Box>
                    <Box
                      sx={{
                        border: "2px dashed #cbcbcb",
                        cursor: "pointer",
                      }}
                      textAlign={"center"}
                      p={5}
                      onClick={() => videoRef?.current?.click()}
                    >
                      <p>click here to upload video</p>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={videoRef}
                        onChange={videoUpload}
                        accept="video/mp4"
                      />
                    </Box>
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        </Grid> */}
      </Grid>
      {errors?.includes("image") && (
        <p className="mb-0 mt-3" style={{ color: "#d33b34" }}>
          Please upload cover image
        </p>
      )}



      <Grid container>
        <Grid item xs={4} pr={"10px"}>
          <Box mt={2}>
            <TextField
              // multiline
              // rows={2}
              autoComplete="off"
              name={"image_caption"}
              value={inputs?.image_caption}
              onChange={handleChange}
              label="News Image Caption"
              sx={{
                ".MuiInputBase-input": {
                  padding: "14px",
                  cursor: "pointer",
                },
              }}
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
      <Grid item xs={6} mt={3}>
                <Box>
                  <TextField
                    multiline
                    rows={5}
                    name={"youtube"}
                    value={inputs?.youtube}
                    onChange={handleChange}
                    label="Enter Youtube Embed Link"
                    sx={{
                      ".MuiInputBase-input": {
                        padding: "10px",
                        cursor: "pointer",
                      },
                    }}
                    fullWidth
                  />
                </Box>
              </Grid>
      </Grid>

      <GalleryPop
        open={openGallery}
        close={closeGallery}
        mediaImg={mediaImg}
        handleAddImage={handleAddImage}
        handleDelete={handleDelete}
        DeleteImageGallery={DeleteImageGallery}
        lastElementRef={lastElementRef}
        hasMore={hasMore}
        setHasMore={setHasMore}
        mediaImgCount={mediaImgCount}
      />
    </Box>
  );
}
