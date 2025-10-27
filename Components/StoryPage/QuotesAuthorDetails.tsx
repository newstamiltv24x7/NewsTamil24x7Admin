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
export function QuotesAuthorDetails(props: any) {
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
        <Grid item xs={12} sm={12} md={12}>
          <Grid mb={2} item xs={12}>
            <Box>
              <TextField
                autoComplete="off"
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
                autoComplete="off"
                label={`Quotes author`}
                fullWidth
                size="small"
                name={"story_asked_quotes_author"}
                value={inputs?.story_asked_quotes_author}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        </Grid>

        {/* <Grid item xs={12}>
            <h6>Question & Answer</h6>
          </Grid> */}
      </Grid>
    </Fragment>
  );
}
