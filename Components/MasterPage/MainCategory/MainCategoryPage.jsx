import { Box, Skeleton, TablePagination } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { Label, Table } from "reactstrap";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddMainCategoryPop from "./AddMainCategoryPop";
import {
  addCategoryListApi,
  getCategoryListApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { ToastContainer, toast } from "react-toastify";
import { converDayJsDate } from "@/helper/frontend_helper";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BsDatabaseX } from "react-icons/bs";

function MainCategoryPage(props) {
  const {
    categoryArr,
    count,
    GetCategoryList,
    loader,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleDelete,
    onDragEnd,
    comCategory,
    initFlag,
  } = props;
  const [addOpen, setAddOpen] = useState(false);
  const [inputs, setInputs] = useState({
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
    spl_cat:"",
    id: "",
  });

  const [sortType, setSortType] = useState({
    name: false,
    date: false,
  });
  const [errors, setErrors] = useState([]);
  const [imageLoader, setImgLoader] = useState(false);
  const [image, setImage] = useState("");

  const handleEdit = (e) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleEditClick = (list) => {
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
      spl_cat: list?.c_spl_category,
      id: list?._id,
      cover_image: list?.c_category_image_url?.split("/")?.at(-1),
    });
    setImage(list?.c_category_image_url);
  };

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

  const handleSort = (name, type) => {
    let newOne = categoryArr;
    if (name === "name") {
      if (type === "asc") {
        setSortType({ ...sortType, name: true });
        newOne.sort((a, b) => {
          let fa = a?.c_category_name.toLowerCase(),
            fb = b?.c_category_name.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      } else {
        setSortType({ ...sortType, name: false });
        newOne.sort((a, b) => {
          let fa = b?.c_category_name.toLowerCase(),
            fb = a?.c_category_name.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      }
    } else if (name === "date") {
      if (type === "asc") {
        setSortType({ ...sortType, date: true });
        newOne.sort((a, b) => {
          let fa = a.createdAt.toLowerCase(),
            fb = b.createdAt.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      } else {
        setSortType({ ...sortType, date: false });
        newOne.sort((a, b) => {
          let fa = b.createdAt.toLowerCase(),
            fb = a.createdAt.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      }
    }
  };

  const handleAddCategory = async () => {
    let arr = [];
    Object.keys(inputs).map((val) => {
      if (val === "name") {
        (inputs.name === "" || inputs.name.length < 4) && arr.push(val);
      }
      return arr;
    });
    setErrors(arr);
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
      Id: inputs?.id,
      n_status: inputs?.status,
      c_spl_category: (inputs?.spl_cat === "" || inputs.spl_cat === 0)  ? 0 : 1,
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
      GetCategoryList();
      setAddOpen(false);
      toast.success(results?.message);
    }
  };

  const handleCheck = (e) => {
    if (e.target.checked) {
      setInputs({ ...inputs, status: 1 });
    } else {
      setInputs({ ...inputs, status: 0 });
    }
  };
  const handleSplCheck = (e) => {
    
    if (e.target.checked) {
      
      setInputs({ ...inputs, spl_cat: 1 });
    } else {
      
      setInputs({ ...inputs, spl_cat: 0 });
    }
  };

  const handleUpload = (e) => {
    if (e) {
      // setMediaType("image");
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 1024000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "main category image");
        ImageUpload(formData);
        setImgLoader(true);
        setInputs({ ...inputs, cover_image: fileName });
        // setImageArr([...imageArr, ...files]);
      } else {
        toast.error("Please upload less than 1mb");
      }
    }
  };

  const ImageUpload = async (body) => {
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

  return (
    <div>
      <>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <Table responsive className="table-wrapper">
                <thead style={{ background: "#000" }}>
                  <tr>
                    <th style={{ color: "#fff" }}>S.No</th>
                    <th style={{ color: "#fff" }}>
                      Main Category Name{" "}
                    </th>
                    <th style={{ color: "#fff" }}>English Name </th>
                    <th style={{ color: "#fff" }}>
                      Created at{" "}
                    </th>
                    <th style={{ color: "#fff", textAlign: "left" }}>Action</th>
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
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {categoryArr?.map((item, index) => (
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
                            <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                            <td>{item.c_category_name}</td>
                            <td>{item.c_category_english_name}</td>
                            <td>{converDayJsDate(item.createdAt)}</td>
                            <td>
                              <Box display={"flex"} gap={2}>
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
                                <BiSolidMessageAltEdit
                                  style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "#000",
                                  }}
                                  onClick={() => handleEditClick(item)}
                                />
                                <RiDeleteBin5Line
                                  onClick={() => handleDelete(item?._id)}
                                  style={{
                                    fontSize: "20px",
                                    color: "red",
                                    cursor: "pointer",
                                  }}
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
        {initFlag && categoryArr?.length === 0 && (
          <Box textAlign={"center"} my={4}>
            <BsDatabaseX style={{ fontSize: "40px" }} />
            <br />
            <Label style={{ fontSize: "20px" }}>No Record Found! </Label>
          </Box>
        )}
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
      </>

      <ToastContainer />
      <AddMainCategoryPop
        open={addOpen}
        close={() => setAddOpen(false)}
        title="Edit Main Category"
        inputs={inputs}
        handleAddCategory={handleAddCategory}
        handleInputChange={handleEdit}
        handleCheck={handleCheck}
        handleSplCheck={handleSplCheck}
        handleUpload={handleUpload}
        image={image}
        handleDelete={DeleteImage}
        imageLoader={imageLoader}
        comCategory={comCategory}
      />
    </div>
  );
}

export default MainCategoryPage;
