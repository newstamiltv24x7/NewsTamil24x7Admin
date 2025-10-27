"use client";

import React, { Suspense } from "react";
import Loading from "./loading";
import CreatePhotosPage from "@/Components/Photos/CreatePhotosPage";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CreatePhotosPage />
    </Suspense>
  );
};

export default page;
