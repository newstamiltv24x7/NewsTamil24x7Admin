import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Autocomplete,
  Box,
  Checkbox,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Slide,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { FaUpload } from "react-icons/fa6";
import { Label, Spinner } from "reactstrap";
import Image from "next/image";
import { IoTrash } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPermissionPop(props: any) {
  const {
    open,
    close,
    title,
    roleList,
    inputs,
    handleInputChange,
    menuList,
    handleSubmit,
    setPrivilege,
    handleClear,
    privilege,
    checked,
    handleChildCheckboxChange,
    selectedItems,
    isParentChecked,
    setSelectedItems,
    handleParentCheckboxChange,
    isChildChecked,
    selectedPrivileges,
    setSelectedPrivileges,
    availableOptions,
  } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={close}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="responsive-dialog-title"
        className="web-story-pop"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ bgcolor: "#fe6a49", color: "#fff" }}
        >
          {title}
          <IoMdCloseCircle
            style={{
              position: "absolute",
              right: "5%",
              top: "5%",
              fontSize: 30,
              cursor: "pointer",
            }}
            onClick={close}
          />
        </DialogTitle>
        <DialogContent>
          <Box pt={2}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Select Role *"
                    variant="outlined"
                    type="text"
                    name="role"
                    size="medium"
                    select
                    value={inputs?.role}
                    onChange={handleInputChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    {roleList?.map((list: any) => (
                      <MenuItem value={list?.c_role_id} key={list?._id}>
                        {list?.c_role_name?.toUpperCase()}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={8}>
                  {/* <Autocomplete
                    multiple
                    id="tags-standard"
                    options={privilages}
                    value={privilege}
                    getOptionLabel={(option: any) => option?.role_privileage}
                    onChange={(e, newval) => setPrivilege(newval)}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Privilege"
                      />
                    )}
                  /> */}
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={availableOptions}
                    getOptionLabel={(option) => option?.role_privileage}
                    value={selectedPrivileges}
                    disableCloseOnSelect
                    onChange={(e, newval) => {
                      setSelectedPrivileges(newval);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Privilege" />
                    )}
                  />
                  {/* <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Select Role *"
                    variant="outlined"
                    type="text"
                    name="role"
                    size="medium"
                    select
                    value={inputs?.role}
                    onChange={handleInputChange}
                    // error={errors?.includes("title")}
                    // helperText={errors?.includes("title") && "Please enter title"}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    {roleList?.map((list: any) => (
                      <MenuItem value={list?.c_role_id} key={list?._id}>
                        {list?.c_role_name}
                      </MenuItem>
                    ))}
                  </TextField> */}
                </Grid>
              </Grid>
              <Box mt={1}>
                {/* {menuList?.at(0)?.Items?.map((list: any) => (
                  <>
                    <FormGroup>
                      <FormControlLabel
                        sx={{ mb: 0 }}
                        control={
                          <Checkbox
                            sx={{ py: 1, px: 2 }}
                            onChange={(e) => handleChecked(e, list, list)}
                          />
                        }
                        label={list?.title}
                      ></FormControlLabel>
                      {list?.children?.map((item: any, index: any) => (
                        <FormControlLabel
                          sx={{ mb: 0 }}
                          control={
                            <Checkbox
                              sx={{ py: 1, px: 2 }}
                              onChange={(e) => handleChecked(e, item, list)}
                            />
                          }
                          key={index}
                          label={item?.title}
                        />
                      ))}
                    </FormGroup>
                  </>
                ))} */}

                <ul>
                  {menuList?.at(0)?.Items?.map((menuItem: any) => (
                    <li key={menuItem.id}>
                      <label>
                        <input
                          type="checkbox"
                          className="checkBox-parent"
                          checked={isParentChecked(menuItem)}
                          onChange={() => handleParentCheckboxChange(menuItem)}
                        />
                        {menuItem.title}
                      </label>
                      {menuItem.children && (
                        <ul
                          style={{ paddingLeft: "24px", marginBlock: "12px" }}
                        >
                          {menuItem.children.map((child: any) => (
                            <li key={child.path}>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkBox-parent"
                                  checked={isChildChecked(child, menuItem)}
                                  onChange={() =>
                                    handleChildCheckboxChange(child, menuItem)
                                  }
                                />
                                {child.title}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box pl={2}>
            {/* <FormControlLabel
              control={<Checkbox />}
              // onChange={handleCheck}
              // checked={inputs?.status === 1}
              label="Status"
            /> */}
          </Box>
          <Box>
            <Button
              color="primary"
              variant="outlined"
              //   disabled={imageLoader}
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              //   disabled={imageLoader}
              color="primary"
              variant="contained"
              sx={{ color: "#fff", ml: 2 }}
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
