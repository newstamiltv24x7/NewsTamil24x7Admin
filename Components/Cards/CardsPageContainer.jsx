import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  Skeleton,
  Switch,
  TablePagination,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Label, Row, Table } from "reactstrap";
import { BsDatabaseX } from "react-icons/bs";
import {
  addCardsApi,
  deleteCardsApi,
  getAllCardsApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import AddCards from "./AddCards";
import { toast } from "react-toastify";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { converDayJsDate } from "@/helper/frontend_helper";
import { RiSearch2Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import AvatarLogo from "@/public/assets/images/Maa.png";
import DeletePop from "../DeletePopup/DeletePop";
const label = { inputProps: { 'aria-label': 'Size switch demo' } };

function CardsPageContainer() {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [cardsList, setCardsList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mainId, setMainId] = useState("");
  const [search, setSearch] = useState("");
  const [imageLoader, setImageLoader] = useState(false);
  const [image, setImage] = useState("");

  const [inputs, setInputs] = useState({
    card_title: "",
    card_embed_code: "",
    card_url: "",
    card_type: "twitter",
    cards_img_url: "",
  });

  const [errors, setErrors] = useState({
    card_title: false,
    card_embed_code: false,
    card_url: false,
    card_type: false,
    cards_img_url: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "card_title") {
      setErrors({ ...errors, card_title: false });
      setInputs({ ...inputs, [name]: value });
    } else  if (name === "card_url") {
      setErrors({ ...errors, card_url: false });
      setInputs({ ...inputs, [name]: value });
    } 
    
    else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetAllCardsList = async () => {
    setLoader(true);
    const body = {
      n_page: page + 1,
      n_limit: rowsPerPage,
      c_search_term: search,
    };
    const results = await getAllCardsApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      setLoader(false);
      results?.payloadJson?.length === 0
        ? setCardsList([])
        : setCardsList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };

  const statusUpdate =async(id  , val ) =>{
    const body ={
      Id: id,
      n_status: val,
    }
    const results = await addCardsApi(body);
    setLoader(true);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
      GetAllCardsList()
    } else {
      setLoader(false);
      if(val === 1){
        toast.success("This Cards is Active!");
      }else{
        toast.error("This Cards is In-Active!");
      }
      
      setLoader(false);
      GetAllCardsList()
    }
  }

  const handleSwitchChange = (e, index, row) => {
    const { checked } = e.target;

    const  filteredUsers = cardsList.filter((cate) => cate.c_cards_id === row.c_cards_id);
    let valStatus  = checked ? 1 : 0;
    let arr = [...cardsList];
    checked ? (arr[index] = {
          ...arr[index],
          n_status: 1,
        }) : (arr[index] = {
          ...arr[index],
          n_status: 0,
        });
        setCardsList(arr);
        statusUpdate(filteredUsers[0]._id, valStatus)
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
    const results = await deleteCardsApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      toast.success(results?.message);
      GetAllCardsList();
    }
  };

  const handleUpload = (e, val) => {
    if (e) {
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 5000000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "cards");
        ImageUpload(formData, val);
        // setInputs({ ...inputs, cards_img_url: fileName });
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  const handleDelete = async (img) => {
    setImageLoader(true);
    const results = await imageDeleteApi({
      c_file: img,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImageLoader(false);
    } else {
      toast.success(results?.message);
      setImageLoader(false);
      setImage("");
      setInputs({ ...inputs, cards_img_url: "", n_status: 1 });
    }
  };

  const ImageUpload = async (body, val) => {
    setImageLoader(true);
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      setImageLoader(false);
      toast.error(results?.error);
    } else {
      setImageLoader(false);
      toast.success(results?.message);
      setImage(results?.payloadJson?.c_file);
      setInputs({ ...inputs, cards_img_url: results?.payloadJson?.c_file_url });
      setErrors({ ...errors, cards_img_url: false, card_embed_code: false });
    }
  };

  useEffect(() => {
    if (initFlag) {
      GetAllCardsList();
    }
  }, [page, rowsPerPage]);

  const handleCancel = () => {
    setInputs({
      card_title: "",
      card_embed_code: "",
      card_url: "",
      card_type: "twitter",
      cards_img_url: "",
    });
    setOpen(false);
  };

  const handleSubmit = async () => {

    if (inputs?.card_title === "") {
      setErrors({ ...errors, card_title: true });
    }else if (inputs?.card_url === "") {
      setErrors({ ...errors, card_url: true });
    } else if(inputs.card_url.indexOf("https://") === -1){
      setErrors({ ...errors, card_url: true });
    } else if (inputs?.card_embed_code === "" && inputs?.cards_img_url === "") {
      setErrors({ ...errors, card_embed_code: true, cards_img_url: true });
    } else {
      const body = {
        c_cards_title: inputs.card_title,
        c_cards_embed_code: inputs.card_embed_code,
        c_cards_share_url: inputs.card_url,
        c_cards_type: inputs.card_type,
        c_cards_img_url: inputs.cards_img_url,
      };
      if (title === "Edit Cards") {
        body["Id"] = mainId;
      }
      try {
        const results = await addCardsApi(body);
        if (results?.appStatusCode !== 0) {
          toast.error(results?.error);
        } else {
          toast.success(results?.message);
          GetAllCardsList();
          setOpen(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (list) => {
    
    setInputs({
      card_title: list?.c_cards_title,
      card_embed_code: list?.c_cards_embed_code,
      card_url: list?.c_cards_share_url,
      card_type: list?.c_cards_type,
      cards_img_url: list?.c_cards_img_url,
    });
    const myArray = list?.c_cards_img_url.split(".com/");
    
    setImage(myArray[1]);

    setMainId(list?._id);
    setTitle("Edit Cards");
    setOpen(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetAllCardsList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    GetAllCardsList();
  }, []);

  const handleChangeJodit = (value) => {
    setInputs({ ...inputs, card_embed_code: value });
    setErrors({ ...errors, card_embed_code: false, cards_img_url: false });
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
                    setImage("");
                    setTitle("Add Card");
                    setInputs({
                      card_title: "",
                      card_embed_code: "",
                      card_url: "",
                      card_type: "twitter",
                      cards_img_url: "",
                    });
                  }}
                >
                  Add Card
                </Button>
              </Box>
            </div>
            <CardBody>
              <Table responsive className={`table-wrapper`}>
                <thead style={{ background: "#000" }}>
                  <tr>
                    <th style={{ color: "#fff" }}>S.No</th>
                    <th style={{ color: "#fff" }}>Cards Image</th>
                    <th style={{ color: "#fff" }}>Cards Title</th>
                    <th style={{ color: "#fff" }}>Card Type</th>
                    <th style={{ color: "#fff" }}>Created At</th>
                    <th style={{ color: "#fff" }}>Created By</th>
                    <th style={{ color: "#fff", textAlign: "center" }}>
                      Action
                    </th>
                    <th style={{ color: "#fff" }}>Control</th>
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    {[1, 2, 3, 4, 5]?.map((list) => (
                      <tr key={list}>
                        {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
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
                    {Array.isArray(cardsList) &&
                      cardsList?.map((row, index) => (
                        <tr key={index}>
                          <td scope="row">{index + 1 + page * rowsPerPage}</td>

                          {row?.c_cards_img_url ? (
                            <td style={{ textAlign: "left" }}>
                              
                              <Avatar
                                alt=""
                                src={row?.c_cards_img_url}
                                sx={{ width: "60px", height: "60px" }}
                                style={{ objectFit: "contain" }}
                              />
                            </td>
                          ) : (
                            <td style={{ textAlign: "left" }}>
                              <Image
                                src={AvatarLogo}
                                alt="newstamil24x7-globe"
                                width={60}
                                height={60}
                                style={{ objectFit: "contain" }}
                              />
                            </td>
                          )}

                          <td className="">{row?.c_cards_title}</td>
                          <td className="">{row?.c_cards_type}</td>
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
                          <td>
                  <Box textAlign={"center"}>
                  <Switch 
                  checked={row?.n_status === 1 ? true :false}
                  
                  onChange={(e) => handleSwitchChange(e, index, row)}
                  {...label} 
                  
                  />
                  </Box>
                    </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </Table>
              {!loader && initFlag && cardsList?.length === 0 && (
                <Box textAlign={"center"} my={4}>
                  <BsDatabaseX style={{ fontSize: "40px" }} />
                  <br />
                  <Label style={{ fontSize: "20px" }}>
                    No Cards Added Yet{" "}
                  </Label>
                </Box>
              )}

              {!loader && initFlag && cardsList?.length !== 0 && (
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
      <AddCards
        open={open}
        close={() => setOpen(false)}
        title={title}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        inputs={inputs}
        handleCancel={handleCancel}
        handleChangeJodit={handleChangeJodit}
        handleUpload={handleUpload}
        image={image}
        handleDelete={handleDelete}
        imageLoader={imageLoader}
        errors={errors}
      />
      <DeletePop
        open={deletePop}
        handleDeleteItem={() => handleDeleteAd(deleteValue)}
        close={closePop}
      />
    </Container>
  );
}

export default CardsPageContainer;
