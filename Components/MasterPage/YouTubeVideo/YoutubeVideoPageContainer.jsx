import {
  Box,
  Button,
  InputAdornment,
  Skeleton,
  Switch,
  TablePagination,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { converDayJsDate } from "@/helper/frontend_helper";
import { Card, CardBody, Col, Container, Label, Row, Table } from "reactstrap";
import { useEffect, useState } from "react";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import {
  addYouTubeLinkApi,
  deleteYoutubeThumbApi,
  getAllyoutubeLinkApi,
  imageDeleteApi,
  imageUploadApi,
  youtubeStreamOrderApi,
} from "@/apiFunctions/ApiAction";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { RiSearch2Line } from "react-icons/ri";
import Image from "next/image";
import DeletePop from "@/Components/DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";
import AddYoutubeVideoLink from "./AddYoutubeVideoLink";
const label = { inputProps: { 'aria-label': 'Size switch demo' } };

const YoutubeVideoPageContainer = () => {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [adList, setAdList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState({
    title: "",
    subject: "",
    content: "",
    url: "",
    status: 1,
    embed_url: "",
    author: "",
  });
  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState({
    loader: false,
    name: "",
    src: "",
  });
  const [mainId, setMainId] = useState("");
  const [search, setSearch] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetYoutubeLink = async () => {
    const body = {
      n_page: page + 1,
      n_limit: rowsPerPage,
      c_search_term: search,
      c_video_type:"posted",
      c_youtube_type:"video"
    };
    const results = await getAllyoutubeLinkApi(body);

    if (results?.appStatusCode !== 0) {
      toast.error(results?.message);
    } else if (results?.payloadJson?.length === 0) {
      setLoader(false);
      setAdList([]);
      setInitFlag(true);
      setCount(0);
    } else {
      setLoader(false);
      setAdList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };



  const AddYouTubeLinkCall = async () => {
    let body = {
      c_live_stream_category_id: "71e493b2a408",
      c_url_title: inputs?.title,
      c_url_subject: inputs?.subject,
      c_url_content: inputs?.content,
      c_url_link: inputs?.url,
      c_url_web_link: inputs?.embed_url,
      c_thumbanail_image: image?.src,
      c_video_type: "posted",
      c_youtube_type: "video",
    };
    if (title === "Edit Link") {
      body["Id"] = mainId;
      body["n_status"] = inputs?.status;

    }

  



    const results = await addYouTubeLinkApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
    } else {
      toast.success(results?.message);
      GetYoutubeLink();
      setOpen(false);
    }


  };

  const handleUpload = async (e) => {
    if (e) {
      let size = e.target?.files[0]?.size;
      let name = e.target?.files[0]?.name;
      if (size < 5000000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "you tube image");
        ImageUpload(formData, name);
        setImage({ ...image, loader: true });
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  const ImageUpload = async (body, name) => {
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      setImage({ ...image, loader: false });
      toast.error(results?.error);
    } else {
      setImage({
        ...image,
        loader: false,
        src: results?.payloadJson?.c_file_url,
        name: results?.payloadJson?.c_file,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErrors([]);
  };

  const handleAddSubmit = () => {
    let errorArr = [];
    Object.keys(inputs).map((val) => {
      if (val === "title") {
        inputs[val]?.length < 3 && errorArr.push(val);
      } else if (val === "url") {
        inputs[val]?.length < 3 && errorArr.push(val);
      } else if (val === "embed_url") {
        inputs[val]?.length < 3 && errorArr.push(val);
      }

    });
    if (image?.src === "") {
      errorArr.push("image");
    }
    setErrors(errorArr);
    if (errorArr.length === 0) {
      AddYouTubeLinkCall();
    }
  };

  const handleEdit = (list) => {
    const fileName = list?.c_thumbanail_image?.split("/")?.at(-1);
    setOpen(true);
    setTitle("Edit Link");
    setMainId(list?._id);
    setInputs({
      ...inputs,
      title: list?.c_url_title,
      subject: list?.c_url_subject,
      content: list?.c_url_content,
      url: list?.c_url_link,
      embed_url: list?.c_url_web_link,
    });
    setImage({ ...image, src: list?.c_thumbanail_image, name: fileName });
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
      toast.success(results?.message);
      setImage({ ...image, name: "", src: "", loader: false });
    }
  };



  
  const statusUpdate =async(id  , val ) =>{
    const body ={
      Id: id,
      n_status: val,
    }
    const results = await addYouTubeLinkApi(body);
    setLoader(true);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
      GetYoutubeLink()
    } else {
      setLoader(false);
      if(val === 1){
        toast.success("This Video is Active!");
      }else{
        toast.error("This Video is In-Active!");
      }
      
      setLoader(false);
      GetYoutubeLink()
    }
  }
  const handleSwitchChange = (e, index, row) => {
    const { checked } = e.target;

    const  filteredUsers = adList.filter((cate) => cate.c_url_id === row.c_url_id);
    let valStatus  = checked ? 1 : 0;
    let arr = [...adList];
    checked ? (arr[index] = {
          ...arr[index],
          n_status: 1,
        }) : (arr[index] = {
          ...arr[index],
          n_status: 0,
        });
        setAdList(arr);
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
    setImage({ ...image, loader: true });
    const results = await deleteYoutubeThumbApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImage({ ...image, loader: false });
    } else {
      toast.success(results?.message);
      GetYoutubeLink();
      setImage({ ...image, name: "", src: "", loader: false });
    }
  };

  const handleChecked = (e) => {
    let { name, checked } = e.target;
    if (name === "status") {
      checked
        ? setInputs({ ...inputs, status: 1 })
        : setInputs({ ...inputs, status: 0 });
    } else if (name === "live") {
      checked
        ? setInputs({ ...inputs, live: "live" })
        : setInputs({ ...inputs, live: "posted" });
    }
  };





  


  useEffect(() => {
    GetYoutubeLink();
  }, [page, rowsPerPage]);

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const updatedData = [...adList];
    const [reorderedItem] = updatedData.splice(result.source.index, 1);
    updatedData.splice(result.destination.index, 0, reorderedItem);
    let results = await youtubeStreamOrderApi({
      Id: reorderedItem?._id,
      c_url_order_id: adList[result.destination.index]?.c_url_order_id,
    });

    if (results.appStatusCode !== 0) {
      toast.error("Order Arrangement Failed");
    } else {
      toast.success(results?.message);
      setAdList(updatedData);
      GetYoutubeLink();
    }
  };
  const searchClear =() =>{
    setSearch("");
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      GetYoutubeLink();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <div className="d-flex justify-content-between align-items-center">
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
                <Box pr={2}>
                  <Button
                    sx={{
                      bgcolor: "#ed1c24",
                      color: "#fff",
                      mt: 2,
                      letterSpacing: 2,
                      textTransform: "capitalize",
                      "&:hover": {
                        bgcolor: "#ed1c24",
                      },
                    }}
                    onClick={() => {
                      setOpen(true);
                      setTitle("Add Video");
                      setInputs({
                        title: "",
                        subject: "",
                        content: "",
                        url: "",
                        status: 1,
                        embed_url: "",
                      });
                      setImage({ image: "", src: "", loader: false });
                      setErrors([]);
                      setMainId("");
                    }}
                  >
                    Add Video
                  </Button>
                </Box>
              </div>
              <CardBody>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" direction="vertical">
                    {(provided) => (
                      <Table responsive className="table-wrapper">
                        <thead style={{ background: "#000" }}>
                          <tr>
                            <th style={{ color: "#fff" }}>S.No</th>
                            <th style={{ color: "#fff" }}>Image</th>
                            <th style={{ color: "#fff", width: 400 }}>Posted Video Title</th>

                            <th style={{ color: "#fff" }}>Created At </th>
                            <th style={{ color: "#fff" }}>Video Type</th>
                            <th style={{ color: "#fff" }}>YouTube Type</th>
                            <th style={{ color: "#fff" }}>Created By</th>
                            <th style={{ color: "#fff", textAlign: "center" }}>
                              Action
                            </th>
                            <th style={{ color: "#fff" }}>Control</th>
                          </tr>
                        </thead>
                        {loader ? (
                          <tbody>
                            {[1, 2, 3, 4, 5, 6]?.map((list) => (
                              <tr key={list}>
                                {[1, 2, 3, 4, 5, 6, 7, 8,9,10]?.map((item) => (
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
                          <tbody
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {adList?.map((item, index) => (
                              <Draggable
                                key={item._id}
                                draggableId={item._id}
                                index={index}
                              >
                                {(provided) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {/* <th scope="row">{index + 1}</th> */}
                                    <td scope="row">
                                      {index + 1 + page * rowsPerPage}
                                    </td>

                                    {item?.c_thumbanail_image ? (
                                      <td style={{ textAlign: "left" }}>
                                        <Image
                                          src={item?.c_thumbanail_image}
                                          alt=""
                                          width={100}
                                          height={60}
                                          style={{ objectFit: "contain" }}
                                        />
                                      </td>
                                    ) : (
                                      <td style={{ textAlign: "left" }}>
                                        <Image
                                          src={AvatarLogo}
                                          alt=""
                                          width={100}
                                          height={60}
                                          style={{ objectFit: "contain" }}
                                        />
                                      </td>
                                    )}
                                    <td>{item.c_url_title}</td>
                                    <td>{converDayJsDate(item.createdAt)}</td>
                                    <td>{item.c_video_type}</td>
                                    <td>{item.c_youtube_type}</td>
                                    <td>{item.createdName}</td>
                                    <td align="left">
                                      <Box
                                        display={"flex"}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        gap={2}
                                      >
                                        {item?.n_status === 1 ? (
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
                                              handleEdit(item);
                                            }}
                                          />
                                        </>
                                        <RiDeleteBin5Line
                                          style={{
                                            fontSize: "20px",
                                            color: "red",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            DeleteItem(item?._id)
                                          }
                                        />
                                      </Box>
                                    </td>

                                    <td>
                  <Box textAlign={"center"}>
                  <Switch 
                  checked={item?.n_status === 1 ? true :false}
                  
                  onChange={(e) => handleSwitchChange(e, index, item)}
                  {...label} 
                  
                  />
                  </Box>
                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </tbody>
                        )}
                      </Table>
                    )}
                  </Droppable>
                </DragDropContext>
                {!loader && initFlag && adList?.length === 0 && (
                  <Box textAlign={"center"} my={4}>
                    <BsDatabaseX style={{ fontSize: "40px" }} />
                    <br />
                    <Label style={{ fontSize: "20px" }}>
                      No You Tube Added Yet{" "}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddYoutubeVideoLink
        open={open}
        close={() => {
          setOpen(false);
          setInputs({
            category: "",
            title: "",
            subject: "",
            content: "",
            url: "",
            status: 1,
            live: "",
            embed_url: "",
            you_tube:"video"
          });
          setImage({ image: "", src: "", loader: false });
          setErrors([]);
          setMainId("");
        }}
        title={title}
        inputs={inputs}
        handleChange={handleChange}
        errors={errors}
        handleAddSubmit={handleAddSubmit}
        handleUpload={handleUpload}
        image={image}
        DeleteImage={DeleteImage}
        handleChecked={handleChecked}
      />
       <DeletePop 
       open={deletePop}
       handleDeleteItem={()=>handleDeleteAd(deleteValue)}
       close={closePop}
      />
    </>
  );
};

export default YoutubeVideoPageContainer;
