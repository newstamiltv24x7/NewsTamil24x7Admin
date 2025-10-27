"use client";

import { Box, Button } from "@mui/material";
import { craeteAddTxtApi, getAddTxtWebApi } from "apiFunctions/ApiAction";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, Input, Label, Spinner } from "reactstrap";

const page = () => {
  const [value, setValue] = useState("");
  const [id, setId] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async () => {
    try {
      if (value?.length > 0) {
        const body = {
          Id: id,
          c_ads_txt: value,
          c_ads_txt_type: "web",
        };
        const results = await craeteAddTxtApi(body);
        if (results?.appStatusCode === 0) {
          GetTxtApi();
        } else {
          toast?.error(results?.error);
        }
        toast.success(results?.message);
      } else {
        toast.error("Field should not be empty");
      }
    } catch (err: any) {
      toast.error(err);
    }
  };

  const GetTxtApi = async () => {
    setLoader(true);
    try {
      setLoader(false);
      const results = await getAddTxtWebApi({
        c_type: "web",
        n_page: 1,
        n_limit: 5,
      });
      setValue(results?.payloadJson?.at(0)?.data[0]?.c_ads_txt);
      setId(results?.payloadJson?.at(0)?.data[0]?._id);
    } catch (err: any) {
      setLoader(false);
      toast.error(err);
    }
  };

  useEffect(() => {
    GetTxtApi();
  }, []);

  return (
    <Card>
      <CardBody>
        <Label for="exampleText">Ads.txt</Label>
        {loader ? (
          <Box display={"grid"} sx={{ placeItems: "center" }} minHeight={300}>
            <Spinner size={"md"} />
          </Box>
        ) : (
          <Input
            id="exampleText"
            name="text"
            type="textarea"
            className="mt-2"
            value={value}
            style={{ minHeight: 300 }}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </CardBody>
    </Card>
  );
};

export default page;
