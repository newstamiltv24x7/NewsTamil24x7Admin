import { Col, Row } from "reactstrap";
import {
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect } from "react";

export const BasicDetails = (props: any) => {
  const {
    inputs,
    handleChange,
    handleBlur,
    categoryArr,
    secondaryCategoryArr,
    countryArr,
    stateArr,
    cityArr,
    userArr,
    errors,
    handleRegionChange,
    handleCategoryChange,
    handleCheckCat,
    checkedCat,
    authorArr,
  } = props;

  

  return (
    <>
      <Row className="g-3 custom-input">
        <Col md="7" className="position-relative">
          <TextField
            label={`Tamil Title`}
            fullWidth
            size="medium"
            multiline
            rows={3}
            name="tamil_title"
            value={inputs?.tamil_title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.includes("tamil_title")}
            helperText={
              errors?.includes("tamil_title") && "Please enter valid title"
            }
          />
        </Col>
        <Col md="5" className="position-relative">
          <TextField
            label={`Tamil Subtitle`}
            fullWidth
            size="medium"
            multiline
            rows={3}
            name={"sub_title"}
            value={inputs?.sub_title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Col>
        <Col md="7" className="position-relative">
          <TextField
            label={`English Title`}
            fullWidth
            size="medium"
            multiline
            rows={3}
            name={"english_title"}
            value={inputs?.english_title}
            onChange={handleChange}
          />
        </Col>
        <Col md="5" className="position-relative">
          <TextField
            label={`English Subtitle`}
            fullWidth
            size="medium"
            multiline
            rows={3}
            name={"eng_sub_title"}
            value={inputs?.eng_sub_title}
            onChange={handleChange}
          />
        </Col>
        <Col md="7" className="position-relative">
          <TextField
            autoComplete="off"
            label={`Story Subject`}
            variant="outlined"
            size="small"
            fullWidth
            defaultValue={inputs?.story_subject_name}
            name={"story_subject_name"}
            value={inputs?.story_subject_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors?.includes("story_subject_name")}
            helperText={
              errors?.includes("story_subject_name") &&
              "Please enter valid subject name"
            }
          ></TextField>
        </Col>
        <Col md="5" className="position-relative"></Col>
        <Col md="3" className="position-relative">
          {/* <Select
            variant="outlined"
            size="small"
            fullWidth
            multiple
            // defaultValue={inputs?.main_category}
            name={"main_category"}
            value={checkedCat}
            // value={inputs?.main_category}
            // onChange={(e) => handleCategoryChange(e, categoryArr)}
          >
            {categoryArr?.map((list: any) => {
              return (
                <MenuItem key={list._id} value={list?.c_category_id}>
                  <Checkbox
                    sx={{
                      m: 0,
                      "&.MuiCheckbox-colorPrimary": {
                        padding: "0 9px",
                      },
                    }}
                    checked={checkedCat?.includes(list?.c_category_id)}
                    onChange={(e) => handleCheckCat(e, list)}
                  />
                  {list?.c_category_english_name}
                </MenuItem>
              );
            })}
          </Select> */}

          <Autocomplete
            multiple
            
            id="tags-standard"
            options={categoryArr}
            value={checkedCat}
            // defaultValue={categoryArr}
            onChange={(e, newval: any) => handleCheckCat(e, newval)}
            getOptionLabel={(option: any) => option?.c_category_name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Category"
                placeholder="Category"
                size="small"
                error={errors?.includes("main_category")}
                helperText={
                  errors?.includes("main_category") && "Please select category"
                }
              />
            )}
          />
        </Col>
        <Col md="3" className="position-relative">
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"secondary_category"}
            value={inputs.secondary_category}
            onChange={(e)=>handleChange(e,checkedCat[0]?.c_sub_categories)}
            label="Select Sub Category"
          >
           
            { checkedCat[0]?.c_sub_categories ?.map((list: any) => {
              return (
                <option key={list._id} value={list?.c_category_id}>
                  {list?.c_category_name}
                </option>
              );
            })}
          </TextField>
        </Col>
        {/* <Col md="3" className="position-relative" style={{ display: "none" }}>
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"secondary_category"}
            value={inputs?.secondary_category}
            onChange={handleChange}
          >
            {secondaryCategoryArr?.map((list: any) => {
              return (
                <option key={list._id} value={list?.c_category_id}>
                  {list?.c_category_name}
                </option>
              );
            })}
          </TextField>
        </Col> */}
        <Col md="3" className="position-relative">
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"reviewer"}
            value={inputs?.reviewer}
            onChange={handleChange}
            error={errors?.includes("reviewer")}
            helperText={
              errors?.includes("reviewer") &&
              "Please select reviewer"
            }
          >
            {userArr?.map((list: any) => {
              return (
                <option key={list._id} value={list?.user_id}>
                  {list?.user_name}
                </option>
              );
            })}
          </TextField>
        </Col>
        <Col md="3" className="position-relative">
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"author"}
            value={inputs?.author}
            onChange={handleChange}
          >
            {authorArr?.map((list: any) => {
              return (
                <option key={list._id} value={list?.user_id}>
                  {list?.user_name}
                </option>
              );
            })}
          </TextField>
        </Col>
        {/* <Col md="4"></Col> */}
        <Col md="4" className="position-relative">
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"country"}
            defaultValue={inputs?.country}
            value={inputs?.country}
            onChange={handleRegionChange}
          >
            {countryArr?.map((list: any) => {
              return (
                <option key={list._id} value={list?.country_id}>
                  {list?.country_name}
                </option>
              );
            })}
          </TextField>
        </Col>
        <Col md="4" className="position-relative">
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"state"}
            defaultValue={inputs?.state}
            value={inputs?.state}
            onChange={handleRegionChange}
          >
            {stateArr?.map((list: any) => {
              return (
                <option key={list._id} value={list?.state_id}>
                  {list?.state_name}
                </option>
              );
            })}
          </TextField>
        </Col>
        <Col md="4" className="position-relative">
          <TextField
            variant="outlined"
            size="small"
            select
            SelectProps={{
              native: true,
            }}
            fullWidth
            name={"city"}
            value={inputs?.city}
            defaultValue={inputs?.city}
            onChange={handleRegionChange}
          >
            {cityArr?.map((list: any) => {
              return (
                <option key={list._id} value={list?.city_id}>
                  {list?.city_name}
                </option>
              );
            })}
          </TextField>
        </Col>
      </Row>
    </>
  );
};
