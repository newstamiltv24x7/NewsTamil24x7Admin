"use client";

import dynamic from "next/dynamic";

const CreateAdContainer = dynamic(
  () => import("@/Components/Advertisement/Create/CreateAdContainer")
);

function page() {
  return <CreateAdContainer />;
}

export default page;
