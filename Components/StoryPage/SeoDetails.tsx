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
  credit: String;
  name: String;
}
export function SeoDetails(props: any) {
  const {
    inputs,
    handleChange,
    authorBlock,
    handleCheckAuthor,
    credit,
    handleAddField,
    handleDeleteField,
    handleCreditChange,
    errors,
    selectedOptions,
    setSelectedOptions,
    handleDelete,
    fetchedKeywords,
    deskUrl,
    pass
  } = props;

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Autocomplete
              multiple
              id="tags-filled"
              options={selectedOptions}
              value={selectedOptions}
              onChange={(event, newValue) => {
                setSelectedOptions(newValue);
              }}
              freeSolo
              renderTags={(value, getTagProps) =>
                value?.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    onDelete={() => handleDelete(option)}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Tags" />
              )}
            />
          </Box>
        </Grid>
        {/* <Grid item xs={3}>
          <Box>
            <Box display={"flex"} alignItems={"flex-start"}>
              <Checkbox
                sx={{ pt: "3px" }}
                checked={authorBlock === 1}
                onChange={(e) => handleCheckAuthor(e)}
              />
              <p>Show Authors Block</p>
            </Box>
          </Box>
        </Grid> */}
        <Grid item xs={8}>
          <Box>
            <TextField
              label={`Keywords`}
              fullWidth
              size="medium"
              multiline
              rows={3}
              name={"keywords"}
              value={fetchedKeywords}
              onChange={handleChange}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={8} className="position-relative">
          <TextField
            label={`Desk Created URL`}
            // disabled={pass ==="edit" ? true :false}
            fullWidth
            size="small"
            name={"url"}
            // sx={{ pointerEvents: "none" }}
            // value={`${deskUrl
            //   ?.toLowerCase()
            //   ?.split(" ")
            //   ?.join("-")
            //   ?.replaceAll(",", "")}`}
            value={deskUrl?.toLowerCase()}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4} className="position-relative">

        </Grid>
        {/* <Grid item xs={4} className="position-relative">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={[
              { label: "Article one", year: 1994 },
              { label: "Article two", year: 1972 },
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                id="filled-select-currency-native"
                label="Article Template"
                value={inputs?.article_temp}
                name={"article_temp"}
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                fullWidth
                size="small"
                variant="outlined"
              />
            )}
          />
        </Grid> */}


        <Grid item xs={8} className="position-relative">
          <TextField
            label={`Story Summary`}
            fullWidth
            size="medium"
            multiline
            rows={3}
            value={inputs?.story_summary}
            name={"story_summary"}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      {credit &&
        credit?.map((list: any, index: any) => {
          return (
            <Grid container spacing={2} mt={1} key={index}>
              {/* <Grid item xs={5}>
                <Box>
                  <Label>Credit</Label>
                  <Input
                    id="exampleSelect"
                    name="story_credit"
                    type="text"
                    value={list?.story_credit?.toString()}
                    onChange={(e) => handleCreditChange(e, index)}
                  ></Input>
                </Box>
              </Grid> */}
              {/* <Grid item xs={5}>
                <Box>
                  <Label>Name</Label>
                  <Input
                    id="exampleSelect"
                    name="story_name"
                    type="text"
                    value={list?.story_name?.toString()}
                    onChange={(e) => handleCreditChange(e, index)}
                  ></Input>
                </Box>
              </Grid> */}
              {/* <Grid item xs={2}>
                <Box
                  display={"flex"}
                  sx={{ mt: 3 }}
                  alignItems={"center"}
                  gap={2}
                >
                  

                  {credit.length !== 1 && (
                    <IconButton
                      onClick={() => handleDeleteField(index)}
                      disabled={credit.length === 1}
                    >
                      <RiDeleteBin2Line
                        style={{
                          fontSize: "24px",
                          color: "black",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  )}
                  {credit.length - 1 === index && (
                    <Button variant="outlined" onClick={handleAddField}>
                      Add
                    </Button>
                  )}
                </Box>
              </Grid> */}
            </Grid>
          );
        })}
    </Fragment>
  );
}
