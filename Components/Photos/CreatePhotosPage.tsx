import { Avatar, Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Label } from "reactstrap";
import PhotosContent from "./PhotosContent";
import { toast } from "react-toastify";
import slugify from "slugify";
import {
  createPhotosApi,
  getParticularPhotosApi,
  getTranslateApi,
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

function CreatePhotosPage(props: any) {
  const { type } = props;
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [loader, setLoader] = useState({
    pageLoader: false,
    imgLoader: false,
  });
  const [inputs, setInputs] = useState({
    slug_name:"",
    short_name:"",
    english_title:"",
    title: "",
    desc: "",
    content: "",
    cover_image: "",
  });

  const [errors, setErrors] = useState({
    short_name:false,
    title: false,
    desc: false,
    content: false,
    cover_image: false,
  });
  const [image, setImage] = useState("");
  const [imageLoader, setImgLoader] = useState(false);
  const [translatorLoader, setTranslateLoader] = useState<any>(false);

  const [photosArr, setPhotosArr] = useState([
    {
      c_photos_continue_img: "",
      c_photos_continue_sub_title: "",
      n_status: 0,
    },
  ]);


  const [subErrors, setSubErrors] = useState(
    {
      c_photos_continue_img: false,
      c_photos_continue_sub_title: false,
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
      c_photos_continue_img: "",
      c_photos_continue_sub_title: "",
      n_status: 0,
    };
    setPhotosArr((prev) => [...prev, obj]);
    toast.success("Section Added Succsessfully");


  };

  const handleDescription = (e: any, index: number) => {
    let { name, value } = e.target;
    setSubErrors({ ...subErrors, [name]: false });
    const updatedCredit = [...photosArr];
    updatedCredit[index] = {
      ...updatedCredit[index],
      [name]: value,
    };
    setPhotosArr(updatedCredit);
  };

  const handleDelete = (index: number) => {
    let arr = [...photosArr];
    arr.splice(index, 1);
    setPhotosArr(arr);
    toast.error("Section Removed Succsessfully");
  };

  const handleCheck = (e: any, index: number) => {
    const { checked } = e.target;
    let arr = [...photosArr];
    checked
      ? (arr[index] = {
          ...arr[index],
          n_status: 1,
        })
      : (arr[index] = {
          ...arr[index],
          n_status: 0,
        });

    setPhotosArr(arr);
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
      c_file: list.c_photos_continue_img.split(".com/").at(-1),
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader({ ...loader, imgLoader: false });
    } else {
      toast.error(results?.message);
      setLoader({ ...loader, imgLoader: false });
      let arr = [...photosArr];
      arr[index] = { ...arr[index], c_photos_continue_img: "" };
      setPhotosArr(arr);
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
        formData.append("c_image_caption_name", "Photo image");

        

      

        ImageUpload2(formData);
        setImgLoader(true);
        setImage(fileName)
        setInputs({ ...inputs, cover_image: fileName });
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
        formData.append("c_image_caption_name", "photo image");
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
      setSubErrors({...subErrors, c_photos_continue_img:false})
      setLoader({ ...loader, imgLoader: false });
      const updateArr = [...photosArr];
      updateArr[index] = {
        ...updateArr[index],
        c_photos_continue_img: results?.payloadJson?.c_file_url,
      };
      setPhotosArr(updateArr);
    }
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

  useEffect(() => {
      if (inputs?.title?.length > 3) {
        setTranslateLoader(true);
        getTranslate("1");
      } else {
        setInputs({ ...inputs, english_title: "" });
      }
    
    
  }, [inputs?.title?.length > 3])
  


  const getTranslate = async (val:any) => {
    if (val === "1") {
    //   let results = await getTranslateApi( inputs?.title?.replaceAll(". ", ", ", " "));
      let results = await getTranslateApi( inputs?.title);
      if (results) {
        setTranslateLoader(false);
        setInputs({ ...inputs, english_title: results.flat()?.at(0)?.at(0) });
      }
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
    }else if(inputs.cover_image === ""){
      window.scroll({
        top: 250,
        behavior: "smooth",
      });
      setErrors({...errors, cover_image: true})
    }else if(photosArr[0].c_photos_continue_img === ""){
      window.scroll({
        top: 350,
        behavior: "smooth",
      });
      setSubErrors({...subErrors, c_photos_continue_img:true})
    }else if(photosArr[0].c_photos_continue_sub_title === ""){
      window.scroll({
        top: 350,
        behavior: "smooth",
      });
      setSubErrors({...subErrors, c_photos_continue_sub_title:true})
    }else{
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
      c_photos_short_name: inputs?.short_name,
      c_photos_slug_title: slug_name,
      c_photos_title: inputs?.title,
      c_photos_sub_title: inputs?.desc,
      c_photos_content: inputs?.content,
      c_photos_continue_item: photosArr,
      c_photos_img: inputs?.cover_image,
    };
    if (type === "Edit Page") {
      body["Id"] = mainId;
    }

   

    const results = await createPhotosApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader({ ...loader, pageLoader: false });
      toast?.error(results?.error);
    } else {
      setLoader({ ...loader, pageLoader: false });
      toast?.success(results?.message);
      setTimeout(() => {
        router.push(`/${i18LangStatus}/photos`);
      }, 500);
    }


    }


    
  };

  const GetEditPhotosFn = async () => {
    const getId = window.location.pathname?.split("/")?.at(-1);
    const results = await getParticularPhotosApi(getId);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
    } else {
      const data = results?.payloadJson[0];
      setInputs({
        ...inputs,
        short_name: data?.c_photos_short_name,
        title: data?.c_photos_title,
        desc: data?.c_photos_sub_title,
        content: data?.c_photos_content,
        cover_image: data?.c_photos_img
      });
      setPhotosArr(data?.c_photos_continue_item);
      setMainId(data?._id);
      setImage(data?.c_photos_img.split("/")?.at(-1))
    }
  };




  

  useEffect(() => {
    if (type === "Edit Page") {
      GetEditPhotosFn();
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
                  onBlur={handleBlur}
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
          <PhotosContent
           
            photosArr={photosArr}
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
              onClick={() => router.push(`/${i18LangStatus}/photos`)}
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

export default CreatePhotosPage;
