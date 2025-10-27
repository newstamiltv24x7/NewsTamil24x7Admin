import {
  Box,
  Button,
  InputAdornment,
  Skeleton,
  TablePagination,
  TextField,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Label, Row, Table } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  deleteSeoListAPi,
  getSeoListApi,
  getSeoSetupListApi,
} from "@/apiFunctions/ApiAction";
import { converDayJsDate } from "@/helper/frontend_helper";

function SEOListPage() {
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState(false);
  const [filter, setFilter] = useState("");

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetSeoList = async () => {
    try {
      const body = {
        n_page: page + 1,
        n_limit: rowsPerPage,
        c_search_term: search,
        category_id: filter,
      };
      const results = await getSeoListApi(body);
      if (results?.appStatusCode === 0) {
        if (results?.payloadJson?.length === 0) {
          setLoader(false);
          setAdList([]);
          setInitFlag(true);
          setCount(0);
        } else {
          setInitFlag(true);
          setLoader(false);
          setAdList(results?.payloadJson?.at(0)?.data);
          setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
        }
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err: any) {
      toast?.error(err);
    }
  };

  useEffect(() => {
    if (initFlag) {
      let timer = setTimeout(() => {
        GetSeoList();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [search]);

  const DeleteTag = async (id: string) => {
    setLoader(true);
    try {
      const results = await deleteSeoListAPi(id);
      if (results?.appStatusCode === 0) {
        setLoader(false);
        GetSeoList();
        toast?.success(results?.message);
      } else {
        setLoader(false);
        toast?.error(results?.message);
      }
    } catch (err: any) {
      setLoader(false);
      toast?.error(err);
    }
  };

  useEffect(() => {
    if (initFlag) {
      GetSeoList();
    }
  }, [filter]);

  useEffect(() => {
    GetSeoList();
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
                <Box pl={2.5} my={2} display={"flex"} gap={3}>
                  <TextField
                    placeholder="Search ..."
                    fullWidth
                    value={search}
                    size="small"
                    sx={{ width: "150%" }}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RiSearch2Line />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* <TextField
                    id="standard-select-currency-native"
                    select
                    fullWidth
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    size="small"
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                  >
                    <option value="">Filter</option>
                    {adList.map((option: any) => (
                      <option
                        key={option._id}
                        value={option?.c_seo_category_title}
                      >
                        {option?.c_seo_category_title}
                      </option>
                    ))}
                  </TextField> */}
                </Box>
                <Link href={"/en/seo-setup/manage-seo"}>
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
                  >
                    Manage SEO
                  </Button>
                </Link>
              </Box>
              <CardBody className="pt-0">
                <>
                  <Table responsive className={`table-wrapper`}>
                    <thead style={{ background: "#000" }}>
                      <tr>
                        <th style={{ color: "#fff" }}>S.No</th>
                        <th style={{ color: "#fff" }}>Page Title</th>
                        <th style={{ color: "#fff" }}>Page Type</th>
                        <th style={{ color: "#fff" }}>Created At</th>
                        <th style={{ color: "#fff" }}>Created By</th>
                        <th style={{ color: "#fff", textAlign: "center" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    {loader ? (
                      <tbody>
                        {[1, 2, 3, 4, 5]?.map((list) => (
                          <tr key={list}>
                            {[1, 2, 3, 4, 5, 6]?.map((item) => (
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
                        {Array.isArray(adList) &&
                          adList?.map((row, index) => (
                            <tr key={index}>
                               <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                              <td>{row?.c_seo_page_title}</td>
                              <td>{row?.c_seo_category_title}</td>
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
                                  {/* <Link
                            href={{
                              pathname: `/${i18LangStatus}/ads/edit-ad/${row?.c_advt_id}`,
                              // query: { id: encodeURIComponent(row.media.toString()) },
                            }}
                          > */}
                                  <BiSolidMessageAltEdit
                                    style={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#000",
                                    }}
                                  />
                                  {/* </Link> */}
                                  <RiDeleteBin5Line
                                    style={{
                                      fontSize: "20px",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => DeleteTag(row?._id)}
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
                        No Data Found{" "}
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
                </>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SEOListPage;
