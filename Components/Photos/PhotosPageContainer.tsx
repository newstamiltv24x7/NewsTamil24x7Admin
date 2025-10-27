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
  import { RiSearch2Line } from "react-icons/ri";
  import { BsDatabaseX } from "react-icons/bs";
  import { toast } from "react-toastify";
  import { BiSolidMessageAltEdit } from "react-icons/bi";
  import { RiDeleteBin5Line } from "react-icons/ri";
  import { converDayJsDate } from "@/helper/frontend_helper";
  import {
    createPhotosApi,
    deletePhotosApi,
    getAllPhotosListApi,
  } from "@/apiFunctions/ApiAction";
  import Link from "next/link";
  import { useAppSelector } from "@/Redux/Hooks";
  import DeletePop from "../DeletePopup/DeletePop";
  import { IoMdClose } from "react-icons/io";
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };
  
  function PhotosPageContainer() {
    const { i18LangStatus } = useAppSelector((store) => store.langSlice);
    const [adList, setAdList] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, setLoader] = useState(false);
    const [initFlag, setInitFlag] = useState(false);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");
    const [deletePop, setDeletePop] = useState(false);
    const [deleteValue, setDeleteValue] = useState("");
  
    const handleChangePage = (event: any, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: any) => {
      setRowsPerPage(parseInt(event.target?.value, 10));
      setPage(0);
    };
  
    const GetAllPhotosList = async () => {
      setLoader(true);
      const body = {
        n_page: page + 1,
        n_limit: rowsPerPage,
        c_search_term: search,
      };
      const results = await getAllPhotosListApi(body);
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

    const statusUpdate =async(id: any  , val: any ) =>{
      const body ={
        Id: id,
        n_status: val,
      }
      const results = await createPhotosApi(body);
      setLoader(true);
      if (results?.appStatusCode !== 0) {
        setLoader(false);
        toast.error(results?.error);
        GetAllPhotosList()
      } else {
        setLoader(false);
        if(val === 1){
          toast.success("This Photos is Active!");
        }else{
          toast.error("This Photos is In-Active!");
        }
        
        setLoader(false);
        GetAllPhotosList()
      }
    }
  
    const handleSwitchChange = (e: any, index: number, row: any) => {
      const { checked } = e.target;

      

      const  filteredUsers :any = adList.filter((cate :any) => cate.c_photos_id === row.c_photos_id);
      let valStatus :any  = checked ? 1 : 0;
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
  
    const DeleteItem = (val:any) => {
      setDeletePop(true);
      setDeleteValue(val);
    };
    const searchClear =() =>{
      
      setSearch("");
    }
  
    const closePop = () => {
      setDeletePop(false);
      setDeleteValue("");
    };
  
    const handleDeletePhotos = async (id: string) => {
      setDeletePop(false);
      const results = await deletePhotosApi(id);
      if (results?.appStatusCode !== 0) {
        toast?.error(results?.error);
      } else {
        toast?.success(results?.message);
        GetAllPhotosList();
      }
    };
  
    useEffect(() => {
      let timer = setTimeout(() => {
        GetAllPhotosList();
      }, 500);
  
      return () => {
        clearTimeout(timer);
      };
    }, [search]);
  
    useEffect(() => {
      if (initFlag) {
        GetAllPhotosList();
      }
    }, [page, rowsPerPage]);
  
    return (
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <Box className="d-flex justify-content-between align-items-center">
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
                  <Link href={`/${i18LangStatus}/photos/create-photos`}>
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
                    >
                      Add Photos
                    </Button>
                  </Link>
                </Box>
              </Box>
              <CardBody>
                <Table responsive className={`table-wrapper`}>
                  <thead style={{ background: "#000" }}>
                    <tr>
                      <th style={{ color: "#fff" }}>S.No</th>
                      <th style={{ color: "#fff", width: 400 }}>
                        Photos Title
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
                        adList?.map((row: any, index: number) => (
                          <tr key={index}>
                             <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                            <td className="textWrapper py-18">
                              {row?.c_photos_title}
                            </td>
                            <td>{converDayJsDate(row?.createdAt)}</td>
                            <td>{row?.c_createdName}</td>
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
                                  <Link
                                    href={`/${i18LangStatus}/photos/edit-photos/${row.c_photos_id}`}
                                  >
                                    <BiSolidMessageAltEdit
                                      style={{
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        color: "#000",
                                        position: "relative",
                                        top: 5,
                                      }}
                                    />
                                  </Link>
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
                      No Photos Added Yet{" "}
                    </Label>
                  </Box>
                )}
                {!loader && adList?.length !== 0 && (
                  <TablePagination
                    component="div"
                    count={Number(count)}
                    page={page}
                    onPageChange={(e: any) => handleChangePage(e, page)}
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
        <DeletePop 
         open={deletePop}
         handleDeleteItem={()=>handleDeletePhotos(deleteValue)}
         close={closePop}
        />
      </Container>
    );
  }
  
  export default PhotosPageContainer;
  