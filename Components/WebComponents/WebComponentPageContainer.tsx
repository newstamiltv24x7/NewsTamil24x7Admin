import { Box, Button, InputAdornment, Tab, TextField } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
import WebComponentsList from "./WebComponentsList";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddComponentsPop from "./AddComponentsPop";

function WebComponentPageContainer() {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [value, setValue] = React.useState("1");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TabMenu = [
    {
      label: "Desktop Nav",
      id: 1,
    },
    {
      label: "Desktop Sub Nav",
      id: 2,
    },
    {
      label: "Desktop Menu",
      id: 3,
    },
    {
      label: "Mobile Nav",
      id: 4,
    },
    {
      label: "Mobile Drawer Nav",
      id: 5,
    },
    {
      label: "App Top Menu",
      id: 6,
    },
    {
      label: "App Nav",
      id: 7,
    },
    {
      label: "App Bottom Tabs",
      id: 8,
    },
    {
      label: "App Drawer Nav",
      id: 9,
    },
  ];

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
                    setTitle("Add Component");
                    setOpen(true);
                  }}
                >
                  Add New Component
                </Button>
              </Box>
              <CardBody className="pt-0">
                <Box>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        {/* {TabMenu?.map((list) => (
                          <Tab
                            label={list?.label}
                            value={list?.id}
                            sx={{
                              fontFamily: `"Montserrat", sans-serif,`,
                              fontSize: 10,
                            }}
                          />
                        ))} */}
                        <Tab
                          label="Desktop Nav"
                          value="1"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif,`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="Desktop Sub Nav"
                          value="2"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="Desktop Menu"
                          value="3"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="Mobile Nav"
                          value="4"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="Mobile Drawer Nav"
                          value="5"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="App Top Menu"
                          value="6"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="App Nav"
                          value="7"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="App Bottom Tabs"
                          value="8"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                        <Tab
                          label="App Drawer Nav"
                          value="9"
                          sx={{
                            fontFamily: `"Montserrat", sans-serif`,
                            fontSize: 10,
                          }}
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="2" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="3" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="4" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="5" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="6" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="7" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="8" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                    <TabPanel value="9" sx={{ p: "10px 0 0 0" }}>
                      <WebComponentsList
                        adList={adList}
                        loader={loader}
                        initFlag={initFlag}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        count={count}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        //   handleDeleteAd={DeleteAd}
                      />
                    </TabPanel>
                  </TabContext>
                </Box>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddComponentsPop
        open={open}
        close={() => setOpen(false)}
        title={title}
      />
    </div>
  );
}

export default WebComponentPageContainer;
