"use client";

import CreateListiclePage from "@/Components/Listicles/CreateListiclePage";
import React, { Suspense } from "react";
import Loading from "./loading";

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CreateListiclePage type={"Edit Page"} />
    </Suspense>
  );
};

export default page;
