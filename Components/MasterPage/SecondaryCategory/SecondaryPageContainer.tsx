import Breadcrumbs from "@/CommonComponent/Breadcrumbs";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import SecondaryCategoryPage from "./SecondaryCategoryPage";
import { Box, InputAdornment, TextField } from "@mui/material";
import AddSecondaryCategoryPop from "./AddSecondaryCategoryPop";
import {
  addCategoryListApi,
  deleteCategoryListApi,
  getAllCategoryListApi,
  getCategoryListApi,
  getTranslateApi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import { RiSearch2Line } from "react-icons/ri";
import DeletePop from "@/Components/DeletePopup/DeletePop";

const SecondaryPageContainer = () => {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [imageHeader, setImageHeader] = useState("Thumbnail");
  const [imageArr, setImageArr] = useState([]);
  const [inputs, setInputs] = useState({
    web_comp:"",
    name: "",
    eng_name: "",
    staff: "",
    meta_name: "",
    meta_desc: "",
    meta_keyword: "",
    thumb_image: "",
    cover_image: "",
    status: 1,
    cat_id: "",
    cat_name: "",
    Id:""
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loader, setLoader] = useState(false);
  const [categoryArr, setCategoryArr] = useState<any[]>([]);
  const [count, setCount] = useState();
  const [mainCategory, setMaincategory] = useState([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };
  const handleCheck = (e:any) => {
    const { checked } = e.target;
    checked
      ? setInputs({ ...inputs, status: 1 })
      : setInputs({ ...inputs, status: 0 });
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

  const handleUpload = (e: any) => {
    if (e) {
      const files: never[] = Array.from(e.target.files);
      setImageArr([...imageArr, ...files]);
      setImageHeader("Cover");
    }
  };

  const handleDelete = (index: any) => {
    let arr = [...imageArr];
    if (index === 0) {
      setImageHeader("Thumbnail");
    } else setImageHeader("Cover");
    arr.splice(index, 1);
    setImageArr(arr);
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

  const GetSubCategoryList = async () => {
    const body = {
      n_limit: rowsPerPage,
      n_page: page + 1,
      c_search_term: search,
      c_cate_type: "sub",
      spl_cate: 0
    };
    const results = await getCategoryListApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error("Something Went Wrong");
    } else {
      setLoader(false);
      setCategoryArr(results?.payloadJson?.at(0)?.data);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };

  const GetCategoryList = async () => {
    const results = await getAllCategoryListApi();
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error("Something Went Wrong");
    } else {
      setLoader(false);
      setMaincategory(results?.payloadJson);
      // setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
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
    setLoader(true);
    setDeletePop(false);
    const results = await deleteCategoryListApi(id);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error("Something Went Wrong");
    } else {
      setLoader(false);
      GetSubCategoryList();
      toast.success(results?.message);
    }
  };

  useEffect(() => {
    GetSubCategoryList();
    setLoader(true);
  }, [page, rowsPerPage]);

  useEffect(() => {
    let timer = setTimeout(() => {
      GetSubCategoryList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    GetCategoryList();
  }, []);

  const handleAdd = async () => {
    let arr: any[] = [];
    Object.keys(inputs).map((val) => {
      if (val === "name") {
        inputs[val]?.length < 4 && arr.push(val);
      } else if (val === "cat_id") {
        inputs[val] === "" && arr.push(val);
      }
      return arr;
    });
    setErrors(arr);
    if (arr?.length === 0) {
      
      const body = {
        c_web_component_category_id: inputs.web_comp,
        c_category_name: inputs.name,
        c_category_english_name: inputs.eng_name,
        c_category_image_url:"",
        c_category_class: "",
        c_category_type: "",
        c_category_meta_title: inputs.meta_name,
        c_category_meta_description: inputs.meta_desc,
        c_category_meta_keywords: inputs.meta_keyword,
        n_status: inputs?.status,
        c_parentId: inputs?.cat_id,
        c_spl_category: 0,
        // c_createdBy: role,
        // "c_parentId" :"65dc55d309799acc913ffc81"
      };




      const results = await addCategoryListApi(body);
      if (results.appStatusCode !== 0) {
        setAddOpen(false);
        results?.error?.codeName === "DuplicateKey" &&
          toast.error("Category Already Exists");
        toast.error(results?.error);
      } else {
        GetSubCategoryList();
        setAddOpen(false);
        toast.success(results?.message);
      }
    }
  };

  const handleSelect = (e: any) => {

      const result: any = mainCategory.filter((item: any) => item.c_category_id === e.target.value);
    setInputs({ ...inputs, cat_id: e.target.value, cat_name: e.target.value, web_comp: result?.at(0).c_web_component_category_id });
    setErrors([]);
  };



  return (
    <>
      {/* <Breadcrumbs pageTitle="Sub Category" parent="Master" /> */}
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
                    }}
                  />
                </Box>
                <Box pr={2}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      setAddOpen(true);
                      setInputs({
                        web_comp:"",
                        name: "",
                        eng_name: "",
                        staff: "",
                        meta_name: "",
                        meta_desc: "",
                        meta_keyword: "",
                        thumb_image: "",
                        cover_image: "",
                        status: 1,
                        cat_id: "",
                        cat_name: "",
                        Id:""
                      });
                    }}
                  >
                    Add Sub Category
                  </Button>
                </Box>
              </div>
              <CardBody>
                <SecondaryCategoryPage
                  GetCategoryList={GetSubCategoryList}
                  categoryArr={categoryArr}
                  count={count}
                  loader={loader}
                  setLoader={setLoader}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleDelCategory={DeleteItem}
                  GetSubCategoryList={GetSubCategoryList}
                  mainCategory={mainCategory}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddSecondaryCategoryPop
        open={addOpen}
        close={() => setAddOpen(false)}
        title="Add Sub Category"
        imageHeader={imageHeader}
        handleUpload={handleUpload}
        imageArr={imageArr}
        handleDelete={handleDelete}
        handleInputChange={handleInputChange}
        inputs={inputs}
        handleBlur={handleBlur}
        mainCategory={mainCategory}
        handleAdd={handleAdd}
        handleSelect={handleSelect}
        errors={errors}
        handleCheck={handleCheck}
      />
      <DeletePop
       open={deletePop}
       handleDeleteItem={()=>DeleteCategory(deleteValue)}
       close={closePop}
      />
    </>
  );
};

export default SecondaryPageContainer;
