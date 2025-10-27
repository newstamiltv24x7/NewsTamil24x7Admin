import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import {
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
  addWebStoryApi,
  deleteWebStoryApi,
  getAllWebSToriesApi,
  getTranslateApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import AddWebStory from "./AddWebStory";
import { toast } from "react-toastify";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { converDayJsDate } from "@/helper/frontend_helper";
import { RiSearch2Line } from "react-icons/ri";
import DeletePop from "../DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";
import slugify from "slugify";
const label = { inputProps: { 'aria-label': 'Size switch demo' } };

function WebStoriesPageContainer() {
  const [adList, setAdList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mainId, setMainId] = useState("");
  const [imgArr, setImgArr] = useState([]);
  const [search, setSearch] = useState("");
  const [imgDesc, setImgDesc] = useState([
    {
      img_desc: "",
    },
  ]);
  const [inputs, setInputs] = useState({
    title: "",
    slug_name: "",
    n_status: 1,
    cover_image: "",
    image_file:""
  });

  const [errors, setErrors] = useState({
    title: false,
    slug_name:false,
    cover_image: false,
    image_file:false
  });
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: false });
    setInputs({ ...inputs, [name]: value });
  };
  const handleBlur =async(e) =>{
    const { name, value } = e.target;
  
    if(name === "title" && value.length > 0){

      const slugName = value.replaceAll(". ", ", ", " ","! ","@ ","& ","% ","' ","# ","$ ","^ ","( ",") ");

      

      let results = await getTranslateApi(slugName);
      if (results) {
        setInputs({ ...inputs, slug_name: results.flat()?.at(0)?.at(0) });
      }
    }else{
      setInputs({ ...inputs, slug_name: "" });
    }

  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const searchClear =() =>{
    setSearch("");
  }

  const handleCheck = (e) => {
    const { checked } = e.target;
    checked
      ? setInputs({ ...inputs, n_status: 1 })
      : setInputs({ ...inputs, n_status: 0 });
  };

  const GetAllWebStoriesList = async () => {
    setLoader(true);
    const body = {
      n_page: page + 1,
      n_limit: rowsPerPage,
      c_search_term: search,
    };
    const results = await getAllWebSToriesApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      setLoader(false);
      results?.payloadJson?.length === 0
        ? setAdList([])
        : setAdList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
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
        formData.append("c_image_caption_name", "web story");
        ImageUpload(formData, val);
        setInputs({ ...inputs, cover_image: fileName });
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  const statusUpdate =async(id  , val ) =>{
    const body ={
      Id: id,
      n_status: val,
    }
    const results = await addWebStoryApi(body);
    setLoader(true);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
      GetAllWebStoriesList()
    } else {
      setLoader(false);
      if(val === 1){
        toast.success("This Web story is Active!");
      }else{
        toast.error("This Web story is In-Active!");
      }
      
      setLoader(false);
      GetAllWebStoriesList()
    }
  }

  const handleSwitchChange = (e, index, row) => {
    const { checked } = e.target;
    const  filteredUsers = adList.filter((cate) => cate.c_web_story_id === row.c_web_story_id);
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

  const closePopup =()=>{
    setOpen(false)
    setErrors({ ...errors, title: false});
  }

  const handleDeleteAd = async (body) => {
    setDeletePop(false);
    setLoader(true);
    const results = await deleteWebStoryApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      toast.success(results?.message);
      GetAllWebStoriesList();
    }
  };

  useEffect(() => {
    if (initFlag) {
      GetAllWebStoriesList();
    }
  }, [page, rowsPerPage]);

  const handleCancel = () => {
    setImgArr([]);
    setImgDesc([
      {
        img_desc: "",
      },
    ]);
    setInputs({ title: "" });
    setOpen(false);
  };

  const handleDescription = (e, index) => {
    let { name, value } = e.target;
    const updatedCredit = [...imgDesc];
    updatedCredit[index] = {
      ...updatedCredit[index],
      [name]: value,
    };
    setImgDesc(updatedCredit);
  };

  const handleDeleteImg = async (list, index) => {
    
    // setImage({ ...image, loader: true });
    setImageLoader(true);
    const results = await imageDeleteApi({
      c_file: list?.c_file,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImageLoader(false);
      //   setImage({ ...image, loader: false });
    } else {
      setImageLoader(false);
      toast.success(results?.message);
      let newArr = [...imgArr];
      let descArr = [...imgDesc];
      newArr.splice(index, 1);
      descArr.splice(index, 1);
      setImgArr(newArr);
      setImgDesc(descArr);
      //   setImage({ ...image, name: "", src: "", loader: false });
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
      setInputs({ ...inputs, cover_image: "",image_file:"", n_status:1 });
    }
  };

  const handleSubmit = async () => {

    if(inputs.title === ""){
      setErrors({ ...errors, title: true });
    }else if(inputs.cover_image === ""){
      setErrors({ ...errors, cover_image: true });
    }else{
      
    const updatedPayload = imgArr?.map((list, index) => {
      imgDesc.forEach((item, subIndex) => {
        if (index === subIndex) {
          list.c_web_story_content = item.img_desc;
          list.image_url = list?.c_file_url;
        }
      });
      return list;
    });

    
 const slugString = inputs.slug_name.replace(/[^\w\s]|_/g, "");
 const slug_name = slugify(slugString, 
   {
   replacement: "-",
   remove: undefined,
   lower: true,
   strict: false,
   locale: "vi",
   trim: true,
 })



    const body = {
      c_web_story_title: inputs?.title,
      c_web_story_slug_name: slug_name,
      c_web_story_images: updatedPayload,
      Id: mainId,
      n_status: inputs?.n_status,
      c_web_story_cover_img: image,
    };
    if (title === "Edit Web Story") {
      body["Id"] = mainId;
    }
    try {
      const results = await addWebStoryApi(body);
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
      } else {
        toast.success(results?.message);
        GetAllWebStoriesList();
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
    }






  };

  const ImageUpload = async (body, val) => {
    setImageLoader(true);
    const results = await imageUploadApi(body);
    if (val === "Arr") {
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
        setImageLoader(false);
      } else {

        setImageLoader(false);
        toast.success(results?.message);
        setImgArr((prevImages) => [...prevImages, results?.payloadJson]);
      }
    } else {
      if (results?.appStatusCode !== 0) {
        setImageLoader(false);
        toast.error(results?.error);
      } else {
        setImageLoader(false);
        toast.success(results?.message);
        setImage(results?.payloadJson?.c_file_url);
        setInputs({ ...inputs, cover_image: results?.payloadJson?.c_file , image_file: results?.payloadJson?.c_file });
        
      }
    }
  };

  const handleEdit = (list) => {
    setInputs({
      title: list?.c_web_story_title,
      slug_name: list?.c_web_story_slug_name,
      n_status: list?.n_status,
      cover_image: list?.c_web_story_cover_img?.split("/")?.at(-1),
      image_file: list?.c_web_story_cover_img?.split("/")?.at(-1),

      
    });
    setImgArr(list?.c_web_story_images);
    setMainId(list?._id);
    setImgDesc(
      list?.c_web_story_images?.map((item) => ({
        img_desc: item.c_web_story_content,
      }))
    );
    setImage(list?.c_web_story_cover_img);
    setTitle("Edit Web Story");
    setOpen(true);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetAllWebStoriesList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    GetAllWebStoriesList();
  }, []);

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
                    setTitle("Add Web Story");
                    setImgArr([]);
                    setImgDesc([
                      {
                        img_desc: "",
                      },
                    ]);
                    setImage("");
                    setInputs({ title: "",slug_name: "", cover_image: "",image_file:"",n_status: 1 });
                  }}
                >
                  Add Web Story
                </Button>
              </Box>
            </div>
            <CardBody>
              <Table responsive className={`table-wrapper`}>
                <thead style={{ background: "#000" }}>
                  <tr>
                    <th style={{ color: "#fff" }}>S.No</th>
                    <th style={{ color: "#fff" }}>
                      Web Stories Title
                     
                    </th>
                    <th style={{ color: "#fff" }}>
                      Created At{" "}
                      
                    </th>
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
                        {[1, 2, 3, 4, 5, 6]?.map((item) => (
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
                    {Array.isArray(adList) &&
                      adList?.map((row, index) => (
                        <tr key={index}>
                           <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                          <td className="">{row?.c_web_story_title}</td>
                          <td>{converDayJsDate(row.createdAt)}</td>
                          <td>{row.createdName}</td>
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
              {!loader && initFlag && adList?.length === 0 && (
                <Box textAlign={"center"} my={4}>
                  <BsDatabaseX style={{ fontSize: "40px" }} />
                  <br />
                  <Label style={{ fontSize: "20px" }}>
                    No Web Stories Added Yet{" "}
                  </Label>
                </Box>
              )}

              {!loader && initFlag && adList?.length !== 0 && (
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
      <AddWebStory
        open={open}
        close={closePopup}
        title={title}
        handleUpload={handleUpload}
        imgArr={imgArr}
        handleDescription={handleDescription}
        handleSubmit={handleSubmit}
        handleDeleteImg={handleDeleteImg}
        handleChange={handleChange}
        inputs={inputs}
        imageLoader={imageLoader}
        setImageLoader={setImageLoader}
        handleCancel={handleCancel}
        imgDesc={imgDesc}
        image={image}
        setImage={setImage}
        handleDelete={handleDelete}
        handleCheck={handleCheck}
        errors={errors}
        handleBlur={handleBlur}
        setInputs={setInputs}
        
      />
      <DeletePop
       open={deletePop}
       handleDeleteItem={()=>handleDeleteAd(deleteValue)}
       close={closePop}
      />
    </Container>
  );
}

export default WebStoriesPageContainer;
