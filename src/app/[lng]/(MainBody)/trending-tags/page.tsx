"use client";
import { addTrendingTag, getTrendingTag } from "@/apiFunctions/ApiAction";
import { Autocomplete, Box, Button, Chip, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, Spinner } from "reactstrap";

const page = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleDelete = (optionToDelete: string) => {
    setSelectedOptions((prevOptions: any) =>
      prevOptions?.filter((option: string) => option !== optionToDelete)
    );
  };

  const GetTrendingTags = async () => {
    setLoader(true);
    try {
      const results = await getTrendingTag();
      setLoader(false);
      setSelectedOptions(results?.payloadJson?.at(0)?.c_trending_tag_name);
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  const handleSave = async () => {
    const body = {
      c_trending_tag_name: selectedOptions,
    };
    const results = await addTrendingTag(body);
    if (results?.appStatusCode === 0) {
      toast?.success(results?.message);
      GetTrendingTags();
    } else {
      toast?.error(results?.message);
    }
  };

  useEffect(() => {
    GetTrendingTags();
  }, []);

  return (
    <>
      <Card>
        <CardBody>
          {loader ? (
            <Box minHeight={150} display={"grid"} sx={{ placeItems: "center" }}>
              <Spinner size={"md"} />
            </Box>
          ) : (
            <Autocomplete
              multiple
              id="tags-filled"
              options={selectedOptions}
              value={selectedOptions}
              onChange={(event, newValue: any) => {
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
          )}

          <Box mt={2} display={"flex"} justifyContent={"flex-end"}>
            <Button variant="contained" onClick={() => handleSave()}>
              {" "}
              Save
            </Button>
          </Box>
        </CardBody>
      </Card>
    </>
  );
};

export default page;
