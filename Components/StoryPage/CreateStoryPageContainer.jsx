import Breadcrumbs from "@/CommonComponent/Breadcrumbs";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Card, CardBody, Col, Container } from "reactstrap";
import { BasicDetails } from "./BasicDetails";
import { MediaDetails } from "./MediaDetails";
import { SeoDetails } from "./SeoDetails";
import { PublishDetails } from "./PublishDetails";
import TextEditor from "./TextEditor";
import ImageCropp from "./ImageCropp";
import ImageThumbCrop from "./ImageThumbCrop";
import JoditTextEditer from "./JoditTextEditer";

import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import {
  GetSubscibersList,
  OpenAIApiForConversion,
  createNewStoryApi,
  deleteImageGalleryImg,
  getAllCategoryListApi,
  getAllCountryListApi,
  getAllStateListApi,
  getAllCityListApi,
  getAllUserListApi,
  getMethodAllUserListApi,
  getParticularStoryApi,
  getPublishOptionApi,
  getTranslateApi,
  imageDeleteApi,
  imageGalleryList,
  imageUploadApi,
  sendNotification,
  sharePostOnFb,
} from "@/apiFunctions/ApiAction";
import { toast } from "react-toastify";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/Redux/Hooks";
import SchedulePop from "./SchedulePop";
import slugify from "slugify";
import { StoryAskedDetails } from "./StoryAskedDetails";
import { BlurbDetails } from "./BlurbDetails";
import Cookies from "js-cookie";
import { IoCloseCircle } from "react-icons/io5";
import StyledDemo from "@/CommonComponent/ImageCrop";
import { getCroppedImg } from "@/CommonComponent/ImageCrop/canvasUtils";
import { QuotesAuthorDetails } from "./QuotesAuthorDetails";
import DeletePopup from "./DeletePopup";
// import {  transporter} from "../../helper/helper";

// function emailSend(mailData) {
//   return new Promise(async (resolve, reject) => {
//     await transporter.sendMail(mailData, function async(err, data) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }

function checkDevice(devideID) {
  if (devideID === "bbc67146594c") {
    return "mobile";
  } else if (devideID === "0461890536a5") {
    return "web";
  } else {
    return "";
  }
}

const CreateStoryPageContainer = () => {
  const router = useRouter();
  const observer = useRef();
  const role_id = Cookies.get("role_id");
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [countryArr, setCountryArr] = useState([]);
  const [stateArr, setStateArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [deletePop, setDeletePop] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");

  const [inputs, setInputs] = useState({
    story_subject_name: "",
    tamil_title: "",
    english_title: "",
    sub_title: "",
    eng_sub_title: "",
    url: "",
    article_temp: "",
    story_summary: "",
    main_category: [],
    secondary_category: "",
    country: "101", //101
    state: "4035", // 4035
    city: "131517", //131517
    reviewer: "",
    cover_image: "",
    sel_video: "",
    u_tube_link: "",
    video: "",
    image_caption: "",
    story_details: "",
    story_asked_title: "",
    story_asked_quotes_content: "",
    story_asked_quotes_author: "",
    story_asked_question: [
      {
        story_question: "",
        story_answer: "",
      },
    ],
    blurb_title: "",
    blurb_content: "",
    tags: "",
    keywords: "",
    minutes: 1,
    is_paid: 0,
    live_article: 0,
    trending_news: 1,
    flash_news: 0,
    cat_name: "",
    rat_name: "",
    twitter: "",
    youtube: "",
    facebook: "",
    instagram: "",
    threads: "",
    author: "",
    post_status: "",
    c_save_type: "",
    replaced_url: "",
    live_status: 1,
  });

  const [authorBlock, setAuthorBlock] = useState(0);
  const [categoryArr, setCategoryArr] = useState([]);
  const [secondaryCategoryArr, setSecondaryCategoryArr] = useState([
    {
      c_category_app_menu_sort_order: "",
      c_category_class: "",
      c_category_english_name: "",
      c_category_id: "",
      c_category_image_url: "",
      c_category_meta_description: "",
      c_category_meta_keywords: "",
      c_category_meta_title: "",
      c_category_name: "",
      c_category_order: 1,
      c_category_slug_english_name: "Select Sub Category",
      c_category_type: "",
      c_parentId: "",
      c_sub_categories: [],
      c_web_component_category_id: "",
      n_published: 1,
      n_status: 1,
      _id: "",
    },
  ]);

  const [userArr, setUserArr] = useState([]);
  const [authorArr, setAuthorArr] = useState([]);
  const [pubOptions, setPubOptions] = useState([]);
  const [checkedVal, setCheckedVal] = useState([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState?.createEmpty()
  );
  const [image, setImage] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [imageLoader, setImgLoader] = useState(false);
  const [videoLoader, setVideoLoader] = useState("");
  const [loader, setLoader] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [credit, setCredit] = useState([
    {
      story_credit: "",
      story_name: "",
    },
  ]);

  const [askedQue, setAskedQue] = useState([
    {
      story_question: "",
      story_answer: "",
    },
  ]);
  const [loadFlag, setLoadFlag] = useState(false);

  const [errors, setErrors] = useState([]);
  const [translated, setTransalted] = useState("");
  const [generatedWords, setGeneratedWords] = useState([]);
  const [aiFlag, setAiFlag] = useState(false);
  const [aiLoader, setAiLoader] = useState(false);
  const [translatorLoader, setTranslateLoader] = useState(false);
  const [parsedHtml, setParsedHtml] = useState(false);
  const [fetchedKeywords, setFetchedKeywords] = useState("");
  const [deskUrl, setDeskUrl] = useState("");
  const [initStateFlag, setInitStateFlag] = useState(false);
  const [id, setId] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [uploadBtn, setUploadBtn] = useState("");
  const [subcribersList, setsubcribersList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [openOption, setOpenOption] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [mediaImg, setMediaImg] = useState([]);
  const [mediaImgCount, setMediaImgCount] = useState(0);

  // ********************** THUMB IMAGE ********************************

  const [thumbOption, setThumbOption] = useState(false);
  const [thumb, setThumb] = useState({
    image: "",
    loader: false,
    name: "",
  });
  const [thumbPreview, setThumbPreview] = useState({
    file: "",
    imagePreviewUrl: "",
  });
  const [thumbCropper, setThumbCropper] = useState(false);
  const [croppedThumb, setCroppedThumb] = useState(null);
  const [convertedThumbFile, setConvertedThumbFile] = useState(null);
  const [thumbLoader, setThumbLoader] = useState(false);
  const [thumbFileName, setThumbFileName] = useState(null);
  const [imageFileThumb, setImageFileThumb] = useState(null);

  const [addMemberInputs, setAddMemberInputs] = useState({
    c_image_url: "",
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageCropper, setImageCropper] = useState(false);
  const [profilePreview, setProfilePreview] = useState({
    file: "",
    imagePreviewUrl: "",
  });
  const [convertedFile, setConvertedFile] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  // ******************************************************
  //  ---------------------------------------------------
  const { croppedImageSource } = useAppSelector(
    (state) => state.croppedImageSlice
  );
  const [open, setOpen] = React.useState(false);
  const [imageFlag, setImageFlag] = React.useState(false);
  const [forCrop, setForCrop] = React.useState("");
  const [realCrop, setRealCrop] = useState("");
  const [imageCrop, setImageCrop] = useState({
    loader: false,
    name: "",
    src: "",
    width: "",
    height: "",
    type: "",
  });

  // ********************** MEDIA GALLERY ********************************

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const handleToggleOption = () => {
    setOpenOption(!openOption);
  };

  const handleOpenGallery = () => {
    setOpenGallery(true);
  };

  const handleAddImage = (list) => {
    

    setImage(list?.c_file_url);
    setImageCrop({ ...imageCrop, name: list?.c_file_name });
    // setImageCrop({ ...imageCrop, name: list?.c_file });
    // setInputs({...inputs, image_caption:list?.c_file_name})
    setOpenGallery(false);
    setOpenOption(false);
  };

  const GetSubscibersListFn = async () => {
    const results = await GetSubscibersList();
    if (results?.appStatusCode !== 0) {
    } else {
      setsubcribersList(results.payloadJson);
    }
  };
  useEffect(() => {
    GetGalleryImages();
  }, [page]);

  const GetGalleryImages = async () => {
    try {
      const body = {
        n_page: page,
        n_limit: 15,
        c_search_term: "",
      };
      const res = await imageGalleryList(body);
      // setMediaImg(res.payloadJson?.at(0)?.data);

      if (res.payloadJson.length > 0) {
        setMediaImg((prevData) => [
          ...prevData,
          ...res.payloadJson?.at(0)?.data,
        ]);
        setMediaImgCount(res.payloadJson?.at(0)?.total_count?.at(0).count);
      } else if (res.payloadJson.length === 0) {
        setMediaImg([]);
        setMediaImgCount(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const DeleteImageGallery = async (list) => {
    try {
      const res = await deleteImageGalleryImg(list._id, list.c_file_name);
      if (res.appStatusCode === 0) {
        toast.success("Image Deleted Successfully");
        GetGalleryImages();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ************************** MEDIA GALLERY ****************************

  const [joditContent, setJoditContent] = useState("");

  const handleChangeJodit = (value) => {
    setJoditContent(value);
  };

  // ******************************************************

  const handleThumbToggleOption = () => {
    setThumbOption(!thumbOption);
  };

  const handleSelectThumbImage = (event) => {
    // setError({ ...error, sizeErr: false, extensionErr: false });
    var file = event.target.files[0];
    var fileSize = file.size;
    var extension = getExtension(file.type.split("/").at(-1).toLowerCase());
    if (fileSize > 5000000) {
      // setError({ ...error, sizeErr: "Please upload less than 5MB" });
    } else if (extension) {
      // setError({ ...error, extensionErr: "Please upload valid Type" });
    } else {
      if (file) {
        setImageFileThumb(file);
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxWidth = 1400; // Set your desired max width
            const maxHeight = 600; // Set your desired max height
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                setThumbPreview({
                  file: blob,
                  imagePreviewUrl: reader.result,
                });
              },
              "image/jpeg",
              0.7
            );
          };
        };

        reader.readAsDataURL(file);
      }
    }
    event.target.value = "";
  };

  useEffect(() => {
    if (croppedThumb !== null) {
      async function convertBlobToBlobURL(croppedThumb) {
        const response = await fetch(croppedThumb);
        const blobData = await response.blob();
        return blobData;
      }

      async function blobToFile(blob, filename) {
        const blobData = await convertBlobToBlobURL(blob);
        const file = new File([blobData], filename, { type: blobData.type });
        return file;
      }

      const outputFileName = "converted_file.png";

      blobToFile(croppedThumb, outputFileName)
        .then((file) => {
          setConvertedThumbFile(file);
        })
        .catch((error) => {
          console.error("Error converting blob to file:", error);
        });
    }
  }, [croppedThumb]);

  const handleThumbUpload = async (e) => {
    
    setThumbLoader(true);
    if (convertedThumbFile !== null) {
      const formData = new FormData();
      formData.append("c_file", convertedThumbFile);
      formData.append("file_type", "image");
      formData.append("c_image_caption_name", inputs.image_caption);

      const headers = {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      };
      
      let results = await imageUploadApi(formData, headers);

      if (results?.appStatusCode !== 0) {
        setThumb({ ...thumb, loader: false });
        setThumbLoader(false);
        toast.error(results?.error);
      } else {
        setThumb({
          ...thumb,
          image: results?.payloadJson?.c_file_url,
          name: results?.payloadJson?.c_file,
        });
        setThumbLoader(false);
        setThumbFileName(results?.payloadJson?.c_file);
      }
    }
  };

  useEffect(() => {
    if (convertedThumbFile) {
      handleThumbUpload(imageFileThumb);
    }
  }, [convertedThumbFile]);

  useEffect(() => {
    if (thumbPreview.imagePreviewUrl !== "") {
      if (addMemberInputs.c_image_url == "") {
        setThumbCropper(true);
      }
    }
  }, [thumbPreview]);

  // *********************************************************************

  const handleAddField = () => {
    const add = [{ story_credit: "", story_name: "" }];
    const merged = credit.concat(add);
    setCredit(merged);
  };

  const handleAddQueAnsField = () => {
    const add = [{ story_question: "", story_answer: "" }];
    const merged = askedQue.concat(add);
    setAskedQue(merged);
  };

  const closeDialog = () => {
    setOpen(false);
    setImage({ ...image, loader: false });
  };

  useEffect(() => {
    if (realCrop) {
      // const file = new File([realCrop], imageCrop.name);
      const file = new File([realCrop], imageCrop.name, {
        type: imageCrop.type,
        lastModified: new Date().getTime(),
      });
      
      const formData = new FormData();
      formData.append("c_file", file);
      formData.append("file_type", "image");
      formData.append("c_image_caption_name", inputs.image_caption);
      ImageUpload(formData);
    }
  }, [realCrop]);

  // const showCroppedImage = async () => {
  //   try {
  //     const croppedImage = await getCroppedImg(
  //       forCrop,
  //       croppedAreaPixels,
  //       rotation
  //     );
  //     setCroppedImage(croppedImage);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   if (imageFlag) {
  //     setOpen(false);
  //     const formData = new FormData();
  //     formData.append("c_file", croppedImageSource);
  //     formData.append("file_type", "image");
  //     ImageUpload(formData);
  //   }
  // }, [imageFlag]);

  const handleUploadForCrop = async (e) => {
    if (e) {
      setMediaType("image");
      let size = e.target?.files[0]?.size;
      let name = e.target?.files[0]?.name;
      let type = e.target?.files[0]?.type;
      if (size < 5000000) {
        
        let imageDataUrl = await readFile(e.target?.files[0]);
        
        setForCrop(imageDataUrl);
        setOpen(true);
        // const a = URL.createObjectURL(e.target?.files[0]);
        
        // setImage({ ...image, loader: true, name: name });
        setImageCrop({ ...image, loader: true, name: name, type: type });
        setImageFile(e.target?.files[0]);

        // setInputs({...inputs, image_caption:name})
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  // ------------------------------------------------------
  const [schedulePop, setSchedulePop] = useState(false);
  const [scheduleTime, setScheduleTime] = useState({
    date: "",
    time: "",
  });

  const handleDeleteField = (index) => {
    var arr = [...credit];
    arr.splice(index, 1);
    setCredit(arr);
  };

  const handleDeleteQueAnsField = (index) => {
    var arr = [...askedQue];
    arr.splice(index, 1);
    setAskedQue(arr);
  };

  const handleCreditChange = (e, index) => {
    let { name, value } = e.target;
    const updatedCredit = [...credit];

    updatedCredit[index] = {
      ...updatedCredit[index],
      [name]: value,
    };

    setCredit(updatedCredit);
  };

  const handleAskedQueChange = (e, index) => {
    let { name, value } = e.target;
    const updatedAskedQue = [...askedQue];

    updatedAskedQue[index] = {
      ...updatedAskedQue[index],
      [name]: value,
    };

    setAskedQue(updatedAskedQue);
  };

  const handleSubEditorChange = (e) => {
    let { name, checked } = e.target;
    if (name === "paid") {
      checked
        ? setInputs({ ...inputs, is_paid: 1 })
        : setInputs({ ...inputs, is_paid: 0 });
    } else if (name === "live_article") {
      checked
        ? setInputs({ ...inputs, live_article: 1 })
        : setInputs({ ...inputs, live_article: 0 });
    } else if (name === "trending_news") {
      checked
        ? setInputs({ ...inputs, trending_news: 1 })
        : setInputs({ ...inputs, trending_news: 0 });
    } else if (name === "flash_news") {
      checked
        ? setInputs({ ...inputs, flash_news: 1 })
        : setInputs({ ...inputs, flash_news: 0 });
    } else if (name === "live_status") {
      checked
        ? setInputs({ ...inputs, live_status: 1 })
        : setInputs({ ...inputs, live_status: 0 });
    }
  };

  const handleEditorChange = (newEditorState) => {
    setErrors([]);
    setEditorState(newEditorState);
    setAiFlag(false);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setInputs({ ...inputs, story_details: content });
    let text = newEditorState.getCurrentContent().getPlainText("\u0001");
    text?.replaceAll(", ", " ");
    setParsedHtml(text);
    // setTranslateLoader(true);
  };

  // useEffect(() => {
  
  // }, [inputs?.story_details]);

  const saveContent = () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setInputs({ ...inputs, story_details: content });
  };

  const handleChange = (e, list) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setErrors([]);
    if (name === "keywords") {
      setFetchedKeywords(value);
    } else if (name === "url") {
      setDeskUrl(value.toLowerCase());
    } else if (name === "secondary_category") {
      

      const getName = list?.filter(
        (item) => item?.c_category_id === e.target.value
      );
      if (getName?.at(0).c_category_slug_english_name !== "") {
        setInputs({
          ...inputs,
          [name]: value,
          rat_name: getName?.at(0).c_category_slug_english_name,
        });
      } else {
        setInputs({ ...inputs, [name]: value, rat_name: "" });
      }
    }
  };

  const handleBlur = (e) => {
    let { name } = e.target;
    if (name === "sub_title") {
      if (inputs.sub_title?.length > 3) {
        setTranslateLoader(true);
        getTranslate("2");
      } else {
        setInputs({ ...inputs, sub_title: "" });
      }
    } else if (name === "tamil_title") {
      if (inputs.tamil_title?.length > 3) {
        setTranslateLoader(true);
        getTranslate("1");
      } else {
        setInputs({ ...inputs, english_title: "" });
      }
    }
  };

  const handleCheckAuthor = (e) => {
    e.target.checked ? setAuthorBlock(1) : setAuthorBlock(0);
  };

  const getTranslate = async (val) => {
    if (val === "1") {
      let results = await getTranslateApi(
        inputs?.tamil_title?.replaceAll(". ", ", ", " ")
      );
      if (results) {
        setTranslateLoader(false);
        setInputs({ ...inputs, english_title: results.flat()?.at(0)?.at(0) });
      }
    } else if (val === "2") {
      let results = await getTranslateApi(
        inputs?.sub_title?.replaceAll(". ", ", ", " ")
      );
      if (results) {
        setTranslateLoader(false);
        setInputs({ ...inputs, eng_sub_title: results.flat()?.at(0)?.at(0) });
      }
    } else if (val === "3") {
      let results = await getTranslateApi(parsedHtml);
      if (results) {
        setTranslateLoader(false);
        const a = results?.filter((item) => item && item !== "ta");
        const b = a
          .flat()
          ?.map((item) => item?.filter((val) => typeof val === "string"))
          ?.join("")
          ?.match(/\b[a-zA-Z]+\b/g)
          ?.join(" ");
        setTransalted(b);
      }
    }
  };

  useEffect(() => {
    inputs.tamil_title?.length === 0 &&
      setInputs({ ...inputs, english_title: "" });
  }, [inputs.tamil_title]);

  useEffect(() => {
    inputs.sub_title?.length === 0 &&
      setInputs({ ...inputs, eng_sub_title: "" });
  }, [inputs.sub_title]);

  useEffect(() => {
    const a = generatedWords?.at(-1);
    if (a?.includes(",")) {
      const b = generatedWords?.at(-1)?.toString()?.split(",");
      const c = [...generatedWords]?.slice(0, -1);
      setGeneratedWords([...c, ...b]);
    }
  }, [generatedWords]);

  const GetcategoriesList = async () => {
    const results = await getAllCategoryListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setCategoryArr([]);
    } else {
      const sortedArray = results?.payloadJson?.sort((a, b) => {
        if (a._id === inputs?.main_category) return -1;
        if (b._id === inputs?.main_category) return 1;
        return 0;
      });

      setInputs({
        ...inputs,
        main_category: sortedArray[0]?.c_category_id,
        secondary_category: sortedArray[0]?.c_sub_categories[0]?.c_category_id
          ? sortedArray[0]?.c_sub_categories[0]?.c_category_id
          : "",
        cat_name: sortedArray[0]?.c_category_slug_english_name,
      });
      setCategoryArr(sortedArray);
      setSecondaryCategoryArr(sortedArray[0]?.c_sub_categories);
    }
  };

  const GetCountryList = async () => {
    const results = await getAllCountryListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setCountryArr([]);
    } else {
      // const sortedArray = results?.payloadJson
      const sortedArray = results?.payloadJson?.sort((a, b) => {
        if (a.country_id === "101") return -1;
        if (b.country_id === "101") return 1;
        return 0;
      });
      setCountryArr(sortedArray);
      GetStateList({ country_id: sortedArray?.at(0)?.country_id });
    }
  };

  const GetStateList = async (body) => {
    const results = await getAllStateListApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setStateArr([]);
    } else {
      if (results?.payloadJson.length > 0) {
        // const sortedArray = results?.payloadJson
        const sortedArray = results?.payloadJson?.sort((a, b) => {
          if (a.state_id === "4035") return -1;
          if (b.state_id === "4035") return 1;
          return 0;
        });

        setStateArr(sortedArray);
        setInitStateFlag(true);
      } else if (results?.payloadJson.length === 0) {
        const sortedArray = [
          {
            state_id: "",
            state_name: "No state found !",
            country_id: "",
            n_status: 1,
            n_published: 1,
          },
        ];
        setStateArr(sortedArray);
      }
    }
  };

  const GetCityList = async (body) => {
    const results = await getAllCityListApi(body);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);

      setCityArr([]);
    } else {
      if (results?.payloadJson.length > 0) {
        // const sortedArray = results?.payloadJson;
        const sortedArray = results?.payloadJson?.sort((a, b) => {
          if (a.city_id === "131517") return -1;
          if (b.city_id === "131517") return 1;
          return 0;
        });
        setCityArr(sortedArray);
      } else if (results?.payloadJson.length === 0) {
        const sortedArray = [
          {
            city_id: "",
            city_name: "No city found !",
            country_id: "",
            n_published: 1,
            n_status: 1,
            state_id: "",
          },
        ];
        setCityArr(sortedArray);
      }
    }
  };

  const GetUserList = async () => {
    const results = await getMethodAllUserListApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setUserArr([]);
      setAuthorArr([]);
    } else {
      const sortedArray = results?.payloadJson?.sort((a, b) => {
        if (a._id === inputs?.reviewer) return -1;
        if (b._id === inputs?.reviewer) return 1;
        return 0;
      });
      const initialUser = [
        {
          user_name: "Select Reviewer",
          c_createdBy: null,
          c_role_id: "",
          c_role_name: "",
          c_user_img_url: "",
          createdAt: "",
          email: "",
          first_name: "",
          last_name: "",
          n_published: 1,
          n_status: 1,
          password: "",
          role: "",
          user_id: "",
          _id: "",
        },
      ];
      const initialAuth = [
        {
          user_name: "Select Author",
          c_createdBy: null,
          c_role_id: "",
          c_role_name: "",
          c_user_img_url: "",
          createdAt: "",
          email: "",
          first_name: "",
          last_name: "",
          n_published: 1,
          n_status: 1,
          password: "",
          role: "",
          user_id: "",
          _id: "",
        },
      ];
      setUserArr([...initialUser, ...sortedArray]);
      setAuthorArr([...initialAuth, ...sortedArray]);
    }
  };

  const GetPublishOptionList = async () => {
    const results = await getPublishOptionApi();
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setPubOptions([]);
    } else {
      setPubOptions(results?.payloadJson);
    }
  };

  const handleRegionChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setInputs({ ...inputs, country: value });
      const body = {
        country_id: value,
      };
      GetStateList(body);
    } else if (name === "state") {
      setInputs({ ...inputs, state: value });
      const body = {
        country_id: inputs?.country,
        state_id: value,
      };
      GetCityList(body);
    } else if (name === "city") {
      setInputs({ ...inputs, city: value });
    }
  };

  const handleCategoryChange = (e, list) => {
    const { name } = e.target;
    if (name === "main_category") {
      const subArr = list?.filter(
        (item) => item?.c_category_id === e.target.value
      );
      const getName = list?.filter(
        (item) => item?.c_category_id === e.target.value
      );
      setSecondaryCategoryArr(subArr[0]?.c_sub_categories);
      setInputs({
        ...inputs,
        main_category: e.target.value,
        cat_name: getName?.at(0)?.c_category_slug_english_name,
      });
    } else if (name === "secondary_category") {
      setInputs({ ...inputs, secondary_category: e.target.value });
    }
  };

  const handleChecked = (e, item) => {
    if (e.target.checked) {
      setCheckedVal([...checkedVal, item]);
    } else {
      const filtered = checkedVal.filter((list) => list !== item);
      setCheckedVal(filtered);
    }
  };

  useEffect(() => {
    GetPublishOptionList();
    GetCountryList();
    GetUserList();
    GetcategoriesList();
    // GetGalleryImages();
    GetSubscibersListFn();
  }, []);

  const handleChangeTag = (newValue) => {
    setInputs({ ...inputs, tags: newValue });
  };

  const [checkedCat, setCheckedCat] = useState([]);

  const handleCheckCat = (e, list) => {
    

    setCheckedCat(list);
    setInputs({
      ...inputs,
      cat_name: list?.at(0)?.c_category_slug_english_name,
    });
    setErrors([]);
  };

  const handleAddStory = (val) => {
    var catArr = [];
    checkedCat.map((list) => catArr.push(list.c_category_id));
    var a = [...askedQue];
    const b = a.map((list) => {
      if (list.story_question === "") {
        delete list.story_question;
      }
      if (list.story_answer === "") {
        delete list.story_answer;
      }
      return list;
    });
    let errorArr = [];
    Object.keys(inputs).map((val) => {
      if (val === "tamil_title") {
        inputs[val]?.length < 3 && errorArr.push(val);
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
      } else if (val === "story_subject_name") {
        inputs[val] === "" && errorArr.push(val);
      } else if (val === "reviewer") {
        inputs[val] === "" && errorArr.push(val);
      }
    });
    joditContent?.length < 10 && errorArr.push("story_details");
    if (image === "" || imageCrop.name === "") {
      errorArr.push("image");
    }
    if (checkedCat.length === 0) {
      errorArr.push("main_category");
    }
    setErrors(errorArr);
    if (errorArr?.length === 0) {
      
      const updatedoptions = Object.entries(pubOptions).map(([key, value]) => {
        return {
          c_opt_id: value.c_opt_id,
          opt_check: val === "published" ? value.opt_check : 0,
          opt_sub_title: value.opt_sub_title,
          opt_title: value.opt_title,
        };
      });
      const body = {
        Id: id,
        story_subject_name: inputs?.story_subject_name,
        story_title_name: inputs?.tamil_title,
        story_sub_title_name: inputs?.sub_title,
        story_english_name: inputs?.english_title,
        story_sub_english_name: inputs?.eng_sub_title,
        story_desk_created_name: deskUrl,
        article_template_id: inputs?.article_temp,
        story_summary_snippet: inputs.story_summary,
        main_category_id: catArr,
        sub_category_id: inputs?.secondary_category
          ? inputs?.secondary_category
          : "",
        country_id: inputs?.country,
        state_id: inputs?.state,
        city_id: inputs?.city,
        reviwer_id: inputs?.reviewer,
        story_cover_image_url: image,
        story_thumb_image_url: thumb.image,
        story_video_type: uploadBtn,
        news_image_caption: inputs?.image_caption,
        story_details: joditContent,
        story_asked_title: inputs?.story_asked_title,
        story_asked_quotes_content: inputs?.story_asked_quotes_content,
        story_asked_quotes_author: inputs?.story_asked_quotes_author,
        story_asked_question: Object.keys(b)?.at(0) === "0" ? [] : askedQue,
        story_published_options: updatedoptions,
        seo_keywords: [fetchedKeywords],
        blurb_title: inputs?.blurb_title,
        blurb_content: inputs?.blurb_content,
        seo_tag: generatedWords,
        story_author_block: authorBlock,
        story_credit_name: credit,
        story_video_url: getLink(),
        min_read_display: inputs?.minutes,
        story_live_article: inputs?.live_article,
        story_paid_content: inputs?.is_paid,
        c_save_type: val,
        trending_news: inputs?.trending_news,
        flash_news: inputs?.flash_news,
        twitter_embed_id: inputs?.twitter,
        youtube_embed_id: inputs?.youtube,
        facebook_embed_id: inputs?.facebook,
        instagram_embed_id: inputs?.instagram,
        threads_embed_id: inputs?.threads,
        c_createdBy: inputs?.author,
        pair_id: "",
        post_status: 1,
        replaced_url: inputs?.replaced_url,
        live_status: inputs?.live_status,
        view_count: 0,
      };
      if (val === "scheduleforlater") {
        body["c_schedule_date"] = scheduleTime?.date?.split("T")?.at(0);
        body["c_schedule_Time"] = scheduleTime?.time;
      }

      CreateStoryFn(body);

      if (val === "published") {
        SendNotificationFn(body.story_published_options);

        //   const emailBody = {
        //     story_title_name : body.story_title_name,
        //     story_sub_title_name : body.story_sub_title_name,
        //     story_cover_image_url : body.story_cover_image_url,
        //     story_desk_created_name : body.story_desk_created_name,
        //     c_url: "http://localhost:3001/"

        //   }
        //  sendEmailNotification(emailBody)
      }
      setLoader(true);
    }
  };

  const sendEmailNotification = (emailBody) => {
    let mailData = {
      from: "no-reply@datasense.in",
      to: `dhilipbeece002@gmail.com`,
      subject: emailBody.story_title_name,
      text: "Latest News",
      html: ``,
    };

    mailData["html"] = `
      <h1>${emailBody.story_title_name}</h1>
      <br/>
      <h4>${emailBody.story_sub_title_name}</h4>
      <br/>
      <br/>
      <img src="${emailBody.story_cover_image_url}" alt="" /> 
      <br/>
      <a href="${emailBody.c_url}/${emailBody.story_desk_created_name}">
      <button> view more</button>
      </a>
      </br>
      <h5><b>Thank You for subscribe, </b> <br /> News Tamil 24 X 7</h5>
    `;

    // const result = emailSend(mailData);
  };
  const SendNotificationFn = async (publishedOption) => {
    

    var catArr = [];
    checkedCat.map((list, index) => catArr.push(list.c_category_id));

    if (Array.isArray(publishedOption) && publishedOption?.length > 0) {
      publishedOption.map(async (item) => {
        if (item.c_opt_id === "bbc67146594c" && item.opt_check === 1) {
          const body = {
            title: inputs?.tamil_title,
            message: inputs?.sub_title,
            icon: image,
            link: `${deskUrl}`,
            c_redirect_id: catArr.toString(),
            c_type: checkDevice(item.c_opt_id),
          };
          const results = await sendNotification(body);
        } else if (item.c_opt_id === "0461890536a5" && item.opt_check === 1) {
          const body = {
            title: inputs?.tamil_title,
            message: inputs?.sub_title,
            icon: image,
            link: `${deskUrl}`,
            c_redirect_id: catArr.toString(),
            c_type: checkDevice(item.c_opt_id),
          };
          const results = await sendNotification(body);
        }
      });
    }
  };

  const getLink = () => {
    if (uploadBtn === "") {
      return "";
    } else if (uploadBtn === "youtube") {
      return inputs?.u_tube_link;
    } else if (uploadBtn === "library") {
      return videoSrc;
    }
  };

  const CreateStoryFn = async (body) => {
    const results = await createNewStoryApi(body);
    if (results?.appStatusCode !== 0) {
      setLoader(false);
      toast.error(results?.error);
    } else {
      setLoader(false);
      toast.success(results?.message);
      const pubArr = [...pubOptions];
      setTimeout(() => {
        pubArr?.map((list) => {
          if (list?.opt_title === "Share news on social media") {
            if (list?.opt_check === 1) {
              ShareFBPost();
            }
          }
        });
      }, 300);
      setTimeout(() => {
        router.push(`/${i18LangStatus}/story`);
      }, 600);
    }
  };

  const handleUpload1 = (e) => {
    if (e) {
      setMediaType("image");
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 5000000) {
        setInputs({ ...inputs, cover_image: fileName });
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "image");
        formData.append("c_image_caption_name", inputs.image_caption);
        ImageUpload(formData);
        setImgLoader(true);
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };

  const videoUpload = (e) => {
    if (e) {
      setMediaType("video");
      let size = e.target?.files[0]?.size;
      let fileName = e.target?.files[0]?.name;
      if (size < 5000000) {
        setInputs({ ...inputs, video: fileName });
        const formData = new FormData();
        formData.append("c_file", e.target?.files[0]);
        formData.append("file_type", "video");
        formData.append("c_image_caption_name", inputs.image_caption);
        VideoUpload(formData);
        setVideoLoader(true);
      } else {
        toast.error("Please upload less than 5mb");
      }
    }
  };
  const DeleteImage = (val) => {
    setDeletePop(true);
    setDeleteValue(val);
  };

  const closePop = () => {
    setDeletePop(false);
    setDeleteValue("");
  };

  const handleDeleteImage = async (val) => {
    setDeletePop(false);
    if (val === "cover") {
      setImgLoader(true);
      const results = await imageDeleteApi({
        c_file: imageCrop.name,
      });
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
        setImgLoader(false);
        setDeletePop(false);
        setDeleteValue("");
      } else {
        toast.success(results?.message);
        setImageCrop({ ...imageCrop, name: "" });
        setInputs({ ...inputs, image_caption: "" });
        setImage("");
        setImgLoader(false);
        setThumbLoader(false);
        setDeletePop(false);
        setDeleteValue("");
      }
    } else if (val === "thumb") {
      setThumbLoader(true);
      const results = await imageDeleteApi({
        c_file: thumb.name,
      });
      if (results?.appStatusCode !== 0) {
        toast.error(results?.error);
        setThumbLoader(false);
        setDeletePop(false);
        setDeleteValue("");
      } else {
        toast.success(results?.message);
        setThumb({ name: "", loader: false, image: "" });
        setThumbLoader(false);
        setDeletePop(false);
        setDeleteValue("");
      }
    }
  };

  const DeleteVideo = async () => {
    const results = await imageDeleteApi({
      c_file: inputs?.video,
    });
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
    } else {
      toast.success(results?.message);
      setInputs({ ...inputs, video: "" });
      setVideoSrc("");
    }
  };

  const ImageUpload = async (body) => {
    
    setImgLoader(true);
    
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      setImgLoader(false);
      toast.error(results?.error);
    } else {
      setImgLoader(false);
      setImage(results?.payloadJson?.c_file_url);
      // setImageCrop({ ...imageCrop, name: results?.payloadJson?.c_file });
    }
  };

  const VideoUpload = async (body) => {
    
    
    const results = await imageUploadApi(body);
    if (results?.appStatusCode !== 0) {
      setVideoLoader(false);
      toast.error(results?.error);
    } else {
      setVideoLoader(false);
      setVideoSrc(results?.payloadJson?.c_file_url);
    }
  };

  const handleAIClick = async () => {
    setAiLoader(true);
    setAiFlag(true);
    OpenAIGeneration("tags");
    setTimeout(() => {
      OpenAIGeneration("keywords");
    }, 200);
    // setTimeout(() => {
    //   OpenAIGeneration("url");
    // }, 200);
  };

  const OpenAIGeneration = async (val) => {
    if (val === "tags") {
      const body = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate 5-7 relevant tags for the following paragraph, separated by commas: ${translated}`,
          },
        ],
      };
      const results = await OpenAIApiForConversion(body);
      if (results) {
        setAiLoader(false);
        const mainWords = results?.choices[0]?.message?.content;
        if (mainWords?.includes("#")) {
          const keywords = mainWords?.split(" ");
          setGeneratedWords(keywords);
        } else if (mainWords?.includes(",")) {
          const keywords = mainWords?.split(",");
          setGeneratedWords(keywords);
        } else if (mainWords?.includes("\n")) {
          const keywords = mainWords?.split("\n");
          setGeneratedWords(keywords);
        }
      } else {
        toast.error("Error in Open AI Tags Generation");
      }
      
    } else if (val === "keywords") {
      const body = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Please extract relevant keywords for SEO purposes from the following paragraph,  output should be in comma separated. \n ${translated} 
            `,
          },
        ],
      };
      const results = await OpenAIApiForConversion(body);
      if (results) {
        setAiLoader(false);
        const mainWords = results?.choices[0]?.message?.content;
        setFetchedKeywords(mainWords);
      }
    }
   
  };

  useEffect(() => {
    if (parsedHtml?.length > 10) {
      setTimeout(() => {
        getTranslate("3");
        if (parsedHtml.trim().split(/\s+/)?.length < 75) {
          setInputs({
            ...inputs,
            minutes: 1,
          });
        } else {
          setInputs({
            ...inputs,
            minutes: Math.floor(parsedHtml.trim().split(/\s+/)?.length / 75),
          });
        }
      }, 800);
    } else {
      setInputs({
        ...inputs,
        minutes: 1,
      });
    }
    if (parsedHtml?.length === 0) {
      setGeneratedWords([]);
      setFetchedKeywords("");
      // setDeskUrl("");
    }
  }, [parsedHtml]);

  const handleDeleteKey = (optionToDelete) => {
    setGeneratedWords((prevOptions) =>
      prevOptions?.filter((option) => option !== optionToDelete)
    );
  };

  const handleCheckboxChange = (e, id) => {
    const arr = [...pubOptions];
    if (e.target.checked) {
      arr.map((list) => {
        if (list.c_opt_id === id?.c_opt_id) {
          id.opt_check = 1;
        }
      });
      setPubOptions(arr);
    } else {
      arr.map((list) => {
        if (list.c_opt_id === id?.c_opt_id) {
          id.opt_check = 0;
        }
      });
      setPubOptions(arr);
    }
    // setCheckedItems((prevState) => ({
    //   ...prevState,
    //   []: !prevState[id],
    // }));
  };

  const handleSchedule = () => {
    let errorArr = [];
    Object.keys(inputs).map((val) => {
      if (val === "tamil_title") {
        inputs[val]?.length < 3 && errorArr.push(val);
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
      } else if (val === "main_category") {
        inputs[val] === "" && errorArr.push(val);
      }
    });
    joditContent?.length < 10 && errorArr.push("story_details");
    setErrors(errorArr);
    if (errorArr.length === 0) {
      setSchedulePop(true);
    }
  };

  const handleScheduleClose = () => {
    setSchedulePop(close);
  };

  useEffect(() => {
    if (inputs.english_title !== "") {
      const urlString = inputs.english_title.replace(/[^\w\s]|_/g, "");
      const url = slugify(urlString, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      });

      const deskCreatedURL = `${inputs?.cat_name}/${url}`;
      setDeskUrl(deskCreatedURL.toLowerCase());

      // if(inputs.rat_name !== ""){
      //  const  deskCreatedURL = `${inputs?.cat_name}/${inputs?.rat_name}/${url}`;
      //  setDeskUrl(deskCreatedURL.toLowerCase());
      // }else{
      //   const deskCreatedURL = `${inputs?.cat_name}/${url}`;
      //   setDeskUrl(deskCreatedURL.toLowerCase());
      // }
    }
  }, [inputs.english_title, checkedCat]);

  // ****************************************************************
  // image function start

  const handleUpload = async (e) => {
    setImgLoader(true);
    if (convertedFile !== null) {
      const formData = new FormData();
      formData.append("c_file", convertedFile);
      formData.append("file_type", "image");
      formData.append("c_image_caption_name", inputs.image_caption);

      // const headers = {
      //   "Content-Type": "multipart/form-data",
      //   accept: "application/json",
      // };
      const headers = {
        'Content-Type': 'application/json'
      };

      let results = await imageUploadApi(formData, headers);

      if (results?.appStatusCode !== 0) {
        setImgLoader(false);
        toast.error(results?.error);
      } else {
        setImgLoader(false);

        setImage(results?.payloadJson?.c_file_url);
        setImageCrop({ ...imageCrop, name: results?.payloadJson?.c_file });
        setInputs({ ...inputs, image_caption: e?.name?.split(".")?.at(0) });
        setImageFileName(results?.payloadJson?.c_file);
      }
    }
  };


 

  const getExtension = (type) => {
    if (
      type !== "png" &&
      type !== "jpg" &&
      type !== "jpeg" &&
      type !== "webp"
    ) {
      return true;
    } else return false;
  };

  const handleSelectImage = (event) => {
    // setError({ ...error, sizeErr: false, extensionErr: false });
    setErrors([]);
    var file = event.target.files[0];
    var fileSize = file.size;
    var extension = getExtension(file.type.split("/").at(-1).toLowerCase());
    if (fileSize > 5000000) {
      // setError({ ...error, sizeErr: "Please upload less than 5MB" });
    } else if (extension) {
      // setError({ ...error, extensionErr: "Please upload valid Type" });
    } else {
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        

        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxWidth = 1400; // Set your desired max width
            const maxHeight = 600; // Set your desired max height
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                setProfilePreview({
                  file: blob,
                  imagePreviewUrl: reader.result,
                });
              },
              "image/jpeg",
              0.7
            );
          };
        };

        reader.readAsDataURL(file);
      }
    }
    event.target.value = "";
  };



  useEffect(() => {
    if (profilePreview.imagePreviewUrl !== "") {
      if (addMemberInputs.c_image_url == "") {
        setImageCropper(true);
      }
    }
  }, [profilePreview]);

  useEffect(() => {
    if (convertedFile) {
      handleUpload(imageFile);
      setLoadFlag(true);
    }
  }, [convertedFile]);

  useEffect(() => {
    if (croppedImage !== null) {
      async function convertBlobToBlobURL(croppedImage) {
        const response = await fetch(croppedImage);
        const blobData = await response.blob();
        return blobData;
      }

      async function blobToFile(blob, filename) {
        const blobData = await convertBlobToBlobURL(blob);
        const file = new File([blobData], filename, { type: blobData.type });
        return file;
      }

      const outputFileName = "converted_file.png";

      blobToFile(croppedImage, outputFileName)
        .then((file) => {
          setConvertedFile(file);
        })
        .catch((error) => {
          console.error("Error converting blob to file:", error);
        });
    }
  }, [croppedImage]);

  // image function stop
  // ****************************************************************

  const ShareFBPost = async () => {
    try {
      const res = await sharePostOnFb(
        inputs?.tamil_title,
        `${process.env.NEXT_PUBLIC_BASE_URL}article/${deskUrl?.toLowerCase()}`
      );
      toast.success(res);
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  };

  useEffect(() => {
   
    if (inputs.country) {
      const body = {
        country_id: inputs.country,
      };
      GetStateList(body);
    }
  }, [inputs.country]);

  // citycall

  useEffect(() => {
    if (inputs.state && inputs?.country) {
      const body = {
        country_id: inputs?.country,
        state_id: inputs?.state,
      };
      GetCityList(body);
    }
  }, [inputs.state]);

  useEffect(() => {
    if (initStateFlag && inputs?.country !== "" && inputs?.state !== "") {
      const body = {
        country_id: inputs?.country,
        state_id: inputs?.state,
      };
      GetCityList(body);
    }
  }, [initStateFlag]);

  // useEffect(() => {
  //   setInputs({ ...inputs, state: stateArr[0]?.state_id });
  // }, [stateArr]);



  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result.split(',')[1]; // Get base64 string without metadata

      const response = await fetch('/api/v1/admin/watermark/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64data }),
      });

      const result = await response.json();
    };
    reader.readAsDataURL(file);
  };

  return (
    <Fragment>
      <Container
        fluid
        style={
          loader || aiLoader
            ? { pointerEvents: "none", opacity: 0.3 }
            : { pointerEvents: "", opacity: 1 }
        }
      >
        <Col sm="12" className="mt-2">
          <Card>
            <CardBody>
              <BasicDetails
                inputs={inputs}
                handleChange={handleChange}
                handleBlur={handleBlur}
                categoryArr={categoryArr}
                secondaryCategoryArr={secondaryCategoryArr}
                countryArr={countryArr}
                stateArr={stateArr}
                cityArr={cityArr}
                userArr={userArr}
                authorArr={authorArr}
                errors={errors}
                handleRegionChange={handleRegionChange}
                handleCategoryChange={handleCategoryChange}
                handleCheckCat={handleCheckCat}
                checkedCat={checkedCat}
                // initValue={initValue}
              />
            </CardBody>
          </Card>
        </Col>

        <Col sm="12">
          <Card>
            <CommonCardHeader title={"Media Details"} />
            <CardBody>
              <MediaDetails
                handleUpload={handleUpload}
                videoUpload={videoUpload}
                fileName={imageCrop?.name}
                videoName={inputs?.video}
                handleDelete={() => DeleteImage("cover")}
                handleDeleteVideo={() => DeleteVideo()}
                image={image}
                imageLoader={imageLoader}
                videoLoader={videoLoader}
                videoSrc={videoSrc}
                errors={errors}
                handleChange={handleChange}
                uploadBtn={uploadBtn}
                handleUploadForCrop={handleUploadForCrop}
                handleSelectImage={handleSelectImage}
                setUploadBtn={setUploadBtn}
                realCrop={realCrop}
                handleToggleOption={handleToggleOption}
                openOption={openOption}
                handleOpenGallery={handleOpenGallery}
                openGallery={openGallery}
                closeGallery={() => setOpenGallery(false)}
                mediaImg={mediaImg}
                handleAddImage={handleAddImage}
                DeleteImageGallery={DeleteImageGallery}
                inputs={inputs}
                thumbOption={thumbOption}
                handleThumbToggleOption={handleThumbToggleOption}
                handleSelectThumbImage={handleSelectThumbImage}
                thumbLoader={thumbLoader}
                thumbName={thumb.name}
                thumbImage={thumb.image}
                handleDeleteThumb={() => DeleteImage("thumb")}
                lastElementRef={lastElementRef}
                hasMore={hasMore}
                setHasMore={setHasMore}
                mediaImgCount={mediaImgCount}
              />
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CommonCardHeader title={"Story Details"} />
            <CardBody>
              {" "}
              {/* <TextEditor
                editorState={editorState}
                handleEditorChange={handleEditorChange}
                saveContent={saveContent}
                inputs={inputs}
                handleSubEditorChange={handleSubEditorChange}
                handleChange={handleChange}
                errors={errors}
                GenerateKeyWords={handleAIClick}
                aiFlag={aiFlag}
                translatorLoader={translatorLoader}
              /> */}
              <JoditTextEditer
                handleChangeJodit={handleChangeJodit}
                handleSubEditorChange={handleSubEditorChange}
                content={joditContent}
                inputs={inputs}
                handleChange={handleChange}
                errors={errors}
                contentPage="static"
              />
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CommonCardHeader title={"SEO Details"} />
            <CardBody>
              <SeoDetails
                inputs={inputs}
                handleChange={handleChange}
                authorBlock={authorBlock}
                handleCheckAuthor={handleCheckAuthor}
                credit={credit}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
                handleCreditChange={handleCreditChange}
                errors={errors}
                handleChangeTag={handleChangeTag}
                selectedOptions={generatedWords}
                setSelectedOptions={setGeneratedWords}
                handleDelete={handleDeleteKey}
                deskUrl={deskUrl}
                fetchedKeywords={fetchedKeywords}
                pass="create"
              />
            </CardBody>
          </Card>
        </Col>

        <Col sm="12">
          <Card>
            <CommonCardHeader title={"Question & Answer Section"} />
            <CardBody>
              <StoryAskedDetails
                inputs={inputs}
                handleChange={handleChange}
                authorBlock={authorBlock}
                handleCheckAuthor={handleCheckAuthor}
                askedQue={askedQue}
                handleAddQueAnsField={handleAddQueAnsField}
                handleDeleteQueAnsField={handleDeleteQueAnsField}
                handleAskedQueChange={handleAskedQueChange}
                errors={errors}
                handleChangeTag={handleChangeTag}
                selectedOptions={generatedWords}
                setSelectedOptions={setGeneratedWords}
                handleDelete={handleDeleteKey}
                deskUrl={deskUrl}
                fetchedKeywords={fetchedKeywords}
              />
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CommonCardHeader title={"Quotes & Author Section"} />
            <CardBody>
              <QuotesAuthorDetails
                inputs={inputs}
                handleChange={handleChange}
                authorBlock={authorBlock}
                handleCheckAuthor={handleCheckAuthor}
                askedQue={askedQue}
                handleAddQueAnsField={handleAddQueAnsField}
                handleDeleteQueAnsField={handleDeleteQueAnsField}
                handleAskedQueChange={handleAskedQueChange}
                errors={errors}
                handleChangeTag={handleChangeTag}
                selectedOptions={generatedWords}
                setSelectedOptions={setGeneratedWords}
                handleDelete={handleDeleteKey}
                deskUrl={deskUrl}
                fetchedKeywords={fetchedKeywords}
              />
            </CardBody>
          </Card>
        </Col>

        <Col sm="12">
          <Card>
            <CommonCardHeader title={"Blurb Section"} />
            <CardBody>
              <BlurbDetails
                inputs={inputs}
                handleChange={handleChange}
                authorBlock={authorBlock}
                handleCheckAuthor={handleCheckAuthor}
                askedQue={askedQue}
                handleAddQueAnsField={handleAddQueAnsField}
                handleDeleteQueAnsField={handleDeleteQueAnsField}
                handleAskedQueChange={handleAskedQueChange}
                errors={errors}
                handleChangeTag={handleChangeTag}
                selectedOptions={generatedWords}
                setSelectedOptions={setGeneratedWords}
                handleDelete={handleDeleteKey}
                deskUrl={deskUrl}
                fetchedKeywords={fetchedKeywords}
              />
            </CardBody>
          </Card>
        </Col>

        <Col sm="12">
          <Card>
            <CommonCardHeader title={"Publish Options"} />
            <CardBody>
              <PublishDetails
                handleChecked={handleCheckboxChange}
                List={pubOptions}
                checkedItems={checkedItems}
              />
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <Box display={"flex"} gap={4}>
            <Button
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                textTransform: "capitalize",
                letterSpacing: "1px",
              }}
              onClick={() => handleAddStory("save")}
            >
              Draft
            </Button>
            {/* <Button
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                textTransform: "capitalize",
                letterSpacing: "1px",
              }}
              onClick={() => handleSchedule("")}
            >
              Schedule for later
            </Button> */}
            <Button
              variant={role_id === "9386b7e94c7e" ? "contained" : "outlined"}
              sx={
                role_id === "9386b7e94c7e"
                  ? {
                      color: "#fff",
                      textTransform: "capitalize",
                      letterSpacing: "1px",
                    }
                  : {
                      bgcolor: "#fff",
                      textTransform: "capitalize",
                      letterSpacing: "1px",
                    }
              }
              onClick={() => handleAddStory("submitforreview")}
            >
              Submit for Review
            </Button>
            <Button
              variant="contained"
              sx={
                role_id === "9386b7e94c7e"
                  ? {
                      color: "#fff",
                      textTransform: "capitalize",
                      letterSpacing: "1px",
                      display: "none",
                    }
                  : {
                      color: "#fff",
                      textTransform: "capitalize",
                      letterSpacing: "1px",
                    }
              }
              onClick={() => handleAddStory("published")}
            >
              Publish Now
            </Button>
          </Box>
        </Col>
      </Container>
      <SchedulePop
        open={schedulePop}
        close={() => handleScheduleClose()}
        setScheduleTime={setScheduleTime}
        scheduleTime={scheduleTime}
        handleAddStory={() => handleAddStory("scheduleforlater")}
      />
      <ImageCropp
        imageCropper={imageCropper}
        setImageCropper={setImageCropper}
        imageURL={profilePreview.imagePreviewUrl}
        croppedImage={croppedImage}
        setCroppedImage={setCroppedImage}
        setConvertedFile={setConvertedFile}
        setProfilePreview={setProfilePreview}
        setImgLoader={setImgLoader}
      />
      <ImageThumbCrop
        imageCropper={thumbCropper}
        setImageCropper={setThumbCropper}
        imageURL={thumbPreview.imagePreviewUrl}
        croppedImage={croppedThumb}
        setCroppedImage={setCroppedThumb}
        setConvertedFile={setConvertedThumbFile}
        setProfilePreview={setThumbPreview}
        setImgLoader={setThumbLoader}
      />
      <DeletePopup
        open={deletePop}
        handleDeleteImage={() => handleDeleteImage(deleteValue)}
        close={closePop}
      />
          {/* <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form> */}
    </Fragment>
  );
};

export default CreateStoryPageContainer;
