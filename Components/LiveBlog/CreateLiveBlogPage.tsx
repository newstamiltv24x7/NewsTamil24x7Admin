import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardBody, Container, Label, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import slugify from "slugify";
import {
  addLiveBlogApi,
  getParticularBlogApi,
  getTranslateApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/Hooks";
import { IoTrash } from "react-icons/io5";
import BlogContent from "./BlogContent";



function CreateLiveBlogPage(props: any) {
  const { type } = props;
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [loader, setLoader] = useState({
    pageLoader: false,
    imgLoader: false,
  });
  const [inputs, setInputs] = useState<any>({
    slug_name:"",
    short_name:"",
    title: "",
    english_title:"",
    content: "",
    image: "",
    imgName: "",
  });
  const [errors, setErrors] = useState<any>({
    slug_name:false,
    short_name:false,
    title: false,
    english_title:false,
    content: false,
    image: false,
    imgName: false,
  });
  const [translatorLoader, setTranslateLoader] = useState<any>(false);
  
  
  const [listicleArr, setListicleArr] = useState([
    {
      c_live_sub_blog_title: "",
      c_live_sub_blog_content: "",
    },
  ]);

  const [subErrors, setSubErrors] = useState(
    {
      c_live_sub_blog_title: false,
      c_live_sub_blog_content: false,
    },
  );
  const [mainId, setMainId] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: false });
    setInputs({ ...inputs, [name]: value });
  };

  
  const handleBlur = (e: any) => {
    let { name } = e.target;
    if (name === "title") {
      if (inputs.title?.length > 3) {
        setTranslateLoader(true);
        getTranslate("1");
      } else {
        setInputs({ ...inputs, english_title: "" });
      }
    }
  };

  const getTranslate = async (val:any) => {
    if (val === "1") {
      let results = await getTranslateApi(
        inputs?.title?.replaceAll(". ", ", ", " ")
      );
      if (results) {
        setTranslateLoader(false);
        setInputs({ ...inputs, english_title: results.flat()?.at(0)?.at(0) });
      }
    }
  };






  const addSection = () => {
    let obj = {
      c_live_sub_blog_title: "",
      c_live_sub_blog_content: "",
    };

    setListicleArr((prev) => [...prev, obj]);
  };

  const handleDescription = (e: any, index: number) => {
    let { name, value } = e.target;
    const updatedCredit = [...listicleArr];
    setSubErrors({ ...subErrors, [name]: false });
    updatedCredit[index] = {
      ...updatedCredit[index],
      [name]: value,
    };
    setListicleArr(updatedCredit);
  };

  const handleChangeJodit = (index: number, value: any) => {
    // setJoditContent(value);
    const updatedCredit = [...listicleArr];
    updatedCredit[index] = {
      ...updatedCredit[index],
      c_live_sub_blog_content: value,
    };
    
    setSubErrors({...subErrors, c_live_sub_blog_content: false})
    setListicleArr(updatedCredit);
  };

  const handleDelete = (index: number) => {
    let arr = [...listicleArr];
    arr.splice(index, 1);
    setListicleArr(arr);
  };

  const DeleteImage = async () => {
    setLoader({ ...loader, imgLoader: true });
    const results = await imageDeleteApi({
      c_file: inputs?.imgName,
    });
    if (results?.appStatusCode !== 0) {
      setLoader({ ...loader, imgLoader: false });
      toast.error(results?.error);
    } else {
      setLoader({ ...loader, imgLoader: false });
      toast.success(results?.message);
      setInputs({ ...inputs, image: "" });
    }
  };

  const handleUpload = (e: any) => {
    if (e) {
      let size = e.target?.files[0]?.size;
      if (size < 5000000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "blog image");
        ImageUpload(formData);
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  const ImageUpload = async (body: any) => {
    setLoader({ ...loader, imgLoader: true });
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader({ ...loader, imgLoader: false });
    } else {
      toast.success(results?.message);
      setErrors({...errors, image:false});
      setLoader({ ...loader, imgLoader: false });
      setInputs({
        ...inputs,
        image: results?.payloadJson?.c_file_url,
        imgName: results?.payloadJson?.c_file,
      });
    }
  };

  const handleSubmit = async () => {
    if(inputs.short_name === ""){
      setErrors({...errors, short_name: true})
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }else if (inputs.title === "") {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      setErrors({ ...errors, title: true });
    } else if (inputs.content === "") {
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      setErrors({ ...errors, content: true });
    } else if (inputs.image === "") {
      window.scroll({
        top: 120,
        behavior: "smooth",
      });
      setErrors({ ...errors, image: true });
    }else if(listicleArr[0].c_live_sub_blog_title === ""){
      window.scroll({
        top: 250,
        behavior: "smooth",
      });
      setSubErrors({ ...subErrors, c_live_sub_blog_title: true });
    }else if(listicleArr[0].c_live_sub_blog_content === "" || listicleArr[0].c_live_sub_blog_content === "<p><br></p>"){
      window.scroll({
        top: 250,
        behavior: "smooth",
      });
      setSubErrors({ ...subErrors, c_live_sub_blog_content: true });
    } else{

     
      setLoader({ ...loader, pageLoader: true });

      const slugString = inputs?.english_title

      const slug_name = slugify(slugString, 
        {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "ta",
        trim: true,
      })
    



      const body: any = {
        c_live_blog_short_name: inputs?.short_name,
        c_live_blog_slug_title: slug_name,
        c_live_blog_title: inputs?.title,
        c_live_blog_english_title: inputs?.english_title,
        c_live_blog_content: inputs?.content,
        c_live_blog_image_url: inputs?.image,
        c_live_sub_blog: listicleArr,
      };
      if (type === "Edit Blog") {
        body["Id"] = mainId;
      }

      const results = await addLiveBlogApi(body);
      if (results?.appStatusCode !== 0) {
        setLoader({ ...loader, pageLoader: false });
        toast?.error(results?.error);
      } else {
        setLoader({ ...loader, pageLoader: false });
        toast?.success(results?.message);
        setTimeout(() => {
          router.push(`/${i18LangStatus}/live-blog`);
        }, 500);
      }

    }
   
  };

  const GetEditListicleFn = async () => {
    const getId = window.location.pathname?.split("/")?.at(-1);
    const results = await getParticularBlogApi(getId);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
    } else {
      const data = results?.payloadJson[0];
      setInputs({
        ...inputs,
        short_name: data?.c_live_blog_short_name,
        title: data?.c_live_blog_title,
        english_title: data?.c_live_blog_english_title,
        content: data?.c_live_blog_content,
        image: data?.c_live_blog_image_url,
        imgName: data?.c_live_blog_image_url?.split("/")?.at(-1),
      });
      setListicleArr(data?.c_live_sub_blog);
      setMainId(data?._id);
    }
  };

  useEffect(() => {
    if (type === "Edit Blog") {
      GetEditListicleFn();
    }
  }, []);

  return (
    <Container fluid>
      <Card
        style={
          loader?.pageLoader
            ? { pointerEvents: "none", opacity: 0.3 }
            : { opacity: 1 }
        }
      >
        <CardBody>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  size="small"
                  required={true}
                  multiline
                  rows={3}
                  fullWidth
                  name="title"
                  onBlur={handleBlur}
                  value={inputs?.title}
                  onChange={handleChange}
                  error={errors?.title}
                  helperText={
                    errors?.title &&
                      "Title should contain more then 3 letters"
                    }
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <TextField
                  id="outlined-basic"
                  label="Content"
                  variant="outlined"
                  size="small"
                  required={true}
                  multiline
                  rows={3}
                  fullWidth
                  name="content"
                  value={inputs?.content}
                  onChange={handleChange}
                    error={errors?.content}
                    helperText={
                      errors?.content &&
                      "content should contain more then 3 letters"
                    }
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <TextField
                  autoComplete="off"
                  id="outlined-basic"
                  label="English Title"
                  variant="outlined"
                  size="small"
                  required={true}
                  fullWidth
                  name="english_title"
                  value={inputs?.english_title}
                  onChange={handleChange}
                    error={errors?.english_title}
                    helperText={
                      errors?.english_title &&
                      "Title should contain more then 3 letters"
                    }
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <TextField
                  autoComplete="off"
                  id="outlined-basic"
                  label="Short Name"
                  variant="outlined"
                  size="small"
                  required={true}
                  fullWidth
                  name="short_name"
                  value={inputs?.short_name}
                  onChange={handleChange}
                    error={errors?.short_name}
                    helperText={
                      errors?.short_name &&
                      "Title should contain more then 3 letters"
                    }
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
            </Grid>       


            <Grid item xs={6}>
              {inputs?.image === "" ? (
                <>
                <Box
                  sx={{
                    border: "2px dashed #cbcbcb",
                    cursor: "pointer",
                  }}
                  textAlign={"center"}
                  p={5}
                  onClick={() => uploadRef?.current?.click()}
                >
                  <p>
                    click here to upload image{" "}
                    {loader?.imgLoader && <Spinner size={"sm"} />}
                  </p>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={uploadRef}
                    onChange={handleUpload}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  {/* <p style={{color:"#d32f2f", fontSize: "0.75rem",lineHeight: "1.66",letterSpacing: "0.03333em"}}> {errors?.image &&
                      "Please Upload cover image"}</p> */}
                </Box>
                {errors?.image &&<p style={{color:"#d32f2f", fontSize: "0.75rem",lineHeight: "1.66",letterSpacing: "0.03333em"}}> {errors?.image &&
                  "Please Upload cover image"}</p>}
                </>
                
                
              ) : (
                <Box>
                  <Box width={"300px"} height={"200px"} pr={3} pb={2}>
                    <img
                      src={inputs?.image}
                      alt=""
                      width={"100%"}
                      height={"100%"}
                    />
                  </Box>
                  <Box display={"flex"} gap={2} alignItems={"center"}>
                    <Box>
                      <Label className="textWrapper">{inputs?.imgName}</Label>
                    </Box>
                    <Box>
                      {loader?.imgLoader ? (
                        <Spinner size={"sm"} />
                      ) : (
                        <IoTrash
                          onClick={() => DeleteImage()}
                          style={{
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </Box>
                    
                  </Box>
                  
                </Box>
                
                
              )}
            </Grid>
            
            
          </Grid>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <BlogContent
            listicleArr={listicleArr}
            handleDelete={handleDelete}
            handleDescription={handleDescription}
            loader={loader}
            type={type}
            handleChangeJodit={handleChangeJodit}
            addSection={addSection}
            subErrors={subErrors}
          />
          <Box>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                letterSpacing: "2px",
                textTransform: "capitalize",
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
}

export default CreateLiveBlogPage;
