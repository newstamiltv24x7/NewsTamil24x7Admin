import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  styled,
} from "@mui/material";
import React from "react";
import { FaUpload } from "react-icons/fa6";
import { Label, Spinner } from "reactstrap";
import { RiDeleteBin5Line } from "react-icons/ri";
import Image from "next/image";

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

function WebStory(props: any) {
  const {
    radioVal,
    setRadioVal,
    inputs,
    handleInputChange,
    handleUpload,
    image,
    imgLoader,
    handleDelete,
    handleSave,
  } = props;

  return (
    <div>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Page Title"
              variant="outlined"
              type="text"
              name="title"
              size="small"
              value={inputs?.title}
              onChange={handleInputChange}
              // error={errors?.includes("title")}
              // helperText={errors?.includes("title") && "Please enter title"}
              sx={{
                ".MuiFormHelperText-root": {
                  ml: 0,
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Page Description"
              variant="outlined"
              type="text"
              name="desc"
              size="small"
              multiline
              rows={3}
              value={inputs?.desc}
              onChange={handleInputChange}
              // error={errors?.includes("title")}
              // helperText={errors?.includes("title") && "Please enter title"}
              sx={{
                ".MuiFormHelperText-root": {
                  ml: 0,
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Keywords"
              variant="outlined"
              type="text"
              name="keywords"
              size="small"
              multiline
              rows={3}
              value={inputs?.keywords}
              onChange={handleInputChange}
              // error={errors?.includes("title")}
              // helperText={errors?.includes("title") && "Please enter title"}
              sx={{
                ".MuiFormHelperText-root": {
                  ml: 0,
                },
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Social Share Image
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={radioVal}
                name="radio-buttons-group"
                value={radioVal}
                onChange={(e: any) => setRadioVal(e.target.value)}
              >
                <FormControlLabel
                  value="utube"
                  control={<Radio />}
                  label="Add Youtube"
                />
                <FormControlLabel
                  value="library"
                  control={<Radio />}
                  label="Select from library"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={5} mt={"3%"}>
            {radioVal === "utube" ? (
              <Box>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Youtube Link"
                  variant="outlined"
                  type="text"
                  name="url"
                  size="small"
                  multiline
                  rows={3}
                  value={inputs?.url}
                  onChange={handleInputChange}
                  // error={errors?.includes("title")}
                  // helperText={errors?.includes("title") && "Please enter title"}
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                    mt: 1,
                  }}
                />
              </Box>
            ) : (
              <Box>
                {image ? (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Image
                      src={image}
                      alt=""
                      width={150}
                      height={120}
                      style={{ borderRadius: 6 }}
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
                      {inputs?.c_image}
                    </p>
                    {imgLoader ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <RiDeleteBin5Line
                        style={{
                          color: "red",
                          fontSize: "24px",
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
                    endIcon={imgLoader && <Spinner size={"sm"} />}
                    disabled={imgLoader}
                  >
                    Social Share Image
                    <VisuallyHiddenInput type="file" onChange={handleUpload} />
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
        <Box my={2} display={"flex"} justifyContent={"flex-end"}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default WebStory;
