import Breadcrumbs from "@/CommonComponent/Breadcrumbs";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { useAppSelector } from "@/Redux/Hooks";
import StoryList from "./StoryList";
import { RiSearch2Line } from "react-icons/ri";
import Link from "next/link";
import {
  createNewStoryApi,
  deleteStoryApi,
  getAllCategoryListApi,
  getAllStoriesListApi,
  getAllUserListApi,
  getMethodAllUserListApi,
  newsroomOrderApi,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import { MdOutlineTune } from "react-icons/md";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { BsDatabaseX } from "react-icons/bs";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import NewsRoomList from "./NewsRoomList";
import DeletePop from "../DeletePopup/DeletePop";
import { IoMdClose } from "react-icons/io";

function checkCategories(value: String) {
  switch (value) {
    case "home":
      return "cf336f838e81"; //newsroom
    case "movie":
      return "af8fffda8b7c"; // movie
    case "sport":
      return "1aca781acd62"; // sport
    default:
      return "";
  }
}
function findArray(arr:any, obj:any) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == obj) return true;
  }
}

const StoryPageContainer = () => {

  // const check:any = Cookies.get("privileges");
  // const checkArray:any = JSON.parse(check);
  // const checkAdd = findArray(checkArray,"add");
  // const checkEdit = findArray(checkArray,"edit");
  // const checkDelete = findArray(checkArray,"delete");
  // const checkView = findArray(checkArray,"view");

  const router = useRouter();
  const role_id = Cookies.get("role_id");
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [storyList, setStoryList] = useState<any[]>([]);
  const [newsroomList, setNewsRoomList] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = useState<any>({
    start_date: "",
    end_date: "",
  });
  const [loader, setLoader] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [initFlag, setInitFlag] = React.useState(false);
  const [userArr, setUserArr] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [filters, setFilters] = useState({
    reviewer: "",
    hours: "",
    main_category: "",
    secondary_category: "",
  });

  const [value, setValue] = React.useState("1");
  const [type, setType] = React.useState("published");
  const [categoryArr, setCategoryArr] = useState([]);
  const [secondaryCategoryArr, setSecondaryCategoryArr] = useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheck = (e: any, index: number, row: any) => {

    const { checked } = e.target;
    const  filteredUsers :any = storyList.filter((cate) => cate.story_id === row.story_id);
    let valStatus :any = checked ? 1 : 0;
    

    
    let arr = [...storyList];
    checked ? (arr[index] = {
          ...arr[index],
          live_status: 1,
        })
      : (arr[index] = {
          ...arr[index],
          live_status: 0,
        });
        setStoryList(arr);

       
        liveStatusUpdate(filteredUsers[0]._id, valStatus)


       

  };

  const liveStatusUpdate =async(id :any , val :any) =>{
    const body ={
      Id: id,
      live_status: val,
    }
    const results = await createNewStoryApi(body);
    setLoader(true);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
      
      GetNewsRoomList(type);
    } else {
      setLoader(false);
      toast.success( val === 1 ? "This story Added Scroll news!":"This story removed Scroll news!");
      GetNewsRoomList(type);
    }
  }

  const handleSwitchChange = (e: any, index: number, row: any) => {

    const { checked } = e.target;
    const  filteredUsers :any = storyList.filter((cate) => cate.story_id === row.story_id);
    let valStatus :any = checked ? 1 : 0;
    

    
    let arr = [...storyList];
    checked ? (arr[index] = {
          ...arr[index],
          n_status: 1,
        })
      : (arr[index] = {
          ...arr[index],
          n_status: 0,
        });
        setStoryList(arr);
        statusUpdate(filteredUsers[0]._id, valStatus)


       

  };

  const statusUpdate =async(id :any , val :any) =>{
    const body ={
      Id: id,
      n_status: val,
    }
    const results = await createNewStoryApi(body);
    setLoader(true);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
      // GetNewsRoomList(type);
      GetAllStories(type);
    } else {
      setLoader(false);
      if(val === 1){
        toast.success("This story is Active!");
      }else{
        toast.error("This story is In-Active!");
      }
      
      setLoader(false);
      GetAllStories(type);
    }
  }
  

 




  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
  };

  const GetAllStories = async (val: string) => {
    setLoader(true);
    const body = {
      n_limit: rowsPerPage,
      n_page: page + 1,
      c_search_term: search,
      c_from_date: dateRange?.start_date,
      c_to_date: dateRange?.end_date,
      c_reviwer_id: filters?.reviewer,
      c_hour: filters?.hours,
      c_main_category_id: filters?.main_category,
      c_sub_category_id: filters?.secondary_category,
      c_save_type: val,
    };
    setType(val);
    const results = await getAllStoriesListApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
    } else if (results?.payloadJson?.length === 0) {
      setLoader(false);
      setStoryList([]);
      setInitFlag(true);
      setCount(0);
    } else {
      setLoader(false);
      setStoryList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };

  const GetNewsRoomList = async (val: string) => {
    setLoader(true);
    const body = {
      n_limit: rowsPerPage,
      n_page: page + 1,
      c_search_term: "",
      c_from_date: "",
      c_to_date: "",
      c_reviwer_id: "",
      c_hour: "",
      c_main_category_id:  checkCategories(val),
      c_sub_category_id: "",
      c_save_type: "published",
    };
    setType(val);
    const results = await getAllStoriesListApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
    } else if (results?.payloadJson?.length === 0) {
      setLoader(false);
      setNewsRoomList([]);
      setInitFlag(true);
      setCount(0);
    } else {
      setLoader(false);
      setNewsRoomList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
    
  };
  const searchClear =() =>{
    setSearch("");
  }
  useEffect(() => {
    GetUserList();
    GetcategoriesList();
  }, []);

  const GetUserList = async () => {
    const results = await getMethodAllUserListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setUserArr([]);
      Cookies.remove("riho_token");
      Cookies.remove("_token");
      Cookies.remove("_token_expiry");
      Cookies.remove("role_id");
      Cookies.remove("role_name");
      Cookies.remove("user_name");
      router.push("/auth/login");
    } else {
      setUserArr(results?.payloadJson);
    }
  };

  const clearFilter = () => {
    setSearch("");
    setDateRange({ ...dateRange, start_date: "", end_date: "" });
    setFilters({
      ...filters,
      reviewer: "",
      hours: "",
      main_category: "",
      secondary_category: "",
    });
    GetAllStories(type);

    setAnchorEl(null);
  };

  const ApplyFilter = () => {
    GetAllStories(type);

    setAnchorEl(null);
  };

  useEffect(() => {
    if (initFlag) {
      GetAllStories(type);
    }
  }, [page, rowsPerPage]);

  // useEffect(() => {
  //   if (dateRange?.end_date !== "") {
  //     GetAllStories();
  //
  //   }
  // }, [dateRange]);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const newItems = [...newsroomList]
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    const body = {
      Id: newsroomList[result.source.index]?._id,
      n_story_order: newsroomList[result.destination.index]?.n_story_order,
      // n_story_order: result.destination.index + 1,
    };
    setLoader(true);
    ChangeOrderFn(body);
    setNewsRoomList(newItems);
  };

  const ChangeOrderFn = async (body: { Id: string; n_story_order: number }) => {
    const results = await newsroomOrderApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast?.error(results?.message ? results?.message : "Network Error");
    } else {
      setLoader(false);
      toast?.success(results?.message);

      

      if(type === "home"){
        GetNewsRoomList("home");
      }else if(type === "movie"){
        GetNewsRoomList("movie");
      }else if(type === "sport"){
        GetNewsRoomList("sport");
      }
     
      // GetCategoryList();
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetAllStories(type);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const DeleteStoryFn = async (body: any) => {
    setLoader(true);
    const results = await deleteStoryApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      toast.success(results?.message);
      setLoader(false);
      GetAllStories(type);
    }
  };

  const handlePinStory =async (id: any, val: any, type:any)=>{
    const body ={
      Id: id,
      pin_status: val,
    }
    const results = await createNewStoryApi(body);
    setLoader(true);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
      
      GetNewsRoomList(type);
    } else {
      setLoader(false);
      toast.success( val === 1 ? "This story pinned!":"This story Unpinned!");
      GetNewsRoomList(type);
    }

  }


  const DeleteItem = (val: any) => {
    setDeletePop(true);
    setDeleteValue(val);
  };


  const closePop = () => {
    setDeletePop(false);
    setDeleteValue("");
  };

  const handleDeleteStory = (id: string) => {
    setDeletePop(false);
    DeleteStoryFn(id);
  };

  const GetcategoriesList = async () => {
    const results = await getAllCategoryListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setCategoryArr([]);
    } else {
      // const sortedArray = results?.payloadJson?.sort((a, b) => {
      //   if (a._id === inputs?.main_category) return -1;
      //   if (b._id === inputs?.main_category) return 1;
      //   return 0;
      // });

      // setInputs({
      //   ...inputs,
      //   main_category: results?.payloadJson[0]?.c_category_id,
      //   secondary_category: sortedArray[0]?.c_sub_categories[0]?.c_category_id,
      //   cat_name: sortedArray[0]?.c_category_english_name,
      // });
      setCategoryArr(results?.payloadJson);
      setSecondaryCategoryArr(results?.payloadJson[0]?.c_sub_categories);
    }
  };

  const handleCategoryChange = (e: any, list: any) => {
    const { name } = e.target;
    if (name === "main_category") {
      const subArr = list?.filter(
        (item: any) => item?.c_category_id === e.target.value
      );
      // const getName = list?.filter(
      //   (item) => item?.c_category_id === e.target.value
      // );
      setSecondaryCategoryArr(subArr[0]?.c_sub_categories);
      setFilters({
        ...filters,
        main_category: e.target.value,
      });
    } else if (name === "secondary_category") {
      setFilters({ ...filters, secondary_category: e.target.value });
    }
  };


  

  return (
    <>
      {/* <Breadcrumbs pageTitle="Story" parent="My Favourites" /> */}
      <Container fluid>
        <Row>
          <Col sm="12" className="mt-2">
            <Card>
              <Grid container spacing={2} pl={2} py={4}>
                <Grid item xs={4}>
                  <Box>
                    <TextField
                      placeholder="Search ..."
                      fullWidth
                      value={search}
                      onChange={(e: any) => setSearch(e.target.value)}
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
                      sx={{
                        ".MuiInputBase-input": {
                          padding: "10px",
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    sx={{
                      py: 1.3,
                      px: 3,
                      fontSize: 12,
                      fontWeight: 550,
                      letterSpacing: 2,
                      textTransform: "capitalize",
                    }}
                    variant="outlined"
                    fullWidth
                    startIcon={<MdOutlineTune />}
                    onClick={handleClick}
                  >
                    Filter
                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{ width: "75%" }}
                  >
                    <Box pt={3}>
                      <Grid container spacing={2} pl={3} pr={3}>
                        <Grid item xs={6}>
                          <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <MobileDatePicker
                                label="From Date"
                                sx={{
                                  ".MuiInputBase-input": {
                                    padding: "10px",
                                    fontSize: "13px",
                                  },
                                  fieldset: {
                                    borderColor: "#c8c8c8",
                                  },
                                }}
                                maxDate={dayjs(new Date())}
                                value={dayjs(dateRange?.start_date)}
                                onChange={(newValue: any) => {
                                  setDateRange({
                                    ...dateRange,
                                    start_date:
                                      dayjs(newValue).format("YYYY-MM-DD"),
                                  });
                                }}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <MobileDatePicker
                                label="To Date"
                                sx={{
                                  ".MuiInputBase-input": {
                                    padding: "10px",
                                    fontSize: "13px",
                                  },
                                }}
                                onAccept={(newValue: any) => {
                                  setDateRange({
                                    ...dateRange,
                                    end_date:
                                      dayjs(newValue).format("YYYY-MM-DD"),
                                  });
                                }}
                                disabled={dateRange?.start_date === ""}
                                minDate={dayjs(dateRange?.start_date)}
                                maxDate={dayjs(new Date())}
                                value={dayjs(dateRange?.end_date)}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Grid>
                        {/* <Grid item xs={6}>
                          <Box>
                            <TextField
                              variant="outlined"
                              size="small"
                              select
                              SelectProps={{
                                native: true,
                              }}
                              fullWidth
                              name="hours"
                              value={filters?.hours}
                              onChange={handleFilterChange}
                              sx={{
                                ".MuiInputBase-input": {
                                  fontSize: "13px",
                                },
                              }}
                            >
                              <option value={""}>Select Hour</option>
                              <option value={24}>24 Hrs</option>
                              <option value={12}>12 Hrs</option>
                            </TextField>
                          </Box>
                        </Grid> */}
                        <Grid item xs={6}>
                          <Box>
                            <TextField
                              variant="outlined"
                              size="small"
                              select
                              SelectProps={{
                                native: true,
                              }}
                              fullWidth
                              sx={{
                                ".MuiInputBase-input": {
                                  fontSize: "13px",
                                },
                              }}
                              name="reviewer"
                              value={filters?.reviewer}
                              onChange={handleFilterChange}
                            >
                              <option value={""}>Select Reviewer</option>
                              {userArr?.map((list: any) => {
                                return (
                                  <option key={list._id} value={list?.user_id}>
                                    {list?.user_name}
                                  </option>
                                );
                              })}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box>
                            <TextField
                              variant="outlined"
                              size="small"
                              select
                              SelectProps={{
                                native: true,
                              }}
                              fullWidth
                              sx={{
                                ".MuiInputBase-input": {
                                  fontSize: "13px",
                                },
                              }}
                              name="main_category"
                              value={filters?.main_category}
                              onChange={(e) =>
                                handleCategoryChange(e, categoryArr)
                              }
                            >
                              <option value={""}>Select Menu</option>
                              {categoryArr?.map((list: any) => {
                                return (
                                  <option
                                    style={{ margin: "12px 0" }}
                                    key={list._id}
                                    value={list?.c_category_id}
                                  >
                                    {list?.c_category_name}
                                  </option>
                                );
                              })}
                            </TextField>
                          </Box>
                        </Grid>
                        {/* <Grid item xs={6}>
                          <Box>
                            <TextField
                              variant="outlined"
                              size="small"
                              select
                              SelectProps={{
                                native: true,
                              }}
                              fullWidth
                              sx={{
                                ".MuiInputBase-input": {
                                  fontSize: "13px",
                                },
                              }}
                              name="secondary_category"
                              value={filters?.secondary_category}
                              onChange={handleFilterChange}
                            >
                              <option value={""}>Choose...</option>
                              {secondaryCategoryArr?.map((list: any) => {
                                return (
                                  <option
                                    key={list._id}
                                    value={list?.c_category_id}
                                  >
                                    {list?.c_category_name}
                                  </option>
                                );
                              })}
                            </TextField>
                          </Box>
                        </Grid> */}
                        <Grid item xs={6} mb={2}>
                          <Button
                            variant="outlined"
                            onClick={clearFilter}
                            fullWidth
                          >
                            Clear Filter
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant="contained"
                            sx={{ color: "#fff" }}
                            onClick={ApplyFilter}
                            fullWidth
                          >
                            Apply Filter
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Popover>
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={3} textAlign={"end"}>
                  <Box pr={2}>
                    <Link href={`/${i18LangStatus}/story/create_story`}>
                    {/* {checkAdd &&  */}
                      <Button
                        sx={{
                          py: 1.3,
                          px: 3,
                          fontSize: 12,
                          fontWeight: 550,
                          letterSpacing: 2,
                          color: "#fff",
                        }}
                        variant="contained"
                      >
                        Create Story
                      </Button>
{/* } */}
                    </Link>
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <TabContext value={value}>
                  <Box>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      sx={{ px: 2 }}
                    >
                      <Tab
                        label="Published"
                        value="1"
                        onClick={() => GetAllStories("published")}
                        sx={{ fontFamily: `"Montserrat", sans-serif` }}
                      />
                      <Tab
                        label="News Room"
                        value="5"
                        onClick={() => GetNewsRoomList("home")}
                        sx={role_id !=="9386b7e94c7e" ?{ fontFamily: `"Montserrat", sans-serif` }:{display:"none"}}
                      />
                      <Tab
                        label="Movie"
                        value="6"
                        onClick={() => GetNewsRoomList("movie")}
                        sx={role_id !=="9386b7e94c7e" ?{ fontFamily: `"Montserrat", sans-serif` }:{display:"none"}}
                      />
                       <Tab
                        label="Sport"
                        value="7"
                        onClick={() => GetNewsRoomList("sport")}
                        sx={role_id !=="9386b7e94c7e" ?{ fontFamily: `"Montserrat", sans-serif` }:{display:"none"}}
                      />
                      <Tab
                        label="Draft"
                        value="2"
                        onClick={() => GetAllStories("save")}
                        sx={{ fontFamily: `"Montserrat", sans-serif` }}
                      />
                      {/* <Tab
                        label="Scheduled"
                        value="3"
                        onClick={() => GetAllStories("scheduleforlater")}
                        sx={{ fontFamily: `"Montserrat", sans-serif` }}
                      /> */}
                      <Tab
                        label="For Review"
                        value="4"
                        onClick={() => GetAllStories("submitforreview")}
                        sx={{ fontFamily: `"Montserrat", sans-serif` }}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <StoryList
                      storyList={storyList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                  <TabPanel value="2">
                    <StoryList
                      storyList={storyList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                  <TabPanel value="3">
                    <StoryList
                      storyList={storyList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                  <TabPanel value="4">
                    <StoryList
                      storyList={storyList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                  <TabPanel value="5">
                    <NewsRoomList
                      storyList={newsroomList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      onDragEnd={onDragEnd}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                  <TabPanel value="6">
                    <NewsRoomList
                      storyList={newsroomList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      onDragEnd={onDragEnd}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                  <TabPanel value="7">
                    <NewsRoomList
                      storyList={newsroomList}
                      loader={loader}
                      handleDeleteStory={DeleteItem}
                      count={count}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      initFlag={initFlag}
                      onDragEnd={onDragEnd}
                      handlePinStory={handlePinStory}
                      tabValue={value}
                      handleCheck={handleCheck}
                      handleSwitchChange={handleSwitchChange}
                    />
                  </TabPanel>
                </TabContext>
              </Box>
            </Card>
          </Col>
        </Row>
        <DeletePop
       open={deletePop}
       handleDeleteItem={()=>handleDeleteStory(deleteValue)}
       close={closePop}
      />
      </Container>
    </>
  );
};

export default StoryPageContainer;
