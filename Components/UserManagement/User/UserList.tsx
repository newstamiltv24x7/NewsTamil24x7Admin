import { useAppSelector } from "@/Redux/Hooks";
import { converDayJsDate } from "@/helper/frontend_helper";
import { Avatar, Box, Chip, Skeleton, TablePagination } from "@mui/material";
import Link from "next/link";
import { Label, Table } from "reactstrap";
import { BiSolidMessageAltEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsDatabaseX } from "react-icons/bs";
import { useEffect } from "react";
import Image from "next/image";
import AvatarLogo from "@/public/assets/images/Maa.png";

const UserList = (props: any) => {
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
    handleEdit,
  } = props;

  const { i18LangStatus } = useAppSelector((store) => store.langSlice);

  
  

  return (
    <>

    


      <Table responsive className={`table-wrapper`}>
        <thead style={{ background: "#000" }}>
          <tr>
            <th style={{ color: "#fff" }}>S.No</th>
            <th style={{ color: "#fff" }}>User Image</th>
            <th style={{ color: "#fff" }}>User Name</th>
            <th style={{ color: "#fff" }}>
              Email
            </th>
            <th style={{ color: "#fff" }}>Role</th>
            <th style={{ color: "#fff", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        {loader ? (
          <tbody>
            {[1, 2, 3, 4, 5,6]?.map((list) => (
              <tr key={list}>
                {[1, 2, 3, 4, 5,6]?.map((item) => (
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

          adList.length === 0 ? (
            <tbody>
              <p style={{textAlign:"left",paddingTop:"10px"}}>No Records found</p>
              </tbody>
          ):(
            <tbody>
            {Array.isArray(adList) &&
              adList?.map((row, index) => (
                <tr key={index}>
                  <td scope="row">{index + 1 + (page * rowsPerPage)}</td>

                  {row?.c_user_img_url ? (
                    <td style={{ textAlign: "left" }}>
                      {/* <Image
                        src={row?.c_user_img_url}
                        alt=""
                        width={80}
                        height={80}
                        style={{ objectFit: "contain", borderRadius:"50%" }}
                      /> */}
                      <Avatar
                        alt=""
                        src={row?.c_user_img_url}
                        sx={{ width: "60px", height: "60px" }}
                        style={{ objectFit: "contain" }}
                      />
                    </td>
                  ) : (
                    <td style={{ textAlign: "left" }}>
                      <Image
                        src={AvatarLogo}
                        alt=""
                        width={60}
                        height={60}
                        style={{ objectFit: "contain" }}
                      />
                    </td>
                  )}
                  
                  <td className="">
                    {row?.user_name}
                  </td>

                  <td className="">{row?.email}</td>
                  <td className="">{row?.c_role_name}</td>
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
          )
          
          
        )}
      </Table>
      {/* {!loader && initFlag && adList?.length === 0 && ( */}
      {/* <Box textAlign={"center"} my={4}>
        <BsDatabaseX style={{ fontSize: "40px" }} />
        <br />
        <Label style={{ fontSize: "20px" }}>No Data Found </Label>
      </Box> */}
      {/* //   )} */}
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

export default UserList;
