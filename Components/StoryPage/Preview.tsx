import { getParticularStoryApi } from "@/apiFunctions/ApiAction";
import { Box, Container } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Label, Spinner } from "reactstrap";
import { MdAccessTime } from "react-icons/md";
import Image from "next/image";

const Preview = () => {
  const [previewData, setPreviewData] = useState<any>([]);
  const [imgTag, setImgTag] = useState<any>(null);
  const [remainingContent, setRemainingContent] = useState<any>(null);
  const [loader, setLoader] = useState(false);

  const GetPreviewData = async () => {
    const getId = window.location.pathname?.split("/")?.at(-1);
    const results = await getParticularStoryApi(getId);
    if (results?.appStatusCode !== 0) {
      toast.error(results?.error);
      setLoader(false);
    } else {
      setLoader(false);
      setPreviewData(results?.payloadJson);
    }
  };

  useEffect(() => {
    GetPreviewData();
    setLoader(true);
  }, []);

  useEffect(() => {
    if (previewData?.story_details) {
      const htmlString = previewData?.story_details;

      const tempElement = document.createElement("div");
      tempElement.innerHTML = htmlString;

      const imgTag: any = tempElement.querySelector("img");

      if (imgTag) {
        imgTag.parentNode.removeChild(imgTag);
        imgTag.style.height = "70%";
        imgTag.style.width = "70%";
        setImgTag(imgTag.outerHTML);
      }
      setRemainingContent(tempElement.innerHTML);
    }
  }, [previewData?.story_details]);

  return (
    <Container>
      {loader ? (
        <Box display={"grid"} minHeight={"100vh"} sx={{ placeItems: "center" }}>
          <Spinner />
        </Box>
      ) : (
        <Fragment>
          {previewData && (
            <div className="preview my-5">
              <Box className="category-wrapper">
                <Label>{"Category"}</Label>
              </Box>
              <Box my={3}>
                <h4>{previewData?.story_title_name}</h4>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                gap={8}
              >
                <h6 className="createdBy">
                  By <span>Admin</span>
                </h6>
                <p className="mb-0 createdAt">
                  <MdAccessTime />
                  <span>{`${previewData?.updatedAt
                    ?.split("T")
                    ?.at(0)} ${previewData?.updatedAt
                    ?.split("T")
                    ?.at(1)
                    ?.split(".")
                    ?.at(0)}`}</span>
                </p>
              </Box>

              <Box my={2}>
                {
                  <>
                    {previewData?.story_cover_image_url && (
                      <Image
                        src={previewData?.story_cover_image_url}
                        alt=""
                        width={750}
                        height={420}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <div
                      dangerouslySetInnerHTML={{ __html: imgTag }}
                      style={{ paddingTop: "60px" }}
                    ></div>
                    <div
                      dangerouslySetInnerHTML={{ __html: remainingContent }}
                      style={{ paddingTop: "30px" }}
                    ></div>
                  </>
                }
              </Box>
              <Box
                display="flex"
                align-items="center"
                gap="15px"
                width="70%"
                flexWrap={"wrap"}
                mt={4}
              >
                <Box
                  width={"fit-content"}
                  height={"fit-content"}
                  color={"#fff"}
                  bgcolor={"#1c1c1c"}
                  fontWeight={600}
                  letterSpacing={1}
                  p={0.5}
                >
                  Tags:
                </Box>
                {previewData?.seo_tag?.map((item: string, index: number) => (
                  <Fragment key={index}>
                    <Box
                      width={"fit-content"}
                      height={"fit-content"}
                      border={"1px solid #1c1c1c"}
                      fontWeight={500}
                      letterSpacing={1}
                      display={"inline"}
                      p={0.5}
                    >
                      {item?.replaceAll(" ", "")}
                    </Box>
                  </Fragment>
                ))}
              </Box>
            </div>
          )}
        </Fragment>
      )}
    </Container>
  );
};

export default Preview;
