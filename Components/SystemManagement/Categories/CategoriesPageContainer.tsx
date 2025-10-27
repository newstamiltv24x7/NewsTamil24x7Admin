import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";
import CategoriesList from "./CategoriesList";
import AddCategoryPop from "./AddCategoryPop";

function CategoriesPageContainer() {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                    setOpen(true);
                    setTitle(" Main Category");
                  }}
                >
                  Add Main Category
                </Button>
              </Box>
              <CardBody className="pt-0">
                <CategoriesList
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddCategoryPop open={open} close={() => setOpen(false)} title={title} />
    </div>
  );
}

export default CategoriesPageContainer;
