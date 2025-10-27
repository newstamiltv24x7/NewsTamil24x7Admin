import {
  Box,
  Button,
  InputAdornment,
  Skeleton,
  TablePagination,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Label, Row, Table } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import {
  createNewForm,
  deleteForm,
  getFormPageList,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import { converDayJsDate } from "@/helper/frontend_helper";
import AddFormName from "./AddFormName";

function FormNamePageContainer() {
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
    display: "",
    from: "",
    id: "",
  });

  const handleChange = (e: any) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const body = {
        c_display_name: inputs?.display,
        c_from_name: inputs?.from,
        Id: inputs?.id,
      };
      const results = await createNewForm(body);
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
      const results = await deleteForm(id);
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
      const results = await getFormPageList(body);
      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
          setLoader(false);
          setAdList([]);
          setCount(0);
        } else {
          setLoader(false);
          setAdList(results?.payloadJson?.at(0)?.data);
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

  useEffect(() => {
    if (initFlag) {
      let timer = setTimeout(() => {
        GetTags();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [search]);

  const handleEdit = (list: any) => {
    setOpen(true);
    setInputs({
      ...inputs,
      display: list?.c_display_name,
      from: list?.c_from_name,
      id: list?._id,
    });
    setTitle("Edit Form");
  };

  useEffect(() => {
    if (initFlag) {
      GetTags();
      setLoader(true);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    GetTags();
    setInitFlag(true);
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
                    }}
                  />
                </Box>
                <Button
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
                    setTitle("Add Form");
                    setInputs({ display: "", from: "", id: "" });
                  }}
                >
                  Add
                </Button>
              </Box>
              <CardBody className="pt-0">
                <>
                  <Table responsive className={`table-wrapper`}>
                    <thead style={{ background: "#000" }}>
                      <tr>
                        <th style={{ color: "#fff" }}>S.No</th>
                        <th style={{ color: "#fff", width: 300 }}>
                          Display Name
                        </th>
                        <th style={{ color: "#fff", width: 300 }}>Form Name</th>
                        <th style={{ color: "#fff" }}>Created By</th>
                        <th style={{ color: "#fff", textAlign: "center" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    {loader ? (
                      <tbody>
                        {[1, 2, 3, 4, 5]?.map((list) => (
                          <tr key={list}>
                            {[1, 2, 3, 4, 5]?.map((item) => (
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
                          adList?.map((row, index) => (
                            <tr key={index}>
                               <td scope="row">{index + 1 + (page * rowsPerPage)}</td>

                              <td>
                                <p className="mb-0">{row?.c_display_name}</p>
                              </td>

                              <td>
                                <p className="mb-0">{row?.c_from_name}</p>
                              </td>

                              <td>{row?.c_createdName}</td>
                              <td align="left">
                                <Box
                                  display={"flex"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  gap={2}
                                >
                                  {row?.n_status === 1 ? (
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
                  {!loader && initFlag && adList?.length === 0 && (
                    <Box textAlign={"center"} my={4}>
                      <BsDatabaseX style={{ fontSize: "40px" }} />
                      <br />
                      <Label style={{ fontSize: "20px" }}>
                        No Data Found{" "}
                      </Label>
                    </Box>
                  )}
                  {!loader && adList?.length !== 0 && (
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
      <AddFormName
        open={open}
        close={() => setOpen(false)}
        title={title}
        inputs={inputs}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default FormNamePageContainer;
