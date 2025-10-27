import React, { useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";

// const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const JoditEditor = dynamic(() => import("jodit-pro-react"), { ssr: false });



function JoditTextEditer(props) {

  const token = Cookies.get("_token");

  const {
    inputs,
    handleSubEditorChange,
    handleChange,
    errors,
    handleChangeJodit,
    content,
    contentPage,
  } = props;

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
      },
      image: { defaultWidth: '100%' },
      readonly: false,
      toolbar: true,
      license: process.env.NEXT_PUBLIC_JODIT_LICENSE, // Add your license key here
      // uploader: {
      //   url: 'https://xdsoft.net/jodit/finder/?action=fileUpload',
      //   insertImageAsBase64URI: false,
      // },
      // filebrowser: {
      //   ajax: {
      //     url: 'https://xdsoft.net/jodit/finder/'
      //   },
      //   height: 580,
      // },
    }),
    []
  );

  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => window.twttr.widgets.load();
      document.body.appendChild(script);
    }
  }, [content]);



  useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
  }, [content]);

  

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://platform.twitter.com/widgets.js';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, [content]);


  return (
    <>
      <div>
        <div>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) => handleChangeJodit(newContent)} // preferred to use only this option to update the content for performance reasons
            // onChange={(newContent) => {}}
          />
          {contentPage === "static" ? (
            <style>{`.jodit-wysiwyg{min-height:400px !important}`}</style>
          ) : (
            <style>{`.jodit-wysiwyg{min-height:200px !important}`}</style>
          )}
        </div>

        {errors?.includes("story_details") && (
          <p style={{ color: "#d33b34" }}>
            Please enter story with minimum 10 letters
          </p>
        )}

        {contentPage === "static" && (
          <Grid container>
            <Grid item xs={4} spacing={2} display={"none"}>
              <Box style={{ margin: "10px 0" }}>
                <TextField
                  label={`Twitter URL`}
                  fullWidth
                  size="small"
                  name={"twitter"}
                  type="text"
                  value={inputs?.twitter}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={4} spacing={2}>
            <Box style={{ margin: "10px" }}>
              <TextField
                label={`Youtube URL`}
                fullWidth
                size="small"
                name={"youtube"}
                type="text"
                value={inputs?.youtube}
                onChange={handleChange}
              />
            </Box>
          </Grid> */}

            <Grid item xs={4} spacing={2} display={"none"}>
              <Box style={{ margin: "10px" }}>
                <TextField
                  label={`Facebook URL`}
                  fullWidth
                  size="small"
                  name={"facebook"}
                  type="text"
                  value={inputs?.facebook}
                  onChange={handleChange}
                />
              </Box>
            </Grid>

            <Grid item xs={4} spacing={2} display={"none"}>
              <Box style={{ margin: "10px 0 0 0" }}>
                <TextField
                  label={`Instagram URL`}
                  fullWidth
                  size="small"
                  name={"instagram"}
                  type="text"
                  value={inputs?.instagram}
                  onChange={handleChange}
                />
              </Box>
            </Grid>

            <Grid item xs={4} spacing={2} display={"none"}>
              <Box style={{ margin: "6px 0" }}>
                <TextField
                  label={`Threads URL`}
                  fullWidth
                  size="small"
                  name={"threads"}
                  type="text"
                  value={inputs?.threads}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={4} >
              <Box style={{ margin: "10px" }}>
                <TextField
                  label={`Minutes to Read`}
                  fullWidth
                  size="small"
                  name={"minutes"}
                  type="number"
                  disabled
                  value={inputs?.minutes}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ margin: "10px" }}>
                <FormGroup sx={{ flexDirection: "row", gap: 2 }}>
                  {/* <FormControlLabel
                  control={
                    <Checkbox
                      checked={inputs?.is_paid === 1}
                      name="paid"
                      onChange={handleSubEditorChange}
                      sx={{
                        // color: "#fe6a49",
                        ".MuiCheckbox-root": {
                          color: "#fe6a49",
                        },
                      }}
                    />
                  }
                  label="Is Paid Content ?"
                /> */}
                  {/* <FormControlLabel
                  control={
                    <Checkbox
                      name="live_article"
                      onChange={handleSubEditorChange}
                      checked={inputs?.live_article === 1}
                    />
                  }
                  label="Live Article"
                /> */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="trending_news"
                        onChange={handleSubEditorChange}
                        checked={inputs?.trending_news === 1}
                      />
                    }
                    label="Trending News"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="flash_news"
                        onChange={handleSubEditorChange}
                        checked={inputs?.flash_news === 1}
                      />
                    }
                    label="Latest News"
                  />
                   <FormControlLabel
                    control={
                      <Checkbox
                        name="live_status"
                        onChange={handleSubEditorChange}
                        checked={inputs?.live_status === 1}
                      />
                    }
                    label="Scroll News"
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* {page !== "Template" && (
          <Grid container spacing={2} mt={2}>
           <Grid item xs={2}>
              <Button
                variant="contained"
                onClick={GenerateKeyWords}
                sx={{ color: "#fff", fontSize: "12px" }}
                disabled={aiFlag}
                endIcon={
                  translatorLoader && <Spinner size={"sm"}>Loading ...</Spinner>
                }
              >
                Generate Tags
              </Button>
            </Grid> 
          </Grid>
        )} */}
      </div>
    </>
  );
}

export default JoditTextEditer;
