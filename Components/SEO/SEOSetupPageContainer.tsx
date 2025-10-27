import { Box, Button, Grid, TextField, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUpload } from "react-icons/fa6";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import WebStory from "./WebStory";
import {
  addSeoCategoryApi,
  createSeoSetupApi,
  getAllSeoListApi,
  getSeoSetupListApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import Image from "next/image";
import AddSeoCategoryPop from "./AddSeoCategoryPop";

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

function SEOSetupPageContainer() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = React.useState("1");
  const [radioVal, setRadioVal] = useState("library");
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState(false);
  const [imgLoader, setImgLoader] = useState(false);
  const [adList, setAdList] = useState<any>([]);
  const [image, setImage] = useState("");
  const [inputs, setInputs] = useState({
    c_seo_content_id: "",
    title: "",
    desc: "",
    keywords: "",
    c_image: "",
    seo_id: "",
    url: "",
  });

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState<any>(false);
  const [input, setInput] = useState<any>({
    c_seo_category_title: "",
  });
  const [errors, setErrors] = useState<any[]>([]);

  const handleSeoInputChange = (e: any) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSeoAddCategory = async () => {
    let arr: any[] = [];
    Object.keys(input).map((val) => {
      if (val === "name") {
        (input.c_seo_category_title === "" ||
          input.c_seo_category_title.length < 4) &&
          arr.push(val);
      }
      return arr;
    });
    setErrors(arr);
    const body = {
      c_seo_category_title: input.c_seo_category_title,
    };
    const results = await addSeoCategoryApi(body);
    if (results.appStatusCode !== 0) {
      setAddOpen(false);
      results?.error?.codeName === "DuplicateKey" &&
        toast.error("Category Already Exists");
      toast.error(results?.error);
    } else {
      setAddOpen(false);
      toast.success(results?.message);
      GetTags();
    }
  };

  const handleBlur = () => {
    if (input.c_seo_category_title.length > 3) {
    } else {
      setInput({ ...inputs, c_seo_category_title: "" });
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    radioVal === "utube" ? setImage("") : setInputs({ ...inputs, url: "" });
  }, [radioVal]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSave = async () => {
    try {
      const body = {
        c_seo_content_id: inputs?.c_seo_content_id,
        c_seo_category_id: inputs?.seo_id,
        c_seo_page_title: inputs?.title,
        c_seo_page_description: inputs?.desc,
        c_seo_page_keywords: inputs?.keywords,
        c_seo_social_image_sharing: [
          {
            c_img_url: image,
            c_youtube_url: inputs?.url,
          },
        ],
        c_seo_scripts: [
          {
            c_header_tag: "",
            c_body_tag: "",
            c_amp_header_tag: "",
            c_amp_body_tag: "",
          },
        ],
      };
      const results = await createSeoSetupApi(body);
      if (results?.appStatusCode !== 0) {
        toast?.error(results?.error);
        GetAllSeoList();
      } else {
        toast?.success(results?.message);
        GetAllSeoList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetTags = async () => {
    setLoader(true);
    try {
      const body = {
        n_page: 1,
        n_limit: 5,
        c_search_term: "",
      };
      const results = await getSeoSetupListApi(body);
      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
          setLoader(false);
          setAdList([]);
        } else {
          setLoader(false);
          setAdList(results?.payloadJson?.at(0)?.data);
          setInputs({
            ...inputs,
            seo_id: results?.payloadJson?.at(0)?.data?.at(0)?.c_seo_category_id,
          });
          setTitle(
            results?.payloadJson?.at(0)?.data?.at(0)?.c_seo_category_title
          );
        }
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  const GetAllSeoList = async () => {
    try {
      const results = await getAllSeoListApi();

      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
        } else {
          setInputs({
            ...inputs,
            c_seo_content_id: results.payloadJson[0].c_seo_content_id,
            title: results.payloadJson[0].c_seo_page_title,
            desc: results.payloadJson[0].c_seo_page_description,
            keywords: results.payloadJson[0].c_seo_page_keywords,
            c_image:
              results.payloadJson[0].c_seo_social_image_sharing[0].c_img_url,
            seo_id: results.payloadJson[0].c_seo_category_id,
            url: "",
          });
        }
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err: any) {
      toast?.error(err);
    }
  };

  const handleUpload = (e: any) => {
    if (e) {
      // setMediaType("image");
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 1024000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "seo image");
        ImageUpload(formData);
        setImgLoader(true);
        setInputs({ ...inputs, c_image: fileName });
        // setImageArr([...imageArr, ...files]);
      } else {
        toast.error("Please upload less than 1mb");
      }
    }
  };

  const ImageUpload = async (body: any) => {
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      setImgLoader(false);
      toast.error(results?.error);
    } else {
      setImgLoader(false);
      setImage(results?.payloadJson?.c_file_url);
      setInputs({ ...inputs, c_image: results?.payloadJson?.c_file });
    }
  };

  const handleDelete = async () => {
    setImgLoader(true);
    const results = await imageDeleteApi({
      c_file: inputs?.c_image,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImgLoader(false);
    } else {
      toast.success(results?.message);
      setImgLoader(false);
      setImage("");
      setInputs({ ...inputs, c_image: "" });
    }
  };

  const handleSelectTab = (list: any) => {
    setInputs({
      ...inputs,
      seo_id: list?.c_seo_category_id,
      title: "",
      desc: "",
      keywords: "",
      c_image: "",
      url: "",
    });
    setTitle(list?.c_seo_category_title);
    setImage("");
  };

  useEffect(() => {
    GetTags();
    GetAllSeoList();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm="12" className="mt-2">
            <Card>
              <CardBody className="pt-0">
                {/* <Box my={2} display={"flex"} justifyContent={"flex-end"}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setAddOpen(true);
                      setInput({
                        c_seo_category_title: "",
                      });
                    }}
                  >
                    Add Seo Page
                  </Button>
                </Box> */}
                <Box mt={2}>
                  <Box sx={{ width: "100%", typography: "body1" }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          {adList?.map((list: any, index: any) => (
                            <Tab
                              label={list?.c_seo_category_title}
                              key={list?._id}
                              value={(index + 1)?.toString()}
                              onClick={() => handleSelectTab(list)}
                              sx={{
                                fontFamily: `"Montserrat", sans-serif`,
                                fontSize: 12,
                              }}
                            />
                          ))}
                        </TabList>
                      </Box>
                      <TabPanel
                        value={
                          adList?.at(0)?.c_seo_category_title === "Home"
                            ? "1"
                            : ""
                        }
                      >
                        <Box>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Page Title"
                                variant="outlined"
                                type="text"
                                name="title"
                                size="small"
                                value={inputs?.title}
                                onChange={handleInputChange}
                                // error={errors?.includes("title")}
                                // helperText={errors?.includes("title") && "Please enter title"}
                                sx={{
                                  ".MuiFormHelperText-root": {
                                    ml: 0,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Page Description"
                                variant="outlined"
                                type="text"
                                name="desc"
                                size="small"
                                multiline
                                rows={3}
                                value={inputs?.desc}
                                onChange={handleInputChange}
                                // error={errors?.includes("title")}
                                // helperText={errors?.includes("title") && "Please enter title"}
                                sx={{
                                  ".MuiFormHelperText-root": {
                                    ml: 0,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Keywords"
                                variant="outlined"
                                type="text"
                                name="keywords"
                                size="small"
                                multiline
                                rows={3}
                                value={inputs?.keywords}
                                onChange={handleInputChange}
                                // error={errors?.includes("title")}
                                // helperText={errors?.includes("title") && "Please enter title"}
                                sx={{
                                  ".MuiFormHelperText-root": {
                                    ml: 0,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={image ? 6 : 4}>
                              {image ? (
                                <Box
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                  alignItems={"center"}
                                >
                                  <Image
                                    src={image}
                                    alt=""
                                    width={150}
                                    height={120}
                                    style={{ borderRadius: 6 }}
                                  />
                                  <p
                                    style={{
                                      marginBottom: 0,
                                      width: "75%",
                                      height: "24px",
                                      overflow: "auto",
                                      textOverflow: "ellipsis",
                                      textAlign: "center",
                                    }}
                                  >
                                    {inputs?.c_image}
                                  </p>
                                  {imgLoader ? (
                                    <Spinner size={"sm"} />
                                  ) : (
                                    <RiDeleteBin5Line
                                      style={{
                                        color: "red",
                                        fontSize: "24px",
                                        cursor: "pointer",
                                      }}
                                      onClick={handleDelete}
                                    />
                                  )}
                                </Box>
                              ) : (
                                <Button
                                  component="label"
                                  variant="outlined"
                                  fullWidth
                                  sx={{ py: 2.5 }}
                                  startIcon={<FaUpload />}
                                  endIcon={imgLoader && <Spinner size={"sm"} />}
                                  disabled={imgLoader}
                                >
                                  Social Share Image
                                  <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleUpload}
                                  />
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                          <Box
                            my={2}
                            display={"flex"}
                            justifyContent={"flex-end"}
                          >
                            <Button variant="contained" onClick={handleSave}>
                              {inputs.c_seo_content_id === ""
                                ? "Add"
                                : "Update"}
                            </Button>
                          </Box>
                        </Box>
                      </TabPanel>
                      <TabPanel
                        value={
                          adList?.at(1)?.c_seo_category_title === "Photo Story"
                            ? "2"
                            : ""
                        }
                      >
                        <WebStory
                          radioVal={radioVal}
                          setRadioVal={setRadioVal}
                          inputs={inputs}
                          handleInputChange={handleInputChange}
                          handleUpload={handleUpload}
                          image={image}
                          imgLoader={imgLoader}
                          handleDelete={handleDelete}
                          handleSave={handleSave}
                        />
                      </TabPanel>
                      <TabPanel value="3">Static Page</TabPanel>
                      <TabPanel value="4">Header/Body Script</TabPanel>
                      <TabPanel value="5">Category SEo</TabPanel>
                    </TabContext>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddSeoCategoryPop
        open={addOpen}
        close={() => setAddOpen(false)}
        title="Add Seo Page"
        handleSeoInputChange={handleSeoInputChange}
        input={input}
        handleBlur={handleBlur}
        handleSeoAddCategory={handleSeoAddCategory}
      />
    </div>
  );
}

export default SEOSetupPageContainer;
