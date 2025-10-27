import { Box, Skeleton, TablePagination } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Label, Table } from "reactstrap";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RiArrowUpCircleLine } from "react-icons/ri";
import { RiArrowDownCircleLine } from "react-icons/ri";
import {
  addCategoryListApi,
  getCategoryListApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { ToastContainer, toast } from "react-toastify";
import { converDayJsDate } from "@/helper/frontend_helper";
import Cookies from "js-cookie";
import { BsDatabaseX } from "react-icons/bs";
import AddSecondaryCategoryPop from "./AddSecondaryCategoryPop";



function SecondaryCategoryPage(props: any) {
  const {
    categoryArr,
    count,
    GetCategoryList,
    loader,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleDelCategory,
    GetSubCategoryList,
    mainCategory,
  } = props;
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
    cat_id: "",
    cat_name: "",
    Id:""
  });
  const [sortType, setSortType] = useState({
    name: false,
    date: false,
  });
  const [imageHeader, setImageHeader] = useState("Thumbnail");
  const [errors, setErrors] = useState<any[]>([]);
  const role = Cookies.get("role");
  const [imageLoader, setImgLoader] = useState(false);
  const [image, setImage] = useState("");

  const handleEdit = (e: any) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleEditClick = (list: any) => {

    console.log(list,"<<< LISTTTTT")


    setAddOpen(true);
    
    setInputs({
      ...inputs,
      web_comp: list?.c_web_component_category_id,
      name: list?.c_category_name,
      eng_name: list?.c_category_english_name,
      meta_name: list?.c_category_meta_title,
      meta_desc: list?.c_category_meta_description,
      meta_keyword: list?.c_category_meta_keywords,
      status: list?.n_status,
      cat_id: list?.c_parentId,
      Id:list?._id,
      // cat_name: list?.c_web_component_category_id,
    });
  };

  const handleSort = (name: String, type: String) => {
    let newOne = categoryArr;
    if (name === "name") {
      if (type === "asc") {
        setSortType({ ...sortType, name: true });
        newOne.sort((a: any, b: any) => {
          let fa = a?.c_category_name.toLowerCase(),
            fb = b?.c_category_name.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      } else {
        setSortType({ ...sortType, name: false });
        newOne.sort((a: any, b: any) => {
          let fa = b?.c_category_name.toLowerCase(),
            fb = a?.c_category_name.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      }
    } else if (name === "date") {
      if (type === "asc") {
        setSortType({ ...sortType, date: true });
        newOne.sort((a: any, b: any) => {
          let fa = a.createdAt.toLowerCase(),
            fb = b.createdAt.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      } else {
        setSortType({ ...sortType, date: false });
        newOne.sort((a: any, b: any) => {
          let fa = b.createdAt.toLowerCase(),
            fb = a.createdAt.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      }
    }
  };

  const handleAddCategory = async () => {
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
        Id:inputs?.Id
        // c_createdBy: role,
        // "c_parentId" :"65dc55d309799acc913ffc81"
      };
      
            console.log(body,"<<< SUB CAT BODY")
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
      if (size < 5000000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "category image");
        ImageUpload(formData);
        setImgLoader(true);
      } else {
        toast.error("Please upload less than 5mb");
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

  const handleSelect = (e: any) => {
    setInputs({ ...inputs, cat_id: e.target.value, cat_name: e.target.value });
    setErrors([]);
  };

  return (
    <div>
      
      <Table responsive className="table-wrapper">
        <thead style={{ background: "#000" }}>
          <tr>
            <th style={{ color: "#fff" }}>S.No</th>
            <th style={{ color: "#fff" }}>
            Secondary Category Name{" "}
             
            </th>
            <th style={{ color: "#fff" }}>
              Main Category{" "}
             
            </th>
            <th style={{ color: "#fff" }}>
              Created at{" "}
             
            </th>
            <th style={{ color: "#fff" }}>Action</th>
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

       


            {categoryArr?.map((list: any, index: number) => {
              return (
                <tr key={list?._id}>
                  <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                  <td>{list.c_category_name}</td>
                  <td>{list.c_parentName}</td>
                  <td>{converDayJsDate(list.createdAt)}</td>
                  <td>
                    <Box display={"flex"} gap={2}>
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
                        onClick={() => handleEditClick(list)}
                      />
                      <RiDeleteBin5Line
                        onClick={() => handleDelCategory(list?._id)}
                        style={{
                          fontSize: "20px",
                          color: "red",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
         {!loader && categoryArr?.length === 0 && (
          <Box textAlign={"center"} my={4}>
            <BsDatabaseX style={{ fontSize: "40px" }} />
            <br />
            <Label style={{ fontSize: "20px" }}>No Record Found! </Label>
          </Box>
        )}
      </Table>
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
      <AddSecondaryCategoryPop
        open={addOpen}
        close={() => setAddOpen(false)}
        title="Edit Secondary Category"
        imageHeader={imageHeader}
        handleUpload={handleUpload}
        inputs={inputs}
        mainCategory={mainCategory}
        // imageArr={imageArr}
        // handleDelete={handleDelete}
        handleInputChange={handleEdit}
        handleCheck={handleCheck}
        handleAdd={handleAddCategory}
        handleSelect={handleSelect}
        // handleUpload={handleUpload}
      />
    </div>
  );
}

export default SecondaryCategoryPage;
