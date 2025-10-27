import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import {
  Box,
  Button,
  InputAdornment,
  Skeleton,
  TablePagination,
  TextField,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Label, Row, Table } from "reactstrap";
import { BsDatabaseX } from "react-icons/bs";
import {
  addCommentsApi,
  deleteCommentsApi,
  getAllCommentsApi,
} from "@/apiFunctions/ApiAction";
import AddComments from "./AddComments";
import { toast } from "react-toastify";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { converDayJsDate } from "@/helper/frontend_helper";
import { RiSearch2Line } from "react-icons/ri";
import DeletePop from "../DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";

const label = { inputProps: { "aria-label": "Size switch demo" } };

function CommentsPageContainer() {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mainId, setMainId] = useState("");
  const [search, setSearch] = useState("");
  const [switchControl, setSwitchControl] = useState(false);

  const [inputs, setInputs] = useState({
    id: "",
    c_comment_id: "",
    c_user_comment: "",
    n_status: "",
    user_id: "",
  });

  const [statusUpdata, setStatusUpdata] = useState({
    id: "",
    status: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSwitchChanges = (e, row, key) => {


    const updatedData = commentsList.map(async (item) => {
      if (e.target.checked) {
        if (item.c_comment_id === row.c_comment_id) {
          return {
            ...item,
            [key]: 1,
          };
        }
        setStatusUpdata({
          id: row._id,
          status: 1,
        });
      } else {
        if (item.c_comment_id === row.c_comment_id) {
          return {
            ...item,
            [key]: 0,
          };
        }

        setStatusUpdata({
          id: row._id,
          status: 0,
        });
      }
      return item;
    });
    setCommentsList(updatedData);
   
  };

  const commentActionCallFn = async (id, status) => {
    const body = {
      Id: id,
      n_status: status,
    };
    try {
      const results = await addCommentsApi(body);
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
      } else {
        if(status === 1){
          toast.success("User Comments Activated");
        }else{
          toast.error("User Comments De-Activated");
        }
      
        
        GetAllCommentsList();
        setOpen(false);
      }
      setStatusUpdata({
        id: "",
        status: null,
      })
    } catch (err) {
      console.log(err);
      setStatusUpdata({
        id: "",
        status: null,
      })
    }
  };

  useEffect(() => {
    if(statusUpdata.id !== "" && statusUpdata.status !== null){
      commentActionCallFn(statusUpdata.id, statusUpdata.status)
    }
    
  }, [statusUpdata])
  



  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetAllCommentsList = async () => {
    setLoader(true);
    const body = {
      n_page: page + 1,
      n_limit: rowsPerPage,
      c_search_term: search,
    };
    const results = await getAllCommentsApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      
      setLoader(false);
      setLoader(false);
      results?.payloadJson?.length === 0
        ? setCommentsList([])
        : setCommentsList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };

  const DeleteItem = (val) => {
    setDeletePop(true);
    setDeleteValue(val);
  };

  const closePop = () => {
    setDeletePop(false);
    setDeleteValue("");
  };

  const handleDeleteAd = async (body) => {
    setDeletePop(false);
    setLoader(true);
    const results = await deleteCommentsApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      toast.success(results?.message);
      GetAllCommentsList();
    }
  };

  useEffect(() => {
    if (initFlag) {
      GetAllCommentsList();
    }
  }, [page, rowsPerPage]);

  const handleCancel = () => {
    setInputs({
      c_comment_id: "",
      c_user_comment: "",
      n_status: "",
      user_id: "",
    });
    setOpen(false);
  };

  const handleSubmit = async () => {
    const body = {
      c_comment_id: inputs.c_comment_id,
      c_user_comment: inputs.c_user_comment,
      n_status: inputs.n_status,
      user_id: inputs.user_id,
    };
    if (title === "Edit Comments") {
      body["Id"] = mainId;
    }
    try {
      const results = await addCommentsApi(body);
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
      } else {
        toast.success(results?.message);
        GetAllCommentsList();
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (list) => {
    setInputs({
      c_comment_id: list?.c_comment_id,
      c_user_comment: list?.c_user_comment,
      n_status: list?.n_status,
      user_id: list?.user_id,
    });

    setMainId(list?._id);
    setTitle("Edit Comments");
    setOpen(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetAllCommentsList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    GetAllCommentsList();
  }, []);

  const handleChangeJodit = (value) => {
    setInputs({ ...inputs, c_user_comment: value });
  };
  const searchClear = () => {
    setSearch("");
  };

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <div className="d-flex justify-content-between align-items-center">
              <Box pl={2.5} mt={2}>
                <TextField
                  autoComplete="off"
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IoMdClose
                          style={{
                            fontSize: "20px",
                            cursor: "pointer",
                            display: search.length > 0 ? "block" : "none",
                          }}
                          onClick={() => searchClear()}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {/* <Box pr={2}>
                <Button
                  sx={{
                    bgcolor: "#fe6a49",
                    color: "#fff",
                    mt: 2,
                    letterSpacing: 2,
                    textTransform: "capitalize",
                    "&:hover": {
                      bgcolor: "#fe6a49",
                    },
                  }}
                  onClick={() => {
                    setOpen(true);
                    setTitle("Add Card");
                    setInputs({  
                    c_comment_id: "",
                    c_user_comment: "",
                    n_status: "",
                    user_id: ""  });
                  }}
                >
                  Add Card
                </Button>
              </Box> */}
            </div>
            <CardBody>
              <Table responsive className={`table-wrapper`}>
                <thead style={{ background: "#000" }}>
                  <tr>
                    <th style={{ color: "#fff" }}>S.No</th>
                    <th style={{ color: "#fff" }}>Story</th>
                    <th style={{ color: "#fff" }}>Comments</th>
                    <th style={{ color: "#fff" }}>Likes</th>
                    <th style={{ color: "#fff" }}>End User Name</th>
                    <th style={{ color: "#fff" }}>Created At</th>
                    <th style={{ color: "#fff", textAlign: "center" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    {[1, 2, 3, 4, 5]?.map((list) => (
                      <tr key={list}>
                        {[1, 2, 3, 4, 5, 6, 7]?.map((item) => (
                          <td key={item}>
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
                    {Array.isArray(commentsList) &&
                      commentsList?.map((row, index) => (
                        <tr key={index}>
                          <td scope="row">{index + 1 + page * rowsPerPage}</td>
                          <td className="">{row?.story_title_name}</td>
                          <td className="">{row?.c_user_comment}</td>
                          <td>{row.c_createdName}</td>
                          <td className="">{row?.createdName}</td>
                          <td>{converDayJsDate(row.createdAt)}</td>

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
                              <>
                                <BiSolidMessageAltEdit
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "#000",
                                  }}
                                  onClick={() => {
                                    handleEdit(row);
                                  }}
                                />
                              </>
                              <RiDeleteBin5Line
                                style={{
                                  fontSize: "20px",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => DeleteItem(row?._id)}
                              />
                              <Switch
                                {...label}
                                onChange={(e) =>
                                  handleSwitchChanges(e, row, "n_status")
                                }
                                checked={row?.n_status}
                                defaultChecked={
                                  row?.n_status === 0 ? false : true
                                }
                                value={row?.n_status}
                                color="warning"
                              />
                            </Box>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </Table>
              {!loader && initFlag && commentsList?.length === 0 && (
                <Box textAlign={"center"} my={4}>
                  <BsDatabaseX style={{ fontSize: "40px" }} />
                  <br />
                  <Label style={{ fontSize: "20px" }}>
                    No Comments Added Yet{" "}
                  </Label>
                </Box>
              )}

              {!loader && initFlag && commentsList?.length !== 0 && (
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
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* <AddComments
        open={open}
        close={() => setOpen(false)}
        title={title}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        inputs={inputs}
        handleCancel={handleCancel}
        handleChangeJodit={handleChangeJodit}
      /> */}
      <DeletePop
        open={deletePop}
        handleDeleteItem={() => handleDeleteAd(deleteValue)}
        close={closePop}
      />
    </Container>
  );
}

export default CommentsPageContainer;
