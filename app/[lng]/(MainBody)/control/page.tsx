"use client";

import { craeteControlApi, getControlListApi } from "@/apiFunctions/ApiAction";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, Input, Label, Spinner } from "reactstrap";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const page = () => {

  const [subTemplate, setSubTemplate] = useState<any>([]);

  const handleInputChange = (value:any, row:any, key:any) => {

    const updatedSubTemplate = subTemplate.map((item :any) => {
          
      if (item.c_control_name === row.c_control_name) {
        return {
          ...item,
          [key]: value
        };
      }
      return item;
    });

    setSubTemplate(updatedSubTemplate);
  };


  const [loader, setLoader] = useState(false);


  const handleSubmit = async (e:any, id:any, type: any) => {



    try {
      if (type !== "") {
        const body = {
          Id: id,
          c_control_type: type,
        };


        const results = await craeteControlApi(body);
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
      const results = await getControlListApi({
        c_search_term: "",
        n_page: 1,
        n_limit: 5,
      });


      const dummyArr:any =[];

      results?.payloadJson?.at(0)?.data.map((dats:any, index:any) =>{
        dummyArr.push({
          c_control_name: dats.c_control_name,
          c_control_id: dats.c_control_id,
          c_control_type: dats.c_control_type
        })
      })
      setSubTemplate(dummyArr);

      // setSelectedValue(results?.payloadJson?.at(0)?.data[0]?.c_control_type);
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
      {Array.isArray(subTemplate) &&
        subTemplate.map((item: any, index: any) => (
          <CardBody>
            <Label for="exampleText">{item?.c_control_name}</Label>
            {loader ? (
              <Box
                display={"grid"}
                sx={{ placeItems: "center" }}
                minHeight={300}
              >
                <Spinner size={"md"} />
              </Box>
            ) : (
              <Box display={"flex"} justifyContent={"space-between"} mt={2}>
                <div>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    // value={selectedValue[index]?.c_control_type}
                    value={item.c_control_name}
                    // onChange={(e)=>handleChange(e ,item?.c_control_id)}
                    sx={{ display: "flex", flexDirection: "row" }}
                    
                    
                  >
                    <FormControlLabel
                          // value={item.c_control_type}
                          control={<Radio />}
                          label="Yes"
                          checked={item.c_control_type === "yes"}
                          onChange={e => {
                            handleInputChange('yes', item, 'c_control_type');
                          }}
                        />
                         <FormControlLabel
                          // value={item.c_control_type}
                          control={<Radio />}
                          label="No"
                          checked={item.c_control_type === "no"}
                          onChange={e => {
                            handleInputChange('no', item, 'c_control_type');
                          }}
                        />
                  </RadioGroup>
                </div>



                <Button variant="contained" onClick={(e:any)=>handleSubmit(e,item.c_control_id,item.c_control_type)}>
                  Save Control
                </Button>
              </Box>
            )}
          </CardBody>
        ))}
  
                      

    </Card>
  );
};

export default page;
