import { Box, Checkbox } from "@mui/material";
import React, { Fragment } from "react";

export interface listObj {
  title: any;
}

export function PublishDetails(props: any) {
  const { handleChecked, List, checkedItems } = props;

  return (
    <Fragment>
      {List?.map((list: any, index: number) => (
        <Box display={"flex"} alignItems={"flex-start"} key={index}>
          <Checkbox
            sx={{ pt: "3px" }}
            // checked={checkedItems[list.c_opt_id] || false}
            checked={list?.opt_check === 1}
            onChange={(e) => handleChecked(e, list)}
          />
          <p className="story-check-content">
            {list?.opt_title} <br />
            <span>{list?.opt_sub_title}</span>
          </p>
        </Box>
      ))}
    </Fragment>
  );
}
