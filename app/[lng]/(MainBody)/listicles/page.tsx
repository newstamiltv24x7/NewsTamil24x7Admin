"use client";

import ListiclesPageContainer from "@/Components/Listicles/ListiclesPageContainer";
import React, { Suspense } from "react";
import Loading from "./loading";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ListiclesPageContainer />
    </Suspense>
  );
};

export default page;
