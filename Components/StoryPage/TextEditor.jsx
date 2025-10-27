"use client";

import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { Spinner } from "reactstrap";

const TextEditor = (props) => {
  const {
    editorState,
    handleEditorChange,
    inputs,
    handleSubEditorChange,
    handleChange,
    errors,
    GenerateKeyWords,
    aiFlag,
    translatorLoader,
    page,
  } = props;

  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          resolve({ data: { link: e.target.result } });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div className="create-story">
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: [
            "image",
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "embedded",
            "emoji",
            "image",
            "remove",
            "history",
          ],
          image: {
            uploadEnabled: true,
            uploadCallback: uploadCallback,
            previewImage: true,
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            alt: { present: false, mandatory: false },
            defaultSize: {
              height: "300px",
              width: "300px",
            },
          },
        }}
      />
      {page !== "Template" && errors?.includes("story_details") && (
        <p style={{ color: "#d33b34" }}>
          Please enter story with minimum 10 letters
        </p>
      )}

      <Grid container>
        <Grid item xs={4} spacing={2} >
          <Box style={{margin:"10px"}}>
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
        <Grid item xs={4} spacing={2}>
          <Box style={{margin:"10px"}}>
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
        </Grid>

        <Grid item xs={4} spacing={2}>
          <Box style={{margin:"10px"}}>
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

        <Grid item xs={4} spacing={2}>
          <Box style={{margin:"10px"}}>
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

        <Grid item xs={4} spacing={2}>
          <Box style={{margin:"10px"}}>
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




      </Grid>

      {page !== "Template" && (
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
          <Grid item xs={2}>
            <Box>
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
          <Grid item xs={8}>
            <Box>
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
                  label="Flash News"
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default TextEditor;
