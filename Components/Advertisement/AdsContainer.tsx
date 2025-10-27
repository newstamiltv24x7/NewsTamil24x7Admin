import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import {
  deleteAdvertisementApi,
  getAllAdsListApi,
} from "@/apiFunctions/ApiAction";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import AdList from "./AdList";
import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import { RiSearch2Line } from "react-icons/ri";

const AdsContainer = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [adList, setAdList] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetAdList = async () => {
    const body = {
      n_page: page + 1,
      n_limit: rowsPerPage,
      c_search_term: search,
      c_from_date: "",
      c_to_date: "",
    };
    const results = await getAllAdsListApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.message);
    } else if (results?.payloadJson?.length === 0) {
      setLoader(false);
      setAdList([]);
      setInitFlag(true);
      setCount(0);
    } else {
      setLoader(false);
      setAdList(results?.payloadJson?.at(0)?.data);
      setInitFlag(true);
      setCount(results?.payloadJson?.at(0)?.total_count?.at(0)?.count);
    }
  };

  const DeleteAd = async (body: any) => {
    setLoader(true);
    const results = await deleteAdvertisementApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
    } else {
      setLoader(false);
      GetAdList();
      toast.success("Ad Deleted Successfully");
    }
  };

  useEffect(() => {
    GetAdList();
    setLoader(true);
  }, [page, rowsPerPage]);

  useEffect(() => {
    let timer = setTimeout(() => {
      GetAdList();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

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
                <Link href={`/${i18LangStatus}/ads/create-ad`}>
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
                    Create Ad
                  </Button>
                </Link>
              </Box>
              <CardBody>
                <AdList
                  adList={adList}
                  loader={loader}
                  initFlag={initFlag}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  count={count}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  handleDeleteAd={DeleteAd}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdsContainer;
