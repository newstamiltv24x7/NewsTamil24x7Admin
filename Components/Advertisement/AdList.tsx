import { useAppSelector } from "@/Redux/Hooks";
import { converDayJsDate } from "@/helper/frontend_helper";
import { Box, Skeleton, TablePagination } from "@mui/material";
import Link from "next/link";
import { Label, Table } from "reactstrap";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";

const AdList = (props: any) => {
  const {
    adList,
    loader,
    initFlag,
    page,
    rowsPerPage,
    count,
    handleChangePage,
    handleChangeRowsPerPage,
    handleDeleteAd,
  } = props;

  const { i18LangStatus } = useAppSelector((store) => store.langSlice);

  return (
    <>
      <Table responsive className={`table-wrapper`}>
        <thead style={{ background: "#000" }}>
          <tr>
            <th style={{ color: "#fff" }}>S.No</th>
            <th style={{ color: "#fff" }}>
              Title
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
            <th style={{ color: "#fff" }}>Type</th>
            <th style={{ color: "#fff" }}>Start Date</th>
            <th style={{ color: "#fff" }}>End Date</th>
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
            <th style={{ color: "#fff" }}>Created By</th>
            <th style={{ color: "#fff", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        {loader ? (
          <tbody>
            {[1, 2, 3, 4, 5]?.map((list) => (
              <tr key={list}>
                {[1, 2, 3, 4, 5, 6, 7, 8]?.map((item) => (
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
                  <td className="">{row?.c_advt_title}</td>
                  <td>{row?.c_advt_type}</td>
                  <td>{converDayJsDate(row.c_banner_start_date)}</td>
                  <td>{converDayJsDate(row.c_banner_end_date)}</td>
                  <td>{converDayJsDate(row.createdAt)}</td>
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
                      <Link
                        href={{
                          pathname: `/${i18LangStatus}/ads/edit-ad/${row?.c_advt_id}`,
                          // query: { id: encodeURIComponent(row.media.toString()) },
                        }}
                      >
                        <BiSolidMessageAltEdit
                          style={{
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#000",
                            position: "relative",
                            top: "5px"
                          }}
                        />
                      </Link>
                      <RiDeleteBin5Line
                        style={{
                          fontSize: "20px",
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteAd(row?._id)}
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
          <Label style={{ fontSize: "20px" }}>No Advertisement Added Yet </Label>
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
  );
};

export default AdList;
