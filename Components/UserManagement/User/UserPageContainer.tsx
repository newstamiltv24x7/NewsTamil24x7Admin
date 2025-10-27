import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
// import PermissionList from "./PermissionList";
// import AddPermissionPop from "./AddPermissionPop";
import {
  addUserPrivilegeAPi,
  allUserListApi,
  craeteUserApi,
  deleteUserAPI,
  deleteUserRoleAPI,
  imageDeleteApi,
  imageUploadApi,
  userPrivilegeApi,
  userPrivilegeUserListApi,
  userRoleMenuAPi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import UserList from "./UserList";
import ManageUserPop from "./ManageUserPop";
import DeletePop from "@/Components/DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";


function UserPageContainer() {
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [menuList, setMenuList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState({
    id: "",
    first_name: "",
    last_name: "",
    mail: "",
    c_about_user: "",
    profile: "",
    role: "",
    status: 1,
    role_id: "",
    password: ""
  });
  const [errors, setErrors] = useState<any>([]);

  const [privilege, setPrivilege] = useState([]);
  const [checked, setChecked] = React.useState<any>([]);
  const [imageLoader, setImgLoader] = useState(false);
  const [image, setImage] = useState("");

  const handleChecked = (e: any, list: any) => {
    const { checked } = e.target;
    if (checked) {
      setChecked((prevChecked: any) => [...prevChecked, list]);
    } else {
      setChecked((prevChecked: any) =>
        prevChecked.filter((item: any) => item._id !== list._id)
      );
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

  const handleDeleteAd = async (id: string) => {
    setDeletePop(false);
    try {
      // const results = await deleteUserRoleAPI(id);
      const results = await deleteUserAPI(id);
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
      } else {
        GetAllRoleList();
        toast.success(results?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const DeleteImage = async () => {
    setImgLoader(true);
    const results = await imageDeleteApi({
      c_file: inputs?.profile,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImgLoader(false);
    } else {
      toast.success(results?.message);
      setImgLoader(false);
      setImage("");
      setInputs({ ...inputs, profile: "" });
    }
  };

  const handleEdit = (list: any) => {
    setTitle("Edit User Details");
    setOpen(true);
    setInputs({
      ...inputs,
      id: list?._id,
      first_name: list?.first_name,
      last_name: list?.last_name,
      mail: list?.email,
      c_about_user: list?.c_about_user,
      status: list?.n_status,
      role: "",
      role_id: list?.c_role_id,
      // password: list?.password,
      password: "",
      profile: list?.c_user_img_url?.split("/")?.at(-1),
    });
    setImage(list?.c_user_img_url);
    setErrors([]);
  };

  const handleCheck = (e: any) => {
    const { checked } = e.target;
    checked
      ? setInputs({ ...inputs, status: 1 })
      : setInputs({ ...inputs, status: 0 });
  };

  const handleUpload = (e: any) => {
    if (e) {
      // setMediaType("image");
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 2048000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", `${inputs.first_name + inputs.last_name}`);
        ImageUpload(formData);
        setImgLoader(true);
        setInputs({ ...inputs, profile: fileName });
        // setImageArr([...imageArr, ...files]);
      } else {
        toast.error("Please upload less than 2mb");
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
      setInputs({ ...inputs, profile: results?.payloadJson?.c_file });
    }
  };

  const handleSubmit = async () => {


   
   



    try {

      // if(inputs?.first_name === "" || inputs?.last_name === "" || inputs?.mail === "" || inputs?.role_id === ""){
      //   let arr: any[] = [];
      //   Object.keys(inputs).map((val) => {
      //     if (val === "first_name") {
      //       inputs[val]?.length < 3 && arr.push(val);
      //     } else if (val === "last_name") {
      //       inputs[val]?.length < 3 && arr.push(val);
      //     }else if (val === "mail") {
      //       inputs[val]?.length < 3 && arr.push(val);
      //     }else if (val === "role_id") {
      //       inputs[val]?.length < 3 && arr.push(val);
      //     }
      //   });
      //   setErrors(arr);
      // }else{
       
      // }

      const body: any  = {
        first_name: inputs?.first_name,
        last_name: inputs?.last_name,
        c_about_user: inputs?.c_about_user,
        email: inputs?.mail,
        role: "",
        c_role_id: inputs?.role_id,
        password: inputs?.password,
        c_user_img_url: image,
      };
      if (inputs?.id !== "") {
        body["Id"] = inputs?.id;
      }

      const results = await craeteUserApi(body);
      if (results?.appStatusCode !== 0) {
        toast?.error(results?.message);
      } else {
        GetAllUserList();
        toast?.success(results?.message);
        setOpen(false);
        setErrors([])

      }
} catch (err) {
      console.log(err);
    }
  };



  

  const handleClear = () => {
    setOpen(false);
    setChecked([]);
    setErrors([]);
    // setInputs({ role: "", title: "" });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetAllUserList = async () => {
    setLoader(true);
    try {
      const body = {
        n_page: page + 1,
        n_limit: rowsPerPage,
        c_search_term: search ? search : "",
      };

      const results = await allUserListApi(body);
      setLoader(false);

      if (results.payloadJson.length > 0) {
        
        setAdList(results?.payloadJson[0]?.data);
        setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
      } else {
        setAdList([]);
        setCount(0)
      }
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  const GetAllRoleList = async () => {
    try {
      const results = await userPrivilegeApi({
        role: "",
      });
      setMenuList(results?.payloadJson);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetAllRoleList();
    GetAllUserList();
  }, []);

  useEffect(() => {
    GetAllUserList();
  }, [page, rowsPerPage]);



  useEffect(() => {
    if (open === false) {
      setInputs({
        id: "",
        first_name: "",
        last_name: "",
        mail: "",
        c_about_user: "",
        // dob: "",
        // mobile: "",
        profile: "",
        role: "",
        status: 1,
        role_id: "",
        password:""
      });
      setImage("");
      setErrors([])
    }
  }, [open]);
  const searchClear =() =>{
    setSearch("");
  }
  useEffect(() => {
    GetAllUserList();
  }, [search]);




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
                    setTitle("Add User Details");
                    // setInputs({ ...inputs, role: "", title: "" });
                    setPrivilege([]);
                  }}
                >
                  Add User
                </Button>
              </Box>
              <CardBody className="pt-0">
                <UserList
                  adList={adList}
                  loader={loader}
                  initFlag={initFlag}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  count={count}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  handleDeleteAd={DeleteItem}
                  handleEdit={handleEdit}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ManageUserPop
        open={open}
        close={() => setOpen(false)}
        title={title}
        inputs={inputs}
        handleChecked={handleChecked}
        handleSubmit={handleSubmit}
        setPrivilege={setPrivilege}
        handleClear={handleClear}
        privilege={privilege}
        handleUpload={handleUpload}
        image={image}
        imageLoader={imageLoader}
        handleDelete={DeleteImage}
        menuList={menuList}
        handleInputChange={handleInputChange}
        setInputs={setInputs}
        handleCheck={handleCheck}
        errors={errors}
      />
      <DeletePop
       open={deletePop}
       handleDeleteItem={()=>handleDeleteAd(deleteValue)}
       close={closePop}
      />
    </div>
  );
}

export default UserPageContainer;
