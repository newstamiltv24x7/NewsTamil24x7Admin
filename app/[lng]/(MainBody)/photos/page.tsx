"use client";

import React, { Suspense } from "react";
import Loading from "./loading";
import PhotosPageContainer from "@/Components/Photos/PhotosPageContainer";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PhotosPageContainer />
    </Suspense>
  );
};

export default page;
