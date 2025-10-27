import { Avatar, Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Label } from "reactstrap";
import ListiclesContent from "./ListiclesContent";
import { toast } from "react-toastify";
import slugify from "slugify";
import {
  createListiclesApi,
  getAllCategoryListApi,
  getParticularListiclesApi,
  imageDeleteApi,
  imageUploadApi,
} from "@/apiFunctions/ApiAction";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/Hooks";
import { styled, useTheme } from "@mui/material/styles";
import { Spinner } from "reactstrap";
import { FaUpload } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function CreateListiclePage(props: any) {
  const { type } = props;
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [categoryArr, setCategoryArr] = useState([]);
  const [loader, setLoader] = useState({
    pageLoader: false,
    imgLoader: false,
  });
  const [inputs, setInputs] = useState({
    slug_name:"",
    short_name:"",
    title: "",
    desc: "",
    content: "",
    category: "",
    cover_image: "",
  });

  const [errors, setErrors] = useState({
    short_name:false,
    title: false,
    desc: false,
    content: false,
    category: false,
    cover_image: false,
  });
  const [image, setImage] = useState("");
  const [imageLoader, setImgLoader] = useState(false);

  const [listicleArr, setListicleArr] = useState([
    {
      c_listicles_continue_img: "",
      c_listicles_continue_content: "",
      c_listicles_continue_sub_title: "",
      n_status: 0,
    },
  ]);


  const [subErrors, setSubErrors] = useState(
    {
      c_listicles_continue_img: false,
      c_listicles_continue_content: false,
      c_listicles_continue_sub_title: false,
    },
  );

  const [mainId, setMainId] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: false });
    setInputs({ ...inputs, [name]: value });
  };

  const addSection = () => {
    let obj = {
      c_listicles_continue_img: "",
      c_listicles_continue_content: "",
      c_listicles_continue_sub_title: "",
      n_status: 0,
    };
    setListicleArr((prev) => [...prev, obj]);
    toast.success("Section Added Succsessfully");


  };

  const handleDescription = (e: any, index: number) => {
    let { name, value } = e.target;
    setSubErrors({ ...subErrors, [name]: false });
    const updatedCredit = [...listicleArr];
    updatedCredit[index] = {
      ...updatedCredit[index],
      [name]: value,
    };
    setListicleArr(updatedCredit);
  };

  const handleDelete = (index: number) => {
    let arr = [...listicleArr];
    arr.splice(index, 1);
    setListicleArr(arr);
    toast.error("Section Removed Succsessfully");
  };

  const handleCheck = (e: any, index: number) => {
    const { checked } = e.target;
    let arr = [...listicleArr];
    checked
      ? (arr[index] = {
          ...arr[index],
          n_status: 1,
        })
      : (arr[index] = {
          ...arr[index],
          n_status: 0,
        });

    setListicleArr(arr);
  };

  const DeleteImage = async () => {
    setImgLoader(true);
    const results = await imageDeleteApi({
      c_file: inputs?.cover_image.split(".com/").at(-1),
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setImgLoader(false);
    } else {
      toast.error(results?.message);
      setImgLoader(false);
      setImage("");
      setInputs({ ...inputs, cover_image: "" });
    }
  };

  const handleDeleteImg = async (list: any, index: number) => {

   



    setLoader({ ...loader, imgLoader: true });
    const results = await imageDeleteApi({
      c_file: list.c_listicles_continue_img.split(".com/").at(-1),
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader({ ...loader, imgLoader: false });
    } else {
      toast.error(results?.message);
      setLoader({ ...loader, imgLoader: false });
      let arr = [...listicleArr];
      arr[index] = { ...arr[index], c_listicles_continue_img: "" };
      setListicleArr(arr);
    }
  };

  const handleUploadCover = (e: any) => {
    if (e) {
      // setMediaType("image");
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 1024000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "listicle image");
        ImageUpload2(formData);
        setImgLoader(true);
        // setInputs({ ...inputs, cover_image: fileName });
        // setImageArr([...imageArr, ...files]);
      } else {
        toast.error("Please upload less than 1mb");
      }
    }
  };

  const ImageUpload2 = async (body: any) => {
    const results = await imageUploadApi(body);
    
    if (results?.appStatusCode !== 0) {
      setImgLoader(false);
      toast.error(results?.error);
    } else {
      setImgLoader(false);
      setImage(results?.payloadJson?.c_file);
      setInputs({ ...inputs, cover_image: results?.payloadJson?.c_file_url });
      setErrors({...errors, cover_image:false});
      toast.success(results?.message);
    }
  };

  const handleUpload = (e: any, index: number) => {
    if (e) {
      let size = e.target?.files[0]?.size;
      if (size < 5000000) {
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", "listicle image");
        ImageUpload(formData, index);
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  const ImageUpload = async (body: any, index: number) => {

    setLoader({ ...loader, imgLoader: true });
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader({ ...loader, imgLoader: false });
    } else {
      toast.success(results?.message);
      setSubErrors({...subErrors, c_listicles_continue_img:false})
      setLoader({ ...loader, imgLoader: false });
      const updateArr = [...listicleArr];
      updateArr[index] = {
        ...updateArr[index],
        c_listicles_continue_img: results?.payloadJson?.c_file_url,
      };
      setListicleArr(updateArr);
    }
  };

  const GetcategoriesList = async () => {
    const results = await getAllCategoryListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setCategoryArr([]);
    } else {
      setCategoryArr(results?.payloadJson);
    }
  };

  const handleSubmit = async () => {

    if(inputs.short_name === ""){
      setErrors({...errors, short_name: true})
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }else if(inputs.title === ""){
      setErrors({...errors, title: true})
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
    }else if(inputs.desc === ""){
      window.scroll({
        top: 0,
        behavior: "smooth",
      });
      setErrors({...errors, desc: true})
    }else if(inputs.content === ""){
      window.scroll({
        top: 120,
        behavior: "smooth",
      });
      setErrors({...errors, content: true})
    }else if(inputs.category === ""){
      window.scroll({
        top: 120,
        behavior: "smooth",
      });
      setErrors({...errors, category: true})
    }else if(inputs.cover_image === ""){
      window.scroll({
        top: 250,
        behavior: "smooth",
      });
      setErrors({...errors, cover_image: true})
    }else if(listicleArr[0].c_listicles_continue_img === ""){
      window.scroll({
        top: 350,
        behavior: "smooth",
      });
      setSubErrors({...subErrors, c_listicles_continue_img:true})
    }else if(listicleArr[0].c_listicles_continue_sub_title === ""){
      window.scroll({
        top: 350,
        behavior: "smooth",
      });
      setSubErrors({...subErrors, c_listicles_continue_sub_title:true})
    }else if(listicleArr[0].c_listicles_continue_content === ""){
      window.scroll({
        top: 350,
        behavior: "smooth",
      });
      setSubErrors({...subErrors, c_listicles_continue_content:true})
    }else{

    

      setLoader({ ...loader, pageLoader: true });


      const slugString = inputs?.title.replace(/[^\w\s]|_/g, "");
      const slug_name = slugify(slugString, 
        {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      })

    const body: any = {
      c_listicles_short_name: inputs?.short_name,
      c_listicles_slug_title: slug_name,
      c_listicles_title: inputs?.title,
      c_listicles_sub_title: inputs?.desc,
      c_listicles_content: inputs?.content,
      c_category_id: inputs?.category,
      c_listicles_continue_item: listicleArr,
      c_listicles_img: image,
    };
    if (type === "Edit Page") {
      body["Id"] = mainId;
    }

    

    const results = await createListiclesApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader({ ...loader, pageLoader: false });
      toast?.error(results?.error);
    } else {
      setLoader({ ...loader, pageLoader: false });
      toast?.success(results?.message);
      setTimeout(() => {
        router.push(`/${i18LangStatus}/listicles`);
      }, 500);
    }


    }


    
  };

  const GetEditListicleFn = async () => {
    const getId = window.location.pathname?.split("/")?.at(-1);
    const results = await getParticularListiclesApi(getId);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
    } else {
      const data = results?.payloadJson[0];
      const fileData = data?.c_listicles_img.split("/")?.at(-1);
      


      setInputs({
        ...inputs,
        short_name: data?.c_listicles_short_name,
        title: data?.c_listicles_title,
        desc: data?.c_listicles_sub_title,
        content: data?.c_listicles_content,
        category: data?.c_category_id,
        cover_image: data?.c_listicles_img
      });
      setListicleArr(data?.c_listicles_continue_item);
      setMainId(data?._id);
      setImage(data?.c_listicles_img.split("/")?.at(-1))
    }
  };

  useEffect(() => {
    GetcategoriesList();
    if (type === "Edit Page") {
      GetEditListicleFn();
    }
  }, []);


  useEffect(() => {
    

  }, [inputs])
  




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
                  label="Description"
                  variant="outlined"
                  size="small"
                  required={true}
                  multiline
                  rows={3}
                  fullWidth
                  name="desc"
                  value={inputs?.desc}
                  onChange={handleChange}
                  error={errors?.desc}
                    helperText={
                      errors?.desc &&
                      "Description should contain more then 3 letters"
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
                      "Content should contain more then 3 letters"
                    }
                  
                  sx={{
                    ".MuiFormHelperText-root": {
                      ml: 0,
                    },
                  }}
                />
              </Box>
              <Box mt={"3%"}>
                {image ? (
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Avatar
                      alt=""
                      src={inputs?.cover_image}
                      sx={{ width: "60px", height: "60px" }}
                    />
                    <p
                      style={{
                        marginBottom: 0,
                        width: "75%",
                        height: "24px",
                        overflow: "auto",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                      }}
                    >
                      {image}
                    </p>
                    {imageLoader ? (
                      <Spinner size={"sm"} />
                    ) : (
                      <RiDeleteBin5Line
                        style={{
                          color: "red",
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                        onClick={DeleteImage}
                      />
                    )}
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{ py: 2.5 }}
                    startIcon={<FaUpload />}
                    endIcon={imageLoader && <Spinner size={"sm"} />}
                    disabled={imageLoader}
                  >
                    Cover Image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleUploadCover}
                      accept="image/*"
                    />
                  </Button>
                )}

                {errors?.cover_image && (
                      <p style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
                        please upload Image with less than 1mb
                      </p>
                    )}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                size="small"
                select
                SelectProps={{
                  native: true,
                }}
                fullWidth
                name={"category"}
                value={inputs?.category}
                onChange={handleChange}
                error={errors?.category}
                helperText={
                    errors?.category &&
                    "Please Select Category ..."
                  }
              >
                <option value={""} style={{ display: "none" }}>
                  Select category
                </option>
                {categoryArr?.map((list: any) => {
                  return (
                    <option key={list._id} value={list?.c_category_id}>
                      {list?.c_category_name}
                    </option>
                  );
                })}
              </TextField>
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
            
          </Grid>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <ListiclesContent
            listicleArr={listicleArr}
            handleDelete={handleDelete}
            handleDescription={handleDescription}
            handleUpload={handleUpload}
            handleDeleteImg={handleDeleteImg}
            handleCheck={handleCheck}
            loader={loader}
            type={type}
            addSection={addSection}
            subErrors={subErrors}
          />
         
          <Box>
            <Button
              variant="outlined"
              sx={{
                letterSpacing: "2px",
                textTransform: "capitalize",
              }}
              onClick={() => router.push(`/${i18LangStatus}/listicles`)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                letterSpacing: "2px",
                textTransform: "capitalize",
                ml: 2,
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

export default CreateListiclePage;
