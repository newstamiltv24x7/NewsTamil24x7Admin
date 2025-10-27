import {
  Box,
  Button,
  InputAdornment,
  Skeleton,
  TablePagination,
  TextField,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Label, Row, Table } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import AddStaticPagePop from "./AddStaticPagePop";
import { toast } from "react-toastify";
import {
  GetStaticPagesListMenu,
  addStaticPageData,
  deleteStaticListAPi,
  getStaticPageList,
} from "@/apiFunctions/ApiAction";
import { IoMdClose } from "react-icons/io";

function StaticPageContainer() {
  const [search, setSearch] = useState("");
  const [staticList, setStaticList] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [inputs, setInputs] = useState({
    page_id: "",
    title: "",
    description: "",
    keywords: "",
    content: "",
    id: "",
  });
  const [menuList, setMenuList] = useState([]);

  const handleChange = (e: any) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const [joditContent, setJoditContent] = useState("");

  const handleChangeJodit = (value: any) => {
    setJoditContent(value);
  };

  const handleClose = () => {
    setOpen(false);
    setInputs({
      page_id: "",
      title: "",
      description: "",
      keywords: "",
      content: "",
      id: "",
    });
    setJoditContent("");
  };

  const handleSubmit = async () => {
    try {
      const body = {
        c_static_menu_page_id: inputs?.page_id,
        c_static_page_title: inputs?.title,
        c_static_page_description: inputs?.description,
        c_static_page_keywords: inputs?.keywords,
        c_static_page_content: joditContent,
        Id: inputs?.id,
      };

      const results = await addStaticPageData(body);
      if (results?.appStatusCode === 0) {
        GetTags();
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
      const results = await deleteStaticListAPi(id);
      if (results?.appStatusCode === 0) {
        setLoader(false);
        GetTags();
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

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetTags = async () => {
    setLoader(true);
    try {
      const body = {
        n_page: page + 1,
        n_limit: rowsPerPage,
        c_search_term: search,
      };
      const results = await getStaticPageList(body);
      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
          setLoader(false);
          setStaticList([]);
          setInitFlag(true);
          setCount(0);
        } else {
          setInitFlag(true);
          setLoader(false);
          setStaticList(results?.payloadJson?.at(0)?.data);
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

  const GetMenuPage = async () => {
    setLoader(true);
    try {
      const results = await GetStaticPagesListMenu();
      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
          setLoader(false);
          setInitFlag(true);
          setMenuList([]);
        } else {
          setInitFlag(true);
          setLoader(false);
          setMenuList(results?.payloadJson);
        }
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetTags();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleEdit = (list: any) => {
    setOpen(true);
    setTitle("Edit Static Page");
    setInputs({
      ...inputs,
      page_id: list?.c_static_menu_page_id,
      title: list?.c_static_page_title,
      description: list?.c_static_page_description,
      keywords: list?.c_static_page_keywords,
      id: list?._id,
    });
    setJoditContent(list?.c_static_page_content);
  };
  const searchClear =() =>{
    setSearch("");
  }
  useEffect(() => {
    GetTags();
    setLoader(true);
  }, [page, rowsPerPage]);

  useEffect(() => {
    GetTags();
    GetMenuPage();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm="12" className="mt-2">
            <Card>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box pl={2.5} my={2}>
                  <TextField
                    placeholder="Search ..."
                    fullWidth
                    value={search}
                    size="small"
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiSearch2Line />
                        </InputAdornment>
                      ),
                      endAdornment:(
                        <InputAdornment position="end">
                          <IoMdClose style={{ fontSize: "20px", cursor:"pointer", display: search.length > 0 ? "block":"none" }} onClick={()=>searchClear()} />
                          </InputAdornment>
                      )
                    }}
                  />
                </Box>
                {/* <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#fe6a49",
                    color: "#fff",
                    mr: 2,
                    textTransform: "capitalize",
                    "&:hover": {
                      bgcolor: "#fe6a49",
                    },
                  }}
                  onClick={() => {
                    setOpen(true);
                    setTitle("Add Static Page");
                    setInputs({
                      page_id: "",
                      title: "",
                      description: "",
                      keywords: "",
                      content: "",
                      id: "",
                    });
                    setJoditContent("")
                  }}
                >
                  Add Static Page
                </Button> */}
              </Box>
              <CardBody className="pt-0">
                <>
                  <Table responsive className={`table-wrapper`}>
                    <thead style={{ background: "#000" }}>
                      <tr>
                        <th style={{ color: "#fff" }}>S.No</th>
                        {/* <th style={{ color: "#fff" }}> Page Name</th> */}
                        <th style={{ color: "#fff" }}>Static Page Title</th>
                        <th style={{ color: "#fff" }}>Static Page content</th>
                        <th style={{ color: "#fff", textAlign: "center" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    {loader ? (
                      <tbody>
                        {[1, 2, 3, 4]?.map((list) => (
                          <tr key={list}>
                            {[1, 2, 3, 4]?.map((item) => (
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
                        {Array.isArray(staticList) &&
                          staticList?.map((row, index) => (
                            <tr key={index}>
                              <td scope="row">
                                {index + 1 + page * rowsPerPage}
                              </td>
                              {/* <td className="">{row?.c_static_page_name}</td> */}
                              <td>{row?.c_static_page_title}</td>
                              <td>
                                <p className="mb-0 textWrapper py-18">
                                  {row?.c_static_page_content}
                                </p>{" "}
                              </td>

                              <td align="left">
                                <Box
                                  display={"flex"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  gap={2}
                                >
                                  {/* {row?.n_status === 1 ? (
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
                            )} */}
                                  {/* <Link
                              href={{
                                pathname: `/${i18LangStatus}/ads/edit-ad/${row?.c_advt_id}`,
                                // query: { id: encodeURIComponent(row.media.toString()) },
                              }}
                            > */}
                                  <BiSolidMessageAltEdit
                                    style={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#000",
                                    }}
                                    onClick={() => handleEdit(row)}
                                  />
                                  {/* </Link> */}
                                  <RiDeleteBin5Line
                                    style={{
                                      fontSize: "20px",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => DeleteTag(row?._id)}
                                  />
                                </Box>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    )}
                  </Table>
                  {!loader && initFlag && staticList?.length === 0 && (
                    <Box textAlign={"center"} my={4}>
                      <BsDatabaseX style={{ fontSize: "40px" }} />
                      <br />
                      <Label style={{ fontSize: "20px" }}>No Data Found </Label>
                    </Box>
                  )}
                  {!loader && staticList?.length !== 0 && (
                    <TablePagination
                      component="div"
                      count={Number(count)}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[5, 10, 50, 100]}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        ".MuiTablePagination-selectLabel": {
                          mb: 0,
                        },
                        ".MuiTablePagination-displayedRows": {
                          mb: 0,
                        },
                        width: "100%",
                      }}
                    />
                  )}
                </>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddStaticPagePop
        open={open}
        close={handleClose}
        title={title}
        inputs={inputs}
        menuList={menuList}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleChangeJodit={handleChangeJodit}
        joditContent={joditContent}
      />
    </div>
  );
}

export default StaticPageContainer;
