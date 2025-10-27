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
  export function BlurbDetails(props: any) {
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
                  label={`Blurb title`}
                  fullWidth
                  size="medium"
                  multiline
                  rows={1}
                  name={"blurb_title"}
                  value={inputs?.blurb_title}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid  mb={2} item xs={12}>
              <Box>
                <TextField
                  label={`Blurb Content`}
                  fullWidth
                  size="medium"
                  multiline
                  rows={3}
                  name={"blurb_content"}
                  value={inputs?.blurb_content}
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            
          </Grid>
  
  
          
  
  
         
        </Grid>
  
        
      </Fragment>
    );
  }
  