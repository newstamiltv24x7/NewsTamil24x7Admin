import { Box, Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { RiSearch2Line } from "react-icons/ri";
import TagsList from "./WebAppConfigList";
import AddTagsPop from "./AddTagsPop";
import {
  createWebConfigTagsApi,
  deleteWebConfigTagsAPI,
  getWebAppConfigTags,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";

function TagsPageContainer() {
  const [search, setSearch] = useState("");
  const [adList, setAdList] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [inputs, setInputs] = useState({
    tag_name: "",
    state: "",
    url: "",
    id: "",
  });

  const handleChange = (e: any) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const body = {
        c_tag_name: inputs?.tag_name,
        c_tag_state: inputs?.state,
        c_redirect_url: inputs?.url,
        Id: inputs?.id,
      };
      const results = await createWebConfigTagsApi(body);
      if (results?.appStatusCode === 0) {
        GetTags();
        setOpen(false);
        toast?.success(results?.message);
      } else {
        toast?.error(results?.error);
      }
    } catch (err: any) {
      toast?.error(err);
    }
  };

  const DeleteTag = async (id: string) => {
    setLoader(true);
    try {
      const results = await deleteWebConfigTagsAPI(id);
      if (results?.appStatusCode === 0) {
        setLoader(false);
        GetTags();
        toast?.success(results?.message);
      } else {
        setLoader(false);
        toast?.error(results?.error);
      }
    } catch (err: any) {
      setLoader(false);
      toast?.error(err);
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GetTags = async () => {
    setLoader(true);
    try {
      const body = {
        n_page: page + 1,
        n_limit: rowsPerPage,
        c_search_term: search,
      };
      const results = await getWebAppConfigTags(body);
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
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      GetTags();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleEdit = (list: any) => {
    setOpen(true);
    setInputs({
      ...inputs,
      tag_name: list?.c_tag_name,
      url: list?.c_redirect_url,
      state: list?.c_tag_state,
      id: list?._id,
    });
  };

  useEffect(() => {
    GetTags();
    setLoader(true);
  }, [page, rowsPerPage]);

  useEffect(() => {
    GetTags();
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
                    setTitle("Add Tags");
                    setInputs({
                      tag_name: "",
                      state: "",
                      url: "",
                      id: "",
                    });
                  }}
                >
                  Add Tags
                </Button>
              </Box>
              <CardBody className="pt-0">
                <TagsList
                  adList={adList}
                  loader={loader}
                  initFlag={initFlag}
                  handleDeleteAd={DeleteTag}
                  handleEdit={handleEdit}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  count={count}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <AddTagsPop
        open={open}
        close={() => setOpen(false)}
        title={title}
        handleChange={handleChange}
        inputs={inputs}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default TagsPageContainer;
