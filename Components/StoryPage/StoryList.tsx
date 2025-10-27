import * as React from "react";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Box, Checkbox, Skeleton, TablePagination } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import { Label, Table } from "reactstrap";
import { converDayJsDate } from "@/helper/frontend_helper";
import { RiArrowUpCircleLine } from "react-icons/ri";
import { RiArrowDownCircleLine } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import Cookies from "js-cookie";
import Image from "next/image";
import AvatarLogo from "@/public/assets/images/avatar.png";
import { TiPin } from "react-icons/ti";
import Switch from '@mui/material/Switch';
const label = { inputProps: { 'aria-label': 'Size switch demo' } };

function findArray(arr: any, obj: any) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == obj) return true;
  }
}

export default function StoryList(props: any) {
  const {
    storyList,
    loader,
    handleDeleteStory,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    count,
    initFlag,
    handlePinStory,
    handleCheck,
    handleSwitchChange
  } = props;

  

  const router = useRouter();
  const getToken = Cookies.get("_token");
  const role_id = Cookies.get("role_id");
  const user_id = Cookies.get("user_id");
  const check: any = Cookies.get("privileges");
  // const checkAdd: any = "";
  // const checkEdit: any = "";
  // const checkDelete: any = "";
  // const checkView: any = "";

  const { i18LangStatus } = useAppSelector((store) => store.langSlice);

  const [sortType, setSortType] = React.useState({
    name: false,
    date: false,
  });

  const handleSort = (name: String, type: String) => {
    let newOne = storyList;
    if (name === "name") {
      if (type === "asc") {
        setSortType({ ...sortType, name: true });
        newOne.sort((a: any, b: any) => {
          let fa = a?.story_title_name.toLowerCase(),
            fb = b?.story_title_name.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      } else {
        setSortType({ ...sortType, name: false });
        newOne.sort((a: any, b: any) => {
          let fa = b?.story_title_name.toLowerCase(),
            fb = a?.story_title_name.toLowerCase();

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
  // React.useEffect(() => {
  //   if (check === undefined) {
  //     Cookies.remove("riho_token");
  //     Cookies.remove("_token");
  //     Cookies.remove("_token_expiry");
  //     Cookies.remove("role_id");
  //     Cookies.remove("role_name");
  //     Cookies.remove("user_name");
  //     router.push("/auth/login");
  //   } else {
  //     const checkArray: any = JSON.parse(check);
  //     checkAdd = findArray(checkArray, "add");
  //     checkEdit = findArray(checkArray, "edit");
  //     checkDelete = findArray(checkArray, "delete");
  //     checkView = findArray(checkArray, "view");
  //   }
  // }, []);

  return (
    <React.Fragment>
      {/* {loader ? (
        <Skeleton variant="rectangular" width={"100%"} height={"50vh"} />
      ) : ( */}
      <Table responsive className={`table-wrapper`}>
        <thead style={{ background: "#000" }}>
          <tr>
            <th style={{ color: "#fff" }}>S.No</th>
            <th style={{ color: "#fff" }}>Cover Image</th>
            <th style={{ color: "#fff", width: "320px" }}>Story Heading </th>
            {/* <th style={{ color: "#fff" }}>Visit Count </th> */}
            <th style={{ color: "#fff" }}>Reviewer</th>
            <th style={{ color: "#fff" }}>Created By</th>
            <th style={{ color: "#fff" }}>Created At </th>
            <th style={{ color: "#fff", textAlign: "center" }}>Action</th>
            <th style={{ color: "#fff", textAlign: "center" }}>
              Scroll News 
            </th>
            <th style={{ color: "#fff", textAlign: "center" }}>Control</th>
          </tr>
        </thead>
        {loader ? (
          <tbody>
            {[1, 2, 3, 4, 5]?.map((list) => (
              <tr key={list}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9,10]?.map((item) => (
                  <td>
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      width={"100%"}
                      height={"10vh"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {storyList &&
              storyList.map((row: any, index: any) => (
                <tr key={index}>
                  <td scope="row">{index + 1 + page * rowsPerPage}</td>
                  {row?.story_cover_image_url ? (
                    <td style={{ textAlign: "left" }}>
                      <Image
                        src={row?.story_cover_image_url}
                        alt=""
                        width={100}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
                    </td>
                  ) : (
                    <td style={{ textAlign: "left" }}>
                      <Image
                        src={AvatarLogo}
                        alt=""
                        width={100}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
                    </td>
                  )}
                  <td>
                    <p
                      className="mb-0 textWrapper py-18"
                      style={{ width: "300px" }}
                    >
                      {" "}
                      {row?.story_title_name}
                    </p>
                  </td>
                  {/* <td>{row?.visitcount}</td> */}
                  <td>{row?.reviwerName}</td>
                  <td>{row?.createdName}</td>
                  <td>{converDayJsDate(row.createdAt)}</td>
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

                      {role_id !== undefined && role_id === "9386b7e94c7e" ? (
                        user_id !== undefined && user_id === row.c_createdBy ? (
                          role_id === "9386b7e94c7e" &&
                          row.c_save_type === "published" ? (
                            <Link href={{}}>
                              <BiSolidMessageAltEdit
                                style={{
                                  fontSize: "20px",
                                  cursor: "pointer",
                                  color: "#d1d1d1",
                                  position: "relative",
                                  top: 5,
                                }}
                              />
                            </Link>
                          ) : (
                            <Link
                              href={{
                                pathname: `/${i18LangStatus}/story/edit_story/${row?.story_id}`,
                                // query: { id: encodeURIComponent(row.media.toString()) },
                              }}
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
                          )
                        ) : (
                          <Link href={{}}>
                            <BiSolidMessageAltEdit
                              style={{
                                fontSize: "20px",
                                cursor: "pointer",
                                color: "#d1d1d1",
                                position: "relative",
                                top: 5,
                              }}
                            />
                          </Link>
                        )
                      ) : (
                        <Link
                          href={{
                            pathname: `/${i18LangStatus}/story/edit_story/${row?.story_id}`,
                            // query: { id: encodeURIComponent(row.media.toString()) },
                          }}
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
                      )}

                     
                        <RiDeleteBin5Line
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDeleteStory(row?._id)}
                        />
                 

                      <Link
                        href={{
                          pathname: `/${i18LangStatus}/story-preview/${row?.story_id}`,
                        }}
                        target="_blank"
                      >
                      
                          <FaEye
                            style={{
                              fontSize: "20px",
                              color: "#000",
                              cursor: "pointer",
                              position: "relative",
                              top: 5,
                            }}
                          />
                     
                      </Link>
                      {/* {
                        row?.pin_status === 0 ? 
                        <TiPin 
                        style={{
                          fontSize: "20px",
                          color: "#d1d1d1",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePinStory(row?._id, 1)}
                        />   

                        :
                        <TiPin 
                        style={{
                          fontSize: "20px",
                          color: "green",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePinStory(row?._id, 0)}
                        />  
                       }    */}
                    </Box>
                  </td>
                  <td>
                    <Box textAlign={"center"}>
                      <Checkbox
                        sx={{ pt: "3px", pl: 0 }}
                        checked={row?.live_status === 1}
                        onChange={(e) => handleCheck(e, index, row)}
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
      {!loader && initFlag && storyList?.length === 0 && (
        <Box textAlign={"center"} my={4}>
          <BsDatabaseX style={{ fontSize: "40px" }} />
          <br />
          <Label style={{ fontSize: "20px" }}>No Stories Added Yet </Label>
        </Box>
      )}
      {!loader && storyList?.length !== 0 && (
        <TablePagination
          component="div"
          count={Number(count)}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
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
    </React.Fragment>
  );
}
