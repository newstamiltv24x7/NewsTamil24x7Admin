import * as React from "react";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Box, Skeleton, TablePagination } from "@mui/material";
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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TiPin } from "react-icons/ti";

export default function NewsRoomList(props) {
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
    onDragEnd,
    handlePinStory,
    tabValue
  } = props;
  const router = useRouter();
  const getToken = Cookies.get("_token");
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [sortType, setSortType] = React.useState({
    name: false,
    date: false,
  });

  const handleSort = (name, type) => {
    let newOne = storyList;
    if (name === "name") {
      if (type === "asc") {
        setSortType({ ...sortType, name: true });
        newOne.sort((a, b) => {
          let fa = a?.story_title_name.toLowerCase(),
            fb = b?.story_title_name.toLowerCase();

          return fa < fb ? -1 : 1;
        });
      } else {
        setSortType({ ...sortType, name: false });
        newOne.sort((a, b) => {
          let fa = b?.story_title_name.toLowerCase(),
            fb = a?.story_title_name.toLowerCase();

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

  return (
    <React.Fragment>
      {/* {loader ? (
        <Skeleton variant="rectangular" width={"100%"} height={"50vh"} />
      ) : ( */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided) => (
            <Table responsive className={`table-wrapper`}>
              <thead style={{ background: "#000" }}>
                <tr>
                  <th style={{ color: "#fff" }}>S.No</th>
                  <th style={{ color: "#fff" }}>Cover Image</th>
                  <th style={{ color: "#fff", width: "320px" }}>
                    Story Heading{" "}
                    {/* {sortType.name ? (
                      <RiArrowUpCircleLine
                        className="arrows"
                        onClick={() => handleSort("name", "dsc")}
                      />
                    ) : (
                      <RiArrowDownCircleLine
                        className="arrows"
                        onClick={() => handleSort("name", "asc")}
                      />
                    )} */}
                  </th>

                  {/* {getToken === "super-admin" ||
              (getToken === "admin" && (
                <th style={{ color: "#fff" }}>Created By</th>
              ))} */}

                  <th style={{ color: "#fff" }}>Reviewer</th>
                  <th style={{ color: "#fff" }}>Created By</th>
                  <th style={{ color: "#fff" }}>
                    Created At{" "}
                    {/* {sortType.date ? (
                      <RiArrowUpCircleLine
                        className="arrows"
                        onClick={() => handleSort("date", "dsc")}
                      />
                    ) : (
                      <RiArrowDownCircleLine
                        className="arrows"
                        onClick={() => handleSort("date", "asc")}
                      />
                    )} */}
                  </th>
                  <th style={{ color: "#fff", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              {loader ? (
                <tbody>
                  {[1, 2, 3, 4, 5]?.map((list) => (
                    <tr key={list}>
                      {[1, 2, 3, 4, 5, 6, 7]?.map((item) => (
                        <td key={item}>
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
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {storyList &&
                    storyList.map((row, index) => (
                      <Draggable
                        key={row._id}
                        draggableId={row._id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            key={index}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td scope="row">
                              {index + 1 + page * rowsPerPage}
                            </td>
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

                            {/* {(getToken === "super-admin" || getToken === "admin") && (
                    <td>{row?.createdName}</td>
                  )} */}

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
                                {
                        row?.pin_status === 0 ? 
                        tabValue === "5" &&
                        <TiPin 
                        style={{
                          fontSize: "20px",
                          color: "#d1d1d1",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePinStory(row?._id, 1,"home")}
                        />   

                        :
                        tabValue === "5" &&
                        <TiPin 
                        style={{
                          fontSize: "20px",
                          color: "green",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePinStory(row?._id, 0,"home")}
                        />  
                       }  
                              </Box>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                </tbody>
              )}
            </Table>
          )}
        </Droppable>
      </DragDropContext>
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
    </React.Fragment>
  );
}
