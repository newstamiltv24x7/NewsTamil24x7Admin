"use client";

import dynamic from "next/dynamic";

const EditAdContainer = dynamic(
  () => import("@/Components/Advertisement/Edit/EditAdContainer")
);

function page() {
  return <EditAdContainer />;
}

export default page;
