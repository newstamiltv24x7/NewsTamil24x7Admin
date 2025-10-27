import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Skeleton,
  TablePagination,
  TextField,
  styled,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import { FaUpload } from "react-icons/fa6";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  addSocialHandlePost,
  createSocialCategory,
  deleteSocialList,
  deleteSocialMedia,
  getSocialHandlesList,
  getSocialMediaList,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import SocialPop from "./SocialPop";
import { IoCloseCircle } from "react-icons/io5";

function SocialHandlePageContainer() {
  const [value, setValue] = React.useState("1");
  const [socialList, setSocialList] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [inputs, setInputs] = useState({
    name: "",
    rules: "",
    type: "",
    page: "",
    id: "",
    social: "",
    status: 1,
  });
  const [addType, setType] = useState("");
  const [category, setCategory] = useState("");
  const [expired, setExpired] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const handleInputChange = (e: any) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const GetSocialMedia = async () => {
    const results = await getSocialMediaList();
    setSocialList(results?.payloadJson);
  };

  const GetSocialList = async () => {
    setLoader(true);
    try {
      const body = {
        n_page: page + 1,
        n_limit: rowsPerPage,
        c_search_term: search,
      };
      const results = await getSocialHandlesList(body);
      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
          setLoader(false);
          setAdList([]);
          setInitFlag(true);
          setCount(0);
        } else {
          setInitFlag(true);
          setLoader(false);
          const live = results?.payloadJson
            ?.at(0)
            ?.data?.filter(
              (item: any) => item?.c_social_handle_page_status === "Live"
            );
          const deletedData = results?.payloadJson
            ?.at(0)
            ?.data?.filter(
              (item: any) => item?.c_social_handle_page_status === "Deleted"
            );
          const expiredData = results?.payloadJson
            ?.at(0)
            ?.data?.filter(
              (item: any) => item?.c_social_handle_page_status === "Expired"
            );
          setAdList(live);
          setDeleted(deletedData);
          setExpired(expiredData);
          setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
        }
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const body = {
        c_social_handle_category_id: inputs?.id,
        c_social_handle_page_title: inputs?.social,
        c_social_handle_page_name: inputs?.name,
        c_social_handle_page_h_rules_name: inputs?.rules,
        c_social_handle_page_status: inputs?.page,
        c_social_handle_page_type: inputs?.type,
      };
      const results = await addSocialHandlePost(body);
      if (results?.appStatusCode === 0) {
        GetSocialList();
        setOpen(false);
        toast?.success(results?.message);
      } else {
        toast?.error(results?.error);
      }
    } catch (err: any) {
      toast?.error(err);
    }
  };

  const DeleteTag = async (id: string) => {
    setLoader(true);
    try {
      const results = await deleteSocialList(id);
      if (results?.appStatusCode === 0) {
        setLoader(false);
        GetSocialList();
        toast?.success(results?.message);
      } else {
        setLoader(false);
        toast?.error(results?.error);
      }
    } catch (err: any) {
      setLoader(false);
      toast?.error(err);
    }
  };

  const handleClick = (list: any) => {
    setOpen(true);
    setType("");
    setTitle(`Add ${list?.c_social_handle_category_title}`);
    setInputs({
      ...inputs,
      id: list?.c_social_handle_category_id,
      social: list?.c_social_handle_category_title,
      name: "",
      rules: "",
      type: "",
      page: "",
      status: 1,
    });
  };

  const handleEdit = (list: any) => {
    setOpen(true);
    setTitle(`Edit ${list?.c_social_handle_page_title}`);
    setInputs({
      ...inputs,
      id: list?.c_social_handle_category_id,
      social: list?.c_social_handle_category_title,
      name: list?.c_social_handle_page_name,
      rules: list?.c_social_handle_page_h_rules_name,
      type: list?.c_social_handle_page_type,
      page: list?.c_social_handle_page_status,
    });
  };

  const handleAdd = () => {
    setType("ADD");
    setOpen(true);
    setTitle("Add Main Category");
    setCategory("");
  };

  const handleCategory = async () => {
    const results = await createSocialCategory({
      c_social_handle_category_title: category,
    });
    if (results.appStatusCode === 0) {
      toast.success(results?.message);
      const obj = [
        {
          c_social_handle_category_title: category,
        },
      ];
      const merged = socialList?.concat(obj);
      setSocialList(merged);
      GetSocialMedia();
      setOpen(false);
    } else {
      toast?.error(results?.error);
    }
  };

  const handleDeleteSocial = async (e: any, id: any) => {
    e.stopPropagation();
    const results = await deleteSocialMedia(id);
    if (results?.appStatusCode === 0) {
      toast?.success(results?.message);
      GetSocialMedia();
    }
  };

  useEffect(() => {
    GetSocialMedia();
    GetSocialList();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm="12" className="mt-2">
            <Card>
              <CardBody className="pt-0">
                <Box mt={2}>
                  <Box sx={{ width: "100%", typography: "body1" }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab label="Live" value="1" />
                          <Tab label="Expired" value="2" />
                          <Tab label="Deleted" value="3" />
                        </TabList>
                      </Box>
                      <TabPanel value="1">
                        <Box>
                          <Box
                            mb={2}
                            display={"flex"}
                            justifyContent={"center"}
                          >
                            {Array.isArray(socialList) &&
                              socialList?.map((list: any) => (
                                <Button
                                  variant="outlined"
                                  key={list?._id}
                                  endIcon={
                                    <IoCloseCircle
                                      style={{ zIndex: 20 }}
                                      onClick={(e: any) =>
                                        handleDeleteSocial(e, list?._id)
                                      }
                                    />
                                  }
                                  sx={{
                                    mx: 1,
                                    textTransform: "capitalize",
                                    fontSize: 12,
                                  }}
                                  onClick={() => handleClick(list)}
                                >
                                  {list?.c_social_handle_category_title}
                                </Button>
                              ))}
                            <Button
                              variant="contained"
                              sx={{ mx: 1, fontSize: 12 }}
                              onClick={() => handleAdd()}
                            >
                              Add
                            </Button>
                          </Box>
                          <Table responsive className={`table-wrapper`}>
                            <thead style={{ background: "#000" }}>
                              <tr>
                                <th style={{ color: "#fff" }}>S.No</th>
                                <th style={{ color: "#fff" }}>Social</th>
                                <th style={{ color: "#fff" }}>Page</th>
                                <th style={{ color: "#fff" }}>H-Rule Name</th>
                                {/* <th style={{ color: "#fff" }}>
                                  No of Social Post
                                </th> */}
                                <th style={{ color: "#fff" }}>Page Id</th>
                                <th style={{ color: "#fff" }}>Type</th>
                                <th style={{ color: "#fff" }}>Managed By</th>
                                <th
                                  style={{ color: "#fff", textAlign: "center" }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            {loader ? (
                              <tbody>
                                {[1, 2, 3, 4, 5]?.map((list) => (
                                  <tr key={list}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
                                      <td>
                                        <Skeleton
                                          animation="wave"
                                          variant="rectangular"
                                          width={"100%"}
                                          height={"7vh"}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            ) : (
                              <tbody>
                                {Array.isArray(adList) &&
                                  adList?.map((list: any, index: number) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {list?.c_social_handle_page_title}
                                      </td>
                                      <td>{list?.c_social_handle_page_name}</td>
                                      <td>
                                        {
                                          list?.c_social_handle_page_h_rules_name
                                        }
                                      </td>
                                      <td>{list?.c_social_handle_page_id}</td>
                                      <td>{list?.c_social_handle_page_type}</td>
                                      <td>{list?.c_createdName}</td>

                                      <td align="left">
                                        <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                          justifyContent={"center"}
                                          gap={2}
                                        >
                                          {list?.n_status === 1 ? (
                                            <Box
                                              p={1}
                                              bgcolor={"#00ac47"}
                                              borderRadius={"50%"}
                                              width={10}
                                              height={10}
                                            ></Box>
                                          ) : (
                                            <Box
                                              p={1}
                                              borderRadius={"50%"}
                                              width={10}
                                              height={10}
                                              bgcolor={"#ff3131"}
                                            ></Box>
                                          )}
                                          <BiSolidMessageAltEdit
                                            style={{
                                              fontSize: "20px",
                                              cursor: "pointer",
                                              color: "#000",
                                            }}
                                            onClick={() => handleEdit(list)}
                                          />
                                          {/* </Link> */}
                                          <RiDeleteBin5Line
                                            style={{
                                              fontSize: "20px",
                                              color: "red",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => DeleteTag(list?._id)}
                                          />
                                        </Box>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            )}
                          </Table>
                        </Box>
                      </TabPanel>
                      <TabPanel value="2">
                        <Box>
                          <Box
                            mb={2}
                            display={"flex"}
                            justifyContent={"center"}
                          ></Box>
                          <Table responsive className={`table-wrapper`}>
                            <thead style={{ background: "#000" }}>
                              <tr>
                                <th style={{ color: "#fff" }}>S.No</th>
                                <th style={{ color: "#fff" }}>Social</th>
                                <th style={{ color: "#fff" }}>Page</th>
                                <th style={{ color: "#fff" }}>H-Rule Name</th>
                                {/* <th style={{ color: "#fff" }}>
                                  No of Social Post
                                </th> */}
                                <th style={{ color: "#fff" }}>Page Id</th>
                                <th style={{ color: "#fff" }}>Type</th>
                                <th style={{ color: "#fff" }}>Managed By</th>
                                <th
                                  style={{ color: "#fff", textAlign: "center" }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>

                            {loader ? (
                              <tbody>
                                {[1, 2, 3, 4, 5]?.map((list) => (
                                  <tr key={list}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
                                      <td>
                                        <Skeleton
                                          animation="wave"
                                          variant="rectangular"
                                          width={"100%"}
                                          height={"7vh"}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            ) : (
                              <tbody>
                                {Array.isArray(expired) &&
                                  expired?.map((list: any, index: number) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {list?.c_social_handle_page_title}
                                      </td>
                                      <td>{list?.c_social_handle_page_name}</td>
                                      <td>
                                        {
                                          list?.c_social_handle_page_h_rules_name
                                        }
                                      </td>
                                      <td>{list?.c_social_handle_page_id}</td>
                                      <td>{list?.c_social_handle_page_type}</td>
                                      <td>{list?.c_createdName}</td>

                                      <td align="left">
                                        <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                          justifyContent={"center"}
                                          gap={2}
                                        >
                                          {list?.n_status === 1 ? (
                                            <Box
                                              p={1}
                                              bgcolor={"#00ac47"}
                                              borderRadius={"50%"}
                                              width={10}
                                              height={10}
                                            ></Box>
                                          ) : (
                                            <Box
                                              p={1}
                                              borderRadius={"50%"}
                                              width={10}
                                              height={10}
                                              bgcolor={"#ff3131"}
                                            ></Box>
                                          )}
                                          <BiSolidMessageAltEdit
                                            style={{
                                              fontSize: "20px",
                                              cursor: "pointer",
                                              color: "#000",
                                            }}
                                            onClick={() => handleEdit(list)}
                                          />
                                          {/* </Link> */}
                                          <RiDeleteBin5Line
                                            style={{
                                              fontSize: "20px",
                                              color: "red",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => DeleteTag(list?._id)}
                                          />
                                        </Box>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            )}
                          </Table>
                          {!loader && initFlag && expired?.length === 0 && (
                            <Box textAlign={"center"} my={4}>
                              <BsDatabaseX style={{ fontSize: "40px" }} />
                              <br />
                              <Label style={{ fontSize: "20px" }}>
                                No Data Found{" "}
                              </Label>
                            </Box>
                          )}
                        </Box>
                      </TabPanel>
                      <TabPanel value="3">
                        <Box>
                          <Box
                            mb={2}
                            display={"flex"}
                            justifyContent={"center"}
                          ></Box>
                          <Table responsive className={`table-wrapper`}>
                            <thead style={{ background: "#000" }}>
                              <tr>
                                <th style={{ color: "#fff" }}>S.No</th>
                                <th style={{ color: "#fff" }}>Social</th>
                                <th style={{ color: "#fff" }}>Page</th>
                                <th style={{ color: "#fff" }}>H-Rule Name</th>
                                {/* <th style={{ color: "#fff" }}>
                                  No of Social Post
                                </th> */}
                                <th style={{ color: "#fff" }}>Page Id</th>
                                <th style={{ color: "#fff" }}>Type</th>
                                <th style={{ color: "#fff" }}>Managed By</th>
                                <th
                                  style={{ color: "#fff", textAlign: "center" }}
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>

                            {loader ? (
                              <tbody>
                                {[1, 2, 3, 4, 5]?.map((list) => (
                                  <tr key={list}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
                                      <td>
                                        <Skeleton
                                          animation="wave"
                                          variant="rectangular"
                                          width={"100%"}
                                          height={"7vh"}
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            ) : (
                              <tbody>
                                {Array.isArray(deleted) &&
                                  deleted?.map((list: any, index: number) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {list?.c_social_handle_page_title}
                                      </td>
                                      <td>{list?.c_social_handle_page_name}</td>
                                      <td>
                                        {
                                          list?.c_social_handle_page_h_rules_name
                                        }
                                      </td>
                                      <td>{list?.c_social_handle_page_id}</td>
                                      <td>{list?.c_social_handle_page_type}</td>
                                      <td>{list?.c_createdName}</td>

                                      <td align="left">
                                        <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                          justifyContent={"center"}
                                          gap={2}
                                        >
                                          {list?.n_status === 1 ? (
                                            <Box
                                              p={1}
                                              bgcolor={"#00ac47"}
                                              borderRadius={"50%"}
                                              width={10}
                                              height={10}
                                            ></Box>
                                          ) : (
                                            <Box
                                              p={1}
                                              borderRadius={"50%"}
                                              width={10}
                                              height={10}
                                              bgcolor={"#ff3131"}
                                            ></Box>
                                          )}
                                          <BiSolidMessageAltEdit
                                            style={{
                                              fontSize: "20px",
                                              cursor: "pointer",
                                              color: "#000",
                                            }}
                                            onClick={() => handleEdit(list)}
                                          />
                                          {/* </Link> */}
                                          <RiDeleteBin5Line
                                            style={{
                                              fontSize: "20px",
                                              color: "red",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => DeleteTag(list?._id)}
                                          />
                                        </Box>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            )}
                          </Table>
                          {!loader && initFlag && deleted?.length === 0 && (
                            <Box textAlign={"center"} my={4}>
                              <BsDatabaseX style={{ fontSize: "40px" }} />
                              <br />
                              <Label style={{ fontSize: "20px" }}>
                                No Data Found{" "}
                              </Label>
                            </Box>
                          )}
                        </Box>
                      </TabPanel>
                    </TabContext>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <SocialPop
        open={open}
        close={() => setOpen(false)}
        title={title}
        inputs={inputs}
        handleChange={handleInputChange}
        handleSubmit={handleSubmit}
        addType={addType}
        setCategory={setCategory}
        category={category}
        handleCategory={handleCategory}
      />
    </div>
  );
}

export default SocialHandlePageContainer;
