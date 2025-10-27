import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
import PermissionList from "./PermissionList";
import AddPermissionPop from "./AddPermissionPop";
import {
  addUserPrivilegeAPi,
  deleteUserRoleAPI,
  getSideBarMenu,
  getSideBarMenus,
  userPrivilegeApi,
  userPrivilegeUserListApi,
  userRoleMenuAPi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "./userStyles.css";
import DeletePop from "@/Components/DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";

function PermissionPageContainer() {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [roleList, setRoleList] = useState<any>([]);
  const [menuList, setMenuList] = useState<any>([]);
  const [inputs, setInputs] = useState({
    role: "",
    title: "",
  });
  const [privilege, setPrivilege] = useState([
    {
      role_privileage: "add",
    },
    {
      role_privileage: "edit",
    },
    {
      role_privileage: "view",
    },
    {
      role_privileage: "delete",
    },
  ]);
  const [checked, setChecked] = React.useState<any>([]);
  const [sideMenuList, setSideMenuList] = useState<any>([]);
  const [mainParent, setMainParent] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [roleId, setRoleId] = useState("");

  const handleChildCheckboxChange = (child: any, parent: any) => {
    const isSelected = selectedItems.some(
      (selectedItem: any) =>
        selectedItem.title === child.title &&
        selectedItem.parentTitle === parent.title
    );

    if (isSelected) {
      const updatedSelectedItems = selectedItems.filter(
        (selectedItem: any) =>
          !(
            selectedItem.title === child.title &&
            selectedItem.parentTitle === parent.title
          )
      );

      const isAnyChildChecked = parent.children.some((child: any) =>
        updatedSelectedItems.some(
          (selectedItem: any) =>
            selectedItem.title === child.title &&
            selectedItem.parentTitle === parent.title
        )
      );

      if (!isAnyChildChecked) {
        setSelectedItems(
          updatedSelectedItems.filter(
            (selectedItem: any) => selectedItem.title !== parent.title
          )
        );
      } else {
        setSelectedItems(updatedSelectedItems);
      }
    } else {
      setSelectedItems([
        ...selectedItems,
        { ...child, parentTitle: parent.title },
      ]);

      if (
        !selectedItems.some(
          (selectedItem: any) => selectedItem.title === parent.title
        )
      ) {
        setSelectedItems((prevSelectedItems: any) => [
          ...prevSelectedItems,
          { ...parent, parentTitle: null },
        ]);
      }
    }
  };

  const handleParentCheckboxChange = (parent: any) => {
    const isSelected = selectedItems.some(
      (selectedItem: any) => selectedItem.title === parent.title
    );

    if (isSelected) {
      setSelectedItems(
        selectedItems.filter(
          (selectedItem: any) =>
            selectedItem.title !== parent.title &&
            selectedItem.parentTitle !== parent.title
        )
      );
    } else {
      const newSelectedItems = parent.children.map((child: any) => ({
        ...child,
        parentTitle: parent.title,
      }));
      setSelectedItems([
        ...selectedItems,
        { ...parent, parentTitle: null },
        ...newSelectedItems,
      ]);
    }
  };

  const isParentChecked = (parent: any) => {
    return selectedItems.some(
      (selectedItem: any) => selectedItem.title === parent.title
    );
  };

  const isChildChecked = (child: any, parent: any) => {
    return selectedItems.some(
      (selectedItem: any) =>
        selectedItem.title === child.title &&
        selectedItem.parentTitle === parent.title
    );
  };
  const DeleteItem = (val :any) => {
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
      const results = await deleteUserRoleAPI(id);
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

  const handleEdit = (list: any) => {
    setOpen(true);
    setRoleId(list?._id);
    setInputs({ ...inputs, role: list?.c_role_id });
    const newSelectedItems: any = [];
    list?.c_menu_privileges.forEach((resItem: any) => {
      const parentItem = sideMenuList
        .at(0)
        ?.Items?.find(
          (menuItem: any) => menuItem.title === resItem.menu_privileage_name
        );
      if (parentItem) {
        newSelectedItems.push({ ...parentItem, parentTitle: null });
      } else {
        sideMenuList.at(0)?.Items?.forEach((menuItem: any) => {
          const childItem = menuItem.children?.find(
            (child: any) => child.title === resItem.menu_privileage_name
          );
          if (childItem) {
            newSelectedItems.push({
              ...childItem,
              parentTitle: menuItem.title,
            });
          }
        });
      }
    });
    setSelectedItems(newSelectedItems);

    const mappedPrivileges = list?.c_role_privileges?.map((resItem: any) =>
      privilege?.find(
        (priv: any) => priv.role_privileage === resItem.role_privileage
      )
    );

    setSelectedPrivileges(mappedPrivileges);
  };

  const availableOptions = privilege.filter(
    (option: any) =>
      !selectedPrivileges.some(
        (selectedOption: any) =>
          selectedOption?.role_privileage === option.role_privileage
      )
  );


  const handleSubmit = async () => {
    try {
      var main: any = {};
      main.id = mainParent?._id;
      main.c_menu_id = mainParent?.c_menu_id;
      main.title = mainParent?.title;
      const arr = [{ ...main }, ...selectedItems];
      var body: any = {
        c_role_id: inputs?.role,
        c_menu_privileges: arr?.map((list: any) => {
          return {
            menu_privileage_id: list?.c_menu_id,
            menu_privileage_name: list?.title,
          };
        }),
        c_role_privileges: selectedPrivileges,
      };
      body["Id"] = roleId;
      const results = await addUserPrivilegeAPi(body);
      if (results?.appStatusCode !== 0) {
        toast?.error(results?.message);
      } else {
        GetAllRoleList();
        toast?.success(results?.message);
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetSideMenu = async () => {
    try {
      const res = await getSideBarMenus();
      if (res.appStatusCode === 0) {
        setSideMenuList(res.payloadJson);
        setMainParent(res.payloadJson?.at(0));
      } else {
        setSideMenuList([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClear = () => {
    setOpen(false);
    setChecked([]);
    setInputs({ role: "", title: "" });
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

  const GetUserRole = async () => {
    try {
      const results = await userPrivilegeApi();
      
      setRoleList(results?.payloadJson);
    } catch (err) {
      console.log(err);
    }
  };

  const GetAllRole = async () => {
    try {
      const results = await userRoleMenuAPi();
      setMenuList(results?.payloadJson);
    } catch (err) {
      console.log(err);
    }
  };

  const GetAllRoleList = async () => {
    try {
      const results = await userPrivilegeUserListApi();
      // const results = await userPrivilegeApi();

      setAdList(results?.payloadJson);
    } catch (err) {
      console.log(err);
    }
  };

  const searchClear =() =>{
    setSearch("");
  }

  useEffect(() => {
    GetUserRole();
    GetAllRole();
    GetAllRoleList();
    GetSideMenu();
  }, []);

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
                    setTitle("Add Permission");
                    setInputs({ ...inputs, role: "", title: "" });
                    setSelectedPrivileges([]);
                    setRoleId("");
                  }}
                >
                  Manage Role
                </Button>
              </Box>
              <CardBody className="pt-0">
                <PermissionList
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
      <AddPermissionPop
        open={open}
        close={() => setOpen(false)}
        title={title}
        roleList={roleList}
        handleInputChange={handleInputChange}
        inputs={inputs}
        menuList={sideMenuList}
        handleSubmit={handleSubmit}
        setPrivilege={setPrivilege}
        handleClear={handleClear}
        privilege={privilege}
        checked={checked}
        handleChildCheckboxChange={handleChildCheckboxChange}
        selectedItems={selectedItems}
        isParentChecked={isParentChecked}
        setSelectedItems={setSelectedItems}
        handleParentCheckboxChange={handleParentCheckboxChange}
        isChildChecked={isChildChecked}
        selectedPrivileges={selectedPrivileges}
        setSelectedPrivileges={setSelectedPrivileges}
        availableOptions={availableOptions}
      />
      <DeletePop
       open={deletePop}
       handleDeleteItem={()=>handleDeleteAd(deleteValue)}
       close={closePop}
      />
    </div>
  );
}

export default PermissionPageContainer;
