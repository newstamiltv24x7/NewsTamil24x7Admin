import {
  createHrules,
  getAllCityListApi,
  getAllSocialHandlesList,
  getAllTagsList,
  getAllUserListApi,
  getHruleData,
} from "@/apiFunctions/ApiAction";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  TablePagination,
  TextField,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
  Table,
} from "reactstrap";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

function HrulePageContainer() {
  const [inputs, setInputs] = useState({
    name: "",
    desc: "",
    author: "all",
  });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [location, setLocation] = useState<any>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>([]);
  const [socialTab, setSocialTab] = useState<any>([]);
  const [checkedVal, setCheckedVal] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [initFlag, setInitFlag] = useState(false);
  const [selectAllTable, setSelectAllTable] = useState(false);
  const [getSocial, setSocial] = useState([]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const getLocation = () => {
    const a = [...location];
    let arr: any[] = [];
    a.map((list) => {
      selectedLocation?.map((item: any) => {
        if (list?.city_name === item) {
          arr.push(list);
        }
      });
    });
    return arr;
  };

  const handleSave = async () => {
    const rulesPage = checkedVal?.map((list: any) => {
      return {
        c_handle_page_id: list?.c_social_handle_page_id,
        c_social_handle_page_flag: list?.c_social_handle_page_flag,
      };
    });
    const author = selectedUser?.map((item: any) => {
      return { c_author_id: item };
    });
    const body = {
      c_h_rules_name: inputs?.name,
      c_h_rules_description: inputs?.desc,
      c_h_rules_tags: selectedTags,
      c_h_rules_location: getLocation(),
      c_h_rules_other_category: [
        {
          c_category_name: "abcd",
          c_category_id: "515151f1fsa",
        },
      ],
      c_h_rules_autor: author,
      c_h_rules_handle_page: rulesPage,
    };
    const results = await createHrules(body);
    if (results?.appStatusCode === 0) {
      toast?.success(results?.message);
      GetHrules();
    } else {
      toast?.error(results?.error);
    }
  };

  const GetHrules = async () => {
    const results = await getHruleData();
    if (results?.appStatusCode === 0) {
      const DATA = results?.payloadJson?.at(0);
      setInputs({
        ...inputs,
        name: DATA?.c_h_rules_name,
        desc: DATA?.c_h_rules_description,
      });
      setSelectedTags(DATA?.c_h_rules_tags);
      const a = DATA?.c_h_rules_location?.map((list: any) => list?.city_name);
      const b = DATA?.c_h_rules_autor?.map((list: any) => list?.c_author_id);
      setSelectedUser(b);
      setSelectedLocation(a);
      let arr = [...socialTab];
      arr.map((list) => {
        DATA?.c_h_rules_handle_page?.map((item: any) => {
         
        });
      });
      // setSocial(DATA?.c_h_rules_handle_page);
    }
  };

  const GetUserList = async () => {
    const body = {
      role: "news entry",
    };
    const results = await getAllUserListApi(body);
    if (results?.appStatusCode === 0) {
      setUserList(results?.payloadJson);
    }
  };
  const GetTags = async () => {
    const results = await getAllTagsList();
    setTags(results?.payloadJson);
  };

  const GetSocialList = async () => {
    const results = await getAllSocialHandlesList();
    if (results?.appStatusCode === 0) {
      setSocialTab(results?.payloadJson);
      setInitFlag(true);
    }
  };

  const GetCityList = async () => {
    const body = {
      country_id: "101",
      state_id: "4035",
    };
    const results = await getAllCityListApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLocation([]);
    } else {
      setLocation(results?.payloadJson);
    }
  };

  const handleChecked = (e: any, list: any) => {
    if (e.target.checked) {
      list.c_social_handle_page_flag = 1;
      setCheckedVal([...checkedVal, list]);
    } else {
      list.c_social_handle_page_flag = 0;
      let filtered = checkedVal?.filter((item: any) => item?._id !== list?._id);
      setCheckedVal(filtered);
    }
  };

  useEffect(() => {
    GetTags();
    GetCityList();
    GetSocialList();
    GetUserList();
    GetHrules();
  }, []);


  const handleUserToggle = (userId: any) => () => {
    setSelectAll(false);
    const currentIndex = selectedUser.indexOf(userId);
    const newSelectedUsers = [...selectedUser];
    if (currentIndex === -1) {
      newSelectedUsers.push(userId);
    } else {
      newSelectedUsers.splice(currentIndex, 1);
    }
    setSelectedUser(newSelectedUsers);
  };

  const handleSelectAllToggle = (e: any, val: string) => {
    if (val === "user") {
      const newSelectedUsers = selectAll
        ? []
        : userList.map((user: any) => user._id);
      setSelectedUser(newSelectedUsers);
      setSelectAll(!selectAll);
    } else {
      if (e.target.checked) {
        const newSelectedUsers = selectAllTable
          ? []
          : socialTab.map((user: any) => {
              user.c_social_handle_page_flag = 1;
              return user;
            });
        setCheckedVal(newSelectedUsers);
        setSelectAllTable(!selectAllTable);
      } else {
        const newSelectedUsers = socialTab.map((user: any) => {
          user.c_social_handle_page_flag = 0;
          return user;
        });
        setCheckedVal([]);
        setSelectAllTable(!selectAllTable);
        setSocialTab(newSelectedUsers);
      }
    }
  };



  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm="12" className="mt-2">
            <Card>
              <CardBody className="pt-0">
                <Box mt={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        type="text"
                        name="name"
                        size="small"
                        multiline
                        rows={4}
                        value={inputs?.name}
                        onChange={handleChange}
                        // error={errors?.includes("title")}
                        // helperText={errors?.includes("title") && "Please enter title"}
                        sx={{
                          ".MuiFormHelperText-root": {
                            ml: 0,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        type="text"
                        name="desc"
                        size="small"
                        multiline
                        rows={4}
                        value={inputs?.desc}
                        onChange={handleChange}
                        // error={errors?.includes("title")}
                        // helperText={errors?.includes("title") && "Please enter title"}
                        sx={{
                          ".MuiFormHelperText-root": {
                            ml: 0,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Label>Select Tags</Label>
                      <Select
                        multiple
                        fullWidth
                        value={selectedTags}
                        onChange={(e: any) => setSelectedTags(e.target.value)}
                        size="small"
                      >
                        {tags?.map((list: any) => (
                          <MenuItem key={list?._id} value={list?.c_tag_name}>
                            {list?.c_tag_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={7}>
                      <Label>Location</Label>
                      <Select
                        multiple
                        fullWidth
                        value={selectedLocation}
                        onChange={(e: any) =>
                          setSelectedLocation(e.target.value)
                        }
                        size="small"
                      >
                        {location?.map((list: any) => (
                          <MenuItem key={list?._id} value={list?.city_name}>
                            {list?.city_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={5}>
                      <Label>Select Author</Label>
                      <Select
                        labelId="user-dropdown-label"
                        id="user-dropdown"
                        multiple
                        fullWidth
                        size="small"
                        value={selectedUser}
                        onChange={() => {}}
                        renderValue={(selected) =>
                          selected
                            .map((userId: any) => {
                              const selectedUser = userList?.find(
                                (user: any) => user?._id === userId
                              );
                              return `${selectedUser?.user_name}`;
                            })
                            .join(", ")
                        }
                      >
                        <MenuItem
                          // key={user._id}
                          // value={user._id}
                          sx={{ py: 0 }}
                        >
                          <Checkbox
                            // checked={selectedUser.indexOf(user._id) > -1}
                            checked={
                              selectAll ||
                              selectedUser?.length === userList?.length
                            }
                            onChange={(e) => handleSelectAllToggle(e, "user")}
                            size="small"
                          />
                          <p style={{ fontSize: 12, marginBottom: 0 }}>
                            Select All
                          </p>
                        </MenuItem>
                        {userList.map((user: any) => (
                          <MenuItem
                            key={user._id}
                            value={user._id}
                            sx={{ py: 0 }}
                          >
                            <Checkbox
                              checked={selectedUser.indexOf(user._id) > -1}
                              onChange={handleUserToggle(user._id)}
                              size="small"
                            />
                            <p style={{ fontSize: 12, marginBottom: 0 }}>
                              {user.user_name}
                            </p>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Box>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" className="mt-2">
            <Card>
              <Box pl={3} py={2}>
                <Label>Select Handles</Label>
              </Box>
              <CardBody className="pt-0">
                <Table responsive className={`table-wrapper`}>
                  <thead style={{ background: "#000" }}>
                    <tr>
                      <th style={{ color: "#fff" }}>
                        <Checkbox
                          {...label}
                          checked={checkedVal?.length === socialTab?.length}
                          className="hrules-check"
                          onChange={(e) => handleSelectAllToggle(e, "table")}
                        />
                      </th>
                      <th style={{ color: "#fff" }}>Type</th>
                      <th style={{ color: "#fff" }}>Page</th>
                      <th style={{ color: "#fff" }}>State</th>
                      <th style={{ color: "#fff" }}>Type</th>
                      <th style={{ color: "#fff" }}>Managed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(socialTab) &&
                      socialTab?.map((list: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <Checkbox
                              {...label}
                              onChange={(e) => handleChecked(e, list)}
                              checked={list?.c_social_handle_page_flag === 1}
                            />
                          </td>
                          <td>{list?.c_social_handle_page_title}</td>
                          <td>{list?.c_social_handle_page_name}</td>
                          <td>{list?.c_social_handle_page_status}</td>
                          <td>{list?.c_social_handle_page_type}</td>
                          <td>{list?.c_createdName}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Box>
          <Button variant="contained" onClick={() => handleSave()}>
            Save
          </Button>
        </Box>
      </Container>
      {/* <AddHrulePop open={open} close={() => setOpen(false)} title={title} /> */}
    </div>
  );
}

export default HrulePageContainer;
