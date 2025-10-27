import Breadcrumbs from "@/CommonComponent/Breadcrumbs";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import MainCategoryPage from "./MainCategoryPage";
import { Box, InputAdornment, TextField } from "@mui/material";
import AddMainCategoryPop from "./AddMainCategoryPop";
import {
  addCategoryListApi,
  categoryOrderApi,
  deleteCategoryListApi,
  getAllWebComponentsCategoryListApi,
  getCategoryListApi,
  getTranslateApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import { RiSearch2Line } from "react-icons/ri";
import DeletePop from "@/Components/DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";

const MainCategoryPageContainer = () => {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [inputs, setInputs] = useState<any>({
    web_comp: "",
    name: "",
    eng_name: "",
    staff: "",
    meta_name: "",
    meta_desc: "",
    meta_keyword: "",
    thumb_image: "",
    cover_image: "",
    status: "",
    spl_cat: "",
  });
  const [errors, setErrors] = useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loader, setLoader] = useState(false);
  const [categoryArr, setCategoryArr] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [imageLoader, setImgLoader] = useState(false);
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");
  const [comCategory, setComCategory] = useState<any[]>([]);
  const [initFlag, setInitFlag] = useState(false);
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErrors([]);
  };

  // const handleUpload = (e: any) => {
  //   if (e) {
  //     const files: never[] = Array.from(e.target.files);
  // setImageArr([...imageArr, ...files]);
  // setImageHeader("Cover");
  //   }
  // };

  const DeleteImage = async () => {
    setImgLoader(true);
    const results = await imageDeleteApi({
      c_file: inputs?.cover_image,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImgLoader(false);
    } else {
      toast.success(results?.message);
      setImgLoader(false);
      setImage("");
      setInputs({ ...inputs, cover_image: "" });
    }
  };

  const handleBlur = () => {
    if (inputs.name.length > 3) {
      getTranslate();
    } else {
      setInputs({ ...inputs, eng_name: "" });
    }
  };

  const getTranslate = async () => {
    let results = await getTranslateApi(inputs.name);
    setInputs({ ...inputs, eng_name: results.flat()?.at(0)?.at(0) });
  };

  useEffect(() => {
    inputs.name.length === 0 && setInputs({ ...inputs, eng_name: "" });
  }, [inputs.name]);

  const handleAddCategory = async () => {
    let arr: any[] = [];
    Object.keys(inputs).map((val) => {
      if (val === "name") {
        (inputs.name === "" || inputs.name.length < 4) && arr.push(val);
      } else if (val === "web_comp") {
        inputs?.web_comp === "" && arr.push(val);
      } else if (val === "eng_name") {
        (inputs?.eng_name === "" || inputs?.eng_name?.length < 4) &&
          arr.push(val);
      } else if (val === "meta_name") {
        (inputs?.meta_name === "" || inputs?.meta_name?.length < 4) &&
          arr.push(val);
      } else if (val === "meta_desc") {
        (inputs?.meta_desc === "" || inputs?.meta_desc?.length < 4) &&
          arr.push(val);
      } else if (val === "meta_keyword") {
        (inputs?.meta_keyword === "" || inputs?.meta_keyword?.length < 4) &&
          arr.push(val);
      }
      return arr;
    });
    setErrors(arr);
    if (arr.length === 0) {
      const body = {
        c_web_component_category_id: inputs.web_comp,
        c_category_name: inputs.name,
        c_category_english_name: inputs.eng_name,
        c_category_image_url: image,
        c_category_class: "",
        c_category_type: "",
        c_category_meta_title: inputs.meta_name,
        c_category_meta_description: inputs.meta_desc,
        c_category_meta_keywords: inputs.meta_keyword,
        n_status: inputs?.status,
        c_spl_category: (inputs?.spl_cat === "" || inputs.spl_cat === 0)  ? 0 : 1,
        // "c_parentId" :"65dc55d309799acc913ffc81"
      };
      const results = await addCategoryListApi(body);
      if (results.appStatusCode !== 0) {
        setAddOpen(false);
        results?.error?.codeName === "DuplicateKey" &&
          toast.error("Category Already Exists");
        toast.error(results?.error);
      } else {
        GetCategoryList();
        setAddOpen(false);
        toast.success(results?.message);
      }
    }
  };

  const GetCategoryList = async () => {
    const body = {
      n_limit: rowsPerPage,
      n_page: page + 1,
      c_search_term: search,
      c_cate_type: "main",
      // spl_cate: 0
    };

    
    const results = await getCategoryListApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error("Something Went Wrong");
      setInitFlag(true);
    } else {
      setInitFlag(true);
      if (results?.payloadJson?.length === 0) {
        setLoader(false);
        setCategoryArr([]);
        setCount(0);
      } else {
        setLoader(false);
        setCategoryArr(results?.payloadJson?.at(0)?.data);
        setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
      }
    }
  };

  const handleSplCheck = (e: any) => {
    
    if (e.target.checked) {
      
      setInputs({ ...inputs, spl_cat: 1 });
    } else {
      
      setInputs({ ...inputs, spl_cat: 0 });
    }
  };

  const GetWebComponentsCategoryList = async () => {
    const results = await getAllWebComponentsCategoryListApi();
    if (results?.appStatusCode !== 0) {
      setComCategory([]);
    } else {
      setComCategory(results?.payloadJson);
    }
  };

  const DeleteItem = (val: any) => {
    setDeletePop(true);
    setDeleteValue(val);
  };

  const closePop = () => {
    setDeletePop(false);
    setDeleteValue("");
  };

  const DeleteCategory = async (id: string) => {
    setDeletePop(false);
    setLoader(true);
    const results = await deleteCategoryListApi(id);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error("Something Went Wrong");
    } else {
      setLoader(false);
      GetCategoryList();
      toast.success(results?.message);
    }
  };
  const searchClear =() =>{
    setSearch("");
  }

  useEffect(() => {
    GetCategoryList();
    GetWebComponentsCategoryList();
    setLoader(true);
  }, [page, rowsPerPage]);

  // useEffect(() => {
  //   GetCategoryList();
  //   setLoader(true);
  // }, []);

  const handleCheck = (e: any) => {
    if (e.target.checked) {
      setInputs({ ...inputs, status: 1 });
    } else {
      setInputs({ ...inputs, status: 0 });
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
        formData.append("c_image_caption_name", fileName);
        ImageUpload(formData);
        setImgLoader(true);
        setInputs({ ...inputs, cover_image: fileName });
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
      setInputs({ ...inputs, cover_image: results?.payloadJson?.c_file });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(categoryArr);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    // const body = {
    //   Id: reorderedItem?._id,
    //   c_category_order: result.destination.index + 1,
    // };
    const body = {
      Id: categoryArr[result.source.index]?._id,
      c_category_order: categoryArr[result.destination.index]?.c_category_order,
    };
    setLoader(true);
    ChangeOrderFn(body);
    setCategoryArr(newItems);
  };

  const ChangeOrderFn = async (body: {
    Id: string;
    c_category_order: number;
  }) => {
    const results = await categoryOrderApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast?.error(results?.message ? results?.message : "Network Error");
    } else {
      setLoader(false);
      toast?.success(results?.message);
      GetCategoryList();
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetCategoryList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      {/* <Breadcrumbs pageTitle="Main Category" parent="Master" /> */}
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
                    color="secondary"
                    onClick={() => {
                      setAddOpen(true);
                      setInputs({
                        web_comp: "",
                        name: "",
                        eng_name: "",
                        staff: "",
                        meta_name: "",
                        meta_desc: "",
                        meta_keyword: "",
                        thumb_image: "",
                        cover_image: "",
                        status: 1,
                      });
                      setImage("");
                    }}
                  >
                    Add Main Category
                  </Button>
                </Box>
              </div>
              <CardBody>
                <MainCategoryPage
                  GetCategoryList={GetCategoryList}
                  categoryArr={categoryArr}
                  count={count}
                  loader={loader}
                  setLoader={setLoader}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleDelete={DeleteItem}
                  onDragEnd={onDragEnd}
                  comCategory={comCategory}
                  initFlag={initFlag}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddMainCategoryPop
        open={addOpen}
        close={() => setAddOpen(false)}
        title="Add Main Category"
        handleUpload={handleUpload}
        handleInputChange={handleInputChange}
        inputs={inputs}
        handleBlur={handleBlur}
        handleAddCategory={handleAddCategory}
        handleCheck={handleCheck}
        image={image}
        handleDelete={DeleteImage}
        imageLoader={imageLoader}
        comCategory={comCategory}
        errors={errors}
        handleSplCheck={handleSplCheck}
      />
      <DeletePop
        open={deletePop}
        handleDeleteItem={() => DeleteCategory(deleteValue)}
        close={closePop}
      />
    </>
  );
};

export default MainCategoryPageContainer;
