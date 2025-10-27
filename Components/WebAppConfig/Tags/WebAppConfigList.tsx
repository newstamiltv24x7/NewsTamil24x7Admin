import { Box, Skeleton, TablePagination } from "@mui/material";
import Link from "next/link";
import { Label, Table } from "reactstrap";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";

const TagsList = (props: any) => {
  const {
    adList,
    loader,
    handleDeleteAd,
    initFlag,
    handleEdit,
    page,
    rowsPerPage,
    count,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  return (
    <>
      <Table responsive className={`table-wrapper`}>
        <thead style={{ background: "#000" }}>
          <tr>
            <th style={{ color: "#fff" }}>S.No</th>
            <th style={{ color: "#fff" }}>
              Tag Name
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
            <th style={{ color: "#fff" }}>State</th>
            <th style={{ color: "#fff" }}>Redirect URL</th>
            <th style={{ color: "#fff", textAlign: "center" }}>Action</th>
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
            {Array.isArray(adList) &&
              adList?.map((row, index) => (
                <tr key={index}>
                   <td scope="row">{index + 1 + (page * rowsPerPage)}</td>
                  <td className="">{row?.c_tag_name}</td>
                  <td>{row?.c_tag_state}</td>
                  <td>{row?.c_redirect_url}</td>

                  <td align="left">
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={2}
                    >
                      {/* {row?.n_status === 1 ? (
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
                      )} */}
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
                        onClick={() => handleEdit(row)}
                      />
                      {/* </Link> */}
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
          <Label style={{ fontSize: "20px" }}>No Data Found </Label>
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

export default TagsList;
