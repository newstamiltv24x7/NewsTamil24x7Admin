import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Slide,
  TextField,
  styled,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Container, Spinner } from "reactstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { FaUpload } from "react-icons/fa6";
import {
  createAdvertisementApi,
  getAllCityListApi,
  getAllCountryListApi,
  getAllStateListApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoTrash } from "react-icons/io5";
import { useAppSelector } from "@/Redux/Hooks";
import { useRouter } from "next/navigation";
import { TransitionProps } from "@mui/material/transitions";
import { useDispatch } from "react-redux";
import { IoCloseCircle } from "react-icons/io5";

// import StyledDemo from "@/CommonComponent/ImageCrop";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function readFile(file: any) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

const CreateAdContainer = () => {
  const router = useRouter();
  const { croppedImageSource } = useAppSelector(
    (state) => state.croppedImageSlice
  );
  const dispatch = useDispatch();
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [image, setImage] = useState<any>({
    loader: false,
    name: "",
    src: "",
  });
  const [inputs, setInputs] = useState<any>({
    title: "",
    type: "",
    position: "",
    page: "",
    start_date: dayjs(new Date()),
    end_date: dayjs(new Date()),
    start_time: dayjs(new Date()),
    end_time: dayjs(new Date()),
    country: "",
    state: "",
    city: "",
    redirect_url: "",
    height: "100",
    width: "100",
    device: "all",
  });
  const [countryArr, setCountryArr] = useState<any>([]);
  const [stateArr, setStateArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [errors, setErrors] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [imageFlag, setImageFlag] = React.useState(false);
  const [forCrop, setForCrop] = React.useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErrors([]);
  };

  useEffect(() => {
    if (imageFlag) {
      setOpen(false);
      const formData = new FormData();
      formData.append("c_file", croppedImageSource);
      formData.append("file_type", "image");
      formData.append("c_image_caption_name", "banner image");
      ImageUpload(formData);
    }
  }, [imageFlag]);

  const handleUpload = async (e: any) => {
    if (e) {
      let size = e.target?.files[0]?.size;
      let name = e.target?.files[0]?.name;
      if (size < 5000000) {
        let imageDataUrl: any = await readFile(e.target?.files[0]);
        setForCrop(imageDataUrl);
        setImage({ ...image, loader: true, name: name });
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  useEffect(() => {
    if (forCrop !== "") {
      setTimeout(() => {
        setOpen(true);
      }, 300);
    }
  }, [forCrop]);

  const ImageUpload = async (body: any) => {
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      setImage({ ...image, loader: false });
      toast.error(results?.error);
    } else {
      toast.success(results?.message);
      setImage({
        ...image,
        src: results?.payloadJson?.c_file_url,
        name: results?.payloadJson?.c_file_url?.split("/")?.at(-1),
        loader: false,
      });
    }
  };

  const DeleteImage = async () => {
    setImage({ ...image, loader: true });
    const results = await imageDeleteApi({
      c_file: image?.name,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImage({ ...image, loader: false });
    } else {
      setImageFlag(false);
      toast.success(results?.message);
      setImage({ ...image, name: "", src: "", loader: false });
    }
  };

  const GetCountryList = async () => {
    const results = await getAllCountryListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setCountryArr([]);
    } else {
      setCountryArr(results?.payloadJson);
    }
  };

  const GetStateList = async (body: any) => {
    const results = await getAllStateListApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setStateArr([]);
    } else {
      setStateArr(results?.payloadJson);
    }
  };

  const GetCityList = async (body: any) => {
    const results = await getAllCityListApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setCityArr([]);
    } else {
      setCityArr(results?.payloadJson);
    }
  };

  const handleAutocompleteSelect = (e: any, value: any, reason: string) => {
    const { id } = e.target;
    if (id?.includes("country")) {
      // setInitValue({ ...initValue, country: value });
      setInputs({ ...inputs, country: value?.country_id });
      const body = {
        country_id: value?.country_id,
      };
      GetStateList(body);
    }
    if (id?.includes("state")) {
      setInputs({ ...inputs, state: value?.state_id });
      const body = {
        country_id: inputs?.country,
        state_id: value?.state_id,
      };
      GetCityList(body);
    }
    if (id?.includes("city")) {
      setInputs({ ...inputs, city: value?.city_id });
    }
  };

  const AddAdvertisement = () => {
    let arr: any[] = [];
    Object.keys(inputs).map((val) => {
      if (val === "title") {
        inputs[val]?.length < 3 && arr.push(val);
      } else if (val === "type" || val === "position") {
        inputs[val] === "" && arr.push(val);
      } else if (image.src === "") {
        arr.push("image");
      }
    });
    setErrors(arr);
    if (arr.length === 0) {
      const body = {
        c_advt_title: inputs?.title,
        c_advt_type: inputs?.type,
        c_advt_banner_url: image?.src,
        c_advt_banner_redirect_url: inputs?.redirect_url,
        c_banner_start_date: inputs?.start_date, //yyyy-mm-dd
        c_banner_start_time: inputs?.start_time,
        c_banner_end_date: inputs?.end_date, //yyyy-mm-dd
        c_banner_end_time: inputs?.end_time,
        c_banner_position: inputs?.position, //"top", "bottom", "left", "right", "center"
        c_banner_view_pages: inputs?.page,
        c_banner_target_country_id: inputs?.country,
        c_banner_target_state_id: inputs?.state,
        c_banner_target_city_id: inputs?.city,
        c_target_device: inputs?.device,
        c_banner_width: inputs?.width,
        c_banner_height: inputs?.height,
      };
      CreateAd(body);
    }
  };

  const CreateAd = async (body: any) => {
    const results = await createAdvertisementApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
    } else {
      toast.success("Ad Created Successfully");
      setTimeout(() => {
        router.push(`/${i18LangStatus}/ads`);
      }, 500);
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setImage({ ...image, loader: false });
  };

  useEffect(() => {
    GetCountryList();
  }, []);

  return (
    <Fragment>
      <Container fluid>
        <Card className="mt-3">
          <CardBody>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    size="small"
                    required={true}
                    fullWidth
                    name="title"
                    value={inputs?.title}
                    onChange={handleChange}
                    error={errors?.includes("title")}
                    helperText={
                      errors?.includes("title") &&
                      "Title should contain more then 3 letters"
                    }
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Type"
                    variant="outlined"
                    size="small"
                    select
                    required={true}
                    fullWidth
                    name="type"
                    value={inputs?.type}
                    onChange={handleChange}
                    error={errors?.includes("type")}
                    helperText={
                      errors?.includes("type") && "please select type"
                    }
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    <MenuItem value="own_add">Own Ad</MenuItem>
                    <MenuItem value="google_add">Google Ad</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Target Device"
                    variant="outlined"
                    size="small"
                    select
                    required={true}
                    fullWidth
                    name="device"
                    value={inputs?.device}
                    onChange={handleChange}
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="web">Web</MenuItem>
                    <MenuItem value="mobile">Mobile</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Banner Position"
                    variant="outlined"
                    size="small"
                    select
                    required={true}
                    fullWidth
                    name="position"
                    value={inputs?.position}
                    onChange={handleChange}
                    error={errors?.includes("position")}
                    helperText={
                      errors?.includes("position") && "please select position"
                    }
                    sx={{
                      ".MuiFormHelperText-root": {
                        ml: 0,
                      },
                    }}
                  >
                    <MenuItem value="top">Top</MenuItem>
                    <MenuItem value="right_square">Right Square</MenuItem>
                    <MenuItem value="right_rectangle">Right Rectangle</MenuItem>
                    <MenuItem value="bottom">Bottom</MenuItem>
                    <MenuItem value="left_square">Left Square</MenuItem>
                    <MenuItem value="left_rectangle">Left Rectangle</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <TextField
                    id="outlined-basic"
                    label="Select Page To View"
                    variant="outlined"
                    size="small"
                    select
                    required={true}
                    fullWidth
                    name="page"
                    value={inputs?.page}
                    onChange={handleChange}
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="cinema">Cinema</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Start Date"
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        ".MuiFormLabel-root": {
                          color: "rgba(0, 0, 0, 0.6)",
                        },
                        width: "100%",
                      }}
                      value={dayjs(inputs?.start_date)}
                      minDate={dayjs(new Date())}
                      onAccept={(newValue: any) => {
                        setInputs({
                          ...inputs,
                          start_date: dayjs(newValue).format("YYYY-MM-DD"),
                        });
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              {inputs?.position !== "" && (
                <Fragment>
                  <Grid item xs={4}>
                    <TextField
                      id="outlined-basic"
                      label="Width"
                      variant="outlined"
                      size="small"
                      fullWidth
                      type="number"
                      name={"width"}
                      value={inputs?.width?.slice(0, 4)}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="outlined-basic"
                      label="Height"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name={"height"}
                      type="number"
                      value={inputs?.height?.slice(0, 3)}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Fragment>
              )}

              <Grid item xs={4}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      defaultValue={dayjs(new Date())}
                      label="Start Time"
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        ".MuiFormLabel-root": {
                          color: "rgba(0, 0, 0, 0.6)",
                        },
                        width: "100%",
                      }}
                      value={inputs?.start_time}
                      onAccept={(newValue) =>
                        setInputs({
                          ...inputs,
                          start_time: dayjs(newValue).format("h:mm:ss A"),
                        })
                      }
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="End Date"
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        ".MuiFormLabel-root": {
                          color: "rgba(0, 0, 0, 0.6)",
                        },
                        width: "100%",
                      }}
                      value={dayjs(inputs?.end_date)}
                      minDate={dayjs(new Date())}
                      onAccept={(newValue: any) => {
                        setInputs({
                          ...inputs,
                          end_date: dayjs(newValue).format("YYYY-MM-DD"),
                        });
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      defaultValue={dayjs(new Date())}
                      label="End Time"
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px",
                        },
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        ".MuiFormLabel-root": {
                          color: "rgba(0, 0, 0, 0.6)",
                        },
                        width: "100%",
                      }}
                      value={inputs?.end_time}
                      onAccept={(newValue) =>
                        setInputs({
                          ...inputs,
                          end_time: dayjs(newValue).format("h:mm:ss A"),
                        })
                      }
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  id="country"
                  options={countryArr}
                  getOptionLabel={(option: any) => option?.country_name}
                  onChange={(e, newVal, reason) =>
                    handleAutocompleteSelect(e, newVal, reason)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Country"
                      SelectProps={{
                        native: true,
                      }}
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={inputs?.country}
                      name={"country"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  id="state"
                  options={stateArr}
                  getOptionLabel={(option: any) => option?.state_name}
                  onChange={(e, newVal, reason) =>
                    handleAutocompleteSelect(e, newVal, reason)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select State"
                      SelectProps={{
                        native: true,
                      }}
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={inputs?.state}
                      name={"state"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  id="city"
                  getOptionLabel={(option: any) => option?.city_name}
                  options={cityArr}
                  onChange={(e, newVal, reason) =>
                    handleAutocompleteSelect(e, newVal, reason)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select City"
                      SelectProps={{
                        native: true,
                      }}
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={inputs?.city}
                      name={"city"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                {image?.src ? (
                  <Box
                    textAlign={"center"}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <Image
                      src={image && image?.src}
                      alt=""
                      width={100}
                      height={100}
                      style={{
                        borderRadius: "14px",
                        boxShadow: "0px 0px 13px 0px rgba(0,0,0,0.75)",
                      }}
                    />
                    <Box>
                      <p
                        style={{
                          minHeight: "5em",
                          overflow: "auto",
                          paddingInline: "12px",
                        }}
                      >
                        {image.name}
                      </p>
                    </Box>
                    <Box>
                      {image.loader ? (
                        <Spinner size={"sm"} />
                      ) : (
                        <IoTrash
                          onClick={DeleteImage}
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      sx={{ py: 2.5 }}
                      startIcon={<FaUpload />}
                      endIcon={image?.loader && <Spinner size={"sm"} />}
                      disabled={image?.loader}
                    >
                      Upload Banner
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleUpload}
                      />
                    </Button>
                    {errors?.includes("image") && (
                      <p style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
                        please upload Image with less than 5mb
                      </p>
                    )}
                  </Box>
                )}
              </Grid>

              <Grid item xs={8}>
                {image.src && (
                  <Box>
                    <TextField
                      id="outlined-basic"
                      label="Redirect URL"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      fullWidth
                      name={"redirect_url"}
                      value={inputs?.redirect_url}
                      onChange={handleChange}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={1.4}>
                {/* <Link href={`/${i18LangStatus}/ads`}> */}
                <Button variant="outlined" fullWidth>
                  Cancel
                </Button>
                {/* </Link> */}
              </Grid>
              <Grid item xs={1.4}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ color: "#fff" }}
                  onClick={() => AddAdvertisement()}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </Container>
      {/* <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          ".MuiPaper-root": {
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "end" }}>
          <IoCloseCircle onClick={closeDialog} style={{ cursor: "pointer" }} />
        </DialogTitle>
        <DialogContent>
          <StyledDemo
            imageSource={forCrop}
            width={inputs?.width}
            height={inputs?.height}
            closeFunction={() => setOpen(false)}
            setImageFlag={setImageFlag}
            fileName={image?.name}
          />
        </DialogContent>
      </Dialog> */}
    </Fragment>
  );
};

export default CreateAdContainer;
