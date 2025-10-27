"use client";

import dynamic from "next/dynamic";

const AdsContainer = dynamic(
  () => import("@/Components/Advertisement/AdsContainer")
);

function page() {
  return <AdsContainer />;
}

export default page;
