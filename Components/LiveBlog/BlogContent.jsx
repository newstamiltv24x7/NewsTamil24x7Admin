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
import React, { useMemo, useRef } from "react";
import { FaUpload } from "react-icons/fa6";
import { Label } from "reactstrap";
import { IoCloseCircle } from "react-icons/io5";
import JoditEditor from "jodit-react";

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

function BlogContent(props) {
  const {
    listicleArr,
    handleDescription,
    handleDelete,
    loader,
    type,
    handleChangeJodit,
    addSection,
    subErrors
  } = props;
  const editor = useRef(null);

  const config = useMemo(
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
  }, [listicleArr]);

  return (
    <div
      style={
        loader?.imgLoader
          ? { pointerEvents: "none", opacity: 0.3 }
          : { opacity: 1 }
      }
    >
      {listicleArr?.map((item, index) => (
        <Box my={2} p={3} border={"1px dashed #cbcbcb"} key={index}>
          
          <p style={{color:"#fe6a49", fontWeight:"bold"}}>Section {index + 1}</p>
          <Grid container spacing={2}>
            <Grid item xs={10}>
            
              <Box>
                <TextField
                  id="outlined-basic"
                  label={`Title`}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                  name="c_live_sub_blog_title"
                  value={item?.c_live_sub_blog_title}
                  onChange={(e) => handleDescription(e, index)}
                    error={subErrors?.c_live_sub_blog_title}
                    helperText={
                      subErrors?.c_live_sub_blog_title &&
                      "Title should contain more then 3 letters"
                    }
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                {/* <TextField
                  id="outlined-basic"
                  label={`Description`}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
                  name="c_live_sub_blog_content"
                  value={item?.c_live_sub_blog_content}
                  onChange={(e) => handleDescription(e, index)}
                  //   error={errors?.includes("title")}
                  //   helperText={
                  //     errors?.includes("title") &&
                  //     "Title should contain more then 3 letters"
                  //   }
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                /> */}
                <JoditEditor
                  ref={editor}
                  value={item?.c_live_sub_blog_content}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) => handleChangeJodit(index, newContent)} // preferred to use only this option to update the content for performance reasons
                  // onChange={(newContent) => {}}
                />
                {subErrors?.c_live_sub_blog_content &&
                     <p style={{ fontSize: "0.75rem", color: "#d32f2f" }}>Content should contain more then 3 letters</p>
                    }
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
                    disabled={listicleArr?.length === 1}
                  >
                    Remove Section
                  </Button>
                </Box>
                
              <Box
                sx={{
                  display: (listicleArr?.length === index + 1) ?  "block" : "none"
                }}
              >
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

export default BlogContent;
