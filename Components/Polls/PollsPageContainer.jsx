import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
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
import { BsDatabaseX } from "react-icons/bs";
import {
  addPollsApi,
  deletePollsApi,
  getAllPollsApi
} from "@/apiFunctions/ApiAction";
import AddPolls from "./AddPolls";
import { toast } from "react-toastify";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { converDayJsDate } from "@/helper/frontend_helper";
import { RiSearch2Line } from "react-icons/ri";
import DeletePop from "../DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";

function PollsPageContainer() {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [pollsList, setPollsList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mainId, setMainId] = useState("");
  const [search, setSearch] = useState("");
 
  const [inputs, setInputs] = useState({
    c_poll_question: "",
    n_status: "",
    c_poll_answer: []
  });

  const [pollsArr, setPollsArr] = React.useState([
    {
      poll_answer: "",
      poll_answer_id:"",
      poll_count: 0,
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetAllPollsList = async () => {
    setLoader(true);
    const body = {
      n_page: page + 1,
      n_limit: rowsPerPage,
      c_search_term: search,
    };
    const results = await getAllPollsApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      setLoader(false);
      
      results?.payloadJson?.length === 0
        ? setPollsList([])
        : setPollsList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };

  const handleCheck = (e) => {
    const { checked } = e.target;
    checked
      ? setInputs({ ...inputs, n_status: 1 })
      : setInputs({ ...inputs, n_status: 0 });
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
    const results = await deletePollsApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      toast.success(results?.message);
      GetAllPollsList();
    }
  };



  const [subErrors, setSubErrors] = React.useState({
    poll_answer: false,
  });

  const addPollAnswer = () => {
    let obj = {
      poll_answer: "",
      poll_answer_id: "",
      poll_count: 0,
    };
    setPollsArr((prev) => [...prev, obj]);
    toast.success("Poll Answer added Succsessfully");
  };

  const handlePolls = (e, index) => {
    let { name, value } = e.target;
    setSubErrors({ ...subErrors, [name]: false });
    const updatedCredit = [...pollsArr];
    updatedCredit[index] = {
      ...updatedCredit[index],
      [name]: value,

    };
    setPollsArr(updatedCredit);
  };

  const handleDelete = (index) => {
    let arr = [...pollsArr];
    arr.splice(index, 1);
    setPollsArr(arr);
    toast.error("Poll Answer Removed Succsessfully");
  };




  useEffect(() => {
    if (initFlag) {
      GetAllPollsList();
    }
  }, [page, rowsPerPage]);

  const handleCancel = () => {

    setPollsArr([ {
      poll_answer: "",
      poll_answer_id:"",
      poll_count: 0,
    },])
    setInputs({ 
    c_poll_question: "",
    c_poll_answer: pollsArr,
    n_status:1
});
 

    setOpen(false);
  };


  const handleSubmit = async () => {
  
    const body = {
        c_poll_question: inputs.c_poll_question,
        c_poll_answer: pollsArr,
        n_status: inputs.n_status,
    };
    if (title === "Edit Poll") {
      body["Id"] = mainId;
    }
    try {

      

      const results = await addPollsApi(body);
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
      } else {
        toast.success(results?.message);
        GetAllPollsList();
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };



  const handleEdit = (list) => {
    setInputs({
        c_poll_question: list?.c_poll_question,
        c_poll_answer: list?.c_poll_answer,
        n_status: list?.n_status,

    });
   
    setMainId(list?._id);
    setTitle("Edit Cards");
    setOpen(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetAllPollsList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    GetAllPollsList();
  }, []);

  const handleChangeJodit = (value) => {
    setInputs({...inputs, card_embed_code: value})
  };
  const searchClear =() =>{
    setSearch("");
  }

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <div className="d-flex justify-content-between align-items-center">
              <Box pl={2.5} mt={2}>
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
              <Box pr={2}>
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
                    setTitle("Add Poll");
                    setPollsArr([ {
                      poll_answer: "",
                      poll_answer_id:"",
                      poll_count: 0,
                    },])
                    setInputs({  
                    c_poll_question: "",
                    c_poll_answer: [{
                      poll_answer:""
                    }],
                    n_status: 1,
                    
                    card_type: ""  });
                  }}
                >
                  Add Poll
                </Button>
              </Box>
            </div>
            <CardBody>
              <Table responsive className={`table-wrapper`}>
                <thead style={{ background: "#000" }}>
                  <tr>
                    <th style={{ color: "#fff" }}>S.No</th>
                    <th style={{ color: "#fff" }}>Polls Question</th>
                    <th style={{ color: "#fff" }}>Polls answer
                    </th>
                    <th style={{ color: "#fff" }}>Created At</th>
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
                        {[1, 2, 3, 4, 5,6]?.map((item) => (
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
                    {Array.isArray(pollsList) &&
                      pollsList?.map((row, index) => (
                        <tr key={index}>
                           <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                          <td className="">{row?.c_poll_question}</td>
                          <td className="">
                            {/* <th>
                                <td>answer</td>
                                <td>count</td>
                            </th> */}
                          {row?.c_poll_answer.map((data, index1) =>
                            <tr key={index1}>
                                <td>{data?.poll_answer}</td>
                                <td>{data?.poll_count}</td>
                            </tr>
                           
                            )}
                          
                          </td>
                          <td>{converDayJsDate(row.createdAt)}</td>
                          <td>{row.c_createdName}</td>
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
                            </Box>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </Table>
              {!loader && initFlag && pollsList?.length === 0 && (
                <Box textAlign={"center"} my={4}>
                  <BsDatabaseX style={{ fontSize: "40px" }} />
                  <br />
                  <Label style={{ fontSize: "20px" }}>
                    No Polls Added Yet{" "}
                  </Label>
                </Box>
              )}

              {!loader && initFlag && pollsList?.length !== 0 && (
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
      <AddPolls
      
        open={open}
        close={() => setOpen(false)}
        title={title}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        inputs={inputs}
        handleCancel={handleCancel}
        handleChangeJodit={handleChangeJodit}
        pollsArr={pollsArr}
        subErrors={subErrors}
        addPollAnswer={addPollAnswer}
        handlePolls={handlePolls}
        handleDelete={handleDelete}
        handleCheck={handleCheck}
      />
       <DeletePop
       open={deletePop}
       handleDeleteItem={()=>handleDeleteAd(deleteValue)}
       close={closePop}
      />
    </Container>
  );
}

export default PollsPageContainer;
