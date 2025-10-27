import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Input, Label } from "reactstrap";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";

export interface creaditObj {
  askedQue: String;
  name: String;
}
export function StoryAskedDetails(props: any) {
  const {
    inputs,
    handleChange,
    authorBlock,
    handleCheckAuthor,
    askedQue,
    handleAddQueAnsField,
    handleDeleteQueAnsField,
    handleAskedQueChange,
    errors,
    selectedOptions,
    setSelectedOptions,
    handleDelete,
    fetchedKeywords,
    deskUrl,
  } = props;

  return (
    <Fragment>
      <Grid container spacing={2}>
        {/* <Grid item xs={12} sm={12} md={6}>
          
          <Grid  mb={2} item xs={12}>
            <Box>
              <TextField
                label={`Quotes`}
                fullWidth
                size="medium"
                multiline
                rows={3}
                name={"story_asked_quotes_content"}
                value={inputs?.story_asked_quotes_content}
                onChange={handleChange}
              />
            </Box>
          </Grid>
          <Grid mb={2} item xs={10} className="position-relative">
            <Box>
              <TextField
                label={`Quotes author`}
                fullWidth
                size="small"
                name={"story_asked_quotes_author"}
                value={inputs?.story_asked_quotes_author}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        </Grid> */}


        <Grid item xs={12} sm={12} md={12}>
        <Grid mb={2} item xs={12}>
            <Box>
              <TextField
                label={`Question Answer title`}
                fullWidth
                size="medium"
                multiline
                rows={1}
                name={"story_asked_title"}
                value={inputs?.story_asked_title}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        {askedQue &&
        askedQue?.map((list: any, index: any) => {
          return (
            <Grid container spacing={2} key={index}>
              <Grid item xs={10}>
                <Box>
                  <TextField
                    label={`Story Question`}
                    fullWidth
                    size="medium"
                    multiline
                    rows={1}
                    name={"story_question"}
                    value={list?.story_question?.toString()}
                    onChange={(e) => handleAskedQueChange(e, index)}
                  />
                </Box>
              </Grid>

              <Grid item xs={2}>
                {askedQue.length !== 1 && (
                  <Box
                    display={"flex"}
                    sx={{ mt: 3 }}
                    alignItems={"center"}
                    gap={2}
                  >
                    <IconButton
                      onClick={() => handleDeleteQueAnsField(index)}
                      disabled={askedQue.length === 1}
                    >
                      <RiDeleteBin2Line
                        style={{
                          fontSize: "24px",
                          color: "black",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              <Grid item xs={10}>
                <Box>
                  <TextField
                    label={`Story Answer`}
                    fullWidth
                    size="medium"
                    multiline
                    rows={3}
                    name={"story_answer"}
                    value={list?.story_answer?.toString()}
                    onChange={(e) => handleAskedQueChange(e, index)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  display={"flex"}
                  sx={{ mt: 3 }}
                  alignItems={"center"}
                  gap={2}
                >
                  {askedQue.length - 1 === index && (
                    <Button variant="outlined" onClick={handleAddQueAnsField}>
                      Add
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          );
        })}

        </Grid>


        

        {/* <Grid item xs={12}>
          <h6>Question & Answer</h6>
        </Grid> */}
      </Grid>

      
    </Fragment>
  );
}
