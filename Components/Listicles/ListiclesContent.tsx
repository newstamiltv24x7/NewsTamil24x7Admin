import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  styled,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { FaUpload } from "react-icons/fa6";
import { Label } from "reactstrap";
import { IoCloseCircle } from "react-icons/io5";

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

function ListiclesContent(props: any) {
  const {
    listicleArr,
    handleDeleteImg,
    handleDescription,
    handleUpload,
    handleCheck,
    handleDelete,
    loader,
    type,
    addSection,
    subErrors
  } = props;
  return (
    <div
      style={
        loader?.imgLoader
          ? { pointerEvents: "none", opacity: 0.3 }
          : { opacity: 1 }
      }
    >
      {listicleArr?.map((item: any, index: number) => (
        <Box my={2} p={3} border={"1px dashed #cbcbcb"}>
          <p style={{color:"#fe6a49", fontWeight:"bold"}}>Section {index + 1}</p>
          <Grid container spacing={2}>
            <Grid
              item
              xs={4}
              sx={
                item?.c_listicles_continue_img === "" ? { display: "grid" } : {}
              }
            >
             
              <Box display={"grid"} sx={{ placeItems: "center" }}>
                
                {item?.c_listicles_continue_img ? (
                  <Box position={"relative"}>
                    <Box display={"grid"} sx={{ placeItems: "center" }}>
                      <Image
                        src={item?.c_listicles_continue_img}
                        alt=""
                        width={250}
                        height={200}
                        style={{ borderRadius: "12px" }}
                      />
                    </Box>
                    <Box position={"absolute"} top={-6} right={-6}>
                      <IconButton onClick={() => handleDeleteImg(item, index)}>
                        <IoCloseCircle
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<FaUpload />}
                    sx={{ textTransform: "capitalize" }}
                  >
                    Upload image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(e) => handleUpload(e, index)}
                    />
                  </Button>
                )}
                <p style={{color:"#d32f2f", fontSize: "0.75rem",lineHeight: "1.66",letterSpacing: "0.03333em"}}> {subErrors?.c_listicles_continue_img &&
                      "Please Upload image"}</p>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box>
                <TextField
                  id="outlined-basic"
                  label={`Title`}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                  name="c_listicles_continue_sub_title"
                  value={item?.c_listicles_continue_sub_title}
                  onChange={(e) => handleDescription(e, index)}
                  error = {subErrors?.c_listicles_continue_sub_title}
                    helperText={
                      subErrors?.c_listicles_continue_sub_title &&
                      "Section Title should contain more then 3 letters"
                    }
                  
                  
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                <TextField
                  id="outlined-basic"
                  label={`Description`}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
                  name="c_listicles_continue_content"
                  value={item?.c_listicles_continue_content}
                  onChange={(e) => handleDescription(e, index)}
                  error = {subErrors?.c_listicles_continue_content}
                    helperText={
                      subErrors?.c_listicles_continue_content &&
                      "Section Description should contain more then 3 letters"
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
                {type === "Edit Page" && (
                  <Box>
                    <Checkbox
                      sx={{ pt: "3px", pl: 0 }}
                      checked={item?.n_status === 1}
                      onChange={(e) => handleCheck(e, index)}
                    />
                    <span>
                      <Label>Status</Label>
                    </span>
                  </Box>
                )}

                <Box>
                  <Button
                    sx={{
                      color: "red",
                      fontSize: 12,
                      fontWeight: 550,
                      fontFamily: `"Montserrat", sans-serif`,
                    }}
                    onClick={() => handleDelete(index)}
                    disabled={listicleArr?.length === 1}
                  >
                    Remove Section
                  </Button>
                  
                </Box>
                <Box sx={{
                  display: (listicleArr?.length === index + 1) ?  "block" : "none"
                }}>
                <Button variant="outlined" onClick={addSection}>
                  Add Section 
                </Button>
              </Box>
              
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </div>
  );
}

export default ListiclesContent;
